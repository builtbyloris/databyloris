# Product specification

## Purpose

`databyloris` is a modular web platform for publishing interactive data analysis projects. It is not a personal portfolio. The experience follows two related principles:

- User journey: **Discover → Understand → Explore**
- Project flow: **Story → Explore**

Projects explain their important findings before giving users tools to investigate the data.

## Users and permissions

### Public visitor

- Browse and explore published projects without authentication.
- Read project stories, inspect insights, and interact with dashboards.
- Cannot upload, edit, publish, or manage data or projects.

### Administrator

- One private administrator.
- Can create, edit, publish, unpublish, and remove projects.
- MVP editing covers title, slug, subtitle, description, category, cover, dataset metadata, editorial content, and draft/published status.

## Public information architecture

- **Home:** introduce the platform and lead into project discovery.
- **Explore Projects:** browse published projects.
- **Project:** a reusable project experience with Overview, Insights, Explore, and Methodology sections.
- **Interactive Demo:** demonstrate the platform through a real project experience.
- **About:** explain the platform and its approach.

## Standard project experience

Every project uses a shared core structure, with optional modules when the analysis requires them:

1. Project Hero
2. Main Question
3. Dataset Snapshot
4. Three to five KPIs
5. Main Visualization
6. Data Story sections
7. Key Insights
8. Interactive Explore dashboard
9. Dataset information
10. Methodology
11. Limitations
12. Final takeaways

Project content and analytics must be data-driven. Do not couple the platform architecture to one dataset or topic.

## Insight-to-exploration flow

An insight presents a title, an optional key value, an explanation, a supporting visualization, and a destination dashboard state. Selecting **Explore this insight** opens the project's Explore dashboard with the relevant global filters and visualization state applied.

Dashboard state should eventually be URL-representable so a filtered exploration or insight can be shared.

## Demo project

**Spotify Listening Trends** demonstrates the platform, onboards new visitors, and otherwise behaves like a real analysis project.

- Approximate grain: one track × one country × one month.
- Dimensions: date, track, artist, genre, and country.
- Metrics: streams, listeners, popularity, and playlist reach.
- Optional audio attributes: danceability, energy, tempo, duration, and explicit status.
- Dashboard filters: Period, Country, Genre, and Artist.

The demo stories cover:

1. How streaming changes over time.
2. Which artists dominate.
3. Which genres are growing.
4. How listening differs by country.
5. How hit popularity evolves over time.

## Guided onboarding

Only the Spotify demo includes onboarding. The tour is optional, uses the real interface, and takes approximately five steps:

1. Understand KPIs.
2. Open an insight.
3. Follow the insight into its dashboard state.
4. Change a real filter.
5. Interact with a chart.

## MVP boundaries

- Dashboard composition is developer/configuration driven.
- No drag-and-drop dashboard builder.
- No public accounts or authentication.
- No public upload, editing, or data-management tools.
- Admin authentication and persistence are later roadmap phases, not part of the current foundation.
