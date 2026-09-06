'use client'

import { useState, useEffect } from 'react'
import {
  Star,
  MessageSquareQuote,
  ShieldCheck,
  Plus,
  X,
  CheckCircle2,
  MapPin,
  Calendar,
  Loader2,
  Sparkles,
} from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'
import { Review } from '@/lib/reviews'

interface ReviewsSectionProps {
  targetId: string
  targetType: 'experience' | 'package'
  targetTitle?: string
}

export function ReviewsSection({ targetId, targetType, targetTitle }: ReviewsSectionProps) {
  const { t, language } = useLanguage()
  const [reviews, setReviews] = useState<Review[]>([])
  const [averageRating, setAverageRating] = useState<number>(5.0)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)

  // Estado del modal de nueva reseña
  const [showModal, setShowModal] = useState<boolean>(false)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false)

  // Formulario
  const [rating, setRating] = useState<number>(5)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [authorName, setAuthorName] = useState<string>('')
  const [authorOrigin, setAuthorOrigin] = useState<string>('')
  const [comment, setComment] = useState<string>('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Cargar reseñas
  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/resenas?targetId=${encodeURIComponent(targetId)}`, {
        cache: 'no-store',
      })
      if (res.ok) {
        const data = await res.json()
        setReviews(data.reviews || [])
        setAverageRating(data.averageRating || 5.0)
        setTotalCount(data.totalCount || 0)
      }
    } catch (e) {
      console.error('Error al cargar reseñas:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [targetId])

  // Enviar reseña
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authorName.trim()) {
      setErrorMsg(language === 'en' ? 'Please enter your name.' : 'Por favor ingresa tu nombre.')
      return
    }
    if (!comment.trim() || comment.trim().length < 10) {
      setErrorMsg(
        language === 'en'
          ? 'Please share a brief comment (at least 10 characters).'
          : 'Por favor comparte un comentario breve (al menos 10 caracteres).'
      )
      return
    }

    setSubmitting(true)
    setErrorMsg(null)

    try {
      const res = await fetch('/api/resenas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetId,
          targetType,
          authorName,
          authorOrigin: authorOrigin || (language === 'en' ? 'Traveler' : 'Viajero'),
          rating,
          comment,
        }),
      })

      if (!res.ok) {
        throw new Error('Error al registrar reseña')
      }

      const data = await res.json()
      if (data.review) {
        // Actualizar lista local de inmediato
        setReviews((prev) => [data.review, ...prev])
        setTotalCount((prev) => prev + 1)
        setSubmittedSuccess(true)

        // Limpiar formulario tras 2 segundos
        setTimeout(() => {
          setSubmittedSuccess(false)
          setShowModal(false)
          setAuthorName('')
          setAuthorOrigin('')
          setComment('')
          setRating(5)
        }, 2200)
      }
    } catch (err) {
      console.error('Error al enviar reseña:', err)
      setErrorMsg(
        language === 'en'
          ? 'Could not submit your review. Please try again.'
          : 'No se pudo guardar la reseña. Intenta nuevamente.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const ratingDescriptions: Record<number, { es: string; en: string }> = {
    1: { es: 'Deficiente', en: 'Poor' },
    2: { es: 'Regular', en: 'Fair' },
    3: { es: 'Bueno', en: 'Good' },
    4: { es: 'Muy bueno', en: 'Very Good' },
    5: { es: '¡Excelente experiencia!', en: 'Excellent experience!' },
  }

  const activeStarCount = hoverRating || rating

  return (
    <section
      aria-labelledby="reviews-heading"
      className="flex flex-col gap-6 rounded-[2rem] border border-border/80 bg-card p-6 shadow-sm md:p-8"
    >
      {/* Encabezado de la Sección */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/70 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-leaf">
            <MessageSquareQuote className="size-4" aria-hidden="true" />
            <span>{t('reviews.title')}</span>
          </div>
          <h2 id="reviews-heading" className="mt-1 text-2xl font-bold leading-snug text-foreground md:text-3xl">
            {targetTitle ? `${targetTitle}` : t('reviews.title')}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            {t('reviews.subtitle')}
          </p>
        </div>

        {/* Botón Escribir Reseña */}
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95"
        >
          <Plus className="size-4" />
          <span>{t('reviews.writeButton')}</span>
        </button>
      </div>

      {/* Resumen de Calificación */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-sand/70 p-4 sm:p-5">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-leaf/20 text-2xl font-black text-leaf">
            {loading ? '--' : averageRating.toFixed(1)}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`size-4 ${
                    s <= Math.round(averageRating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-muted-foreground mt-1">
              {t('reviews.average')} · {t('reviews.basedOn')} {totalCount} {t('reviews.reviewsCount')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-leaf">
          <ShieldCheck className="size-4" />
          <span>{language === 'en' ? '100% Genuine community reviews' : '100% Opiniones reales de viajeros'}</span>
        </div>
      </div>

      {/* Lista de Reseñas */}
      {loading ? (
        <div className="flex items-center justify-center py-10 text-muted-foreground gap-2 text-sm">
          <Loader2 className="size-5 animate-spin" />
          <span>{language === 'en' ? 'Loading reviews…' : 'Cargando reseñas…'}</span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 p-8 text-center">
          <p className="text-sm text-muted-foreground">{t('reviews.empty')}</p>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
          >
            <Plus className="size-3.5" />
            <span>{t('reviews.writeButton')}</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {reviews.map((rev) => {
            const dateStr = new Date(rev.createdAt).toLocaleDateString(
              language === 'en' ? 'en-US' : 'es-MX',
              { month: 'short', year: 'numeric' }
            )
            const initials = rev.authorName
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()

            return (
              <article
                key={rev.id}
                className="flex flex-col justify-between gap-3 rounded-2xl border border-border/70 bg-background/80 p-5 shadow-xs transition-shadow hover:shadow-md"
              >
                <div>
                  {/* Encabezado de la reseña */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-9 items-center justify-center rounded-full bg-earth/15 font-bold text-earth text-xs">
                        {initials || 'V'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground leading-tight">
                          {rev.authorName}
                        </h4>
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                          <MapPin className="size-3 shrink-0" />
                          <span>{rev.authorOrigin}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`size-3.5 ${
                            s <= rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-muted-foreground/30'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Texto de la reseña */}
                  <p className="text-xs sm:text-sm leading-relaxed text-foreground/90 text-pretty">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                {/* Footer de la reseña */}
                <div className="flex items-center justify-between border-t border-border/50 pt-2.5 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1 font-semibold text-leaf">
                    <ShieldCheck className="size-3" />
                    {t('reviews.verified')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {dateStr}
                  </span>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* Modal para Dejar Reseña */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="relative flex w-full max-w-lg flex-col gap-5 rounded-[2rem] border border-border bg-card p-6 shadow-2xl md:p-8 max-h-[90vh] overflow-y-auto">
            {/* Botón Cerrar */}
            <button
              type="button"
              onClick={() => !submitting && setShowModal(false)}
              className="absolute right-5 top-5 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted"
              aria-label={t('reviews.close')}
            >
              <X className="size-5" />
            </button>

            {submittedSuccess ? (
              <div className="flex flex-col items-center justify-center gap-4 py-8 text-center animate-in zoom-in-95 duration-200">
                <div className="flex size-16 items-center justify-center rounded-full bg-leaf/20 text-leaf">
                  <CheckCircle2 className="size-10" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {language === 'en' ? 'Review Published!' : '¡Reseña Publicada!'}
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  {t('reviews.success')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-leaf">
                  <Sparkles className="size-4" />
                  <span>{t('reviews.formTitle')}</span>
                </div>

                <h3 className="text-xl font-bold text-foreground leading-snug">
                  {targetTitle ? `Reseña de ${targetTitle}` : t('reviews.formTitle')}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t('reviews.formDesc')}
                </p>

                {errorMsg && (
                  <div className="rounded-xl bg-destructive/15 border border-destructive/30 p-3 text-xs font-semibold text-destructive">
                    {errorMsg}
                  </div>
                )}

                {/* Calificación por Estrellas */}
                <div className="flex flex-col gap-1.5 rounded-2xl bg-sand/60 p-4">
                  <span className="text-xs font-bold text-foreground">
                    {t('reviews.ratingPrompt')}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRating(s)}
                          onMouseEnter={() => setHoverRating(s)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 transition-transform hover:scale-125 active:scale-95 focus:outline-none"
                        >
                          <Star
                            className={`size-7 ${
                              s <= activeStarCount
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-muted-foreground/30'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-earth ml-2">
                      {ratingDescriptions[activeStarCount]?.[language === 'en' ? 'en' : 'es']}
                    </span>
                  </div>
                </div>

                {/* Nombre */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="rev-name" className="text-xs font-bold text-foreground">
                    {t('reviews.nameLabel')} *
                  </label>
                  <input
                    id="rev-name"
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder={t('reviews.namePlaceholder')}
                    className="h-11 rounded-xl border border-input bg-background px-3.5 text-sm outline-none transition-colors focus:border-primary"
                  />
                </div>

                {/* Lugar de origen */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="rev-origin" className="text-xs font-bold text-foreground">
                    {t('reviews.originLabel')}
                  </label>
                  <input
                    id="rev-origin"
                    type="text"
                    value={authorOrigin}
                    onChange={(e) => setAuthorOrigin(e.target.value)}
                    placeholder={t('reviews.originPlaceholder')}
                    className="h-11 rounded-xl border border-input bg-background px-3.5 text-sm outline-none transition-colors focus:border-primary"
                  />
                </div>

                {/* Comentario */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="rev-comment" className="text-xs font-bold text-foreground">
                    {t('reviews.commentLabel')} *
                  </label>
                  <textarea
                    id="rev-comment"
                    rows={4}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={t('reviews.commentPlaceholder')}
                    className="rounded-xl border border-input bg-background p-3.5 text-sm outline-none transition-colors focus:border-primary resize-none"
                  />
                </div>

                {/* Botón Enviar */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 active:scale-98 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>{t('reviews.submitting')}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="size-4" />
                      <span>{t('reviews.submit')}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
