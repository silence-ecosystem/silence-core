'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Archive, Settings, FilePlus } from 'lucide-react';
import { ConstructionDisclaimer } from '@/components/ConstructionDisclaimer';
import { useAppStore } from '@/lib/store';
import { generateReport, PHASES, PHASE_LABELS } from '@/lib/report';
import type { Report, InputMeta, Profile } from '@/lib/types';

const DEFAULT_PROFILE: Profile = {
  name: 'Użytkownik',
  focus: 'pattern',
  depth: 'standard',
  neurotype: 'default',
};

const FOCUS_LABELS: Record<Profile['focus'], string> = {
  pattern: 'Wzorzec',
  rhythm: 'Rytm',
  tension: 'Napięcie',
  function: 'Funkcja',
  structure: 'Struktura',
};

const SOURCE_LABELS: Record<InputMeta['source'], string> = {
  self: 'Własna obserwacja',
  observed: 'Obserwacja zewnętrzna',
  system: 'Systemowy zapis',
};

function confidenceLabel(confidence: number): string {
  if (confidence < 0.58) return 'niska';
  if (confidence < 0.74) return 'umiarkowana';
  return 'wysoka';
}

function trendLabel(trend: NonNullable<Report['comparison']>['trend']): string {
  switch (trend) {
    case 'rising':
      return 'Rosnąca intensywność';
    case 'falling':
      return 'Malejąca intensywność';
    case 'stable':
      return 'Stabilna intensywność';
    case 'new':
      return 'Pierwszy zapis';
  }
}

type ReportContentProps = {
  input: string;
  source: InputMeta['source'];
  intensity: InputMeta['intensity'];
  context: string;
};

export default function ReportContent({ input, source, intensity, context }: ReportContentProps) {
  const { profile, reports, addReport } = useAppStore();
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);
  const generatedRef = useRef(false);

  useEffect(() => {
    if (generatedRef.current) return;
    generatedRef.current = true;

    if (input.trim().length === 0) {
      setError('Brak treści wejściowej.');
      return;
    }

    const meta: InputMeta = { source, intensity, context };
    const userProfile = profile || DEFAULT_PROFILE;

    const generated = generateReport(input, meta, userProfile, reports);

    if (generated.crisisBlocked) {
      setError('Wejście zawierało treści kryzysowe. Raport nie został wygenerowany.');
      return;
    }

    setReport(generated);
    addReport(generated);
  }, [input, source, intensity, context, profile, reports, addReport]);

  if (error) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-2xl font-light">Raport zablokowany</h1>
        <p className="rounded-lg border border-red-900/30 bg-red-950/20 p-4 text-red-400">{error}</p>
        <Link
          href="/input"
          className="inline-flex items-center gap-2 rounded border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Wróć do wejścia
        </Link>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <h1 className="text-2xl font-light">Generowanie raportu</h1>
        <div className="h-2 w-full animate-pulse rounded bg-neutral-800" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <header className="space-y-1">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-light">Raport strukturalny</h1>
          <span className="text-xs text-neutral-500">
            {new Date(report.createdAt).toLocaleString('pl-PL')}
          </span>
        </div>
        <p className="text-sm text-neutral-500">
          Focus: <span className="text-neutral-300">{FOCUS_LABELS[profile?.focus ?? DEFAULT_PROFILE.focus]}</span>
        </p>
      </header>

      <section className="grid gap-3 rounded-lg border border-neutral-800 bg-neutral-900/50 p-5 text-sm sm:grid-cols-3">
        <div>
          <p className="text-neutral-500">Źródło</p>
          <p className="text-neutral-200">{SOURCE_LABELS[report.meta.source]}</p>
        </div>
        <div>
          <p className="text-neutral-500">Intensywność</p>
          <p className="text-neutral-200">{report.meta.intensity} / 5</p>
        </div>
        <div>
          <p className="text-neutral-500">Kontekst</p>
          <p className="truncate text-neutral-200">{report.meta.context || '—'}</p>
        </div>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-400">Confidence</span>
          <span className="font-medium text-neutral-200">
            {Math.round(report.confidence * 100)}% — {confidenceLabel(report.confidence)}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-800">
          <div
            className="h-full rounded-full bg-neutral-100 transition-all"
            style={{ width: `${Math.round(report.confidence * 100)}%` }}
          />
        </div>
      </section>

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
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-amber-500">
          Alternatywne odczyty
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-neutral-300">
          {report.alternatives.map((alt, index) => (
            <li key={index}>{alt}</li>
          ))}
        </ul>
      </section>

      {report.comparison && (
        <section className="rounded-lg border border-blue-900/30 bg-blue-950/20 p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium uppercase tracking-wide text-blue-400">
              Porównanie z archiwum
            </h2>
            <span className="text-xs text-blue-300/80">{trendLabel(report.comparison.trend)}</span>
          </div>
          <p className="mb-4 text-sm text-neutral-300">{report.comparison.summary}</p>
          <div className="space-y-2">
            {report.comparison.previous.map((prev) => (
              <div
                key={prev.id}
                className="flex items-center justify-between rounded border border-blue-900/20 bg-blue-950/30 px-3 py-2 text-xs"
              >
                <span className="text-neutral-400">
                  {new Date(prev.createdAt).toLocaleDateString('pl-PL')}
                </span>
                <span className="text-neutral-300">
                  podobieństwo {Math.round(prev.similarityScore * 100)}% · intensywność {prev.intensity}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-wrap gap-3">
        <Link
          href="/archive"
          className="inline-flex items-center gap-2 rounded border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-900"
        >
          <Archive className="h-4 w-4" />
          Archiwum
        </Link>
        <Link
          href="/input"
          className="inline-flex items-center gap-2 rounded bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-neutral-200"
        >
          <FilePlus className="h-4 w-4" />
          Nowe wejście
        </Link>
        <Link
          href="/settings"
          className="inline-flex items-center gap-2 rounded border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-900"
        >
          <Settings className="h-4 w-4" />
          Ustawienia
        </Link>
      </div>

      <ConstructionDisclaimer />
    </div>
  );
}
