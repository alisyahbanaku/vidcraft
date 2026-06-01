'use client'

import { Upload, Wand2, Film, Sparkles, Zap, Image as ImageIcon, Check } from 'lucide-react'
import ShowcaseSlideshow from '@/components/ShowcaseSlideshow'

export default function LandingPage() {
  return (
    <div>
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden px-4 py-20">
        <div className="pointer-events-none absolute inset-0 opacity-40"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(79,110,247,0.25) 0%, transparent 70%)' }} />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300">
            <Sparkles className="h-3.5 w-3.5" /> AI-Powered Video Generation
          </div>
          <h1 className="mb-6 text-5xl font-extrabold leading-tight sm:text-6xl">
            Turn Any Photo into a<br />
            <span className="bg-gradient-to-r from-brand-400 to-violet-400 bg-clip-text text-transparent">
              Stunning Video
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-400">
            Upload a photo, let AI build the storyboard, and generate a cinematic video in seconds.
            No editing skills. No camera. Just magic.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="/create" className="btn-primary px-8 py-4 text-lg">
              <Wand2 className="mr-2 inline h-5 w-5" /> Start Creating Free
            </a>
            <a href="#showcase" className="btn-secondary px-8 py-4 text-lg">
              See Examples
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-500">✨ 3 free credits · No credit card required</p>
        </div>
      </section>

      {/* ===== Showcase ===== */}
      <section id="showcase" className="px-4 py-16">
        <ShowcaseSlideshow />
      </section>

      {/* ===== How it works ===== */}
      <section className="border-t border-gray-800 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-3xl font-bold">How It Works</h2>
            <p className="text-gray-400">From photo to video in 3 simple steps</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: Upload, title: '1. Upload Photo', desc: 'Drop any image. Our AI instantly analyzes the subject, mood, and composition.' },
              { icon: Wand2, title: '2. AI Storyboard', desc: 'Get smart storyboard suggestions, or write your own scene-by-scene direction.' },
              { icon: Film, title: '3. Generate Video', desc: 'AI animates your photo into a smooth, cinematic video ready to download and share.' },
            ].map((s) => (
              <div key={s.title} className="card text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/20">
                  <s.icon className="h-7 w-7 text-brand-500" />
                </div>
                <h3 className="mb-2 text-lg font-bold">{s.title}</h3>
                <p className="text-sm text-gray-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section className="border-t border-gray-800 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-3xl font-bold">Built for Creators</h2>
            <p className="text-gray-400">Everything you need to make videos that stand out</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Zap, title: 'Lightning Fast', desc: 'Videos generated in 30-60 seconds.' },
              { icon: Sparkles, title: 'Smart Storyboards', desc: 'AI reads your photo and suggests the best motion.' },
              { icon: ImageIcon, title: 'Any Photo Works', desc: 'People, products, food, landscapes — all supported.' },
              { icon: Film, title: 'Multiple Moods', desc: 'Cinematic, energetic, or aesthetic styles.' },
              { icon: Wand2, title: 'Full Control', desc: 'Edit every scene or let AI handle it.' },
              { icon: Check, title: 'Ready to Share', desc: 'Download MP4 optimized for social media.' },
            ].map((f) => (
              <div key={f.title} className="card">
                <f.icon className="mb-3 h-6 w-6 text-brand-500" />
                <h3 className="mb-1 font-bold">{f.title}</h3>
                <p className="text-sm text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Pricing ===== */}
      <section id="pricing" className="border-t border-gray-800 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-3xl font-bold">Simple Credit Pricing</h2>
            <p className="text-gray-400">Pay only for what you create. No subscriptions.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { name: 'Starter', price: 'Rp 49K', credits: 20, popular: false, perks: ['20 video credits', '~20 short videos', 'HD quality', 'Email support'] },
              { name: 'Pro', price: 'Rp 149K', credits: 70, popular: true, perks: ['70 video credits', '~70 videos', 'HD quality', 'Priority generation', 'No watermark'] },
              { name: 'Business', price: 'Rp 399K', credits: 200, popular: false, perks: ['200 video credits', '~200 videos', 'Full HD quality', 'Priority support', 'Commercial license'] },
            ].map((p) => (
              <div key={p.name} className={`card relative ${p.popular ? 'ring-2 ring-brand-500' : ''}`}>
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold">
                    Most Popular
                  </span>
                )}
                <h3 className="mb-1 text-lg font-bold">{p.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-extrabold">{p.price}</span>
                </div>
                <ul className="mb-6 space-y-2">
                  {p.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2 text-sm text-gray-300">
                      <Check className="h-4 w-4 text-green-500" /> {perk}
                    </li>
                  ))}
                </ul>
                <a href="/create" className={p.popular ? 'btn-primary block text-center' : 'btn-secondary block text-center'}>
                  Get {p.credits} Credits
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="border-t border-gray-800 px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to bring your photos to life?</h2>
          <p className="mb-8 text-gray-400">Join creators turning static images into scroll-stopping videos.</p>
          <a href="/create" className="btn-primary px-8 py-4 text-lg">
            <Wand2 className="mr-2 inline h-5 w-5" /> Start Creating Free
          </a>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-gray-800 px-4 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-sm text-gray-500 sm:flex-row">
          <div><span className="text-brand-500">Vid</span>Craft © 2026</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
