import { NextRequest, NextResponse } from 'next/server'

// Photo analysis using Gemini vision (OpenAI-compatible endpoint)
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const photo = formData.get('photo') as File
    if (!photo) {
      return NextResponse.json({ error: 'No photo provided' }, { status: 400 })
    }

    // Convert to base64 data URL
    const bytes = await photo.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    const dataUrl = `data:${photo.type};base64,${base64}`

    // TODO: upload to storage (S3/R2). For now, return data URL as photoUrl.
    const photoUrl = dataUrl

    const apiKey = process.env.VISION_API_KEY
    const baseUrl = process.env.VISION_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta/openai'
    const model = process.env.VISION_MODEL || 'gemini-2.5-flash'

    if (!apiKey) {
      // Graceful fallback when no key configured
      return NextResponse.json({
        photoUrl,
        analysis: {
          subject: 'unknown',
          summary: 'Photo uploaded',
          mood: 'neutral',
          setting: 'unknown',
        },
      })
    }

    const prompt = `Analyze this photo for video generation. Return ONLY valid JSON:
{
  "subject": "main subject (person/product/landscape/food/etc)",
  "summary": "one short sentence describing the photo",
  "mood": "dominant mood/feeling",
  "setting": "indoor/outdoor + lighting",
  "details": "appearance, pose, colors, composition"
}`

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: dataUrl } },
            ],
          },
        ],
        max_tokens: 400,
      }),
    })

    const data = await res.json()
    let analysis: any = { subject: 'unknown', summary: 'Photo uploaded', mood: 'neutral' }
    try {
      const text = data.choices?.[0]?.message?.content || '{}'
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) analysis = JSON.parse(jsonMatch[0])
    } catch {
      // keep fallback
    }

    return NextResponse.json({ photoUrl, analysis })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Analysis failed' }, { status: 500 })
  }
}

export const config = { api: { bodyParser: false } }
