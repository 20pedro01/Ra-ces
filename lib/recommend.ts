import { BUDGETS, CATEGORY_MAP, EXPERIENCES, ZONES, type Experience } from '@/lib/data'
import type { TripState } from '@/lib/trip-store'

export interface Recommendation {
  experience: Experience
  reason: string
}

export function recommend(state: TripState): Recommendation[] {
  const budget = BUDGETS.find((b) => b.id === state.budget)
  const max = budget?.max ?? Infinity
  const categories = state.categories.length
    ? state.categories
    : (['naturaleza', 'gastronomia', 'comunidad', 'nocturno'] as const)

  const scored = EXPERIENCES.filter((e) => categories.includes(e.category)).map((e) => {
    let score = 0
    const reasons: string[] = []

    if (e.zone === state.zone) {
      score += 3
      const zone = ZONES.find((z) => z.id === state.zone)
      reasons.push(`está cerca de ${zone?.name.split(' y')[0] ?? 'tu hospedaje'}`)
    }
    if (e.price <= max) {
      score += 2
      if (budget && budget.id !== 'alto') reasons.push('entra en tu presupuesto')
    } else {
      score -= 2
    }
    if (state.people >= 4 && (e.isWorkshop || e.category === 'gastronomia')) {
      score += 1
      reasons.push('funciona muy bien en grupo')
    }
    if (state.people <= 2 && e.isNight) {
      score += 1
      reasons.push('es ideal para una noche tranquila')
    }
    if (!state.needsTransport && e.zone !== state.zone) {
      score -= 1
    }
    if (state.needsTransport && e.zone !== state.zone) {
      reasons.push('nuestro transporte te lleva sin complicaciones')
    }

    const catName = CATEGORY_MAP[e.category].name.toLowerCase()
    const lead = `Te gusta ${catName}`
    const reason =
      reasons.length > 0
        ? `${lead} y ${reasons.slice(0, 2).join(' y ')}.`
        : `${lead} y aquí participas directamente con la comunidad.`

    return { experience: e, reason, score }
  })

  return scored
    .sort((a, b) => b.score - a.score || a.experience.price - b.experience.price)
    .slice(0, 6)
    .map(({ experience, reason }) => ({ experience, reason }))
}
