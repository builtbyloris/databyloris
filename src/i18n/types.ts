export interface PublicDictionary {
  navigation: {
    explore: string;
    demo: string;
    about: string;
    primaryLabel: string;
    mobileLabel: string;
    openMenu: string;
    closeMenu: string;
    skipToContent: string;
  };
  languageSwitcher: {
    label: string;
    english: string;
    italian: string;
  };
  footer: {
    description: string;
    navigationLabel: string;
  };
  home: {
    exploreProjects: string;
    tryDemo: string;
  };
  explore: {
    eyebrow: string;
    title: string;
    description: string;
    catalog: {
      searchLabel: string;
      searchPlaceholder: string;
      categoryLabel: string;
      allCategories: string;
      projectSingular: string;
      projectPlural: string;
      emptyTitle: string;
      emptyDescription: string;
      resetFilters: string;
      interactiveDemo: string;
      exploreProject: string;
      exploreProjectAriaPrefix: string;
    };
  };
  about: {
    badge: string;
    title: string;
    description: string;
    ctaEyebrow: string;
    ctaTitle: string;
    ctaLabel: string;
  };
  projectNavigation: {
    label: string;
    overview: string;
    insights: string;
    explore: string;
    methodology: string;
  };
}
