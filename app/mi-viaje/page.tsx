import type { Metadata } from 'next'
import { Itinerary } from '@/components/trip/itinerary'

export const metadata: Metadata = {
  title: 'Mi viaje · Raíces',
  description: 'Tu itinerario de experiencias en Yucatán.',
}

export default function MiViajePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-10">
      <Itinerary />
    </main>
  )
}
