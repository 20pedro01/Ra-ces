'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Check, Clock, MapPin, Package, Plus, Sparkles, Truck } from 'lucide-react'
import { CategoryBadge } from '@/components/category-badge'
import { formatDuration, formatMXN } from '@/lib/format'
import type { Experience } from '@/lib/data'
import { useTrip } from '@/lib/trip-store'
import { cn } from '@/lib/utils'

import { useLanguage } from '@/lib/i18n/context'
import { getLocalizedExperience } from '@/lib/i18n/data-translations'

export function ExperienceCard({
  experience,
  reason,
  className,
}: {
  experience: Experience
  reason?: string
  className?: string
}) {
  const { hasItem, dispatch, state } = useTrip()
  const { language, t } = useLanguage()
  const locExp = getLocalizedExperience(experience, language)
  const added = hasItem(experience.id)
  const currentItem = state.items.find((i) => i.experienceId === experience.id)
  const currentPickup = currentItem?.pickup ?? 'recoger'

  return (
    <article
      className={cn(
        'flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm transition-shadow hover:shadow-md',
        className,
      )}
    >
      <Link href={`/experiencias/${experience.slug}`} className="relative block aspect-[4/3]">
        <Image
          src={experience.image}
          alt={locExp.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
        <CategoryBadge category={experience.category} className="absolute left-3 top-3 shadow-sm" />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold leading-snug text-balance">
            <Link href={`/experiencias/${experience.slug}`} className="hover:underline">
              {locExp.name}
            </Link>
          </h3>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" aria-hidden="true" />
              {locExp.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" aria-hidden="true" />
              {formatDuration(experience.durationHours, language)}
            </span>
          </p>
        </div>

        <p className="text-sm leading-relaxed text-foreground/85">{locExp.short}</p>

        {experience.isWorkshop && (
          <div className="flex flex-col gap-1.5 rounded-2xl border border-border/80 bg-sand/70 p-2.5 text-xs">
            <span className="flex items-center gap-1.5 font-bold text-foreground text-[11px]">
              <Package className="size-3 text-earth" />
              {language === 'en' ? 'Piece delivery method:' : 'Entrega de tu pieza elaborada:'}
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  if (!added) dispatch({ type: 'addExperience', experienceId: experience.id })
                  dispatch({ type: 'setPickup', experienceId: experience.id, pickup: 'recoger' })
                }}
                className={cn(
                  'flex items-center justify-center gap-1 rounded-xl border p-1.5 text-center text-xs transition-all',
                  added && currentPickup === 'recoger'
                    ? 'border-primary bg-primary/10 text-foreground font-bold shadow-xs'
                    : 'border-border/80 bg-card text-muted-foreground hover:border-primary/50'
                )}
              >
                <Package className="size-3 text-primary" />
                <span>{language === 'en' ? 'Pick up' : 'Recoger'}</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  if (!added) dispatch({ type: 'addExperience', experienceId: experience.id })
                  dispatch({ type: 'setPickup', experienceId: experience.id, pickup: 'envio' })
                }}
                className={cn(
                  'flex items-center justify-center gap-1 rounded-xl border p-1.5 text-center text-xs transition-all',
                  added && currentPickup === 'envio'
                    ? 'border-leaf bg-leaf/15 text-leaf font-bold shadow-xs'
                    : 'border-border/80 bg-card text-muted-foreground hover:border-leaf/50'
                )}
              >
                <Truck className="size-3 text-leaf" />
                <span>{language === 'en' ? 'With shipping' : 'Con envío'}</span>
              </button>
            </div>
          </div>
        )}

        {reason && (
          <p className="flex gap-2 rounded-2xl bg-secondary px-3 py-2 text-sm leading-snug text-secondary-foreground">
            <Sparkles className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>{reason}</span>
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          <p className="text-base">
            <span className="font-bold">{formatMXN(experience.price, language)}</span>
            <span className="text-sm text-muted-foreground"> {t('card.perPerson')}</span>
          </p>
          <button
            type="button"
            aria-pressed={added}
            onClick={() =>
              dispatch(
                added
                  ? { type: 'removeExperience', experienceId: experience.id }
                  : { type: 'addExperience', experienceId: experience.id },
              )
            }
            className={cn(
              'inline-flex h-11 items-center gap-1.5 rounded-full px-4 text-sm font-bold transition-all active:scale-[0.98]',
              added
                ? 'bg-secondary text-secondary-foreground'
                : 'bg-primary text-primary-foreground hover:bg-primary/90',
            )}
          >
            {added ? (
              <>
                <Check className="size-4" aria-hidden="true" /> {t('card.added')}
              </>
            ) : (
              <>
                <Plus className="size-4" aria-hidden="true" /> {t('card.add')}
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
