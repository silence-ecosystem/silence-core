'use client';

import { useState } from 'react';
import { colors, timing, easing, radius, rgba } from '@/lib/tokens';

interface Props {
  onSelect: (state: 'FLOW' | 'FOCUS' | 'CALM') => void;
  onNext: () => void;
  onBack: () => void;
}

const OPTIONS = [
  { state: 'FLOW', label: 'Flow', desc: 'Ease and continuity' },
  { state: 'FOCUS', label: 'Focus', desc: 'Concentration and precision' },
  { state: 'CALM', label: 'Calm', desc: 'Stillness and restoration' },
] as const;

export type PreferredState = 'FLOW' | 'FOCUS' | 'CALM';

export default function IntentSelector({ onSelect, onNext, onBack }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
      <h2 style={{ fontWeight: 300, fontSize: '1.75rem', marginBottom: '0.5rem' }}>Set your intent</h2>
      <p style={{ color: colors.textSecondary, marginBottom: '2rem' }}>
        Choose the state that resonates right now.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
        {OPTIONS.map((opt) => {
          const isActive = selected === opt.state;
          return (
            <button
              key={opt.state}
              onClick={() => setSelected(opt.state)}
              style={{
                padding: '1rem',
                borderRadius: radius.lg,
                border: `1px solid ${isActive ? colors.accentPrimary : colors.surfaceRaised}`,
                background: isActive ? rgba(colors.accentPrimary, 0.06) : 'transparent',
                color: isActive ? colors.accentPrimary : colors.textPrimary,
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: `border-color ${timing.micro}ms ${easing.phiInOut}, background ${timing.micro}ms ${easing.phiInOut}`,
              }}
            >
              <span style={{ fontWeight: 500 }}>{opt.label}</span>
              <span style={{ fontSize: '0.875rem', color: colors.textMuted }}>{opt.desc}</span>
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
              onSelect(selected as 'FLOW' | 'FOCUS' | 'CALM');
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
