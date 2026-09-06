import type { Metadata } from 'next'
import { BookingFlow } from '@/components/trip/booking-flow'

export const metadata: Metadata = {
  title: 'Reservar · Raíces',
}

export default function ReservarPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-10">
      <BookingFlow />
    </main>
  )
}
