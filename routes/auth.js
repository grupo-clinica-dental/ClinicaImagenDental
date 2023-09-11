import jwt from "jsonwebtoken";
import pool from "../../database";
import { getNewResponseApi } from "../utils/createApiResponse";

export const loginHandler = async (req, res) => {
  const response = getNewResponseApi();

  try {
    const { email, password } = req.body;

    const query = `
      SELECT u.id, u.email, u.password, u.nombre, u.telefono, u.estado, r.nombre as rol
      FROM tbl_usuarios u
      INNER JOIN tbl_roles r ON u.id_rol = r.id
      WHERE u.email = $1`;
    const values = [email];
    const result = await pool.query(query, values);

    if (result.rows.length <= 0) {
      return res
        .status(401)
        .json({ ...response, message: "No Autorizado para obtener el perfil" });
    }

    const user = result.rows[0];
    // Verifica la contraseña (asumiendo que es en texto plano, lo cual no es seguro. Deberías cifrarla.)
    if (user.password !== password) {
      return res
        .status(401)
        .json({ ...response, message: "Contraseña incorrecta" });
    }

    // Crear el payload del token sin incluir la contraseña
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
      data: { token, rol: user.rol },
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
