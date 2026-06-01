# VidCraft 🎬

Turn any photo into a stunning AI-generated video. Upload → AI Storyboard → Generate → Download.

## Features

- **Photo Analysis** — Gemini Vision auto-detects subject, mood, composition
- **Smart Storyboards** — AI suggests scenes (Cinematic / Energetic / Aesthetic), or write your own
- **Video Generation** — Image-to-video via FAL.ai (Kling/SVD) or Google Veo
- **Credit System** — Pay-per-video, Midtrans QRIS payment
- **Interactive Showcase** — Slideshow of example results on the landing page

## Tech Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Gemini 2.5 Flash (vision + storyboard generation)
- FAL.ai (image-to-video)
- Prisma + PostgreSQL (users, credits, jobs)
- Midtrans (payments)

## Quick Start

```bash
npm install
cp .env.example .env   # fill in your keys
npm run dev
```

Open http://localhost:3000

## Environment Variables

See `.env.example`. Minimum to run the flow end-to-end:

| Var | Purpose | Required |
|-----|---------|----------|
| `VISION_API_KEY` | Gemini key for photo analysis + storyboard | Recommended |
| `FAL_KEY` | FAL.ai key for video generation | For real videos |

Without `FAL_KEY` the app returns a demo clip so you can test the full UI flow.

## Deploy to Vercel

1. Push this repo to GitHub
2. Import into Vercel
3. Add environment variables in Vercel project settings
4. Deploy

The `/api/generate` route has `maxDuration = 300` for long video jobs (Vercel Pro recommended for >60s).

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page (hero, showcase, pricing)
│   ├── create/page.tsx       # The app flow (upload → generate)
│   └── api/
│       ├── analyze/          # Photo analysis (Gemini vision)
│       ├── storyboard/       # Storyboard generation
│       └── generate/         # Video generation (FAL/Veo)
├── components/
│   ├── PhotoUpload.tsx
│   ├── StoryboardPanel.tsx
│   ├── GeneratePanel.tsx
│   └── ShowcaseSlideshow.tsx
└── lib/
    ├── utils.ts
    └── storyboard.ts
```

## Roadmap

- [ ] Auth (Google OAuth + email)
- [ ] Real cloud storage (R2/S3) for uploads
- [ ] Credit balance + Midtrans top-up
- [ ] User dashboard with video history
- [ ] Replace demo showcase clips with real generated results
