import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { buscarDisponibilidad } from '../api/hotelApi.js'
import ErrorBanner from '../components/ErrorBanner.jsx'
import HabitacionCard from '../components/HabitacionCard.jsx'
import Loading from '../components/Loading.jsx'
import PrecioPreview from '../components/PrecioPreview.jsx'
import Icon from '../components/Icon.jsx'
import { todayString, tomorrowString } from '../utils/format.js'

export default function BuscarPage() {
  const navigate = useNavigate()
  const [entrada, setEntrada] = useState(todayString())
  const [salida, setSalida] = useState(tomorrowString())
  const [tipo, setTipo] = useState('')
  const [rooms, setRooms] = useState(null)
  const [selected, setSelected] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [reservationId, setReservationId] = useState('')

  async function search(event) {
    event.preventDefault()
    if (salida <= entrada) {
      setError('La salida debe ser posterior a la entrada.')
      return
    }
    if (entrada < todayString()) {
      setError('La entrada debe ser hoy o una fecha futura.')
      return
    }
    if ((Date.parse(`${salida}T00:00:00Z`) - Date.parse(`${entrada}T00:00:00Z`)) / 86_400_000 > 30) {
      setError('La estancia no puede superar 30 noches.')
      return
    }
    setError('')
    setSelected(null)
    setBusy(true)
    try {
      setRooms(await buscarDisponibilidad({ entrada, salida, tipo }))
    } catch (problem) {
      setRooms(null)
      setError(problem.message)
    } finally {
      setBusy(false)
    }
  }

  function openReservation(event) {
    event.preventDefault()
    const id = reservationId.trim()
    if (id) navigate(`/reserva/${encodeURIComponent(id)}`)
  }

  return (
    <div className="page page-search">
      <section className="search-intro">
        <div className="intro-copy">
          <h1>Encuentra una<br /><em>habitación.</em></h1>
          <p>Elige las fechas de entrada y salida. La disponibilidad y el precio estimado se calculan para tu estancia.</p>
        </div>
      </section>

      <section className="search-panel" aria-labelledby="search-heading">
        <div className="search-panel-title"><h2 id="search-heading">Fechas y habitación</h2><span className="open-badge"><span /> 16 habitaciones</span></div>
        <form className="search-form" onSubmit={search}>
          <label className="field"><span>Entrada</span><input type="date" value={entrada} min={todayString()} required onChange={(event) => setEntrada(event.target.value)} /></label>
          <label className="field"><span>Salida</span><input type="date" value={salida} min={entrada || todayString()} required onChange={(event) => setSalida(event.target.value)} /></label>
          <label className="field field-type"><span>Habitación</span><select value={tipo} onChange={(event) => setTipo(event.target.value)}><option value="">Cualquier tipo</option><option value="SENCILLA">Sencilla</option><option value="DOBLE">Doble</option><option value="SUITE">Suite</option></select></label>
          <button className="button button-primary search-button" disabled={busy}>{busy ? 'Buscando…' : 'Buscar habitaciones'} <Icon name="arrow" /></button>
        </form>
        <ErrorBanner>{error}</ErrorBanner>
      </section>

      <section className="results-section" aria-live="polite">
        {busy && <Loading label="Consultando habitaciones" />}
        {rooms && !busy && (
          <>
            <div className="results-heading"><h2>{rooms.length ? `${rooms.length} habitaciones disponibles` : 'Sin disponibilidad'}</h2>{rooms.length > 0 && <span>{entrada} — {salida}</span>}</div>
            {rooms.length === 0 ? <div className="empty-state"><Icon name="door" className="empty-icon" /><h3>No hay habitaciones para esas fechas.</h3><p>Prueba otras fechas o quita el filtro de habitación.</p></div> : (
              <div className="results-layout">
                <div className="room-list">{rooms.map((room) => <HabitacionCard key={room.id} room={room} selected={selected?.id === room.id} onSelect={() => setSelected(room)} />)}</div>
                <PrecioPreview room={selected} onContinue={() => navigate('/reservar', { state: { room: selected, entrada, salida } })} />
              </div>
            )}
          </>
        )}
      </section>

      <section className="retrieve-reservation">
        <div><h2>¿Ya tienes una reserva?</h2><p>Abre sus detalles con el ID de reserva.</p></div>
        <form onSubmit={openReservation}><label className="sr-only" htmlFor="reservation-id">ID de reserva</label><input id="reservation-id" placeholder="ID de reserva" value={reservationId} onChange={(event) => setReservationId(event.target.value)} required /><button className="button button-outline">Abrir reserva <Icon name="arrow" /></button></form>
      </section>
    </div>
  )
}
