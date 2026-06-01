'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import { useLanguage } from './LanguageProvider'

interface Example {
  id: string
  title: string
  category: string
  mood: string
  thumbnail: string
  video: string
  beforeImage: string
}

// Demo showcase items. Replace video/thumbnail/beforeImage URLs with real
// generated results once the pipeline is live (store them in /public/showcase).
const EXAMPLES: Example[] = [
  {
    id: '1',
    title: 'Portrait → Cinematic',
    category: 'People',
    mood: 'Cinematic',
    thumbnail: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
    video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    beforeImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
  },
  {
    id: '2',
    title: 'Product → Dynamic Spin',
    category: 'Product',
    mood: 'Energetic',
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    beforeImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  },
  {
    id: '3',
    title: 'Landscape → Parallax',
    category: 'Nature',
    mood: 'Aesthetic',
    thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
    video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    beforeImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
  },
  {
    id: '4',
    title: 'Food → Appetite Appeal',
    category: 'Food',
    mood: 'Cinematic',
    thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
    video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    beforeImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
  },
]

export default function ShowcaseSlideshow() {
  const { t } = useLanguage()
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const current = EXAMPLES[active]

  // Auto-advance every 6s when not playing a video
  useEffect(() => {
    if (playing) return
    const timer = setInterval(() => {
      setActive((a) => (a + 1) % EXAMPLES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [playing])

  function next() {
    setPlaying(false)
    setActive((a) => (a + 1) % EXAMPLES.length)
  }
  function prev() {
    setPlaying(false)
    setActive((a) => (a - 1 + EXAMPLES.length) % EXAMPLES.length)
  }

  function togglePlay() {
    if (!videoRef.current) return
    if (playing) {
      videoRef.current.pause()
      setPlaying(false)
    } else {
      videoRef.current.play()
      setPlaying(true)
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-bold">{t('showcase_title')}</h2>
        <p className="text-gray-400">{t('showcase_subtitle')}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main viewer */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-black">
          <div className="relative aspect-video">
            {playing ? (
              <video
                ref={videoRef}
                src={current.video}
                className="h-full w-full object-cover"
                onEnded={() => setPlaying(false)}
                playsInline
              />
            ) : (
              <img src={current.thumbnail} alt={current.title} className="h-full w-full object-cover" />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            {/* Play button */}
            <button
              onClick={togglePlay}
              className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-900 transition-transform hover:scale-110"
            >
              {playing ? <Pause className="h-7 w-7" /> : <Play className="ml-1 h-7 w-7" />}
            </button>

            {/* Info badges */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <div className="mb-1 flex gap-2">
                  <span className="rounded-full bg-brand-600 px-2.5 py-0.5 text-xs font-medium">{current.category}</span>
                  <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium backdrop-blur">{current.mood}</span>
                </div>
                <h3 className="text-lg font-bold">{current.title}</h3>
              </div>
            </div>

            {/* Nav arrows */}
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 backdrop-blur hover:bg-black/70">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 backdrop-blur hover:bg-black/70">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 py-3">
            {EXAMPLES.map((_, i) => (
              <button
                key={i}
                onClick={() => { setPlaying(false); setActive(i) }}
                className={`h-1.5 rounded-full transition-all ${i === active ? 'w-8 bg-brand-500' : 'w-1.5 bg-gray-600'}`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnail list */}
        <div className="space-y-3">
          {EXAMPLES.map((ex, i) => (
            <button
              key={ex.id}
              onClick={() => { setPlaying(false); setActive(i) }}
              className={`flex w-full items-center gap-3 rounded-xl border p-2 text-left transition-all ${
                i === active ? 'border-brand-500 bg-brand-500/10' : 'border-gray-800 hover:border-gray-600'
              }`}
            >
              <img src={ex.thumbnail} alt="" className="h-14 w-20 rounded-lg object-cover" />
              <div className="flex-1">
                <div className="text-sm font-semibold">{ex.title}</div>
                <div className="text-xs text-gray-500">{ex.category} · {ex.mood}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
