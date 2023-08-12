const express = require('express');
const app = express.Router();
const db = require('../db/conn');

app.get('', (req, res) => {

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

app.post('', (req, res) => {

    const parametros = [

        req.body.usuario_id,
        req.body.fecha_borrado,
        req.body.color

    ];

    let sql = `  insert into tbl_doctores 
                 (usuario_id, fecha_borrado, color)
                 values 
                 ($1, $2, $3) returning id
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
                usuario_id: req.body.usuario_id,
                fecha_borrado: req.body.fecha_borrado,
                color: req.body.color

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

        req.body.fecha_borrado,
        req.body.color,
        req.params.id

    ];

    let sql = `  
                    update tbl_doctores 
                    set fecha_borrado = $1, color = $2
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
                fecha_borrado: req.body.fecha_borrado,
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

app.delete('/:id', (req, res) => {


    const parametros = [

        req.params.id

    ];

    let sql = `  
                    update tbl_doctores 
                    set estado = false
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