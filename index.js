const express = require('express');
 require('dotenv').config();
const app = express();




app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*"); // Actualiza esto para que coincida con el dominio desde el que se realizará la solicitud
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"); // Agrega "Authorization" aquí
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
  });
  


app.use(express.json());




// Keven
const roles = require('./routes/roles');
app.use('/api/roles', roles);

const usuarios = require('./routes/usuarios');
app.use('/api/usuarios', usuarios);

const tokens = require('./routes/tokens');
app.use('/api/tokens', tokens);

const auth = require('./routes/auth');
app.use('/api/auth', auth);

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


if(process.env.NODE_ENV !== 'development'){
app.listen(process.env.PORT, () => {
	console.log(`Servidor corriendo en modo produccion en el puerto ${process.env.PORT}`);
});
}else{
	app.listen(3000, () => {
		console.log(`Servidor corriendo en modo desarrollo en el puerto ${3000}`);
	});
}