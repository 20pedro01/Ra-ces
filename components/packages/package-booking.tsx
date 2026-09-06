'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, ArrowRight, Bell, Bus, Clock, Minus, Plus } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { AvailabilityNotifier } from '@/components/availability-notifier'
import type { TourPackage } from '@/lib/data'
import { addDays, formatMXN } from '@/lib/format'
import {
  getTodayIso,
  getMaxFutureDateIso,
  getMaxFutureMonthLabel,
  validateSingleDate,
  isLastMinuteBooking,
  MAX_BOOKING_MONTHS_AHEAD,
} from '@/lib/date-validation'
import { useTrip } from '@/lib/trip-store'
import { useLanguage } from '@/lib/i18n/context'
import { getLocalizedPackage } from '@/lib/i18n/data-translations'

export function PackageBooking({ pkg }: { pkg: TourPackage }) {
  const { state, dispatch } = useTrip()
  const { t, language } = useLanguage()
  const locPkg = getLocalizedPackage(pkg, language)
  const router = useRouter()
  const [transport, setTransport] = useState(state.packageId === pkg.id ? state.packageTransport : false)
  const [date, setDate] = useState(state.startDate ?? addDays(getTodayIso(), 14))
  const [dateError, setDateError] = useState<string | null>(null)
  const [futureIssue, setFutureIssue] = useState(false)
  const [showFutureWaitlist, setShowFutureWaitlist] = useState(false)

  const people = state.people
  const subtotal = pkg.price * people
  const transportTotal = transport ? pkg.transportPrice * people : 0

  const reserve = () => {
    const validation = validateSingleDate(date, language)
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
          <span className="font-serif text-3xl font-semibold">{formatMXN(pkg.price, language)}</span>
          <span className="text-sm text-muted-foreground"> {t('card.perPerson')}</span>
        </p>
        <span className="text-sm font-semibold text-muted-foreground">{locPkg.durationLabel}</span>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-bold">
        {language === 'en' ? 'Date' : 'Fecha'}
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
            <span className="font-bold">
              {language === 'en' ? 'Booking within 48 hours:' : 'Reservación en menos de 48 horas:'}
            </span>{' '}
            {language === 'en'
              ? 'We will coordinate directly with the artisans and driver to confirm your spot immediately.'
              : 'Coordinaremos directamente con los artesanos y el chofer para confirmar de inmediato tu espacio.'}
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
          allowCustomDate
          experienceOrPackage={`${language === 'en' ? 'Package' : 'Paquete'}: ${locPkg.name}`}
        />
      )}

      <div className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-muted/30 p-3 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-muted-foreground">
            📅 {language === 'en' ? 'Calendar open through' : 'Calendario hasta'}{' '}
            <strong className="text-foreground">{getMaxFutureMonthLabel(MAX_BOOKING_MONTHS_AHEAD, language)}</strong>.
          </span>
          <button
            type="button"
            onClick={() => setShowFutureWaitlist(!showFutureWaitlist)}
            className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
          >
            <Bell className="size-3.5" />
            {showFutureWaitlist
              ? (language === 'en' ? 'Hide' : 'Ocultar')
              : t('chat.dates.futureQuestion')}
          </button>
        </div>

        {showFutureWaitlist && (
          <AvailabilityNotifier
            targetDate={null}
            allowCustomDate
            experienceOrPackage={`${language === 'en' ? 'Package' : 'Paquete'}: ${locPkg.name}`}
            className="mt-1"
          />
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-bold">{language === 'en' ? 'Guests' : 'Personas'}</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={language === 'en' ? 'Fewer guests' : 'Menos personas'}
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
            aria-label={language === 'en' ? 'More guests' : 'Más personas'}
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
            <Bus className="size-4" aria-hidden="true" /> {t('packages.transportIncluded')}
          </span>
          <span className="text-xs">
            {t('packages.transportDesc').replace('{price}', formatMXN(pkg.transportPrice, language))}
          </span>
        </span>
        <Switch checked={transport} onCheckedChange={setTransport} />
      </label>

      <dl className="flex flex-col gap-1.5 border-t border-border pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">
            {language === 'en' ? `Package × ${people}` : `Paquete × ${people}`}
          </dt>
          <dd>{formatMXN(subtotal, language)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">{t('trip.transportLabel')}</dt>
          <dd>{formatMXN(transportTotal, language)}</dd>
        </div>
        <div className="flex justify-between pt-1 text-lg font-bold">
          <dt>{t('trip.priceTotal')}</dt>
          <dd>{formatMXN(subtotal + transportTotal, language)}</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={reserve}
        className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-earth text-base font-bold text-earth-foreground transition-all hover:bg-earth/90 active:scale-[0.99]"
      >
        {t('packages.reserve')} <ArrowRight className="size-5" aria-hidden="true" />
      </button>
      <p className="text-center text-xs text-muted-foreground">{t('packages.simulatedNote')}</p>
    </div>
  )
}


