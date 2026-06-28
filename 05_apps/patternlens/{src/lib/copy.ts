/**
 * PatternLens Copy/i18n System
 * Centralized text strings for the application
 */

export type Locale = 'pl' | 'en';

export interface CopyStrings {
  // App
  appName: string;
  tagline: string;
  
  // Navigation
  dashboard: string;
  archive: string;
  patterns: string;
  settings: string;
  
  // Actions
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  create: string;
  submit: string;
  close: string;
  
  // Object creation
  newObject: string;
  objectTitle: string;
  objectContent: string;
  selectLens: string;
  lensA: string;
  lensB: string;
  
  // Status
  loading: string;
  saving: string;
  saved: string;
  error: string;
  success: string;
  
  // Errors
  errorGeneric: string;
  errorNetwork: string;
  errorAuth: string;
  errorValidation: string;
  
  // Crisis/Safety - IMPORTANT: NO therapeutic language
  safetyTitle: string;
  safetySubtitle: string;
  safetyResources: string;
  safetyContinue: string;
  
  // Auth
  signIn: string;
  signOut: string;
  signUp: string;
  email: string;
  password: string;
  
  // Tier
  freeTier: string;
  proTier: string;
  upgrade: string;
}

export const COPY_PL: CopyStrings = {
  // App
  appName: 'PatternLens',
  tagline: 'Narzędzie konstrukcyjne do analizy wzorców',
  
  // Navigation
  dashboard: 'Panel',
  archive: 'Archiwum',
  patterns: 'Wzorce',
  settings: 'Ustawienia',
  
  // Actions
  save: 'Zapisz',
  cancel: 'Anuluj',
  delete: 'Usuń',
  edit: 'Edytuj',
  create: 'Utwórz',
  submit: 'Wyślij',
  close: 'Zamknij',
  
  // Object creation
  newObject: 'Nowy obiekt',
  objectTitle: 'Tytuł',
  objectContent: 'Treść do analizy',
  selectLens: 'Wybierz soczewkę',
  lensA: 'Soczewka A',
  lensB: 'Soczewka B',
  
  // Status
  loading: 'Ładowanie...',
  saving: 'Zapisywanie...',
  saved: 'Zapisano',
  error: 'Błąd',
  success: 'Sukces',
  
  // Errors
  errorGeneric: 'Coś poszło nie tak. Spróbuj ponownie.',
  errorNetwork: 'Problem z połączeniem. Sprawdź internet.',
  errorAuth: 'Sesja wygasła. Zaloguj się ponownie.',
  errorValidation: 'Sprawdź wprowadzone dane.',
  
  // Crisis/Safety - NO therapeutic language per compliance
  safetyTitle: 'Wsparcie dostępne',
  safetySubtitle: 'Wykryliśmy treści wymagające uwagi',
  safetyResources: 'Zasoby wsparcia',
  safetyContinue: 'Rozumiem',
  
  // Auth
  signIn: 'Zaloguj się',
  signOut: 'Wyloguj',
  signUp: 'Zarejestruj się',
  email: 'Email',
  password: 'Hasło',
  
  // Tier
  freeTier: 'Darmowy',
  proTier: 'Pro',
  upgrade: 'Ulepsz do Pro',
};

export const COPY_EN: CopyStrings = {
  // App
  appName: 'PatternLens',
  tagline: 'Construction tool for pattern analysis',
  
  // Navigation
  dashboard: 'Dashboard',
  archive: 'Archive',
  patterns: 'Patterns',
  settings: 'Settings',
  
  // Actions
  save: 'Save',
  cancel: 'Cancel',
  delete: 'Delete',
  edit: 'Edit',
  create: 'Create',
  submit: 'Submit',
  close: 'Close',
  
  // Object creation
  newObject: 'New object',
  objectTitle: 'Title',
  objectContent: 'Content for analysis',
  selectLens: 'Select lens',
  lensA: 'Lens A',
  lensB: 'Lens B',
  
  // Status
  loading: 'Loading...',
  saving: 'Saving...',
  saved: 'Saved',
  error: 'Error',
  success: 'Success',
  
  // Errors
  errorGeneric: 'Something went wrong. Please try again.',
  errorNetwork: 'Connection issue. Check your internet.',
  errorAuth: 'Session expired. Please sign in again.',
  errorValidation: 'Please check your input.',
  
  // Crisis/Safety - NO therapeutic language per compliance
  safetyTitle: 'Support available',
  safetySubtitle: 'We detected content requiring attention',
  safetyResources: 'Support resources',
  safetyContinue: 'I understand',
  
  // Auth
  signIn: 'Sign in',
  signOut: 'Sign out',
  signUp: 'Sign up',
  email: 'Email',
  password: 'Password',
  
  // Tier
  freeTier: 'Free',
  proTier: 'Pro',
  upgrade: 'Upgrade to Pro',
};

export const COPY: Record<Locale, CopyStrings> = {
  pl: COPY_PL,
  en: COPY_EN,
};

/**
 * Get copy for a specific locale
 */
export function getCopy(locale: Locale = 'pl'): CopyStrings {
  return COPY[locale] || COPY_PL;
}

/**
 * Get a specific string with fallback
 */
export function t(key: keyof CopyStrings, locale: Locale = 'pl'): string {
  const copy = getCopy(locale);
  return copy[key] || COPY_PL[key] || key;
}

export default COPY;
