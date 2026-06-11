'use client';

import { useState } from 'react';
import { colors, timing, easing, radius, rgba } from '@/lib/tokens';

interface Props {
  onSelect: (difficulty: 'too_hard' | 'ok' | 'too_easy') => void;
  onNext: () => void;
  onBack: () => void;
}

const OPTIONS = [
  { value: 'too_hard', label: 'A bit much' },
  { value: 'ok', label: 'Just right' },
  { value: 'too_easy', label: 'Too gentle' },
] as const;

export type AhaDifficulty = (typeof OPTIONS)[number]['value'];

export default function SelfReport({ onSelect, onNext, onBack }: Props) {
  const [selected, setSelected] = useState<AhaDifficulty | null>(null);

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
      <h2 style={{ fontWeight: 300, fontSize: '1.75rem', marginBottom: '0.5rem' }}>How was that?</h2>
      <p style={{ color: colors.textSecondary, marginBottom: '2rem' }}>
        Your feedback shapes the next ritual.
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
