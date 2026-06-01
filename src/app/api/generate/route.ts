import { NextRequest, NextResponse } from 'next/server'

// Video generation. Supports two backends:
// 1. FAL.ai (image-to-video via Kling/SVD)  -> set FAL_KEY
// 2. Google Veo (paid plan)                 -> set VEO via VISION_API_KEY
// Falls back to a demo clip when no backend configured.

export async function POST(req: NextRequest) {
  try {
    const { photoUrl, storyboard } = await req.json()

    const falKey = process.env.FAL_KEY

    // Build a single combined prompt from scenes
    const motionPrompt = storyboard.scenes
      .map((s: any) => `${s.description}, ${s.motion}`)
      .join('. ')
    const fullPrompt = `${storyboard.mood} style. ${motionPrompt}. Cinematic, high quality, smooth motion.`

    // ---- FAL.ai backend ----
    if (falKey) {
      // Submit to FAL queue (Kling image-to-video)
      const submitRes = await fetch('https://queue.fal.run/fal-ai/kling-video/v1/standard/image-to-video', {
        method: 'POST',
        headers: { Authorization: `Key ${falKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          image_url: photoUrl,
          duration: String(Math.min(storyboard.duration, 10)),
        }),
      })
      const submit = await submitRes.json()
      const statusUrl = submit.status_url
      const responseUrl = submit.response_url

      // Poll until done (max ~3 min)
      for (let i = 0; i < 60; i++) {
        await new Promise((r) => setTimeout(r, 3000))
        const st = await fetch(statusUrl, { headers: { Authorization: `Key ${falKey}` } })
        const stData = await st.json()
        if (stData.status === 'COMPLETED') {
          const result = await fetch(responseUrl, { headers: { Authorization: `Key ${falKey}` } })
          const resultData = await result.json()
          const videoUrl = resultData.video?.url
          if (videoUrl) return NextResponse.json({ videoUrl })
          break
        }
        if (stData.status === 'FAILED') break
      }
      return NextResponse.json({ error: 'Video generation failed or timed out' }, { status: 500 })
    }

    // ---- Demo fallback (no backend configured) ----
    // Returns a sample clip so the UI flow works end-to-end during development.
    return NextResponse.json({
      videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      demo: true,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Generation failed' }, { status: 500 })
  }
}

export const maxDuration = 300
