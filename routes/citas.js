const express = require('express');
const app = express.Router();
const db = require ('../db/conn');
const requireAuth = require('../middlewares/requireAuth');

// Insertar citas 



app.post('', [requireAuth], async (req, res) => {
    const { fecha_inicio, fecha_fin, doctor_id, paciente_id, estado_id } = req.body;

    console.log(req.body)

    let mensajes = [];
    let bandera = true;

    if (!fecha_inicio) {
        bandera = false;
        mensajes.push('Fecha de inicio es requerida');
    }

    if (!fecha_fin) {
        bandera = false;
        mensajes.push('Fecha de fin es requerida');
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

    let respuestaValidacion = {
        exito: bandera,
        mensaje: mensajes,
        excepcion: "",
        item_cita: ""
    };

    if (!respuestaValidacion.exito) {
        return res.status(400).json(respuestaValidacion); 
    }

    let sql = `INSERT INTO tbl_citas (fecha_inicio, fecha_fin, doctor_id, paciente_id, estado_id) VALUES ($1, $2, $3, $4, $5) RETURNING id`;

    try {
        const data = await db.one(sql, [fecha_inicio, fecha_fin, doctor_id, paciente_id, estado_id]);

        const objetoCreado = {
            id: data.id,
            fecha_inicio: fecha_inicio, 
            fecha_fin: fecha_fin,
            doctor_id: doctor_id,
            paciente_id: paciente_id,
            estado_id: estado_id
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
app.put('/:id', [requireAuth],async (req, res) => {
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
app.get('', [requireAuth], async (req, res) => {
    let sql = `
        SELECT 
            c.*,
            d.id as doctor_id, d.nombre as doctor_nombre, d.color as doctor_color,
            e.id as especialidad_id, e.nombre as especialidad_nombre,
            p.id as paciente_id, p.nombre as paciente_nombre,
            es.id as estado_cita_id, es.estado as estado_cita_nombre
        FROM tbl_citas c
        JOIN tbl_doctores d ON c.doctor_id = d.id
        LEFT JOIN tbl_doctor_especialidades de ON d.id = de.doctor_id
        LEFT JOIN tbl_especialidades e ON de.especialidad_id = e.id
        JOIN tbl_pacientes p ON c.paciente_id = p.id
        JOIN tbl_estados_cita es ON c.estado_id = es.id
        WHERE c.estado = true
    `;

    try {
        const rows = await db.any(sql);

        const respuesta = {
            exito: true,
            mensaje: [],
            excepcion: "",
            item_cita: {}
        };

        if (rows.length === 0 || rows[0].id === null) {
            respuesta.exito = false;
            respuesta.mensaje.push("Sin Datos");
            return res.status(404).json(respuesta);
        }

        const citas = rows.map(row => ({
            id: row.id,
            fecha_inicio: row.fecha_inicio,
            fecha_fin: row.fecha_fin,
            doctor: {
                id: row.doctor_id,
                nombre: row.doctor_nombre,
                color: row.doctor_color
            },
            especialidad: {
                id: row.especialidad_id,
                nombre: row.especialidad_nombre
            },
            paciente: {
                id: row.paciente_id,
                nombre: row.paciente_nombre
            },
            estado_cita: {
                id: row.estado_cita_id,
                nombre: row.estado_cita_nombre
            },
            // Añade los otros campos aquí...
        }));


        respuesta.mensaje.push("Citas obtenidas exitosamente");
        respuesta.item_cita = citas;
        res.status(200).json(respuesta);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            exito: false,
            mensaje: ["Error al obtener las citas"],
            excepcion: error.message,
            item_cita: {}
        });
    }
});


// Mostrar citas por ID que este activa
app.get('/:id', [requireAuth],(req, res) => {
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
app.delete('/:id', [requireAuth], async (req, res) => {
    const { id } = req.params;

    let respuestaValidacion = {
        exito: true,
        mensaje: [],
        excepcion: ""
    };

    let sql = `SELECT * FROM fn_delete_doctor_especialidad($1)`;

    try {
        const data = await db.any(sql, [id]);

        if (!data[0].exito) {
            return res.status(404).json({message: 'Doctor Especialidad no encontrado'});
        }

        respuestaValidacion.mensaje.push("Doctor Especialidad eliminado exitosamente");
        res.status(200).json(respuestaValidacion);
    } catch (error) {
        respuestaValidacion.mensaje.push("Error al eliminar el Doctor Especialidad");
        respuestaValidacion.excepcion = error.message;
        respuestaValidacion.exito = false;
        res.status(500).json(respuestaValidacion);
    }
});



module.exports = app;