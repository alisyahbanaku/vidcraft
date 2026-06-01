'use client'

import { useState } from 'react'
import { Upload, Sparkles, Video, Download } from 'lucide-react'
import PhotoUpload from '@/components/PhotoUpload'
import StoryboardPanel from '@/components/StoryboardPanel'
import GeneratePanel from '@/components/GeneratePanel'
import { useLanguage } from '@/components/LanguageProvider'

type Step = 'upload' | 'storyboard' | 'generate' | 'result'

export default function CreatePage() {
  const { t } = useLanguage()
  const [step, setStep] = useState<Step>('upload')
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [photoAnalysis, setPhotoAnalysis] = useState<any>(null)
  const [storyboard, setStoryboard] = useState<any>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  const steps = [
    { id: 'upload', label: t('step_upload'), icon: Upload },
    { id: 'storyboard', label: t('step_storyboard'), icon: Sparkles },
    { id: 'generate', label: t('step_generate'), icon: Video },
    { id: 'result', label: t('step_result'), icon: Download },
  ]
  const currentIdx = steps.findIndex((s) => s.id === step)

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Progress */}
      <div className="mb-10 flex items-center justify-center gap-2">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
              step === s.id ? 'border-brand-500 bg-brand-500/20 text-brand-500'
                : currentIdx > i ? 'border-green-500 bg-green-500/20 text-green-500'
                : 'border-gray-700 text-gray-500'
            }`}>
              <s.icon className="h-5 w-5" />
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 w-8 ${currentIdx > i ? 'bg-green-500' : 'bg-gray-700'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="card">
        {step === 'upload' && (
          <PhotoUpload onUploaded={(url, analysis) => {
            setPhotoUrl(url); setPhotoAnalysis(analysis); setStep('storyboard')
          }} />
        )}
        {step === 'storyboard' && (
          <StoryboardPanel photoUrl={photoUrl!} analysis={photoAnalysis}
            onConfirm={(sb) => { setStoryboard(sb); setStep('generate') }}
            onBack={() => setStep('upload')} />
        )}
        {step === 'generate' && (
          <GeneratePanel photoUrl={photoUrl!} storyboard={storyboard}
            onComplete={(url) => { setVideoUrl(url); setStep('result') }}
            onBack={() => setStep('storyboard')} />
        )}
        {step === 'result' && videoUrl && (
          <div className="text-center">
            <h2 className="mb-6 text-2xl font-bold">{t('result_title')}</h2>
            <video src={videoUrl} controls autoPlay loop className="mx-auto mb-6 max-h-[500px] rounded-xl" />
            <div className="flex justify-center gap-4">
              <a href={videoUrl} download className="btn-primary">
                <Download className="mr-2 inline h-4 w-4" /> {t('result_download')}
              </a>
              <button onClick={() => { setStep('upload'); setVideoUrl(null); setPhotoUrl(null) }} className="btn-secondary">
                {t('result_another')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
