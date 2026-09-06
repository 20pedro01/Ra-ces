'use client'

import { useState } from 'react'
import { Bell, Check, Loader2, Mail, MessageCircle } from 'lucide-react'
import { formatDate } from '@/lib/format'

interface AvailabilityNotifierProps {
  targetDate?: string | null
  experienceOrPackage?: string
  className?: string
}

export function AvailabilityNotifier({
  targetDate,
  experienceOrPackage,
  className = '',
}: AvailabilityNotifierProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const dateLabel = targetDate ? formatDate(targetDate) : 'estas fechas'

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
          targetDate,
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

  const whatsappMessage = encodeURIComponent(
    `Hola Viva Raíces, me gustaría saber cuándo habrá disponibilidad de talleres para: ${dateLabel}${
      experienceOrPackage ? ` (${experienceOrPackage})` : ''
    }.`
  )
  const whatsappUrl = `https://wa.me/529990000000?text=${whatsappMessage}`

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
            ¿Planeas tu viaje con anticipación?
          </h4>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Los maestros artesanos abren su agenda hasta con 6 meses de anticipación.
            Déjanos tu correo y te notificaremos en cuanto abramos cupos para{' '}
            <strong className="text-foreground">{dateLabel}</strong>.
          </p>

          {!sent ? (
            <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2">
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
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
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-70"
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
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-leaf/15 p-2.5 text-xs font-semibold text-leaf">
              <Check className="size-4 shrink-0" />
              <span>
                ¡Listo! Te avisaremos al correo <strong>{email}</strong> en cuanto se abra la disponibilidad.
              </span>
            </div>
          )}

          <div className="mt-3 border-t border-border/50 pt-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
            >
              <MessageCircle className="size-3.5" />
              ¿Prefieres atención personalizada? Escríbenos por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
