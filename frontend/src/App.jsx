import Formulario from "./Formulario";
import ListaReservas from "./ListaReservas";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Link,
} from "react-router-dom";
import "./App.css";

function Menu() {
  return (
    <header>
      <Link className="logo" to="/">SportClass</Link>

      <nav>
        <NavLink to="/" end>Inicio</NavLink>
        <NavLink to="/registro">Reservar</NavLink>
        <NavLink to="/lista">Reservas</NavLink>
      </nav>
    </header>
  );
}

function Inicio() {
  return (
    <section className="bienvenida">
      <span className="etiqueta">ACTÍVATE CON SPORTCLASS</span>
      <h1>Tu próxima clase deportiva empieza aquí</h1>
      <p>
        Elige tu actividad favorita y registra tu reserva
        de forma sencilla.
      </p>

      <Link className="boton" to="/registro">
        Reservar una clase
      </Link>

      <div className="tarjetas">
        <article>
          <h2>Fútbol</h2>
          <p>Entrena y mejora tus habilidades en equipo.</p>
        </article>

        <article>
          <h2>Natación</h2>
          <p>Desarrolla tu resistencia y técnica en el agua.</p>
        </article>

        <article>
          <h2>Baloncesto</h2>
          <p>Practica tus lanzamientos y coordinación.</p>
        </article>
      </div>
    </section>
  );
}

function Registro() {
  return (
    <section className="panel">
      <h1>Reserva tu clase</h1>
      <p>Aquí se integrará el formulario de reservas.</p>
    </section>
  );
}

function Lista() {
  return (
    <section className="panel">
      <h1>Reservas registradas</h1>
      <p>Aquí se integrará la consulta de reservas de la API.</p>
    </section>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Menu />

      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/registro" element={<Formulario />} />
          <Route path="/lista" element={<ListaReservas />} />
          <Route
            path="*"
            element={<p>Página no encontrada. Vuelve al inicio.</p>}
          />
        </Routes>
      </main>

      <footer>SportClass · Reserva de clases deportivas</footer>
    </BrowserRouter>
  );
}