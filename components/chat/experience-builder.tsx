'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  ArrowRight,
  Bell,
  Bus,
  Car,
  Clock,
  Minus,
  Plus,
  RotateCcw,
  Pencil,
} from 'lucide-react'
import { GuideBubble, TypingBubble, UserBubble } from '@/components/chat/chat-bubble'
import { OptionButton } from '@/components/chat/option-button'
import { CATEGORY_ICONS } from '@/components/category-badge'
import { ExperienceCard } from '@/components/experience-card'
import { TripSummaryBar } from '@/components/trip/trip-summary-bar'
import { AvailabilityNotifier } from '@/components/availability-notifier'
import { BUDGETS, CATEGORIES, ZONES, type BudgetId, type CategoryId, type Zone } from '@/lib/data'
import { addDays, formatDate, formatDateShort } from '@/lib/format'
import {
  getTodayIso,
  getMaxFutureDateIso,
  getMaxFutureMonthLabel,
  validateDates,
  isLastMinuteBooking,
  MAX_BOOKING_MONTHS_AHEAD,
} from '@/lib/date-validation'
import { recommend } from '@/lib/recommend'
import { useTrip } from '@/lib/trip-store'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/context'
import { getLocalizedCategory, getLocalizedZone, getLocalizedBudget } from '@/lib/i18n/data-translations'

type Step = 'dates' | 'people' | 'lodging' | 'budget' | 'categories' | 'transport' | 'results'

const ORDER: Step[] = ['dates', 'people', 'lodging', 'budget', 'categories', 'transport', 'results']

export function ExperienceBuilder() {
  const { state, dispatch } = useTrip()
  const { t, language } = useLanguage()
  const hasAnswers = state.startDate && state.budget && state.needsTransport !== null
  const [step, setStep] = useState<Step>(hasAnswers ? 'results' : 'dates')
  const [typing, setTyping] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  const [startDate, setStartDate] = useState(state.startDate ?? addDays(getTodayIso(), 14))
  const [endDate, setEndDate] = useState(state.endDate ?? addDays(getTodayIso(), 17))
  const [dateError, setDateError] = useState<string | null>(null)
  const [futureIssue, setFutureIssue] = useState(false)
  const [showFutureWaitlist, setShowFutureWaitlist] = useState(false)
  const [zone, setZone] = useState<Zone | null>(state.zone)
  const [lodging, setLodging] = useState(state.lodging)
  const [categories, setCategories] = useState<CategoryId[]>(state.categories)

  const stepIndex = ORDER.indexOf(step)

  const QUESTIONS: Record<Exclude<Step, 'results'>, string> = {
    dates: t('chat.question.dates'),
    people: t('chat.question.people'),
    lodging: t('chat.question.lodging'),
    budget: t('chat.question.budget'),
    categories: t('chat.question.categories'),
    transport: t('chat.question.transport'),
  }

  useEffect(() => {
    setTyping(true)
    const timer = setTimeout(() => setTyping(false), step === 'results' ? 900 : 550)
    return () => clearTimeout(timer)
  }, [step])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [step, typing])

  const recommendations = useMemo(
    () => (step === 'results' ? recommend(state) : []),
    [step, state],
  )

  const next = () => setStep(ORDER[Math.min(stepIndex + 1, ORDER.length - 1)])

  const answers = {
    dates: state.startDate
      ? state.startDate === state.endDate
        ? formatDate(state.startDate, language)
        : language === 'en'
          ? `From ${formatDateShort(state.startDate, language)} to ${formatDateShort(state.endDate ?? state.startDate, language)}`
          : `Del ${formatDateShort(state.startDate, language)} al ${formatDateShort(state.endDate ?? state.startDate, language)}`
      : null,
    people: `${state.people} ${state.people === 1 ? t('chat.people.labelSingle') : t('chat.people.label')}`,
    lodging: state.zone
      ? (() => {
          const z = ZONES.find((z) => z.id === state.zone)
          const locZ = z ? getLocalizedZone(z, language) : null
          return `${locZ?.name ?? ''}${state.lodging ? ` · ${state.lodging}` : ''}`
        })()
      : null,
    budget: state.budget
      ? getLocalizedBudget(BUDGETS.find((b) => b.id === state.budget)!, language)?.range
      : null,
    categories: state.categories.length
      ? state.categories
          .map((c) => {
            const cat = CATEGORIES.find((x) => x.id === c)
            return cat ? getLocalizedCategory(cat, language).name : ''
          })
          .join(', ')
      : null,
    transport:
      state.needsTransport === null
        ? null
        : state.needsTransport
          ? t('chat.transport.no')
          : t('chat.transport.yes'),
  }

  const restart = () => {
    dispatch({ type: 'reset' })
    setCategories([])
    setZone(null)
    setLodging('')
    setStep('dates')
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <section aria-label={language === 'en' ? 'Chat with your guide' : 'Conversación con tu guía'} className="flex flex-col gap-4">
        <header className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
              {language === 'en' ? 'Design My Experience' : 'Armar mi experiencia'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'en' ? 'Take your time. You can change any answer.' : 'Responde con calma. Puedes cambiar cualquier respuesta.'}
            </p>
          </div>
          <ol
            aria-label={language === 'en' ? `Step ${Math.min(stepIndex + 1, 6)} of 6` : `Paso ${Math.min(stepIndex + 1, 6)} de 6`}
            className="hidden items-center gap-1.5 sm:flex"
          >
            {ORDER.slice(0, 6).map((s, i) => (
              <li
                key={s}
                className={cn(
                  'h-2 rounded-full transition-all',
                  i < stepIndex ? 'w-6 bg-leaf' : i === stepIndex ? 'w-8 bg-primary' : 'w-4 bg-border',
                )}
              />
            ))}
          </ol>
        </header>

        <div className="flex flex-col gap-4 rounded-[2rem] bg-sand/70 p-4 md:p-6">
          <GuideBubble>
            <p>{language === 'en'
              ? 'Perfect, let\'s craft something just for you. I\'ll ask you six quick questions.'
              : 'Perfecto, vamos a armar algo a tu medida. Te haré seis preguntas rápidas.'}
            </p>
          </GuideBubble>

          {ORDER.slice(0, stepIndex).map((s) => {
            if (s === 'results') return null
            const answer = answers[s]
            return (
              <div key={s} className="flex flex-col gap-3">
                <GuideBubble>
                  <p>{QUESTIONS[s]}</p>
                </GuideBubble>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(s)}
                    className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-card hover:text-foreground"
                    aria-label={`${language === 'en' ? 'Edit answer' : 'Editar respuesta'}: ${QUESTIONS[s]}`}
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <UserBubble>{answer}</UserBubble>
                </div>
              </div>
            )
          })}

          {typing ? (
            <TypingBubble />
          ) : step === 'results' ? (
            <GuideBubble>
              <p>{t('chat.question.results')}</p>
            </GuideBubble>
          ) : (
            <GuideBubble>
              <p>{QUESTIONS[step]}</p>
            </GuideBubble>
          )}

          {!typing && step !== 'results' && (
            <div className="pop-in ml-0 flex flex-col gap-3 rounded-3xl border border-border/70 bg-card p-4 md:ml-12 md:p-5">
              {step === 'dates' && (
                <>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="flex flex-col gap-1.5 text-sm font-bold">
                      {t('chat.dates.arrival')}
                      <input
                        type="date"
                        value={startDate}
                        min={getTodayIso()}
                        max={getMaxFutureDateIso()}
                        onChange={(e) => {
                          const val = e.target.value
                          setStartDate(val)
                          if (dateError) {
                            setDateError(null)
                            setFutureIssue(false)
                          }
                          if (val && endDate && val > endDate) setEndDate(val)
                        }}
                        className="h-12 rounded-xl border border-input bg-background px-3 text-base font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
                      />
                    </label>
                    <label className="flex flex-col gap-1.5 text-sm font-bold">
                      {t('chat.dates.departure')}
                      <input
                        type="date"
                        value={endDate}
                        min={startDate || getTodayIso()}
                        max={getMaxFutureDateIso()}
                        onChange={(e) => {
                          setEndDate(e.target.value)
                          if (dateError) {
                            setDateError(null)
                            setFutureIssue(false)
                          }
                        }}
                        className="h-12 rounded-xl border border-input bg-background px-3 text-base font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
                      />
                    </label>
                  </div>

                  {isLastMinuteBooking(startDate) && (
                    <div className="flex items-start gap-2.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-200">
                      <Clock className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                      <div>
                        <span className="font-bold">
                          {language === 'en' ? 'Trip within the next 48 hours:' : 'Viaje en las próximas 48 horas:'}
                        </span>{' '}
                        {language === 'en'
                          ? 'Local artisans prepare fresh supplies in advance. Once confirmed, we will coordinate immediately to secure your spot.'
                          : 'Los artesanos preparan materiales frescos con anticipación. Al confirmar tu itinerario, coordinaremos de inmediato para asegurar tu espacio.'}
                      </div>
                    </div>
                  )}

                  {dateError && (
                    <div
                      role="alert"
                      className="flex items-start gap-2.5 rounded-2xl border border-destructive/30 bg-destructive/10 p-3.5 text-sm font-medium text-destructive"
                    >
                      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                      <span>{dateError}</span>
                    </div>
                  )}

                  {futureIssue && (
                    <AvailabilityNotifier
                      targetDate={startDate}
                      allowCustomDate
                      experienceOrPackage={language === 'en' ? 'General Itinerary' : 'Itinerario general'}
                    />
                  )}

                  <div className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-muted/30 p-3 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-muted-foreground">
                        {t('chat.dates.calendarOpen')} <strong className="text-foreground">{getMaxFutureMonthLabel(MAX_BOOKING_MONTHS_AHEAD, language)}</strong>.
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowFutureWaitlist(!showFutureWaitlist)}
                        className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
                      >
                        <Bell className="size-3.5" />
                        {showFutureWaitlist ? t('chat.dates.closeWaitlist') : t('chat.dates.futureQuestion')}
                      </button>
                    </div>

                    {showFutureWaitlist && (
                      <AvailabilityNotifier
                        targetDate={null}
                        allowCustomDate
                        experienceOrPackage={language === 'en' ? 'Custom Itinerary' : 'Itinerario personalizado'}
                        className="mt-1"
                      />
                    )}
                  </div>

                  <NextButton
                    label={language === 'en' ? 'Continue' : 'Continuar'}
                    onClick={() => {
                      const validation = validateDates(startDate, endDate, language)
                      if (!validation.isValid) {
                        setDateError(validation.error)
                        setFutureIssue(Boolean(validation.isFutureAvailabilityIssue))
                        return
                      }
                      setDateError(null)
                      setFutureIssue(false)
                      dispatch({ type: 'setDates', startDate, endDate })
                      next()
                    }}
                  />
                </>
              )}

              {step === 'people' && (
                <>
                  <div className="flex items-center justify-center gap-5 py-2">
                    <button
                      type="button"
                      aria-label={t('chat.people.less')}
                      onClick={() => dispatch({ type: 'setPeople', people: state.people - 1 })}
                      disabled={state.people <= 1}
                      className="flex size-14 items-center justify-center rounded-full border-2 border-border bg-background text-foreground disabled:opacity-40"
                    >
                      <Minus className="size-5" />
                    </button>
                    <output className="min-w-16 text-center font-serif text-5xl font-semibold" aria-live="polite">
                      {state.people}
                    </output>
                    <button
                      type="button"
                      aria-label={t('chat.people.more')}
                      onClick={() => dispatch({ type: 'setPeople', people: state.people + 1 })}
                      disabled={state.people >= 12}
                      className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40"
                    >
                      <Plus className="size-5" />
                    </button>
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    {state.people === 1
                      ? (language === 'en' ? 'Traveling solo' : 'Viajas solo o sola')
                      : language === 'en'
                        ? `${state.people} guests total`
                        : `${state.people} personas en total, contándote`}
                  </p>
                  <NextButton label={language === 'en' ? 'Continue' : 'Continuar'} onClick={next} />
                </>
              )}

              {step === 'lodging' && (
                <>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {language === 'en' ? '1. Choose your Yucatán area:' : '1. Elige la zona de Yucatán:'}
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {ZONES.map((z) => {
                      const locZ = getLocalizedZone(z, language)
                      return (
                        <OptionButton
                          key={z.id}
                          selected={zone === z.id}
                          onClick={() => setZone(z.id)}
                          title={locZ.name}
                          description={locZ.hint}
                        />
                      )
                    })}
                  </div>

                  <label className="flex flex-col gap-1.5 text-sm font-bold">
                    <span className="flex items-center justify-between">
                      <span>{language === 'en' ? '2. Hotel, neighborhood, or town' : '2. Hotel, colonia o pueblo'}</span>
                      <span className="text-xs font-normal text-muted-foreground">
                        ({language === 'en' ? 'optional' : 'opcional'})
                      </span>
                    </span>
                    <input
                      type="text"
                      value={lodging}
                      onChange={(e) => setLodging(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const finalZone = zone || 'merida'
                          setZone(finalZone)
                          dispatch({ type: 'setLodging', zone: finalZone, lodging: lodging.trim() })
                          next()
                        }
                      }}
                      placeholder={language === 'en' ? 'E.g. Hotel in Downtown Mérida' : 'Ej. Hotel en el Centro de Mérida'}
                      className="h-12 rounded-xl border border-input bg-background px-3 text-base font-medium outline-none placeholder:font-normal placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/40"
                    />
                  </label>

                  {!zone && !lodging.trim() && (
                    <p className="text-xs text-muted-foreground">
                      {language === 'en'
                        ? '💡 Select an area above to get nearby recommendations (if unsure, choose Mérida).'
                        : '💡 Elige una zona arriba para recomendarte experiencias cercanas (si no estás seguro, puedes elegir Mérida).'}
                    </p>
                  )}

                  <NextButton
                    label={language === 'en' ? 'Continue' : 'Continuar'}
                    disabled={!zone && !lodging.trim()}
                    onClick={() => {
                      const finalZone = zone || 'merida'
                      setZone(finalZone)
                      dispatch({ type: 'setLodging', zone: finalZone, lodging: lodging.trim() })
                      next()
                    }}
                  />
                </>
              )}

              {step === 'budget' && (
                <div className="grid gap-2">
                  {BUDGETS.map((b) => {
                    const locB = getLocalizedBudget(b, language)
                    return (
                      <OptionButton
                        key={b.id}
                        selected={state.budget === b.id}
                        onClick={() => {
                          dispatch({ type: 'setBudget', budget: b.id as BudgetId })
                          next()
                        }}
                        title={locB.label}
                        description={locB.range}
                      />
                    )
                  })}
                </div>
              )}

              {step === 'categories' && (
                <>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en' ? 'You can choose one or more.' : 'Puedes elegir una o varias.'}
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {CATEGORIES.map((c) => {
                      const locC = getLocalizedCategory(c, language)
                      return (
                        <OptionButton
                          key={c.id}
                          icon={CATEGORY_ICONS[c.id]}
                          selected={categories.includes(c.id)}
                          onClick={() =>
                            setCategories((prev) =>
                              prev.includes(c.id) ? prev.filter((x) => x !== c.id) : [...prev, c.id],
                            )
                          }
                          title={locC.name}
                          description={locC.description}
                        />
                      )
                    })}
                  </div>
                  <NextButton
                    label={language === 'en' ? 'Continue' : 'Continuar'}
                    disabled={categories.length === 0}
                    onClick={() => {
                      dispatch({ type: 'setCategories', categories })
                      next()
                    }}
                  />
                </>
              )}

              {step === 'transport' && (
                <div className="grid gap-2 sm:grid-cols-2">
                  <OptionButton
                    icon={Car}
                    selected={state.needsTransport === false}
                    onClick={() => {
                      dispatch({ type: 'setNeedsTransport', needs: false })
                      next()
                    }}
                    title={t('chat.transport.yes')}
                    description={language === 'en' ? 'I will get to each experience on my own' : 'Llegaré por mi cuenta a cada experiencia'}
                  />
                  <OptionButton
                    icon={Bus}
                    selected={state.needsTransport === true}
                    onClick={() => {
                      dispatch({ type: 'setNeedsTransport', needs: true })
                      next()
                    }}
                    title={t('chat.transport.no')}
                    description={language === 'en' ? 'Raíces Transportation from your lodging' : 'Transporte Raíces desde tu hospedaje'}
                  />
                </div>
              )}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {step === 'results' && !typing && (
          <div className="pop-in flex flex-col gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              {recommendations.map(({ experience, reason }) => (
                <ExperienceCard key={experience.id} experience={experience} reason={reason} />
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-border/70 bg-card p-4">
              <p className="text-sm text-muted-foreground">
                {language === 'en'
                  ? "Not what you were looking for? Edit your answers or start over."
                  : "¿No es lo que buscabas? Cambia tus respuestas o empieza de nuevo."}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('categories')}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-bold hover:bg-muted"
                >
                  <Pencil className="size-4" aria-hidden="true" /> {language === 'en' ? 'Edit' : 'Editar'}
                </button>
                <button
                  type="button"
                  onClick={restart}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-bold hover:bg-muted"
                >
                  <RotateCcw className="size-4" aria-hidden="true" /> {t('chat.buttons.reset')}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <TripSummaryBar />
      </aside>

      {step === 'results' && state.items.length > 0 && (
        <div className="fixed inset-x-0 bottom-16 z-30 px-4 pb-2 lg:hidden">
          <Link
            href="/mi-viaje"
            className="flex h-14 items-center justify-between rounded-full bg-foreground px-5 text-background shadow-xl"
          >
            <span className="font-bold">
              {state.items.length} {state.items.length === 1
                ? (language === 'en' ? 'experience' : 'experiencia')
                : (language === 'en' ? 'experiences' : 'experiencias')}{' '}
              {language === 'en' ? 'in My Trip' : 'en Mi viaje'}
            </span>
            <span className="inline-flex items-center gap-1 text-sm font-bold">
              {language === 'en' ? 'View' : 'Ver'} <ArrowRight className="size-4" aria-hidden="true" />
            </span>
          </Link>
        </div>
      )}
    </div>
  )
}

function NextButton({ onClick, disabled, label }: { onClick: () => void; disabled?: boolean; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-12 items-center justify-center gap-2 self-end rounded-full bg-primary px-6 text-base font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-40"
    >
      {label}
      <ArrowRight className="size-4" aria-hidden="true" />
    </button>
  )
}

