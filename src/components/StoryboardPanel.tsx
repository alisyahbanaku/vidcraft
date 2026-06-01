'use client'

import { useState, useEffect } from 'react'
import { Loader2, Sparkles, Pencil, Plus, Trash2, ChevronLeft, Wand2 } from 'lucide-react'
import { MOOD_PRESETS, DURATION_OPTIONS, type Scene } from '@/lib/storyboard'

interface Props {
  photoUrl: string
  analysis: any
  onConfirm: (storyboard: { mood: string; scenes: Scene[]; duration: number }) => void
  onBack: () => void
}

export default function StoryboardPanel({ photoUrl, analysis, onConfirm, onBack }: Props) {
  const [mode, setMode] = useState<'auto' | 'manual'>('auto')
  const [selectedMood, setSelectedMood] = useState<string>('cinematic')
  const [duration, setDuration] = useState(10)
  const [scenes, setScenes] = useState<Scene[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const durationOpt = DURATION_OPTIONS.find((d) => d.value === duration)!

  // Auto-generate storyboard when mood/duration changes in auto mode
  useEffect(() => {
    if (mode === 'auto') generateStoryboard()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMood, duration, mode])

  async function generateStoryboard() {
    setLoading(true)
    try {
      const res = await fetch('/api/storyboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysis, mood: selectedMood, sceneCount: durationOpt.scenes }),
      })
      const data = await res.json()
      setScenes(data.scenes)
    } catch {
      // fallback scenes
      setScenes(
        Array.from({ length: durationOpt.scenes }, (_, i) => ({
          id: `scene-${i}`,
          description: `Scene ${i + 1}`,
          motion: 'slow cinematic zoom',
          duration: Math.round(duration / durationOpt.scenes),
        }))
      )
    } finally {
      setLoading(false)
    }
  }

  function updateScene(id: string, field: keyof Scene, value: string) {
    setScenes((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  function addScene() {
    setScenes((prev) => [
      ...prev,
      { id: `scene-${Date.now()}`, description: 'New scene', motion: 'gentle motion', duration: 5 },
    ])
  }

  function removeScene(id: string) {
    setScenes((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <div>
      <button onClick={onBack} className="mb-4 flex items-center text-sm text-gray-400 hover:text-white">
        <ChevronLeft className="mr-1 h-4 w-4" /> Back
      </button>

      <div className="mb-6 flex flex-col gap-6 sm:flex-row">
        <img src={photoUrl} alt="" className="h-40 w-40 rounded-xl object-cover" />
        <div className="flex-1">
          <h2 className="mb-2 text-2xl font-bold">Build Your Storyboard</h2>
          {analysis?.summary && (
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-3 py-1 text-sm text-brand-300">
              <Sparkles className="h-3.5 w-3.5" />
              {analysis.summary}
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => setMode('auto')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                mode === 'auto' ? 'bg-brand-600 text-white' : 'bg-gray-800 text-gray-400'
              }`}
            >
              <Wand2 className="mr-1.5 inline h-3.5 w-3.5" /> AI Auto
            </button>
            <button
              onClick={() => setMode('manual')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                mode === 'manual' ? 'bg-brand-600 text-white' : 'bg-gray-800 text-gray-400'
              }`}
            >
              <Pencil className="mr-1.5 inline h-3.5 w-3.5" /> Manual
            </button>
          </div>
        </div>
      </div>

      {/* Mood selector */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-300">Mood</label>
        <div className="grid grid-cols-3 gap-3">
          {MOOD_PRESETS.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMood(m.id)}
              className={`rounded-xl border bg-gradient-to-br p-4 text-left transition-all ${
                selectedMood === m.id ? m.color + ' ring-2 ring-brand-500' : 'border-gray-700 from-gray-800/30 to-gray-800/30'
              }`}
            >
              <div className="mb-1 text-2xl">{m.emoji}</div>
              <div className="font-semibold">{m.label}</div>
              <div className="text-xs text-gray-400">{m.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Duration selector */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-300">Duration</label>
        <div className="flex gap-3">
          {DURATION_OPTIONS.map((d) => (
            <button
              key={d.value}
              onClick={() => setDuration(d.value)}
              className={`flex-1 rounded-xl border py-3 text-center transition-all ${
                duration === d.value ? 'border-brand-500 bg-brand-500/10' : 'border-gray-700'
              }`}
            >
              <div className="font-bold">{d.label}</div>
              <div className="text-xs text-gray-400">{d.credits} credits</div>
            </button>
          ))}
        </div>
      </div>

      {/* Scenes */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-300">Scenes ({scenes.length})</label>
          {mode === 'manual' && (
            <button onClick={addScene} className="flex items-center text-sm text-brand-400 hover:text-brand-300">
              <Plus className="mr-1 h-4 w-4" /> Add scene
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center rounded-xl border border-gray-700 py-10">
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-brand-500" />
            <span className="text-gray-400">AI is writing your storyboard...</span>
          </div>
        ) : (
          <div className="space-y-3">
            {scenes.map((scene, i) => (
              <div key={scene.id} className="rounded-xl border border-gray-700 bg-gray-800/30 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
                    Scene {i + 1} · {scene.duration}s
                  </span>
                  {mode === 'manual' && scenes.length > 1 && (
                    <button onClick={() => removeScene(scene.id)} className="text-gray-500 hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                {mode === 'manual' || editingId === scene.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={scene.description}
                      onChange={(e) => updateScene(scene.id, 'description', e.target.value)}
                      className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm"
                      rows={2}
                      placeholder="Describe the scene..."
                    />
                    <input
                      value={scene.motion}
                      onChange={(e) => updateScene(scene.id, 'motion', e.target.value)}
                      className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm"
                      placeholder="Camera motion (e.g. slow zoom in)"
                    />
                  </div>
                ) : (
                  <div onClick={() => setEditingId(scene.id)} className="cursor-pointer">
                    <p className="text-sm">{scene.description}</p>
                    <p className="mt-1 text-xs text-gray-500">🎥 {scene.motion}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => onConfirm({ mood: selectedMood, scenes, duration })}
        disabled={loading || scenes.length === 0}
        className="btn-primary w-full"
      >
        Continue · {durationOpt.credits} credits
      </button>
    </div>
  )
}
