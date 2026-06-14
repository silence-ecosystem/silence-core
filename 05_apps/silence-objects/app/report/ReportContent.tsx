'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ConstructionDisclaimer } from '@/components/ConstructionDisclaimer';
import { useAppStore } from '@/lib/store';
import { detectCrisis, shouldBlock } from '@/lib/crisis';
import type { Report, ReportPhase, InputMeta } from '@/lib/types';

const PHASES: ReportPhase[] = ['context', 'tension', 'meaning', 'function'];
const PHASE_LABELS: Record<ReportPhase, string> = {
  context: 'Kontekst',
  tension: 'Napięcie',
  meaning: 'Znaczenie',
  function: 'Funkcja',
};

export default function ReportContent() {
  const searchParams = useSearchParams();
  const { addReport } = useAppStore();
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const input = decodeURIComponent(searchParams.get('input') || '');
    const crisis = detectCrisis(input);

    if (shouldBlock(crisis.level)) {
      setError('Wejście zawierało treści kryzysowe. Raport nie został wygenerowany.');
      return;
    }

    const meta: InputMeta = {
      source: (searchParams.get('source') as InputMeta['source']) || 'self',
      intensity: Number(searchParams.get('intensity') || 3) as InputMeta['intensity'],
      context: decodeURIComponent(searchParams.get('context') || ''),
    };

    const generated: Report = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      input,
      meta,
      phases: {
        context: `Opisany wzorzec pojawia się w kontekście ${meta.context || 'nieokreślonym'} z intensywnością ${meta.intensity}.`,
        tension: `Napięcie strukturalne jest zlokalizowane w obszarze ${meta.source}, z charakterystycznym wzorcem aktywacji.`,
        meaning: `Wzorzec można odczytać jako sygnał o równowadze między aktywacją a supresją w danym cyklu.`,
        function: `Funkcjonalnie ten wzorzec wydaje się regulować przepływ uwagi w obliczu wzmożonego natężenia bodźców.`,
      },
      confidence: 0.72,
      alternative: 'Alternatywny odczyt: obserwowany wzorzec może być efektem zmiany rytmu, a nie trwałej cechy.',
      crisisBlocked: false,
    };

    setReport(generated);
    addReport(generated);
  }, [searchParams, addReport]);

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-light">Raport zablokowany</h1>
        <p className="text-red-400">{error}</p>
        <Link href="/input" className="inline-block rounded border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-900">
          Wróć do wejścia
        </Link>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-light">Generowanie raportu</h1>
        <div className="h-2 w-full animate-pulse rounded bg-neutral-800" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-light">Raport strukturalny</h1>
        <p className="text-sm text-neutral-500">Confidence: {Math.round(report.confidence * 100)}%</p>
      </div>

      <div className="space-y-4">
        {PHASES.map((phase) => (
          <section key={phase} className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-5">
            <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-400">
              {PHASE_LABELS[phase]}
            </h2>
            <p className="text-neutral-200">{report.phases[phase]}</p>
          </section>
        ))}
      </div>

      <section className="rounded-lg border border-amber-900/30 bg-amber-950/20 p-5">
        <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-amber-500">
          Alternatywny odczyt
        </h2>
        <p className="text-neutral-300">{report.alternative}</p>
      </section>

      <div className="flex gap-3">
        <Link
          href="/archive"
          className="rounded border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-900"
        >
          Archiwum
        </Link>
        <Link
          href="/input"
          className="rounded bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-neutral-200"
        >
          Nowe wejście
        </Link>
      </div>

      <ConstructionDisclaimer />
    </div>
  );
}
