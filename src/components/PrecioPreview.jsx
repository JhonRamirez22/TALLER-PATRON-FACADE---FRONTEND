import { money } from '../utils/format.js'
import Icon from './Icon.jsx'

export default function PrecioPreview({ room, onContinue }) {
  if (!room) return null
  return (
    <aside className="price-preview" aria-live="polite">
      <div className="preview-heading"><h3>Tu estancia</h3><span className="season-pill">{room.temporada}</span></div>
      <div className="preview-room">{room.tipo} <span>·</span> habitación {room.numero}</div>
      <div className="preview-line"><span>{room.noches} {room.noches === 1 ? 'noche' : 'noches'} <small>Base {money(room.precioBaseNoche)} / noche</small></span><strong>{money(room.totalEstimado)}</strong></div>
      <p className="preview-note">La tarifa se calcula en el servidor por temporada.</p>
      <button className="button button-primary button-full" onClick={onContinue}>Continuar con esta habitación <Icon name="arrow" /></button>
    </aside>
  )
}
