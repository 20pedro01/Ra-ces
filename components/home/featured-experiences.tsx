import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ExperienceCard } from '@/components/experience-card'
import { EXPERIENCE_MAP } from '@/lib/data'

const FEATURED = ['meliponas', 'hamacas', 'fogata']

export function FeaturedExperiences() {
  return (
    <section className="bg-sand/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 md:px-6 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-semibold leading-tight md:text-4xl">Experiencias para participar</h2>
            <p className="text-muted-foreground">Algunas de las más queridas por quienes ya vivieron Yucatán.</p>
          </div>
          <Link
            href="/explorar"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-bold hover:bg-muted"
          >
            Armar mi experiencia
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {FEATURED.map((id) => (
            <ExperienceCard key={id} experience={EXPERIENCE_MAP[id]} />
          ))}
        </div>
      </div>
    </section>
  )
}
