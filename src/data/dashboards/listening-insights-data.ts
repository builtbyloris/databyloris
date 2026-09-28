import type {DashboardRecord} from "@/types";

export type ListeningInsightRecord = DashboardRecord & {
  id: string;
  date: string;
  month: string;
  track: string;
  artist: string;
  album: string;
  genre: string;
  country: string;
  device: string;
  minutesListened: number;
  streams: number;
};

// Grain: one row represents an aggregated daily listening session for one track and device.
interface TrackSeed {
  track: string;
  artist: string;
  album: string;
  genre: string;
  duration: number;
  baseStreams: number;
}

const tracks: TrackSeed[] = [
  {track: "Midnight Signals", artist: "Nova Vale", album: "After Hours", genre: "Electronic", duration: 3.8, baseStreams: 10},
  {track: "Parallel Lines", artist: "The Northbound", album: "Open Maps", genre: "Indie", duration: 4.1, baseStreams: 7},
  {track: "Still Water", artist: "Elara", album: "Soft Focus", genre: "Ambient", duration: 5.2, baseStreams: 6},
  {track: "Neon Weather", artist: "Kairo Bloom", album: "Color Theory", genre: "Pop", duration: 3.4, baseStreams: 9},
  {track: "Blue Hour", artist: "Nova Vale", album: "After Hours", genre: "Electronic", duration: 4.3, baseStreams: 8},
  {track: "Paper Satellites", artist: "The Northbound", album: "Open Maps", genre: "Indie", duration: 3.7, baseStreams: 6},
  {track: "Afterglow", artist: "Mina Sol", album: "Velvet Room", genre: "R&B", duration: 3.9, baseStreams: 8},
  {track: "Quiet Machines", artist: "Orbit Glass", album: "Low Gravity", genre: "Electronic", duration: 4.8, baseStreams: 7},
  {track: "Summer Static", artist: "Kairo Bloom", album: "Color Theory", genre: "Pop", duration: 3.2, baseStreams: 9},
  {track: "Long Way Home", artist: "Cedar Lane", album: "North of Here", genre: "Folk", duration: 4.5, baseStreams: 5},
  {track: "Velvet Room", artist: "Mina Sol", album: "Velvet Room", genre: "R&B", duration: 4.0, baseStreams: 7},
  {track: "First Light", artist: "Elara", album: "Soft Focus", genre: "Ambient", duration: 5.5, baseStreams: 5},
  {track: "City Echoes", artist: "Arlo West", album: "Street Level", genre: "Hip-Hop", duration: 3.6, baseStreams: 8},
  {track: "Slow Orbit", artist: "Orbit Glass", album: "Low Gravity", genre: "Electronic", duration: 4.6, baseStreams: 6},
  {track: "Open Roads", artist: "Cedar Lane", album: "North of Here", genre: "Folk", duration: 4.2, baseStreams: 5},
];

const months = ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06"];
const devices = ["Mobile", "Desktop", "Smart speaker", "Tablet"];
const countries = ["Italy", "United Kingdom", "United States", "Germany"];
const completionFactors = [0.94, 0.82, 0.98, 0.88];

export const listeningInsightsData: ListeningInsightRecord[] = tracks.flatMap((track, trackIndex) =>
  Array.from({length: 4}, (_, sessionIndex) => {
    const month = months[(trackIndex + sessionIndex * 2) % months.length];
    const streams = track.baseStreams + sessionIndex * 2 + (trackIndex % 3);
    const day = String(4 + ((trackIndex * 3 + sessionIndex * 5) % 23)).padStart(2, "0");

    return {
      id: `session-${String(trackIndex + 1).padStart(2, "0")}-${sessionIndex + 1}`,
      date: `${month}-${day}`,
      month,
      track: track.track,
      artist: track.artist,
      album: track.album,
      genre: track.genre,
      country: countries[(trackIndex + sessionIndex) % countries.length],
      device: devices[(trackIndex + sessionIndex) % devices.length],
      minutesListened: Math.round(streams * track.duration * completionFactors[sessionIndex]),
      streams,
    };
  }),
);
