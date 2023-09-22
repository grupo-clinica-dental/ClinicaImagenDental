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
        mensajes: mensajes,  // Cambiado a "mensajes" para mayor claridad
        excepcion: "",
        item_cita: ""
    };

    if (!respuestaValidacion.exito) {
        return res.status(400).json({ message: "Validación fallida", ...respuestaValidacion }); 
    }

    // Validar si la cita ya existe
    const validarSql = `
        SELECT id 
        FROM tbl_citas
        WHERE doctor_id = $1 AND fecha_inicio = $2 AND fecha_fin = $3
    `;
    try {
        const citaExistente = await db.oneOrNone(validarSql, [doctor_id, fecha_inicio, fecha_fin]);
        if (citaExistente) {
            return res.status(400).json({ message: "La cita ya existe", ...respuestaValidacion });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error al validar la cita", excepcion: error.message });
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
        respuestaValidacion.mensajes.push("Cita creada exitosamente");
        respuestaValidacion.item_cita = objetoCreado;

        res.status(201).json({ message: "Cita creada con éxito", ...respuestaValidacion });  
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al crear la cita", excepcion: error.message, ...respuestaValidacion }); 
    }
});




app.put('/:id', [requireAuth], async (req, res) => {
    const { id } = req.params;
    const { fecha_inicio, fecha_fin, doctor_id, paciente_id, estado_id } = req.body;

    let respuestaValidacion = {
        exito: true,
        mensaje: [],
        excepcion: ""
    };

    let sql = `
        UPDATE tbl_citas 
        SET 
            fecha_inicio = COALESCE($1, fecha_inicio),
            fecha_fin = COALESCE($2, fecha_fin),
            doctor_id = COALESCE($3, doctor_id),
            paciente_id = COALESCE($4, paciente_id),
            estado_id = COALESCE($5, estado_id)
        WHERE id = $6
        RETURNING *;
    `;

    try {
        const data = await db.any(sql, [fecha_inicio, fecha_fin, doctor_id, paciente_id, estado_id, id]);

        if (data.length === 0) {
            return res.status(404).json({ message: 'Cita no encontrada' });
        }

        respuestaValidacion.mensaje.push("La cita ha sido actualizada exitosamente");
        res.status(200).json(respuestaValidacion);
    } catch (error) {
        respuestaValidacion.mensaje.push("Error al actualizar la cita");
        respuestaValidacion.excepcion = error.message;
        respuestaValidacion.exito = false;
        res.status(500).json(respuestaValidacion);
    }
});

// ... Otros códigos ...



// Mostrar citas activas
app.get('', [requireAuth], async (req, res) => {
    let sql = `
    SELECT 
    c.*,
    d.id as doctor_id, d.nombre as doctor_nombre, d.color as doctor_color,
    e.id as especialidad_id, e.nombre as especialidad_nombre,
    p.id as paciente_id, p.nombre as paciente_nombre, p.email as paciente_email,  -- Añadir el email aquí
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
                nombre: row.paciente_nombre,
                email: row.paciente_email  // Añadir el email aquí
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

    // Query para actualizar el estado a "inactivo" (estado = false) para la cita
    let sql = `UPDATE tbl_citas SET estado = false WHERE id = $1 RETURNING *`;

    try {
        const data = await db.any(sql, [id]);

        // Si no hay ningún registro actualizado, significa que la cita no fue encontrada
        if (data.length === 0) {
            return res.status(404).json({ message: 'Cita no encontrada' });
        }

        respuestaValidacion.mensaje.push("La cita ha sido desactivada exitosamente");
        res.status(200).json(respuestaValidacion);
    } catch (error) {
        respuestaValidacion.mensaje.push("Error al desactivar la cita");
        respuestaValidacion.excepcion = error.message;
        respuestaValidacion.exito = false;
        res.status(500).json(respuestaValidacion);
    }
});


module.exports = app;