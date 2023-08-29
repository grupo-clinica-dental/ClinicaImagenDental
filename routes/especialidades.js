const express = require('express');
const app = express.Router();
const db = require('../db/conn');
const e = require('express');

app.get('', (req, res) => {

    let sql = `SELECT * FROM tbl_especialidades WHERE activo = true `;

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

app.post('', (req, res) => {

    const parametros = [

        req.body.nombre,
        req.body.fecha_borrado

    ];

    

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
        let sql = ` SELECT * FROM fn_crear_especialidades($1, $2) `;
        db.one(sql, parametros, event => event.id)
        .then(data => {

            const objetoCreado = {

                id: data,
                nombre: req.body.nombre,
                fecha_borrado: req.body.fecha_borrado

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

app.put('/:id', (req, res) => {


    const parametros = [

        req.body.nombre,
        req.body.fecha_borrado,
        req.params.id

    ];

    let sql = ` SELECT * FROM fn_actualizar_especialidades($1, $2, $3) `;

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
                fecha_borrado:req.body.fecha_borrado,

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

app.delete('/:id', (req, res) => {


    const parametros = [

        req.params.id

    ];

    let sql = ` SELECT * FROM fn_eliminar_especialidades($1) `;

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
                fecha_borrado:req.body.fecha_borrado,
                activo: false
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