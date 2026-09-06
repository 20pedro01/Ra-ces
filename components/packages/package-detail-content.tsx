'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Backpack, Check, Clock, MapPin } from 'lucide-react'
import { PackageBooking } from '@/components/packages/package-booking'
import type { TourPackage } from '@/lib/data'
import { useLanguage } from '@/lib/i18n/context'
import { getLocalizedPackage } from '@/lib/i18n/data-translations'

export function PackageDetailContent({ pkg }: { pkg: TourPackage }) {
  const { language } = useLanguage()
  const locPkg = getLocalizedPackage(pkg, language)

  return (
    <main>
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/7]">
        <Image src={pkg.image} alt={locPkg.name} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-foreground/30" aria-hidden="true" />
        <Link
          href="/paquetes"
          className="absolute left-4 top-4 inline-flex h-11 items-center gap-2 rounded-full bg-background/90 px-4 text-sm font-bold shadow-sm backdrop-blur md:left-6"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {language === 'en' ? 'Packages' : 'Paquetes'}
        </Link>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-12 md:px-6 lg:grid-cols-[1fr_360px]">
        <article className="-mt-16 flex flex-col gap-8 rounded-[2rem] bg-background p-1 md:-mt-20">
          <header className="flex flex-col gap-3">
            <p className="text-sm font-bold uppercase tracking-wider text-leaf">{pkg.tagline}</p>
            <h1 className="text-4xl font-semibold leading-tight text-balance md:text-5xl">{locPkg.name}</h1>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4" aria-hidden="true" /> {locPkg.durationLabel}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4" aria-hidden="true" /> {locPkg.location}
              </span>
            </div>
            <p className="text-lg leading-relaxed text-foreground/85 text-pretty">{locPkg.description}</p>
          </header>

          <section aria-labelledby="actividades" className="flex flex-col gap-4">
            <h2 id="actividades" className="text-2xl font-semibold">
              {language === 'en' ? 'Included Activities' : 'Actividades incluidas'}
            </h2>
            <ol className="flex flex-col gap-3">
              {pkg.activities.map((activity, i) => (
                <li key={activity} className="flex items-start gap-3 rounded-2xl bg-card p-4 shadow-sm">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
                    {i + 1}
                  </span>
                  <span className="pt-1 leading-relaxed">{activity}</span>
                </li>
              ))}
            </ol>
          </section>

          <div className="grid gap-6 sm:grid-cols-2">
            <section aria-labelledby="incluye" className="flex flex-col gap-3 rounded-3xl bg-sand p-5">
              <h2 id="incluye" className="flex items-center gap-2 text-xl font-semibold">
                <Check className="size-5 text-leaf" aria-hidden="true" />
                {language === 'en' ? "What's included" : 'Qué incluye'}
              </h2>
              <ul className="flex flex-col gap-2 text-[15px]">
                {locPkg.includes.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-leaf" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
            <section aria-labelledby="llevar" className="flex flex-col gap-3 rounded-3xl bg-sand p-5">
              <h2 id="llevar" className="flex items-center gap-2 text-xl font-semibold">
                <Backpack className="size-5 text-earth" aria-hidden="true" />
                {language === 'en' ? 'What to bring' : 'Qué llevar'}
              </h2>
              <ul className="flex flex-col gap-2 text-[15px]">
                {pkg.bring.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-earth" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </article>

        <aside className="lg:sticky lg:top-24 lg:mt-8 lg:self-start">
          <PackageBooking pkg={pkg} />
        </aside>
      </div>
    </main>
  )
}
