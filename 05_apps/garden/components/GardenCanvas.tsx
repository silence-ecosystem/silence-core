'use client';

import React, { useMemo } from 'react';
import type { Plant } from '@/lib/gardenTypes';
import PlantSpiral from './PlantSpiral';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { colors, timing, easing, radius, phiRandom } from '@/lib/tokens';

interface Props {
  plant: Plant;
}

function generateParticles(seedId: string, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const r = phiRandom(seedId, i);
    return {
      id: i,
      top: `${(r * 100).toFixed(2)}%`,
      left: `${(phiRandom(seedId, i + 1000) * 100).toFixed(2)}%`,
      size: 1 + phiRandom(seedId, i + 2000) * 2,
      opacity: 0.1 + phiRandom(seedId, i + 3000) * 0.3,
      duration: 10 + Math.floor(phiRandom(seedId, i + 4000) * 20),
    };
  });
}

export default function GardenCanvas({ plant }: Props) {
  const particles = useMemo(() => generateParticles(plant.id, 40), [plant.id]);
  const reducedMotion = useReducedMotion();

  return (
    <div
      role="img"
      aria-label="Garden canvas showing plant spiral"
      style={{
        position: 'relative',
        width: '100%',
        height: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: radius.lg,
        background: `radial-gradient(ellipse at center, ${colors.surfaceElevated} 0%, ${colors.surfaceBase} 100%)`,
      }}
    >
      {!reducedMotion && particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: colors.accentPrimary,
            opacity: p.opacity,
            animation: `float ${p.duration}s ${easing.phiMotion} infinite alternate`,
          }}
        />
      ))}
      <PlantSpiral growthLevel={plant.growthLevel} />
    </div>
  );
}
