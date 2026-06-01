'use client'

import { useState, useRef } from 'react'
import { Upload, Loader2, ImageIcon, X } from 'lucide-react'

interface Props {
  onUploaded: (url: string, analysis: any) => void
}

export default function PhotoUpload({ onUploaded }: Props) {
  const [preview, setPreview] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be under 10MB')
      return
    }
    setError(null)

    // Show preview
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)

    // Upload + analyze
    setAnalyzing(true)
    try {
      const formData = new FormData()
      formData.append('photo', file)

      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error('Analysis failed')
      const data = await res.json()
      onUploaded(data.photoUrl, data.analysis)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setAnalyzing(false)
    }
  }

  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold">Upload Your Photo</h2>
      <p className="mb-6 text-gray-400">
        Drop any photo and our AI will analyze it to suggest the perfect video.
      </p>

      {!preview ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragActive(false)
            if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0])
          }}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed py-16 transition-all ${
            dragActive
              ? 'border-brand-500 bg-brand-500/10'
              : 'border-gray-700 hover:border-gray-500 hover:bg-gray-800/30'
          }`}
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/20">
            <Upload className="h-7 w-7 text-brand-500" />
          </div>
          <p className="mb-1 font-semibold">Drop your photo here</p>
          <p className="text-sm text-gray-500">or click to browse · JPG, PNG · max 10MB</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="relative">
          <img src={preview} alt="preview" className="mx-auto max-h-[400px] rounded-2xl" />
          {analyzing ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-gray-950/80 backdrop-blur-sm">
              <Loader2 className="mb-3 h-8 w-8 animate-spin text-brand-500" />
              <p className="font-semibold">Analyzing your photo...</p>
              <p className="text-sm text-gray-400">Detecting subject, mood &amp; composition</p>
            </div>
          ) : (
            <button
              onClick={() => { setPreview(null); setError(null) }}
              className="absolute right-3 top-3 rounded-full bg-gray-900/80 p-2 hover:bg-gray-800"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}
