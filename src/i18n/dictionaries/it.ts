import type { PublicDictionary } from "../types";

const dictionary = {
  navigation: {
    explore: "Esplora",
    demo: "Demo",
    about: "Informazioni",
    primaryLabel: "Navigazione principale",
    mobileLabel: "Navigazione mobile",
    openMenu: "Apri il menu di navigazione",
    closeMenu: "Chiudi il menu di navigazione",
    skipToContent: "Vai al contenuto principale",
  },
  languageSwitcher: {
    label: "Lingua",
    english: "Inglese",
    italian: "Italiano",
  },
  footer: {
    description: "Una piattaforma modulare per data story chiare e interattive.",
    navigationLabel: "Navigazione del footer",
  },
  home: {
    exploreProjects: "Esplora i progetti",
    tryDemo: "Prova la demo interattiva",
  },
  explore: {
    eyebrow: "Catalogo progetti",
    title: "Esplora le storie nei dati",
    description: "Scopri analisi interattive costruite a partire da dataset reali.",
    catalog: {
      searchLabel: "Cerca progetti",
      searchPlaceholder: "Cerca titoli, argomenti o tag",
      categoryLabel: "Filtra per categoria",
      allCategories: "Tutti",
      projectSingular: "progetto",
      projectPlural: "progetti",
      emptyTitle: "Nessun progetto trovato",
      emptyDescription:
        "Prova una ricerca diversa o reimposta il filtro per vedere tutti i progetti.",
      resetFilters: "Reimposta filtri",
      interactiveDemo: "Demo interattiva",
      exploreProject: "Esplora il progetto",
      exploreProjectAriaPrefix: "Esplora",
    },
  },
  about: {
    badge: "Informazioni su databyloris",
    title: "L’analisi dei dati va esplorata, non solo presentata.",
    description:
      "databyloris trasforma i dataset in storie interattive, insight chiari e dashboard esplorabili, mantenendo visibile il percorso dalla domanda alle evidenze.",
    ctaEyebrow: "Continua",
    ctaTitle: "Esplora le storie dietro i dati.",
    ctaLabel: "Esplora le data story",
  },
  projectNavigation: {
    label: "Sezioni del progetto",
    overview: "Panoramica",
    insights: "Approfondimenti",
    explore: "Esplora",
    methodology: "Metodologia",
  },
} satisfies PublicDictionary;

export default dictionary;
