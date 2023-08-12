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

    let sql = `  insert into tbl_especialidades 
                 (nombre, fecha_borrado)
                 values 
                 ($1, $2) returning id
                `;

    let mensajes = new Array();

    let respuestaValidacion = {

        exito: true,
        mensaje: mensajes,
        excepcion: "",
        item_rol: ""

    };

    db.one(sql, parametros, event => event.id)
        .then(data => {

            const objetoCreado = {

                id: data,
                nombre: req.body.nombre,
                fecha_borrado: req.body.fecha_borrado

            }

            res.json(objetoCreado);

        })
        .catch((error) => {
            res.status(500).json(error);
        }
        );

});

app.put('/:id', (req, res) => {


    const parametros = [

        req.body.nombre,
        req.body.fecha_borrado,
        req.params.id

    ];

    let sql = `  
                    update tbl_especialidades 
                    set nombre = $1, fecha_borrado = $2 
                    where id = $3

                `;

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

    let sql = `  
                    update tbl_especialidades 
                    set activo = false
                    where id = $1

                `;

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