import { Link, Route, Routes } from 'react-router-dom'
import BuscarPage from './pages/BuscarPage.jsx'
import ReservarPage from './pages/ReservarPage.jsx'
import ReservaPage from './pages/ReservaPage.jsx'
import FacturaPage from './pages/FacturaPage.jsx'

export default function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/" aria-label="Hotel, inicio">
          <span className="brand-mark" aria-hidden="true">H</span>
          <span>Hotel<span className="brand-dot">.</span></span>
        </Link>
        <div className="topbar-note"><span className="status-dot" /> RESERVAS Y ESTANCIAS</div>
        <Link className="topbar-link" to="/">Buscar habitación</Link>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<BuscarPage />} />
          <Route path="/reservar" element={<ReservarPage />} />
          <Route path="/reserva/:id" element={<ReservaPage />} />
          <Route path="/reserva/:id/factura" element={<FacturaPage />} />
          <Route path="*" element={<BuscarPage />} />
        </Routes>
      </main>
      <footer className="site-footer"><span>HOTEL · GESTIÓN DE RESERVAS</span><span>Precios y disponibilidad calculados por el servidor.</span></footer>
    </div>
  )
}
