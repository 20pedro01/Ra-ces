import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { EXPERIENCES, getExperienceBySlug } from '@/lib/data'
import { ExperienceDetailContent } from '@/components/experiences/experience-detail-content'

export function generateStaticParams() {
  return EXPERIENCES.map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const exp = getExperienceBySlug(slug)
  return { title: exp ? `${exp.name} · Raíces` : 'Experiencia · Raíces' }
}

export default async function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const exp = getExperienceBySlug(slug)
  if (!exp) notFound()

  return <ExperienceDetailContent exp={exp} />
}

