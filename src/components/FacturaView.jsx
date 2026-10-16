import { HOTEL_TIME_ZONE, money } from '../utils/format.js'
import Icon from './Icon.jsx'

export default function FacturaView({ invoice }) {
  return (
    <section className="invoice-card">
      <div className="invoice-head">
        <span className="invoice-check"><Icon name="check" /></span>
        <h1>Gracias por tu estancia.</h1>
        <p>Este es el resumen final de tu visita.</p>
      </div>
      <div className="invoice-meta">
        <div><span>FACTURA</span><strong>{invoice.id.slice(0, 8).toUpperCase()}</strong></div>
        <div><span>HUÉSPED</span><strong>{invoice.huesped.nombre}</strong></div>
        <div><span>HABITACIÓN</span><strong>{invoice.numeroHabitacion} · {invoice.tipo}</strong></div>
        <div><span>NOCHES</span><strong>{invoice.noches}</strong></div>
      </div>
      <div className="invoice-table-wrap">
        <table className="invoice-table">
          <thead><tr><th>Concepto</th><th>Cant.</th><th>Precio</th><th>Total</th></tr></thead>
          <tbody>{invoice.lineas.map((line, index) => (
            <tr key={`${line.concepto}-${index}`}><td>{line.concepto}</td><td>{line.cantidad}</td><td>{money(line.precioUnitario)}</td><td>{money(line.subtotal)}</td></tr>
          ))}</tbody>
        </table>
      </div>
      <div className="invoice-totals">
        <div><span>Alojamiento</span><strong>{money(invoice.subtotalHabitacion)}</strong></div>
        <div><span>Servicios</span><strong>{money(invoice.subtotalServicios)}</strong></div>
        <div className="invoice-total"><span>Total</span><strong>{money(invoice.total)}</strong></div>
      </div>
      <div className="invoice-foot">Emitida {new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeZone: HOTEL_TIME_ZONE }).format(new Date(invoice.emitidaEn))}.</div>
    </section>
  )
}
