'use client'

import Image from 'next/image'
import { useLanguage } from '@/lib/i18n/context'

export function Journey() {
  const { t } = useLanguage()

  const steps = [
    t('home.journey.step1'),
    t('home.journey.step2'),
    t('home.journey.step3'),
    t('home.journey.step4'),
    t('home.journey.step5'),
    t('home.journey.step6'),
  ]

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
        <div className="flex flex-col gap-5">
          <h2 className="text-3xl font-semibold leading-tight text-balance md:text-4xl">
            {t('home.journey.title')}
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground text-pretty">
            {t('home.journey.desc')}
          </p>
          <ol className="flex flex-wrap items-center gap-2" aria-label={t('home.journey.title')}>
            {steps.map((step, i) => (
              <li key={step} className="flex items-center gap-2">
                <span className="rounded-full bg-sand px-3 py-1.5 text-sm font-bold text-foreground">
                  {step}
                </span>
                {i < steps.length - 1 && (
                  <span className="text-muted-foreground" aria-hidden="true">
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="relative aspect-[3/4] overflow-hidden rounded-3xl">
            <Image
              src="/images/hamaca.png"
              alt="Artesana tejiendo una hamaca junto a una visitante"
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
          </div>
          <div className="relative mt-8 aspect-[3/4] overflow-hidden rounded-3xl">
            <Image
              src="/images/comunidad.png"
              alt="Familia y visitantes conversando en una comunidad maya"
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
