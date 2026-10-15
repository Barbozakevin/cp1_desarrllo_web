import { useState } from "react";

const inicial = {
  nombre: "",
  email: "",
  descripcion: "",
  fecha: "",
  categoria: "",
};

export default function Formulario() {
  const [datos, setDatos] = useState(inicial);
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  function cambiar(evento) {
    const { name, value } = evento.target;

    setDatos({ ...datos, [name]: value });
    setMensaje("");
  }

  async function guardar(evento) {
    evento.preventDefault();

    if (Object.values(datos).some(valor => !valor.trim())) {
      setMensaje("Completa todos los campos.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) {
      setMensaje("Ingresa un correo electrónico válido.");
      return;
    }

    setEnviando(true);
    setMensaje("");

    try {
      const respuesta = await fetch(
        "http://localhost:3001/api/reservas",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        }
      );

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(resultado.mensaje || "No se pudo guardar.");
        return;
      }

      setMensaje("¡Reserva registrada correctamente!");
      setDatos(inicial);
    } catch {
      setMensaje("No se pudo conectar con el servidor.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="panel">
      <h1>Reserva tu clase</h1>

      <form onSubmit={guardar} noValidate>
        <label htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          name="nombre"
          value={datos.nombre}
          onChange={cambiar}
          required
        />

        <label htmlFor="email">Correo electrónico</label>
        <input
          id="email"
          name="email"
          type="email"
          value={datos.email}
          onChange={cambiar}
          required
        />

        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={datos.descripcion}
          onChange={cambiar}
          required
        />

        <label htmlFor="fecha">Fecha de la clase</label>
        <input
          id="fecha"
          name="fecha"
          type="date"
          value={datos.fecha}
          onChange={cambiar}
          required
        />

        <label htmlFor="categoria">Categoría</label>
        <select
          id="categoria"
          name="categoria"
          value={datos.categoria}
          onChange={cambiar}
          required
        >
          <option value="">Selecciona una categoría</option>
          <option value="Futbol">Fútbol</option>
          <option value="Natacion">Natación</option>
          <option value="Baloncesto">Baloncesto</option>
        </select>

        <button type="submit" disabled={enviando}>
          {enviando ? "Guardando..." : "Guardar reserva"}
        </button>

        <p role="status">{mensaje}</p>
      </form>
    </section>
  );
}