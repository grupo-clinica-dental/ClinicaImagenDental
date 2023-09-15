const express = require('express');
const app = express.Router();
const db = require('../db/conn');
const requireAuth = require('../middlewares/requireAuth');

//  la tabla pacientes  con los campos id, nombre, telefono, email, fecha_nacimiento

const correogmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

// Insertar Pacientes

app.post('', [requireAuth], (req, res) => {
    const { nombre, telefono, email, fecha_nacimiento } = req.body;

    let mensajes = [];
    let bandera = true;

    if (!nombre || nombre.trim() === '') {
        bandera = false;
        mensajes.push('Nombre es requerido y no puede estar en blanco');
    }

    if (!email || email.trim() === '' || !correogmail.test(email)) {
        bandera = false;
        mensajes.push('Email es requerido, no puede estar en blanco y debe tener un formato válido');
    }

    if (!fecha_nacimiento || new Date(fecha_nacimiento) > new Date()) {
        bandera = false;
        mensajes.push('Fecha de nacimiento es requerida y no puede estar en el futuro');
    }

    let respuestaValidacion = {
        exito: bandera,
        mensaje: mensajes,
        excepcion: "",
        item_paciente: {}
    };

    if (!respuestaValidacion.exito) {
        return res.status(400).json(respuestaValidacion);
    }

    let sql = `SELECT * FROM fn_crear_paciente($1, $2, $3, $4)`;

    db.any(sql, [nombre, telefono, email, fecha_nacimiento])
        .then(data => {
            respuestaValidacion.mensaje.push("Paciente creado exitosamente");
            respuestaValidacion.item_paciente = {
                nombre: data[0].nombre, 
                telefono: data[0].telefono,
                email: data[0].email,
                fecha_nacimiento: data[0].fecha_nacimiento
            };
            res.status(201).json(respuestaValidacion);
        })
        .catch((error) => {
            respuestaValidacion.mensaje.push("Error al crear el paciente");
            respuestaValidacion.excepcion = error.message;
            respuestaValidacion.exito = false;
            res.status(500).json(respuestaValidacion);
        });
});


// Actualizar paciente solo si esta activo

app.put('/:id', [requireAuth], (req, res) => {
    const { id } = req.params;
    const { nombre, telefono, email, fecha_nacimiento } = req.body;

    let mensajes = [];
    let bandera = true;

    if (!nombre || nombre.trim() === '') {
        bandera = false;
        mensajes.push('Nombre es requerido y no puede estar en blanco');
    }

    if (!email || email.trim() === '' || !correogmail.test(email)) {
        bandera = false;
        mensajes.push('Email es requerido, no puede estar en blanco y debe tener un formato válido');
    }

    if (!fecha_nacimiento || new Date(fecha_nacimiento) > new Date()) {
        bandera = false;
        mensajes.push('Fecha de nacimiento es requerida y no puede estar en el futuro');
    }

    let respuestaValidacion = {
        exito: bandera,
        mensaje: mensajes,
        excepcion: "",
        item_paciente: {}
    };

    if (!respuestaValidacion.exito) {
        return res.status(400).json(respuestaValidacion);
    }

    let sql = `SELECT * FROM fn_actualizar_paciente($1, $2, $3, $4, $5)`;

    db.any(sql, [id, nombre, telefono, email, fecha_nacimiento])
        .then(data => {
            if (!data[0].exito) {
                respuestaValidacion.exito = false;
                respuestaValidacion.mensaje.push('Paciente Inactivo');
                return res.status(404).json(respuestaValidacion);
            }
            
            respuestaValidacion.mensaje.push("Paciente actualizado exitosamente");
            res.status(200).json(respuestaValidacion);
        })
        .catch((error) => {
            respuestaValidacion.mensaje.push("Error al actualizar el paciente");
            respuestaValidacion.excepcion = error.message;
            respuestaValidacion.exito = false;
            res.status(500).json(respuestaValidacion);
        });
});


// Optener Todos los pacientes activos

app.get('', [requireAuth], (req, res) => {
    let sql = `SELECT id, nombre, telefono, email,  to_char(fecha_nacimiento, 'yyyy-mm-dd') fecha_nacimiento, estado, fecha_borrado::date fecha_borrado  FROM tbl_pacientes WHERE estado = true`;

    db.any(sql)
        .then(rows => {
            const respuesta = {
                exito: true,
                mensaje: [],
                excepcion: "",
                item_paciente: {}
            };

            if (rows.length === 0 || rows[0].id === null) {
                respuesta.exito = false;
                respuesta.mensaje.push("Sin Datos");
                res.status(404).json(respuesta);
            } else {
                respuesta.mensaje.push("Pacientes obtenidos exitosamente");
                respuesta.item_paciente = rows;  
                res.status(200).json(respuesta);
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({
                exito: false,
                mensaje: ["Error al obtener los pacientes"],
                excepcion: error.message,
                item_paciente: {}
            });
        });
});

//Optener Paciente por id que este activo 

app.get('/:id', [requireAuth], (req, res) => {
    const { id } = req.params;

    let sql = 'SELECT * FROM tbl_pacientes WHERE id = $1 AND estado = true';

    db.any(sql, [id])
        .then(row => {
            const respuesta = {
                exito: true,
                mensaje: [],
                excepcion: "",
                item_paciente: {}
            };

            if (row.length === 0) {
                respuesta.exito = false;
                respuesta.mensaje.push("Paciente no encontrado");
                res.status(404).json(respuesta);
            } else {
                respuesta.mensaje.push("Paciente obtenido exitosamente");
                respuesta.item_paciente = row[0];
                res.status(200).json(respuesta);
            }
        })
        .catch((error) => {
            const respuestaError = {
                exito: false,
                mensaje: ["Error al obtener el paciente"],
                excepcion: error.message,
                item_paciente: {}
            };
            console.error(error);
            res.status(500).json(respuestaError);
        });
});


// Metodo Eliminar que solo desactiva a los pacientes
app.delete('/:id', [requireAuth], (req, res) => {
    const { id } = req.params;

    let sql = `SELECT * FROM fn_desactivar_paciente($1)`;

    db.any(sql, [id])
        .then(data => {
            const respuesta = {
                exito: data[0].exito,
                mensaje: [data[0].mensaje],
                excepcion: "",
                item_paciente: {} 
            };

            if (!data[0].exito) {
                res.status(404).json(respuesta);
            } else {
                res.status(200).json(respuesta);
            }
        })
        .catch((error) => {
            const respuestaError = {
                exito: false,
                mensaje: ["Error al desactivar el paciente"],
                excepcion: error.message,
                item_paciente: {} 
            };
            console.error(error);
            res.status(500).json(respuestaError);
        });
});







module.exports = app;