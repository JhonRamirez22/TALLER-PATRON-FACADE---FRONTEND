import assert from 'node:assert/strict'
import test from 'node:test'
import { addCalendarDays, dateInTimeZone } from '../src/utils/format.js'

test('la fecha de hoy respeta la zona horaria del hotel cerca de medianoche UTC', () => {
  const instant = new Date('2026-10-16T04:30:00.000Z')
  assert.equal(dateInTimeZone(instant, 'America/Bogota'), '2026-10-15')
  assert.equal(dateInTimeZone(instant, 'UTC'), '2026-10-16')
})

test('avanza fechas de calendario al cruzar año y año bisiesto', () => {
  assert.equal(addCalendarDays('2026-12-31', 1), '2027-01-01')
  assert.equal(addCalendarDays('2024-02-28', 1), '2024-02-29')
})
