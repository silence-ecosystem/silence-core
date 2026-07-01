import type { Metadata } from 'next';
import VoiceLab from './components/VoiceLab';

export const metadata: Metadata = {
  title: 'Voice Analysis — PatternsLab',
  description: 'Structural pattern analysis via voice input.',
};

export default function VoicePage() {
  return (
    <main className="min-h-screen bg-[#0a0a12] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-100">Voice Analysis</h1>
          <p className="mt-1 text-sm text-slate-400">
            Record your input and receive structural pattern analysis.
          </p>
        </header>

        {/* Voice Lab — FULL safety mode */}
        <VoiceLab
          tier="PRO"
          role="therapist"
          locale="PL"
        />

        {/* Static Disclaimer — 02-SAFETY.md: always visible, non-reactive */}
        <footer className="mt-12 border-t border-slate-800 pt-6">
          <p className="text-xs text-slate-500 leading-relaxed">
            PatternsLab is a structural analysis tool. It does NOT provide
            diagnosis, treatment, or professional guidance. All analysis is
            pattern-based and should be verified against professional judgment.
            If you need immediate support, contact your local crisis service.
          </p>
        </footer>
      </div>
    </main>
  );
}
