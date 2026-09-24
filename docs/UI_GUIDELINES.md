# UI guidelines

## Visual direction

Use a modern analytics SaaS language with a restrained futuristic character. The interface should feel analytical rather than like a portfolio or a traditional enterprise BI tool.

- Treat light and dark themes as equal, intentional experiences.
- Use indigo, violet, and electric blue as restrained accents.
- Prefer clean borders, strong typography, and minimal shadows.
- Reserve subtle glow for focus or emphasis; avoid decorative effects.
- Avoid excessive gradients, visual clutter, and ornamental chrome.
- Keep charts as the primary visual focus.

## Information density

- **Story surfaces:** spacious, editorial, and optimized for sequential reading.
- **Explore surfaces:** denser, scannable, and optimized for comparison and interaction.
- Maintain clear hierarchy between context, findings, controls, and visualizations.
- Do not sacrifice labels, units, sources, or explanatory context for visual minimalism.

## Themes

- Define colors through semantic tokens rather than component-specific literals.
- Maintain sufficient contrast in both themes, including muted text, borders, chart marks, focus states, and disabled controls.
- Ensure data series remain distinguishable without relying on glow or background color.
- Test charts and interactive states independently in light and dark modes.

## Responsive behavior

- Design for desktop and mobile from the start.
- Recompose dashboards on small screens: stack filters, KPIs, charts, and supporting content in a deliberate reading order.
- Do not reproduce desktop dashboards by uniformly shrinking them.
- Keep primary actions and active filter state visible and understandable.
- Allow tables and dense visualizations to use appropriate overflow or simplified mobile presentations without hiding essential meaning.

## Dashboard interaction

- Global filters affect the entire dashboard and must be visually separated from local chart controls.
- Local controls affect only their owning visualization.
- Make filter scope, active values, and reset behavior explicit.
- Preserve a stable layout while data or filters update.
- Insight links must open Explore with the intended state already applied.
- Design dashboard state so it can later be serialized into the URL.

## Component principles

Build reusable, composable analytics components rather than project-specific variants. Planned primitives include:

- KPI Card
- Insight Card
- Chart Card
- Line Chart
- Bar Chart
- Ranking
- Comparison
- Data Table
- Filter Bar
- Story Section
- Dataset Snapshot

Components should accept content, formatting, and analytical configuration through typed props. Spotify-specific language and assumptions belong in project data or configuration, not shared UI.

## Accessibility

- Meet keyboard navigation and visible focus requirements for every interactive control.
- Use semantic HTML and meaningful headings, labels, names, and descriptions.
- Never communicate meaning through color alone; pair it with text, shape, pattern, or position.
- Provide text alternatives or summaries for charts and other non-text analysis.
- Respect reduced-motion preferences and avoid motion that is required to understand content.
- Use touch targets and spacing suitable for mobile interaction.
- Keep the onboarding tour optional, dismissible, and operable with assistive technology.
