
// importamos express
const express = require('express');
// creamos un nuevo router de express para exportarlo al final del archivo
const app = express.Router();
// importamos la conexion de la base de datos
const db = require('../db/conn');
// importamos el error para mostrar errores de consola
const { error } = require('console');

app.post('/', async (req, res) => {
    const { usuario_id, token, fecha_inicio, fecha_expiracion } = req.body;
  
    if (!usuario_id || !token || !fecha_inicio || !fecha_expiracion) {
      return res.status(400).json({ message: 'usuario_id, token, fecha_inicio, y fecha_expiracion son requeridos' });
    }
  
    try {
      await db.none('INSERT INTO tbl_tokens (usuario_id, token, fecha_inicio, fecha_expiracion) VALUES ($1, $2, $3, $4)', [usuario_id, token, fecha_inicio, fecha_expiracion]);
      res.status(201).json({ message: 'Token creado exitosamente' });
    } catch (err) {
      console.error({ ERROR: err, RUTA: '/tokens', METODO: 'POST' });
      res.status(500).json({ message: 'Error al crear el token' });
    }
  });


  app.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { usuario_id, token, fecha_inicio, fecha_expiracion } = req.body;
  
    try {
      const updated = await db.result('UPDATE tbl_tokens SET usuario_id = $1, token = $2, fecha_inicio = $3, fecha_expiracion = $4 WHERE id = $5', [usuario_id, token, fecha_inicio, fecha_expiracion, id]);
  
      if (updated.rowCount === 0) {
        return res.status(404).json({ message: 'Token no encontrado' });
      }
  
      res.status(200).json({ message: 'Token actualizado exitosamente' });
    } catch (err) {
      console.error({ ERROR: err, RUTA: `/tokens/${id}`, METODO: 'PUT' });
      res.status(500).json({ message: 'Error al actualizar el token' });
    }
  });


  app.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const deleted = await db.result('DELETE FROM tbl_tokens WHERE id = $1', [id]);
  
      if (deleted.rowCount === 0) {
        return res.status(404).json({ message: 'Token no encontrado' });
      }
  
      res.status(200).json({ message: 'Token eliminado exitosamente' });
    } catch (err) {
      console.error({ ERROR: err, RUTA: `/tokens/${id}`, METODO: 'DELETE' });
      res.status(500).json({ message: 'Error al eliminar el token' });
    }
  });
  
  

  
module.exports = app;
  