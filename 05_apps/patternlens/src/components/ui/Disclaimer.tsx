import { Info } from 'lucide-react';
import { DISCLAIMERS, HELPLINES } from '@/lib/messages';

export function Disclaimer() {
  return (
    <div className="mt-8 p-4 bg-[rgba(74,144,226,0.05)] border border-[rgba(74,144,226,0.15)] rounded-lg">
      <div className="flex gap-3">
        <Info className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" />
        <div className="text-sm text-[var(--text-secondary)]">
          <p className="mb-1">
            <span className="text-[var(--primary)] font-medium">
              {DISCLAIMERS.STRUCTURAL}
            </span>
          </p>
          <p className="text-[var(--text-muted)]">
            Jesli potrzebujesz wsparcia, skontaktuj sie z{' '}
            <span className="text-[var(--primary)]">{HELPLINES.PL.primary}</span> ({HELPLINES.PL.name}) lub{' '}
            <span className="text-[var(--primary)]">{HELPLINES.PL.emergency}</span> (Numer alarmowy).
          </p>
        </div>
      </div>
    </div>
  );
}
