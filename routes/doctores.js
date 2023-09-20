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

app.post('', [requireAuth], async (req, res) => {

    // const parametros = [
    //     req.body.nombre,
    //     req.body.correo_electronico,
    //     req.body.color
    // ];


    const { nombre, correo_electronico, color, especialidadId } = req.body;


    if(!especialidadId){
        return res.status(400).json({ message: 'Especialidad es requerida' });
    }

    if(!nombre || !correo_electronico || !color){
        return res.status(400).json({ message: 'Nombre, correo electrónico y color son requeridos' });
    }

    try {

        const checkIfDoctorNameExist = await db.query('SELECT * FROM tbl_doctores WHERE nombre = $1', [nombre]);

        if(checkIfDoctorNameExist.length > 0){
            return res.status(400).json({ message: 'El nombre del doctor ya existe.' });
        }


        const result = await db.query('SELECT * FROM fn_crear_doctores($1, $2, $3)', [nombre, correo_electronico, color]);

        const doctocCreado = result[0].id_registro;

        if(!result[0].exito){
            return res.status(500).json({ message: 'Hubo un error al crear el doctor' });
        }

            const result2 = await db.query('SELECT * FROM fn_crear_doctor_especialidad($1, $2)', [doctocCreado, especialidadId]);

            if(!result2[0].exito){
                return res.status(500).json({ message: 'Hubo un error al crear el doctor' });
            }

            return res.status(201).json({ message: 'Doctor Creado con exito', data: result[0].id_registro });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error al crear el doctor' });
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