# Roadmap

Each phase should leave the application usable and avoid pulling later infrastructure into earlier work.

## V1 delivery status

Phases 0–16 are complete. Phase 17 release preparation is complete; tagging and
publishing the release remain explicit manual steps. Items under **Explicitly
out of scope** remain future work.

## 0. Repository and documentation

- Establish the source structure and project conventions.
- Record the product, UI, conceptual data model, and delivery plan.

## 1. Application foundation

- Set up shared types, project configuration boundaries, and core utilities.
- Preserve the Next.js App Router, TypeScript, Tailwind CSS, and minimal dependency baseline.

## 2. Design system

- Define tokens, typography, spacing, controls, and reusable content primitives.
- Establish component states and accessibility conventions.

## 3. Light/dark theme

- Implement semantic theme tokens and theme switching.
- Validate equivalent contrast and chart legibility in both themes.

## 4. App shell and navigation

- Build responsive global navigation and page framing.
- Establish public routes for Home, Explore Projects, Project, Interactive Demo, and About.

## 5. Home

- Introduce the platform and surface routes into project discovery.
- Keep the page focused on data storytelling rather than personal portfolio content.

## 6. Explore Projects

- Build the published-project browsing experience.
- Use project metadata rather than topic-specific markup.

## 7. Reusable project architecture

- Implement the shared project structure and configuration model.
- Create reusable story and analytics component boundaries.

## 8. Spotify Overview

- Populate the demo hero, main question, dataset snapshot, KPIs, main visualization, and takeaways.

## 9. Spotify Insights

- Add authored insights, explanations, and supporting visualizations.
- Prepare each insight's destination dashboard state.

## 10. Interactive Dashboard

- Implement global filters, visualization-local controls, and reusable Explore modules.
- Support Period, Country, Genre, and Artist filters for the demo.

## 11. Insight → Dashboard state

- Connect each insight to its preconfigured Explore state.
- Represent shareable dashboard state in the URL.

## 12. Guided onboarding

- Add the optional, approximately five-step tour to the demo only.
- Drive the tour through real KPIs, insights, filters, and charts.

## 13. Admin authentication

- Add private authentication for the single administrator.
- Keep public exploration unauthenticated.

## 14. Admin project management

- Add create, edit, publish, unpublish, and remove workflows.
- Limit editing to core metadata, dataset metadata, editorial content, cover, and status.

## 15. Responsive/accessibility refinement

- Test mobile dashboard composition, keyboard use, focus behavior, themes, contrast, and chart alternatives.

## 16. Testing and cleanup

- Run proportionate validation for configuration, state transitions, routes, and critical interactions.
- Remove dead code and resolve performance or accessibility regressions.

## 17. README and first release

- Document setup, architecture, content workflow, and deployment expectations.
- Complete release checks and publish the first usable version.

## Explicitly out of scope

- Drag-and-drop dashboard building.
- Public accounts, authentication, uploads, or editing.
- Database and authentication work before their roadmap phases.
- Hardcoding shared architecture around Spotify.
- Product features beyond the described public project experience and minimal admin scope.
