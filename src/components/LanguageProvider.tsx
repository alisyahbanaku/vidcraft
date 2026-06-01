'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations, type Lang, type TranslationKey } from '@/lib/i18n'

interface LanguageContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: TranslationKey) => any
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    // Load saved preference, or detect from browser
    const saved = localStorage.getItem('vidcraft_lang') as Lang | null
    if (saved === 'en' || saved === 'id') {
      setLangState(saved)
    } else if (typeof navigator !== 'undefined' && navigator.language.startsWith('id')) {
      setLangState('id')
    }
  }, [])

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem('vidcraft_lang', l)
  }

  function t(key: TranslationKey) {
    return translations[lang][key] ?? translations.en[key] ?? key
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
