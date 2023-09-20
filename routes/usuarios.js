
// importamos express
const express = require('express');
// creamos un nuevo router de express para exportarlo al final del archivo
const app = express.Router();
// importamos la conexion de la base de datos
const db = require('../db/conn');
// importamos el error para mostrar errores de consola
const { error } = require('console');
// importamos el middleware para validar el token
const requireAuth = require('../middlewares/requireAuth');


app.post('/', [requireAuth], async (req, res) => {
  const { nombre, email, telefono, password, secondPassword } = req.body;

  const rol = 1


  if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Nombre, email y password son requeridos' });
  }

  const isEmailTaken = await db.query('SELECT email FROM tbl_usuarios WHERE email = $1', [email]);

  if (isEmailTaken.length > 0) {
      return res.status(400).json({ message: 'El correo electrónico ya está en uso.' });
  }

  if (password !== secondPassword) {
      return res.status(400).json({ message: 'Contraseñas no coinciden' });
  }

  try {
      const result = await db.query('SELECT * FROM fn_crear_usuario($1, $2, $3, $4, $5)', [nombre, email, telefono, password, rol]);

      console.log(result[0])

      if (result[0].exito) {
          return res.status(201).json({ message: 'Usuario Creado con exito', data: result[0].id_registro });
      } else {
          return res.status(500).json({ message: 'Hubo un error al crear el usuario' });
      }

  } catch (err) {
      console.error({ ERROR: err, RUTA: '/usuarios', METODO: 'POST' });
      res.status(500).json({ message: 'Error al crear el usuario' });
  }
});


  app.get('/', [requireAuth],async (req, res) => {
    try {
      const usuarios = await db.manyOrNone('SELECT * FROM tbl_usuarios WHERE estado = true');
      res.status(200).json(usuarios);
    } catch (err) {
      console.error({ ERROR: err, RUTA: '/usuarios', METODO: 'GET' });
      res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
  });
  

  app.get('/:id', [requireAuth], async (req, res) => {
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

  app.put('/:id', [requireAuth], async (req, res) => {
    const { id } = req.params;
    const { nombre, email, telefono, password, rol_id } = req.body;
  
    try {
        // Llamada a la función de PostgreSQL para actualizar el usuario
        const result = await db.query('SELECT * FROM FN_ACTUALIZAR_USUARIO($1, $2, $3, $4, $5, $6)', [id, nombre, email, telefono, password, rol_id]);

        console.log(result)

        if (result[0].exito) {
            return res.status(200).json({ message: result[0].mensaje });
        } else {
            return res.status(404).json({ message: result[0].mensaje });
        }

    } catch (err) {
        console.error({ ERROR: err, RUTA: `/usuarios/${id}`, METODO: 'PUT' });
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
});

  
app.delete('/:id', [requireAuth], async (req , res) => {
  const { id } = req.params;

  try {
      // Llamada a la función de PostgreSQL para desactivar el usuario
      const result = await db.query('SELECT * FROM fn_desactivar_usuario($1)', [id]);

      console.log(result)

      if (result[0].exito) {
          return res.status(200).json({ message: result[0].mensaje });
      } else {
          return res.status(404).json({ message: result[0].mensaje });
      }

  } catch (err) {
      console.error({ ERROR: err, RUTA: `/usuarios/${id}`, METODO: 'DELETE' });
      res.status(500).json({ message: 'Error al marcar el usuario como inactivo' });
  }
});

  
  


module.exports = app;