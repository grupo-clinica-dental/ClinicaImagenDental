
const express = require('express');
const app = express.Router();
const db = require('../database/conn');


app.post('/', async (req, res) => {
    const { nombre } = req.body;
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({message: 'Nombre es requerido y no puede estar en blanco'});
    }
    try {
      await db.none('INSERT INTO tbl_roles (nombre) VALUES ($1)', [nombre]);
      res.status(201).json({message: 'Rol creado exitosamente'});
    } catch (err) {
      console.error(err);
      res.status(500).json({message: 'Error al crear el rol'});
    }
  });
  

  app.get('/', async (req, res) => {
    try {
      const roles = await db.manyOrNone('SELECT * FROM tbl_roles WHERE activo = true');
      res.status(200).json(roles);
    } catch (err) {
      console.error(err);
      res.status(500).json({message: 'Error al obtener los roles'});
    }
  });
  
  
  app.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const rol = await db.oneOrNone('SELECT * FROM tbl_roles WHERE id = $1 AND activo = true', [id]);
      if (!rol) {
        return res.status(404).json({message: 'Rol no encontrado'});
      }
      res.status(200).json(rol);
    } catch (err) {
      console.error(err);
      res.status(500).json({message: 'Error al obtener el rol'});
    }
  });

  
  app.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({message: 'Nombre es requerido y no puede estar en blanco'});
    }
    try {
      const updated = await db.result('UPDATE tbl_roles SET nombre = $1 WHERE id = $2 AND activo = true', [nombre, id]);
      if (updated.rowCount === 0) {
        return res.status(404).json({message: 'Rol no encontrado o no está activo'});
      }
      res.status(200).json({message: 'Rol actualizado exitosamente'});
    } catch (err) {
      console.error(err);
      res.status(500).json({message: 'Error al actualizar el rol'});
    }
  });
  
  

  app.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const updated = await db.result('UPDATE tbl_roles SET activo = false, fecha_borrado = CURRENT_TIMESTAMP WHERE id = $1', [id]);
      if (updated.rowCount === 0) {
        return res.status(404).json({message: 'Rol no encontrado'});
      }
      res.status(200).json({message: 'Rol marcado como inactivo exitosamente'});
    } catch (err) {
      console.error(err);
      res.status(500).json({message: 'Error al marcar el rol como inactivo'});
    }
  });

  
  app.put('/restore/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const updated = await db.result('UPDATE tbl_roles SET activo = true, fecha_borrado = NULL WHERE id = $1', [id]);
      if (updated.rowCount === 0) {
        return res.status(404).json({message: 'Rol no encontrado'});
      }
      res.status(200).json({message: 'Rol restaurado exitosamente'});
    } catch (err) {
      console.error(err);
      res.status(500).json({message: 'Error al restaurar el rol'});
    }
  });
  
  
  


module.exports = app;