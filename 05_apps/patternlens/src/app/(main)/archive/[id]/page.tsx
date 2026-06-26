'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { LensCard } from '@/components/ui/LensCard';
import { Disclaimer } from '@/components/ui/Disclaimer';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface PhaseContent {
  summary: string;
  details?: string;
  keywords?: string[];
}

interface InterpretationRow {
  id: string;
  object_id: string;
  lens: 'A' | 'B';
  phase_1_context: PhaseContent;
  phase_2_tension: PhaseContent;
  phase_3_meaning: PhaseContent;
  phase_4_function: PhaseContent;
  confidence_score: number | null;
  risk_level: string;
}

interface ObjectRow {
  id: string;
  input_text: string;
  input_method: 'text' | 'voice';
  selected_lens: 'A' | 'B' | null;
  detected_theme: string | null;
  created_at: string;
}

export default function ArchiveDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [object, setObject] = useState<ObjectRow | null>(null);
  const [lensA, setLensA] = useState<InterpretationRow | null>(null);
  const [lensB, setLensB] = useState<InterpretationRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLens, setSelectedLens] = useState<'A' | 'B' | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/reports/${params.id}`);
        const data = await response.json();
        setDebugInfo(JSON.stringify(data, null, 2));

        if (data.error || !data.report) {
          setError(data.error || 'Brak danych');
          setLoading(false);
          return;
        }

        setObject(data.report);
        setSelectedLens(data.report.selected_lens);

        if (data.interpretations) {
          setLensA(data.interpretations.find((i: InterpretationRow) => i.lens === 'A') || null);
          setLensB(data.interpretations.find((i: InterpretationRow) => i.lens === 'B') || null);
        }
        setLoading(false);
      } catch (err) {
        setError(`Fetch error: ${err}`);
        setLoading(false);
      }
    }
    if (params.id) fetchData();
  }, [params.id]);

  const handleSelectLens = async (lens: 'A' | 'B') => {
    if (!object) return;
    setSelectedLens(lens);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin" />
      </div>
    );
  }

  if (error || !object) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-4">
        <p className="text-[var(--text-secondary)]">{error || 'Obiekt nie znaleziony'}</p>
        <button onClick={() => router.push('/archive')} className="text-[var(--primary)] hover:underline">
          Powrot do Archiwum
        </button>
        <details className="mt-4 w-full max-w-2xl">
          <summary className="text-xs text-[var(--text-muted)] cursor-pointer">Debug</summary>
          <pre className="mt-2 p-3 bg-[var(--bg-surface)] rounded text-xs overflow-auto max-h-64">{debugInfo}</pre>
        </details>
      </div>
    );
  }

  const formattedDate = new Date(object.created_at).toLocaleDateString('pl-PL', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const transformToLensFormat = (row: InterpretationRow | null) => {
    if (!row) return null;
    const pct = row.confidence_score ? Math.round(row.confidence_score * 100) : 0;
    const sub = pct >= 80 ? 'Wysoka pewnosc' : pct >= 60 ? 'Srednia pewnosc' : 'Niska pewnosc';

    // Extract summary from JSONB phase fields
    const getContent = (phase: PhaseContent | string | undefined): string => {
      if (!phase) return '';
      if (typeof phase === 'string') return phase;
      return phase.summary || '';
    };

    return {
      name: getContent(row.phase_1_context).split('.')[0] || 'Interpretacja',
      confidence: pct,
      sections: {
        context: { title: 'Kontekst', content: getContent(row.phase_1_context), subtext: sub },
        tension: { title: 'Napiecie', content: getContent(row.phase_2_tension), subtext: sub },
        meaning: { title: 'Znaczenie', content: getContent(row.phase_3_meaning), subtext: sub },
        function: { title: 'Funkcja', content: getContent(row.phase_4_function), subtext: sub },
      },
    };
  };

  const lensAData = transformToLensFormat(lensA);
  const lensBData = transformToLensFormat(lensB);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <button onClick={() => router.push('/archive')} className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--primary)] mb-6">
        <ArrowLeft className="w-4 h-4" /><span className="text-sm">Powrot do archiwum</span>
      </button>
      <div className="flex items-center gap-3 mb-6">
        <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">{formattedDate}</p>
        {selectedLens && (
          <>
            <span className="text-[var(--border)]">•</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[rgba(74,222,128,0.1)] border border-[rgba(74,222,128,0.2)] text-xs text-[#4ade80]">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Wybrana: Lens {selectedLens}
            </span>
          </>
        )}
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-[400px] lg:flex-shrink-0">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] block mb-2">Input</span>
          <div className="bg-[rgba(74,144,226,0.08)] border border-[rgba(74,144,226,0.2)] rounded-lg p-5">
            <p className="font-mono text-base text-[var(--text-primary)]">{object.input_text}</p>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] block mb-2">Output</span>
          <div className="grid gap-6">
            {lensAData && <LensCard label="Lens A" interpretation={lensAData} isSelected={selectedLens === 'A'} onSelect={() => handleSelectLens('A')} />}
            {lensBData && <LensCard label="Lens B" interpretation={lensBData} isSelected={selectedLens === 'B'} onSelect={() => handleSelectLens('B')} />}
            {!lensAData && !lensBData && <div className="text-center py-12 text-[var(--text-muted)]">Brak interpretacji</div>}
          </div>
          <Disclaimer />
        </div>
      </div>
    </div>
  );
}
