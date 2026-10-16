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
    <header className="site-header">
      <Link className="logo" to="/" aria-label="SportClass, ir al inicio">
        <img src="/sportclass-icon.png" alt="" />
        <span>Sport<span>Class</span></span>
      </Link>

      <nav aria-label="Navegación principal">
        <NavLink to="/" end>Inicio</NavLink>
        <NavLink to="/registro">Reservar</NavLink>
        <NavLink to="/lista">Reservas</NavLink>
      </nav>
    </header>
  );
}

function Inicio() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">MUÉVETE A TU MANERA</span>
        <h1>Tu próxima clase deportiva empieza aquí</h1>
        <p>
          Encuentra tu espacio, elige una fecha y reserva tu lugar. En
          SportClass, organizarte para hacer lo que te gusta es más fácil.
        </p>
        <div className="hero-benefits">
          <span><b aria-hidden="true">✓</b> Fácil de reservar</span>
          <span><b aria-hidden="true">✓</b> A tu ritmo</span>
        </div>
      </div>

      <aside className="hero-card" aria-label="Ventajas de reservar una clase">
        <div className="pulse-icon" aria-hidden="true">
          <svg viewBox="0 0 48 48" fill="none">
            <path d="M5 25h10l6-15 9 29 6-14h7" />
          </svg>
        </div>
        <span className="eyebrow">HOY ES UN BUEN DÍA</span>
        <h2>Haz tiempo para ti</h2>
        <ul>
          <li><span aria-hidden="true">✓</span> Elige cuándo</li>
          <li><span aria-hidden="true">✓</span> Escoge tu clase</li>
          <li><span aria-hidden="true">✓</span> Disfruta el momento</li>
        </ul>
        <p className="hero-note"><span aria-hidden="true">✦</span> Tu próxima aventura te espera</p>
      </aside>
      <div className="hero-orbit" aria-hidden="true" />
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
            element={<p className="not-found">Página no encontrada. Vuelve al inicio.</p>}
          />
        </Routes>
      </main>

      <footer className="site-footer">SportClass <span>·</span> Reserva de clases deportivas</footer>
    </BrowserRouter>
  );
}
