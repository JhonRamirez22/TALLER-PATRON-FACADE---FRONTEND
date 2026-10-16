import { money } from '../utils/format.js'
import Icon from './Icon.jsx'

const options = [
  { tipo: 'SPA', label: 'Ritual de spa', price: 50, note: 'Por sesión', icon: 'spa' },
  { tipo: 'DESAYUNO', label: 'Desayuno de la casa', price: 15, note: 'Por noche', icon: 'sun' },
  { tipo: 'TRASLADO', label: 'Traslado privado', price: 30, note: 'Por trayecto', icon: 'car' },
]

export default function ServiciosPanel({ reservation, busy, onAdd }) {
  if (reservation.estado === 'CHECKOUT') return null
  return (
    <section className="panel-section">
      <div className="section-heading"><h2>Servicios adicionales</h2></div>
      <div className="service-list">
        {options.map((item) => {
          const breakfastAdded = item.tipo === 'DESAYUNO' && reservation.servicios.some((service) => service.tipo === 'DESAYUNO')
          return (
            <div className="service-row" key={item.tipo}>
              <span className={`service-icon service-icon-${item.tipo.toLowerCase()}`}><Icon name={item.icon} /></span>
              <span className="service-info"><strong>{item.label}</strong><small>{item.note}</small></span>
              <span className="service-price">{money(item.price)}</span>
              <button className="button button-outline button-small" disabled={busy || breakfastAdded}
                onClick={() => onAdd(item.tipo)}>{breakfastAdded ? 'Añadido' : 'Añadir'}</button>
            </div>
          )
        })}
      </div>
    </section>
  )
}
