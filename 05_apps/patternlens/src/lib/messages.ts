// SILENCE.OBJECTS - Microcopy Reference v13
// Centralized user-facing messages for consistency

export const MESSAGES = {
  // Success Messages
  SUCCESS: {
    OBJECT_SAVED: "Obiekt zapisany",
    DATA_EXPORTED: "Dane wyeksportowane",
    OBJECT_DELETED: "Obiekt usunięty",
    CHOICE_UPDATED: "Wybór zaktualizowany",
    MAGIC_LINK_SENT: "Sprawdź skrzynkę email",
    ACCOUNT_DELETED: "Konto zostało usunięte",
    PLAN_UPGRADED: "Plan został zaktualizowany do PRO"
  },

  // Processing States
  PROCESSING: {
    CONSTRUCTION: "Konstrukcja w toku...",
    SAVING: "Zapisywanie...",
    DELETING: "Usuwanie...",
    EXPORTING: "Eksportowanie...",
    PROCESSING: "Przetwarzanie...",
    LOADING: "Ładowanie...",
    SIGNING_OUT: "Wylogowywanie..."
  },

  // Error Messages
  ERROR: {
    STRUCTURE_FAILED: "Nie udało się wygenerować struktury. Spróbuj ponownie.",
    INVALID_EMAIL: "Nieprawidłowy adres email",
    GENERAL: "Coś poszło nie tak. Spróbuj ponownie.",
    AUTH_FAILED: "Autoryzacja nie powiodła się. Spróbuj ponownie.",
    RATE_LIMIT: "Zbyt wiele prób. Poczekaj chwilę.",
    NETWORK: "Błąd sieci. Sprawdź połączenie.",
    ACCOUNT_DELETE_FAILED: "Nie udało się usunąć konta",
    PAYMENT_FAILED: "Nie udało się utworzyć sesji płatności"
  },

  // Limit Messages
  LIMITS: {
    REACHED: "Osiągnięto limit FREE (7/7)",
    WARNING: "Pozostał 1 Obiekt w planie FREE",
    APPROACHING: "Zbliżasz się do limitu",
    UPGRADE_CTA: "Przejdź na PRO aby kontynuować"
  },

  // Empty States
  EMPTY: {
    NO_OBJECTS: "Brak zapisanych obiektów",
    NO_DATA: "Brak danych",
    CREATE_FIRST: "Utwórz pierwszy Obiekt"
  },

  // Validation
  VALIDATION: {
    TOO_SHORT: "Minimum 10 znaków",
    TOO_LONG: "Przekroczono maksymalną długość",
    REQUIRED: "To pole jest wymagane",
    ACCEPT_TERMS: "Musisz zaakceptować regulamin"
  },

  // Crisis & Emergency
  CRISIS: {
    DETECTED: "Wykryto treści wskazujące na kryzys",
    SUPPORT_AVAILABLE: "Dostępna jest natychmiastowa pomoc",
    CALL_HELPLINE: "Zadzwoń na linię wsparcia"
  }
} as const;

export const DISCLAIMERS = {
  // Mandatory disclaimers
  STRUCTURAL: "To jest interpretacja strukturalna, nie diagnoza.",
  NOT_THERAPY: "To konstrukcja, nie terapia.",
  CRISIS_CONTACT: "W sytuacji kryzysowej skontaktuj się z pomocą: 116 123",

  // Extended disclaimers
  FULL_INTERPRETATION: "To konstrukcja interpretacyjna, nie diagnoza. System generuje możliwe odczytania - wybór i walidacja należą do Ciebie.",
  ANALYSIS_TOOL: "To konstrukcja analityczna, nie diagnoza. Służy do samorefleksji, nie zastępuje profesjonalnej oceny.",
  NOT_CRISIS_SERVICE: "SILENCE.OBJECTS nie jest serwisem interwencji kryzysowej."
} as const;

// Helper functions for common message patterns
export const getProgressMessage = (current: number, max: number): string => {
  if (current >= max) return MESSAGES.LIMITS.REACHED;
  if (current === max - 1) return MESSAGES.LIMITS.WARNING;
  if (current >= max - 2) return MESSAGES.LIMITS.APPROACHING;
  return `FREE: ${max} Obiektów. Pozostało: ${max - current}`;
};

export const getCountDisplay = (current: number, max: number): string => {
  return `${current}/${max} Obiektów`;
};

// Regional helplines (for crisis situations)
export const HELPLINES = {
  PL: {
    primary: "116 123",
    name: "Telefon Zaufania",
    emergency: "112"
  }
} as const;
