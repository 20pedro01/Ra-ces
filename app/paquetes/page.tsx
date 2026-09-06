import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Bus, Clock, MapPin } from 'lucide-react'
import { GuideBubble } from '@/components/chat/chat-bubble'
import { PACKAGES } from '@/lib/data'
import { formatMXN } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Paquetes · Raíces',
  description: 'Rutas prediseñadas con comunidades de Yucatán. Ruta de las Abejas Meliponas y más.',
}

export default function PaquetesPage() {
  const featured = PACKAGES.find((p) => p.featured) ?? PACKAGES[0]
  const rest = PACKAGES.filter((p) => p.id !== featured.id)

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-6 md:px-6 md:py-10">
      <header className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold leading-tight md:text-4xl">Paquetes</h1>
        <GuideBubble>
          <p>
            Estas rutas las diseñamos junto con las comunidades. Todo está incluido; solo eliges fecha
            y si necesitas transporte.
          </p>
        </GuideBubble>
      </header>

      <Link
        href={`/paquetes/${featured.slug}`}
        className="group relative block overflow-hidden rounded-[2rem] shadow-md"
      >
        <div className="relative aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]">
          <Image
            src={featured.image}
            alt={featured.name}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" aria-hidden="true" />
        </div>
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 text-primary-foreground md:p-8">
          <span className="w-fit rounded-full bg-leaf px-3 py-1 text-xs font-bold uppercase tracking-wider text-leaf-foreground">
            Paquete destacado
          </span>
          <h2 className="text-3xl font-semibold leading-tight text-balance md:text-5xl">{featured.name}</h2>
          <p className="max-w-2xl text-base leading-relaxed text-primary-foreground/90 text-pretty md:text-lg">
            {featured.tagline}. {featured.description.split('. ')[0]}.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4" aria-hidden="true" /> {featured.durationLabel}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" aria-hidden="true" /> {featured.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Bus className="size-4" aria-hidden="true" /> Transporte opcional +{formatMXN(featured.transportPrice)}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
            <p className="text-2xl font-bold">
              {formatMXN(featured.price)} <span className="text-sm font-semibold">/ persona</span>
            </p>
            <span className="inline-flex h-12 items-center gap-2 rounded-full bg-background px-5 text-base font-bold text-foreground">
              Ver paquete <ArrowRight className="size-4" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>

      <section aria-labelledby="otros" className="flex flex-col gap-5">
        <h2 id="otros" className="text-2xl font-semibold">
          Más rutas con comunidades
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {rest.map((pkg) => (
            <article
              key={pkg.id}
              className="flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm transition-shadow hover:shadow-md"
            >
              <Link href={`/paquetes/${pkg.slug}`} className="relative block aspect-[4/3]">
                <Image
                  src={pkg.image}
                  alt={pkg.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-semibold leading-snug">
                    <Link href={`/paquetes/${pkg.slug}`} className="hover:underline">
                      {pkg.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground">{pkg.tagline}</p>
                </div>
                <ul className="flex flex-col gap-1 text-sm text-foreground/85">
                  {pkg.activities.slice(0, 3).map((a) => (
                    <li key={a} className="flex gap-2">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-leaf" aria-hidden="true" />
                      {a}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3.5" aria-hidden="true" /> {pkg.durationLabel}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Bus className="size-3.5" aria-hidden="true" /> Transporte opcional
                  </span>
                </div>
                <div className="mt-auto flex items-center justify-between gap-3 pt-1">
                  <p>
                    <span className="text-lg font-bold">{formatMXN(pkg.price)}</span>
                    <span className="text-sm text-muted-foreground"> / persona</span>
                  </p>
                  <Link
                    href={`/paquetes/${pkg.slug}`}
                    className="inline-flex h-11 items-center gap-1.5 rounded-full bg-earth px-4 text-sm font-bold text-earth-foreground hover:bg-earth/90"
                  >
                    Ver paquete <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
