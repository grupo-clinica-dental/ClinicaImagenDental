const express = require('express');
const app = express.Router();
const db = require("../database/conn");





  // OBTENER TODOS LOS ESTADOS DE LAS CITAS
  app.get('/', async (req, res) => {
    try {

      const estadoCita = await db.manyOrNone('SELECT * FROM tbl_estados_cita');
  
      res.status(200).json(estadoCita);
    } catch (err) {

      console.error({ERROR: err, RUTA: '/estadoCita', METODO: 'GET'});
      
      res.status(500).json({message: 'Error al obtener los estadoCita'});
    }
  });


// INGRESAR NUEVO estadoCita
app.post("/", async (req, res) => {
  const { estado, activo, fecha_borrado } = req.body;

  try {
    await db.none(
      "INSERT INTO  tbl_estados_cita (estado, activo, fecha_borrado) VALUES ($1, $2, $3)",
      [ estado, activo, fecha_borrado]
    );

    res
      .status(201)
      .json({ message: "estadoCita creado exitosamente" });
  } catch (err) {
    console.error({ err, RUTA: "/estadoCita", METODP: "POST" });

    res
      .status(500)
      .json({ message: "Error al crear estadoCita" });
  }
});

// ACTUALIZAR estadoCita
app.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { estado} = req.body;

  try {
    await db.result(
      "UPDATE  tbl_estados_cita SET estado= $1 WHERE id = $2 ",
      [estado, id]
    );

    res
      .status(200)
      .json({ message: "estadoCita actualizado exitosamente" });
  } catch (err) {
    console.error({
      err,
      RUTA: `/estadoCita/${id}`,
      METODO: "PUT",
    });

    res
      .status(500)
      .json({ message: "Error al actualizar estadoCita" });
  }
});
// Desactivar estadoCita
app.delete("/:id", async (req, res) => {
  const {id } = req.params;
  try {
    await db.result(
      "UPDATE  tbl_estados_cita SET activo = false, fecha_borrado = CURRENT_TIMESTAMP WHERE id = $1",
      [id]
    );

    res
      .status(200)
      .json({ message: "estadoCita inactivado con exito" });
  } catch (err) {
    console.error({
      err,
      RUTA: `/estadoCita/${eid}`,
      METODO: "DELETE",
    });

    res.status(500).json({
      message: "Error al marcar estadoCita como inactivo",
    });
  }
});

  module.exports = app;