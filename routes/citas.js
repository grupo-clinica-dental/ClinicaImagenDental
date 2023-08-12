const express = require('express');
const app = express.Router();
const db = require('../db/conn');

// Insertar citas 

app.post('', async (req, res) => {
    let { fecha_hora, doctor_id, paciente_id, estado_id, google_calendar_event_id, ubicacion, descripcion, notas } = req.body;

    // Validaciones

    if (!fecha_hora) {
        return res.status(400).json({message: 'Fecha y hora es requerida '});
    }
    
    if (!doctor_id) {
        return res.status(400).json({message: 'ID del doctor es requerido'});
    }
    
    if (!paciente_id) {
        return res.status(400).json({message: 'ID del paciente es requerido'});
    }
    
    if (!estado_id) {
        return res.status(400).json({message: 'ID del estado es requerido'});
    }
 
    if (!google_calendar_event_id || google_calendar_event_id.trim() === '') {
        google_calendar_event_id = null;
    }

    

    try {
        // Insertamos una nueva cita en la base de datos
        await db.none('INSERT INTO tbl_citas (fecha_hora, doctor_id, paciente_id, estado_id, google_calendar_event_id, ubicacion, descripcion, notas) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [fecha_hora, doctor_id, paciente_id, estado_id, google_calendar_event_id, ubicacion, descripcion, notas]);
    
        // Si la inserción es exitosa, respondemos con un estado 201
        res.status(201).json({message: 'Cita creada'});
    } catch (err) {
        // En caso de error durante la inserción, mostramos el error 
        console.error(err);
        
        // Responde con un código 500 si hubo un error interno en el servidor 
        res.status(500).json({message: 'Error al crear la cita'});
    }
});

// Actualizar citas activas
app.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { fecha_hora, doctor_id, paciente_id, estado_id, google_calendar_event_id, ubicacion, descripcion, notas } = req.body;

    // Validaciones
    if (!fecha_hora ) {
        return res.status(400).json({message: 'Fecha y hora es requerida y no puede estar en el futuro'});
    }

    if (!doctor_id) {
        return res.status(400).json({message: 'ID del doctor es requerido'});
    }

    if (!paciente_id) {
        return res.status(400).json({message: 'ID del paciente es requerido'});
    }

    if (!estado_id) {
        return res.status(400).json({message: 'ID del estado es requerido'});
    }

    if (!google_calendar_event_id || google_calendar_event_id.trim() === '') {
        google_calendar_event_id = null;
    }

    try {
        // Aquí actualizamos una cita en la base de datos
        const updated = await db.result('UPDATE tbl_citas SET fecha_hora = $1, doctor_id = $2, paciente_id = $3, estado_id = $4, google_calendar_event_id = $5, ubicacion = $6, descripcion = $7, notas = $8 WHERE id = $9 AND estado = true', [fecha_hora, doctor_id, paciente_id, estado_id, google_calendar_event_id, ubicacion, descripcion, notas, id]);
        
        if (updated.rowCount === 0) {
            return res.status(404).json({message: 'Cita Inactiva o no encontrada'});
        }

        res.status(200).json({message: 'Cita actualizada'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Error al actualizar la cita'});
    }
});

// Mostrar citas activas
app.get('', async (req, res) => {
    try {
        // Buscamos todas las citas en la base de datos que estén activas
        const citas = await db.manyOrNone('SELECT * FROM tbl_citas WHERE estado = true');
        
        res.status(200).json(citas);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Error al obtener las citas'});
    }
});

// Mostrar citas por ID que este activa
app.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Buscamos una cita en la base de datos con el ID proporcionado y que esté activa
        const cita = await db.oneOrNone('SELECT * FROM tbl_citas WHERE id = $1 AND estado = true', [id]);
        
        if (!cita) {
            return res.status(404).json({message: 'Cita no encontrada'});
        }
        
        res.status(200).json(cita);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Error al obtener la cita'});
    }
});

// Cambiar cita a inactiva
app.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Desactivamos la cita y registramos la fecha de desactivación
        const updated = await db.result('UPDATE tbl_citas SET estado = false, fecha_borrado = CURRENT_TIMESTAMP WHERE id = $1', [id]);
        
        if (updated.rowCount === 0) {
            return res.status(404).json({message: 'Cita no encontrada'});
        }
        
        res.status(200).json({message: 'Cita desactivada exitosamente'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Error al desactivar la cita'});
    }
});


module.exports = app;