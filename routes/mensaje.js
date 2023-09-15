const express = require('express');
const db = require('../db/conn');
const app = express.Router();
const requireAuth = require('../middlewares/requireAuth');


app.post('/', [requireAuth], async (req, res) => {
    const { tipo_mensaje_id, usuario_id, cita_id, contenido } = req.body;

    if (!tipo_mensaje_id || !usuario_id || !cita_id || !contenido) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    try {
        await db.none('INSERT INTO tbl_mensajes (tipo_mensaje_id, usuario_id, cita_id, contenido) VALUES ($1, $2, $3, $4)',
            [tipo_mensaje_id, usuario_id, cita_id, contenido]);

        res.status(201).json({ message: 'Mensaje creado exitosamente' });
    } catch (err) {
        console.error({ ERROR: err, RUTA: '/mensajes', METODO: 'POST' });
        res.status(500).json({ message: 'Error al crear el mensaje' });
    }
});


app.get('/', [requireAuth], async (req, res) => {
    try {
        const mensajes = await db.manyOrNone('SELECT * FROM tbl_mensajes WHERE estado = true');
        res.status(200).json(mensajes);
    } catch (err) {
        console.error({ ERROR: err, RUTA: '/mensajes', METODO: 'GET' });
        res.status(500).json({ message: 'Error al obtener los mensajes' });
    }
});


app.get('/:id', [requireAuth], async (req, res) => {
    const { id } = req.params;

    try {
        const mensaje = await db.oneOrNone('SELECT * FROM tbl_mensajes WHERE id = $1 AND estado = true', [id]);
        
        if (!mensaje) {
            return res.status(404).json({ message: 'Mensaje no encontrado' });
        }

        res.status(200).json(mensaje);
    } catch (err) {
        console.error({ ERROR: err, RUTA: `/mensajes/${id}`, METODO: 'GET' });
        res.status(500).json({ message: 'Error al obtener el mensaje' });
    }
});


app.put('/:id', [requireAuth], async (req, res) => {
    const { id } = req.params;
    const { tipo_mensaje_id, usuario_id, cita_id, contenido } = req.body;

    if (!tipo_mensaje_id || !usuario_id || !cita_id || !contenido) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    try {
        const updated = await db.result('UPDATE tbl_mensajes SET tipo_mensaje_id = $1, usuario_id = $2, cita_id = $3, contenido = $4 WHERE id = $5 AND estado = true',
            [tipo_mensaje_id, usuario_id, cita_id, contenido, id]);

        if (updated.rowCount === 0) {
            return res.status(404).json({ message: 'Mensaje no encontrado o no está activo' });
        }

        res.status(200).json({ message: 'Mensaje actualizado exitosamente' });
    } catch (err) {
        console.error({ ERROR: err, RUTA: `/mensajes/${id}`, METODO: 'PUT' });
        res.status(500).json({ message: 'Error al actualizar el mensaje' });
    }
});


app.delete('/:id', [requireAuth], async (req, res) => {
    const { id } = req.params;

    try {
        const updated = await db.result('UPDATE tbl_mensajes SET estado = false, fecha_borrado = CURRENT_TIMESTAMP WHERE id = $1', [id]);

        if (updated.rowCount === 0) {
            return res.status(404).json({ message: 'Mensaje no encontrado' });
        }

        res.status(200).json({ message: 'Mensaje marcado como inactivo exitosamente' });
    } catch (err) {
        console.error({ ERROR: err, RUTA: `/mensajes/${id}`, METODO: 'DELETE' });
        res.status(500).json({ message: 'Error al marcar el mensaje como inactivo' });
    }
});




module.exports = app;