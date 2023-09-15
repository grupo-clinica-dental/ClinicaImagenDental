
// importamos express
const express = require('express');
// creamos un nuevo router de express para exportarlo al final del archivo
const app = express.Router();
// importamos la conexion de la base de datos
const db = require('../db/conn');
const  requireAuth  = require('./../middlewares/require-auth');
const getNewResponseApi = require('../utils/createApiResponse');


app.post('/' ,  async (req, res) => {

  const response = getNewResponseApi();

  const { nombre, email, telefono, password, secondPassword } = req.body;

  if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Nombre, email y password son requeridos' });
  }

  const isEmailTaken = await db.query('SELECT email FROM tbl_usuarios WHERE email = $1', [email]);

  if (isEmailTaken.length > 0) {
      return res.status(400).json({ ...response,  message: 'El correo electrónico ya está en uso.' });
  }

  if (password !== secondPassword) {
      return res.status(400).json({ ...response, message: 'Contraseñas no coinciden' });
  }

  try {
      const result = await db.query('SELECT * FROM fn_crear_usuario($1, $2, $3, $4)', [nombre, email, telefono, password]);

      console.log(result[0])

      if (result[0].exito) {
          return res.status(201).json({ ...response,  message: 'Usuario Creado con exito', data: result[0].id_registro });
      } else {
          return res.status(500).json({ ...response,  message: 'Hubo un error al crear el usuario' });
      }

  } catch (err) {
      console.error({ ERROR: err, RUTA: '/usuarios', METODO: 'POST' });
      res.status(500).json({ ...response,  message: 'Error al crear el usuario' });
  }
});


  app.get('/',   async (req, res) => {

    const response = getNewResponseApi();

    try {
      const usuarios = await db.manyOrNone('SELECT * FROM tbl_usuarios WHERE estado = true');
      res.status(200).json({...response, data: usuarios});
    } catch (err) {
      console.error({ ERROR: err, RUTA: '/usuarios', METODO: 'GET' });
      res.status(500).json({ ...response,  message: 'Error al obtener los usuarios' });
    }
  });
  

  app.get('/:id' ,async (req, res) => {
    const { id } = req.params;
  
    const response = getNewResponseApi();

    try {
      const usuario = await db.oneOrNone('SELECT * FROM tbl_usuarios WHERE id = $1 AND estado = true', [id]);
  
      if (!usuario) {
        return res.status(404).json({ ...response,  message: 'Usuario no encontrado' });
      }
  
      res.status(200).json(usuario);
    } catch (err) {
      console.error({ ERROR: err, RUTA: `/usuarios/${id}`, METODO: 'GET' });
      res.status(500).json({ ...response , message: 'Error al obtener el usuario' });
    }
  });

  app.put('/:id' ,async (req, res) => {

    const response = getNewResponseApi();

    const { id } = req.params;
    const { nombre, email, telefono, password } = req.body;

  
    try {
        // Llamada a la función de PostgreSQL para actualizar el usuario
        const result = await db.any('SELECT * FROM fn_actualizar_usuario($1, $2, $3, $4, $5)', [parseInt(id), nombre, email, telefono, password]);


        if (result[0].exito) {
            return res.status(200).json({ ...response,  message: result[0].mensaje, succeded: true });
        } else {
            return res.status(404).json({ ...response,  message: result[0].mensaje, succeded: true });
        }

    } catch (err) {
        console.error({ ERROR: err, RUTA: `/usuarios/${id}`, METODO: 'PUT' });
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
});

  
app.delete('/:id', [requireAuth], async (req , res) => {
  const { id } = req.params;

  const response = getNewResponseApi();

  try {
      // Llamada a la función de PostgreSQL para desactivar el usuario
      const result = await db.query('SELECT * FROM fn_desactivar_usuario($1)', [id]);

      if (result.rows[0].exito) {
          return res.status(200).json({ ...response,  message: result.rows[0].mensaje });
      } else {
          return res.status(404).json({ ...response,  message: result.rows[0].mensaje });
      }

  } catch (err) {
      console.error({ ERROR: err, RUTA: `/usuarios/${id}`, METODO: 'DELETE' });
      res.status(500).json({ ...response,  message: 'Error al marcar el usuario como inactivo' });
  }
});

  
  


module.exports = app;