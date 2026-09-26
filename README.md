# databyloris

`databyloris` is a data storytelling platform for discovering analyses, understanding their key insights, and exploring the underlying data through interactive dashboards. It is a product experience rather than a traditional personal portfolio.

**Status:** V1

## Product philosophy

**Discover → Understand → Explore**

Projects lead with context and authored insights before opening into exploratory dashboards. This keeps the analytical story understandable while still giving visitors room to investigate their own questions.

## Current demo

**Spotify Listening Trends** demonstrates the complete project experience with a deterministic, synthetic dataset. The values are illustrative and must not be interpreted as real Spotify statistics.

- **Rows:** 1,536
- **Period:** 2022–2025
- **Grain:** one track × one country × one month
- **Dimensions:** time, track, artist, genre, and country
- **Metrics:** streams, listeners, popularity, and playlist reach

## Main features

- Supabase-backed public project catalog with featured and published states
- Editorial data stories followed by interactive exploration
- Insight links that open the dashboard with relevant URL-backed filters and module focus
- Optional, Spotify-specific guided onboarding through real interface controls
- Responsive light and dark themes with accessible keyboard and reduced-motion behavior
- Reusable dashboard filters, KPIs, charts, comparisons, and tables
- Private single-admin project CRUD using Supabase Auth
- Draft and published project workflow
- Project cover upload, replacement, removal, and public delivery through Supabase Storage

## Spotify analytics

The demo includes:

- monthly streaming trend
- top-artist ranking and artist concentration story
- genre distribution and genre growth analysis
- market and listening-preference differences
- two-artist metric comparison
- sortable and paginated track table
- illustrative hit-lifecycle story

All analytical outputs are generated from the local synthetic dataset; no real Spotify activity or user data is collected.

## Architecture

The V1 deliberately separates project publishing metadata from analytical implementations.

**Supabase owns:**

- project metadata and publication state
- optional project cover paths
- Admin authentication
- PostgreSQL persistence and Row Level Security
- project-cover object storage

**Application code owns:**

- analytical datasets and calculations
- authored stories and methodology
- dashboard configuration and visualizations
- guided onboarding configuration

A project slug is the explicit join between a Supabase metadata record and a code-driven analytical module. Published records without a registered implementation receive a metadata-only project view; unpublishing or removing a record removes it from public routes.

## Tech stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Recharts
- Supabase
- PostgreSQL

## Repository structure

```text
src/
├── app/                 # App Router pages, layouts, and server actions
├── components/          # UI, layout, analytics, project, Admin, and onboarding components
├── data/                # Spotify dataset and authored project configuration
├── lib/                 # Analytics, Supabase, auth, and project utilities
└── types/               # Shared TypeScript boundaries
supabase/
├── migrations/          # Projects, RLS, project covers, and Storage policies
└── seeds/               # Optional canonical Spotify metadata seed
docs/                    # Product, UI, data-model, roadmap, and release documentation
```

## Local setup

1. Clone the repository and enter it:

   ```bash
   git clone <REPOSITORY_URL>
   cd databyloris
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env.local` from the provided example:

   ```bash
   cp .env.example .env.local
   ```

4. Configure the required values without committing credentials:

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
   ADMIN_EMAIL=
   ```

5. Apply the SQL files in `supabase/migrations/` in filename order.

6. In Supabase, create the single administrator Auth account, add its user UUID to `public.admin_users`, then optionally run `supabase/seeds/spotify_project.sql` to create the canonical Spotify metadata record.

7. Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Vercel Preview deployment

Vercel can deploy this repository as a standard Next.js project. No custom
build command or `vercel.json` file is required. Configure these variables for
the **Preview** environment before creating a deployment:

| Variable | Exposure | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public, build and runtime | Supabase API endpoint and the allowlisted project-cover image host |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public, build and runtime | Browser/server access governed by Supabase Auth and Row Level Security |
| `ADMIN_EMAIL` | Server only | Application-level allowlist for the single administrator |

Do not add a Supabase service-role key or a direct PostgreSQL connection
string. The application does not use either. Environment changes only affect
new Vercel deployments, so redeploy after adding or updating a value.

Before testing Admin in Preview:

1. Apply the migrations to the Supabase project selected for Preview.
2. Create the administrator in Supabase Auth.
3. Add that Auth user UUID to `public.admin_users`.
4. Set `ADMIN_EMAIL` to the same account email.

Using the production Supabase values in Preview means Admin mutations affect
the production database and Storage bucket. Use a separate Supabase project and
matching Preview variables when deployment isolation is required.

The implemented Admin flow uses `signInWithPassword` and same-origin Next.js
redirects. It does not implement OAuth, passwordless login, password recovery,
or an Auth callback route, so the current sign-in flow does not require a
Preview callback URL. If a redirect-based Auth flow is added later, configure
the production Site URL and explicit local/Preview redirect patterns in the
Supabase Auth URL settings before enabling it.

Project covers currently upload through a Server Action. Vercel Functions cap
the complete request payload at 4.5 MB, including multipart overhead, while the
application-level cover limit remains 5 MB. For Preview testing, keep cover
files at or below 4 MB. Supporting the full 5 MB application limit on Vercel
requires a future direct-to-Supabase upload flow; the limit is not silently
changed for this deployment audit.

## Database setup

Apply migrations in this order:

1. `202609250001_create_admin_projects.sql` — Admin allowlist, projects schema, project RLS, and publishing policies.
2. `202609250002_add_project_covers.sql` — cover metadata, public Storage bucket, validation, and Admin-only Storage policies.

The optional `supabase/seeds/spotify_project.sql` seed is idempotent and expects exactly one row in `public.admin_users`. It resolves the administrator UUID from that allowlist; no personal identifier is stored in the repository.

## Admin model

There is no public signup flow. Public visitors browse published projects without authentication.

The private Admin area is designed for one authorized administrator. Access requires all three layers to agree:

- a valid Supabase Auth session
- an email matching the server-only `ADMIN_EMAIL` configuration
- the Auth user UUID present in `public.admin_users`

## Security

- Row Level Security is enabled for project records.
- Anonymous reads are limited to published projects.
- Project mutations require database Admin authorization.
- Storage writes and object management are Admin-only.
- The application uses a publishable key and does not expose or require a service-role key.
- `.env.local` and other environment files are ignored; only `.env.example` is tracked.

## Accessibility

The V1 includes semantic navigation and headings, visible keyboard focus, keyboard-operable controls, reduced-motion support, text summaries for analytical visuals, responsive table regions, and intentional light/dark contrast work. This describes implemented practices and is not a claim of formal WCAG certification.

## Roadmap

Future ideas include:

- shareable insight URLs beyond the current dashboard filter state
- collections and related projects
- advanced comparison workflows
- Data Story Builder
- Dashboard Builder
- Ask the Data
- Smart Insights

These are future directions and are not included in V1. See [docs/ROADMAP.md](docs/ROADMAP.md) for the delivery history and scope boundaries.

## Release notes

See [docs/RELEASE_NOTES_V1.md](docs/RELEASE_NOTES_V1.md) for the proposed `v1.0.0` release summary.
