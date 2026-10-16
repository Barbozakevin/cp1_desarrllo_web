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

app.get("/api/reservas/:id", (req, res) => {
  try {
    const reservas = JSON.parse(fs.readFileSync(archivo, "utf8"));
    const reserva = reservas.find((item) => item.id === req.params.id);

    if (!reserva) {
      return res.status(404).json({ mensaje: "No se encontró la reserva" });
    }

    res.json(reserva);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al consultar la reserva" });
  }
});

app.post("/api/reservas", (req, res) => {
  const {
    nombre,
    email,
    clase,
    descripcion,
    fecha,
    categoria,
    franja,
    hora
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

    if (typeof clase === "string" && clase.trim()) {
      nuevaReserva.clase = clase.trim();
    }

    if (typeof franja === "string" && franja.trim()) {
      nuevaReserva.franja = franja.trim();
    }

    if (typeof hora === "string" && hora.trim()) {
      nuevaReserva.hora = hora.trim();
    }

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

app.put("/api/reservas/:id", (req, res) => {
  const {
    nombre,
    email,
    clase,
    categoria,
    descripcion,
    fecha,
    franja,
    hora
  } = req.body || {};

  const camposObligatorios = [nombre, email, clase, descripcion, fecha];

  if (camposObligatorios.some(campo =>
    typeof campo !== "string" || !campo.trim()
  )) {
    return res.status(400).json({
      mensaje: "Nombre, correo, clase, fecha y descripción son obligatorios"
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({
      mensaje: "El correo electrónico no es válido"
    });
  }

  const clasesPermitidas = ["Futbol", "Natacion", "Baloncesto"];
  const categoriasPermitidas = ["Principiante", "Intermedio", "Avanzado"];
  const horarios = {
    Mañana: ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00"],
    Tarde: ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
    Noche: ["18:00", "19:00", "20:00", "21:00"]
  };

  if (!clasesPermitidas.includes(clase.trim())) {
    return res.status(400).json({ mensaje: "La clase seleccionada no es válida" });
  }

  if (categoria !== undefined &&
      (typeof categoria !== "string" ||
       (categoria.trim() && !categoriasPermitidas.includes(categoria.trim())))) {
    return res.status(400).json({ mensaje: "La categoría seleccionada no es válida" });
  }

  if ((franja !== undefined && typeof franja !== "string") ||
      (hora !== undefined && typeof hora !== "string")) {
    return res.status(400).json({ mensaje: "El horario seleccionado no es válido" });
  }

  const franjaSeleccionada = franja?.trim();
  const horaSeleccionada = hora?.trim();
  if (Boolean(franjaSeleccionada) !== Boolean(horaSeleccionada) ||
      (franjaSeleccionada &&
       (!Object.hasOwn(horarios, franjaSeleccionada) ||
        !horarios[franjaSeleccionada].includes(horaSeleccionada)))) {
    return res.status(400).json({ mensaje: "El horario seleccionado no es válido" });
  }

  const fechaNormalizada = fecha.trim();
  const fechaParseada = new Date(`${fechaNormalizada}T00:00:00`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaNormalizada) ||
      Number.isNaN(fechaParseada.getTime()) ||
      fechaParseada.toISOString().slice(0, 10) !== fechaNormalizada) {
    return res.status(400).json({ mensaje: "La fecha no es válida" });
  }

  try {
    const reservas = JSON.parse(fs.readFileSync(archivo, "utf8"));
    const indice = reservas.findIndex((item) => item.id === req.params.id);

    if (indice === -1) {
      return res.status(404).json({ mensaje: "No se encontró la reserva" });
    }

    const reservaActualizada = {
      id: reservas[indice].id,
      nombre: nombre.trim(),
      email: email.trim(),
      clase: clase.trim(),
      descripcion: descripcion.trim(),
      fecha: fecha.trim(),
      ...(categoria?.trim() ? { categoria: categoria.trim() } : {}),
      ...(franjaSeleccionada ? { franja: franjaSeleccionada, hora: horaSeleccionada } : {})
    };

    reservas[indice] = reservaActualizada;
    fs.writeFileSync(archivo, JSON.stringify(reservas, null, 2));

    res.json(reservaActualizada);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar la reserva" });
  }
});

app.delete("/api/reservas/:id", (req, res) => {
  try {
    const reservas = JSON.parse(fs.readFileSync(archivo, "utf8"));
    const indice = reservas.findIndex((item) => item.id === req.params.id);

    if (indice === -1) {
      return res.status(404).json({ mensaje: "No se encontró la reserva" });
    }

    reservas.splice(indice, 1);
    fs.writeFileSync(archivo, JSON.stringify(reservas, null, 2));

    res.json({ mensaje: "Reserva eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar la reserva" });
  }
});

const puerto = process.env.PORT || 3001;
app.listen(puerto, () => {
  console.log(`Servidor en http://localhost:${puerto}`);
});