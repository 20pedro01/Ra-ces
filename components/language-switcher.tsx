'use client'

import { Globe } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'

interface LanguageSwitcherProps {
  className?: string
  variant?: 'default' | 'compact'
}

export function LanguageSwitcher({ className = '', variant = 'default' }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLanguage()

  const toggle = () => {
    setLocale(locale === 'es' ? 'en' : 'es')
  }

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-label={locale === 'es' ? 'Switch to English' : 'Cambiar a Español'}
        className={`flex h-9 items-center gap-1.5 rounded-full border border-border/70 bg-card px-2.5 text-xs font-bold text-foreground transition-all hover:bg-muted ${className}`}
      >
        <Globe className="size-3.5 text-primary" aria-hidden="true" />
        <span className="uppercase">{locale}</span>
      </button>
    )
  }

  return (
    <div
      role="group"
      aria-label="Selector de idioma / Language Switcher"
      className={`inline-flex h-9 items-center rounded-full border border-border/80 bg-card/80 p-0.5 text-xs font-bold shadow-xs backdrop-blur-sm ${className}`}
    >
      <button
        type="button"
        onClick={() => setLocale('es')}
        aria-pressed={locale === 'es'}
        className={`flex h-8 items-center gap-1 rounded-full px-2.5 transition-all ${
          locale === 'es'
            ? 'bg-primary text-primary-foreground shadow-xs'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <Globe className="size-3.5" aria-hidden="true" />
        <span>ES</span>
      </button>

      <button
        type="button"
        onClick={() => setLocale('en')}
        aria-pressed={locale === 'en'}
        className={`flex h-8 items-center gap-1 rounded-full px-2.5 transition-all ${
          locale === 'en'
            ? 'bg-primary text-primary-foreground shadow-xs'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <span>EN</span>
      </button>
    </div>
  )
}
