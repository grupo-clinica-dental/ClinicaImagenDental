
const pgp = require('pg-promise')();

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const database = process.env.DB_NAME;


const cn = `postgresql://${user}:${password}@${host}:${port}/${database}`;

const db = pgp(cn);

db.connect()
  .then(() => {
    if(process.env.NODE_ENV === 'development'){
        console.log("Conexión exitosa con Postgres");

    }else{
        console.log('base de datos conectada')
    }
  })
  .catch((error) => {
    console.log(error);
  });

module.exports = db;
