const express = require('express');
const app = express.Router();
const db = require('../db/conn');
const requireAuth = require('../middlewares/requireAuth');

app.get('', [requireAuth], async (req, res) => {
    try {
        const sql = `
            SELECT
                d.id AS doctor_id,
                d.nombre AS doctor_name,
                d.correo_electronico AS doctor_email,
                d.color AS doctor_color,
                e.id AS especialidad_id,
                e.nombre AS especialidad_name
            FROM tbl_doctores d
            LEFT JOIN tbl_doctor_especialidades de ON d.id = de.doctor_id
            LEFT JOIN tbl_especialidades e ON de.especialidad_id = e.id
            WHERE d.estado = true;
        `;

        const rows = await db.any(sql);

        const doctorsMap = {};

        rows.forEach(row => {
            if (!doctorsMap[row.doctor_id]) {
                doctorsMap[row.doctor_id] = {
                    doctor_id: row.doctor_id,
                    doctor_name: row.doctor_name,
                    doctor_email: row.doctor_email,
                    doctor_color: row.doctor_color,
                    especialidades: []
                };
            }

            if(row.especialidad_id) { // Verifica si la especialidad_id no es NULL
                doctorsMap[row.doctor_id].especialidades.push({
                    especialidad_id: row.especialidad_id,
                    especialidad_name: row.especialidad_name
                });
            }
        });

        const doctorsList = Object.values(doctorsMap);

        if (doctorsList.length === 0) {
            res.status(404).json({ mensaje: 'No se encontraron datos' });
        } else {
            res.json(doctorsList);
        }

    } catch (error) {
        res.status(500).json({ error: 'Error en la consulta' });
    }
});



app.post('', [requireAuth], async (req, res) => {

    // const parametros = [
    //     req.body.nombre,
    //     req.body.correo_electronico,
    //     req.body.color
    // ];


    const { nombre, correo_electronico, color, especialidadId } = req.body;


    if (!especialidadId) {
        return res.status(400).json({ message: 'Especialidad es requerida' });
    }

    if (!nombre || !correo_electronico || !color) {
        return res.status(400).json({ message: 'Nombre, correo electrónico y color son requeridos' });
    }

    try {

        const checkIfDoctorNameExist = await db.query('SELECT * FROM tbl_doctores WHERE nombre = $1', [nombre]);

        if (checkIfDoctorNameExist.length > 0) {
            return res.status(400).json({ message: 'El nombre del doctor ya existe.' });
        }


        const result = await db.query('SELECT * FROM fn_crear_doctores($1, $2, $3)', [nombre, correo_electronico, color]);

        const doctocCreado = result[0].id_registro;

        if (!result[0].exito) {
            return res.status(500).json({ message: 'Hubo un error al crear el doctor' });
        }

            const result2 = await db.query('SELECT * FROM fn_crear_doctor_especialidad($1, $2)', [parseInt(doctocCreado), parseInt(especialidadId)]);

        if (!result2[0].exito) {
            return res.status(500).json({ message: 'Hubo un error al crear el doctor' });
        }

        return res.status(201).json({ message: 'Doctor Creado con exito', data: result[0].id_registro });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error al crear el doctor' });
    }

});

app.put('/:id', [requireAuth], async (req, res) => {

    const { nombre, correo_electronico, color, nuevaEspecialidad, especialidadVieja } = req.body;
    const doctorId = req.params.id;

    let respuestaValidacion = {
        exito: true,
        mensaje: [],
        excepcion: "",
        item_rol: {}
    };

    try {
        // 1. Actualizar la información del doctor
        const sqlUpdateDoctor = `
            UPDATE tbl_doctores 
            SET nombre = $1, correo_electronico = $2, color = $3
            WHERE id = $4
        `;
        await db.none(sqlUpdateDoctor, [nombre, correo_electronico, color, doctorId]);

        // 2. Si hay información sobre una nueva especialidad, añadirla
        if (nuevaEspecialidad) {
            const sqlInsertEspecialidad = `
                INSERT INTO tbl_doctor_especialidades (doctor_id, especialidad_id)
                VALUES ($1, $2)
            `;
            await db.none(sqlInsertEspecialidad, [doctorId, nuevaEspecialidad]);
        }

        // 3. Si hay información sobre una especialidad vieja, eliminarla
        if (especialidadVieja) {
            const sqlDeleteEspecialidad = `
                DELETE FROM tbl_doctor_especialidades
                WHERE doctor_id = $1 AND especialidad_id = $2
            `;
            await db.none(sqlDeleteEspecialidad, [doctorId, especialidadVieja]);
        }

        respuestaValidacion.mensaje.push("Operación Exitosa");
        respuestaValidacion.item_rol = {
            id: doctorId,
            nombre,
            correo_electronico,
            color
        };
        res.json(respuestaValidacion);
    } 
    catch (error) {
        respuestaValidacion.exito = false;
        respuestaValidacion.mensaje.push("Operación Erronea");
        respuestaValidacion.excepcion = error.message;
        res.status(500).json(respuestaValidacion);
    }
});


app.delete('/:id', [requireAuth], (req, res) => {

    const doctorId = req.params.id;

    const sql = `UPDATE tbl_doctores SET estado = false WHERE id = $1`;

    let mensajes = new Array();

    let respuestaValidacion = {
        exito: true,
        mensaje: mensajes,
        excepcion: "",
        item_rol: ""
    };

    db.result(sql, [doctorId], r => r.rowCount)
        .then(data => {

            if(data === 0) {
                // No se actualizó ningún registro, posiblemente el ID no existía
                respuestaValidacion.exito = false;
                respuestaValidacion.mensaje.push("Doctor no encontrado");
                res.status(404).json(respuestaValidacion);
                return;
            }

            const objetoMod = {
                id: doctorId,
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
            res.status(500).json(respuestaValidacion);
        });
});




module.exports = app;