'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Bus, Clock, Compass, MapPin, Package, Pencil, Plus, Truck, X, Backpack } from 'lucide-react'
import { GuideBubble } from '@/components/chat/chat-bubble'
import { CategoryBadge } from '@/components/category-badge'
import { Switch } from '@/components/ui/switch'
import { EXPERIENCE_MAP, PACKAGES, TRANSPORT_PRICE_PER_PERSON } from '@/lib/data'
import { addDays, formatDateShort, formatDuration, formatHour, formatMXN } from '@/lib/format'
import { useTrip } from '@/lib/trip-store'
import { useLanguage } from '@/lib/i18n/context'
import { getLocalizedExperience, getLocalizedPackage } from '@/lib/i18n/data-translations'

export function Itinerary() {
  const { state, totals, dispatch } = useTrip()
  const { t, language } = useLanguage()
  const pkg = PACKAGES.find((p) => p.id === state.packageId)
  const locPkg = pkg ? getLocalizedPackage(pkg, language) : null
  const empty = state.items.length === 0 && !pkg

  const days = Array.from(new Set(state.items.map((i) => i.day))).sort((a, b) => a - b)

  if (empty) {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-6 py-6">
        <h1 className="text-3xl font-semibold md:text-4xl">{t('trip.itinerary.title')}</h1>
        <GuideBubble>
          <p>{t('trip.itinerary.emptyBubble')}</p>
        </GuideBubble>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/explorar"
            className="flex h-14 items-center justify-center gap-2 rounded-full bg-primary text-base font-bold text-primary-foreground"
          >
            <Compass className="size-5" aria-hidden="true" /> {t('trip.itinerary.buildExperience')}
          </Link>
          <Link
            href="/paquetes"
            className="flex h-14 items-center justify-center gap-2 rounded-full bg-earth text-base font-bold text-earth-foreground"
          >
            <Backpack className="size-5" aria-hidden="true" /> {t('trip.itinerary.viewPackages')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <section className="flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold md:text-4xl">{t('trip.itinerary.title')}</h1>
          <p className="text-muted-foreground">
            {state.startDate
              ? `${language === 'en' ? 'From ' : 'Del '}${formatDateShort(state.startDate, language)} · ${state.people} ${state.people === 1 ? (language === 'en' ? 'guest' : 'persona') : (language === 'en' ? 'guests' : 'personas')}`
              : `${state.people} ${state.people === 1 ? (language === 'en' ? 'guest' : 'persona') : (language === 'en' ? 'guests' : 'personas')} · ${t('trip.itinerary.dateToConfirm')}`}
          </p>
        </header>

        {pkg && locPkg && (
          <article className="flex gap-4 overflow-hidden rounded-3xl border border-border/70 bg-card p-3 shadow-sm">
            <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl sm:size-32">
              <Image src={pkg.image} alt={locPkg.name} fill sizes="128px" className="object-cover" />
            </div>
            <div className="flex flex-1 flex-col gap-1 py-1">
              <span className="w-fit rounded-full bg-earth/15 px-2.5 py-0.5 text-xs font-bold text-earth">
                {language === 'en' ? 'Package' : 'Paquete'}
              </span>
              <h2 className="text-lg font-semibold leading-snug">{locPkg.name}</h2>
              <p className="text-sm text-muted-foreground">
                {locPkg.durationLabel} · {locPkg.location}
              </p>
              <p className="mt-auto font-bold">{formatMXN(pkg.price * state.people, language)}</p>
            </div>
            <div className="flex flex-col items-end justify-between">
              <button
                type="button"
                aria-label={t('trip.itinerary.removePackage')}
                onClick={() => dispatch({ type: 'clearPackage' })}
                className="flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
              <Link href={`/paquetes/${pkg.slug}`} className="text-sm font-bold text-primary hover:underline">
                {t('trip.itinerary.edit')}
              </Link>
            </div>
          </article>
        )}

        {days.map((day) => (
          <section key={day} aria-labelledby={`dia-${day}`} className="flex flex-col gap-3">
            <h2 id={`dia-${day}`} className="flex items-center gap-3 text-xl font-semibold">
              <span className="rounded-full bg-foreground px-3 py-1 text-sm font-bold text-background">
                {t('trip.itinerary.day')} {day}
              </span>
              {state.startDate && (
                <span className="text-base font-normal text-muted-foreground">
                  {formatDateShort(addDays(state.startDate, day - 1), language)}
                </span>
              )}
            </h2>
            <ol className="flex flex-col gap-3 border-l-2 border-border pl-4 md:pl-6">
              {state.items
                .filter((i) => i.day === day)
                .map((item) => {
                  const exp = EXPERIENCE_MAP[item.experienceId]
                  if (!exp) return null
                  const locExp = getLocalizedExperience(exp, language)
                  return (
                    <li key={item.experienceId} className="relative">
                      <span
                        className="absolute -left-[calc(1rem+5px)] top-5 size-2.5 rounded-full bg-primary md:-left-[calc(1.5rem+5px)]"
                        aria-hidden="true"
                      />
                      <article className="flex gap-3 rounded-3xl border border-border/70 bg-card p-3 shadow-sm sm:gap-4">
                        <div className="relative hidden size-28 shrink-0 overflow-hidden rounded-2xl sm:block">
                          <Image src={exp.image} alt={locExp.name} fill sizes="112px" className="object-cover" />
                        </div>
                        <div className="flex flex-1 flex-col gap-1.5">
                          <div className="flex items-center gap-2 text-sm font-bold text-primary">
                            <Clock className="size-4" aria-hidden="true" />
                            {formatHour(item.startHour)} · {formatDuration(exp.durationHours, language)}
                          </div>
                          <h3 className="text-lg font-semibold leading-snug">
                            <Link href={`/experiencias/${exp.slug}`} className="hover:underline">
                              {locExp.name}
                            </Link>
                          </h3>
                          <div className="flex flex-wrap items-center gap-2">
                            <CategoryBadge category={exp.category} />
                            <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="size-3.5" aria-hidden="true" /> {locExp.location}
                            </span>
                          </div>
                          {item.pickup && (
                            <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-earth/10 px-2.5 py-1 text-xs font-bold text-earth">
                              {item.pickup === 'envio' ? (
                                <Truck className="size-3.5" aria-hidden="true" />
                              ) : (
                                <Package className="size-3.5" aria-hidden="true" />
                              )}
                              {item.pickup === 'envio'
                                ? t('trip.itinerary.shippingRequested')
                                : t('trip.itinerary.pickupLater')}
                            </p>
                          )}
                          <p className="mt-auto pt-1 font-bold">
                            {formatMXN(exp.price * state.people, language)}
                            <span className="text-sm font-normal text-muted-foreground">
                              {' '}
                              · {formatMXN(exp.price, language)} × {state.people}
                            </span>
                          </p>
                        </div>
                        <button
                          type="button"
                          aria-label={t('trip.itinerary.removeExperience').replace('{name}', locExp.name)}
                          onClick={() => dispatch({ type: 'removeExperience', experienceId: exp.id })}
                          className="flex size-9 shrink-0 items-center justify-center self-start rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <X className="size-4" />
                        </button>
                      </article>
                    </li>
                  )
                })}
            </ol>
          </section>
        ))}

        <div className="flex flex-wrap gap-2">
          <Link
            href="/explorar"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-bold hover:bg-muted"
          >
            <Plus className="size-4" aria-hidden="true" /> {t('trip.itinerary.addExperience')}
          </Link>
          <Link
            href="/explorar"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-bold hover:bg-muted"
          >
            <Pencil className="size-4" aria-hidden="true" /> {t('trip.itinerary.editPreferences')}
          </Link>
        </div>
      </section>

      <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
        <div className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-card p-5 shadow-md">
          <h2 className="text-xl font-semibold">{t('trip.itinerary.summary')}</h2>

          {(state.items.length > 0 || pkg) && (
            <div className="flex flex-col gap-2">
              {state.items.length > 0 && (
                <label className="flex items-center justify-between gap-3 rounded-2xl bg-accent px-4 py-3 text-accent-foreground">
                  <span className="flex flex-col">
                    <span className="flex items-center gap-2 text-sm font-bold">
                      <Bus className="size-4" aria-hidden="true" /> {t('trip.itinerary.transportRaices')}
                    </span>
                    <span className="text-xs">
                      {formatMXN(TRANSPORT_PRICE_PER_PERSON, language)} / {language === 'en' ? 'guest' : 'persona'} / {language === 'en' ? 'day' : 'día'}
                      {state.needsTransport === false && ` · ${t('trip.itinerary.hasOwnTransport')}`}
                    </span>
                  </span>
                  <Switch
                    checked={state.transportEnabled}
                    onCheckedChange={(v) => dispatch({ type: 'setTransportEnabled', enabled: v })}
                  />
                </label>
              )}
              {pkg && (
                <label className="flex items-center justify-between gap-3 rounded-2xl bg-accent px-4 py-3 text-accent-foreground">
                  <span className="flex flex-col">
                    <span className="flex items-center gap-2 text-sm font-bold">
                      <Bus className="size-4" aria-hidden="true" /> {t('trip.itinerary.transportPackage')}
                    </span>
                    <span className="text-xs">{formatMXN(pkg.transportPrice, language)} / {language === 'en' ? 'guest' : 'persona'}</span>
                  </span>
                  <Switch
                    checked={state.packageTransport}
                    onCheckedChange={(v) => dispatch({ type: 'setPackageTransport', transport: v })}
                  />
                </label>
              )}
            </div>
          )}

          <dl className="flex flex-col gap-2 border-t border-border pt-4">
            <div className="flex justify-between text-sm">
              <dt className="text-muted-foreground">{t('trip.priceExperiences')}</dt>
              <dd className="font-semibold">{formatMXN(totals.experiences + totals.packagePrice, language)}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-muted-foreground">{t('trip.priceTransport')}</dt>
              <dd className="font-semibold">{formatMXN(totals.transport, language)}</dd>
            </div>
            <div className="flex justify-between pt-1 text-xl font-bold">
              <dt>{t('trip.priceTotal')}</dt>
              <dd>{formatMXN(totals.total, language)}</dd>
            </div>
          </dl>

          <Link
            href="/mi-viaje/reservar"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-earth text-base font-bold text-earth-foreground transition-all hover:bg-earth/90 active:scale-[0.99]"
          >
            {t('trip.itinerary.continue')} <ArrowRight className="size-5" aria-hidden="true" />
          </Link>
        </div>
      </aside>
    </div>
  )
}
