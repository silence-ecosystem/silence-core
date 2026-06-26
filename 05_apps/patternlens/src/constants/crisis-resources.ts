// PatternLens — Crisis Resources
// ALWAYS VISIBLE, NEVER BEHIND PAYWALL

export const CRISIS_RESOURCES = {
  PL: {
    primary: {
      name: 'Telefon Zaufania',
      number: '116 123',
      tel: 'tel:116123',
      description: 'Wsparcie emocjonalne, 24/7',
    },
    emergency: {
      name: 'Numer Alarmowy',
      number: '112',
      tel: 'tel:112',
      description: 'Pogotowie, Policja, Straż',
    },
    secondary: {
      name: 'Centrum Wsparcia',
      number: '800 70 2222',
      tel: 'tel:800702222',
      description: 'Dla osób dorosłych w kryzysie psychicznym',
    },
    sms: {
      name: 'SMS Zaufania',
      number: '8148',
      sms: 'sms:8148?body=POMOC',
      description: 'Wyślij "POMOC"',
    },
  },
  UK: {
    primary: {
      name: 'Samaritans',
      number: '116 123',
      tel: 'tel:116123',
      description: 'Free 24/7 support',
    },
    emergency: {
      name: 'Emergency',
      number: '999',
      tel: 'tel:999',
      description: 'Police, Ambulance, Fire',
    },
    secondary: {
      name: 'SHOUT',
      number: '85258',
      sms: 'sms:85258?body=SHOUT',
      description: 'Text support',
    },
  },
  US: {
    primary: {
      name: 'Suicide & Crisis Lifeline',
      number: '988',
      tel: 'tel:988',
      description: 'Free 24/7 support',
    },
    emergency: {
      name: 'Emergency',
      number: '911',
      tel: 'tel:911',
      description: 'Police, Ambulance, Fire',
    },
    secondary: {
      name: 'Crisis Text Line',
      number: '741741',
      sms: 'sms:741741?body=HOME',
      description: 'Text HOME',
    },
  },
} as const;

export type CrisisRegion = keyof typeof CRISIS_RESOURCES;

export function getCrisisResources(region: CrisisRegion = 'PL') {
  return CRISIS_RESOURCES[region];
}

// Hard keywords — instant block
export const HARD_KEYWORDS = {
  EN: [
    'suicide', 'kill myself', 'want to die', 'end my life', 'end it all',
    'self-harm', 'cut myself', 'hurt myself', 'overdose', 'hang myself',
    'jump off', 'gun to my head', 'slit my wrists', 'take my life',
  ],
  PL: [
    'samobójstwo', 'zabić się', 'chcę umrzeć', 'zakończyć życie',
    'samookaleczenie', 'pociąć się', 'skrzywdzić się', 'przedawkować',
    'powiesić się', 'skoczyć z', 'podciąć żyły',
  ],
};

// Soft keywords — trigger Claude risk assessment
export const SOFT_KEYWORDS = {
  EN: [
    'hopeless', 'worthless', 'burden', 'cant go on', 'give up',
    'no point', 'better off without me', 'nobody cares', 'want out',
    'tired of living', 'no reason to live', 'disappear', 'escape',
  ],
  PL: [
    'beznadziejny', 'bezwartościowy', 'ciężar', 'nie dam rady',
    'poddaję się', 'nie ma sensu', 'lepiej beze mnie', 'nikt się nie przejmuje',
    'zmęczony życiem', 'zniknąć', 'uciec od wszystkiego',
  ],
};
