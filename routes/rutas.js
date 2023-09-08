const express = require('express');
const app = express.Router();
const db = require('../db/conn');

app.post('/', (req, res) => {
    const { string_ruta, activa } = req.body;

    const sql = 'SELECT * FROM fn_crear_ruta($1, $2);';

    db.any(sql, [string_ruta, activa])
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
        .catch(error => {
            registrarError("Error al conectar con la base de datos: " + error.message);
            res.status(500).json({
                exito: false,
                mensaje: "Error al conectar con la base de datos",
                error: error.message
            });
        });
});

app.put('/', (req, res) => {
    const { id_ruta, string_ruta, activa } = req.body;

    const sql = 'SELECT * FROM fn_actualizar_ruta($1, $2, $3);';

    db.any(sql, [id_ruta, string_ruta, activa])
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
        .catch(error => {
            registrarError("Error al conectar con la base de datos: " + error.message);
            res.status(500).json({
                exito: false,
                mensaje: "Error al conectar con la base de datos",
                error: error.message
            });
        });
});

app.delete('/:id', (req, res) => {
    const idRuta = req.params.id;

    const sql = 'SELECT * FROM fn_eliminar_ruta($1);';

    db.any(sql, [idRuta])
        .then(data => {
            const respuesta = data[0];

            if (respuesta.exito) {
                res.json({
                    exito: true,
                    mensaje: respuesta.mensaje
                });
            } else {
                registrarError(respuesta.mensaje);
                res.status(500).json({
                    exito: false,
                    mensaje: respuesta.mensaje
                });
            }
        })
        .catch(error => {
            registrarError("Error al conectar con la base de datos: " + error.message);
            res.status(500).json({
                exito: false,
                mensaje: "Error al conectar con la base de datos",
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
                mensaje: 'Permisos activos obtenidos exitosamente.',
                permisos: data
            });
        })
        .catch(error => {
            registrarError("Error al obtener los permisos activos: " + error.message);
            res.status(500).json({
                exito: false,
                mensaje: 'Error al obtener los permisos activos.',
                error: error.message
            });
        });
});


function registrarError(mensaje) {
    const sql = 'INSERT INTO tbl_log_errores (descripcion, proceso) VALUES ($1, $2);';

    db.none(sql, [mensaje, 'API'])
        .catch(error => {
            console.error("Error al registrar el error en el log: " + error.message);
        });
}

module.exports = app;

