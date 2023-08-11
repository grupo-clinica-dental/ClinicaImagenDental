const pgp = require('pg-promise')();
const cn = 'postgresql://postgres:D@ns3r190s@localhost:5432/clinica_dental';
const db = pgp(cn);

db.connect()
.then ( ()=>{

    console.log("Conexion exitosa con Postgres");

})
.catch ( (error)=>{


    console.log(error);

} );

module.exports = db;