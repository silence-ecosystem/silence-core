// PatternLens — Pricing Configuration v5.0 (ADR §4.1)
// UNIFIED: 49 PLN | £10.99 | $12.99 | €11.99

export const PRICING = {
  PL: {
    amount: 49,
    currency: 'PLN',
    display: '49 PLN/mies.',
    displayShort: '49 PLN',
    interval: 'miesiąc',
    stripePrice: 'price_pl_monthly', // Replace with real Stripe price ID
  },
  UK: {
    amount: 10.99,
    currency: 'GBP',
    display: '£10.99/mo',
    displayShort: '£10.99',
    interval: 'month',
    stripePrice: 'price_uk_monthly',
  },
  US: {
    amount: 12.99,
    currency: 'USD',
    display: '$12.99/mo',
    displayShort: '$12.99',
    interval: 'month',
    stripePrice: 'price_us_monthly',
  },
  EU: {
    amount: 11.99,
    currency: 'EUR',
    display: '€11.99/mo',
    displayShort: '€11.99',
    interval: 'month',
    stripePrice: 'price_eu_monthly',
  },
} as const;

export type Region = keyof typeof PRICING;

export function getPricing(region: Region = 'PL') {
  return PRICING[region] ?? PRICING.PL;
}

export const FREE_TIER = {
  objectsPerWeek: 7,
  timeCapsules: 1,
  features: [
    'Nieograniczone lokalne obiekty',
    '1 Time Capsule',
    'Dual Lens interpretacje',
    'Archiwum (ostatnie 7)',
  ],
} as const;

export const PRO_TIER = {
  features: [
    'Bez limitu Obiektów',
    'Bez limitu Time Capsules',
    'Ghost Patterns',
    'Pełne Archiwum',
    'Eksport danych JSON',
  ],
} as const;
