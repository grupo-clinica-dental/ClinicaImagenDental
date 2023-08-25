
// importamos express
const express = require('express');
// creamos un nuevo router de express para exportarlo al final del archivo
const app = express.Router();
// importamos la conexion de la base de datos
const db = require('../db/conn');
// importamos el error para mostrar errores de consola
const { error } = require('console');


app.post('/', async (req, res) => {
    const { nombre, email, telefono, password, secondPassword } = req.body;
  
    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Nombre, email y password son requeridos' });
    }

    const isEmailTaken = await db.query('Select email from tbl_usuarios where email = $1', [email])


    if(isEmailTaken.length > 0) {
    return res.status(400).json({message: 'El correo electronico ya esta en uso.'})
    }

    if(password !== secondPassword) {
        return res.status(400).json({ message: 'Contraseñas no coinciden' });
    }
  
    try {

        // TODO tener una biblioteca para hacer hash de la password
     //  const hashedPassword = await bcrypt.hash(password, 10); Asegúrate de usar una biblioteca de hashing segura
      await db.none('INSERT INTO tbl_usuarios (nombre, email, telefono, password) VALUES ($1, $2, $3, $4)', [nombre, email, telefono, password]);
      res.status(201).json({ message: 'Usuario creado exitosamente' });
    } catch (err) {
      console.error({ ERROR: err, RUTA: '/usuarios', METODO: 'POST' });
      res.status(500).json({ message: 'Error al crear el usuario' });
    }
  });

  app.get('/', async (req, res) => {
    try {
      const usuarios = await db.manyOrNone('SELECT * FROM tbl_usuarios WHERE estado = true');
      res.status(200).json(usuarios);
    } catch (err) {
      console.error({ ERROR: err, RUTA: '/usuarios', METODO: 'GET' });
      res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
  });
  

  app.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const usuario = await db.oneOrNone('SELECT * FROM tbl_usuarios WHERE id = $1 AND estado = true', [id]);
  
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      res.status(200).json(usuario);
    } catch (err) {
      console.error({ ERROR: err, RUTA: `/usuarios/${id}`, METODO: 'GET' });
      res.status(500).json({ message: 'Error al obtener el usuario' });
    }
  });

  app.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, email, telefono, password } = req.body;
  
    try {
        // TODO implementar el hash de la password
    //   const hashedPassword = password ? await bcrypt.hash(password, 10) : null; // Si se actualiza la contraseña, se hace hash de ella

      const updated = await db.result('UPDATE tbl_usuarios SET nombre = $1, email = $2, telefono = $3, password = $4 WHERE id = $5 AND estado = true', [nombre, email, telefono, password, id]);
  
      if (updated.rowCount === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado o no está activo' });
      }
  
      res.status(200).json({ message: 'Usuario actualizado exitosamente' });
    } catch (err) {
      console.error({ ERROR: err, RUTA: `/usuarios/${id}`, METODO: 'PUT' });
      res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
  });
  
  app.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const updated = await db.result('UPDATE tbl_usuarios SET estado = false, fecha_borra = CURRENT_TIMESTAMP WHERE id = $1', [id]);
  
      if (updated.rowCount === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      res.status(200).json({ message: 'Usuario marcado como inactivo exitosamente' });
    } catch (err) {
      console.error({ ERROR: err, RUTA: `/usuarios/${id}`, METODO: 'DELETE' });
      res.status(500).json({ message: 'Error al marcar el usuario como inactivo' });
    }
  });
  
  
  


module.exports = app;