import assert from 'node:assert/strict'
import test from 'node:test'
import { buscarDisponibilidad, crearReserva } from '../src/api/hotelApi.js'

test('busca disponibilidad y serializa parámetros con caracteres reservados', async (t) => {
  const originalFetch = globalThis.fetch
  t.after(() => { globalThis.fetch = originalFetch })
  let requestUrl
  globalThis.fetch = async (url) => {
    requestUrl = String(url)
    return Response.json([{ id: 1 }])
  }

  assert.deepEqual(await buscarDisponibilidad({ entrada: '2026-10-15', salida: '2026-10-16', tipo: 'SUITE' }), [{ id: 1 }])
  assert.match(requestUrl, /entrada=2026-10-15/)
  assert.match(requestUrl, /salida=2026-10-16/)
  assert.match(requestUrl, /tipo=SUITE/)
})

test('preserva el estado 409 para mostrar el conflicto de reserva', async (t) => {
  const originalFetch = globalThis.fetch
  t.after(() => { globalThis.fetch = originalFetch })
  globalThis.fetch = async () => Response.json({ detail: 'Habitación no disponible' }, { status: 409 })

  await assert.rejects(crearReserva({}), (error) => {
    assert.equal(error.status, 409)
    assert.equal(error.message, 'Habitación no disponible')
    return true
  })
})

test('convierte fallos de red en un mensaje accionable', async (t) => {
  const originalFetch = globalThis.fetch
  t.after(() => { globalThis.fetch = originalFetch })
  globalThis.fetch = async () => { throw new TypeError('network error') }

  await assert.rejects(buscarDisponibilidad({ entrada: '2026-10-15', salida: '2026-10-16' }), /No se pudo conectar/)
})
