'use client';

import { Check } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { ConstructionDisclaimer } from '@/components/ConstructionDisclaimer';

const FEATURES = [
  'Nielimitowane raporty',
  'Porównywanie raportów',
  'Widok wzorca',
  'Eksport PDF',
  'Alternatywne odczyty',
];

export default function ProPage() {
  const { subscription, upgrade } = useAppStore();
  const isPro = subscription === 'pro';

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-light">SILENCE.OBJECTS Pro</h1>
        <p className="text-neutral-400">Pełna kontrola nad archiwum i wzorcami.</p>
      </div>

      <div className="rounded-2xl border border-amber-600/30 bg-gradient-to-b from-amber-950/20 to-neutral-900/50 p-8">
        <div className="mb-6 flex items-baseline justify-center gap-2">
          <span className="text-4xl font-light">29 zł</span>
          <span className="text-neutral-500">/ miesiąc</span>
        </div>

        <ul className="mx-auto max-w-xs space-y-3">
          {FEATURES.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm text-neutral-300">
              <Check className="h-4 w-4 text-amber-500" />
              {feature}
            </li>
          ))}
        </ul>

        <button
          onClick={upgrade}
          className={`mt-8 w-full rounded px-4 py-3 text-sm font-medium ${
            isPro
              ? 'cursor-not-allowed bg-neutral-800 text-neutral-500 opacity-60'
              : 'bg-neutral-100 text-neutral-950 hover:bg-neutral-200'
          }`}
        >
          {isPro ? 'Masz już wersję Pro' : 'Aktywuj Pro (symulacja)'}
        </button>
      </div>

      <ConstructionDisclaimer />
    </div>
  );
}
