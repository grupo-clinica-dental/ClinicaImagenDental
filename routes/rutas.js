const express = require('express');
const app = express.Router();
const db = require('../db/conn');

// Crear una ruta
app.post('/', async (req, res) => {
    try {
        const { string_ruta, activa } = req.body;
        const sql = 'SELECT * FROM fn_crear_ruta($1, $2)';

        const newRuta = await db.one(sql, [string_ruta, activa]);

        res.status(201).json({
            exito: true,
            mensaje: 'Ruta creada exitosamente.',
            ruta: newRuta
        });
    } catch (error) {
        res.status(500).json({
            exito: false,
            mensaje: 'Error al crear la ruta.',
            error: error.message
        });
    }
});

// Actualizar una ruta
app.put('/:id', async (req, res) => {
    try {
        const { id } = req.params; // Obtén el ID de la URL
        const { string_ruta, activa } = req.body;
        const sql = 'SELECT * FROM fn_actualizar_ruta($1, $2, $3)';

        const updatedRuta = await db.one(sql, [id, string_ruta, activa]);

        res.status(200).json({
            exito: true,
            mensaje: 'Ruta actualizada exitosamente.',
            ruta: updatedRuta
        });
    } catch (error) {
        res.status(500).json({
            exito: false,
            mensaje: 'Error al actualizar la ruta.',
            error: error.message
        });
    }
});


// Eliminar una ruta
app.delete('/:id', async (req, res) => {
    try {
        const idRuta = req.params.id;
        const sql = 'SELECT * FROM fn_eliminar_ruta($1)';

        await db.none(sql, [idRuta]);

        res.json({
            exito: true,
            mensaje: 'Ruta eliminada exitosamente.'
        });
    } catch (error) {
        res.status(500).json({
            exito: false,
            mensaje: 'Error al eliminar la ruta.',
            error: error.message
        });
    }
});





// Obtener todas las rutas activas con id
app.get('/:id', async (req, res) => {
    try {
        const id = req.params.id; // Obtén el ID de la URL

        const sql = 'SELECT * FROM tbl_rutas WHERE activa = true AND id = $1'; // Cambia 'rutas' por el nombre de tu tabla
        const rutas = await db.any(sql, [id]);

        if (rutas.length === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: 'No se encontró una ruta con el ID proporcionado.'
            });
        }

        res.json({
            exito: true,
            mensaje: 'Ruta activa obtenida exitosamente.',
            ruta: rutas[0] // Devolvemos la primera ruta encontrada (debería ser única por ID)
        });
    } catch (error) {
        res.status(500).json({
            exito: false,
            mensaje: 'Error al obtener la ruta activa.',
            error: error.message
        });
    }
});


app.get('/', async (req, res) => {  // Obtener todas las rutas activas
    try {
        const sql = 'SELECT * FROM tbl_rutas WHERE activa = true'; // Cambia 'rutas' por el nombre de tu tabla

        const rutas = await db.any(sql);

        res.json({
            exito: true,
            mensaje: 'Rutas activas obtenidas exitosamente.',
            rutas
        });
    } catch (error) {
        res.status(500).json({
            exito: false,
            mensaje: 'Error al obtener las rutas activas.',
            error: error.message
        });
    }
});


module.exports = app;

