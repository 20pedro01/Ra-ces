'use client'

import Link from 'next/link'
import { ArrowRight, Check, Package, Plus, Truck } from 'lucide-react'
import { useTrip } from '@/lib/trip-store'
import { formatMXN } from '@/lib/format'
import { EXPERIENCE_MAP } from '@/lib/data'
import { useLanguage } from '@/lib/i18n/context'
import { cn } from '@/lib/utils'

export function ExperienceActions({ experienceId }: { experienceId: string }) {
  const { state, hasItem, dispatch, totals } = useTrip()
  const { language } = useLanguage()
  const added = hasItem(experienceId)
  const exp = EXPERIENCE_MAP[experienceId]
  const currentItem = state.items.find((i) => i.experienceId === experienceId)
  const pickup = currentItem?.pickup ?? 'recoger'

  return (
    <div className="flex flex-col gap-3.5">
      <p className="text-sm text-muted-foreground">
        {language === 'en'
          ? `For ${state.people} ${state.people === 1 ? 'guest' : 'guests'}:`
          : `Para ${state.people} ${state.people === 1 ? 'persona' : 'personas'}:`}{' '}
        <span className="font-bold text-foreground">{formatMXN(exp.price * state.people, language)}</span>
      </p>

      {/* Selector de Envío para Talleres (Hamacas, Cerámica, etc.) */}
      {exp?.isWorkshop && (
        <div className="flex flex-col gap-2 rounded-2xl border border-border/80 bg-sand/60 p-3 text-xs">
          <span className="flex items-center gap-1.5 font-bold text-foreground">
            <Package className="size-3.5 text-earth" />
            {language === 'en' ? 'Piece delivery method:' : 'Entrega de tu pieza elaborada:'}
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => {
                if (!added) dispatch({ type: 'addExperience', experienceId })
                dispatch({ type: 'setPickup', experienceId, pickup: 'recoger' })
              }}
              className={cn(
                'flex flex-col gap-0.5 rounded-xl border p-2 text-left transition-all',
                added && pickup === 'recoger'
                  ? 'border-primary bg-primary/10 text-foreground font-bold shadow-xs'
                  : 'border-border/80 bg-card text-muted-foreground hover:border-primary/50'
              )}
            >
              <span className="flex items-center gap-1 text-xs font-semibold text-foreground">
                <Package className="size-3 text-primary" />
                {language === 'en' ? 'Pick up' : 'Recoger'}
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight">
                {language === 'en' ? 'At workshop/Mérida' : 'En taller o Mérida'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (!added) dispatch({ type: 'addExperience', experienceId })
                dispatch({ type: 'setPickup', experienceId, pickup: 'envio' })
              }}
              className={cn(
                'flex flex-col gap-0.5 rounded-xl border p-2 text-left transition-all',
                added && pickup === 'envio'
                  ? 'border-primary bg-primary/10 text-foreground font-bold shadow-xs'
                  : 'border-border/80 bg-card text-muted-foreground hover:border-primary/50'
              )}
            >
              <span className="flex items-center gap-1 text-xs font-semibold text-foreground">
                <Truck className="size-3 text-earth" />
                {language === 'en' ? 'Shipping' : 'Con envío'}
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight">
                {language === 'en' ? 'To hotel or home' : 'A tu hotel o casa'}
              </span>
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        aria-pressed={added}
        onClick={() =>
          dispatch(
            added
              ? { type: 'removeExperience', experienceId }
              : { type: 'addExperience', experienceId },
          )
        }
        className={
          added
            ? 'inline-flex h-14 items-center justify-center gap-2 rounded-full bg-secondary text-base font-bold text-secondary-foreground'
            : 'inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary text-base font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.99]'
        }
      >
        {added ? (
          <>
            <Check className="size-5" aria-hidden="true" />
            {language === 'en' ? 'Added to my experience' : 'Agregada a mi experiencia'}
          </>
        ) : (
          <>
            <Plus className="size-5" aria-hidden="true" />
            {language === 'en' ? 'Add to my experience' : 'Agregar a mi experiencia'}
          </>
        )}
      </button>

      {totals.itemCount > 0 && (
        <Link
          href="/mi-viaje"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border text-sm font-bold hover:bg-muted"
        >
          {language === 'en'
            ? `View my trip (${totals.itemCount})`
            : `Ver mi viaje (${totals.itemCount})`}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}
