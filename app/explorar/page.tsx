import type { Metadata } from 'next'
import { ExperienceBuilder } from '@/components/chat/experience-builder'

export const metadata: Metadata = {
  title: 'Armar mi experiencia · Raíces',
  description: 'Conversa con tu guía Raíces y arma una experiencia auténtica en Yucatán.',
}

export default function ExplorarPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-10">
      <ExperienceBuilder />
    </main>
  )
}
