/**
 * Utilidades y reglas de validación de fechas para Viva Raíces
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

export interface DateValidationResult {
  isValid: boolean
  error: string | null
}

/**
 * Valida un rango de fechas (Llegada y Salida).
 */
export function validateDates(
  startDate?: string | null,
  endDate?: string | null
): DateValidationResult {
  if (!startDate || !startDate.trim()) {
    return { isValid: false, error: 'Por favor ingresa la fecha de llegada.' }
  }
  if (!endDate || !endDate.trim()) {
    return { isValid: false, error: 'Por favor ingresa la fecha de salida.' }
  }

  // Comprobar formato YYYY-MM-DD
  const isoRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!isoRegex.test(startDate) || !isoRegex.test(endDate)) {
    return {
      isValid: false,
      error: 'Formato de fecha inválido. Por favor selecciona una fecha válida.',
    }
  }

  const today = getTodayIso()
  const maxDate = getMaxFutureDateIso()

  // 1. Fecha de llegada en el pasado
  if (startDate < today) {
    return {
      isValid: false,
      error: 'La fecha de llegada no puede ser una fecha pasada. Por favor elige una fecha a partir de hoy.',
    }
  }

  // 2. Fecha de salida en el pasado
  if (endDate < today) {
    return {
      isValid: false,
      error: 'La fecha de salida no puede ser una fecha pasada.',
    }
  }

  // 3. Fecha de salida anterior a la fecha de llegada
  if (endDate < startDate) {
    return {
      isValid: false,
      error: 'La fecha de salida no puede ser anterior a la fecha de llegada.',
    }
  }

  // 4. Fechas demasiado a futuro (más allá de la disponibilidad razonable de talleres)
  if (startDate > maxDate || endDate > maxDate) {
    return {
      isValid: false,
      error: `Aún no se cuenta con disponibilidad para esas fechas. Las reservaciones de talleres y experiencias solo se pueden programar con hasta ${MAX_BOOKING_MONTHS_AHEAD} meses de anticipación para garantizar la disponibilidad y agenda de los maestros artesanos.`,
    }
  }

  // 5. Duración excesiva de itinerario continuo
  const start = new Date(`${startDate}T12:00:00`)
  const end = new Date(`${endDate}T12:00:00`)
  const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  if (diffDays > MAX_TRIP_DAYS) {
    return {
      isValid: false,
      error: `El itinerario no puede exceder ${MAX_TRIP_DAYS} días continuos. Por favor ajusta tus fechas.`,
    }
  }

  return { isValid: true, error: null }
}

/**
 * Valida una fecha individual (por ejemplo para paquetes o talleres específicos).
 */
export function validateSingleDate(date?: string | null): DateValidationResult {
  if (!date || !date.trim()) {
    return { isValid: false, error: 'Por favor selecciona una fecha.' }
  }

  const isoRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!isoRegex.test(date)) {
    return { isValid: false, error: 'Formato de fecha inválido.' }
  }

  const today = getTodayIso()
  const maxDate = getMaxFutureDateIso()

  if (date < today) {
    return {
      isValid: false,
      error: 'No es posible reservar en fechas pasadas. Por favor selecciona una fecha a partir de hoy.',
    }
  }

  if (date > maxDate) {
    return {
      isValid: false,
      error: `Aún no se cuenta con disponibilidad para esa fecha. Las reservaciones de talleres y experiencias solo se pueden programar con hasta ${MAX_BOOKING_MONTHS_AHEAD} meses de anticipación para garantizar la disponibilidad de los artesanos.`,
    }
  }

  return { isValid: true, error: null }
}
