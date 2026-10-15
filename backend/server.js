const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

const app = express();
const archivo = path.join(__dirname, "reservas.json");

app.use(cors());
app.use(express.json());

if (!fs.existsSync(archivo)) {
  fs.writeFileSync(archivo, "[]");
}

app.get("/", (req, res) => {
  res.json({
    mensaje: "Backend de SportClass funcionando"
  });
});

app.get("/api/reservas", (req, res) => {
  try {
    const reservas = JSON.parse(
      fs.readFileSync(archivo, "utf8")
    );

    res.json(reservas);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al consultar las reservas"
    });
  }
});

app.post("/api/reservas", (req, res) => {
  const {
    nombre,
    email,
    descripcion,
    fecha,
    categoria
  } = req.body || {};

  const campos = [
    nombre,
    email,
    descripcion,
    fecha,
    categoria
  ];

  if (campos.some(campo =>
    typeof campo !== "string" || !campo.trim()
  )) {
    return res.status(400).json({
      mensaje: "Todos los campos son obligatorios"
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({
      mensaje: "El correo electrónico no es válido"
    });
  }

  try {
    const reservas = JSON.parse(
      fs.readFileSync(archivo, "utf8")
    );

    const nuevaReserva = {
      id: randomUUID(),
      nombre: nombre.trim(),
      email: email.trim(),
      descripcion: descripcion.trim(),
      fecha: fecha.trim(),
      categoria: categoria.trim()
    };

    reservas.push(nuevaReserva);

    fs.writeFileSync(
      archivo,
      JSON.stringify(reservas, null, 2)
    );

    res.status(201).json(nuevaReserva);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al guardar la reserva"
    });
  }
});

app.listen(3001, () => {
  console.log("Servidor en http://localhost:3001");
});