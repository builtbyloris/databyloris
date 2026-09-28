import type {DashboardRecord} from "@/types";

export type RetailPulseRecord = DashboardRecord & {
  id: string;
  month: string;
  city: string;
  category: string;
  channel: string;
  revenue: number;
  orders: number;
  customers: number;
  units: number;
};

// Grain: one row represents monthly aggregated retail activity for one city, category and sales channel.
const cities = [
  {name: "Milano", factor: 1.2},
  {name: "Roma", factor: 1.12},
  {name: "Torino", factor: 0.94},
  {name: "Bologna", factor: 0.88},
  {name: "Firenze", factor: 0.82},
];

const categories = [
  {name: "Electronics", baseRevenue: 18400, averageOrder: 118},
  {name: "Home", baseRevenue: 13900, averageOrder: 82},
  {name: "Beauty", baseRevenue: 9800, averageOrder: 54},
  {name: "Sports", baseRevenue: 12100, averageOrder: 71},
];

const months = [
  {value: "2026-04", factor: 0.92},
  {value: "2026-05", factor: 1.0},
  {value: "2026-06", factor: 1.11},
];

const channels = [
  {name: "Store", factor: 1.0},
  {name: "Web", factor: 1.08},
  {name: "Marketplace", factor: 0.9},
];

export const retailPulseData: RetailPulseRecord[] = cities.flatMap((city, cityIndex) =>
  categories.flatMap((category, categoryIndex) =>
    months.map((month, monthIndex) => {
      const channel = channels[(cityIndex + categoryIndex + monthIndex) % channels.length];
      const variation = 1 + (((cityIndex * 7 + categoryIndex * 5 + monthIndex * 3) % 9) - 4) / 100;
      const revenue = Math.round(category.baseRevenue * city.factor * month.factor * channel.factor * variation);
      const orders = Math.round(revenue / category.averageOrder);

      return {
        id: `retail-${cityIndex + 1}-${categoryIndex + 1}-${monthIndex + 1}`,
        month: month.value,
        city: city.name,
        category: category.name,
        channel: channel.name,
        revenue,
        orders,
        customers: Math.round(orders * 0.78),
        units: Math.round(orders * (1.28 + categoryIndex * 0.09)),
      };
    }),
  ),
);
