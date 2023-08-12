const express = require('express');
const app = express.Router();
const db = require('../database/conn');



// Get all active appointment states
app.get('/estadosCita', async (req, res) => {
  try {
    const estadoCita = await db.manyOrNone('SELECT * FROM tbl_estados_cita WHERE activo = true');
    res.status(200).json(estadoCita);
  } catch (err) {
    console.error({ ERROR: err, RUTA: '/estadosCita', METODO: 'GET' });
    res.status(500).json({ message: 'Error al obtener los estado_cita' });
  }
});

// Create a new appointment state
app.post('/estadosCita', async (req, res) => {
  const { estado } = req.body;
  if (!estado) {
    return res.status(400).json({ message: 'El estado es requerido' });
  }

  try {
    const newEstadoCita = await db.one(
      'INSERT INTO tbl_estados_cita (estado) VALUES ($1) RETURNING *',
      estado
    );
    res.status(201).json(newEstadoCita);
  } catch (err) {
    console.error({ ERROR: err, RUTA: '/estadosCita', METODO: 'POST' });
    res.status(500).json({ message: 'Error al crear el estado_cita' });
  }
});

// Update an appointment state
app.put('/estadosCita/:id', async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  if (!estado) {
    return res.status(400).json({ message: 'El estado es requerido' });
  }

  try {
    const updatedEstadoCita = await db.one(
      'UPDATE tbl_estados_cita SET estado = $1 WHERE id = $2 RETURNING *',
      [estado, id]
    );
    res.status(200).json(updatedEstadoCita);
  } catch (err) {
    console.error({ ERROR: err, RUTA: `/estadosCita/${id}`, METODO: 'PUT' });
    res.status(500).json({ message: 'Error al actualizar el estado_cita' });
  }
});

// Delete an appointment state (set activo to false)
app.delete('/estadosCita/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEstadoCita = await db.one(
      'UPDATE tbl_estados_cita SET activo = false WHERE id = $1 RETURNING *',
      id
    );
    res.status(200).json(deletedEstadoCita);
  } catch (err) {
    console.error({ ERROR: err, RUTA: `/estadosCita/${id}`, METODO: 'DELETE' });
    res.status(500).json({ message: 'Error al eliminar el estado_cita' });
  }
});

// Start the server

  module.exports = app;