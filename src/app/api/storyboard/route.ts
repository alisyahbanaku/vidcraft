import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { analysis, mood, sceneCount } = await req.json()

    const apiKey = process.env.VISION_API_KEY
    const baseUrl = process.env.VISION_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta/openai'
    const model = process.env.VISION_MODEL || 'gemini-2.5-flash'

    const fallback = {
      scenes: Array.from({ length: sceneCount }, (_, i) => ({
        id: `scene-${i}`,
        description: `Scene ${i + 1}: ${analysis?.summary || 'cinematic shot'}`,
        motion: ['slow zoom in', 'gentle pan', 'pull back reveal'][i % 3],
        duration: 5,
      })),
    }

    if (!apiKey) return NextResponse.json(fallback)

    const prompt = `You are a video storyboard director. Based on this photo analysis:
${JSON.stringify(analysis)}

Create a ${mood} storyboard with exactly ${sceneCount} scene(s) for an image-to-video AI.
Each scene animates the SAME source photo with different camera motion.
Return ONLY valid JSON:
{"scenes":[{"description":"what happens","motion":"camera movement + effect","duration":5}]}`

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 600,
      }),
    })

    const data = await res.json()
    try {
      const text = data.choices?.[0]?.message?.content || '{}'
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        const scenes = (parsed.scenes || []).map((s: any, i: number) => ({
          id: `scene-${i}`,
          description: s.description || `Scene ${i + 1}`,
          motion: s.motion || 'slow zoom',
          duration: s.duration || 5,
        }))
        return NextResponse.json({ scenes: scenes.length ? scenes : fallback.scenes })
      }
    } catch {
      // fall through
    }
    return NextResponse.json(fallback)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
