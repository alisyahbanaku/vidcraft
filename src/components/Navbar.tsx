'use client'

import { useLanguage } from './LanguageProvider'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navbar() {
  const { t } = useLanguage()

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <a href="/" className="text-xl font-bold text-white">
          <span className="text-brand-500">Vid</span>Craft
        </a>
        <div className="flex items-center gap-4">
          <a href="/#showcase" className="hidden text-sm text-gray-400 hover:text-white sm:block">
            {t('nav_examples')}
          </a>
          <a href="/#pricing" className="hidden text-sm text-gray-400 hover:text-white sm:block">
            {t('nav_pricing')}
          </a>
          <LanguageSwitcher />
          <a href="/create" className="btn-primary text-sm">
            {t('nav_create')}
          </a>
        </div>
      </div>
    </nav>
  )
}
