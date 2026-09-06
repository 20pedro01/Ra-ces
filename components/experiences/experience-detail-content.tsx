'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Check, Clock, Hand, MapPin, Users } from 'lucide-react'
import { CategoryBadge } from '@/components/category-badge'
import { ExperienceActions } from '@/components/experiences/experience-actions'
import { WorkshopFinish } from '@/components/experiences/workshop-finish'
import { ReviewsSection } from '@/components/reviews/reviews-section'
import type { Experience } from '@/lib/data'
import { formatDuration, formatMXN } from '@/lib/format'
import { useLanguage } from '@/lib/i18n/context'
import { getLocalizedExperience } from '@/lib/i18n/data-translations'

export function ExperienceDetailContent({ exp }: { exp: Experience }) {
  const { language, t } = useLanguage()
  const locExp = getLocalizedExperience(exp, language)

  const participation = exp.isWorkshop
    ? (language === 'en'
      ? 'You craft the piece with your own hands. The artisan guides every step.'
      : 'Tú elaboras la pieza con tus manos. El artesano guía cada paso.')
    : exp.category === 'gastronomia'
      ? (language === 'en'
        ? 'You cook. From choosing ingredients to plating the dish.'
        : 'Tú cocinas. Desde elegir ingredientes hasta servir el plato.')
      : exp.isNight
        ? (language === 'en'
          ? 'Community gathering, mystery, and connection around the fire.'
          : 'Convivencia, misterio y conexión con la comunidad alrededor del fuego.')
        : (language === 'en'
          ? 'Guided by community members at their own pace.'
          : 'Acompañado por guías de la propia comunidad, a su ritmo.')

  return (
    <main>
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/7]">
        <Image src={exp.image} alt={locExp.name} fill priority sizes="100vw" className="object-cover" />
        <div
          className={`absolute inset-0 bg-gradient-to-t from-background via-transparent ${exp.isNight ? 'to-foreground/50' : 'to-foreground/25'}`}
          aria-hidden="true"
        />
        <Link
          href="/explorar"
          className="absolute left-4 top-4 inline-flex h-11 items-center gap-2 rounded-full bg-background/90 px-4 text-sm font-bold shadow-sm backdrop-blur md:left-6"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {language === 'en' ? 'Back' : 'Volver'}
        </Link>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-12 md:px-6 lg:grid-cols-[1fr_360px]">
        <article className="-mt-16 flex flex-col gap-8 md:-mt-20">
          <header className="flex flex-col gap-3">
            <CategoryBadge category={exp.category} className="w-fit" />
            <h1 className="text-4xl font-semibold leading-tight text-balance md:text-5xl">{locExp.name}</h1>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4" aria-hidden="true" /> {locExp.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4" aria-hidden="true" /> {formatDuration(exp.durationHours, language)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-4" aria-hidden="true" /> {exp.provider}
              </span>
            </div>
            <p className="text-lg leading-relaxed text-foreground/85 text-pretty">{locExp.description}</p>
          </header>

          <p className="flex items-start gap-3 rounded-3xl bg-secondary p-5 text-secondary-foreground">
            <Hand className="mt-0.5 size-6 shrink-0" aria-hidden="true" />
            <span className="text-lg font-semibold leading-snug">{participation}</span>
          </p>

          <section aria-labelledby="incluye" className="flex flex-col gap-3">
            <h2 id="incluye" className="text-2xl font-semibold">
              {language === 'en' ? "What's included" : 'Qué incluye'}
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {locExp.includes.map((item) => (
                <li key={item} className="flex items-center gap-2 rounded-2xl bg-card px-4 py-3 shadow-sm">
                  <Check className="size-4 shrink-0 text-leaf" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {exp.isWorkshop && <WorkshopFinish experienceId={exp.id} />}

          <ReviewsSection
            targetId={exp.id}
            targetType="experience"
            targetTitle={locExp.name}
          />
        </article>

        <aside className="lg:sticky lg:top-24 lg:mt-8 lg:self-start">
          <div className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-card p-5 shadow-md">
            <p>
              <span className="font-serif text-3xl font-semibold">{formatMXN(exp.price, language)}</span>
              <span className="text-sm text-muted-foreground"> {t('card.perPerson')}</span>
            </p>
            <ExperienceActions experienceId={exp.id} />
          </div>
        </aside>
      </div>
    </main>
  )
}
