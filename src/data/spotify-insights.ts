import type { ProjectInsightsData } from "@/types/analytics";

export const SPOTIFY_INSIGHTS = {
  introduction:
    "Four illustrative stories show how the same listening dataset can reveal concentration, momentum, local preferences and very different paths to popularity.",
  disclaimer:
    "Every value in this section is illustrative demo content and is not a verified Spotify statistic.",
  stories: [
    {
      id: "artist-concentration",
      label: "Artist concentration",
      question: "Which artists dominate listening?",
      explanation:
        "A small group of artists accounts for a disproportionate share of demo streams. The leading artist stands apart, while the remaining audience is distributed across a much longer tail.",
      takeaway:
        "In this illustrative sample, the top artist captures 12.4% of streams and the top ten together account for 38%.",
      layout: "text-left",
      exploreState: {
        target: "top-artists",
      },
      visualization: {
        type: "ranking",
        title: "Top artists by stream share",
        context: "Share of illustrative demo streams",
        summary:
          "Artist 01 leads with 12.4 percent of demo streams, followed by Artist 02 at 6.8 percent. The next three artists each hold less than five percent.",
        items: [
          { label: "Artist 01", value: 12.4, displayValue: "12.4%" },
          { label: "Artist 02", value: 6.8, displayValue: "6.8%" },
          { label: "Artist 03", value: 4.9, displayValue: "4.9%" },
          { label: "Artist 04", value: 4.1, displayValue: "4.1%" },
          { label: "Artist 05", value: 3.1, displayValue: "3.1%" },
        ],
      },
    },
    {
      id: "genre-growth",
      label: "Genre growth",
      question: "Which genres are growing fastest?",
      explanation:
        "Growth and popularity answer different questions. Electronic grows fastest in the demo period, while Pop remains the largest category by the separate popularity index.",
      takeaway:
        "The fastest-growing genre is not necessarily the most popular: Electronic rises 42% while Pop retains the highest demo popularity index.",
      layout: "text-right",
      exploreState: {
        target: "genre-growth",
      },
      visualization: {
        type: "growth",
        title: "Genre momentum versus popularity",
        context: "Demo-period growth and illustrative popularity index",
        summary:
          "Electronic has the highest illustrative growth at 42 percent with a popularity index of 64. Pop grows 8 percent but has the highest popularity index at 100.",
        items: [
          { label: "Electronic", growth: 42, displayGrowth: "+42%", popularityIndex: 64 },
          { label: "Latin", growth: 31, displayGrowth: "+31%", popularityIndex: 78 },
          { label: "Afrobeats", growth: 27, displayGrowth: "+27%", popularityIndex: 55 },
          { label: "Hip-Hop", growth: 14, displayGrowth: "+14%", popularityIndex: 85 },
          { label: "Pop", growth: 8, displayGrowth: "+8%", popularityIndex: 100 },
        ],
      },
    },
    {
      id: "market-differences",
      label: "Market differences",
      question: "Do different countries listen differently?",
      explanation:
        "The same genres appear across markets, but their relative weight changes. Local preference reshapes the ranking even when the overall catalog is shared.",
      takeaway:
        "Three different genres lead across the four demo markets, and Electronic's share varies by 1.8× between Brazil and the United Kingdom.",
      layout: "full",
      exploreState: {
        filters: {
          country: "Brazil",
        },
        target: "genre-distribution",
      },
      visualization: {
        type: "market-comparison",
        title: "Genre mix by market",
        context: "Share of illustrative streams within each market",
        summary:
          "Electronic leads in Italy and the United Kingdom, Hip-Hop leads in the United States, and Latin leads in Brazil. Electronic ranges from 20 percent in Brazil to 36 percent in the United Kingdom.",
        categories: ["Electronic", "Latin", "Hip-Hop", "Other"],
        markets: [
          {
            label: "Italy",
            highlight: "Electronic leads · 30%",
            values: [
              { category: "Electronic", value: 30 },
              { category: "Latin", value: 28 },
              { category: "Hip-Hop", value: 18 },
              { category: "Other", value: 24 },
            ],
          },
          {
            label: "United States",
            highlight: "Hip-Hop leads · 38%",
            values: [
              { category: "Electronic", value: 24 },
              { category: "Latin", value: 17 },
              { category: "Hip-Hop", value: 38 },
              { category: "Other", value: 21 },
            ],
          },
          {
            label: "Brazil",
            highlight: "Latin leads · 44%",
            values: [
              { category: "Electronic", value: 20 },
              { category: "Latin", value: 44 },
              { category: "Hip-Hop", value: 20 },
              { category: "Other", value: 16 },
            ],
          },
          {
            label: "United Kingdom",
            highlight: "Electronic leads · 36%",
            values: [
              { category: "Electronic", value: 36 },
              { category: "Latin", value: 14 },
              { category: "Hip-Hop", value: 25 },
              { category: "Other", value: 25 },
            ],
          },
        ],
      },
    },
    {
      id: "hit-lifecycle",
      label: "Hit lifecycle",
      question: "How long does a hit stay popular?",
      explanation:
        "Tracks can reach and retain attention in very different ways. Some peak immediately, some build through discovery, and others sustain a steady audience over time.",
      takeaway:
        "The illustrative patterns show that peak size alone does not explain longevity: shape and retention matter too.",
      layout: "text-left",
      exploreState: {
        filters: {
          artist: "Artist 01",
        },
        target: "streaming-trend",
      },
      visualization: {
        type: "lifecycle",
        title: "Three paths through a hit's lifecycle",
        context: "Illustrative popularity index over eight weeks",
        summary:
          "The instant hit starts at 95 and declines to 19. The slow burner rises from 20 to a peak of 91 before easing. The evergreen remains stable between 61 and 67.",
        labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"],
        series: [
          {
            label: "Instant hit",
            description: "Peaks early, then fades",
            values: [95, 84, 68, 52, 40, 31, 24, 19],
          },
          {
            label: "Slow burner",
            description: "Builds through discovery",
            values: [20, 31, 45, 61, 78, 91, 86, 76],
          },
          {
            label: "Evergreen",
            description: "Retains steady attention",
            values: [62, 64, 61, 66, 63, 65, 64, 67],
          },
        ],
      },
    },
  ],
  curiosity: {
    title: "Three genres, four market leaders",
    text: "Did you know? In this illustrative demo, Electronic, Hip-Hop and Latin each rank first in at least one of the four sample markets.",
  },
} satisfies ProjectInsightsData;
