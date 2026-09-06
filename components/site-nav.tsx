'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, Backpack, Map, Leaf } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTrip } from '@/lib/trip-store'

import { useLanguage } from '@/lib/i18n/context'
import { LanguageSwitcher } from '@/components/language-switcher'

export function SiteNav() {
  const pathname = usePathname()
  const { totals } = useTrip()
  const { t } = useLanguage()

  const links = [
    { href: '/', label: t('nav.home'), icon: Home },
    { href: '/explorar', label: t('nav.explore'), icon: Compass },
    { href: '/paquetes', label: t('nav.packages'), icon: Backpack },
    { href: '/mi-viaje', label: t('nav.myTrip'), icon: Map },
  ]

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2" aria-label="Raíces">
            <span className="flex size-9 items-center justify-center rounded-full bg-leaf text-leaf-foreground">
              <Leaf className="size-5" aria-hidden="true" />
            </span>
            <span className="font-serif text-xl font-semibold tracking-tight">Raíces</span>
          </Link>

          <nav aria-label="Principal" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {links.map(({ href, label, icon: Icon }) => {
                const active = isActive(href)
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors',
                        active
                          ? 'bg-foreground text-background'
                          : 'text-foreground/80 hover:bg-muted hover:text-foreground',
                      )}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                      {label}
                      {href === '/mi-viaje' && totals.itemCount > 0 && (
                        <span
                          className={cn(
                            'ml-1 flex size-5 items-center justify-center rounded-full text-xs font-bold',
                            active ? 'bg-background text-foreground' : 'bg-leaf text-leaf-foreground',
                          )}
                        >
                          {totals.itemCount}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Link
              href="/mi-viaje"
              className="flex h-10 items-center gap-2 rounded-full bg-earth px-4 text-sm font-semibold text-earth-foreground md:hidden"
            >
              <Map className="size-4" aria-hidden="true" />
              {totals.itemCount > 0 && (
                <span className="flex size-5 items-center justify-center rounded-full bg-background text-xs font-bold text-foreground">
                  {totals.itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <nav
        aria-label="Principal móvil"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-card/95 backdrop-blur-md md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <ul className="grid grid-cols-4">
          {links.map(({ href, label, icon: Icon }) => {
            const active = isActive(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex h-16 flex-col items-center justify-center gap-1 text-xs font-semibold transition-colors',
                    active ? 'text-primary' : 'text-muted-foreground',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-7 w-12 items-center justify-center rounded-full transition-colors',
                      active && 'bg-accent',
                    )}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </>
  )
}
