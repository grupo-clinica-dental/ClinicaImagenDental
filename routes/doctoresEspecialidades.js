const express = require("express");
const app = express.Router();
const db = require("../database/conn");

// OBTENER TODOS LOS DOCTORES_ESPECIOLIDADES

app.get("/", async (req, res) => {
  try {
    const doctoresEspecialidades = await db.manyOrNone(
      "SELECT * FROM tbl_doctor_especialidades"
    );

    res.status(200).json(doctoresEspecialidades);
  } catch (err) {
    console.error({
      ERROR: err,
      RUTA: "/doctoresEspecialidades",
      METODO: "GET",
    });

    res
      .status(500)
      .json({ message: "Error al obtener los doctoresEspecialidades" });
  }
});

// INGRESAR NUEVA doctoresEspecialidades
app.post("/", async (req, res) => {
  const { doctor_id, especialidad_id, estado, fecha_borrado } = req.body;

  try {
    await db.none(
      "INSERT INTO tbl_doctor_especialidades (doctor_id, especialidad_id, estado, fecha_borrado) VALUES ($1, $2, $3, $4)",
      [doctor_id, especialidad_id, estado, fecha_borrado]
    );

    res
      .status(201)
      .json({ message: "doctoresEspecialidades creado exitosamente" });
  } catch (err) {
    console.error({ err, RUTA: "/doctoresEspecialidades", METODP: "POST" });

    res
      .status(500)
      .json({ message: "Error al crear doctoresEspecialidades" });
  }
});

// ACTUALIZAR doctoresEspecialidades
app.put("/:especialidad_id", async (req, res) => {
  const { especialidad_id } = req.params;
  const { doctor_id } = req.body;

  try {
    await db.result(
      "UPDATE tbl_doctor_especialidades SET doctor_id= $1 WHERE especialidad_id = $2 ",
      [doctor_id, especialidad_id]
    );

    res
      .status(200)
      .json({ message: "doctoresEspecialidades actualizado exitosamente" });
  } catch (err) {
    console.error({
      err,
      RUTA: `/doctoresEspecialidades/${especialidad_id}`,
      METODO: "PUT",
    });

    res
      .status(500)
      .json({ message: "Error al actualizar doctoresEspecialidades" });
  }
});
// Desactivar doctoresEspecialidades
app.delete("/:especialidad_id", async (req, res) => {
  const { especialidad_id } = req.params;
  try {
    await db.result(
      "UPDATE tbl_doctor_especialidades SET estado = false, fecha_borrado = CURRENT_TIMESTAMP WHERE especialidad_id = $1",
      [especialidad_id]
    );

    res
      .status(200)
      .json({ message: "doctoresEspecialidades inactivado con exito" });
  } catch (err) {
    console.error({
      err,
      RUTA: `/doctoresEspecialidades/${especialidad_id}`,
      METODO: "DELETE",
    });

    res.status(500).json({
      message: "Error al marcar doctoresEspecialidades como inactivo",
    });
  }
});

module.exports = app;
