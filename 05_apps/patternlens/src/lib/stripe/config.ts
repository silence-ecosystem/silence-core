import Stripe from "stripe";

// Lazy initialization to avoid errors during build
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      typescript: true,
    });
  }
  return stripeInstance;
}

// Legacy export for backwards compatibility
export const stripe = {
  get customers() { return getStripe().customers; },
  get checkout() { return getStripe().checkout; },
  get billingPortal() { return getStripe().billingPortal; },
  get webhooks() { return getStripe().webhooks; },
  get subscriptions() { return getStripe().subscriptions; },
};

// Multi-currency pricing configuration
// Set these price IDs in Stripe Dashboard for each currency
export const PRICE_IDS = {
  USD: process.env.STRIPE_PRICE_USD || process.env.STRIPE_PRO_PRICE_ID || "",
  GBP: process.env.STRIPE_PRICE_GBP || process.env.STRIPE_PRO_PRICE_ID || "",
  PLN: process.env.STRIPE_PRICE_PLN || process.env.STRIPE_PRO_PRICE_ID || "",
  EUR: process.env.STRIPE_PRICE_EUR || process.env.STRIPE_PRO_PRICE_ID || "",
} as const;

// Display prices (for UI)
export const DISPLAY_PRICES = {
  USD: { amount: 12.99, symbol: "$", locale: "en-US" },
  GBP: { amount: 10.99, symbol: "£", locale: "en-GB" },
  PLN: { amount: 49, symbol: "zł", locale: "pl-PL" },
  EUR: { amount: 11.99, symbol: "€", locale: "de-DE" },
} as const;

export type SupportedCurrency = keyof typeof PRICE_IDS;

// Get price ID based on currency/region
export function getPriceId(currency: SupportedCurrency = "PLN"): string {
  return PRICE_IDS[currency] || PRICE_IDS.PLN;
}

// Map locale to currency
export function getCurrencyFromLocale(locale: string): SupportedCurrency {
  const localeMap: Record<string, SupportedCurrency> = {
    "en-US": "USD",
    "en-GB": "GBP",
    "pl-PL": "PLN",
    "pl": "PLN",
    "de-DE": "EUR",
    "de": "EUR",
    "fr-FR": "EUR",
    "fr": "EUR",
  };

  // Try exact match first
  if (localeMap[locale]) {
    return localeMap[locale];
  }

  // Try language code only
  const langCode = locale.split("-")[0];
  if (localeMap[langCode]) {
    return localeMap[langCode];
  }

  // Default to PLN
  return "PLN";
}

// Get Stripe locale from currency
export function getStripeLocale(currency: SupportedCurrency): string {
  const localeMap: Record<SupportedCurrency, string> = {
    USD: "en",
    GBP: "en",
    PLN: "pl",
    EUR: "de",
  };
  return localeMap[currency] || "pl";
}

// Pricing configuration
export const STRIPE_CONFIG = {
  // Default price ID (PLN)
  proPriceId: process.env.STRIPE_PRO_PRICE_ID || "",

  // Webhook secret for verifying signatures
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",

  // URLs
  successUrl: `${process.env.NEXT_PUBLIC_APP_URL || ""}/settings?upgrade=success`,
  cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || ""}/settings?upgrade=cancelled`,
} as const;

// Product metadata
export const PRO_FEATURES = [
  "Nieograniczone Obiekty",
  "Wzorce w czasie",
  "Eksport danych JSON",
  "Priorytetowe przetwarzanie",
  "Zaawansowana analiza",
] as const;

// Default price display (PLN)
export const PRO_PRICE = {
  amount: 49,
  currency: "PLN",
  interval: "miesiąc",
} as const;
