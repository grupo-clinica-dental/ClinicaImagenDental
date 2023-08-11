const express = require('express');
const app = express();
app.use(express.json());

const doctores = require('./routes/doctores');
app.use('/api/doctores', doctores);

const roles = require('./routes/roles');
app.use('/api/roles', roles);

const usuarios = require('./routes/usuarios');
app.use('/api/usuarios', usuarios);

const tokens = require('./routes/tokens');
app.use('/api/tokens', tokens);


app.listen(3000);