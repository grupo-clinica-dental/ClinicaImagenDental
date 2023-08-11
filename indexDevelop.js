const express = require('express');
const app = express();

app.use(express.json());

//Jorge
const tipoMensaje = require('./routes/tipoMensaje');
app.use('/api/tipoMensaje', tipoMensaje);

const mensaje = require('./routes/mensaje');
app.use('/api/mensaje', mensaje);


app.listen(3000);