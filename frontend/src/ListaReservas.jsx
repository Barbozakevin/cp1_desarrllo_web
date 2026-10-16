import { useEffect, useState } from "react";

export default function ListaReservas() {
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  async function cargarReservas() {
    setCargando(true);
    setError("");

    try {
      const respuesta = await fetch(
        "http://localhost:3001/api/reservas"
      );

      if (!respuesta.ok) {
        throw new Error("Error al consultar las reservas.");
      }

      const datos = await respuesta.json();

      if (!Array.isArray(datos)) {
        throw new Error("La API devolvió un formato incorrecto.");
      }

      setReservas(datos);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarReservas();
  }, []);

  return (
    <section className="panel">
      <h1>Reservas registradas</h1>

      <button onClick={cargarReservas} disabled={cargando}>
        {cargando ? "Cargando..." : "Actualizar reservas"}
      </button>

      {error && (
        <p role="alert">
          No se pudieron cargar las reservas. Verifica el backend.
        </p>
      )}

      {!cargando && !error && reservas.length === 0 && (
        <p>Todavía no hay reservas registradas.</p>
      )}

      {!cargando && !error && (
        <div className="tarjetas">
          {reservas.map((reserva) => (
            <article key={reserva.id}>
              <h2>{reserva.nombre}</h2>
              <p><strong>Correo:</strong> {reserva.email}</p>
              <p><strong>Clase:</strong> {reserva.categoria}</p>
              <p><strong>Fecha:</strong> {reserva.fecha}</p>
              <p>{reserva.descripcion}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}