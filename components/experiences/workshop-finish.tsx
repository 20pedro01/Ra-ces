'use client'

import { Package, Truck } from 'lucide-react'
import { OptionButton } from '@/components/chat/option-button'
import { useTrip } from '@/lib/trip-store'

export function WorkshopFinish({ experienceId }: { experienceId: string }) {
  const { state, dispatch, hasItem } = useTrip()
  const item = state.items.find((i) => i.experienceId === experienceId)
  const added = hasItem(experienceId)

  return (
    <section
      aria-labelledby="terminar"
      className="flex flex-col gap-4 rounded-3xl border-2 border-dashed border-earth/40 bg-earth/5 p-5"
    >
      <div className="flex flex-col gap-1">
        <h2 id="terminar" className="text-2xl font-semibold">
          ¿No terminaste tu pieza?
        </h2>
        <p className="leading-relaxed text-foreground/85">
          No te preocupes. El artesano puede terminarla por ti.
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
          title="Recoger posteriormente"
          description="En el taller o en un punto de Mérida, 3 días después"
        />
        <OptionButton
          icon={Truck}
          selected={item?.pickup === 'envio'}
          onClick={() => {
            if (!added) dispatch({ type: 'addExperience', experienceId })
            dispatch({ type: 'setPickup', experienceId, pickup: 'envio' })
          }}
          title="Solicitar envío"
          description="A tu hotel o a tu casa. Costo simulado según destino"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Al elegir una opción, la experiencia se agrega a tu viaje. Servicio simulado en este MVP.
      </p>
    </section>
  )
}
