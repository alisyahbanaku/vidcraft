import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VidCraft - Turn Photos into Videos with AI',
  description: 'Upload a photo, get an AI-generated video in seconds. No editing skills needed.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <nav className="fixed top-0 z-50 w-full border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
            <a href="/" className="text-xl font-bold text-white">
              <span className="text-brand-500">Vid</span>Craft
            </a>
            <div className="flex items-center gap-4">
              <a href="/#showcase" className="hidden text-sm text-gray-400 hover:text-white sm:block">
                Examples
              </a>
              <a href="/#pricing" className="hidden text-sm text-gray-400 hover:text-white sm:block">
                Pricing
              </a>
              <a href="/create" className="btn-primary text-sm">
                Create Video
              </a>
            </div>
          </div>
        </nav>
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  )
}
