const express = require('express');
const app = express.Router();
const db = require('../db/conn');

//  la tabla pacientes  con los campos id, nombre, telefono, email, fecha_nacimiento

const correogmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

// Insertar Pacientes

app.post('', (req, res) => {
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

app.put('/:id', (req, res) => {
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

app.get('/', async (req, res) => {
    try {
        const pacientes = await db.manyOrNone('SELECT * FROM tbl_pacientes WHERE estado = true');
        res.status(200).json(pacientes);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Error al obtener los pacientes'});
    }
});

//Optener Paciente por id que este activo 

app.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const paciente = await db.oneOrNone('SELECT * FROM tbl_pacientes WHERE id = $1 AND estado = true', [id]);
        if (!paciente) {
            return res.status(404).json({message: 'Paciente no encontrado'});
        }
        res.status(200).json(paciente);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Error al obtener el paciente'});
    }
});

// Metodo Eliminar que solo desactiva a los pacientes
app.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updated = await db.result('UPDATE tbl_pacientes SET estado = false, fecha_borrado = CURRENT_TIMESTAMP WHERE id = $1', [id]);
        if (updated.rowCount === 0) {
            return res.status(404).json({message: 'Paciente no encontrado'});
        }
        res.status(200).json({message: 'Paciente desactivado exitosamente'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Error al desactivar el paciente'});
    }
});







module.exports = app;