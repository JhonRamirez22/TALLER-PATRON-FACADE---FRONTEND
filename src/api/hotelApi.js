const BASE = (import.meta.env?.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '')

async function request(path, options = {}) {
  let response
  try {
    response = await fetch(`${BASE}/api/hotel${path}`, {
      ...options,
      headers: { Accept: 'application/json', ...options.headers },
    })
  } catch {
    throw new Error('No se pudo conectar con el hotel. Intenta de nuevo en un momento.')
  }

  const body = response.status === 204 ? null : await response.json().catch(() => null)
  if (!response.ok) {
    const error = new Error(body?.detail || 'Error inesperado. Intenta de nuevo.')
    error.status = response.status
    throw error
  }
  return body
}

const json = (body) => ({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

export const buscarDisponibilidad = ({ entrada, salida, tipo }) => {
  const query = new URLSearchParams({ entrada, salida })
  if (tipo) query.set('tipo', tipo)
  return request(`/disponibilidad?${query}`)
}
export const crearReserva = (body) => request('/reservar', json(body))
export const agregarServicio = (id, tipoServicio) => request(`/servicios/${encodeURIComponent(id)}`, json({ tipoServicio }))
export const checkIn = (id) => request(`/checkin/${encodeURIComponent(id)}`, { method: 'PUT' })
export const checkOut = (id) => request(`/checkout/${encodeURIComponent(id)}`, { method: 'PUT' })
export const obtenerReserva = (id) => request(`/reserva/${encodeURIComponent(id)}`)
