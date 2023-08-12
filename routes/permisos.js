const express = require('express');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();
const app = express();
const port = process.env.PORT || 3001;

const db = pgp('postgres://username:password@localhost/dbname');

app.use(bodyParser.json());

// Ruta para obtener todas las rutas
app.get('/api/permisos', async (req, res) => {
  try {
    const permisos = await db.any('SELECT * FROM tbl_permisos');
    res.json(permisos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener permisos' });
  }
});

// Ruta para crear un nuevo permiso
app.post('/api/permisos', async (req, res) => {
  const { id_ruta, id_rol } = req.body;
  try {
    await db.none('INSERT INTO tbl_permisos(id_ruta, id_rol) VALUES($1, $2)', [id_ruta, id_rol]);
    res.json({ message: 'Permiso creado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear permiso' });
  }
});

// Ruta para actualizar un permiso
app.put('/api/permisos/:id', async (req, res) => {
  const id = req.params.id;
  const { id_ruta, id_rol } = req.body;
  try {
    await db.none('UPDATE tbl_permisos SET id_ruta=$1, id_rol=$2 WHERE id=$3', [id_ruta, id_rol, id]);
    res.json({ message: 'Permiso actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar permiso' });
  }
});

// Ruta para eliminar un permiso
app.delete('/api/permisos/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await db.none('DELETE FROM tbl_permisos WHERE id=$1', [id]);
    res.json({ message: 'Permiso eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar permiso' });
  }
});

app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});
