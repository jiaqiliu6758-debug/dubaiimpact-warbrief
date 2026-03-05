# DubaiImpact / WarBrief (auto-updating daily)

This repo hosts a bilingual (ZH/EN) website that publishes a daily brief at **03:00 UTC** (07:00 Dubai, UTC+4).

## What you get
- Next.js website:
  - `/` Today (latest)
  - `/archive` list of dates
  - `/day/YYYY-MM-DD` day page
  - `?lang=zh|en` language switch
- A daily generator script that:
  - pulls RSS feeds (configurable),
  - summarizes + structures the brief,
  - writes `content/days/YYYY-MM-DD.json`
- A GitHub Actions cron that runs **every day 03:00 UTC**, commits the new JSON and pushes.
- Deploy to Vercel once; after that it auto-updates (no daily manual work).

## One-time setup (you do this once)
1) Create a GitHub repo and push this code.
2) Create these repo secrets (GitHub → Settings → Secrets and variables → Actions):
   - `OPENAI_API_KEY`  (required for AI summaries; optional if you want stub content)
   - `OPENAI_MODEL`    (optional, default `gpt-4.1-mini`)
3) Deploy on Vercel:
   - Import this GitHub repo
   - Set environment variables on Vercel (same names as above if you want server-side use; not required for static rendering)
   - Build command: `npm run build` (default)
   - Output: Next.js (default)
4) (Optional) Customize sources in `config/sources.json`.

After that:
- Every day at 03:00 UTC, GitHub Actions generates today's brief and pushes it.
- Vercel auto-deploys on push.
- You simply open your Vercel URL daily.

## Local dev
```bash
npm i
npm run dev
```

## Notes
- This is a *public-information* summary site; include source links and avoid unverified rumors.
- The generator prefers RSS. If a source doesn't provide RSS, add it later via an API or a custom scraper.
