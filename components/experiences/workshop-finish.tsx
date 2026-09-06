'use client'

import { Package, Truck } from 'lucide-react'
import { OptionButton } from '@/components/chat/option-button'
import { useTrip } from '@/lib/trip-store'
import { useLanguage } from '@/lib/i18n/context'

export function WorkshopFinish({ experienceId }: { experienceId: string }) {
  const { state, dispatch, hasItem } = useTrip()
  const { language } = useLanguage()
  const item = state.items.find((i) => i.experienceId === experienceId)
  const added = hasItem(experienceId)

  return (
    <section
      aria-labelledby="terminar"
      className="flex flex-col gap-4 rounded-3xl border-2 border-dashed border-earth/40 bg-earth/5 p-5"
    >
      <div className="flex flex-col gap-1">
        <h2 id="terminar" className="text-2xl font-semibold">
          {language === 'en' ? "Didn't finish your piece?" : '¿No terminaste tu pieza?'}
        </h2>
        <p className="leading-relaxed text-foreground/85">
          {language === 'en'
            ? 'No worries. The community workshop team can complete it for you and deliver it.'
            : 'No te preocupes. El equipo del taller comunitario puede terminarla por ti y entregártela.'}
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <OptionButton
          icon={Package}
          selected={item?.pickup === 'recoger'}
          onClick={() => {
            if (!added) dispatch({ type: 'addExperience', experienceId })
            dispatch({ type: 'setPickup', experienceId, pickup: 'recoger' })
          }}
          title={language === 'en' ? 'Pick up later' : 'Recoger posteriormente'}
          description={language === 'en'
            ? 'At the workshop or a Mérida pickup point, 3 days later'
            : 'En el taller o en un punto de Mérida, 3 días después'}
        />
        <OptionButton
          icon={Truck}
          selected={item?.pickup === 'envio'}
          onClick={() => {
            if (!added) dispatch({ type: 'addExperience', experienceId })
            dispatch({ type: 'setPickup', experienceId, pickup: 'envio' })
          }}
          title={language === 'en' ? 'Request shipping' : 'Solicitar envío'}
          description={language === 'en'
            ? 'To your hotel or home. Simulated cost by destination'
            : 'A tu hotel o a tu casa. Costo simulado según destino'}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {language === 'en'
          ? 'Choosing an option adds the experience to your trip. Simulated service in this MVP.'
          : 'Al elegir una opción, la experiencia se agrega a tu viaje. Servicio simulado en este MVP.'}
      </p>
    </section>
  )
}
