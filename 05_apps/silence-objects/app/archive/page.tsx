'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trash2, FileText } from 'lucide-react';
import { ConstructionDisclaimer } from '@/components/ConstructionDisclaimer';
import { PaywallModal } from '@/components/PaywallModal';
import { useAppStore } from '@/lib/store';
import type { Report } from '@/lib/types';

export default function ArchivePage() {
  const { reports, deleteReport, deleteAllReports, subscription } = useAppStore();
  const [filter, setFilter] = useState('');
  const [paywallOpen, setPaywallOpen] = useState(false);

  const isPro = subscription === 'pro';
  const visibleReports = reports.slice(0, isPro ? undefined : 5);
  const filtered = visibleReports.filter((r) =>
    r.input.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-light">Archiwum</h1>
        <span className="text-sm text-neutral-500">
          {reports.length} raport{reports.length === 1 ? '' : reports.length < 5 ? 'y' : 'ów'}
          {!isPro && ' · wersja FREE pokazuje 5 ostatnich'}
        </span>
      </div>

      <div className="flex gap-3">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Szukaj w raportach"
          className="flex-1 rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm"
        />
        <button
          onClick={() => {
            if (!isPro) {
              setPaywallOpen(true);
              return;
            }
            deleteAllReports();
          }}
          className="rounded border border-red-900/50 px-3 py-2 text-sm text-red-400 hover:bg-red-950/20"
        >
          Usuń wszystkie
        </button>
      </div>

      <div className="space-y-3">
        {filtered.map((report) => (
          <ReportItem key={report.id} report={report} onDelete={() => deleteReport(report.id)} />
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-neutral-500">Brak raportów.</p>
        )}
      </div>

      <Link href="/input" className="inline-block rounded bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-neutral-200">
        Nowe wejście
      </Link>

      <ConstructionDisclaimer />

      <PaywallModal open={paywallOpen} onClose={() => setPaywallOpen(false)} trigger="masowe usuwanie" />
    </div>
  );
}

function ReportItem({ report, onDelete }: { report: Report; onDelete: () => void }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
      <div className="min-w-0 space-y-1">
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <FileText className="h-4 w-4" />
          <span>{new Date(report.createdAt).toLocaleDateString('pl-PL')}</span>
          <span>·</span>
          <span className="truncate">{report.input.slice(0, 80)}...</span>
        </div>
        <p className="text-xs text-neutral-500">Confidence: {Math.round(report.confidence * 100)}%</p>
      </div>
      <button
        onClick={onDelete}
        className="shrink-0 rounded p-2 text-neutral-400 hover:bg-neutral-800 hover:text-red-400"
        aria-label="Usuń raport"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
