'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ConstructionDisclaimer } from '@/components/ConstructionDisclaimer';
import { CrisisModal } from '@/components/CrisisModal';
import { useAppStore } from '@/lib/store';
import { detectCrisis, shouldBlock, type CrisisLevel } from '@/lib/crisis';
import type { InputMeta } from '@/lib/types';

export default function InputPage() {
  const router = useRouter();
  const { profile } = useAppStore();
  const [input, setInput] = useState('');
  const [source, setSource] = useState<InputMeta['source']>('self');
  const [intensity, setIntensity] = useState<InputMeta['intensity']>(3);
  const [context, setContext] = useState('');
  const [crisisLevel, setCrisisLevel] = useState<CrisisLevel>('none');
  const [showCrisis, setShowCrisis] = useState(false);

  const length = input.trim().length;
  const canSubmit = length >= 50 && length <= 5000;

  function handleAnalyze() {
    const result = detectCrisis(input);
    setCrisisLevel(result.level);
    setShowCrisis(true);

    if (shouldBlock(result.level)) {
      return;
    }

    const searchParams = new URLSearchParams();
    searchParams.set('input', encodeURIComponent(input));
    searchParams.set('source', source);
    searchParams.set('intensity', String(intensity));
    searchParams.set('context', encodeURIComponent(context));
    router.push(`/report?${searchParams.toString()}`);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-light">Wejście</h1>
        <p className="text-neutral-400">Opisz obserwowany wzorzec. Używaj języka struktury, nie diagnozy.</p>
      </div>

      {profile && (
        <div className="text-sm text-neutral-500">
          Profil: <span className="text-neutral-300">{profile.name}</span> · {profile.focus} · {profile.depth}
        </div>
      )}

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Na przykład: zauważyłem, że kiedy natężenie bodźców rośnie, moja uwaga rozdziela się na równoległe ścieżki..."
        className="h-48 w-full rounded border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm outline-none focus:border-neutral-500"
      />

      <div className="flex items-center justify-between text-xs text-neutral-500">
        <span>{length} / 5000</span>
        <span>{length < 50 ? `Minimum ${50 - length} znaków` : 'OK'}</span>
      </div>

      <div className="grid gap-4 rounded-lg border border-neutral-800 bg-neutral-900/50 p-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm text-neutral-400">Źródło obserwacji</label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value as InputMeta['source'])}
            className="w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm"
          >
            <option value="self">Własna obserwacja</option>
            <option value="observed">Obserwacja zewnętrzna</option>
            <option value="system">Sygnał systemowy</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-neutral-400">Intensywność napięcia: {intensity}</label>
          <input
            type="range"
            min={1}
            max={5}
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value) as InputMeta['intensity'])}
            className="w-full"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm text-neutral-400">Kontekst (opcjonalnie)</label>
          <input
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Gdzie / kiedy pojawia się ten wzorzec?"
            className="w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <button
        onClick={handleAnalyze}
        className={`w-full rounded px-4 py-3 text-sm font-medium ${
          canSubmit
            ? 'bg-neutral-100 text-neutral-950 hover:bg-neutral-200'
            : 'cursor-not-allowed bg-neutral-800 text-neutral-500 opacity-60'
        }`}
      >
        Analizuj wzorzec
      </button>

      <ConstructionDisclaimer />

      <CrisisModal open={showCrisis} level={crisisLevel} onClose={() => setShowCrisis(false)} />
    </div>
  );
}
