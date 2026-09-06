'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, ArrowRight, Bus, Clock, Minus, Plus } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { AvailabilityNotifier } from '@/components/availability-notifier'
import type { TourPackage } from '@/lib/data'
import { addDays, formatMXN } from '@/lib/format'
import {
  getTodayIso,
  getMaxFutureDateIso,
  validateSingleDate,
  isLastMinuteBooking,
  MAX_BOOKING_MONTHS_AHEAD,
} from '@/lib/date-validation'
import { useTrip } from '@/lib/trip-store'

export function PackageBooking({ pkg }: { pkg: TourPackage }) {
  const { state, dispatch } = useTrip()
  const router = useRouter()
  const [transport, setTransport] = useState(state.packageId === pkg.id ? state.packageTransport : false)
  const [date, setDate] = useState(state.startDate ?? addDays(getTodayIso(), 14))
  const [dateError, setDateError] = useState<string | null>(null)
  const [futureIssue, setFutureIssue] = useState(false)

  const people = state.people
  const subtotal = pkg.price * people
  const transportTotal = transport ? pkg.transportPrice * people : 0

  const reserve = () => {
    const validation = validateSingleDate(date)
    if (!validation.isValid) {
      setDateError(validation.error)
      setFutureIssue(Boolean(validation.isFutureAvailabilityIssue))
      return
    }
    setDateError(null)
    setFutureIssue(false)
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
          min={getTodayIso()}
          max={getMaxFutureDateIso()}
          onChange={(e) => {
            setDate(e.target.value)
            if (dateError) {
              setDateError(null)
              setFutureIssue(false)
            }
          }}
          className="h-12 rounded-xl border border-input bg-background px-3 text-base font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
        />
      </label>

      {isLastMinuteBooking(date) && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-200">
          <Clock className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <span className="font-bold">Reservación en menos de 48 horas:</span>{' '}
            Coordinaremos directamente con los artesanos y el chofer para confirmar de inmediato tu espacio.
          </div>
        </div>
      )}

      {dateError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs font-semibold text-destructive"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{dateError}</span>
        </div>
      )}

      {futureIssue && (
        <AvailabilityNotifier
          targetDate={date}
          experienceOrPackage={`Paquete: ${pkg.name}`}
        />
      )}

      <p className="-mt-2 text-xs text-muted-foreground">
        Disponibilidad abierta para los próximos {MAX_BOOKING_MONTHS_AHEAD} meses.
      </p>

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
