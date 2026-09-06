'use client'

import { useState } from 'react'
import { Bell, Calendar, Check, Loader2, Mail, ShieldCheck } from 'lucide-react'
import { formatDate } from '@/lib/format'
import { getMaxFutureDateIso } from '@/lib/date-validation'

interface AvailabilityNotifierProps {
  targetDate?: string | null
  experienceOrPackage?: string
  className?: string
  allowCustomDate?: boolean
}

export function AvailabilityNotifier({
  targetDate,
  experienceOrPackage,
  className = '',
  allowCustomDate = false,
}: AvailabilityNotifierProps) {
  const [email, setEmail] = useState('')
  const [futureDate, setFutureDate] = useState(targetDate || getMaxFutureDateIso())
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const effectiveDate = targetDate || futureDate
  const dateFormatted = effectiveDate ? formatDate(effectiveDate) : 'la fecha seleccionada'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setError('Por favor ingresa un correo electrónico válido.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/lista-espera', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          targetDate: effectiveDate,
          experienceOrPackage,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'No se pudo registrar tu solicitud')
      }

      setSent(true)
    } catch (err: unknown) {
      console.error('Error al registrar en lista de espera:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error. Intenta nuevamente.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-earth/5 p-4 sm:p-5 text-left shadow-sm ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Bell className="size-5" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-foreground">
            Planear viaje a futuro
          </h4>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Los maestros artesanos abren su agenda hasta con 6 meses de anticipación.
            Selecciona tu fecha en el calendario y déjanos tu correo para notificarte en cuanto abramos el cupo.
          </p>

          {!sent ? (
            <form onSubmit={handleSubmit} className="mt-3.5 flex flex-col gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">
                    Fecha deseada en el futuro
                  </label>
                  <div className="relative">
                    <Calendar className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="date"
                      min={getMaxFutureDateIso()}
                      value={futureDate}
                      onChange={(e) => setFutureDate(e.target.value)}
                      className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-xs font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">
                    Correo electrónico de contacto
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      placeholder="tu@correo.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (error) setError(null)
                      }}
                      className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-xs font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <ShieldCheck className="size-3.5 text-leaf" />
                  Atención directa y confirmación enviada a tu correo.
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-primary px-5 text-xs font-bold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" /> Guardando…
                    </>
                  ) : (
                    'Avisarme por correo'
                  )}
                </button>
              </div>

              {error && (
                <p className="text-xs font-medium text-destructive">{error}</p>
              )}
            </form>
          ) : (
            <div className="mt-3 flex flex-col gap-1.5 rounded-xl bg-leaf/15 p-3 text-xs text-leaf">
              <div className="flex items-center gap-2 font-bold">
                <Check className="size-4 shrink-0" />
                <span>¡Solicitud registrada con éxito!</span>
              </div>
              <p className="text-[11px] leading-relaxed text-foreground/80">
                Hemos enviado un correo a <strong>{email}</strong>. Te avisaremos con prioridad en cuanto se abra la agenda para <strong>{dateFormatted}</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
