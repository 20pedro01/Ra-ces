'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { TRANSLATIONS, type Locale, type TranslationKey } from './translations'

interface LanguageContextType {
  locale: Locale
  language: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = 'viva_raices_locale'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('es')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // 1. Verificar si el usuario ya tiene preferencia guardada
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (saved === 'es' || saved === 'en') {
      setLocaleState(saved)
      document.documentElement.lang = saved === 'es' ? 'es-MX' : 'en-US'
      return
    }

    // 2. Detección automática por conexión / navegador del turista internacional
    if (typeof navigator !== 'undefined') {
      const browserLang = (navigator.languages && navigator.languages[0]) || navigator.language || ''
      const isEnglish = browserLang.toLowerCase().startsWith('en')
      const initialLocale: Locale = isEnglish ? 'en' : 'es'
      setLocaleState(initialLocale)
      document.documentElement.lang = initialLocale === 'es' ? 'es-MX' : 'en-US'
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newLocale)
      document.documentElement.lang = newLocale === 'es' ? 'es-MX' : 'en-US'
    }
  }

  const t = (key: TranslationKey): string => {
    const dict = TRANSLATIONS[locale] || TRANSLATIONS.es
    return dict[key] ?? TRANSLATIONS.es[key] ?? key
  }

  return (
    <LanguageContext.Provider value={{ locale, language: locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    // Fallback seguro si se usa fuera del provider durante renderizado inicial
    return {
      locale: 'es' as Locale,
      language: 'es' as Locale,
      setLocale: () => {},
      t: (key: TranslationKey) => TRANSLATIONS.es[key] ?? key,
    }
  }
  return context
}
