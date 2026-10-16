import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { crearReserva } from '../api/hotelApi.js'
import ErrorBanner from '../components/ErrorBanner.jsx'
import Icon from '../components/Icon.jsx'
import { money, localDate, todayString } from '../utils/format.js'

export default function ReservarPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [guest, setGuest] = useState({ nombre: '', documento: '', email: '', telefono: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [conflict, setConflict] = useState(false)
  const room = state?.room

  function update(field, value) { setGuest((current) => ({ ...current, [field]: value })) }

  async function submit(event) {
    event.preventDefault()
    const hasDates = Boolean(state?.entrada && state?.salida)
    const nights = hasDates
      ? (Date.parse(`${state.salida}T00:00:00Z`) - Date.parse(`${state.entrada}T00:00:00Z`)) / 86_400_000
      : Number.NaN
    if (!room || !hasDates || !Number.isInteger(nights) || nights < 1 || state.salida <= state.entrada || state.entrada < todayString() || nights > 30) {
      setError('Las fechas de la estancia ya no son válidas. Busca de nuevo.')
      return
    }
    setBusy(true)
    setError('')
    setConflict(false)
    try {
      const reservation = await crearReserva({
        habitacionId: room.id,
        fechaEntrada: state.entrada,
        fechaSalida: state.salida,
        huesped: guest,
      })
      navigate(`/reserva/${reservation.id}`)
    } catch (problem) {
      setConflict(problem.status === 409)
      setError(problem.status === 409
        ? 'La habitación dejó de estar disponible. Busca de nuevo para ver las opciones actuales.'
        : problem.message)
    } finally {
      setBusy(false)
    }
  }

  if (!room) return <div className="page"><div className="empty-state page-empty"><Icon name="door" className="empty-icon" /><h1>Elige una habitación primero.</h1><p>Busca fechas disponibles para iniciar tu reserva.</p><Link className="button button-primary" to="/">Volver a buscar</Link></div></div>

  return (
    <div className="page page-booking">
      <Link className="back-link" to="/"><Icon name="arrowLeft" /> Volver a habitaciones</Link>
      <section className="form-intro"><h1>Datos del <em>huésped.</em></h1><p>Completa la información de la persona responsable de la reserva.</p></section>
      <div className="booking-layout">
        <form className="guest-form panel-section" onSubmit={submit}>
          <div className="section-heading"><h2>Información de contacto</h2><span className="step-indicator">01 / 01</span></div>
          <div className="form-grid">
            <label className="field field-wide"><span>Nombre completo</span><input autoComplete="name" maxLength="100" required value={guest.nombre} onChange={(event) => update('nombre', event.target.value)} placeholder="Como aparece en tu documento" /></label>
            <label className="field"><span>Documento de identidad</span><input autoComplete="off" maxLength="100" required value={guest.documento} onChange={(event) => update('documento', event.target.value)} placeholder="Número de documento" /></label>
            <label className="field"><span>Teléfono</span><input autoComplete="tel" maxLength="100" type="tel" required value={guest.telefono} onChange={(event) => update('telefono', event.target.value)} placeholder="+57 300 000 0000" /></label>
            <label className="field field-wide"><span>Correo electrónico</span><input autoComplete="email" maxLength="100" type="email" required value={guest.email} onChange={(event) => update('email', event.target.value)} placeholder="tu@correo.com" /></label>
          </div>
          <ErrorBanner>{error && <>{error}{conflict && <> <Link to="/">Volver a buscar habitaciones</Link></>}</>}</ErrorBanner>
          <button className="button button-primary button-full confirm-button" disabled={busy}>{busy ? 'Confirmando…' : 'Confirmar reserva'} <Icon name="arrow" /></button>
          <p className="form-footnote">Al confirmar, verás los detalles y podrás agregar servicios a tu estancia.</p>
        </form>
        <aside className="stay-summary">
          <h2>Resumen de estancia</h2>
          <h3>{room.tipo === 'SUITE' ? 'Suite' : `Habitación ${room.tipo.toLowerCase()}`}</h3>
          <p>Habitación {room.numero} · {room.noches} {room.noches === 1 ? 'noche' : 'noches'}</p>
          <div className="summary-dates"><div><span>ENTRADA</span><strong>{localDate(state.entrada)}</strong></div><Icon name="arrow" className="date-arrow" /><div><span>SALIDA</span><strong>{localDate(state.salida)}</strong></div></div>
          <div className="summary-total"><span>Total estimado</span><strong>{money(room.totalEstimado)}</strong></div>
          <small className="summary-note">Los servicios adicionales se agregan después de reservar.</small>
        </aside>
      </div>
    </div>
  )
}
