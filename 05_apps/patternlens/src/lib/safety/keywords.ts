// ============================================
// src/lib/safety/keywords.ts
// PatternLens v4.0 - Crisis Keywords
// ============================================

export interface Helpline {
  id: string;
  name: string;
  phone: string;
  description: string;
  available?: string;
}

// HARD KEYWORDS - trigger immediate block
export const HARD_CRISIS_KEYWORDS = [
  // Polish
  'samobójstwo',
  'zabić się',
  'odebrać sobie życie',
  'chcę umrzeć',
  'nie chcę żyć',
  'skończę z tym',
  'zakończę to wszystko',
  'skok z mostu',
  'przedawkować',
  'powieszę się',
  'podetnę żyły',
  // English
  'suicide',
  'kill myself',
  'end my life',
  'want to die',
  'don\'t want to live'
];

// SOFT KEYWORDS - show warning but don't block
export const SOFT_CRISIS_KEYWORDS = [
  // Polish
  'depresja',
  'lęk',
  'panika',
  'beznadzieja',
  'pustka',
  'samookaleczenie',
  'ciemność',
  'bezsens',
  'nie mam siły',
  'nie daję rady',
  'załamanie',
  // English
  'depression',
  'anxiety',
  'hopeless',
  'self-harm',
  'panic'
];

// Polish helplines
export const HELPLINES: Helpline[] = [
  {
    id: 'telefon-zaufania',
    name: 'Telefon Zaufania dla Dzieci i Młodzieży',
    phone: '116 111',
    description: 'Bezpłatna pomoc dla dzieci i młodzieży',
    available: '24/7'
  },
  {
    id: 'centrum-wsparcia',
    name: 'Centrum Wsparcia dla osób dorosłych w kryzysie psychicznym',
    phone: '800 70 2222',
    description: 'Bezpłatna pomoc dla dorosłych',
    available: '24/7'
  },
  {
    id: 'emergency',
    name: 'Numer alarmowy',
    phone: '112',
    description: 'Służby ratunkowe',
    available: '24/7'
  },
  {
    id: 'antydepresyjny',
    name: 'Telefon Zaufania dla Dorosłych',
    phone: '116 123',
    description: 'Wsparcie emocjonalne',
    available: '14:00-22:00'
  }
];

export default { HARD_CRISIS_KEYWORDS, SOFT_CRISIS_KEYWORDS, HELPLINES };
