const express = require('express');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();
const app = express();
const port = process.env.PORT || 3000;

// Configuración de pg-promise para conectar a la base de datos
const db = pgp('postgres://username:Demacia2003localhost/clinica_dental');

app.use(bodyParser.json());

// Ruta para obtener todas las rutas
app.get('/rutas', async (req, res) => {
  try {
    const rutas = await db.any('SELECT * FROM tbl_rutas');
    res.json(rutas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener rutas' });
  }
});

// Ruta para crear una nueva ruta
app.post('/rutas', async (req, res) => {
  const { string_ruta } = req.body;
  try {
    await db.none('INSERT INTO tbl_rutas(string_ruta) VALUES($1)', [string_ruta]);
    res.json({ message: 'Ruta creada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear ruta' });
  }
});

app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});

// Actualizar una ruta
app.put('/rutas/:id', async (req, res) => {
    const id = req.params.id;
    const { string_ruta } = req.body;
    try {
      await db.none('UPDATE tbl_rutas SET string_ruta=$1 WHERE id=$2', [string_ruta, id]);
      res.json({ message: 'Ruta actualizada exitosamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar ruta' });
    }
  });
  
  // Eliminar una ruta
  app.delete('/rutas/:id', async (req, res) => {
    const id = req.params.id;
    try {
      await db.none('DELETE FROM tbl_rutas WHERE id=$1', [id]);
      res.json({ message: 'Ruta eliminada exitosamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar ruta' });
    }
  });
  
  app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}`);
  });