'use client';

import { colors, timing, easing, radius } from '@/lib/tokens';

interface Props {
  onProceed: () => void;
  onCrisis: () => void;
}

export default function CrisisFilter({ onProceed, onCrisis }: Props) {
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ fontWeight: 300, fontSize: '1.75rem', marginBottom: '1rem' }}>
        Before we begin
      </h1>
      <p style={{ color: colors.textSecondary, lineHeight: 1.6, marginBottom: '2rem' }}>
        φ-Garden is not a crisis service. If you are currently in acute emotional crisis,
        please connect with professional support first.
      </p>
      <button
        onClick={onProceed}
        style={{
          padding: '0.875rem 2rem',
          borderRadius: radius.md,
          border: `1px solid ${colors.surfaceHover}`,
          background: 'transparent',
          color: colors.textPrimary,
          cursor: 'pointer',
          fontSize: '1rem',
          transition: `border-color ${timing.micro}ms ${easing.phiInOut}`,
        }}
        onMouseEnter={(e) => ((e.target as HTMLElement).style.borderColor = colors.accentPrimary)}
        onMouseLeave={(e) => ((e.target as HTMLElement).style.borderColor = colors.surfaceHover)}
      >
        I understand — proceed
      </button>
      <button
        onClick={onCrisis}
        style={{
          display: 'block',
          margin: '1rem auto 0',
          padding: '0.875rem 2rem',
          borderRadius: radius.md,
          border: `1px solid ${colors.surfaceElevated}`,
          background: 'transparent',
          color: colors.textSecondary,
          cursor: 'pointer',
          fontSize: '1rem',
          transition: `color ${timing.micro}ms ${easing.phiInOut}`,
        }}
        onMouseEnter={(e) => ((e.target as HTMLElement).style.color = colors.textPrimary)}
        onMouseLeave={(e) => ((e.target as HTMLElement).style.color = colors.textSecondary)}
      >
        I need crisis support
      </button>
    </div>
  );
}
