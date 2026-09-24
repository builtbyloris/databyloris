import type { ProjectOverviewData } from "@/types/analytics";

export const SPOTIFY_OVERVIEW = {
  context:
    "This illustrative demo explores how listening behavior changes across time, artists, genres and markets, creating a clear path from a headline pattern to deeper questions.",
  kpis: [
    {
      label: "Total Streams",
      value: "156M",
      context: "2025 illustrative total",
      trend: {
        value: "+19%",
        context: "compared with 2024",
      },
    },
    {
      label: "Unique Listeners",
      value: "24.8M",
      context: "Illustrative 2025 audience",
      trend: {
        value: "+12%",
        context: "compared with 2024",
      },
    },
    {
      label: "Top Artist",
      value: "Artist 01",
      context: "12.4% of demo streams",
    },
    {
      label: "Fastest-Growing Genre",
      value: "Electronic",
      context: "Illustrative demo category",
      trend: {
        value: "+42%",
        context: "across the demo period",
      },
    },
  ],
  trend: {
    id: "spotify-streaming-trend",
    eyebrow: "Streaming trend",
    title: "How has streaming activity changed over time?",
    context: "Annual streams · illustrative demo values",
    summary:
      "Illustrative annual streams rise from 82 million in 2022 to 156 million in 2025, with growth in every year shown.",
    points: [
      { label: "2022", value: 82, displayValue: "82M" },
      { label: "2023", value: 104, displayValue: "104M" },
      { label: "2024", value: 131, displayValue: "131M" },
      { label: "2025", value: 156, displayValue: "156M" },
    ],
    yAxis: {
      minimum: 60,
      maximum: 160,
      ticks: [
        { value: 80, label: "80M" },
        { value: 120, label: "120M" },
        { value: 160, label: "160M" },
      ],
    },
  },
  takeaway:
    "In this illustrative dataset, streaming activity shows sustained growth across the demo period, but growth is not evenly distributed across genres and markets.",
  insights: [
    {
      label: "Artist concentration",
      value: "Top 10",
      title: "A small group leads listening",
      interpretation:
        "The ten leading demo artists account for 38% of illustrative streams, suggesting a concentrated top tier.",
      href: "#insights",
    },
    {
      label: "Genre momentum",
      value: "+42%",
      title: "Electronic grows fastest",
      interpretation:
        "Electronic shows the strongest illustrative growth across the demo period, ahead of the other sample genres.",
      href: "#insights",
    },
    {
      label: "Geographic differences",
      value: "1.8×",
      title: "Genre mix changes by market",
      interpretation:
        "The leading genre's share varies by up to 1.8× across the illustrative markets in this demo.",
      href: "#insights",
    },
  ],
} satisfies ProjectOverviewData;
