
// importamos express
const express = require('express');
// creamos un nuevo router de express para exportarlo al final del archivo
const app = express.Router();
// importamos la conexion de la base de datos
const db = require('../db/conn');
// importamos el error para mostrar errores de consola
const { error } = require('console');


// metodo crear post

// definimos la funcion como asincrona ya que haremos una consulta que tomara tiempo en la base de datos

app.post('/', async (req, res) => {
    // extraemos el nombre del body de la request
    const { nombre } = req.body;
    // validamos que el campo no venga vacio y con el metodo trim quitamos espacios
    if (!nombre || nombre.trim() === '') {

        // luega de la validacion enviamos un status 400 que significa que el body vino mal y mandamos el mensaje respectivo
      return res.status(400).json({message: 'Nombre es requerido y no puede estar en blanco'});
    }
    // utilizamos un try catch al hacer la consulta a la base de datos para mandar un status 500 error del lado del servidor al realizar la peticion
    try {
        // usamos await antes de hacer la consulta para que el codigo en ejecucion se espere
        // pasamos el query como parametro y el arreglo en este caso con un solo valor
      await db.none('INSERT INTO tbl_roles (nombre) VALUES ($1)', [nombre]);
      // si el rol fue creado mandamos un 201 para decir que todo fue bien y el cuerpo del mensaje
      res.status(201).json({message: 'Rol creado exitosamente'});
    } catch (err) {
        // capturamos el error en consola y le asignamos la ruta para saber donde verlo en el backend
      console.error({ERROR: error, RUTA: '/roles', METODP: 'POST'});
      // enviamos status 500 y el mensaje de error al crear el rol al lado del cliente
      res.status(500).json({message: 'Error al crear el rol'});
    }
  });
  

  // Método para obtener todos los roles activos (GET)
app.get('/', async (req, res) => {
    try {
      // Consultamos todos los roles activos en la base de datos
      const roles = await db.manyOrNone('SELECT * FROM tbl_roles WHERE activo = true');
      // Enviamos un estado 200 con los roles obtenidos
      res.status(200).json(roles);
    } catch (err) {
      // Capturamos el error y mostramos la información en la consola
      console.error({ERROR: err, RUTA: '/roles', METODO: 'GET'});
      // Enviamos un estado 500 indicando un error en el servidor
      res.status(500).json({message: 'Error al obtener los roles'});
    }
  });
  
  
// Método para obtener un rol específico por ID (GET)
app.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      // Consultamos el rol por ID y verificamos que esté activo
      const rol = await db.oneOrNone('SELECT * FROM tbl_roles WHERE id = $1 AND activo = true', [id]);
      if (!rol) {
        // Si el rol no existe o no está activo, enviamos un estado 404
        return res.status(404).json({message: 'Rol no encontrado'});
      }
      // Enviamos un estado 200 con la información del rol
      res.status(200).json(rol);
    } catch (err) {
      // Capturamos el error y mostramos la información en la consola
      console.error({ERROR: err, RUTA: `/roles/${id}`, METODO: 'GET'});
      // Enviamos un estado 500 indicando un error en el servidor
      res.status(500).json({message: 'Error al obtener el rol'});
    }
  });
  

  
// Método para actualizar un rol (PUT)
app.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    // Validamos que el campo nombre no esté vacío y sin espacios
    if (!nombre || nombre.trim() === '') {
      // Si el nombre no es válido, enviamos un estado 400
      return res.status(400).json({message: 'Nombre es requerido y no puede estar en blanco'});
    }
    try {
      // Actualizamos el nombre del rol en la base de datos solo si está activo
      const updated = await db.result('UPDATE tbl_roles SET nombre = $1 WHERE id = $2 AND activo = true', [nombre, id]);
      if (updated.rowCount === 0) {
        // Si el rol no existe o no está activo, enviamos un estado 404
        return res.status(404).json({message: 'Rol no encontrado o no está activo'});
      }
      // Enviamos un estado 200 indicando que el rol se actualizó correctamente
      res.status(200).json({message: 'Rol actualizado exitosamente'});
    } catch (err) {
      // Capturamos el error y mostramos la información en la consola
      console.error({ERROR: err, RUTA: `/roles/${id}`, METODO: 'PUT'});
      // Enviamos un estado 500 indicando un error en el servidor
      res.status(500).json({message: 'Error al actualizar el rol'});
    }
  });
  
  
  

 // Método para marcar un rol como inactivo (DELETE)
app.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      // Actualizamos el estado del rol a inactivo y agregamos la fecha de borrado
      const updated = await db.result('UPDATE tbl_roles SET activo = false, fecha_borrado = CURRENT_TIMESTAMP WHERE id = $1', [id]);
      if (updated.rowCount === 0) {
        // Si el rol no existe, enviamos un estado 404
        return res.status(404).json({message: 'Rol no encontrado'});
      }
      // Enviamos un estado 200 indicando que el rol se marcó como inactivo correctamente
      res.status(200).json({message: 'Rol marcado como inactivo exitosamente'});
    } catch (err) {
      // Capturamos el error y mostramos la información en la consola
      console.error({ERROR: err, RUTA: `/roles/${id}`, METODO: 'DELETE'});
      // Enviamos un estado 500 indicando un error en el servidor
      res.status(500).json({message: 'Error al marcar el rol como inactivo'});
    }
  });
  

  
 // Método para restaurar un rol (PUT)
app.put('/restore/:id', async (req, res) => {
    const { id } = req.params;
    try {
      // Actualizamos el estado del rol a activo y removemos la fecha de borrado
      const updated = await db.result('UPDATE tbl_roles SET activo = true, fecha_borrado = NULL WHERE id = $1', [id]);
      if (updated.rowCount === 0) {
        // Si el rol no existe, enviamos un estado 404
        return res.status(404).json({message: 'Rol no encontrado'});
      }
      // Enviamos un estado 200 indicando que el rol fue restaurado correctamente
      res.status(200).json({message: 'Rol restaurado exitosamente'});
    } catch (err) {
      // Capturamos el error y mostramos la información en la consola
      console.error({ERROR: err, RUTA: `/roles/restore/${id}`, METODO: 'PUT'});
      // Enviamos un estado 500 indicando un error en el servidor
      res.status(500).json({message: 'Error al restaurar el rol'});
    }
  });
  
  
  


module.exports = app;