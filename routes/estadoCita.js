const express = require('express');
const app = express.Router();
const db = require('../database/conn');


app.get('/', async (req, res) => {
    try {
      // Consultamos todos los roles activos en la base de datos
      const estadoCita = await db.manyOrNone('SELECT * FROM tbl_estados_cita where activo = true');
      // Enviamos un estado 200 con los roles obtenidos
      res.status(200).json(estadoCita);
    } catch (err) {
      // Capturamos el error y mostramos la información en la consola
      console.error({ERROR: err, RUTA: '/estadoCita', METODO: 'GET'});
      // Enviamos un estado 500 indicando un error en el servidor
      res.status(500).json({message: 'Error al obtener los estado_cita'});
    }
  });

  module.exports = app;