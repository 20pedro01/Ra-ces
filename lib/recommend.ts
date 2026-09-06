import { BUDGETS, CATEGORY_MAP, EXPERIENCES, ZONES, type Experience } from '@/lib/data'
import type { TripState } from '@/lib/trip-store'
import type { Locale } from '@/lib/i18n/translations'
import { CATEGORIES_EN } from '@/lib/i18n/data-translations'

export interface Recommendation {
  experience: Experience
  reason: string
}

export function recommend(state: TripState, locale: Locale = 'es'): Recommendation[] {
  const isEn = locale === 'en'
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
      const zoneName = zone?.name.split(' y')[0] ?? (isEn ? 'your lodging' : 'tu hospedaje')
      reasons.push(isEn ? `is close to ${zoneName}` : `está cerca de ${zoneName}`)
    }
    if (e.price <= max) {
      score += 2
      if (budget && budget.id !== 'alto') {
        reasons.push(isEn ? 'fits nicely in your budget' : 'entra en tu presupuesto')
      }
    } else {
      score -= 2
    }
    if (state.people >= 4 && (e.isWorkshop || e.category === 'gastronomia')) {
      score += 1
      reasons.push(isEn ? 'works wonderfully for groups' : 'funciona muy bien en grupo')
    }
    if (state.people <= 2 && e.isNight) {
      score += 1
      reasons.push(isEn ? 'is ideal for a peaceful evening' : 'es ideal para una noche tranquila')
    }
    if (!state.needsTransport && e.zone !== state.zone) {
      score -= 1
    }
    if (state.needsTransport && e.zone !== state.zone) {
      reasons.push(isEn ? 'our transportation gets you there seamlessly' : 'nuestro transporte te lleva sin complicaciones')
    }

    const catName = isEn
      ? (CATEGORIES_EN[e.category]?.short ?? 'this category').toLowerCase()
      : CATEGORY_MAP[e.category].name.toLowerCase()
    const lead = isEn ? `You like ${catName}` : `Te gusta ${catName}`
    const reason =
      reasons.length > 0
        ? isEn
          ? `${lead} and it ${reasons.slice(0, 2).join(' and ')}.`
          : `${lead} y ${reasons.slice(0, 2).join(' y ')}.`
        : isEn
          ? `${lead} and you will participate directly with the community.`
          : `${lead} y aquí participas directamente con la comunidad.`

    return { experience: e, reason, score }
  })

  return scored
    .sort((a, b) => b.score - a.score || a.experience.price - b.experience.price)
    .slice(0, 6)
    .map(({ experience, reason }) => ({ experience, reason }))
}
