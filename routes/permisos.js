const express = require('express');
const app = express.Router();
const db = require('../db/conn');
const requireAuth = require('../middlewares/requireAuth');

// Ruta para crear un permiso
app.post('/', [requireAuth], (req, res) => {
    const parametros = [
        req.body.rol_id,
        req.body.ruta_id,
        req.body.activa
    ];

    let sql = `SELECT * FROM fn_crear_permiso($1, $2, $3);`;

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

// Ruta para actualizar un permiso
app.put('/:id', [requireAuth], (req, res) => {
    const idPermiso = req.params.id;
    const parametros = [
        idPermiso,
        req.body.rol_id,
        req.body.ruta_id,
        req.body.activa
    ];

    const sql = `SELECT * FROM fn_actualizar_permiso($1, $2, $3, $4)`;

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
            registrarError("Error al actualizar el permiso: " + error.message);
            res.status(500).json({
                exito: false,
                mensaje: 'Error al actualizar el permiso',
                error: error.message
            });
        });
});

// Ruta para eliminar un permiso
app.delete('/:id', [requireAuth], (req, res) => {
    const idPermiso = req.params.id;

    const sql = `SELECT * FROM fn_eliminar_permiso($1)`;

    db.any(sql, idPermiso)
        .then(data => {
            const respuesta = {
                exito: data[0].exito,
                mensaje: data[0].mensaje
            };
            res.json(respuesta);
        })
        .catch(error => {
            registrarError("Error al eliminar el permiso: " + error.message);
            res.status(500).json({
                exito: false,
                mensaje: 'Error al eliminar el permiso',
                error: error.message
            });
        });
});

// Ruta para obtener todos los permisos activos
// Ruta para obtener todos los permisos activos
app.get('/', [requireAuth],(req, res) => {
    const sql = 'SELECT * FROM tbl_permisos WHERE activa = true';

    db.any(sql)
        .then(data => {
            res.json({
                exito: true,
                mensaje: 'Permisos activos obtenidos exitosamente.',
                permisos: data // Esto asegura que 'data' sea un arreglo
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

app.get('/:id', [requireAuth], (req, res) => {
    const sql = 'SELECT * FROM tbl_permisos WHERE activa = true';

    db.any(sql)
        .then(data => {
            res.json({
                exito: true,
                mensaje: 'Permisos activos obtenidos exitosamente.',
                permisos: data // Esto asegura que 'data' sea un arreglo
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
    const sql = `INSERT INTO tbl_log_errores (descripcion, proceso) VALUES ($1, 'API')`;
    db.none(sql, mensaje)
        .catch(error => {
            console.error("Error al registrar el error en el log: " + error.message);
        });
}

module.exports = app;
