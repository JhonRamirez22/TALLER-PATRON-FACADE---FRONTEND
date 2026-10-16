export default function Loading({ label = 'Cargando' }) {
  return <div className="loading-state" role="status"><span className="spinner" />{label}…</div>
}
