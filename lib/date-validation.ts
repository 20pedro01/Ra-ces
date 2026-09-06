/**
 * Utilidades y reglas de validación de fechas para Raíces
 */

export const MAX_BOOKING_MONTHS_AHEAD = 6
export const MAX_TRIP_DAYS = 30

/**
 * Devuelve la fecha de hoy en formato YYYY-MM-DD en la zona horaria local.
 */
export function getTodayIso(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Devuelve la fecha máxima permitida para reservar (por defecto 6 meses a futuro).
 */
export function getMaxFutureDateIso(monthsAhead = MAX_BOOKING_MONTHS_AHEAD): string {
  const date = new Date()
  date.setMonth(date.getMonth() + monthsAhead)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Devuelve una etiqueta amigable del mes máximo disponible (ej: "marzo de 2027").
 */
export function getMaxFutureMonthLabel(monthsAhead = MAX_BOOKING_MONTHS_AHEAD, locale: 'es' | 'en' = 'es'): string {
  const maxIso = getMaxFutureDateIso(monthsAhead)
  const date = new Date(`${maxIso}T12:00:00`)
  const label = new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'es-MX', { month: 'long', year: 'numeric' }).format(date)
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export interface DateValidationResult {
  isValid: boolean
  error: string | null
  isFutureAvailabilityIssue?: boolean
  isPastIssue?: boolean
  isOrderIssue?: boolean
}

/**
 * Valida un rango de fechas (Llegada y Salida).
 */
export function validateDates(
  startDate?: string | null,
  endDate?: string | null,
  locale: 'es' | 'en' = 'es'
): DateValidationResult {
  const isEn = locale === 'en'

  if (!startDate || !startDate.trim()) {
    return { isValid: false, error: isEn ? 'Please select your arrival date.' : 'Por favor ingresa la fecha de llegada.' }
  }
  if (!endDate || !endDate.trim()) {
    return { isValid: false, error: isEn ? 'Please select your departure date.' : 'Por favor ingresa la fecha de salida.' }
  }

  // Comprobar formato YYYY-MM-DD
  const isoRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!isoRegex.test(startDate) || !isoRegex.test(endDate)) {
    return {
      isValid: false,
      error: isEn ? 'Invalid date format. Please choose a valid date.' : 'Formato de fecha inválido. Por favor selecciona una fecha válida.',
    }
  }

  const today = getTodayIso()
  const maxDate = getMaxFutureDateIso()

  // 1. Fecha de llegada en el pasado
  if (startDate < today) {
    return {
      isValid: false,
      isPastIssue: true,
      error: isEn
        ? 'Arrival date cannot be in the past. Please select a date from today onwards.'
        : 'La fecha de llegada no puede ser una fecha pasada. Por favor elige una fecha a partir de hoy.',
    }
  }

  // 2. Fecha de salida en el pasado
  if (endDate < today) {
    return {
      isValid: false,
      isPastIssue: true,
      error: isEn
        ? 'Departure date cannot be in the past.'
        : 'La fecha de salida no puede ser una fecha pasada.',
    }
  }

  // 3. Fecha de salida anterior a la fecha de llegada
  if (endDate < startDate) {
    return {
      isValid: false,
      isOrderIssue: true,
      error: isEn
        ? 'Departure date cannot be earlier than arrival date.'
        : 'La fecha de salida no puede ser anterior a la fecha de llegada.',
    }
  }

  // 4. Fechas demasiado a futuro (más allá de la disponibilidad razonable de talleres)
  if (startDate > maxDate || endDate > maxDate) {
    return {
      isValid: false,
      isFutureAvailabilityIssue: true,
      error: isEn
        ? `We do not yet have availability for these dates. Artisan workshop bookings can only be scheduled up to ${MAX_BOOKING_MONTHS_AHEAD} months in advance to guarantee artisan schedules.`
        : `Aún no se cuenta con disponibilidad para esas fechas. Las reservaciones de talleres y experiencias solo se pueden programar con hasta ${MAX_BOOKING_MONTHS_AHEAD} meses de anticipación para garantizar la disponibilidad y agenda de los maestros artesanos.`,
    }
  }

  // 5. Duración excesiva de itinerario continuo
  const start = new Date(`${startDate}T12:00:00`)
  const end = new Date(`${endDate}T12:00:00`)
  const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  if (diffDays > MAX_TRIP_DAYS) {
    return {
      isValid: false,
      error: isEn
        ? `Itinerary cannot exceed ${MAX_TRIP_DAYS} continuous days. Please adjust your dates.`
        : `El itinerario no puede exceder ${MAX_TRIP_DAYS} días continuos. Por favor ajusta tus fechas.`,
    }
  }

  return { isValid: true, error: null }
}

/**
 * Valida una fecha individual (por ejemplo para paquetes o talleres específicos).
 */
export function validateSingleDate(date?: string | null, locale: 'es' | 'en' = 'es'): DateValidationResult {
  const isEn = locale === 'en'

  if (!date || !date.trim()) {
    return { isValid: false, error: isEn ? 'Please select a date.' : 'Por favor selecciona una fecha.' }
  }

  const isoRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!isoRegex.test(date)) {
    return { isValid: false, error: isEn ? 'Invalid date format.' : 'Formato de fecha inválido.' }
  }

  const today = getTodayIso()
  const maxDate = getMaxFutureDateIso()

  if (date < today) {
    return {
      isValid: false,
      isPastIssue: true,
      error: isEn
        ? 'Booking for past dates is not possible. Please pick a date starting today.'
        : 'No es posible reservar en fechas pasadas. Por favor selecciona una fecha a partir de hoy.',
    }
  }

  if (date > maxDate) {
    return {
      isValid: false,
      isFutureAvailabilityIssue: true,
      error: isEn
        ? `We do not yet have availability for this date. Bookings can only be scheduled up to ${MAX_BOOKING_MONTHS_AHEAD} months in advance to guarantee artisan schedules.`
        : `Aún no se cuenta con disponibilidad para esa fecha. Las reservaciones de talleres y experiencias solo se pueden programar con hasta ${MAX_BOOKING_MONTHS_AHEAD} meses de anticipación para garantizar la disponibilidad de los artesanos.`,
    }
  }

  return { isValid: true, error: null }
}

/**
 * Indica si una reservación se realiza con menos de 48 horas de anticipación.
 */
export function isLastMinuteBooking(startDate?: string | null): boolean {
  if (!startDate) return false
  const todayIso = getTodayIso()
  const today = new Date(`${todayIso}T12:00:00`)
  const start = new Date(`${startDate}T12:00:00`)
  const diffDays = Math.round((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return diffDays >= 0 && diffDays <= 2
}
