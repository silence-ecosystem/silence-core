"use client";

import { useState, useEffect } from "react";
import { DISPLAY_PRICES, type SupportedCurrency } from "@/lib/stripe/config";
import { MESSAGES } from "@/lib/messages";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: "limit" | "feature" | "upgrade";
  featureName?: string;
}

const PRO_FEATURES = [
  { icon: "M12 4v16m8-8H4", text: "Nieograniczone Obiekty" },
  { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", text: "Wzorce w czasie" },
  { icon: "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", text: "Eksport danych JSON" },
  { icon: "M13 10V3L4 14h7v7l9-11h-7z", text: "Priorytetowe przetwarzanie" },
  { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", text: "Zaawansowana analiza" },
];

function getCurrencyFromLocale(locale: string): SupportedCurrency {
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

  if (localeMap[locale]) return localeMap[locale];

  const langCode = locale.split("-")[0];
  if (localeMap[langCode]) return localeMap[langCode];

  return "PLN";
}

export function PaywallModal({ isOpen, onClose, trigger = "upgrade", featureName }: PaywallModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useState<SupportedCurrency>("PLN");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const locale = navigator.language || "pl";
      setCurrency(getCurrencyFromLocale(locale));
    }
  }, []);

  if (!isOpen) return null;

  const price = DISPLAY_PRICES[currency];
  const priceFormatted = currency === "PLN"
    ? `${price.amount} ${price.symbol}`
    : `${price.symbol}${price.amount}`;

  const handleUpgrade = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currency,
          locale: navigator.language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Nie udało się utworzyć sesji płatności");
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił błąd");
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (trigger) {
      case "limit":
        return "Limit osiągnięty";
      case "feature":
        return featureName || "Funkcja PRO";
      default:
        return "Przejdź na PRO";
    }
  };

  const getSubtitle = () => {
    switch (trigger) {
      case "limit":
        return "Osiagnięto limit cloud obiektów. Ulepsz do PRO.";
      case "feature":
        return `${featureName} wymaga planu PRO`;
      default:
        return "Odblokuj pełny potencjał SILENCE.OBJECTS";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#161b22] border border-[#2d3748] rounded-xl overflow-hidden">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#6e7681] hover:text-[#f5f7fa] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[rgba(74,222,128,0.15)] flex items-center justify-center">
              <svg className="w-5 h-5 text-[#4ade80]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded bg-[rgba(74,222,128,0.15)] text-[#4ade80]">
                PRO
              </span>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-[#f5f7fa] mb-1">{getTitle()}</h2>
          <p className="text-sm text-[#6e7681]">{getSubtitle()}</p>
        </div>

        {/* Price */}
        <div className="px-6 py-4 bg-[#1a1f28]">
          <div className="flex items-baseline gap-1">
            {currency === "PLN" ? (
              <>
                <span className="text-2xl sm:text-3xl font-bold text-[#f5f7fa]">{price.amount}</span>
                <span className="text-lg text-[#8b949e]">{price.symbol}</span>
              </>
            ) : (
              <>
                <span className="text-lg text-[#8b949e]">{price.symbol}</span>
                <span className="text-2xl sm:text-3xl font-bold text-[#f5f7fa]">{price.amount}</span>
              </>
            )}
            <span className="text-sm text-[#6e7681]">/ miesiąc</span>
          </div>
        </div>

        {/* Features */}
        <div className="px-6 py-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[#6e7681] mb-3">
            PRO zawiera:
          </div>
          <ul className="space-y-3">
            {PRO_FEATURES.map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-[#8b949e]">
                <div className="w-6 h-6 rounded bg-[#0f1419] flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-[#4ade80]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                  </svg>
                </div>
                {feature.text}
              </li>
            ))}
          </ul>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mb-4 px-4 py-3 rounded-lg bg-[rgba(248,113,113,0.08)] border border-[rgba(248,113,113,0.2)] text-sm text-[#f87171]">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="px-6 pb-6 space-y-3">
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full min-h-[48px] px-6 py-3 bg-[#4ade80] hover:bg-[#22c55e] text-[#0f1419] font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
{MESSAGES.PROCESSING.PROCESSING}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Przejdź na PRO — {priceFormatted}/mies.
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full min-h-[44px] px-6 py-2 text-sm text-[#6e7681] hover:text-[#f5f7fa] transition-colors"
          >
            Zostań przy FREE
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 pb-4 text-center">
          <p className="text-xs text-[#6e7681]">
            Bezpieczna płatność przez Stripe. Możesz anulować w dowolnym momencie.
          </p>
        </div>
      </div>
    </div>
  );
}
