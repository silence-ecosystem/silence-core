'use client';

import { useMemo, useState } from 'react';
import { colors, timing, easing, radius } from '@/lib/tokens';

const CONSENTS = [
  {
    id: 'research_accepted',
    label: 'I can participate in anonymous scientific research',
    description:
      'Your anonymized thinking patterns can help us understand wellbeing patterns better.',
    required: false,
  },
  {
    id: 'terms_accepted',
    label: 'I accept the Terms of Service',
    description: 'φ-Garden does not replace medical advice or professional support.',
    required: true,
  },
] as const;

interface Props {
  onComplete: (consents: Record<string, boolean>) => void;
  onBack: () => void;
}

export default function ConsentsScreen({ onComplete, onBack }: Props) {
  const [consents, setConsents] = useState<Record<string, boolean>>({
    research_accepted: false,
    terms_accepted: false,
  });

  const toggle = (id: string) => {
    setConsents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allRequiredAccepted = useMemo(
    () => CONSENTS.filter((c) => c.required).every((c) => consents[c.id]),
    [consents]
  );

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
      <h2 style={{ fontWeight: 300, fontSize: '1.75rem', marginBottom: '0.5rem' }}>Consent</h2>
      <p style={{ color: colors.textSecondary, marginBottom: '2rem' }}>
        A few things to keep us both safe.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', textAlign: 'left' }}>
        {CONSENTS.map((consent) => (
          <label
            key={consent.id}
            style={{
              display: 'flex',
              gap: '0.75rem',
              padding: '1rem',
              borderRadius: radius.lg,
              border: `1px solid ${colors.surfaceRaised}`,
              cursor: 'pointer',
              alignItems: 'flex-start',
              transition: `border-color ${timing.micro}ms ${easing.phiInOut}`,
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = colors.surfaceHover)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = colors.surfaceRaised)}
          >
            <input
              type="checkbox"
              checked={consents[consent.id]}
              onChange={() => toggle(consent.id)}
              style={{ marginTop: 4, width: 18, height: 18, accentColor: colors.accentPrimary, cursor: 'pointer' }}
            />
            <div>
              <div style={{ fontWeight: 500 }}>
                {consent.label}
                {consent.required && (
                  <span style={{ color: colors.accentPrimary, marginLeft: 4 }}>*</span>
                )}
              </div>
              <div style={{ fontSize: '0.875rem', color: colors.textMuted }}>{consent.description}</div>
            </div>
          </label>
        ))}
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
          onClick={() => onComplete(consents)}
          style={{
            padding: '0.875rem 2rem',
            borderRadius: radius.md,
            border: `1px solid ${colors.accentPrimary}`,
            background: 'transparent',
            color: colors.accentPrimary,
            cursor: allRequiredAccepted ? 'pointer' : 'not-allowed',
            fontSize: '1rem',
            opacity: allRequiredAccepted ? 1 : 0.5,
            pointerEvents: allRequiredAccepted ? 'auto' : 'none',
            transition: `opacity ${timing.micro}ms ${easing.phiInOut}`,
          }}
        >
          Enter Garden
        </button>
      </div>
    </div>
  );
}
