import { SPOTIFY_INSIGHTS } from "@/data/spotify-insights";
import { SPOTIFY_METHODOLOGY } from "@/data/spotify-methodology";
import { SPOTIFY_OVERVIEW } from "@/data/spotify-overview";
import { SPOTIFY_TOUR_STEPS } from "@/data/spotify-tour";

const dictionary = {
  navigation: {
    explore: "Explore", demo: "Demo", about: "About",
    primaryLabel: "Primary navigation", mobileLabel: "Mobile navigation",
    openMenu: "Open navigation menu", closeMenu: "Close navigation menu",
    skipToContent: "Skip to main content",
  },
  languageSwitcher: { label: "Language", english: "English", italian: "Italian" },
  theme: { switchTheme: "Switch color theme", switchToLight: "Switch to light theme", switchToDark: "Switch to dark theme" },
  footer: { description: "A modular platform for clear, interactive data stories.", navigationLabel: "Footer navigation" },
  home: {
    eyebrow: "Interactive Data Stories", title: "Explore what data has to say.",
    description: "Interactive analyses that turn real-world datasets into insights, stories and explorable dashboards.",
    exploreProjects: "Explore projects", tryDemo: "Try interactive demo",
    journey: ["Discover", "Understand", "Explore"],
    preview: {
      ariaLabel: "Illustrative analytics product preview", title: "Audience overview", updated: "Updated monthly", badge: "Illustrative preview",
      filtersLabel: "Dashboard filters",
      filters: [["Period", "Last 12 months"], ["Region", "All markets"], ["Segment", "All audiences"]],
      kpis: [{ label: "Sessions", value: "12.8M" }, { label: "Markets", value: "64" }, { label: "Growth", value: "+8.2%" }],
      trendTitle: "Engagement trend", trendContext: "Illustrative index", trendBadge: "Rising",
      chartSummary: "Illustrative line chart trending upward with minor variation", insightBadge: "Insight",
      insight: "Momentum strengthened across several audience segments in the latest period.",
    },
    featured: {
      eyebrow: "Featured analysis", title: "A data story built to be explored.", interactiveDemo: "Interactive demo", publishedProject: "Published project",
      metadataLabel: "Analysis metadata", exploreAnalysis: "Explore analysis", previewAria: "Illustrative analysis interface preview",
      previewTitle: "Analysis preview", previewContext: "Published project interface", signal: "Signal",
    },
    featuredInsights: {
      badge: "Demo preview", title: "Insights that invite a closer look.", description: "Illustrative interface content only—not verified Spotify findings.",
      items: [
        { value: "+42%", title: "Fastest-growing genre", description: "A sample growth signal presented as a concise analytical finding." },
        { value: "Top 10", title: "Artists concentrate a significant share of streams", description: "A preview of how rankings can reveal concentration in listening." },
        { value: "Global", title: "Listening preferences vary across markets", description: "A sample comparison that leads from an insight into exploration." },
      ],
    },
    howItWorksEyebrow: "How it works", howItWorksTitle: "From discovery to your own questions.",
    steps: [
      { number: "01", title: "Discover", description: "Find an analysis that interests you." },
      { number: "02", title: "Understand", description: "Follow the key findings and data story." },
      { number: "03", title: "Explore", description: "Use filters and visualizations to investigate the data yourself." },
    ],
    finalEyebrow: "Continue exploring", finalTitle: "Ready to explore the data?",
  },
  explore: {
    eyebrow: "Project catalog", title: "Explore data stories", description: "Discover interactive analyses built from real-world datasets.",
    catalog: {
      searchLabel: "Search projects", searchPlaceholder: "Search titles, topics or tags", categoryLabel: "Filter by category", allCategories: "All",
      projectSingular: "project", projectPlural: "projects", emptyTitle: "No projects found",
      emptyDescription: "Try a different search or reset the category filter to see every project.", resetFilters: "Reset filters",
      interactiveDemo: "Interactive demo", exploreProject: "Explore project", exploreProjectAriaPrefix: "Explore", tagsSuffix: "tags",
      coverUnavailable: "project cover unavailable", coverLabel: "Project cover", coverAlt: "project cover",
      coverLabels: { listening: "Listening signals", catalog: "Catalog composition", market: "Market movement", geography: "Travel flows", economy: "Digital adoption", generic: "Data signals" },
    },
  },
  about: {
    badge: "About databyloris", title: "Data analysis should be explored, not just presented.",
    description: "databyloris transforms datasets into interactive stories, clear insights and explorable dashboards—so the path from a question to the underlying evidence remains visible.",
    philosophyEyebrow: "Product philosophy", philosophyTitle: "Discover → Understand → Explore",
    philosophyDescription: "Each project moves from an accessible entry point to a guided explanation, then opens the same analysis for independent exploration.",
    philosophy: [
      { number: "01", title: "Discover", description: "Start with a real-world question and find an analysis worth investigating." },
      { number: "02", title: "Understand", description: "Follow the context, evidence and key findings through a clear editorial story." },
      { number: "03", title: "Explore", description: "Use the interactive dashboard to test the story and investigate your own questions." },
    ],
    contentsEyebrow: "Inside every project", contentsTitle: "One analysis, multiple ways to understand it.",
    contentsDescription: "The structure stays consistent so visitors can move confidently from orientation to evidence without learning a new interface each time.",
    contents: [
      { title: "Context", description: "The question, dataset and background needed to frame the analysis." },
      { title: "KPIs", description: "A concise view of the measures that define the current data context." },
      { title: "Data stories", description: "Authored insights that connect patterns to supporting visual evidence." },
      { title: "Interactive exploration", description: "Filters, comparisons and detailed views for investigating the data directly." },
      { title: "Methodology", description: "Transparent definitions, preparation choices, techniques and limitations." },
    ],
    purposeEyebrow: "Why databyloris exists", purposeTitle: "Clarity should not end at the chart.",
    purposeParagraphs: ["Data analysis is easier to trust when the question, definitions and limitations remain close to the result.", "databyloris is designed to make analysis understandable, explorable and transparent—combining guided storytelling with the freedom to inspect the data from another angle."],
    creatorEyebrow: "About the creator", creatorTitle: "Designed and built by Loris.",
    creatorDescription: "The platform is part of Loris’s work in Data Analysis and analytics product development, exploring how analytical rigor and thoughtful product design can make data more useful to more people.",
    ctaEyebrow: "Continue", ctaTitle: "Explore the stories behind the data.", ctaLabel: "Explore data stories",
  },
  projectNavigation: { label: "Project sections", overview: "Overview", insights: "Insights", explore: "Explore", methodology: "Methodology" },
  project: {
    hero: { interactiveDemo: "Interactive demo", mainQuestion: "Main question", startExploring: "Start exploring" },
    cover: { unavailable: "project cover unavailable", label: "Project cover", alt: "project cover" },
    dataset: { eyebrow: "Dataset snapshot", demoMetadata: "Demo metadata", period: "Period", records: "Records", entities: "Entities", categories: "Categories", markets: "Markets", grain: "Grain", source: "Source" },
    overview: {
      eyebrow: "Overview", title: "Start with the question", glance: "At a glance", snapshot: "Demo performance snapshot", disclaimer: "All values are illustrative demo data.", demoBadge: "Demo",
      kpiAria: "Overview key performance indicators", illustrativeData: "Illustrative data", annualValuesAria: "Illustrative annual streaming values", illustrativeStreams: "illustrative streams",
      takeaway: "Top takeaway", takeawayDisclaimer: "Illustrative interpretation for the Spotify demo—not a verified Spotify finding.",
      previewEyebrow: "Insight preview", previewTitle: "Three patterns worth investigating", previewDescription: "These illustrative signals preview how the full story will move from a finding into supporting evidence.",
      insightBadge: "Demo insight", exploreInsight: "Explore insight", exploreInsightAria: "Explore insight",
      continueText: "Continue into the authored story to understand what may be driving these demo patterns.", continueCta: "Explore the key insights",
    },
    insights: {
      eyebrow: "Insights", badge: "Illustrative demo stories", title: "Four questions behind the listening story", storyBadge: "Illustrative story", takeaway: "Takeaway",
      explore: "Explore this insight", exploreAria: "Explore this insight", demoData: "Demo data", growth: "Growth", popularityNote: "Popularity shown as a separate 0–100 index",
      popularity: "Popularity", genreLegend: "Genre legend", lifecycleLegend: "Lifecycle pattern legend", curiosity: "Did you know?",
    },
    explore: { eyebrow: "Explore", title: "Investigate your own questions", description: "Apply global filters to update the current data selection, headline measures, visual analysis and track detail together.", syntheticBadge: "Synthetic demo dataset", loading: "Preparing the interactive demo workspace…" },
    methodology: {
      eyebrow: "Methodology", badge: "Synthetic demo analysis", objectiveEyebrow: "Analysis objective", objectiveTitle: "What this demo examines",
      datasetEyebrow: "Dataset", datasetTitle: "A controlled analytical foundation", grain: "Grain", period: "Period", dimensions: "Main dimensions", metrics: "Main metrics",
      preparationEyebrow: "Data preparation", preparationTitle: "Built to remain reproducible", approachEyebrow: "Analysis approach", approachTitle: "Six complementary techniques",
      metricsEyebrow: "Metrics", metricsTitle: "How to read the measures", toolsEyebrow: "Tools / Architecture", toolsTitle: "The implementation behind the demo",
      limitationsEyebrow: "Limitations", limitationsTitle: "What this analysis cannot claim", takeawaysEyebrow: "Final takeaways", takeawaysTitle: "What the product experience demonstrates",
    },
    generic: { availableMetadata: "Available metadata", published: "Published", availability: "Project availability", comingTitle: "Interactive analysis is coming later.", comingDescription: "Interactive analysis for this project is not available yet. This page intentionally shows only its published metadata; no findings or visualizations have been inferred." },
  },
  dashboard: {
    locale: "en-US",
    filterLabels: { period: "Period", country: "Country", genre: "Genre", artist: "Artist" },
    allLabels: { period: "All periods", country: "All countries", genre: "All genres", artist: "All artists" },
    modules: { "streaming-trend": "Streaming Trend", "top-artists": "Top Artists", "genre-distribution": "Genre Distribution", "genre-growth": "Genre Growth", "artist-comparison": "Artist Comparison", "track-table": "Track Table" },
    moduleAriaSuffix: "dashboard module", insightFocus: "Insight focus", filtersAria: "Dashboard filters and active selection", showing: "Showing:", allData: "All data", recordsOf: "of", records: "records", demoBadge: "Demo",
    kpis: { totalStreams: "Total Streams", uniqueListeners: "Unique Listeners", topArtist: "Top Artist", topGenre: "Top Genre", selectionContext: "Across the current synthetic selection", listenerContext: "Illustrative additive listener cohorts", rankingContext: "Ranked by illustrative streams" },
    noDataEyebrow: "No matching data", noDataTitle: "This filter combination has no records.", noDataDescription: "Try changing one of the active dimensions or reset the dashboard to return to the complete synthetic dataset.",
    resetFilters: "Reset filters", globalFilters: "Global filters", active: "active",
    charts: {
      streams: "Streams", growthLabel: "Growth", totalStreamsSuffix: "total streams", total: "total",
      trend: { eyebrow: "Streaming trend", title: "How is streaming activity changing over time?", description: "Monthly illustrative streams for the current global selection.", insufficient: "Select a period containing at least two months to show a trend." },
      artists: { eyebrow: "Artist ranking", title: "Which artists lead the current selection?", description: "Ranked by illustrative streams.", sizeAria: "Artist ranking size", top: "Top" },
      genres: { eyebrow: "Genre distribution", title: "Which genres account for the most listening?", description: "Share of illustrative streams in the current selection.", percent: "percent" },
      growth: { eyebrow: "Relative growth", title: "Which genres are growing fastest?", readyDescription: "{start} versus {end}. Growth is distinct from total popularity.", defaultDescription: "Compares the first and last month available in the current selection.", growthSuffix: "growth", insufficientPeriod: "Select at least two months to compare genre growth.", insufficientComparison: "The current selection has no genres with data in both boundary months." },
      comparison: { eyebrow: "Artist comparison", title: "How do two artists compare?", description: "Uses the global period, country, and genre. The global artist filter stays independent.", artistA: "Artist A", artistB: "Artist B", metric: "Metric", totalStreams: "Total Streams", uniqueListeners: "Unique Listeners", averagePopularity: "Average Popularity", playlistReach: "Playlist Reach", insufficient: "At least two artists must be available after applying period, country, and genre filters." },
      table: { eyebrow: "Track detail", title: "How does the selection break down by track?", description: "Aggregated from the current filtered records. Select a column heading to sort.", regionAria: "Track results; scroll horizontally to view all columns", caption: "Aggregated tracks in the current dashboard selection", track: "Track", artist: "Artist", genre: "Genre", streams: "Streams", listeners: "Listeners", popularity: "Popularity", page: "Page", of: "of", tracks: "tracks", paginationAria: "Track table pagination", previousAria: "Previous track table page", nextAria: "Next track table page", previous: "Previous", next: "Next" },
    },
  },
  onboarding: {
    promptTitle: "Explore this data story", promptDescription: "Learn how to read insights, use filters and explore the dashboard.", promptMeta: "About 1 minute", start: "Start guided tour", dismiss: "Explore on my own",
    completeTitle: "You’re ready to explore", completeDescription: "Use filters, rankings and insights to discover your own patterns in the data.", exploreFreely: "Explore freely", guidedTour: "Guided tour",
    stepOf: "of", skip: "Skip tour", instruction: "Complete the highlighted action to continue", back: "Back", next: "Next", focus: "Focus highlighted control",
  },
  spotify: {
    dataset: {
      name: "Spotify listening trends demo dataset", summary: "An illustrative streaming dataset configured to demonstrate the project story and exploration experience.", entities: "Artists and tracks", categories: "Genres", markets: "Countries",
      dashboardLabel: "Synthetic Spotify listening demo · one track × one country × one month", dashboardDescription: "Generated deterministically for 2022–2025. Values are illustrative and do not represent real Spotify statistics.",
    },
    overview: SPOTIFY_OVERVIEW, insights: SPOTIFY_INSIGHTS, methodology: SPOTIFY_METHODOLOGY, tourSteps: SPOTIFY_TOUR_STEPS,
  },
} as const;

export default dictionary;
