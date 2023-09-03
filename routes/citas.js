const express = require('express');
const app = express.Router();
const db = require ('../db/conn');

// Insertar citas 

app.post('', async (req, res) => {
    const { fecha_hora, doctor_id, paciente_id, estado_id, google_calendar_event_id, ubicacion, descripcion, notas } = req.body;

    let mensajes = [];
    let bandera = true;

    if (!fecha_hora) {
        bandera = false;
        mensajes.push('Fecha y hora es requerida');
    }
    
    if (!doctor_id) {
        bandera = false;
        mensajes.push('ID del doctor es requerido');
    }
    
    if (!paciente_id) {
        bandera = false;
        mensajes.push('ID del paciente es requerido');
    }
    
    if (!estado_id) {
        bandera = false;
        mensajes.push('ID del estado es requerido');
    }

    if (!google_calendar_event_id || google_calendar_event_id.trim() === '') {
        google_calendar_event_id = null;
    }

    let respuestaValidacion = {
        exito: bandera,
        mensaje: mensajes,
        excepcion: "",
        item_cita: ""
    };

    if (!respuestaValidacion.exito) {
        return res.status(400).json(respuestaValidacion); 
    }

    let sql = `SELECT * FROM fn_crear_cita($1, $2, $3, $4, $5, $6, $7, $8)`;

    try {
        const data = await db.any(sql, [fecha_hora, doctor_id, paciente_id, estado_id, google_calendar_event_id, ubicacion, descripcion, notas]);

        const objetoCreado = {
            fecha_hora: data[0].fecha_hora, 
            doctor_id: data[0].doctor_id,
            paciente_id: data[0].paciente_id,
            
        };
        respuestaValidacion.mensaje.push("Cita creada exitosamente");
        respuestaValidacion.item_cita = objetoCreado;

        res.status(201).json(respuestaValidacion);  
    } catch (error) {
        respuestaValidacion.mensaje.push("Error al crear la cita");
        respuestaValidacion.excepcion = error.message;
        respuestaValidacion.exito = false;
        res.status(500).json(respuestaValidacion); 
    }
});

// Actualizar citas activas
app.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { fecha_hora, doctor_id, paciente_id, estado_id, google_calendar_event_id, ubicacion, descripcion, notas } = req.body;

    let mensajes = [];
    let bandera = true;

    if (!fecha_hora ) {
        bandera = false;
        mensajes.push('Fecha y hora es requerida y no puede estar en el futuro');
    }

    if (!doctor_id) {
        bandera = false;
        mensajes.push('ID del doctor es requerido');
    }

    if (!paciente_id) {
        bandera = false;
        mensajes.push('ID del paciente es requerido');
    }

    if (!estado_id) {
        bandera = false;
        mensajes.push('ID del estado es requerido');
    }

    if (!google_calendar_event_id || google_calendar_event_id.trim() === '') {
        google_calendar_event_id = null;
    }

    let respuestaValidacion = {
        exito: bandera,
        mensaje: mensajes,
        excepcion: "",
    };

    if (!respuestaValidacion.exito) {
        return res.status(400).json(respuestaValidacion);
    }

    let sql = `SELECT * FROM fn_actualizar_cita($1, $2, $3, $4, $5, $6, $7, $8, $9)`;

    try {
        const data = await db.any(sql, [id, fecha_hora, doctor_id, paciente_id, estado_id, google_calendar_event_id, ubicacion, descripcion, notas]);

        if (!data[0].exito) {
            return res.status(404).json({message: 'Cita Inactiva o no encontrada'});
        }

        respuestaValidacion.mensaje.push("Cita actualizada exitosamente");
        res.status(200).json(respuestaValidacion);  
    } catch (error) {
        respuestaValidacion.mensaje.push("Error al actualizar la cita");
        respuestaValidacion.excepcion = error.message;
        respuestaValidacion.exito = false;
        res.status(500).json(respuestaValidacion); 
    }
});

// Mostrar citas activas
app.get('', (req, res) => {
    let sql = `SELECT * FROM tbl_citas WHERE estado = true`;

    db.any(sql)
        .then(rows => {
            const respuesta = {
                exito: true,
                mensaje: [],
                excepcion: "",
                item_cita: {}
            };

            if (rows.length === 0 || rows[0].id === null) {
                respuesta.exito = false;
                respuesta.mensaje.push("Sin Datos");
                res.status(404).json(respuesta);
            } else {
                respuesta.mensaje.push("Citas obtenidas exitosamente");
                respuesta.item_cita = rows;  
                res.status(200).json(respuesta);
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({
                exito: false,
                mensaje: ["Error al obtener las citas"],
                excepcion: error.message,
                item_cita: {}
            });
        });
});

// Mostrar citas por ID que este activa
app.get('/:id', (req, res) => {
    const { id } = req.params;
    let sql = `SELECT * FROM tbl_citas WHERE id = $1 AND estado = true`;

    db.any(sql, [id])
        .then(rows => {
            const respuesta = {
                exito: true,
                mensaje: [],
                excepcion: "",
                item_cita: {}
            };

            if (rows.length === 0 || rows[0].id === null) {
                respuesta.exito = false;
                respuesta.mensaje.push("Cita no encontrada");
                res.status(404).json(respuesta);
            } else {
                respuesta.mensaje.push("Cita obtenida exitosamente");
                respuesta.item_cita = rows[0];  
                res.status(200).json(respuesta);
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({
                exito: false,
                mensaje: ["Error al obtener la cita"],
                excepcion: error.message,
                item_cita: {}
            });
        });
});

// Cambiar cita a inactiva
app.delete('/:id', async (req, res) => {
    const { id } = req.params;

    let respuestaValidacion = {
        exito: true,
        mensaje: [],
        excepcion: ""
    };

    let sql = `SELECT * FROM fn_desactivar_cita($1)`;

    try {
        const data = await db.any(sql, [id]);

        if (!data[0].exito) {
            return res.status(404).json({message: 'Cita no encontrada'});
        }

        respuestaValidacion.mensaje.push("Cita desactivada exitosamente");
        res.status(200).json(respuestaValidacion);
    } catch (error) {
        respuestaValidacion.mensaje.push("Error al desactivar la cita");
        respuestaValidacion.excepcion = error.message;
        respuestaValidacion.exito = false;
        res.status(500).json(respuestaValidacion);
    }
});


module.exports = app;