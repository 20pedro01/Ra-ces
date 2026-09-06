'use client'

import { useState } from 'react'
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
  Info,
  Leaf,
  Loader2,
  Package,
  Pencil,
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

export function BookingFlow() {
  const { state, totals, dispatch } = useTrip()
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [contact, setContact] = useState({ name: '', email: '', phone: '' })

  const [editingDates, setEditingDates] = useState(!state.startDate)
  const [startDateInput, setStartDateInput] = useState(state.startDate ?? '')
  const [endDateInput, setEndDateInput] = useState(state.endDate ?? state.startDate ?? '')
  const [dateInlineError, setDateInlineError] = useState<string | null>(null)
  const [dateIsFutureIssue, setDateIsFutureIssue] = useState(false)
  const [showFutureWaitlist, setShowFutureWaitlist] = useState(false)
  const pkg = PACKAGES.find((p) => p.id === state.packageId)
  const empty = state.items.length === 0 && !pkg

  if (state.confirmed) {
    return <Confirmation />
  }

  if (empty) {
    return (
      <div className="flex flex-col gap-5">
        <GuideBubble>
          <p>No hay nada que reservar todavía. Empecemos por elegir una experiencia.</p>
        </GuideBubble>
        <Link
          href="/explorar"
          className="inline-flex h-14 w-fit items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-bold text-primary-foreground"
        >
          Armar mi experiencia
        </Link>
      </div>
    )
  }

  const confirm = async () => {
    if (!state.startDate) {
      setErrorMsg('Por favor define las fechas de tu visita antes de confirmar la reservación.')
      setEditingDates(true)
      return
    }

    const dateValidation = validateDates(state.startDate, state.endDate || state.startDate)
    if (!dateValidation.isValid) {
      setErrorMsg(dateValidation.error)
      setEditingDates(true)
      setDateIsFutureIssue(Boolean(dateValidation.isFutureAvailabilityIssue))
      return
    }

    setSubmitting(true)
    setErrorMsg(null)
    try {
      const res = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state,
          totals,
          customer: contact,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Ocurrió un error al procesar la reservación')
      }

      dispatch({ type: 'confirm', code: data.code })
    } catch (err: unknown) {
      console.error('Error al confirmar reservación:', err)
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'No se pudo completar la reservación. Intenta nuevamente.'
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
        <ArrowLeft className="size-4" aria-hidden="true" /> Mi viaje
      </Link>

      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold md:text-4xl">Tu experiencia</h1>
        <GuideBubble>
          <p>Revisa que todo esté como lo quieres. Cuando estés listo, confirmamos.</p>
        </GuideBubble>
      </header>

      <div className="flex flex-col gap-4 rounded-[2rem] border border-border/70 bg-card p-5 shadow-md md:p-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <Calendar className="mt-0.5 size-5 text-primary" aria-hidden="true" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <dt className="text-sm font-bold text-muted-foreground">Fechas</dt>
                <button
                  type="button"
                  onClick={() => setEditingDates(!editingDates)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  <Pencil className="size-3" />
                  {editingDates ? 'Cerrar' : state.startDate ? 'Cambiar' : 'Definir fechas'}
                </button>
              </div>

              {!editingDates ? (
                <dd className="font-semibold">
                  {state.startDate ? formatDate(state.startDate) : (
                    <span className="font-medium text-amber-600">Por definir (requerido)</span>
                  )}
                  {state.endDate && state.endDate !== state.startDate && ` – ${formatDate(state.endDate)}`}
                </dd>
              ) : (
                <div className="mt-2 flex flex-col gap-2 rounded-2xl bg-muted/60 p-3">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <label className="flex flex-col gap-1 text-xs font-semibold">
                      Llegada
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
                      Salida
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
                      experienceOrPackage="Mi Viaje"
                      className="mt-1"
                    />
                  )}

                  <div className="flex flex-col gap-1.5 rounded-xl border border-border/60 bg-background/80 p-2.5 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <span className="text-[11px] text-muted-foreground">
                        Disponibilidad hasta <strong className="text-foreground">{getMaxFutureMonthLabel()}</strong>.
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowFutureWaitlist(!showFutureWaitlist)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                      >
                        <Bell className="size-3" />
                        {showFutureWaitlist ? 'Ocultar' : '¿Viajas después? Avísame'}
                      </button>
                    </div>

                    {showFutureWaitlist && (
                      <AvailabilityNotifier
                        targetDate={null}
                        allowCustomDate
                        experienceOrPackage="Mi Viaje"
                        className="mt-1"
                      />
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-muted-foreground">
                      Máx. {MAX_BOOKING_MONTHS_AHEAD} meses a futuro
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const val = validateDates(startDateInput, endDateInput)
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
                      Guardar fechas
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Users className="mt-0.5 size-5 text-primary" aria-hidden="true" />
            <div>
              <dt className="text-sm font-bold text-muted-foreground">Personas</dt>
              <dd className="font-semibold">{state.people}</dd>
            </div>
          </div>
        </dl>

        <section aria-labelledby="acts" className="flex flex-col gap-2 border-t border-border pt-4">
          <h2 id="acts" className="text-sm font-bold text-muted-foreground">
            Actividades
          </h2>
          <ul className="flex flex-col gap-2">
            {pkg && (
              <li className="flex items-center gap-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-xl">
                  <Image src={pkg.image} alt="" fill sizes="48px" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col">
                  <span className="font-semibold leading-snug">{pkg.name}</span>
                  <span className="text-sm text-muted-foreground">Paquete · {pkg.durationLabel}</span>
                </div>
                <span className="font-semibold">{formatMXN(pkg.price * state.people)}</span>
              </li>
            )}
            {state.items.map((item) => {
              const exp = EXPERIENCE_MAP[item.experienceId]
              if (!exp) return null
              return (
                <li key={item.experienceId} className="flex items-center gap-3">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-xl">
                    <Image src={exp.image} alt="" fill sizes="48px" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="font-semibold leading-snug">{exp.name}</span>
                    <span className="text-sm text-muted-foreground">
                      Día {item.day}
                      {state.startDate && ` · ${formatDateShort(addDays(state.startDate, item.day - 1))}`} ·{' '}
                      {formatHour(item.startHour)}
                    </span>
                  </div>
                  <span className="font-semibold">{formatMXN(exp.price * state.people)}</span>
                </li>
              )
            })}
          </ul>
        </section>

        <section aria-labelledby="transp" className="flex flex-col gap-2 border-t border-border pt-4">
          <h2 id="transp" className="text-sm font-bold text-muted-foreground">
            Transporte
          </h2>
          <p className="flex items-center gap-2">
            <Bus className="size-4 text-primary" aria-hidden="true" />
            {totals.transport > 0 ? (
              <span>
                Transporte Raíces incluido
                {state.transportEnabled && ` · ${formatMXN(TRANSPORT_PRICE_PER_PERSON)} por persona por día`}
              </span>
            ) : (
              <span>Sin transporte. Llegas por tu cuenta.</span>
            )}
          </p>
        </section>

        <section aria-labelledby="extras" className="flex flex-col gap-2 border-t border-border pt-4">
          <h2 id="extras" className="text-sm font-bold text-muted-foreground">
            Opciones adicionales
          </h2>
          {extras.length === 0 ? (
            <p className="text-sm text-muted-foreground">Ninguna</p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {extras.map((item) => (
                <li key={item.experienceId} className="flex items-center gap-2 text-sm">
                  {item.pickup === 'envio' ? (
                    <Truck className="size-4 text-earth" aria-hidden="true" />
                  ) : (
                    <Package className="size-4 text-earth" aria-hidden="true" />
                  )}
                  {EXPERIENCE_MAP[item.experienceId]?.name}:{' '}
                  {item.pickup === 'envio' ? 'envío de la pieza terminada' : 'recoger la pieza posteriormente'}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="contact-section" className="flex flex-col gap-3 border-t border-border pt-4">
          <h2 id="contact-section" className="text-sm font-bold text-muted-foreground">
            Datos de contacto (opcional)
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="customer-name" className="text-xs font-semibold text-muted-foreground">
                Nombre completo
              </label>
              <input
                id="customer-name"
                type="text"
                placeholder="Ej. Sofía Morales"
                value={contact.name}
                onChange={(e) => setContact({ ...contact, name: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="customer-email" className="text-xs font-semibold text-muted-foreground">
                Correo electrónico
              </label>
              <input
                id="customer-email"
                type="email"
                placeholder="tu@correo.com"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </section>

        <dl className="flex flex-col gap-1.5 border-t border-border pt-4">
          <div className="flex justify-between text-sm">
            <dt className="text-muted-foreground">Precio de experiencias</dt>
            <dd>{formatMXN(totals.experiences + totals.packagePrice)}</dd>
          </div>
          <div className="flex justify-between text-sm">
            <dt className="text-muted-foreground">Transporte</dt>
            <dd>{formatMXN(totals.transport)}</dd>
          </div>
          <div className="flex justify-between pt-2 text-2xl font-bold">
            <dt>Total estimado</dt>
            <dd>{formatMXN(totals.total)}</dd>
          </div>
        </dl>

        {isLastMinuteBooking(state.startDate) && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-900 dark:text-amber-200">
            <Clock className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <span className="font-bold">Reservación en las próximas 48 horas:</span>{' '}
              Los talleres artesanales requieren preparación previa de insumos frescos. Al confirmar, coordinaremos inmediatamente con los artesanos para asegurar tu espacio sin contratiempos.
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
          className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-leaf text-base font-bold text-leaf-foreground transition-all hover:bg-leaf/90 active:scale-[0.99] disabled:opacity-70"
        >
          {submitting ? (
            <>
              <Loader2 className="size-5 animate-spin" aria-hidden="true" /> Confirmando…
            </>
          ) : (
            <>
              <Check className="size-5" aria-hidden="true" /> Confirmar reservación
            </>
          )}
        </button>
        <p className="text-center text-xs text-muted-foreground">
          Al confirmar, tu reservación quedará registrada en el sistema.
        </p>
      </div>
    </div>
  )
}

function Confirmation() {
  const { state, totals, dispatch } = useTrip()
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
          <h1 className="text-3xl font-semibold text-balance md:text-4xl">¡Tu experiencia está lista!</h1>
        </div>
      </div>

      <div className="flex max-w-lg flex-col gap-2">
        <p className="text-lg leading-relaxed">Gracias por elegir Raíces.</p>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Ahora estás listo para vivir Yucatán de una manera diferente.
        </p>
      </div>

      <dl className="grid w-full gap-3 rounded-3xl border border-border/70 bg-card p-5 text-left shadow-sm sm:grid-cols-3">
        <div>
          <dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Código</dt>
          <dd className="font-mono text-lg font-bold">{state.confirmationCode}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Fecha</dt>
          <dd className="font-semibold">{state.startDate ? formatDateShort(state.startDate) : 'Por confirmar'}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total estimado</dt>
          <dd className="font-semibold">{formatMXN(totals.total)}</dd>
        </div>
      </dl>

      <div className="w-full max-w-xl rounded-2xl border border-primary/20 bg-primary/5 p-4 text-left sm:p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-primary/15 p-2 text-primary">
            <Info className="size-5 shrink-0" aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <span className="font-bold text-foreground">Coordinación artesanal y comunitaria</span>
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Cada taller se imparte en grupos reducidos guiados directamente por maestros y familias artesanas. Nos pondremos en contacto contigo por correo o teléfono para afinar detalles de llegada, puntos de encuentro y responder cualquier duda antes de tu visita.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/mi-viaje"
          className="inline-flex h-12 items-center rounded-full border border-border bg-card px-5 text-sm font-bold hover:bg-muted"
        >
          Ver mi itinerario
        </Link>
        <Link
          href="/"
          onClick={() => dispatch({ type: 'reset' })}
          className="inline-flex h-12 items-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground hover:bg-primary/90"
        >
          Planear otro viaje
        </Link>
      </div>
    </div>
  )
}
