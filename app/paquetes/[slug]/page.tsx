import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PACKAGES, getPackageBySlug } from '@/lib/data'
import { PackageDetailContent } from '@/components/packages/package-detail-content'

export function generateStaticParams() {
  return PACKAGES.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const pkg = getPackageBySlug(slug)
  return { title: pkg ? `${pkg.name} · Raíces` : 'Paquete · Raíces' }
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const pkg = getPackageBySlug(slug)
  if (!pkg) notFound()

  return <PackageDetailContent pkg={pkg} />
}
