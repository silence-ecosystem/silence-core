'use client';

import { ConfidenceBar } from './ConfidenceBar';
import { AccordionSection } from './AccordionSection';

interface LensSection {
  title: string;
  content: string;
  subtext?: string;
}

interface LensInterpretation {
  name: string;
  confidence: number;
  sections: {
    context: LensSection;
    tension: LensSection;
    meaning: LensSection;
    function: LensSection;
  };
}

interface LensCardProps {
  label: string;
  interpretation: LensInterpretation;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function LensCard({
  label,
  interpretation,
  isSelected,
  onSelect,
}: LensCardProps) {
  const { name, confidence, sections } = interpretation;

  return (
    <div
      className={`bg-[var(--bg-surface)] border rounded-lg overflow-hidden transition-all ${
        isSelected
          ? 'border-[var(--primary)] shadow-[0_0_0_1px_rgba(74,144,226,0.3)]'
          : 'border-[var(--border)] hover:border-[var(--border-hover)]'
      }`}
    >
      {/* Header */}
      <div className="p-5 pb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            {label}
          </span>
          {onSelect && (
            <button
              onClick={onSelect}
              className={`text-xs px-3 py-1 rounded transition-colors ${
                isSelected
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--primary)]'
              }`}
            >
              {isSelected ? 'Wybrano' : 'Wybierz'}
            </button>
          )}
        </div>
        <h3 className="text-base font-semibold text-[var(--text-primary)] mb-3">{name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-muted)]">Confidence:</span>
          <ConfidenceBar value={confidence} />
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="px-5 pb-2">
        <AccordionSection
          title="Kontekst"
          content={sections.context.content}
          subtext={sections.context.subtext}
          defaultOpen={false}
        />
        <AccordionSection
          title="Napiecie"
          content={sections.tension.content}
          subtext={sections.tension.subtext}
          defaultOpen={true}
        />
        <AccordionSection
          title="Znaczenie"
          content={sections.meaning.content}
          subtext={sections.meaning.subtext}
          defaultOpen={false}
        />
        <AccordionSection
          title="Funkcja"
          content={sections.function.content}
          subtext={sections.function.subtext}
          defaultOpen={false}
        />
      </div>
    </div>
  );
}
