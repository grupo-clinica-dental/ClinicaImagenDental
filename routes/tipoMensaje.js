const express = require('express');
const db = require('../database/conn');
const app = express.Router();

app.post('/tipos_mensajes', async (req, res) => {
    const { tipo, mensaje_template } = req.body;

    try {
        const newTipoMensaje = await db.one('INSERT INTO tipos_mensajes (tipo, mensaje_template, estado) VALUES ($1, $2, $3) RETURNING id', [tipo, mensaje_template, true]);

        res.status(201).json({ id: newTipoMensaje.id, message: 'Tipo de mensaje creado exitosamente' });
    } catch (err) {
        console.error({ ERROR: err, RUTA: '/tipos_mensajes', METODO: 'POST' });
        res.status(500).json({ message: 'Error al crear el tipo de mensaje' });
    }
});

app.get('/tipos_mensajes', async (req, res) => {
    try {
        const tiposMensajes = await db.manyOrNone('SELECT * FROM tipos_mensajes WHERE estado = true');
        res.status(200).json(tiposMensajes);
    } catch (err) {
        console.error({ ERROR: err, RUTA: '/tipos_mensajes', METODO: 'GET' });
        res.status(500).json({ message: 'Error al obtener los tipos de mensajes' });
    }
});

app.get('/tipos_mensajes/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const tipoMensaje = await db.oneOrNone('SELECT * FROM tipos_mensajes WHERE id = $1 AND estado = true', [id]);

        if (!tipoMensaje) {
            return res.status(404).json({ message: 'Tipo de mensaje no encontrado' });
        }

        res.status(200).json(tipoMensaje);
    } catch (err) {
        console.error({ ERROR: err, RUTA: `/tipos_mensajes/${id}`, METODO: 'GET' });
        res.status(500).json({ message: 'Error al obtener el tipo de mensaje' });
    }
});

app.put('/tipos_mensajes/:id', async (req, res) => {
    const { id } = req.params;
    const { tipo, mensaje_template } = req.body;

    try {
        const updated = await db.result('UPDATE tipos_mensajes SET tipo = $1, mensaje_template = $2 WHERE id = $3 AND estado = true', [tipo, mensaje_template, id]);

        if (updated.rowCount === 0) {
            return res.status(404).json({ message: 'Tipo de mensaje no encontrado o no está activo' });
        }

        res.status(200).json({ message: 'Tipo de mensaje actualizado exitosamente' });
    } catch (err) {
        console.error({ ERROR: err, RUTA: `/tipos_mensajes/${id}`, METODO: 'PUT' });
        res.status(500).json({ message: 'Error al actualizar el tipo de mensaje' });
    }
});

app.delete('/tipos_mensajes/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const updated = await db.result('UPDATE tipos_mensajes SET estado = false, fecha_borrado = CURRENT_TIMESTAMP WHERE id = $1', [id]);

        if (updated.rowCount === 0) {
            return res.status(404).json({ message: 'Tipo de mensaje no encontrado' });
        }

        res.status(200).json({ message: 'Tipo de mensaje marcado como inactivo exitosamente' });
    } catch (err) {
        console.error({ ERROR: err, RUTA: `/tipos_mensajes/${id}`, METODO: 'DELETE' });
        res.status(500).json({ message: 'Eror al marcar el tipo de mensaje como inactivo' });
    }
});

module.exports = app;