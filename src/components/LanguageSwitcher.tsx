'use client'

import { useLanguage } from './LanguageProvider'
import { Globe } from 'lucide-react'

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()

  return (
    <div className="flex items-center gap-1 rounded-lg border border-gray-700 bg-gray-900 p-0.5">
      <button
        onClick={() => setLang('en')}
        className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
          lang === 'en' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang('id')}
        className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
          lang === 'id' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'
        }`}
      >
        ID
      </button>
    </div>
  )
}
