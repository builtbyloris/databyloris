# databyloris v1.0.0

The first public release of `databyloris`, a platform for discovering data analyses, understanding their key insights, and exploring interactive dashboards.

## Highlights

- Public Home, Explore, About, and reusable project experiences
- Supabase-backed project metadata, featured state, and draft/published visibility
- Spotify Listening Trends demo with a deterministic 1,536-row synthetic dataset covering 2022–2025
- Editorial Overview, four insight stories, interactive Explore dashboard, and complete Methodology
- URL-backed Insight → Dashboard navigation with filter restoration and module focus
- Streaming trend, artist ranking, genre distribution, genre growth, artist comparison, and track table modules
- Optional guided onboarding scoped to the Spotify demo
- Private single-administrator project CRUD using Supabase Auth
- Project cover upload, replacement, removal, and cleanup through Supabase Storage
- Responsive light/dark design with keyboard, focus, reduced-motion, chart-summary, and table accessibility work
- PostgreSQL Row Level Security for published public reads and Admin-only mutations

## V1 scope

- Public visitors do not need accounts.
- Admin access is limited to one configured and database-allowlisted user.
- Supabase stores project metadata and cover paths; analytical datasets, stories, dashboards, and onboarding remain code-driven.
- The Spotify dataset and findings are synthetic and illustrative, not real Spotify statistics.
- Dashboard composition is developer-configured; visual builders and public editing are outside V1.

## Suggested release

- **Tag:** `v1.0.0`
- **Title:** `databyloris v1.0.0`
