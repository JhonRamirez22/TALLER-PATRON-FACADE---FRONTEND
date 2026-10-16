import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { agregarServicio, checkIn, checkOut, obtenerReserva } from '../api/hotelApi.js'
import ErrorBanner from '../components/ErrorBanner.jsx'
import Icon from '../components/Icon.jsx'
import Loading from '../components/Loading.jsx'
import ServiciosPanel from '../components/ServiciosPanel.jsx'
import { localDate, money } from '../utils/format.js'

const statusLabel = { CONFIRMADA: 'Reserva confirmada', CHECKIN: 'En estancia', CHECKOUT: 'Estancia finalizada' }

export default function ReservaPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [reservation, setReservation] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setError('')
    try { setReservation(await obtenerReserva(id)) }
    catch (problem) { setError(problem.message) }
  }, [id])

  useEffect(() => { load() }, [load])

  async function perform(action, serviceType) {
    setBusy(true)
    setError('')
    try {
      if (action === 'service') setReservation(await agregarServicio(id, serviceType))
      if (action === 'checkin') setReservation(await checkIn(id))
      if (action === 'checkout') {
        await checkOut(id)
        navigate(`/reserva/${id}/factura`)
      }
    } catch (problem) { setError(problem.message) }
    finally { setBusy(false) }
  }

  if (!reservation) return <div className="page page-state"><ErrorBanner>{error}</ErrorBanner>{!error && <Loading label="Abriendo tu reserva" />}<Link className="back-link" to="/">Inicio</Link></div>

  return (
    <div className="page page-reservation">
      <Link className="back-link" to="/">Inicio</Link>
      <section className="reservation-heading"><div><h1>Detalles de <em>reserva.</em></h1><p>Consulta la estancia y completa las acciones disponibles.</p><span className="reservation-reference">Reserva {reservation.id.slice(0, 8).toUpperCase()}</span></div><span className={`status-pill status-${reservation.estado.toLowerCase()}`}><i />{statusLabel[reservation.estado]}</span></section>
      <ErrorBanner>{error}</ErrorBanner>
      <div className="reservation-layout">
        <div className="reservation-main">
          <section className="stay-card panel-section">
            <div className="section-heading"><h2>Habitación y huésped</h2><span className="room-number">{reservation.habitacion.numero}</span></div>
            <div className="stay-facts"><div><span>TIPO DE HABITACIÓN</span><strong>{reservation.habitacion.tipo}</strong></div><div><span>ENTRADA</span><strong>{localDate(reservation.fechaEntrada)}</strong></div><div><span>SALIDA</span><strong>{localDate(reservation.fechaSalida)}</strong></div><div><span>HUÉSPED</span><strong>{reservation.huesped.nombre}</strong></div></div>
          </section>
          <ServiciosPanel reservation={reservation} busy={busy} onAdd={(type) => perform('service', type)} />
          {reservation.estado === 'CHECKIN' && <section className="key-panel"><span className="key-icon"><Icon name="key" /></span><div><h2>Llave digital</h2><p>Disponible durante tu estancia. Al finalizar el check-out dejará de ser válida.</p><code>{reservation.llaveDigital}</code></div></section>}
          {reservation.factura && <Link className="button button-outline" to={`/reserva/${id}/factura`}>Ver factura final <Icon name="arrow" /></Link>}
        </div>
        <aside className="reservation-aside">
          <h2>Resumen</h2>
          <div className="summary-line"><span>{reservation.noches} {reservation.noches === 1 ? 'noche' : 'noches'}</span><strong>{money(reservation.totalHabitacion)}</strong></div>
          <div className="summary-line"><span>Servicios ({reservation.servicios.length})</span><strong>{money(reservation.totalServicios)}</strong></div>
          <div className="summary-total"><span>Total parcial</span><strong>{money(reservation.totalParcial)}</strong></div>
          {reservation.estado === 'CONFIRMADA' && <button className="button button-primary button-full" disabled={busy} onClick={() => perform('checkin')}>{busy ? 'Procesando…' : 'Hacer check-in'} <Icon name="arrow" /></button>}
          {reservation.estado === 'CHECKIN' && <button className="button button-primary button-full" disabled={busy} onClick={() => perform('checkout')}>{busy ? 'Preparando factura…' : 'Hacer check-out'} <Icon name="arrow" /></button>}
          {reservation.estado === 'CHECKOUT' && <Link className="button button-primary button-full" to={`/reserva/${id}/factura`}>Ver factura <Icon name="arrow" /></Link>}
          <p className="aside-note">El equipo de recepción puede ayudarte si lo necesitas.</p>
        </aside>
      </div>
    </div>
  )
}
