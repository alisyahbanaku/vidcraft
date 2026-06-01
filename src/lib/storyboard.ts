export interface Scene {
  id: string
  description: string
  motion: string
  duration: number // seconds
}

export interface Storyboard {
  mood: string
  scenes: Scene[]
}

export type StoryboardMode = 'auto' | 'manual' | 'quick'

export const MOOD_PRESETS = [
  {
    id: 'cinematic',
    label: 'Cinematic',
    emoji: '🎬',
    desc: 'Dramatic lighting, slow zooms, film-grade motion',
    color: 'from-amber-500/20 to-orange-600/20 border-amber-500/40',
  },
  {
    id: 'energetic',
    label: 'Energetic',
    emoji: '⚡',
    desc: 'Quick cuts, dynamic movement, high energy',
    color: 'from-pink-500/20 to-rose-600/20 border-pink-500/40',
  },
  {
    id: 'aesthetic',
    label: 'Aesthetic',
    emoji: '✨',
    desc: 'Soft blur, gentle sway, warm dreamy tones',
    color: 'from-violet-500/20 to-purple-600/20 border-violet-500/40',
  },
] as const

export const DURATION_OPTIONS = [
  { value: 5, label: '5s', credits: 1, scenes: 1 },
  { value: 10, label: '10s', credits: 3, scenes: 2 },
  { value: 15, label: '15s', credits: 5, scenes: 3 },
]
