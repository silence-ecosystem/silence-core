'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ConstructionDisclaimer } from '@/components/ConstructionDisclaimer';
import { useAppStore } from '@/lib/store';
import { saveConsent, hasValidConsent } from '@/lib/consent';
import type { Profile } from '@/lib/types';

const FOCUS_OPTIONS: Profile['focus'][] = ['pattern', 'rhythm', 'tension', 'function', 'structure'];
const DEPTH_OPTIONS: Profile['depth'][] = ['surface', 'standard', 'deep'];
const NEUROTYPE_OPTIONS: Profile['neurotype'][] = ['default', 'linear', 'parallel', 'sensory', 'conceptual'];

export default function OnboardingPage() {
  const router = useRouter();
  const { setProfile, setConsent, consent } = useAppStore();
  const [name, setName] = useState('');
  const [focus, setFocus] = useState<Profile['focus']>('pattern');
  const [depth, setDepth] = useState<Profile['depth']>('standard');
  const [neurotype, setNeurotype] = useState<Profile['neurotype']>('default');
  const [rodoData, setRodoData] = useState(false);
  const [rodoModel, setRodoModel] = useState(false);

  const canProceed = name.trim().length >= 2 && rodoData && rodoModel;

  function handleStart() {
    if (!canProceed) return;
    const profile: Profile = { name: name.trim(), focus, depth, neurotype };
    const newConsent = { rodoData, rodoModel, acceptedAt: new Date().toISOString() };
    setProfile(profile);
    setConsent(newConsent);
    saveConsent(newConsent);
    router.push('/input');
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-light tracking-tight">SILENCE.OBJECTS</h1>
        <p className="text-neutral-400">System konstrukcyjny. Ty decydujesz, jak czytasz własne wzorce.</p>
      </div>

      {consent && hasValidConsent(consent) && (
        <div className="rounded border border-green-900/50 bg-green-950/20 p-3 text-sm text-green-400">
          Znaleziono zapisany profil. Kontynuujesz jako gość lokalnie.
        </div>
      )}

      <section className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-900/50 p-5">
        <h2 className="text-lg font-medium">Profil obserwatora</h2>

        <div className="space-y-2">
          <label className="text-sm text-neutral-400">Jak możemy do Ciebie mówić?</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Imię lub pseudonim"
            className="w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-neutral-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-neutral-400">Co chcesz obserwować?</label>
          <div className="flex flex-wrap gap-2">
            {FOCUS_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setFocus(opt)}
                className={`rounded px-3 py-1.5 text-sm capitalize ${
                  focus === opt
                    ? 'bg-neutral-100 text-neutral-950'
                    : 'border border-neutral-700 text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-neutral-400">Głębokość analizy</label>
          <div className="flex gap-2">
            {DEPTH_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setDepth(opt)}
                className={`rounded px-3 py-1.5 text-sm capitalize ${
                  depth === opt
                    ? 'bg-neutral-100 text-neutral-950'
                    : 'border border-neutral-700 text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-neutral-400">Tryb poznawczy</label>
          <div className="flex flex-wrap gap-2">
            {NEUROTYPE_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setNeurotype(opt)}
                className={`rounded px-3 py-1.5 text-sm capitalize ${
                  neurotype === opt
                    ? 'bg-neutral-100 text-neutral-950'
                    : 'border border-neutral-700 text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-900/50 p-5">
        <h2 className="text-lg font-medium">Zgody RODO</h2>
        <label className="flex items-start gap-3 text-sm text-neutral-300">
          <input
            type="checkbox"
            checked={rodoData}
            onChange={(e) => setRodoData(e.target.checked)}
            className="mt-0.5"
          />
          <span>Rozumiem, że dane są przetwarzane lokalnie w mojej przeglądarce.</span>
        </label>
        <label className="flex items-start gap-3 text-sm text-neutral-300">
          <input
            type="checkbox"
            checked={rodoModel}
            onChange={(e) => setRodoModel(e.target.checked)}
            className="mt-0.5"
          />
          <span>Rozumiem, że model językowy generuje wzorce, a nie diagnozy.</span>
        </label>
      </section>

      <button
        onClick={handleStart}
        className={`w-full rounded px-4 py-3 text-sm font-medium ${
          canProceed
            ? 'bg-neutral-100 text-neutral-950 hover:bg-neutral-200'
            : 'cursor-not-allowed bg-neutral-800 text-neutral-500 opacity-60'
        }`}
      >
        Rozpocznij obserwację
      </button>

      <ConstructionDisclaimer />
    </div>
  );
}
