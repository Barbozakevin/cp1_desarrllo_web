import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function nombreClase(reserva) {
  const clase = reserva.clase || reserva.categoria;
  const nombres = {
    Futbol: "Fútbol",
    Natacion: "Natación",
    Baloncesto: "Baloncesto",
  };
  return nombres[clase] || clase;
}

async function leerRespuestaApi(respuesta) {
  try {
    return await respuesta.json();
  } catch {
    throw new Error(
      "El backend no reconoce esta operación. Reinícialo desde la carpeta backend y vuelve a intentarlo."
    );
  }
}

export default function ListaReservas() {
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [errorAccion, setErrorAccion] = useState("");
  const [eliminandoId, setEliminandoId] = useState("");

  async function consultarReservas() {
    const respuesta = await fetch("http://localhost:3001/api/reservas");

    if (!respuesta.ok) {
      throw new Error("Error al consultar las reservas.");
    }

    const datos = await respuesta.json();

    if (!Array.isArray(datos)) {
      throw new Error("La API devolvió un formato incorrecto.");
    }

    return datos;
  }

  async function actualizarReservas() {
    setCargando(true);
    setError("");
    try {
      setReservas(await consultarReservas());
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }

  async function eliminarReserva(id) {
    if (!window.confirm("¿Seguro que quieres eliminar esta reserva? Esta acción no se puede deshacer.")) {
      return;
    }

    setErrorAccion("");
    setEliminandoId(id);

    try {
      const respuesta = await fetch(`http://localhost:3001/api/reservas/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const resultado = await leerRespuestaApi(respuesta);

      if (!respuesta.ok) {
        throw new Error(resultado.mensaje || "No se pudo eliminar la reserva.");
      }

      setReservas((actuales) => actuales.filter((reserva) => reserva.id !== id));
    } catch (error) {
      setErrorAccion(error.message || "No se pudo conectar con el servidor.");
    } finally {
      setEliminandoId("");
    }
  }

  useEffect(() => {
    let activa = true;

    consultarReservas()
      .then((datos) => {
        if (activa) setReservas(datos);
      })
      .catch((error) => {
        if (activa) setError(error.message);
      })
      .finally(() => {
        if (activa) setCargando(false);
      });

    return () => {
      activa = false;
    };
  }, []);

  return (
    <section className="page-section reservations-page">
      <div className="list-heading">
        <div className="page-heading">
          <h1>Mis reservas</h1>
          <p>Consulta las clases que tienes programadas.</p>
        </div>
        <button className="refresh-button" onClick={actualizarReservas} disabled={cargando}>
          {cargando ? "Cargando..." : "Actualizar reservas"}
        </button>
      </div>

      {error && (
        <p className="list-message error-message" role="alert">
          {error}
        </p>
      )}

      {errorAccion && (
        <p className="list-message error-message" role="alert">{errorAccion}</p>
      )}

      {!cargando && !error && reservas.length === 0 && (
        <div className="empty-state">
          <div aria-hidden="true">▦</div>
          <h2>Aún no tienes reservas</h2>
          <p>Cuando reserves una clase, la verás aquí.</p>
        </div>
      )}

      {!cargando && !error && reservas.length > 0 && (
        <div className="reservation-list">
          {reservas.map((reserva) => (
            <article className="reservation-card" key={reserva.id}>
              <div className="reservation-card-top">
                <span className="class-badge">{nombreClase(reserva)}</span>
                <span className="reservation-date">
                  {reserva.fecha ? new Date(`${reserva.fecha}T00:00:00`).toLocaleDateString("es", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }) : "Fecha sin definir"}
                </span>
              </div>
              <h2>{reserva.nombre}</h2>
              <p>{reserva.email}</p>
              {reserva.categoria && reserva.clase && (
                <p><strong>Categoría:</strong> {reserva.categoria}</p>
              )}
              {(reserva.franja || reserva.hora) && (
                <p><strong>Horario:</strong> {[reserva.franja, reserva.hora].filter(Boolean).join(" · ")}</p>
              )}
              {reserva.descripcion && (
                <p className="reservation-description">{reserva.descripcion}</p>
              )}
              <div className="reservation-actions">
                <Link className="edit-reservation-button" to={`/reservas/${encodeURIComponent(reserva.id)}/editar`}>
                  Editar reserva
                </Link>
                <button
                  className="delete-reservation-button"
                  type="button"
                  onClick={() => eliminarReserva(reserva.id)}
                  disabled={Boolean(eliminandoId)}
                >
                  {eliminandoId === reserva.id ? "Eliminando..." : "Eliminar reserva"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
