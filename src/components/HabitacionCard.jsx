import { money } from '../utils/format.js'

const labels = { SENCILLA: 'Habitación sencilla', DOBLE: 'Habitación doble', SUITE: 'Suite' }

export default function HabitacionCard({ room, selected, onSelect }) {
  return (
    <button className={`room-card${selected ? ' room-card-selected' : ''}`} onClick={onSelect}
      type="button" aria-pressed={selected}>
      <span className="room-card-number">{room.numero}</span>
      <span className="room-card-body">
        <span className="room-card-title">{labels[room.tipo] || room.tipo}</span>
        <span className="room-card-meta">{room.noches} {room.noches === 1 ? 'noche' : 'noches'} · {room.temporada.toLowerCase()}</span>
      </span>
      <span className="room-card-price"><strong>{money(room.totalEstimado)}</strong><small>total estimado</small></span>
      <span className="room-arrow">{selected ? 'Seleccionada' : 'Ver precio'}</span>
    </button>
  )
}
