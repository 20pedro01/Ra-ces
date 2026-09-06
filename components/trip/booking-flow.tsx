'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  AlertCircle,
  ArrowLeft,
  Bell,
  Bus,
  Calendar,
  Check,
  Clock,
  CreditCard,
  Info,
  Landmark,
  Leaf,
  Loader2,
  Lock,
  Package,
  Pencil,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
} from 'lucide-react'
import { GuideBubble } from '@/components/chat/chat-bubble'
import { AvailabilityNotifier } from '@/components/availability-notifier'
import { EXPERIENCE_MAP, PACKAGES, TRANSPORT_PRICE_PER_PERSON } from '@/lib/data'
import { addDays, formatDate, formatDateShort, formatHour, formatMXN } from '@/lib/format'
import {
  getTodayIso,
  getMaxFutureDateIso,
  getMaxFutureMonthLabel,
  validateDates,
  isLastMinuteBooking,
  MAX_BOOKING_MONTHS_AHEAD,
} from '@/lib/date-validation'
import { useTrip } from '@/lib/trip-store'
import { useLanguage } from '@/lib/i18n/context'
import { getLocalizedExperience, getLocalizedPackage } from '@/lib/i18n/data-translations'
import { cn } from '@/lib/utils'

export function BookingFlow() {
  const { state, totals, dispatch } = useTrip()
  const { t, language } = useLanguage()
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [contact, setContact] = useState({ name: '', email: '', phone: '' })

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'spei'>('card')
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [showValidationModal, setShowValidationModal] = useState(false)

  const [editingDates, setEditingDates] = useState(!state.startDate)
  const [startDateInput, setStartDateInput] = useState(state.startDate ?? '')
  const [endDateInput, setEndDateInput] = useState(state.endDate ?? state.startDate ?? '')
  const [dateInlineError, setDateInlineError] = useState<string | null>(null)
  const [dateIsFutureIssue, setDateIsFutureIssue] = useState(false)
  const [showFutureWaitlist, setShowFutureWaitlist] = useState(false)
  const pkg = PACKAGES.find((p) => p.id === state.packageId)
  const locPkg = pkg ? getLocalizedPackage(pkg, language) : null
  const empty = state.items.length === 0 && !pkg

  // Registrar intención de compra automáticamente cuando la persona llega a la etapa de cobro
  useEffect(() => {
    if (empty) return
    try {
      const alreadyTracked = sessionStorage.getItem('vr_checkout_intent_tracked')
      if (!alreadyTracked) {
        sessionStorage.setItem('vr_checkout_intent_tracked', '1')
        fetch('/api/metricas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          keepalive: true,
          body: JSON.stringify({
            evento: 'intencion_compra',
            metadata: {
              origen: 'llego_a_etapa_cobro',
              total: totals.total,
              packageId: state.packageId,
              itemsCount: state.items.length,
              people: state.people,
              timestamp: new Date().toISOString(),
            },
          }),
        }).catch((e) => console.warn('Error registrando intención de compra al llegar a cobro:', e))
      }
    } catch {
      // Silencioso si sessionStorage no está disponible
    }
  }, [empty, totals.total, state.packageId, state.items.length, state.people])

  if (state.confirmed) {
    return (
      <>
        <Confirmation onReopenModal={() => setShowValidationModal(true)} />
        {showValidationModal && (
          <ValidationModal onClose={() => setShowValidationModal(false)} />
        )}
      </>
    )
  }

  if (empty) {
    return (
      <div className="flex flex-col gap-5">
        <GuideBubble>
          <p>{language === 'en' ? 'There is nothing to book yet. Let\'s start by choosing an experience.' : 'No hay nada que reservar todavía. Empecemos por elegir una experiencia.'}</p>
        </GuideBubble>
        <Link
          href="/explorar"
          className="inline-flex h-14 w-fit items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-bold text-primary-foreground"
        >
          {t('trip.emptyAction')}
        </Link>
      </div>
    )
  }

  const confirm = async () => {
    if (!state.startDate) {
      setErrorMsg(language === 'en' ? 'Please define the dates of your visit before confirming the reservation.' : 'Por favor define las fechas de tu visita antes de confirmar la reservación.')
      setEditingDates(true)
      return
    }

    const dateValidation = validateDates(state.startDate, state.endDate || state.startDate, language)
    if (!dateValidation.isValid) {
      setErrorMsg(dateValidation.error)
      setEditingDates(true)
      setDateIsFutureIssue(Boolean(dateValidation.isFutureAvailabilityIssue))
      return
    }

    setSubmitting(true)
    setErrorMsg(null)
    try {
      // Si por alguna razón la métrica no se registró al entrar al cobro, registrarla aquí
      try {
        const alreadyTracked = sessionStorage.getItem('vr_checkout_intent_tracked')
        if (!alreadyTracked) {
          sessionStorage.setItem('vr_checkout_intent_tracked', '1')
          fetch('/api/metricas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            keepalive: true,
            body: JSON.stringify({
              evento: 'intencion_compra',
              metadata: {
                origen: 'confirmacion_pago_click',
                total: totals.total,
                method: paymentMethod,
                people: state.people,
                startDate: state.startDate,
                endDate: state.endDate,
                packageId: state.packageId,
                itemsCount: state.items.length,
                customerEmail: contact.email || null,
                customerName: contact.name || null,
              },
            }),
          }).catch(() => {})
        }
      } catch {}

      // Procesar reservación
      const res = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state,
          totals,
          customer: contact,
          paymentMethod,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || (language === 'en' ? 'An error occurred while processing the reservation' : 'Ocurrió un error al procesar la reservación'))
      }

      setShowValidationModal(true)
      dispatch({ type: 'confirm', code: data.code })
    } catch (err: unknown) {
      console.error('Error al confirmar reservación:', err)
      setErrorMsg(
        err instanceof Error
          ? err.message
          : (language === 'en' ? 'Could not complete the reservation. Please try again.' : 'No se pudo completar la reservación. Intenta nuevamente.')
      )
    } finally {
      setSubmitting(false)
    }
  }

  const extras = state.items.filter((i) => i.pickup)

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/mi-viaje"
        className="inline-flex h-11 w-fit items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-bold hover:bg-muted"
      >
        <ArrowLeft className="size-4" aria-hidden="true" /> {t('trip.myTrip')}
      </Link>

      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold md:text-4xl">{t('trip.title')}</h1>
        <GuideBubble>
          <p>{t('trip.reviewPrompt')}</p>
        </GuideBubble>
      </header>

      <div className="flex flex-col gap-4 rounded-[2rem] border border-border/70 bg-card p-5 shadow-md md:p-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <Calendar className="mt-0.5 size-5 text-primary" aria-hidden="true" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <dt className="text-sm font-bold text-muted-foreground">{t('trip.datesLabel')}</dt>
                <button
                  type="button"
                  onClick={() => setEditingDates(!editingDates)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  <Pencil className="size-3" />
                  {editingDates
                    ? (language === 'en' ? 'Close' : 'Cerrar')
                    : state.startDate
                      ? t('trip.datesChange')
                      : t('trip.datesDefine')}
                </button>
              </div>

              {!editingDates ? (
                <dd className="font-semibold">
                  {state.startDate ? formatDate(state.startDate, language) : (
                    <span className="font-medium text-amber-600">{t('trip.datesPending')}</span>
                  )}
                  {state.endDate && state.endDate !== state.startDate && ` – ${formatDate(state.endDate, language)}`}
                </dd>
              ) : (
                <div className="mt-2 flex flex-col gap-2 rounded-2xl bg-muted/60 p-3">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <label className="flex flex-col gap-1 text-xs font-semibold">
                      {t('chat.dates.arrival')}
                      <input
                        type="date"
                        value={startDateInput}
                        min={getTodayIso()}
                        max={getMaxFutureDateIso()}
                        onChange={(e) => {
                          const val = e.target.value
                          setStartDateInput(val)
                          if (dateInlineError) {
                            setDateInlineError(null)
                            setDateIsFutureIssue(false)
                          }
                          if (val && endDateInput && val > endDateInput) setEndDateInput(val)
                        }}
                        className="h-9 rounded-lg border border-input bg-background px-2.5 text-xs font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-xs font-semibold">
                      {t('chat.dates.departure')}
                      <input
                        type="date"
                        value={endDateInput}
                        min={startDateInput || getTodayIso()}
                        max={getMaxFutureDateIso()}
                        onChange={(e) => {
                          setEndDateInput(e.target.value)
                          if (dateInlineError) {
                            setDateInlineError(null)
                            setDateIsFutureIssue(false)
                          }
                        }}
                        className="h-9 rounded-lg border border-input bg-background px-2.5 text-xs font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </label>
                  </div>
                  {dateInlineError && (
                    <p className="flex items-start gap-1 text-xs font-semibold text-destructive">
                      <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                      <span>{dateInlineError}</span>
                    </p>
                  )}

                  {dateIsFutureIssue && (
                    <AvailabilityNotifier
                      targetDate={startDateInput}
                      allowCustomDate
                      experienceOrPackage={language === 'en' ? 'My Trip' : 'Mi Viaje'}
                      className="mt-1"
                    />
                  )}

                  <div className="flex flex-col gap-1.5 rounded-xl border border-border/60 bg-background/80 p-2.5 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <span className="text-[11px] text-muted-foreground">
                        {language === 'en' ? 'Availability through' : 'Disponibilidad hasta'} <strong className="text-foreground">{getMaxFutureMonthLabel(MAX_BOOKING_MONTHS_AHEAD, language)}</strong>.
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowFutureWaitlist(!showFutureWaitlist)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                      >
                        <Bell className="size-3" />
                        {showFutureWaitlist
                          ? (language === 'en' ? 'Hide' : 'Ocultar')
                          : (language === 'en' ? 'Traveling later? Notify me' : '¿Viajas después? Avísame')}
                      </button>
                    </div>

                    {showFutureWaitlist && (
                      <AvailabilityNotifier
                        targetDate={null}
                        allowCustomDate
                        experienceOrPackage={language === 'en' ? 'My Trip' : 'Mi Viaje'}
                        className="mt-1"
                      />
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-muted-foreground">
                      {language === 'en' ? `Max. ${MAX_BOOKING_MONTHS_AHEAD} months in advance` : `Máx. ${MAX_BOOKING_MONTHS_AHEAD} meses a futuro`}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const val = validateDates(startDateInput, endDateInput, language)
                        if (!val.isValid) {
                          setDateInlineError(val.error)
                          setDateIsFutureIssue(Boolean(val.isFutureAvailabilityIssue))
                          return
                        }
                        setDateInlineError(null)
                        setDateIsFutureIssue(false)
                        setErrorMsg(null)
                        dispatch({
                          type: 'setDates',
                          startDate: startDateInput,
                          endDate: endDateInput,
                        })
                        setEditingDates(false)
                      }}
                      className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90"
                    >
                      {t('trip.saveDates')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Users className="mt-0.5 size-5 text-primary" aria-hidden="true" />
            <div>
              <dt className="text-sm font-bold text-muted-foreground">{t('trip.peopleLabel')}</dt>
              <dd className="font-semibold">{state.people}</dd>
            </div>
          </div>
        </dl>

        <section aria-labelledby="acts" className="flex flex-col gap-2 border-t border-border pt-4">
          <h2 id="acts" className="text-sm font-bold text-muted-foreground">
            {t('trip.activitiesLabel')}
          </h2>
          <ul className="flex flex-col gap-2">
            {pkg && locPkg && (
              <li className="flex items-center gap-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-xl">
                  <Image src={pkg.image} alt="" fill sizes="48px" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col">
                  <span className="font-semibold leading-snug">{locPkg.name}</span>
                  <span className="text-sm text-muted-foreground">{language === 'en' ? 'Package' : 'Paquete'} · {locPkg.durationLabel}</span>
                </div>
                <span className="font-semibold">{formatMXN(pkg.price * state.people, language)}</span>
              </li>
            )}
            {state.items.map((item) => {
              const exp = EXPERIENCE_MAP[item.experienceId]
              if (!exp) return null
              const locExp = getLocalizedExperience(exp, language)
              return (
                <li key={item.experienceId} className="flex items-center gap-3">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-xl">
                    <Image src={exp.image} alt="" fill sizes="48px" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="font-semibold leading-snug">{locExp.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {language === 'en' ? 'Day' : 'Día'} {item.day}
                      {state.startDate && ` · ${formatDateShort(addDays(state.startDate, item.day - 1), language)}`} ·{' '}
                      {formatHour(item.startHour)}
                    </span>
                  </div>
                  <span className="font-semibold">{formatMXN(exp.price * state.people, language)}</span>
                </li>
              )
            })}
          </ul>
        </section>

        <section aria-labelledby="transp" className="flex flex-col gap-2 border-t border-border pt-4">
          <h2 id="transp" className="text-sm font-bold text-muted-foreground">
            {t('trip.transportLabel')}
          </h2>
          <p className="flex items-center gap-2">
            <Bus className="size-4 text-primary" aria-hidden="true" />
            {totals.transport > 0 ? (
              <span>
                {t('trip.transportIncluded')}
                {state.transportEnabled && ` · ${formatMXN(TRANSPORT_PRICE_PER_PERSON, language)} ${language === 'en' ? 'per guest per day' : 'por persona por día'}`}
              </span>
            ) : (
              <span>{t('trip.transportNone')}</span>
            )}
          </p>
        </section>

        <section aria-labelledby="extras" className="flex flex-col gap-2 border-t border-border pt-4">
          <h2 id="extras" className="text-sm font-bold text-muted-foreground">
            {t('trip.extrasLabel')}
          </h2>
          {extras.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('trip.extrasNone')}</p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {extras.map((item) => {
                const exp = EXPERIENCE_MAP[item.experienceId]
                const locExp = exp ? getLocalizedExperience(exp, language) : null
                return (
                  <li key={item.experienceId} className="flex items-center gap-2 text-sm">
                    {item.pickup === 'envio' ? (
                      <Truck className="size-4 text-earth" aria-hidden="true" />
                    ) : (
                      <Package className="size-4 text-earth" aria-hidden="true" />
                    )}
                    {locExp?.name ?? exp?.name}:{' '}
                    {item.pickup === 'envio' ? t('trip.shippingOption') : t('trip.pickupOption')}
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section aria-labelledby="contact-section" className="flex flex-col gap-3 border-t border-border pt-4">
          <h2 id="contact-section" className="text-sm font-bold text-muted-foreground">
            {t('trip.contactTitle')}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="customer-name" className="text-xs font-semibold text-muted-foreground">
                {t('trip.contactName')}
              </label>
              <input
                id="customer-name"
                type="text"
                placeholder={language === 'en' ? 'E.g. Sarah Jenkins' : 'Ej. Sofía Morales'}
                value={contact.name}
                onChange={(e) => setContact({ ...contact, name: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="customer-email" className="text-xs font-semibold text-muted-foreground">
                {t('trip.contactEmail')}
              </label>
              <input
                id="customer-email"
                type="email"
                placeholder={language === 'en' ? 'your@email.com' : 'tu@correo.com'}
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </section>

        {/* Sección de Método de Pago y Validación */}
        <section aria-labelledby="payment-section" className="flex flex-col gap-4 border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <h2 id="payment-section" className="text-sm font-bold text-muted-foreground">
              {t('pay.methodTitle')}
            </h2>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-leaf">
              <ShieldCheck className="size-3.5" />
              {language === 'en' ? 'Verified validation' : 'Validación comunitaria'}
            </span>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={cn(
                'flex flex-col gap-1 rounded-2xl border-2 p-3.5 text-left transition-all',
                paymentMethod === 'card'
                  ? 'border-primary bg-primary/5 text-foreground shadow-sm'
                  : 'border-border/80 bg-background/50 hover:border-border hover:bg-muted/30'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-bold">
                  <CreditCard className="size-4 text-primary" />
                  {t('pay.card')}
                </span>
                <span className={cn('size-2.5 rounded-full', paymentMethod === 'card' ? 'bg-primary' : 'bg-border')} />
              </div>
              <span className="text-[11px] text-muted-foreground">{t('pay.cardSub')}</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('spei')}
              className={cn(
                'flex flex-col gap-1 rounded-2xl border-2 p-3.5 text-left transition-all',
                paymentMethod === 'spei'
                  ? 'border-primary bg-primary/5 text-foreground shadow-sm'
                  : 'border-border/80 bg-background/50 hover:border-border hover:bg-muted/30'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-bold">
                  <Landmark className="size-4 text-earth" />
                  {t('pay.spei')}
                </span>
                <span className={cn('size-2.5 rounded-full', paymentMethod === 'spei' ? 'bg-earth' : 'bg-border')} />
              </div>
              <span className="text-[11px] text-muted-foreground">{t('pay.speiSub')}</span>
            </button>
          </div>

          {paymentMethod === 'card' ? (
            <div className="flex flex-col gap-2.5 rounded-2xl border border-border/80 bg-muted/20 p-3.5">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">
                  {t('pay.cardNumber')}
                </label>
                <div className="relative mt-1">
                  <CreditCard className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    maxLength={19}
                    placeholder="4242 •••• •••• 4242"
                    value={cardNumber}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, '').slice(0, 16)
                      const formatted = v.match(/.{1,4}/g)?.join(' ') || v
                      setCardNumber(formatted)
                    }}
                    className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-xs font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground">
                    {t('pay.cardName')}
                  </label>
                  <input
                    type="text"
                    placeholder={language === 'en' ? 'E.g. Sarah Jenkins' : 'Ej. Sofía Morales'}
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">
                      {t('pay.cardExpiry')}
                    </label>
                    <input
                      type="text"
                      maxLength={5}
                      placeholder="MM/AA"
                      value={cardExpiry}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, '').slice(0, 4)
                        if (v.length > 2) v = `${v.slice(0, 2)}/${v.slice(2)}`
                        setCardExpiry(v)
                      }}
                      className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-2.5 text-center text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">
                      {t('pay.cardCvc')}
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="•••"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-2.5 text-center text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 rounded-2xl border border-border/80 bg-muted/20 p-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{language === 'en' ? 'Bank / Institution' : 'Institución'}:</span>
                <span className="font-semibold">STP / SPEI</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">CLABE:</span>
                <span className="font-mono font-bold text-foreground">6461 8015 7000 0000 04</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{language === 'en' ? 'Beneficiary' : 'Beneficiario'}:</span>
                <span className="font-semibold">Raíces · Turismo Comunitario</span>
              </div>
            </div>
          )}

          <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Lock className="size-3.5 text-leaf" />
            <span>{t('pay.guarantee')}</span>
          </p>
        </section>

        <dl className="flex flex-col gap-1.5 border-t border-border pt-4">
          <div className="flex justify-between text-sm">
            <dt className="text-muted-foreground">{t('trip.priceExperiences')}</dt>
            <dd>{formatMXN(totals.experiences + totals.packagePrice, language)}</dd>
          </div>
          <div className="flex justify-between text-sm">
            <dt className="text-muted-foreground">{t('trip.priceTransport')}</dt>
            <dd>{formatMXN(totals.transport, language)}</dd>
          </div>
          <div className="flex justify-between pt-2 text-2xl font-bold">
            <dt>{t('trip.priceTotal')}</dt>
            <dd>{formatMXN(totals.total, language)}</dd>
          </div>
        </dl>

        {isLastMinuteBooking(state.startDate) && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-900 dark:text-amber-200">
            <Clock className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              {t('trip.lastMinuteNotice')}
            </div>
          </div>
        )}

        {errorMsg && (
          <div
            role="alert"
            className="rounded-2xl border border-destructive/40 bg-destructive/10 p-3 text-center text-sm font-semibold text-destructive"
          >
            {errorMsg}
          </div>
        )}

        <button
          type="button"
          onClick={confirm}
          disabled={submitting}
          className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-leaf text-base font-bold text-leaf-foreground transition-all hover:bg-leaf/90 active:scale-[0.99] disabled:opacity-70 shadow-md"
        >
          {submitting ? (
            <>
              <Loader2 className="size-5 animate-spin" aria-hidden="true" /> {t('pay.processing')}
            </>
          ) : (
            <>
              <CreditCard className="size-5" aria-hidden="true" /> {t('pay.completeButton')} · {formatMXN(totals.total, language)}
            </>
          )}
        </button>
        <p className="text-center text-xs text-muted-foreground">
          {t('trip.confirmNotice')}
        </p>
      </div>
    </div>
  )
}

function ValidationModal({ onClose }: { onClose: () => void }) {
  const { t, language } = useLanguage()

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/70 p-4 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative flex w-full max-w-lg flex-col gap-5 rounded-[2rem] border border-leaf/40 bg-card p-6 shadow-2xl md:p-8">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-leaf/20 text-leaf">
            <ShieldCheck className="size-7" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <span className="text-xs font-bold uppercase tracking-wider text-leaf">
              {t('pay.validationModalTitle')}
            </span>
            <h2 className="mt-0.5 text-xl font-bold leading-snug text-foreground">
              {t('pay.validationModalNoCharge')}
            </h2>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-sand/60 p-4 text-xs leading-relaxed text-foreground/90 sm:text-sm">
          <p>{t('pay.validationModalDesc')}</p>
          <p className="font-semibold text-primary">
            {t('pay.validationModalIntentSaved')}
          </p>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-2.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles className="size-4 text-amber-500" />
            {language === 'en' ? 'Intent recorded successfully' : 'Intención registrada exitosamente'}
          </span>
          <span className="font-mono font-bold text-foreground">MVP Validated</span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90"
        >
          <Check className="size-4" />
          {t('pay.validationModalGotIt')}
        </button>
      </div>
    </div>
  )
}

function Confirmation({ onReopenModal }: { onReopenModal?: () => void }) {
  const { state, totals, dispatch } = useTrip()
  const { t, language } = useLanguage()
  const pkg = PACKAGES.find((p) => p.id === state.packageId)
  const first = state.items[0] ? EXPERIENCE_MAP[state.items[0].experienceId] : null
  const image = pkg?.image ?? first?.image ?? '/images/comunidad.png'

  return (
    <div className="pop-in flex flex-col items-center gap-6 text-center">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[2rem] shadow-md">
        <Image src={image} alt="" fill priority sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 p-6 text-primary-foreground">
          <span className="flex size-14 items-center justify-center rounded-full bg-leaf text-leaf-foreground">
            <Leaf className="size-7" aria-hidden="true" />
          </span>
          <h1 className="text-3xl font-semibold text-balance md:text-4xl">{t('confirm.heroTitle')}</h1>
        </div>
      </div>

      {/* Banner de Validación Transparente (Sin cobro) */}
      <div className="flex w-full max-w-xl items-center justify-between gap-3 rounded-2xl border border-leaf/30 bg-leaf/10 p-3.5 text-left sm:p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-leaf" />
          <div className="flex flex-col gap-0.5 text-xs sm:text-sm">
            <span className="font-bold text-leaf">{t('pay.validationModalNoCharge')}</span>
            <span className="text-xs text-muted-foreground">{t('pay.validationModalIntentSaved')}</span>
          </div>
        </div>
        {onReopenModal && (
          <button
            type="button"
            onClick={onReopenModal}
            className="shrink-0 text-xs font-bold text-primary hover:underline"
          >
            {language === 'en' ? 'Details' : 'Ver detalle'}
          </button>
        )}
      </div>

      <div className="flex max-w-lg flex-col gap-2">
        <p className="text-lg leading-relaxed">{t('confirm.thanks')}</p>
        <p className="text-lg leading-relaxed text-muted-foreground">
          {t('confirm.tagline')}
        </p>
      </div>

      <dl className="grid w-full gap-3 rounded-3xl border border-border/70 bg-card p-5 text-left shadow-sm sm:grid-cols-3">
        <div>
          <dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t('confirm.code')}</dt>
          <dd className="font-mono text-lg font-bold">{state.confirmationCode}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t('confirm.date')}</dt>
          <dd className="font-semibold">{state.startDate ? formatDateShort(state.startDate, language) : (language === 'en' ? 'To be confirmed' : 'Por confirmar')}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t('confirm.total')}</dt>
          <dd className="font-semibold">{formatMXN(totals.total, language)}</dd>
        </div>
      </dl>

      <div className="w-full max-w-xl rounded-2xl border border-primary/20 bg-primary/5 p-4 text-left sm:p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-primary/15 p-2 text-primary">
            <Info className="size-5 shrink-0" aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <span className="font-bold text-foreground">{t('confirm.communityTitle')}</span>
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {t('confirm.communityDesc')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/mi-viaje"
          className="inline-flex h-12 items-center rounded-full border border-border bg-card px-5 text-sm font-bold hover:bg-muted"
        >
          {t('confirm.viewItinerary')}
        </Link>
        <Link
          href="/"
          onClick={() => dispatch({ type: 'reset' })}
          className="inline-flex h-12 items-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground hover:bg-primary/90"
        >
          {t('confirm.planAnother')}
        </Link>
      </div>
    </div>
  )
}
