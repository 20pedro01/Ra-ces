'use client'

import Link from 'next/link'
import { ArrowRight, Check, Plus } from 'lucide-react'
import { useTrip } from '@/lib/trip-store'
import { formatMXN } from '@/lib/format'
import { EXPERIENCE_MAP } from '@/lib/data'

export function ExperienceActions({ experienceId }: { experienceId: string }) {
  const { state, hasItem, dispatch, totals } = useTrip()
  const added = hasItem(experienceId)
  const exp = EXPERIENCE_MAP[experienceId]

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        Para {state.people} {state.people === 1 ? 'persona' : 'personas'}:{' '}
        <span className="font-bold text-foreground">{formatMXN(exp.price * state.people)}</span>
      </p>
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
            <Check className="size-5" aria-hidden="true" /> Agregada a mi experiencia
          </>
        ) : (
          <>
            <Plus className="size-5" aria-hidden="true" /> Agregar a mi experiencia
          </>
        )}
      </button>
      {totals.itemCount > 0 && (
        <Link
          href="/mi-viaje"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border text-sm font-bold hover:bg-muted"
        >
          Ver mi viaje ({totals.itemCount}) <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}
