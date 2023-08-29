const express = require('express');
const app = express.Router();
const db = require('../db/conn');

app.post('/', (req, res) => {

    const parametros = [
        req.body.string_ruta,
        req.body.activa
    ];

    let sql = `SELECT * FROM fn_crear_ruta($1, $2);`;

    db.any(sql, parametros)
        .then(data => {
            const respuesta = data[0];

            if (respuesta.exito) {
                res.json({
                    exito: true,
                    mensaje: respuesta.mensaje,
                    id_registro: respuesta.id_registro
                });
            } else {
                registrarError(respuesta.mensaje);
                res.status(500).json({
                    exito: false,
                    mensaje: respuesta.mensaje
                });
            }
        })
        .catch((error) => {
            registrarError("Error al conectar con la base de datos: " + error.message);
            res.status(500).json({
                exito: false,
                mensaje: "Error al conectar con la base de datos",
                error: error.message
            });
        });
});

app.put('/', (req, res) => {

    const parametros = [
        req.body.id_ruta,
        req.body.string_ruta,
        req.body.activa
    ];

    const sql = `SELECT * FROM fn_actualizar_ruta($1, $2, $3)`;

    db.any(sql, parametros)
        .then(data => {
            const respuesta = {
                exito: data[0].exito,
                mensaje: data[0].mensaje,
                id_registro: data[0].id_registro
            };
            res.json(respuesta);
        })
        .catch(error => {
            registrarError("Error al actualizar la ruta: " + error.message);
            res.status(500).json({
                exito: false,
                mensaje: 'Error al actualizar la ruta',
                error: error.message
            });
        });
});

app.delete('/:id', (req, res) => {
    const idRuta = req.params.id;

    const sql = `SELECT * FROM fn_eliminar_ruta($1)`;

    db.any(sql, idRuta)
        .then(data => {
            const respuesta = {
                exito: data[0].exito,
                mensaje: data[0].mensaje
            };
            res.json(respuesta);
        })
        .catch(error => {
            registrarError("Error al eliminar la ruta: " + error.message);
            res.status(500).json({
                exito: false,
                mensaje: 'Error al eliminar la ruta',
                error: error.message
            });
        });
});

app.get('/', (req, res) => {

    const sql = 'SELECT * FROM tbl_rutas WHERE activa = true';

    db.any(sql)
        .then(data => {
            res.json({
                exito: true,
                mensaje: 'Rutas activas obtenidas exitosamente.',
                rutas: data
            });
        })
        .catch(error => {
            registrarError("Error al obtener las rutas activas: " + error.message);
            res.status(500).json({
                exito: false,
                mensaje: 'Error al obtener las rutas activas.',
                error: error.message
            });
        });

});

function registrarError(mensaje) {
    const sql = `INSERT INTO tbl_log_errores (descripcion, proceso) VALUES ($1, 'API')`;
    db.none(sql, mensaje)
        .catch(error => {
            console.error("Error al registrar el error en el log: " + error.message);
        });
}

module.exports = app;
