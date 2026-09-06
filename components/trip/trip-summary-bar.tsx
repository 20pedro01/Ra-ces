'use client'

import Link from 'next/link'
import { ArrowRight, Bus, Map, Package, Truck, X } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { EXPERIENCE_MAP, PACKAGES, TRANSPORT_PRICE_PER_PERSON } from '@/lib/data'
import { formatMXN } from '@/lib/format'
import { useTrip } from '@/lib/trip-store'
import { useLanguage } from '@/lib/i18n/context'
import { getLocalizedExperience, getLocalizedPackage } from '@/lib/i18n/data-translations'
import { cn } from '@/lib/utils'

export function TripSummaryBar({ showContinue = true }: { showContinue?: boolean }) {
  const { state, totals, dispatch } = useTrip()
  const { t, language } = useLanguage()
  const pkg = PACKAGES.find((p) => p.id === state.packageId)
  const locPkg = pkg ? getLocalizedPackage(pkg, language) : null
  const empty = state.items.length === 0 && !pkg

  return (
    <div className="hidden flex-col gap-4 rounded-3xl border border-border/70 bg-card p-5 shadow-sm lg:flex">
      <div className="flex items-center gap-2">
        <Map className="size-5 text-earth" aria-hidden="true" />
        <h2 className="text-xl font-semibold">{t('trip.itinerary.title')}</h2>
      </div>

      {empty && (
        <p className="text-sm text-muted-foreground">{t('trip.summary.empty')}</p>
      )}

      {pkg && locPkg && (
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-earth/10 p-3">
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-earth">
              {language === 'en' ? 'Selected package' : 'Paquete seleccionado'}
            </span>
            <span className="font-semibold text-foreground">{locPkg.name}</span>
            <span className="text-xs text-muted-foreground">{formatMXN(pkg.price * state.people, language)}</span>
          </div>
          <button
            type="button"
            aria-label={t('trip.itinerary.removePackage')}
            onClick={() => dispatch({ type: 'clearPackage' })}
            className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-earth/20 hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {state.items.length > 0 && (
        <ul className="flex flex-col divide-y divide-border/60">
          {state.items.map((item) => {
            const exp = EXPERIENCE_MAP[item.experienceId]
            if (!exp) return null
            const locExp = getLocalizedExperience(exp, language)
            return (
              <li key={item.experienceId} className="flex flex-col gap-1 py-2 text-sm first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="font-semibold leading-snug">{locExp.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {t('trip.itinerary.day')} {item.day} · {formatMXN(exp.price * state.people, language)}
                    </span>
                  </div>
                  <button
                    type="button"
                    aria-label={`${t('trip.summary.remove')} ${locExp.name}`}
                    onClick={() => dispatch({ type: 'removeExperience', experienceId: exp.id })}
                    className="flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
                {exp.isWorkshop && (
                  <div className="mt-1 flex items-center justify-between text-xs rounded-lg bg-sand/60 px-2 py-1">
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      {item.pickup === 'envio' ? (
                        <>
                          <Truck className="size-3 text-leaf" />
                          <span className="font-medium text-foreground">{language === 'en' ? 'Shipping included' : 'Con envío'}</span>
                        </>
                      ) : (
                        <>
                          <Package className="size-3 text-primary" />
                          <span>{language === 'en' ? 'Pick up in workshop' : 'Recoger en taller'}</span>
                        </>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        dispatch({
                          type: 'setPickup',
                          experienceId: exp.id,
                          pickup: item.pickup === 'envio' ? 'recoger' : 'envio',
                        })
                      }
                      className="text-primary hover:underline font-bold"
                    >
                      {item.pickup === 'envio'
                        ? (language === 'en' ? 'Change to pickup' : 'Cambiar a recoger')
                        : (language === 'en' ? 'Add shipping' : 'Pedir con envío')}
                    </button>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}

      {state.needsTransport && state.items.length > 0 && (
        <label className="flex items-center justify-between gap-3 rounded-2xl bg-accent px-3 py-2.5 text-accent-foreground">
          <span className="flex items-center gap-2 text-sm font-bold">
            <Bus className="size-4" aria-hidden="true" />
            {t('trip.itinerary.transportRaices')}
            <span className="font-normal">· {formatMXN(TRANSPORT_PRICE_PER_PERSON, language)} / {language === 'en' ? 'guest' : 'persona'} / {language === 'en' ? 'day' : 'día'}</span>
          </span>
          <Switch
            checked={state.transportEnabled}
            onCheckedChange={(v) => dispatch({ type: 'setTransportEnabled', enabled: v })}
          />
        </label>
      )}

      <dl className="flex flex-col gap-1.5 border-t border-border pt-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">{t('trip.priceExperiences')}</dt>
          <dd>{formatMXN(totals.experiences + totals.packagePrice, language)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">{t('trip.priceTransport')}</dt>
          <dd>{formatMXN(totals.transport, language)}</dd>
        </div>
        <div className="flex justify-between pt-1 text-base font-bold">
          <dt>{t('trip.priceTotal')}</dt>
          <dd>{formatMXN(totals.total, language)}</dd>
        </div>
        <p className="text-xs text-muted-foreground">
          {t('trip.summary.forPeople')
            .replace('{count}', String(state.people))
            .replace('{people}', state.people === 1 ? (language === 'en' ? 'guest' : 'persona') : (language === 'en' ? 'guests' : 'personas'))}
        </p>
      </dl>

      {showContinue && (
        <Link
          href="/mi-viaje"
          className={cn(
            "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-earth text-base font-bold text-earth-foreground transition-all hover:bg-earth/90",
            empty && "opacity-80"
          )}
        >
          {t('trip.summary.viewTrip')}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}
