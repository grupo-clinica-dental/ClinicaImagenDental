const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors());



// Keven
const roles = require('./routes/roles');
app.use('/api/roles', roles);

const usuarios = require('./routes/usuarios');
app.use('/api/usuarios', usuarios);

const tokens = require('./routes/tokens');
app.use('/api/tokens', tokens);

//Jorge
const tipoMensaje = require('./routes/tipoMensaje');
app.use('/api/tipoMensaje', tipoMensaje);

const mensaje = require('./routes/mensaje');
app.use('/api/mensaje', mensaje);

//Griselda

const pacientes = require('./routes/pacientes');
app.use('/api/pacientes', pacientes);

const citas = require('./routes/citas');
app.use('/api/citas', citas);

//Cristian

const doctores = require('./routes/doctores');
app.use('/api/doctores', doctores);

const especialidades = require('./routes/especialidades');
app.use('/api/especialidades', especialidades);

// Marcos 

const estadoCita = require('./routes/estadoCita');
app.use('/api/estadoCita', estadoCita);

const doctoresEspecialidades = require('./routes/doctoresEspecialidades');
app.use('/api/doctoresEspecialidades', doctoresEspecialidades);

//David 

const rutas = require('./routes/rutas');
app.use('/api/rutas', rutas)

const permisos = require('./routes/permisos');
app.use('/api/permisos', permisos)

const archivos = require('./routes/archivos');
app.use('/api/archivos',archivos );



app.listen(3000);