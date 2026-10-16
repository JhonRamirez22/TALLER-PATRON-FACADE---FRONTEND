const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
export const HOTEL_TIME_ZONE = import.meta.env?.VITE_HOTEL_TIME_ZONE || 'America/Bogota'

export const money = (amount) => currency.format(Number(amount || 0))

export function localDate(value) {
  if (!value) return '—'
  const [year, month, day] = value.split('-').map(Number)
  return new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })
    .format(new Date(year, month - 1, day))
}

export function dateInTimeZone(date, timeZone = HOTEL_TIME_ZONE) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]))
  return `${values.year}-${values.month}-${values.day}`
}

export function addCalendarDays(value, days) {
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

export const todayString = () => dateInTimeZone(new Date())
export const tomorrowString = () => addCalendarDays(todayString(), 1)
