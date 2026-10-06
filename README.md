# databyloris

Personal Data Analytics platform built to showcase real analytical projects, interactive dashboards, and data-driven case studies.

## Features

- Bilingual Italian/English experience
- Portfolio and project Case Studies
- Interactive dashboards powered by a configuration-driven Dashboard Engine
- Recruiter Mode
- Playground featuring the Retail Pulse demo dataset
- Light/dark themes and responsive, accessible interfaces
- Admin workspace with a Publishing Quality Gate

## Tech stack

Next.js (App Router), TypeScript, Tailwind CSS, Supabase, Apache ECharts, next-intl, next-themes, and Vercel.

## Main areas

- **Portfolio:** Browse published analytics projects and find relevant work.
- **Case Studies:** Explore each project's context, objectives, methodology, dataset, and insights.
- **Dashboard Engine:** Render configuration-driven KPI, filters (including multi-select), charts, rankings, empty states, and responsive layouts.
- **Recruiter Mode:** Get a concise view of the profile, selected projects, technologies used, and available professional links.
- **Playground:** Explore the preloaded Retail Pulse demo through a guided, interactive dashboard.
- **Admin:** Manage project content, datasets, and dashboard configurations. The server-side Publishing Quality Gate prevents incomplete projects or projects with invalid dashboard dependencies from being published.

## Local development

```bash
npm install
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Italian is the default locale at `/`; English is available at `/en`.

## Environment variables

`.env.example` documents the required variables. Create a local `.env.local` with the values for your environment. Do not commit credentials or secrets.

## Quality checks

```bash
npm run typecheck
npm run lint
npm run build -- --webpack
git diff --check
```

## Deployment

databyloris is deployed on Vercel. Changes follow this workflow:

feature branch → local verification → Vercel Preview → approval → main → production

## Current release

**V1.1** — UI maturity, Portfolio and Case Study improvements, Dashboard UX, Recruiter Mode, Playground refinement, and the Publishing Quality Gate.
