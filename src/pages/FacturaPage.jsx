import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { obtenerReserva } from '../api/hotelApi.js'
import ErrorBanner from '../components/ErrorBanner.jsx'
import FacturaView from '../components/FacturaView.jsx'
import Icon from '../components/Icon.jsx'
import Loading from '../components/Loading.jsx'

export default function FacturaPage() {
  const { id } = useParams()
  const [reservation, setReservation] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    obtenerReserva(id).then((value) => { if (!cancelled) setReservation(value) })
      .catch((problem) => { if (!cancelled) setError(problem.message) })
    return () => { cancelled = true }
  }, [id])

  if (error) return <div className="page page-state"><ErrorBanner>{error}</ErrorBanner><Link className="back-link" to="/"><Icon name="arrowLeft" /> Inicio</Link></div>
  if (!reservation) return <div className="page page-state"><Loading label="Preparando factura" /></div>

  return (
    <div className="page page-invoice">
      {reservation.factura ? <FacturaView invoice={reservation.factura} /> : (
        <div className="empty-state page-empty"><Icon name="door" className="empty-icon" /><h1>La factura aparecerá al terminar tu estancia.</h1><p>Primero completa el check-in y luego el check-out.</p><Link className="button button-primary" to={`/reserva/${id}`}>Volver a la reserva</Link></div>
      )}
      <Link className="invoice-home" to="/">Volver al inicio</Link>
    </div>
  )
}
