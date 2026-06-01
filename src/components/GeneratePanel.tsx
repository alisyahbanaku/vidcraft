'use client'

import { useState, useEffect } from 'react'
import { Loader2, ChevronLeft, Film, CheckCircle2 } from 'lucide-react'
import { useLanguage } from './LanguageProvider'

interface Props {
  photoUrl: string
  storyboard: any
  onComplete: (videoUrl: string) => void
  onBack: () => void
}

export default function GeneratePanel({ photoUrl, storyboard, onComplete, onBack }: Props) {
  const { t, lang } = useLanguage()
  const STAGES = lang === 'id' ? [
    'Menyiapkan fotomu...',
    'Membuat frame gerakan...',
    'Merender adegan video...',
    'Menyentuh akhir...',
  ] : [
    'Preparing your photo...',
    'Generating motion frames...',
    'Rendering video scenes...',
    'Adding final touches...',
  ]
  const [generating, setGenerating] = useState(false)
  const [stage, setStage] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  async function startGenerate() {
    setGenerating(true)
    setError(null)
    setProgress(0)

    // Simulated stage progression while polling backend
    const stageTimer = setInterval(() => {
      setStage((s) => Math.min(s + 1, STAGES.length - 1))
      setProgress((p) => Math.min(p + 22, 92))
    }, 3000)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoUrl, storyboard }),
      })
      clearInterval(stageTimer)
      if (!res.ok) {
        const e = await res.json()
        throw new Error(e.error || 'Generation failed')
      }
      const data = await res.json()
      setProgress(100)
      setTimeout(() => onComplete(data.videoUrl), 600)
    } catch (err: any) {
      clearInterval(stageTimer)
      setError(err.message)
      setGenerating(false)
    }
  }

  if (!generating) {
    return (
      <div>
        <button onClick={onBack} className="mb-4 flex items-center text-sm text-gray-400 hover:text-white">
          <ChevronLeft className="mr-1 h-4 w-4" /> {t('back')}
        </button>
        <h2 className="mb-6 text-2xl font-bold">{t('gen_ready')}</h2>

        <div className="mb-6 flex gap-4">
          <img src={photoUrl} alt="" className="h-32 w-32 rounded-xl object-cover" />
          <div className="flex-1 rounded-xl border border-gray-700 bg-gray-800/30 p-4">
            <div className="mb-2 text-sm">
              <span className="text-gray-400">{t('gen_mood')}:</span>{' '}
              <span className="font-semibold capitalize">{storyboard.mood}</span>
            </div>
            <div className="mb-2 text-sm">
              <span className="text-gray-400">{t('gen_duration')}:</span>{' '}
              <span className="font-semibold">{storyboard.duration}s</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">{t('gen_scenes')}:</span>{' '}
              <span className="font-semibold">{storyboard.scenes.length}</span>
            </div>
          </div>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>
        )}

        <button onClick={startGenerate} className="btn-primary w-full">
          <Film className="mr-2 inline h-4 w-4" />
          {t('gen_button')}
        </button>
      </div>
    )
  }

  return (
    <div className="py-8 text-center">
      <div className="relative mx-auto mb-8 h-48 w-48">
        <img src={photoUrl} alt="" className="h-full w-full rounded-2xl object-cover opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-brand-500" />
        </div>
      </div>

      <h2 className="mb-2 text-xl font-bold">{STAGES[stage]}</h2>
      <p className="mb-6 text-sm text-gray-400">{t('gen_takes')}</p>

      <div className="mx-auto mb-6 h-2 max-w-md overflow-hidden rounded-full bg-gray-800">
        <div
          className="h-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mx-auto flex max-w-md flex-col gap-2">
        {STAGES.map((s, i) => (
          <div key={i} className={`flex items-center gap-2 text-sm ${i <= stage ? 'text-white' : 'text-gray-600'}`}>
            {i < stage ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : i === stage ? (
              <Loader2 className="h-4 w-4 animate-spin text-brand-500" />
            ) : (
              <div className="h-4 w-4 rounded-full border border-gray-700" />
            )}
            {s}
          </div>
        ))}
      </div>
    </div>
  )
}
