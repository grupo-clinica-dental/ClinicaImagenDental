const express = require('express');
const app = express.Router();
const db = require('../db/conn');
const multer = require ('multer');

const storage = multer.memoryStorage();
const upload = multer({storage});

app.post('/', upload.single('pepito'),  (req, res)=>{


    if(!req.file){

        return res.status(500).json(  {error:"Debes mandar un archivo"} );

    }

   

    const valores = [

        req.file.originalname, 
        req.file.mimetype, 
        req.file.buffer

    ];

    let sql = `select * from fn_archivos_post($1, $2, $3)  `;

    db.any( sql, valores )
    .then( rows=>{

            res.json(rows);

        }
    )
    .catch( error=>{

        res.status(500).json(error);

    } )

});

app.get('/:id', (req, res)=>{


    let sql = ` select  a.nombre_archivo, 
                        a.mime_type, 
                        encode(a.archivo, 'base64')  as archivo 
                    from    tbl_archivos a 
                    where   a.id =  $1 `;


    db.any( sql, [req.params.id] ) 
    .then( rows=>{

        res.json(rows);

    })
    .catch( error=>{

        res.status(500).json(error);

    })


});

module.exports = app;