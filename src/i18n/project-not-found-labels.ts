import type { Locale } from "./config";

export const projectNotFoundLabels: Record<Locale, {
  eyebrow: string;
  title: string;
  description: string;
  action: string;
}> = {
  en: {
    eyebrow: "Project unavailable",
    title: "This data story could not be found.",
    description: "The project may not exist or may not be published yet. Explore the current catalog to find an available data story.",
    action: "Explore projects",
  },
  it: {
    eyebrow: "Progetto non disponibile",
    title: "Questa data story non è stata trovata.",
    description: "Il progetto potrebbe non esistere o non essere ancora pubblicato. Esplora il catalogo corrente per trovare una data story disponibile.",
    action: "Esplora i progetti",
  },
};
