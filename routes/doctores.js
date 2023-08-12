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




module.exports = app;