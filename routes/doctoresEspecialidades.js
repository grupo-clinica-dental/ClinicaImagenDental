const express = require('express');
const app = express.Router();
const db = require('../db/conn');
const requireAuth = require('../middlewares/requireAuth');

app.post('', [requireAuth], (req, res) => {
  const { doctor_id, especialidad_id } = req.body;

  let mensajes = [];
  let bandera = true;

  if (!doctor_id) {
      bandera = false;
      mensajes.push('Doctor ID es requerido');
  }

  if (!especialidad_id) {
      bandera = false;
      mensajes.push('Especialidad ID es requerida');
  }

  let respuestaValidacion = {
      exito: bandera,
      mensaje: mensajes,
      excepcion: "",
      item_doctor_especialidad: {}
  };

  if (!respuestaValidacion.exito) {
      return res.status(400).json(respuestaValidacion);
  }

  let sql = `SELECT * FROM fn_crear_doctor_especialidad($1, $2)`;

  db.any(sql, [doctor_id, especialidad_id])
      .then(data => {
          respuestaValidacion.mensaje.push("Registro creado exitosamente");
          respuestaValidacion.item_doctor_especialidad = {
              doctor_id: data[0].doctor_id, 
              especialidad_id: data[0].especialidad_id
          };
          res.status(201).json(respuestaValidacion);
      })

      .catch((error) => {
          respuestaValidacion.mensaje.push("Error al crear el registro");
          respuestaValidacion.excepcion = error.message;
          respuestaValidacion.exito = false;
          res.status(500).json(respuestaValidacion);
      });
});

app.put('/:id', [requireAuth], (req, res) => {
    const { id } = req.params;
    const { doctor_id, especialidad_id } = req.body;

    let mensajes = [];
    let bandera = true;

    if (!doctor_id) {
        bandera = false;
        mensajes.push('Doctor ID es requerido.');
    }

    if (!especialidad_id) {
        bandera = false;
        mensajes.push('Especialidad ID es requerido.');
    }

    let respuestaValidacion = {
        exito: bandera,
        mensaje: mensajes,
        excepcion: "",
        item_registro: {}
    };

    if (!respuestaValidacion.exito) {
        return res.status(400).json(respuestaValidacion);
    }

    let sql = `SELECT * FROM fn_actualizar_doctor_especialidad($1, $2, $3)`;

    db.any(sql, [id, doctor_id, especialidad_id])
        .then(data => {
            if (!data[0].exito) {
                respuestaValidacion.exito = false;
                respuestaValidacion.mensaje.push('Registro Inactivo o no encontrado.');
                return res.status(404).json(respuestaValidacion);
            }

            respuestaValidacion.mensaje.push("Registro actualizado exitosamente");
            res.status(200).json(respuestaValidacion);
        })
        .catch((error) => {
            respuestaValidacion.mensaje.push("Error al actualizar el registro");
            respuestaValidacion.excepcion = error.message;
            respuestaValidacion.exito = false;
            res.status(500).json(respuestaValidacion);
        });
});

app.delete('/:id', [requireAuth], (req, res) => {
  const { doctor_id, especialidad_id } = req.params;

  let sql = `SELECT * FROM fn_desactivar_doctor_especialidad($1, $2)`;

  db.any(sql, [doctor_id, especialidad_id])
      .then(data => {
          const respuesta = {
              exito: data[0].exito,
              mensaje: [data[0].mensaje]
          };

          if (!data[0].exito) {
              res.status(404).json(respuesta);
          } else {
              res.status(200).json(respuesta);
          }
      })
      .catch((error) => {
          const respuestaError = {
              exito: false,
              mensaje: ["Error al desactivar la especialidad para el doctor"],
              excepcion: error.message
          };
          console.error(error);
          res.status(500).json(respuestaError);
      });
});

app.get('', [requireAuth],(req, res) => {
  let sql = `SELECT doctor_id, especialidad_id, estado, fecha_borrado::date fecha_borrado FROM tbl_doctor_especialidades WHERE estado = true`;

  db.any(sql)
      .then(rows => {
          const respuesta = {
              exito: true,
              mensaje: [],
              excepcion: "",
              item_doctor_especialidad: {}  
          };

          if (rows.length === 0 || rows[0].doctor_id === null) {
              respuesta.exito = false;
              respuesta.mensaje.push("Sin Datos");
              res.status(404).json(respuesta);
          } else {
              respuesta.mensaje.push("Registros obtenidos exitosamente");
              respuesta.item_doctor_especialidad = rows;  
              res.status(200).json(respuesta);
          }
      })
      .catch((error) => {
          console.error(error);
          res.status(500).json({
              exito: false,
              mensaje: ["Error al obtener los registros"],
              excepcion: error.message,
              item_paciente: {}
          });
      });
});


module.exports = app;