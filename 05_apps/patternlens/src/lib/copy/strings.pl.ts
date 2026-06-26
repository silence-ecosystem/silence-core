// PatternLens — Polish UI Strings
// All user-facing text in one place

export const PL = {
  // Navigation
  nav: {
    dashboard: 'Panel',
    archive: 'Archiwum',
    patterns: 'Wzorce',
    settings: 'Ustawienia',
    pricing: 'Cennik',
    help: 'Pomoc',
    logout: 'Wyloguj',
  },

  // Dashboard
  dashboard: {
    greeting: {
      morning: 'Dzień dobry',
      afternoon: 'Dzień dobry',
      evening: 'Dobry wieczór',
    },
    subtitle: 'Gotowy do strukturalnej analizy',
    newObject: '+ Nowy Obiekt',
    recentObjects: 'Ostatnie Obiekty',
    viewAll: 'Zobacz wszystkie',
    empty: {
      title: 'Brak Obiektów',
      description: 'Stwórz swój pierwszy Obiekt, aby rozpocząć analizę strukturalną.',
      cta: 'Utwórz pierwszy Obiekt',
    },
    stats: {
      total: 'Wszystkie',
      thisWeek: 'Ten tydzień',
      avgConfidence: 'Śr. pewność',
    },
  },

  // Object Creation
  object: {
    title: 'Nowy Obiekt',
    placeholder: 'Opisz sytuację, wzorzec lub zachowanie, które chcesz przeanalizować strukturalnie...',
    submit: 'Generuj Interpretację',
    minChars: 'Minimum 50 znaków',
    maxChars: 'Maksimum 5000 znaków',
  },

  // Interpretation
  interpretation: {
    lensA: 'Lens A',
    lensB: 'Lens B',
    selectPrompt: 'Wybierz, która lektura rezonuje z Twoją intuicją',
    disclaimer: 'To jest propozycja strukturalnej lektury, nie prawda o Tobie. Weryfikacja z własną intuicją należy do Ciebie.',
    phases: {
      context: 'Kontekst',
      tension: 'Napięcie',
      meaning: 'Znaczenie',
      function: 'Funkcja',
    },
    confidence: 'Pewność',
    saveToArchive: 'Zapisz do Archiwum',
    neither: 'Żaden nie rezonuje',
  },

  // Archive
  archive: {
    title: 'Archiwum',
    recentObjects: 'Ostatnie Obiekty',
    allObjects: 'Wszystkie Obiekty',
    empty: {
      title: 'Archiwum jest puste',
      description: 'Twoje zapisane Obiekty pojawią się tutaj.',
      cta: 'Utwórz pierwszy Obiekt',
    },
    filters: {
      all: 'Wszystkie',
      thisWeek: 'Ten tydzień',
      thisMonth: 'Ten miesiąc',
    },
  },

  // Settings
  settings: {
    title: 'Ustawienia',
    sections: {
      account: 'Konto',
      preferences: 'Preferencje',
      safety: 'Bezpieczeństwo',
      data: 'Dane',
      danger: 'Strefa niebezpieczna',
    },
    account: {
      email: 'Email',
      tier: 'Plan',
      free: 'Darmowy',
      pro: 'PRO',
      upgrade: 'Ulepsz do PRO',
      objectsThisWeek: 'Cloud obiekty użyte',
    },
    preferences: {
      minimalMode: {
        label: 'Tryb minimalny',
        description: 'Uproszczony interfejs z mniejszą ilością elementów wizualnych',
      },
    },
    safety: {
      crisisResources: {
        label: 'Zasoby kryzysowe',
        description: 'Szybki dostęp do linii wsparcia',
      },
    },
    data: {
      export: {
        label: 'Eksportuj dane',
        description: 'Pobierz wszystkie swoje dane jako JSON',
      },
    },
    danger: {
      deleteData: {
        label: 'Usuń dane',
        description: 'Usuń wszystkie Obiekty i interpretacje. Ta operacja jest nieodwracalna.',
      },
      deleteAccount: {
        label: 'Usuń konto',
        description: 'Trwałe usunięcie konta i wszystkich powiązanych danych.',
      },
    },
  },

  // Consents
  consents: {
    notTherapy: 'Rozumiem, że PatternLens jest narzędziem konstrukcyjnym do analizy strukturalnej, nie terapią ani diagnozą.',
    safetyRead: 'Zapoznałem/am się z wytycznymi bezpieczeństwa i zasobami kryzysowymi.',
    dataProcessing: 'Wyrażam zgodę na przetwarzanie danych zgodnie z polityką prywatności.',
    ageVerification: 'Oświadczam, że mam ukończone 18 lat.',
  },

  // Crisis
  crisis: {
    title: 'Zasoby Kryzysowe',
    subtitle: 'PatternLens jest narzędziem konstrukcyjnym i nie oferuje wsparcia kryzysowego.',
    tapToCall: 'Dotknij, aby zadzwonić',
    resources: {
      telefonZaufania: {
        name: 'Telefon Zaufania',
        number: '116 123',
        description: 'Wsparcie emocjonalne, 24/7',
      },
      emergency: {
        name: 'Numer Alarmowy',
        number: '112',
        description: 'Pogotowie, Policja, Straż',
      },
      centrumWsparcia: {
        name: 'Centrum Wsparcia',
        number: '800 70 2222',
        description: 'Dla osób dorosłych w kryzysie psychicznym',
      },
    },
    modalTitle: 'Wykryto treść wymagającą uwagi',
    modalBody: 'PatternLens jest narzędziem do analizy strukturalnej i nie oferuje wsparcia kryzysowego. Jeśli potrzebujesz pomocy, dostępne są zasoby 24/7.',
    modalShowResources: 'Zobacz wszystkie zasoby',
    modalReturn: 'Wróć do Panelu',
    footer: 'W sytuacji zagrożenia życia zawsze dzwoń pod numer alarmowy 112.',
  },

  // 404
  notFound: {
    title: '404',
    description: 'Strona nie została znaleziona',
    backToDashboard: 'Wróć do Panelu',
    browseArchive: 'Przeglądaj Archiwum',
  },

  // Errors
  errors: {
    generic: 'Wystąpił błąd. Spróbuj ponownie.',
    network: 'Brak połączenia z serwerem.',
    inputTooShort: 'Tekst Obiektu wymaga minimum 50 znaków.',
    inputTooLong: 'Tekst Obiektu może mieć maksimum 5000 znaków.',
    consentsRequired: 'Wszystkie zgody są wymagane.',
    sessionExpired: 'Sesja wygasła. Zaloguj się ponownie.',
    generationFailed: 'Nie udało się wygenerować interpretacji strukturalnej. Spróbuj ponownie.',
  },

  // Common
  common: {
    loading: 'Ładowanie...',
    save: 'Zapisz',
    cancel: 'Anuluj',
    delete: 'Usuń',
    confirm: 'Potwierdź',
    back: 'Wstecz',
    close: 'Zamknij',
  },

  // Footer
  footer: {
    disclaimer: 'PatternLens — narzędzie do konstrukcji interpretacji, nie terapia.',
    crisisPrefix: 'Zasoby kryzysowe:',
  },

  // Upgrade
  upgrade: {
    title: 'PatternLens PRO',
    cta: 'Ulepsz do PRO',
    price: '49 PLN/mies.',
  },
} as const;

export type PLStrings = typeof PL;
