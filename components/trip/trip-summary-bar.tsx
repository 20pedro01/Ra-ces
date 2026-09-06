'use client'

import Link from 'next/link'
import { ArrowRight, Bus, Map, X } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { EXPERIENCE_MAP, PACKAGES, TRANSPORT_PRICE_PER_PERSON } from '@/lib/data'
import { formatMXN } from '@/lib/format'
import { useTrip } from '@/lib/trip-store'

export function TripSummaryBar({ showContinue = true }: { showContinue?: boolean }) {
  const { state, totals, dispatch } = useTrip()
  const pkg = PACKAGES.find((p) => p.id === state.packageId)
  const empty = state.items.length === 0 && !pkg

  return (
    <div className="hidden flex-col gap-4 rounded-3xl border border-border/70 bg-card p-5 shadow-sm lg:flex">
      <div className="flex items-center gap-2">
        <Map className="size-5 text-earth" aria-hidden="true" />
        <h2 className="text-xl font-semibold">Mi experiencia</h2>
      </div>

      {empty ? (
        <p className="text-sm leading-relaxed text-muted-foreground">
          Aún no has agregado nada. Elige experiencias y aparecerán aquí con su costo estimado.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {pkg && (
            <li className="flex items-start justify-between gap-2 text-sm">
              <span className="font-semibold">Paquete: {pkg.name}</span>
              <span className="whitespace-nowrap">{formatMXN(pkg.price * state.people)}</span>
            </li>
          )}
          {state.items.map((item) => {
            const exp = EXPERIENCE_MAP[item.experienceId]
            if (!exp) return null
            return (
              <li key={item.experienceId} className="flex items-start justify-between gap-2 text-sm">
                <span className="flex items-start gap-1.5">
                  <button
                    type="button"
                    aria-label={`Quitar ${exp.name}`}
                    onClick={() => dispatch({ type: 'removeExperience', experienceId: exp.id })}
                    className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <X className="size-3.5" />
                  </button>
                  <span>{exp.name}</span>
                </span>
                <span className="whitespace-nowrap">{formatMXN(exp.price * state.people)}</span>
              </li>
            )
          })}
        </ul>
      )}

      {state.needsTransport && state.items.length > 0 && (
        <label className="flex items-center justify-between gap-3 rounded-2xl bg-accent px-3 py-2.5 text-accent-foreground">
          <span className="flex items-center gap-2 text-sm font-bold">
            <Bus className="size-4" aria-hidden="true" />
            Transporte ComuniTour
            <span className="font-normal">· {formatMXN(TRANSPORT_PRICE_PER_PERSON)} / persona / día</span>
          </span>
          <Switch
            checked={state.transportEnabled}
            onCheckedChange={(v) => dispatch({ type: 'setTransportEnabled', enabled: v })}
          />
        </label>
      )}

      <dl className="flex flex-col gap-1.5 border-t border-border pt-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Experiencias</dt>
          <dd>{formatMXN(totals.experiences + totals.packagePrice)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Transporte</dt>
          <dd>{formatMXN(totals.transport)}</dd>
        </div>
        <div className="flex justify-between pt-1 text-base font-bold">
          <dt>Total estimado</dt>
          <dd>{formatMXN(totals.total)}</dd>
        </div>
        <p className="text-xs text-muted-foreground">
          Para {state.people} {state.people === 1 ? 'persona' : 'personas'}. Precios simulados.
        </p>
      </dl>

      {showContinue && (
        <Link
          href="/mi-viaje"
          aria-disabled={empty}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-earth text-base font-bold text-earth-foreground transition-all hover:bg-earth/90 aria-disabled:pointer-events-none aria-disabled:opacity-40"
        >
          Ver mi viaje
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}
