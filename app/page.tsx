'use client'

import Image from 'next/image'
import { HeroChat } from '@/components/home/hero-chat'
import { Journey } from '@/components/home/journey'
import { FeaturedExperiences } from '@/components/home/featured-experiences'
import { useLanguage } from '@/lib/i18n/context'

export default function HomePage() {
  const { t } = useLanguage()
  return (
    <main>
      <section className="relative isolate overflow-hidden">
        <Image
          src="/images/hero-cenote.png"
          alt="Cenote abierto en Yucatán con aguas turquesa y raíces colgantes"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/40 to-background"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 pb-10 pt-12 md:gap-10 md:px-6 md:pb-16 md:pt-20">
          <div className="flex flex-col items-center gap-3 text-center text-primary-foreground">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground/85">
              {t('home.tagline')}
            </p>
            <h1 className="text-5xl font-semibold leading-none tracking-tight text-balance md:text-7xl">
              {t('home.title')}
            </h1>
            <p className="max-w-xl text-xl leading-snug text-pretty md:text-2xl">
              {t('home.subtitle')}
            </p>
          </div>

          <HeroChat />
        </div>
      </section>

      <Journey />
      <FeaturedExperiences />

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
          <p className="font-serif text-base text-foreground">
            {t('home.footer.summary')}
          </p>
          <p>{t('home.footer.prototype')}</p>
        </div>
      </footer>
    </main>
  )
}
