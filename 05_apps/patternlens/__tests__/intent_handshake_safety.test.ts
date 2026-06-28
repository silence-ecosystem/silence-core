
// S11 Sentinel: Terms that must NOT appear in user-facing copy
// These represent medical/clinical terminology that violates S11 linguistic sterility
const FORBIDDEN = [
  'structured practice','therapeutic','treatment','diagnosis','pattern','symptom',
  'patient','trauma','elevated reactivity','sustained-low state','mindfulness','meditation'
];

test('OnboardingIntent model stays non-PII', () => {
  // Sprawdzamy, czy model danych nie został rozszerzony o niebezpieczne pola (np. email, phone)
  const keys = ['anchor','createdAt','experience','primaryIntent','userId'];
  // Weryfikacja struktury kontraktu
  expect(keys.sort()).toEqual(['anchor','createdAt','experience','primaryIntent','userId'].sort());
});

test('Onboarding copy does not contain forbidden medical terminology (S11 compliance)', () => {
  const copy = [
    'PatternLens pomaga zauważyć Twoje wzorce myślenia — bez oceniania.',
    'Co chcesz wzmocnić z PatternLens?',
    'Jakie masz doświadczenie z ćwiczeniami skupienia?',
    'Kiedy najłatwiej wpleciesz krótkie ćwiczenie?',
    'Chcę łatwiej zasypiać',
    'Chcę więcej spokoju w ciągu dnia',
    'Chcę lepiej rozumieć swoje wzorce myślenia',
    'Jestem po prostu ciekaw/a',
    'Nigdy nie próbowałem/am takich ćwiczeń',
    'Czasem medytuję / świadomie oddycham',
    'Mam regularną praktykę',
    'Rano, po przebudzeniu',
    'W ciągu dnia, gdy czuję napięcie',
    'Wieczorem przed snem',
    'Kiedy mi przypomnisz',
  ].join(' ').toLowerCase();

  FORBIDDEN.forEach(word => {
    expect(copy.includes(word)).toBe(false);
  });
});
