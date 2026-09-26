import { SPOTIFY_INSIGHTS } from "@/data/spotify-insights";
import { SPOTIFY_METHODOLOGY } from "@/data/spotify-methodology";
import { SPOTIFY_OVERVIEW } from "@/data/spotify-overview";
import { SPOTIFY_TOUR_STEPS } from "@/data/spotify-tour";
import type { PublicDictionary } from "../types";
import type { GuidedTourStep } from "@/types/onboarding";
import type { LifecycleVisualizationData, MarketComparisonData, ProjectInsightsData, ProjectOverviewData } from "@/types/analytics";
import type { ProjectMethodologyData } from "@/types/project";

const overview = {
  ...SPOTIFY_OVERVIEW,
  context: "Questa demo illustrativa esplora come cambiano le abitudini di ascolto nel tempo, tra artisti, generi e mercati, creando un percorso chiaro dal dato principale alle domande di approfondimento.",
  kpis: [
    { ...SPOTIFY_OVERVIEW.kpis[0], label: "Stream totali", context: "Totale illustrativo 2025", trend: { value: "+19%", context: "rispetto al 2024" } },
    { ...SPOTIFY_OVERVIEW.kpis[1], label: "Ascoltatori unici", context: "Pubblico illustrativo 2025", trend: { value: "+12%", context: "rispetto al 2024" } },
    { ...SPOTIFY_OVERVIEW.kpis[2], label: "Artista principale", context: "12,4% degli stream demo" },
    { ...SPOTIFY_OVERVIEW.kpis[3], label: "Genere in maggiore crescita", context: "Categoria demo illustrativa", trend: { value: "+42%", context: "nel periodo della demo" } },
  ],
  trend: {
    ...SPOTIFY_OVERVIEW.trend,
    eyebrow: "Andamento degli stream", title: "Come è cambiata l’attività di streaming nel tempo?",
    context: "Stream annuali · valori demo illustrativi",
    summary: "Gli stream annuali illustrativi aumentano da 82 milioni nel 2022 a 156 milioni nel 2025, con una crescita in ogni anno mostrato.",
  },
  takeaway: "In questo dataset illustrativo, l’attività di streaming cresce in modo costante nel periodo della demo, ma la crescita non è distribuita uniformemente tra generi e mercati.",
  insights: [
    { ...SPOTIFY_OVERVIEW.insights[0], label: "Concentrazione degli artisti", title: "Un piccolo gruppo guida gli ascolti", interpretation: "I dieci artisti principali della demo rappresentano il 38% degli stream illustrativi, suggerendo una fascia di vertice concentrata." },
    { ...SPOTIFY_OVERVIEW.insights[1], label: "Dinamica dei generi", title: "Electronic cresce più rapidamente", interpretation: "Electronic mostra la crescita illustrativa più forte nel periodo della demo, davanti agli altri generi del campione." },
    { ...SPOTIFY_OVERVIEW.insights[2], label: "Differenze geografiche", title: "Il mix di generi cambia per mercato", interpretation: "La quota del genere principale varia fino a 1,8× tra i mercati illustrativi della demo." },
  ],
} satisfies ProjectOverviewData;

const insights = {
  ...SPOTIFY_INSIGHTS,
  introduction: "Quattro storie illustrative mostrano come lo stesso dataset di ascolto possa rivelare concentrazione, dinamiche di crescita, preferenze locali e percorsi verso la popolarità molto diversi.",
  disclaimer: "Ogni valore in questa sezione è contenuto demo illustrativo e non costituisce una statistica Spotify verificata.",
  stories: [
    {
      ...SPOTIFY_INSIGHTS.stories[0], label: "Concentrazione degli artisti", question: "Quali artisti dominano gli ascolti?",
      explanation: "Un piccolo gruppo di artisti rappresenta una quota sproporzionata degli stream della demo. L’artista principale si distingue, mentre il resto del pubblico si distribuisce su una coda molto più lunga.",
      takeaway: "In questo campione illustrativo, l’artista principale raccoglie il 12,4% degli stream e i primi dieci insieme raggiungono il 38%.",
      visualization: { ...SPOTIFY_INSIGHTS.stories[0].visualization, title: "Artisti principali per quota di stream", context: "Quota degli stream demo illustrativi", summary: "Artist 01 guida con il 12,4% degli stream demo, seguito da Artist 02 al 6,8%. I tre artisti successivi restano ciascuno sotto il 5%." },
    },
    {
      ...SPOTIFY_INSIGHTS.stories[1], label: "Crescita dei generi", question: "Quali generi crescono più rapidamente?",
      explanation: "Crescita e popolarità rispondono a domande diverse. Electronic cresce più rapidamente nel periodo della demo, mentre Pop rimane la categoria più grande secondo l’indice di popolarità separato.",
      takeaway: "Il genere che cresce più rapidamente non è necessariamente il più popolare: Electronic sale del 42%, mentre Pop mantiene l’indice di popolarità demo più alto.",
      visualization: { ...SPOTIFY_INSIGHTS.stories[1].visualization, title: "Dinamica dei generi e popolarità", context: "Crescita nel periodo demo e indice di popolarità illustrativo", summary: "Electronic registra la crescita illustrativa più alta, pari al 42%, con un indice di popolarità di 64. Pop cresce dell’8% ma ha l’indice di popolarità più alto, pari a 100." },
    },
    {
      ...SPOTIFY_INSIGHTS.stories[2], label: "Differenze tra mercati", question: "I diversi Paesi ascoltano in modo diverso?",
      explanation: "Gli stessi generi compaiono nei vari mercati, ma il loro peso relativo cambia. Le preferenze locali modificano la classifica anche quando il catalogo complessivo è condiviso.",
      takeaway: "Tre generi diversi guidano i quattro mercati demo e la quota di Electronic varia di 1,8× tra Brasile e Regno Unito.",
      visualization: {
        ...(SPOTIFY_INSIGHTS.stories[2].visualization as MarketComparisonData), title: "Mix di generi per mercato", context: "Quota degli stream illustrativi in ciascun mercato",
        summary: "Electronic guida in Italia e nel Regno Unito, Hip-Hop negli Stati Uniti e Latin in Brasile. Electronic varia dal 20% in Brasile al 36% nel Regno Unito.",
        markets: (SPOTIFY_INSIGHTS.stories[2].visualization as MarketComparisonData).markets.map((market, index) => ({ ...market, highlight: ["Electronic al primo posto · 30%", "Hip-Hop al primo posto · 38%", "Latin al primo posto · 44%", "Electronic al primo posto · 36%"][index] })),
      },
    },
    {
      ...SPOTIFY_INSIGHTS.stories[3], label: "Ciclo di vita di una hit", question: "Quanto a lungo rimane popolare una hit?",
      explanation: "I brani possono raggiungere e mantenere l’attenzione in modi molto diversi. Alcuni raggiungono subito il picco, altri crescono grazie alla scoperta, altri ancora mantengono un pubblico stabile nel tempo.",
      takeaway: "I pattern illustrativi mostrano che il solo picco non spiega la longevità: contano anche la forma della curva e la capacità di trattenere l’attenzione.",
      visualization: {
        ...(SPOTIFY_INSIGHTS.stories[3].visualization as LifecycleVisualizationData), title: "Tre percorsi nel ciclo di vita di una hit", context: "Indice di popolarità illustrativo su otto settimane",
        summary: "La hit immediata parte da 95 e scende a 19. La crescita graduale sale da 20 a un picco di 91 prima di rallentare. Il brano evergreen rimane stabile tra 61 e 67.",
        labels: ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"],
        series: (SPOTIFY_INSIGHTS.stories[3].visualization as LifecycleVisualizationData).series.map((series, index) => ({ ...series, label: ["Hit immediata", "Crescita graduale", "Evergreen"][index], description: ["Picco iniziale, poi cala", "Cresce grazie alla scoperta", "Mantiene un’attenzione stabile"][index] })),
      },
    },
  ],
  curiosity: { title: "Tre generi, quattro mercati leader", text: "Lo sapevi? In questa demo illustrativa, Electronic, Hip-Hop e Latin si classificano ciascuno al primo posto in almeno uno dei quattro mercati del campione." },
} satisfies ProjectInsightsData;

const methodology = {
  ...SPOTIFY_METHODOLOGY,
  title: "Come funziona l’analisi demo", introduction: "Una panoramica trasparente del dataset sintetico, delle scelte di preparazione e dei metodi analitici alla base di questa dimostrazione.",
  objective: "Questa demo esplora i pattern di ascolto nel tempo, tra artisti, generi e mercati, mostrando come databyloris colleghi una data story editoriale a uno spazio di analisi interattivo.",
  dataset: {
    description: "Un dataset sintetico e deterministico sugli ascolti, creato localmente per la dimostrazione del prodotto. Non sono stati raccolti dati reali relativi ad attività, catalogo o utenti Spotify.",
    grain: "Un brano × un Paese × un mese", period: "Gennaio 2022–dicembre 2025",
    dimensions: ["Mese e anno", "Brano", "Artista", "Genere", "Paese"],
    metrics: ["Stream", "Ascoltatori", "Popolarità", "Copertura playlist"],
  },
  preparation: [
    "Generare a ogni esecuzione le stesse righe sintetiche da un insieme fisso di brani, artisti, generi e mercati.",
    "Derivare campi coerenti per mese e anno, così da supportare filtri cronologici e analisi dei trend.",
    "Memorizzare una riga pronta per l’aggregazione per ogni combinazione di brano, Paese e mese.",
    "Verificare intervalli, identificativi e copertura affinché i valori restino coerenti per tutto il periodo demo.",
  ],
  techniques: [
    { label: "Aggregazione", description: "Somma le misure delle righe incluse nella selezione corrente." },
    { label: "Classificazione", description: "Ordina artisti, generi e brani in base al totale illustrativo degli stream." },
    { label: "Analisi dei trend", description: "Confronta l’attività mensile in ordine cronologico dal 2022 al 2025." },
    { label: "Analisi della crescita", description: "Misura la variazione relativa tra il primo e l’ultimo periodo disponibili." },
    { label: "Segmentazione", description: "Suddivide la selezione per artista, genere, Paese o periodo temporale." },
    { label: "Confronto", description: "Valuta artisti e mercati selezionati usando le stesse definizioni metriche." },
  ],
  metricDefinitions: [
    { label: "Stream", description: "Il numero illustrativo di riproduzioni rappresentato dalle righe correnti." },
    { label: "Ascoltatori unici", description: "Un conteggio illustrativo degli ascoltatori aggregato per la selezione corrente; non si basa su identità individuali." },
    { label: "Popolarità", description: "Un indice sintetico da 1 a 100 usato per confrontare la dinamica relativa dei brani nella demo." },
    { label: "Copertura playlist", description: "Una stima illustrativa del pubblico potenzialmente raggiunto attraverso l’inserimento in playlist." },
    { label: "Crescita", description: "La variazione percentuale tra il primo e l’ultimo periodo confrontabili di una selezione." },
  ],
  tools: [
    { label: "Next.js", description: "Routing dell’applicazione, rendering ed esperienza pubblica riutilizzabile per i progetti." },
    { label: "TypeScript", description: "Contenuti dei progetti, righe dashboard, filtri e risultati analitici tipizzati." },
    { label: "Recharts", description: "Visualizzazioni responsive della dashboard costruite dal dataset locale filtrato." },
    { label: "Dati analitici sintetici locali", description: "Dati dimostrativi deterministici generati ed elaborati nell’applicazione." },
  ],
  limitations: [
    "Il dataset è interamente sintetico ed è stato creato esclusivamente per questa dimostrazione del prodotto.",
    "Ogni risultato e valore è illustrativo e non deve essere interpretato come una statistica Spotify reale.",
    "La selezione semplificata di brani, artisti, generi e mercati non rappresenta il catalogo completo né il comportamento degli utenti Spotify.",
    "La demo privilegia chiarezza narrativa e pattern di interazione rispetto alla complessità dei dati su scala produttiva.",
  ],
  takeaways: [
    "Un progetto può partire da una domanda analitica chiara prima di introdurre l’esplorazione di dettaglio.",
    "Gli insight editoriali possono collegarsi direttamente ai filtri e alle evidenze visive che li supportano.",
    "Una metodologia trasparente aiuta a capire ciò che i dati possono — e non possono — mostrare.",
  ],
} satisfies ProjectMethodologyData;

const tourSteps = SPOTIFY_TOUR_STEPS.map((step, index) => ({
  ...(step as GuidedTourStep),
  title: ["Parti dal quadro generale", "Segui la storia nei dati", "Osserva le evidenze", "Esplora in autonomia", "Esamina i dettagli"][index],
  description: [
    "I KPI riassumono il contesto corrente dei dati prima di passare alla storia di dettaglio.",
    "Gli insight evidenziano i pattern emersi dall’analisi. Attiva il vero controllo Esplora questo insight per continuare.",
    "La dashboard si è aperta con lo stato analitico pertinente già applicato. I filtri e il riepilogo mostrano il contesto corrente.",
    "Modifica il vero filtro Paese per vedere aggiornarsi insieme tutte le misure e le visualizzazioni della dashboard.",
    "Passa il mouse, porta il focus o tocca un punto evidenziato nel grafico Andamento degli stream per esaminare un periodo specifico.",
  ][index],
  targetActionLabel: "targetActionLabel" in step ? ["", "Vai a Esplora questo insight", "", "Vai al filtro Paese", "Vai a un punto del grafico"][index] : undefined,
})) satisfies GuidedTourStep[];

const dictionary = {
  navigation: { explore: "Esplora", demo: "Demo", about: "Informazioni", primaryLabel: "Navigazione principale", mobileLabel: "Navigazione mobile", openMenu: "Apri il menu di navigazione", closeMenu: "Chiudi il menu di navigazione", skipToContent: "Vai al contenuto principale" },
  languageSwitcher: { label: "Lingua", english: "Inglese", italian: "Italiano" },
  theme: { switchTheme: "Cambia tema colore", switchToLight: "Passa al tema chiaro", switchToDark: "Passa al tema scuro" },
  footer: { description: "Una piattaforma modulare per data story chiare e interattive.", navigationLabel: "Navigazione del footer" },
  home: {
    eyebrow: "Data story interattive", title: "Esplora ciò che i dati hanno da raccontare.", description: "Analisi interattive che trasformano dataset reali in insight, storie e dashboard esplorabili.",
    exploreProjects: "Esplora i progetti", tryDemo: "Prova la demo interattiva", journey: ["Scopri", "Comprendi", "Esplora"],
    preview: {
      ariaLabel: "Anteprima illustrativa del prodotto analitico", title: "Panoramica del pubblico", updated: "Aggiornamento mensile", badge: "Anteprima illustrativa", filtersLabel: "Filtri della dashboard",
      filters: [["Periodo", "Ultimi 12 mesi"], ["Regione", "Tutti i mercati"], ["Segmento", "Tutto il pubblico"]],
      kpis: [{ label: "Sessioni", value: "12.8M" }, { label: "Mercati", value: "64" }, { label: "Crescita", value: "+8.2%" }],
      trendTitle: "Andamento del coinvolgimento", trendContext: "Indice illustrativo", trendBadge: "In crescita", chartSummary: "Grafico a linee illustrativo in crescita con variazioni contenute", insightBadge: "Insight", insight: "Nell’ultimo periodo la dinamica si è rafforzata in diversi segmenti di pubblico.",
    },
    featured: { eyebrow: "Analisi in evidenza", title: "Una data story pensata per essere esplorata.", interactiveDemo: "Demo interattiva", publishedProject: "Progetto pubblicato", metadataLabel: "Metadati dell’analisi", exploreAnalysis: "Esplora l’analisi", previewAria: "Anteprima illustrativa dell’interfaccia di analisi", previewTitle: "Anteprima dell’analisi", previewContext: "Interfaccia del progetto pubblicato", signal: "Segnale" },
    featuredInsights: {
      badge: "Anteprima demo", title: "Insight che invitano ad approfondire.", description: "Solo contenuti illustrativi dell’interfaccia, non risultati Spotify verificati.",
      items: [
        { value: "+42%", title: "Genere in maggiore crescita", description: "Un segnale di crescita di esempio presentato come risultato analitico sintetico." },
        { value: "Top 10", title: "Pochi artisti concentrano una quota significativa degli stream", description: "Un’anteprima di come le classifiche possono rivelare la concentrazione degli ascolti." },
        { value: "Globale", title: "Le preferenze di ascolto variano tra i mercati", description: "Un confronto di esempio che conduce dall’insight all’esplorazione." },
      ],
    },
    howItWorksEyebrow: "Come funziona", howItWorksTitle: "Dalla scoperta alle tue domande.",
    steps: [{ number: "01", title: "Scopri", description: "Trova un’analisi che ti interessa." }, { number: "02", title: "Comprendi", description: "Segui i risultati chiave e la storia nei dati." }, { number: "03", title: "Esplora", description: "Usa filtri e visualizzazioni per indagare i dati in autonomia." }],
    finalEyebrow: "Continua a esplorare", finalTitle: "Pronto a esplorare i dati?",
  },
  explore: {
    eyebrow: "Catalogo progetti", title: "Esplora le storie nei dati", description: "Scopri analisi interattive costruite a partire da dataset reali.",
    catalog: { searchLabel: "Cerca progetti", searchPlaceholder: "Cerca titoli, argomenti o tag", categoryLabel: "Filtra per categoria", allCategories: "Tutti", projectSingular: "progetto", projectPlural: "progetti", emptyTitle: "Nessun progetto trovato", emptyDescription: "Prova una ricerca diversa o reimposta il filtro per vedere tutti i progetti.", resetFilters: "Reimposta filtri", interactiveDemo: "Demo interattiva", exploreProject: "Esplora il progetto", exploreProjectAriaPrefix: "Esplora", tagsSuffix: "tag", coverUnavailable: "copertina del progetto non disponibile", coverLabel: "Copertina del progetto", coverAlt: "copertina del progetto", coverLabels: { listening: "Segnali di ascolto", catalog: "Composizione del catalogo", market: "Dinamiche di mercato", geography: "Flussi di viaggio", economy: "Adozione digitale", generic: "Segnali nei dati" } },
  },
  about: {
    badge: "Informazioni su databyloris", title: "L’analisi dei dati va esplorata, non solo presentata.", description: "databyloris trasforma i dataset in storie interattive, insight chiari e dashboard esplorabili, mantenendo visibile il percorso dalla domanda alle evidenze.",
    philosophyEyebrow: "Filosofia del prodotto", philosophyTitle: "Scopri → Comprendi → Esplora", philosophyDescription: "Ogni progetto parte da un punto di accesso immediato, prosegue con una spiegazione guidata e infine apre la stessa analisi all’esplorazione autonoma.",
    philosophy: [{ number: "01", title: "Scopri", description: "Parti da una domanda sul mondo reale e trova un’analisi da approfondire." }, { number: "02", title: "Comprendi", description: "Segui contesto, evidenze e risultati chiave attraverso una narrazione editoriale chiara." }, { number: "03", title: "Esplora", description: "Usa la dashboard interattiva per verificare la storia e indagare le tue domande." }],
    contentsEyebrow: "Dentro ogni progetto", contentsTitle: "Un’analisi, diversi modi per comprenderla.", contentsDescription: "La struttura rimane coerente, così chi visita può passare dall’orientamento alle evidenze senza dover imparare ogni volta una nuova interfaccia.",
    contents: [{ title: "Contesto", description: "La domanda, il dataset e le informazioni necessarie a inquadrare l’analisi." }, { title: "KPI", description: "Una vista sintetica delle misure che definiscono il contesto corrente dei dati." }, { title: "Data story", description: "Insight editoriali che collegano i pattern alle evidenze visive di supporto." }, { title: "Esplorazione interattiva", description: "Filtri, confronti e viste di dettaglio per indagare direttamente i dati." }, { title: "Metodologia", description: "Definizioni, scelte di preparazione, tecniche e limiti presentati con trasparenza." }],
    purposeEyebrow: "Perché esiste databyloris", purposeTitle: "La chiarezza non dovrebbe fermarsi al grafico.", purposeParagraphs: ["È più facile fidarsi di un’analisi quando domanda, definizioni e limiti restano vicini al risultato.", "databyloris nasce per rendere l’analisi comprensibile, esplorabile e trasparente, combinando una narrazione guidata con la libertà di osservare i dati da un’altra prospettiva."],
    creatorEyebrow: "Il creatore", creatorTitle: "Progettato e sviluppato da Loris.", creatorDescription: "La piattaforma fa parte del lavoro di Loris nella Data Analysis e nello sviluppo di prodotti analitici, esplorando come rigore analitico e progettazione attenta possano rendere i dati più utili a più persone.",
    ctaEyebrow: "Continua", ctaTitle: "Esplora le storie dietro i dati.", ctaLabel: "Esplora le data story",
  },
  projectNavigation: { label: "Sezioni del progetto", overview: "Panoramica", insights: "Approfondimenti", explore: "Esplora", methodology: "Metodologia" },
  project: {
    hero: { interactiveDemo: "Demo interattiva", mainQuestion: "Domanda principale", startExploring: "Inizia a esplorare" },
    cover: { unavailable: "copertina del progetto non disponibile", label: "Copertina del progetto", alt: "copertina del progetto" },
    dataset: { eyebrow: "Panoramica del dataset", demoMetadata: "Metadati demo", period: "Periodo", records: "Record", entities: "Entità", categories: "Categorie", markets: "Mercati", grain: "Granularità", source: "Fonte" },
    overview: { eyebrow: "Panoramica", title: "Parti dalla domanda", glance: "In sintesi", snapshot: "Riepilogo delle performance demo", disclaimer: "Tutti i valori sono dati demo illustrativi.", demoBadge: "Demo", kpiAria: "Indicatori chiave della panoramica", illustrativeData: "Dati illustrativi", annualValuesAria: "Valori annuali illustrativi degli stream", illustrativeStreams: "stream illustrativi", takeaway: "Risultato principale", takeawayDisclaimer: "Interpretazione illustrativa per la demo Spotify, non un risultato Spotify verificato.", previewEyebrow: "Anteprima degli insight", previewTitle: "Tre pattern da approfondire", previewDescription: "Questi segnali illustrativi anticipano come la storia completa passerà da un risultato alle evidenze che lo supportano.", insightBadge: "Insight demo", exploreInsight: "Esplora l’insight", exploreInsightAria: "Esplora l’insight", continueText: "Prosegui nella storia editoriale per capire cosa potrebbe guidare questi pattern dimostrativi.", continueCta: "Esplora gli insight principali" },
    insights: { eyebrow: "Insight", badge: "Storie demo illustrative", title: "Quattro domande dietro la storia degli ascolti", storyBadge: "Storia illustrativa", takeaway: "In sintesi", explore: "Esplora questo insight", exploreAria: "Esplora questo insight", demoData: "Dati demo", growth: "Crescita", popularityNote: "La popolarità è mostrata come indice separato da 0 a 100", popularity: "Popolarità", genreLegend: "Legenda dei generi", lifecycleLegend: "Legenda dei pattern del ciclo di vita", curiosity: "Lo sapevi?" },
    explore: { eyebrow: "Esplora", title: "Indaga le tue domande", description: "Applica i filtri globali per aggiornare insieme la selezione corrente, le metriche principali, le visualizzazioni e il dettaglio dei brani.", syntheticBadge: "Dataset demo sintetico", loading: "Preparazione dello spazio di esplorazione interattivo…" },
    methodology: { eyebrow: "Metodologia", badge: "Analisi demo sintetica", objectiveEyebrow: "Obiettivo dell’analisi", objectiveTitle: "Cosa esamina questa demo", datasetEyebrow: "Dataset", datasetTitle: "Una base analitica controllata", grain: "Granularità", period: "Periodo", dimensions: "Dimensioni principali", metrics: "Metriche principali", preparationEyebrow: "Preparazione dei dati", preparationTitle: "Progettato per essere riproducibile", approachEyebrow: "Approccio analitico", approachTitle: "Sei tecniche complementari", metricsEyebrow: "Metriche", metricsTitle: "Come leggere le misure", toolsEyebrow: "Strumenti / Architettura", toolsTitle: "L’implementazione alla base della demo", limitationsEyebrow: "Limiti", limitationsTitle: "Cosa non può affermare questa analisi", takeawaysEyebrow: "Conclusioni", takeawaysTitle: "Cosa dimostra l’esperienza del prodotto" },
    generic: { availableMetadata: "Metadati disponibili", published: "Pubblicato", availability: "Disponibilità del progetto", comingTitle: "L’analisi interattiva sarà disponibile in seguito.", comingDescription: "L’analisi interattiva per questo progetto non è ancora disponibile. Questa pagina mostra intenzionalmente solo i metadati pubblicati; non sono stati dedotti risultati o visualizzazioni." },
  },
  dashboard: {
    locale: "it-IT", filterLabels: { period: "Periodo", country: "Paese", genre: "Genere", artist: "Artista" }, allLabels: { period: "Tutti i periodi", country: "Tutti i Paesi", genre: "Tutti i generi", artist: "Tutti gli artisti" },
    modules: { "streaming-trend": "Andamento degli stream", "top-artists": "Artisti principali", "genre-distribution": "Distribuzione dei generi", "genre-growth": "Crescita dei generi", "artist-comparison": "Confronto tra artisti", "track-table": "Tabella dei brani" },
    moduleAriaSuffix: "modulo della dashboard", insightFocus: "Focus dell’insight", filtersAria: "Filtri della dashboard e selezione attiva", showing: "Visualizzazione:", allData: "Tutti i dati", recordsOf: "su", records: "record", demoBadge: "Demo",
    kpis: { totalStreams: "Stream totali", uniqueListeners: "Ascoltatori unici", topArtist: "Artista principale", topGenre: "Genere principale", selectionContext: "Nella selezione sintetica corrente", listenerContext: "Coorti illustrative additive di ascoltatori", rankingContext: "Classifica per stream illustrativi" },
    noDataEyebrow: "Nessun dato corrispondente", noDataTitle: "Questa combinazione di filtri non contiene record.", noDataDescription: "Modifica una delle dimensioni attive o reimposta la dashboard per tornare al dataset sintetico completo.", resetFilters: "Reimposta filtri", globalFilters: "Filtri globali", active: "attivi",
    charts: {
      streams: "Stream", growthLabel: "Crescita", totalStreamsSuffix: "stream totali", total: "totale",
      trend: { eyebrow: "Andamento degli stream", title: "Come cambia l’attività di streaming nel tempo?", description: "Stream mensili illustrativi per la selezione globale corrente.", insufficient: "Seleziona un periodo di almeno due mesi per mostrare un andamento." },
      artists: { eyebrow: "Classifica degli artisti", title: "Quali artisti guidano la selezione corrente?", description: "Classifica per stream illustrativi.", sizeAria: "Dimensione della classifica degli artisti", top: "Top" },
      genres: { eyebrow: "Distribuzione dei generi", title: "Quali generi rappresentano la quota maggiore degli ascolti?", description: "Quota degli stream illustrativi nella selezione corrente.", percent: "percento" },
      growth: { eyebrow: "Crescita relativa", title: "Quali generi crescono più rapidamente?", readyDescription: "{start} rispetto a {end}. La crescita è distinta dalla popolarità totale.", defaultDescription: "Confronta il primo e l’ultimo mese disponibili nella selezione corrente.", growthSuffix: "di crescita", insufficientPeriod: "Seleziona almeno due mesi per confrontare la crescita dei generi.", insufficientComparison: "La selezione corrente non contiene generi con dati in entrambi i mesi di riferimento." },
      comparison: { eyebrow: "Confronto tra artisti", title: "Come si confrontano due artisti?", description: "Usa i filtri globali di periodo, Paese e genere. Il filtro globale per artista resta indipendente.", artistA: "Artista A", artistB: "Artista B", metric: "Metrica", totalStreams: "Stream totali", uniqueListeners: "Ascoltatori unici", averagePopularity: "Popolarità media", playlistReach: "Copertura playlist", insufficient: "Dopo aver applicato i filtri per periodo, Paese e genere devono essere disponibili almeno due artisti." },
      table: { eyebrow: "Dettaglio dei brani", title: "Come si distribuisce la selezione per brano?", description: "Dati aggregati dai record filtrati. Seleziona l’intestazione di una colonna per ordinare.", regionAria: "Risultati dei brani; scorri orizzontalmente per vedere tutte le colonne", caption: "Brani aggregati nella selezione corrente della dashboard", track: "Brano", artist: "Artista", genre: "Genere", streams: "Stream", listeners: "Ascoltatori", popularity: "Popolarità", page: "Pagina", of: "di", tracks: "brani", paginationAria: "Paginazione della tabella dei brani", previousAria: "Pagina precedente della tabella dei brani", nextAria: "Pagina successiva della tabella dei brani", previous: "Precedente", next: "Successiva" },
    },
  },
  onboarding: { promptTitle: "Esplora questa data story", promptDescription: "Scopri come leggere gli insight, usare i filtri ed esplorare la dashboard.", promptMeta: "Circa 1 minuto", start: "Avvia il tour guidato", dismiss: "Esplora in autonomia", completeTitle: "Ora sei pronto a esplorare", completeDescription: "Usa filtri, classifiche e insight per scoprire i tuoi pattern nei dati.", exploreFreely: "Esplora liberamente", guidedTour: "Tour guidato", stepOf: "di", skip: "Salta il tour", instruction: "Completa l’azione evidenziata per continuare", back: "Indietro", next: "Avanti", focus: "Vai al controllo evidenziato" },
  spotify: {
    dataset: { name: "Dataset demo sulle tendenze di ascolto Spotify", summary: "Un dataset illustrativo di streaming configurato per mostrare la storia del progetto e l’esperienza di esplorazione.", entities: "Artisti e brani", categories: "Generi", markets: "Paesi", dashboardLabel: "Demo sintetica di ascolto Spotify · un brano × un Paese × un mese", dashboardDescription: "Generata in modo deterministico per il periodo 2022–2025. I valori sono illustrativi e non rappresentano statistiche Spotify reali." },
    overview, insights, methodology, tourSteps,
  },
} satisfies PublicDictionary;

export default dictionary;
