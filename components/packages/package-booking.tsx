'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Bus, Minus, Plus } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import type { TourPackage } from '@/lib/data'
import { addDays, formatMXN } from '@/lib/format'
import { useTrip } from '@/lib/trip-store'

export function PackageBooking({ pkg }: { pkg: TourPackage }) {
  const { state, dispatch } = useTrip()
  const router = useRouter()
  const [transport, setTransport] = useState(state.packageId === pkg.id ? state.packageTransport : false)
  const [date, setDate] = useState(state.startDate ?? addDays(new Date().toISOString().slice(0, 10), 14))

  const people = state.people
  const subtotal = pkg.price * people
  const transportTotal = transport ? pkg.transportPrice * people : 0

  const reserve = () => {
    dispatch({ type: 'setDates', startDate: date, endDate: date })
    dispatch({ type: 'selectPackage', packageId: pkg.id, transport })
    router.push('/mi-viaje/reservar')
  }

  return (
    <div className="flex flex-col gap-5 rounded-3xl border border-border/70 bg-card p-5 shadow-md">
      <div className="flex items-baseline justify-between gap-3">
        <p>
          <span className="font-serif text-3xl font-semibold">{formatMXN(pkg.price)}</span>
          <span className="text-sm text-muted-foreground"> / persona</span>
        </p>
        <span className="text-sm font-semibold text-muted-foreground">{pkg.durationLabel}</span>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-bold">
        Fecha
        <input
          type="date"
          value={date}
          min={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setDate(e.target.value)}
          className="h-12 rounded-xl border border-input bg-background px-3 text-base font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
        />
      </label>

      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-bold">Personas</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Menos personas"
            onClick={() => dispatch({ type: 'setPeople', people: people - 1 })}
            disabled={people <= 1}
            className="flex size-11 items-center justify-center rounded-full border-2 border-border disabled:opacity-40"
          >
            <Minus className="size-4" />
          </button>
          <output className="min-w-6 text-center text-lg font-bold" aria-live="polite">
            {people}
          </output>
          <button
            type="button"
            aria-label="Más personas"
            onClick={() => dispatch({ type: 'setPeople', people: people + 1 })}
            disabled={people >= 12}
            className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>

      <label className="flex items-center justify-between gap-3 rounded-2xl bg-accent px-4 py-3 text-accent-foreground">
        <span className="flex flex-col">
          <span className="flex items-center gap-2 text-sm font-bold">
            <Bus className="size-4" aria-hidden="true" /> Transporte Raíces
          </span>
          <span className="text-xs">Ida y vuelta desde tu hospedaje · +{formatMXN(pkg.transportPrice)} / persona</span>
        </span>
        <Switch checked={transport} onCheckedChange={setTransport} />
      </label>

      <dl className="flex flex-col gap-1.5 border-t border-border pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">
            Paquete × {people}
          </dt>
          <dd>{formatMXN(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Transporte</dt>
          <dd>{formatMXN(transportTotal)}</dd>
        </div>
        <div className="flex justify-between pt-1 text-lg font-bold">
          <dt>Total estimado</dt>
          <dd>{formatMXN(subtotal + transportTotal)}</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={reserve}
        className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-earth text-base font-bold text-earth-foreground transition-all hover:bg-earth/90 active:scale-[0.99]"
      >
        Reservar paquete <ArrowRight className="size-5" aria-hidden="true" />
      </button>
      <p className="text-center text-xs text-muted-foreground">Reservación simulada. No se realiza ningún cargo.</p>
    </div>
  )
}
