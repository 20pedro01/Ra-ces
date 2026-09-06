'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Bus,
  Car,
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
import { BUDGETS, CATEGORIES, ZONES, type BudgetId, type CategoryId, type Zone } from '@/lib/data'
import { addDays, formatDate, formatDateShort } from '@/lib/format'
import { recommend } from '@/lib/recommend'
import { useTrip } from '@/lib/trip-store'
import { cn } from '@/lib/utils'

type Step = 'dates' | 'people' | 'lodging' | 'budget' | 'categories' | 'transport' | 'results'

const ORDER: Step[] = ['dates', 'people', 'lodging', 'budget', 'categories', 'transport', 'results']

const QUESTIONS: Record<Exclude<Step, 'results'>, string> = {
  dates: '¿Cuándo visitarás Yucatán?',
  people: '¿Cuántas personas viajarán contigo?',
  lodging: '¿Dónde te hospedarás?',
  budget: '¿Cuál es tu presupuesto aproximado?',
  categories: '¿Qué te gustaría vivir?',
  transport: '¿Cuentas con transporte?',
}

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export function ExperienceBuilder() {
  const { state, dispatch } = useTrip()
  const hasAnswers = state.startDate && state.budget && state.needsTransport !== null
  const [step, setStep] = useState<Step>(hasAnswers ? 'results' : 'dates')
  const [typing, setTyping] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  const [startDate, setStartDate] = useState(state.startDate ?? addDays(todayIso(), 14))
  const [endDate, setEndDate] = useState(state.endDate ?? addDays(todayIso(), 17))
  const [zone, setZone] = useState<Zone | null>(state.zone)
  const [lodging, setLodging] = useState(state.lodging)
  const [categories, setCategories] = useState<CategoryId[]>(state.categories)

  const stepIndex = ORDER.indexOf(step)

  useEffect(() => {
    setTyping(true)
    const t = setTimeout(() => setTyping(false), step === 'results' ? 900 : 550)
    return () => clearTimeout(t)
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
        ? formatDate(state.startDate)
        : `Del ${formatDateShort(state.startDate)} al ${formatDateShort(state.endDate ?? state.startDate)}`
      : null,
    people: `${state.people} ${state.people === 1 ? 'persona' : 'personas'}`,
    lodging: state.zone
      ? `${ZONES.find((z) => z.id === state.zone)?.name}${state.lodging ? ` · ${state.lodging}` : ''}`
      : null,
    budget: state.budget ? BUDGETS.find((b) => b.id === state.budget)?.range : null,
    categories: state.categories.length
      ? state.categories.map((c) => CATEGORIES.find((x) => x.id === c)?.name).join(', ')
      : null,
    transport:
      state.needsTransport === null
        ? null
        : state.needsTransport
          ? 'No, necesito transporte'
          : 'Sí, cuento con transporte',
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
      <section aria-label="Conversación con tu guía" className="flex flex-col gap-4">
        <header className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-semibold leading-tight md:text-4xl">Armar mi experiencia</h1>
            <p className="text-muted-foreground">Responde con calma. Puedes cambiar cualquier respuesta.</p>
          </div>
          <ol
            aria-label={`Paso ${Math.min(stepIndex + 1, 6)} de 6`}
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
            <p>Perfecto, vamos a armar algo a tu medida. Te haré seis preguntas rápidas.</p>
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
                    aria-label={`Editar respuesta: ${QUESTIONS[s]}`}
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
              <p>
                Perfecto. Basándome en tus preferencias, encontré estas experiencias para ti:
              </p>
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
                      Llegada
                      <input
                        type="date"
                        value={startDate}
                        min={todayIso()}
                        onChange={(e) => {
                          setStartDate(e.target.value)
                          if (e.target.value > endDate) setEndDate(e.target.value)
                        }}
                        className="h-12 rounded-xl border border-input bg-background px-3 text-base font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
                      />
                    </label>
                    <label className="flex flex-col gap-1.5 text-sm font-bold">
                      Salida
                      <input
                        type="date"
                        value={endDate}
                        min={startDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="h-12 rounded-xl border border-input bg-background px-3 text-base font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
                      />
                    </label>
                  </div>
                  <NextButton
                    onClick={() => {
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
                      aria-label="Menos personas"
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
                      aria-label="Más personas"
                      onClick={() => dispatch({ type: 'setPeople', people: state.people + 1 })}
                      disabled={state.people >= 12}
                      className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40"
                    >
                      <Plus className="size-5" />
                    </button>
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    {state.people === 1 ? 'Viajas solo o sola' : `${state.people} personas en total, contándote`}
                  </p>
                  <NextButton onClick={next} />
                </>
              )}

              {step === 'lodging' && (
                <>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {ZONES.map((z) => (
                      <OptionButton
                        key={z.id}
                        selected={zone === z.id}
                        onClick={() => setZone(z.id)}
                        title={z.name}
                        description={z.hint}
                      />
                    ))}
                  </div>
                  <label className="flex flex-col gap-1.5 text-sm font-bold">
                    Hotel, colonia o pueblo (opcional)
                    <input
                      type="text"
                      value={lodging}
                      onChange={(e) => setLodging(e.target.value)}
                      placeholder="Ej. Hotel en el Centro de Mérida"
                      className="h-12 rounded-xl border border-input bg-background px-3 text-base font-medium outline-none placeholder:font-normal placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/40"
                    />
                  </label>
                  <NextButton
                    disabled={!zone}
                    onClick={() => {
                      if (!zone) return
                      dispatch({ type: 'setLodging', zone, lodging: lodging.trim() })
                      next()
                    }}
                  />
                </>
              )}

              {step === 'budget' && (
                <div className="grid gap-2">
                  {BUDGETS.map((b) => (
                    <OptionButton
                      key={b.id}
                      selected={state.budget === b.id}
                      onClick={() => {
                        dispatch({ type: 'setBudget', budget: b.id as BudgetId })
                        next()
                      }}
                      title={b.label}
                      description={b.range}
                    />
                  ))}
                </div>
              )}

              {step === 'categories' && (
                <>
                  <p className="text-sm text-muted-foreground">Puedes elegir una o varias.</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {CATEGORIES.map((c) => (
                      <OptionButton
                        key={c.id}
                        icon={CATEGORY_ICONS[c.id]}
                        selected={categories.includes(c.id)}
                        onClick={() =>
                          setCategories((prev) =>
                            prev.includes(c.id) ? prev.filter((x) => x !== c.id) : [...prev, c.id],
                          )
                        }
                        title={c.name}
                        description={c.description}
                      />
                    ))}
                  </div>
                  <NextButton
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
                    title="Sí, cuento con transporte"
                    description="Llegaré por mi cuenta a cada experiencia"
                  />
                  <OptionButton
                    icon={Bus}
                    selected={state.needsTransport === true}
                    onClick={() => {
                      dispatch({ type: 'setNeedsTransport', needs: true })
                      next()
                    }}
                    title="No, necesito transporte"
                    description="Transporte Raíces desde tu hospedaje"
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
                ¿No es lo que buscabas? Cambia tus respuestas o empieza de nuevo.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('categories')}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-bold hover:bg-muted"
                >
                  <Pencil className="size-4" aria-hidden="true" /> Editar
                </button>
                <button
                  type="button"
                  onClick={restart}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-bold hover:bg-muted"
                >
                  <RotateCcw className="size-4" aria-hidden="true" /> Empezar de nuevo
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
              {state.items.length} {state.items.length === 1 ? 'experiencia' : 'experiencias'} en Mi viaje
            </span>
            <span className="inline-flex items-center gap-1 text-sm font-bold">
              Ver <ArrowRight className="size-4" aria-hidden="true" />
            </span>
          </Link>
        </div>
      )}
    </div>
  )
}

function NextButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-12 items-center justify-center gap-2 self-end rounded-full bg-primary px-6 text-base font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-40"
    >
      Continuar
      <ArrowRight className="size-4" aria-hidden="true" />
    </button>
  )
}
