# REGEN AI

AI-powered text regeneration with multiple creative modes, built with React + Vite + Gemini.

## Features

- Multiple regeneration modes (Professional, Creative, Casual, Academic, etc.)
- Regeneration history with localStorage persistence
- PDF export
- **PWA** — installable on desktop and mobile, works offline (UI only)
- Dark, modern UI with Tailwind CSS v4 and Motion animations

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Build tool:** Vite 6
- **Styling:** Tailwind CSS v4
- **AI:** Google Gemini (`@google/genai`)
- **PWA:** `vite-plugin-pwa` + Workbox
- **Export:** jsPDF

---

## Local Development

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/regen-ai.git
cd regen-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```
GEMINI_API_KEY=your_api_key_here
```

Get a free key at [Google AI Studio](https://aistudio.google.com/apikey).

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel

### Option A — Vercel CLI

```bash
npm i -g vercel
vercel
```

Set the `GEMINI_API_KEY` environment variable when prompted (or in the Vercel dashboard under **Settings → Environment Variables**).

### Option B — GitHub + Vercel Dashboard

1. Push this repo to GitHub:

```bash
git remote add origin https://github.com/<your-username>/regen-ai.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the GitHub repo.
3. In **Environment Variables**, add:
   - `GEMINI_API_KEY` = `<your api key>`
4. Click **Deploy**.

Vercel auto-detects Vite and uses the `vercel.json` configuration already included in this repo.

---

## PWA Installation

After deploying to Vercel (or any HTTPS host):

- **Desktop (Chrome/Edge):** click the install icon in the address bar.
- **Mobile (Android):** tap the browser menu → "Add to Home Screen".
- **iOS (Safari):** tap Share → "Add to Home Screen".

The service worker pre-caches all static assets. The Gemini API calls are always network-only (no caching of AI responses).

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini API key |

> **Note:** This key is embedded at build time by Vite. It will be visible in the browser bundle — for production use, consider proxying requests through a backend.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | TypeScript type-check |
