export function formatMXN(value: number, locale: 'es' | 'en' = 'es') {
  return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDuration(hours: number, locale: 'es' | 'en' = 'es') {
  if (locale === 'en') {
    return `${hours} hr${hours !== 1 ? 's' : ''}`
  }
  if (Number.isInteger(hours)) return `${hours} h`
  return `${hours.toString().replace('.', ',')} h`
}

export function formatDate(iso: string, locale: 'es' | 'en' = 'es') {
  const date = new Date(`${iso}T12:00:00`)
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function formatDateShort(iso: string, locale: 'es' | 'en' = 'es') {
  const date = new Date(`${iso}T12:00:00`)
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'es-MX', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(date)
}

export function addDays(iso: string, days: number) {
  const date = new Date(`${iso}T12:00:00`)
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

export function formatHour(hour: number) {
  const h = Math.floor(hour)
  const m = Math.round((hour - h) * 60)
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}
