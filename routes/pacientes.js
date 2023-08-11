const express = require('express');
const app = express.Router();
const db = require('../db/conn');

//  la tabla pacientes  con los campos id, nombre, telefono, email, fecha_nacimiento

const correogmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

// Insertar Pacientes

app.post('', async (req, res) => {
    const { nombre, telefono, email, fecha_nacimiento } = req.body;

// Esta parte son la validadciones 

    if (!nombre || nombre.trim() === '') {
        return res.status(400).json({message: 'Nombre es requerido y no puede estar en blanco'});
    }
    if (!email || email.trim() === '' || !correogmail.test(email)) {
        return res.status(400).json({message: 'Email es requerido, no puede estar en blanco y debe tener un formato válido'});
    }
    if (!fecha_nacimiento || new Date(fecha_nacimiento) > new Date()) {
        return res.status(400).json({message: 'Fecha de nacimiento es requerida y no puede estar en el futuro'});
    }

    try {
        // aqui insertamos un nuevo paciente en la base de datos
        await db.none('INSERT INTO tbl_pacientes (nombre, telefono, email, fecha_nacimiento) VALUES ($1, $2, $3, $4)', [nombre, telefono, email, fecha_nacimiento]);
    
        // Si la inserción es exitosa, respondemos con un estado 201
        res.status(201).json({message: 'Paciente creado '});
    } catch (err) {
        // En caso de error durante la inserción, mostramos el error 
        console.error(err);
        
        // aqui responde con un codigo 500 si hubo un error interno en el servidor 
        res.status(500).json({message: 'Error al crear el paciente'});
    }
    
});

// Actualizar paciente solo si esta activo

app.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, telefono, email, fecha_nacimiento } = req.body;

// Esta parte son la validadciones 

    if (!nombre || nombre.trim() === '') {
        return res.status(400).json({message: 'Nombre es requerido y no puede estar en blanco'});
    }
    if (!email || email.trim() === '' || !correogmail.test(email)) {
        return res.status(400).json({message: 'Email es requerido, no puede estar en blanco y debe tener un formato válido'});
    }
    if (!fecha_nacimiento || new Date(fecha_nacimiento) > new Date()) {
        return res.status(400).json({message: 'Fecha de nacimiento es requerida y no puede estar en el futuro'});
    }

    try {
         // aqui actualizamos un paciente en la base de datos
        const updated = await db.result('UPDATE tbl_pacientes SET nombre = $1, telefono = $2, email = $3, fecha_nacimiento = $4 WHERE id = $5 AND estado = true', [nombre, telefono, email, fecha_nacimiento, id]);
        
        if (updated.rowCount === 0) {
            return res.status(404).json({message: 'Paciente  Inactivo'});
        }
        
        res.status(200).json({message: 'Paciente actualizado '});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Error al actualizar el paciente'});
    }
});

// Optener Todos los pacientes activos

app.get('/', async (req, res) => {
    try {
        const pacientes = await db.manyOrNone('SELECT * FROM tbl_pacientes WHERE estado = true');
        res.status(200).json(pacientes);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Error al obtener los pacientes'});
    }
});

//Optener Paciente por id que este activo 

app.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const paciente = await db.oneOrNone('SELECT * FROM tbl_pacientes WHERE id = $1 AND estado = true', [id]);
        if (!paciente) {
            return res.status(404).json({message: 'Paciente no encontrado'});
        }
        res.status(200).json(paciente);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Error al obtener el paciente'});
    }
});

// Metodo Eliminar que solo desactiva a los pacientes
app.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updated = await db.result('UPDATE tbl_pacientes SET estado = false, fecha_borrado = CURRENT_TIMESTAMP WHERE id = $1', [id]);
        if (updated.rowCount === 0) {
            return res.status(404).json({message: 'Paciente no encontrado'});
        }
        res.status(200).json({message: 'Paciente desactivado exitosamente'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Error al desactivar el paciente'});
    }
});







module.exports = app;