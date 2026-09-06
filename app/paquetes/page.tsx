import type { Metadata } from 'next'
import { PaquetesPageContent } from '@/components/packages/paquetes-page-content'

export const metadata: Metadata = {
  title: 'Paquetes · Raíces',
  description: 'Rutas prediseñadas con comunidades de Yucatán. Ruta de las Abejas Meliponas y más.',
}

export default function PaquetesPage() {
  return <PaquetesPageContent />
}
