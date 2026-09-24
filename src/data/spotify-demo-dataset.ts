import type { DashboardConfiguration, DashboardRow } from "@/types/analytics";

interface TrackSeed {
  id: string;
  name: string;
  artistId: string;
  artistName: string;
  genre: string;
  baseStreams: number;
  basePopularity: number;
}

const tracks: readonly TrackSeed[] = [
  { id: "track-01", name: "Neon Signal", artistId: "artist-01", artistName: "Artist 01", genre: "Electronic", baseStreams: 940_000, basePopularity: 78 },
  { id: "track-02", name: "Afterlight", artistId: "artist-01", artistName: "Artist 01", genre: "Electronic", baseStreams: 760_000, basePopularity: 73 },
  { id: "track-03", name: "Paper Planes", artistId: "artist-02", artistName: "Artist 02", genre: "Pop", baseStreams: 820_000, basePopularity: 81 },
  { id: "track-04", name: "Night Shift", artistId: "artist-03", artistName: "Artist 03", genre: "Hip-Hop", baseStreams: 710_000, basePopularity: 75 },
  { id: "track-05", name: "Sol y Mar", artistId: "artist-04", artistName: "Artist 04", genre: "Latin", baseStreams: 650_000, basePopularity: 72 },
  { id: "track-06", name: "Open Skies", artistId: "artist-05", artistName: "Artist 05", genre: "Afrobeats", baseStreams: 510_000, basePopularity: 66 },
  { id: "track-07", name: "Parallel Lines", artistId: "artist-06", artistName: "Artist 06", genre: "Pop", baseStreams: 570_000, basePopularity: 68 },
  { id: "track-08", name: "Low Tide", artistId: "artist-07", artistName: "Artist 07", genre: "Hip-Hop", baseStreams: 460_000, basePopularity: 63 },
];

const countries = [
  { name: "Italy", multiplier: 0.82, genreBoost: "Electronic" },
  { name: "United States", multiplier: 1.28, genreBoost: "Hip-Hop" },
  { name: "Brazil", multiplier: 1.04, genreBoost: "Latin" },
  { name: "United Kingdom", multiplier: 0.94, genreBoost: "Electronic" },
] as const;

const annualGenreGrowth: Record<string, number> = {
  Electronic: 0.12,
  Latin: 0.09,
  Afrobeats: 0.08,
  "Hip-Hop": 0.045,
  Pop: 0.025,
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

export function generateSpotifyDemoDataset(): DashboardRow[] {
  const rows: DashboardRow[] = [];

  for (let year = 2022; year <= 2025; year += 1) {
    const yearIndex = year - 2022;

    for (let monthNumber = 1; monthNumber <= 12; monthNumber += 1) {
      const month = `${year}-${String(monthNumber).padStart(2, "0")}`;

      tracks.forEach((track, trackIndex) => {
        countries.forEach((country, countryIndex) => {
          const seasonalOffset =
            ((monthNumber * 7 + trackIndex * 3 + countryIndex * 5) % 11) - 5;
          const seasonalMultiplier = 1 + seasonalOffset * 0.018;
          const growthMultiplier =
            1 + annualGenreGrowth[track.genre] * yearIndex;
          const preferenceMultiplier =
            country.genreBoost === track.genre ? 1.22 : 1;
          const streams = Math.round(
            track.baseStreams *
              country.multiplier *
              seasonalMultiplier *
              growthMultiplier *
              preferenceMultiplier,
          );
          const listeners = Math.round(
            streams / (4.4 + ((trackIndex + countryIndex) % 4) * 0.45),
          );
          const popularity = clamp(
            Math.round(
              track.basePopularity + yearIndex * 2 + seasonalOffset * 0.7 +
                (country.genreBoost === track.genre ? 3 : 0),
            ),
            1,
            100,
          );
          const playlistReach = Math.round(
            listeners * (1.7 + ((monthNumber + trackIndex) % 5) * 0.16),
          );

          rows.push({
            date: `${month}-01`,
            month,
            year,
            trackId: track.id,
            trackName: track.name,
            artistId: track.artistId,
            artistName: track.artistName,
            genre: track.genre,
            country: country.name,
            streams,
            listeners,
            popularity,
            playlistReach,
          });
        });
      });
    }
  }

  return rows;
}

export const SPOTIFY_DEMO_ROWS = generateSpotifyDemoDataset();

export const SPOTIFY_DASHBOARD = {
  datasetLabel: "Synthetic Spotify listening demo",
  datasetDescription:
    "Deterministic illustrative data generated locally for product demonstration. It does not represent real Spotify activity or statistics.",
  synthetic: true,
  rows: SPOTIFY_DEMO_ROWS,
} satisfies DashboardConfiguration;
