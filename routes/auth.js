const express = require("express");
const app = express.Router();
const db = require ('../db/conn');  
const getNewResponseApi = require('./../utils/createApiResponse');
const jwt = require('jsonwebtoken');

const loginHandler = async (req, res) => {
  const response = getNewResponseApi();

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ ...response, message: "Faltan campos por llenar" });
    }



    const query = `
    SELECT u.id, u.email, u.password, u.nombre, u.telefono, u.estado, r.nombre as rol
    FROM tbl_usuarios u
    INNER JOIN tbl_roles r ON u.rol_id = r.id
    WHERE u.email = $1`;
  
    const values = [email];
    const result = await db.any(query, values); // Changed from pool.query


    if (result.length <= 0) {
      return res
        .status(401)
        .json({ ...response, message: "Usuario no encontrado" });
    }

    const user = result[0];

    if (user.password !== password) {
      return res
        .status(401)
        .json({ ...response, message: "Contraseña incorrecta" });
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      telefono: user.telefono,
      estado: user.estado,
      rol: user.rol,
    };

    const token = jwt.sign(tokenPayload, "secret", {
      expiresIn: 60 * 60 * 24,
    });

    return res.status(200).json({
      ...response,
      message: "Usuario Autenticado con exito",
      data: { token : token, rol: user.rol, welcomeMessage: `Bienvenido ${user.nombre}` , profile: user },
      succeded: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ...response,
      message: "Problema en el autenticar en el lado del servidor",
    });
  }
};

app.post("/login", loginHandler);

module.exports = app;
// Compare this snippet from routes/usuarios.js:
