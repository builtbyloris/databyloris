import type {DashboardRecord} from "@/types";

export type VideoGameSalesRecord = DashboardRecord & {
  id: string;
  name: string;
  platform: string;
  year: number;
  genre: string;
  publisher: string;
  region: string;
  sales: number;
};

const regions = ["North America", "Europe", "Japan", "Other"] as const;

interface GameSeed {
  id: string;
  name: string;
  platform: string;
  year: number;
  genre: string;
  publisher: string;
  sales: readonly [number, number, number, number];
}

const games: GameSeed[] = [
  {id: "wii-sports", name: "Wii Sports", platform: "Wii", year: 2006, genre: "Sports", publisher: "Nintendo", sales: [41.49, 29.02, 3.77, 8.46]},
  {id: "mario-kart-wii", name: "Mario Kart Wii", platform: "Wii", year: 2008, genre: "Racing", publisher: "Nintendo", sales: [15.85, 12.88, 3.79, 3.31]},
  {id: "wii-sports-resort", name: "Wii Sports Resort", platform: "Wii", year: 2009, genre: "Sports", publisher: "Nintendo", sales: [15.75, 11.01, 3.28, 2.96]},
  {id: "pokemon-red-blue", name: "Pokémon Red / Blue", platform: "Game Boy", year: 1996, genre: "Role-Playing", publisher: "Nintendo", sales: [11.27, 8.89, 10.22, 1.00]},
  {id: "tetris", name: "Tetris", platform: "Game Boy", year: 1989, genre: "Puzzle", publisher: "Nintendo", sales: [23.20, 2.26, 4.22, 0.58]},
  {id: "new-super-mario-bros", name: "New Super Mario Bros.", platform: "Nintendo DS", year: 2006, genre: "Platform", publisher: "Nintendo", sales: [11.38, 9.23, 6.50, 2.90]},
  {id: "gta-v-ps3", name: "Grand Theft Auto V", platform: "PlayStation 3", year: 2013, genre: "Action", publisher: "Take-Two Interactive", sales: [7.02, 9.09, 0.98, 3.96]},
  {id: "minecraft-x360", name: "Minecraft", platform: "Xbox 360", year: 2013, genre: "Sandbox", publisher: "Microsoft Studios", sales: [5.58, 2.83, 0.02, 0.77]},
  {id: "skyrim-x360", name: "The Elder Scrolls V: Skyrim", platform: "Xbox 360", year: 2011, genre: "Role-Playing", publisher: "Bethesda Softworks", sales: [5.03, 2.86, 0.10, 0.85]},
  {id: "fifa-18-ps4", name: "FIFA 18", platform: "PlayStation 4", year: 2017, genre: "Sports", publisher: "Electronic Arts", sales: [1.27, 8.64, 0.15, 1.73]},
  {id: "cod-mw3-x360", name: "Call of Duty: Modern Warfare 3", platform: "Xbox 360", year: 2011, genre: "Shooter", publisher: "Activision", sales: [9.03, 4.28, 0.13, 1.32]},
  {id: "animal-crossing-new-horizons", name: "Animal Crossing: New Horizons", platform: "Nintendo Switch", year: 2020, genre: "Simulation", publisher: "Nintendo", sales: [10.63, 7.01, 10.45, 3.20]},
];

export const videoGameSalesData: VideoGameSalesRecord[] = games.flatMap((game) =>
  regions.map((region, index) => ({
    id: `${game.id}-${region.toLowerCase().replaceAll(" ", "-")}`,
    name: game.name,
    platform: game.platform,
    year: game.year,
    genre: game.genre,
    publisher: game.publisher,
    region,
    sales: game.sales[index],
  })),
);
