'use client';

import { colors, timing, easing, radius } from '@/lib/tokens';
import { getPhiDimensions } from '@/lib/phiGrowth';

interface Props {
  growthLevel: number;
}

export default function PlantSpiral({ growthLevel }: Props) {
  const { major, minor, spiralTurns, opacity } = getPhiDimensions(growthLevel);

  const points: string[] = [];
  const centerX = 150;
  const centerY = 150;

  for (let i = 0; i <= 360 * spiralTurns; i += 2) {
    const theta = (i * Math.PI) / 180;
    const r = major / (1 + spiralTurns * theta / (2 * Math.PI));
    const x = centerX + r * Math.cos(theta);
    const y = centerY + r * Math.sin(theta) * (minor / major);
    points.push(`${x},${y}`);
  }

  const polylinePoints = points.join(' ');

  return (
    <svg
      role="img"
      aria-label={`Plant spiral at growth level ${growthLevel.toFixed(1)}`}
      width="300"
      height="300"
      viewBox="0 0 300 300"
      style={{
        opacity,
        transition: `opacity ${timing.ease}ms ${easing.phiInOut}`,
        borderRadius: radius.md,
      }}
    >
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={colors.accentPrimary} stopOpacity="0.6" />
          <stop offset="100%" stopColor={colors.accentPrimary} stopOpacity="0" />
        </radialGradient>
      </defs>
      <polyline
        points={polylinePoints}
        fill="none"
        stroke={colors.accentPrimary}
        strokeWidth={2 + growthLevel * 0.3}
        strokeLinecap="round"
        style={{ transition: `stroke-width ${timing.base}ms ${easing.phiInOut}` }}
      />
      <circle
        cx={centerX}
        cy={centerY}
        r={4 + growthLevel * 0.8}
        fill={colors.accentPrimary}
        opacity={0.9}
      />
    </svg>
  );
}
