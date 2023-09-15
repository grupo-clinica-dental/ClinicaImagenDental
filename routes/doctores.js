const express = require('express');
const app = express.Router();
const db = require('../db/conn');
const requireAuth = require('../middlewares/requireAuth');

app.get('', [requireAuth], (req, res) => {

    let sql = `SELECT * FROM tbl_doctores WHERE estado = true `;

    db.any(sql, e => e.id)

        .then(row => {


            if (row.length === 0) {
                res.status(404).json({ mensaje: "Sin datos" })
            } else {
                res.json(row);
            }

        })
        .catch((error) => {
            res.status(500).json(error);
        });

});

app.post('', [requireAuth], (req, res) => {

    const parametros = [
        req.body.nombre,
        req.body.correo_electronico,
        req.body.color

    ];

    let sql = `  SELECT * FROM fn_crear_doctores($1, $2, $3)`;

    let mensajes = new Array();
    let bandera = true;

    let respuestaValidacion = {

        exito: bandera,
        mensaje: mensajes,
        excepcion: "",
        item_rol: ""

    };
    if (respuestaValidacion === false) {
        res.status(500).json(respuestaValidacion);
    } else {
        db.one(sql, parametros, event => event.id)
        .then(data => {

            const objetoCreado = {

                id: data,
                nombre: req.body.nombre,
                correo_electronico: req.body.correo_electronico,
                color: req.body.color

            }
            respuestaValidacion.mensaje.push("Operación Exitosa");
            respuestaValidacion.item_rol = objetoCreado;
            res.json(objetoCreado);

        })
        .catch((error) => {
            respuestaValidacion.mensaje.push("Operación Erronea");
            respuestaValidacion.excepcion = error.message;
            respuestaValidacion.exito = false;
            res.status(500).json(error);
        }
        );
    }

    

});

app.put('/:id', [requireAuth],(req, res) => {


    const parametros = [

        req.body.nombre,
        req.body.correo_electronico,
        req.body.color,
        req.params.id

    ];

    let sql = ` SELECT * FROM fn_actualizar_doctores ($1, $2, $3, $4) `;

    let mensajes = new Array();

    let respuestaValidacion = {

        exito: true,
        mensaje: mensajes,
        excepcion: "",
        item_rol: ""

    };

    db.result(sql, parametros, r => r.rowCount)
        .then(data => {

            const objetoMod = {

                id: req.params.id,
                nombre: req.body.nombre,
                correo_electronico: req.body.correo_electronico,
                color: req.body.color,
                

            }

            respuestaValidacion.mensaje = "Operación Exitosa";
            respuestaValidacion.item_rol = objetoMod;
            res.json(respuestaValidacion);

        })
        .catch((error) => {

            respuestaValidacion.exito = false;
            respuestaValidacion.mensaje.push("Operación Erronea");
            respuestaValidacion.excepcion = error.message;
            res.status(500).json(error);

        }
        );

});

app.delete('/:id', [requireAuth], (req, res) => {


    const parametros = [

        req.params.id

    ];

    let sql = ` SELECT * FROM fn_eliminar_doctores($1) `;

    let mensajes = new Array();

    let respuestaValidacion = {

        exito: true,
        mensaje: mensajes,
        excepcion: "",
        item_rol: ""

    };

    db.result(sql, parametros, r => r.rowCount)
        .then(data => {

            const objetoMod = {

                id: req.params.id,
                fecha_borrado: req.body.fecha_borrado,
                color: req.body.color,
                estado: false
            }

            respuestaValidacion.mensaje = "Operación Exitosa";
            respuestaValidacion.item_rol = objetoMod;
            res.json(respuestaValidacion);

        })
        .catch((error) => {

            respuestaValidacion.exito = false;
            respuestaValidacion.mensaje.push("Operación Erronea");
            respuestaValidacion.excepcion = error.message;
            res.status(500).json(error);

        }
        );

});




module.exports = app;