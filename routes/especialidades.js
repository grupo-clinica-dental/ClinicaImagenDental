const express = require('express');
const app = express();
const db = require('./db/conn');

app.get('', (req, res) => {
    
    let sql = ` SELECT * from tbl_especialidades; `;
     
     db.any(sql, e = e.id)
     .then(row => {
 
         if (row.length === 0) {
             res.status(404).json( {mensaje : "Sin datos"} )
         }else{
             res.json(rows);
         }
         
     })
     .catch( (error) => {
         res.status(500).json(error);
     });
 
 });











module.exports = app;