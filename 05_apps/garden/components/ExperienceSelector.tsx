'use client';

import { useState } from 'react';
import { colors, timing, easing, radius, rgba } from '@/lib/tokens';

interface Props {
  onSelect: (level: 'none' | 'occasional' | 'regular') => void;
  onNext: () => void;
  onBack: () => void;
}

const OPTIONS = [
  { value: 'none', label: 'I am new to this' },
  { value: 'occasional', label: 'Sometimes I try' },
  { value: 'regular', label: 'I practice regularly' },
] as const;

export type ExperienceLevel = (typeof OPTIONS)[number]['value'];

export default function ExperienceSelector({ onSelect, onNext, onBack }: Props) {
  const [selected, setSelected] = useState<ExperienceLevel | null>(null);

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
      <h2 style={{ fontWeight: 300, fontSize: '1.75rem', marginBottom: '0.5rem' }}>Experience</h2>
      <p style={{ color: colors.textSecondary, marginBottom: '2rem' }}>
        This helps us tune the rhythm to your pace.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
        {OPTIONS.map((opt) => {
          const isActive = selected === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setSelected(opt.value)}
              style={{
                padding: '1rem',
                borderRadius: radius.lg,
                border: `1px solid ${isActive ? colors.accentPrimary : colors.surfaceRaised}`,
                background: isActive ? rgba(colors.accentPrimary, 0.06) : 'transparent',
                color: isActive ? colors.accentPrimary : colors.textPrimary,
                cursor: 'pointer',
                textAlign: 'left',
                transition: `border-color ${timing.micro}ms ${easing.phiInOut}, background ${timing.micro}ms ${easing.phiInOut}`,
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button
          onClick={onBack}
          style={{
            padding: '0.875rem 2rem',
            borderRadius: radius.md,
            border: `1px solid ${colors.surfaceElevated}`,
            background: 'transparent',
            color: colors.textMuted,
            cursor: 'pointer',
            fontSize: '1rem',
            transition: `color ${timing.micro}ms ${easing.phiInOut}`,
          }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.color = colors.textSecondary)}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.color = colors.textMuted)}
        >
          Back
        </button>
        <button
          onClick={() => {
            if (selected) {
              onSelect(selected);
              onNext();
            }
          }}
          style={{
            padding: '0.875rem 2rem',
            borderRadius: radius.md,
            border: `1px solid ${colors.accentPrimary}`,
            background: 'transparent',
            color: colors.accentPrimary,
            cursor: selected ? 'pointer' : 'not-allowed',
            fontSize: '1rem',
            opacity: selected ? 1 : 0.5,
            pointerEvents: selected ? 'auto' : 'none',
            transition: `opacity ${timing.micro}ms ${easing.phiInOut}`,
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
