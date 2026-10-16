import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const inicial = {
  nombre: "",
  email: "",
  clase: "",
  categoria: "",
  fecha: "",
  franja: "",
  hora: "",
  descripcion: "",
};

const horarios = {
  Mañana: ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00"],
  Tarde: ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
  Noche: ["18:00", "19:00", "20:00", "21:00"],
};

const clases = ["Futbol", "Natacion", "Baloncesto"];
const categorias = ["Principiante", "Intermedio", "Avanzado"];

function fechaLocal() {
  const hoy = new Date();
  hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
  return hoy.toISOString().slice(0, 10);
}

export default function Formulario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = Boolean(id);
  const [datos, setDatos] = useState(inicial);
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [cargando, setCargando] = useState(editando);
  const [errorCarga, setErrorCarga] = useState("");
  const fechaRef = useRef(null);

  useEffect(() => {
    if (!id) return undefined;

    let activa = true;

    fetch(`http://localhost:3001/api/reservas/${encodeURIComponent(id)}`)
      .then(async (respuesta) => {
        const resultado = await respuesta.json();
        if (!respuesta.ok) {
          throw new Error(resultado.mensaje || "No se pudo cargar la reserva.");
        }
        return resultado;
      })
      .then((reserva) => {
        if (!activa) return;
        const clase = reserva.clase || (clases.includes(reserva.categoria) ? reserva.categoria : "");
        setDatos({
          nombre: reserva.nombre || "",
          email: reserva.email || "",
          clase,
          categoria: categorias.includes(reserva.categoria) ? reserva.categoria : "",
          fecha: reserva.fecha || "",
          franja: reserva.franja || "",
          hora: reserva.hora || "",
          descripcion: reserva.descripcion || "",
        });
      })
      .catch((error) => {
        if (activa) setErrorCarga(error.message);
      })
      .finally(() => {
        if (activa) setCargando(false);
      });

    return () => {
      activa = false;
    };
  }, [id]);

  function cambiar(evento) {
    const { name, value } = evento.target;
    setDatos((actuales) => ({
      ...actuales,
      [name]: value,
      ...(name === "franja" ? { hora: "" } : {}),
    }));
    setMensaje("");
  }

  function elegirFecha() {
    const campo = fechaRef.current;
    if (typeof campo?.showPicker === "function") {
      campo.showPicker();
    } else {
      campo?.focus();
    }
  }

  async function guardar(evento) {
    evento.preventDefault();

    const camposObligatorios = editando
      ? [datos.nombre, datos.email, datos.clase, datos.fecha, datos.descripcion]
      : Object.values(datos);

    if (camposObligatorios.some((valor) => !valor.trim())) {
      setMensaje("Completa todos los campos para continuar.");
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
        editando
          ? `http://localhost:3001/api/reservas/${encodeURIComponent(id)}`
          : "http://localhost:3001/api/reservas",
        {
          method: editando ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        }
      );

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(resultado.mensaje || "No se pudo guardar la reserva.");
        return;
      }

      if (editando) {
        navigate("/lista");
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
    <section className="page-section reservation-page">
      <div className="page-heading">
        <h1>{editando ? "Editar reserva" : "Nueva reserva"}</h1>
        <p>
          {editando
            ? "Actualiza los datos de la reserva y guarda los cambios."
            : "Complete los datos para solicitar su lugar en la clase."}
        </p>
      </div>

      {cargando && <p role="status">Cargando reserva...</p>}

      {errorCarga && (
        <div className="form-load-error" role="alert">
          <p>{errorCarga}</p>
          <Link to="/lista">Volver a mis reservas</Link>
        </div>
      )}

      {!cargando && !errorCarga && <form className="reservation-form" onSubmit={guardar} noValidate>
        <div className="field">
          <label htmlFor="nombre">Nombre del participante</label>
          <input
            id="nombre"
            name="nombre"
            placeholder="Ej: Ana Pérez"
            value={datos.nombre}
            onChange={cambiar}
            autoComplete="name"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="ana@correo.com"
            value={datos.email}
            onChange={cambiar}
            autoComplete="email"
            required
          />
        </div>

        <div className="field-grid">
          <div className="field">
            <label htmlFor="clase">Clase</label>
            <select
              id="clase"
              name="clase"
              value={datos.clase}
              onChange={cambiar}
              required
            >
              <option value="">Seleccione...</option>
              <option value="Futbol">Fútbol</option>
              <option value="Natacion">Natación</option>
              <option value="Baloncesto">Baloncesto</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="categoria">Categoría</label>
            <select
              id="categoria"
              name="categoria"
              value={datos.categoria}
              onChange={cambiar}
              required={!editando}
            >
              <option value="">Seleccione...</option>
              <option value="Principiante">Principiante</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="fecha">Fecha de la clase</label>
          <div className="date-control">
            <input
              ref={fechaRef}
              id="fecha"
              name="fecha"
              type="date"
              min={editando ? undefined : fechaLocal()}
              value={datos.fecha}
              onChange={cambiar}
              required
            />
            <button className="date-button" type="button" onClick={elegirFecha}>
              <span aria-hidden="true">▦</span> Elegir fecha
            </button>
          </div>
          <small>Escribe el día, el mes y el año; por ejemplo, 25/12/2026.</small>
        </div>

        <fieldset className="field time-field">
          <legend>Horario</legend>
          <div className="time-options">
            {Object.entries(horarios).map(([franja, horas]) => (
              <button
                className={datos.franja === franja ? "time-option selected" : "time-option"}
                key={franja}
                type="button"
                aria-pressed={datos.franja === franja}
                disabled={enviando}
                onClick={() => {
                  setDatos((actuales) => ({ ...actuales, franja, hora: "" }));
                  setMensaje("");
                }}
              >
                <strong>{franja}</strong>
                <span>{horas[0]} a {horas[horas.length - 1]}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <div className="field">
          <label htmlFor="hora">Hora de la clase</label>
          <select
            id="hora"
            name="hora"
            value={datos.hora}
            onChange={cambiar}
            disabled={!datos.franja || enviando}
            required={!editando}
          >
            <option value="">
              {datos.franja ? "Seleccione una hora..." : "Elija primero un horario"}
            </option>
            {horarios[datos.franja]?.map((hora) => (
              <option key={hora} value={hora}>{hora}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="descripcion">Descripción / observaciones</label>
          <textarea
            id="descripcion"
            name="descripcion"
            placeholder="Ej: Prefiero horario de mañana"
            value={datos.descripcion}
            onChange={cambiar}
            required
          />
        </div>

        <button className="submit-button" type="submit" disabled={enviando}>
          {enviando ? "Guardando..." : editando ? "Guardar cambios" : "Reservar clase"}
        </button>

        {mensaje && (
          <p className="form-message" role="status">{mensaje}</p>
        )}
        {editando && <Link className="cancel-edit-link" to="/lista">Cancelar</Link>}
      </form>}
    </section>
  );
}
