'use client'

import { Leaf, UtensilsCrossed, Handshake, Moon } from 'lucide-react'
import { CATEGORY_MAP, type CategoryId } from '@/lib/data'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/context'
import { getLocalizedCategory } from '@/lib/i18n/data-translations'

export const CATEGORY_ICONS = {
  naturaleza: Leaf,
  gastronomia: UtensilsCrossed,
  comunidad: Handshake,
  nocturno: Moon,
} as const

const STYLES: Record<CategoryId, string> = {
  naturaleza: 'bg-secondary text-secondary-foreground',
  gastronomia: 'bg-earth/15 text-earth',
  comunidad: 'bg-accent text-accent-foreground',
  nocturno: 'bg-foreground/90 text-background',
}

export function CategoryBadge({
  category,
  className,
}: {
  category: CategoryId
  className?: string
}) {
  const { language } = useLanguage()
  const Icon = CATEGORY_ICONS[category]
  const cat = getLocalizedCategory(category, language)
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold',
        STYLES[category],
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {cat.name}
    </span>
  )
}
