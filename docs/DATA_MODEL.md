# Conceptual data model

This document defines product concepts and relationships. The current Admin MVP
persists core project metadata in Supabase; analytical modules and the public
catalog remain configuration-driven and local until a later migration.

## Current persistence boundary

- Supabase Auth identifies the private administrator.
- `admin_users` provides the database-level administrator allowlist.
- `projects` stores core catalog, publishing, and dataset metadata for Admin CRUD.
- Row Level Security limits anonymous reads to published records and mutations to
  database administrators.
- Administrator membership is provisioned out of band by adding the existing
  Supabase Auth user UUID to `admin_users`; no personal identifier is seeded by
  the repository.
- Public Home, Explore, and project pages still read `src/data/projects.ts`; they
  do not query Supabase yet.

## Project

The root publishing unit for one data analysis.

- Identity and presentation: title, slug, subtitle, description, category, and cover.
- Publishing: draft or published status.
- Analysis: main question, main visualization, final takeaways, and ordered project modules.
- Relationships: owns dataset metadata, KPIs, insights, story sections, and dashboard configuration.

Only published projects appear publicly.

## Dataset metadata

Describes the data behind a project without storing the analytical dataset itself.

- Name and summary.
- Source and attribution.
- Analytical grain.
- Time coverage and update context when applicable.
- Available dimensions, metrics, and optional attributes.
- Methodology and limitations.

A project has one primary dataset description in the initial model.

## KPI

A headline measure used in Overview or Explore.

- Label and formatted value.
- Optional context, comparison, or trend.
- Metric definition or source reference.
- Display order.

A project typically presents three to five KPIs. Values may depend on the active global dashboard filters.

## Insight

An authored analytical finding that bridges explanation and exploration.

- Title.
- Optional key value.
- Explanation.
- Supporting visualization configuration.
- Destination dashboard state.
- Display order.

Each insight belongs to a project. Its destination state maps to that project's dashboard filters and, when needed, a target visualization.

## Story section

An ordered editorial block in a project's narrative.

- Heading and narrative content.
- Optional supporting visualization or analytical module.
- Display order.

Story sections explain findings before users enter open-ended exploration.

## Dashboard configuration

Defines the reusable Explore experience for a project.

- Available global filters and their defaults.
- Ordered KPI, chart, ranking, comparison, and table modules.
- Per-module visualization and local-control configuration.
- Layout metadata needed for supported responsive compositions.

Configuration is developer-driven in the MVP. It should use shared analytics components and remain independent of the Spotify domain.

## Filter

Defines one selectable analytical constraint.

- Key and user-facing label.
- Scope: global dashboard or local visualization.
- Value type and allowed values or range.
- Default and active value.
- URL serialization key when shareable state is introduced.

Global filters affect all compatible dashboard modules. Local filters or controls affect only their owning module.

## Relationships

- A Project owns one Dataset metadata record.
- A Project owns ordered collections of KPIs, Insights, and Story sections.
- A Project owns one Dashboard configuration.
- A Dashboard configuration owns global Filters and ordered analytical modules.
- An analytical module may own local controls.
- An Insight references a supporting visualization and a valid destination state within its Project's Dashboard configuration.
