'use client';

import React from 'react';
import type { GardenState, Plant } from '@/lib/gardenTypes';
import { colors } from '@/lib/tokens';

interface Props {
  state: GardenState | null;
  plant: Plant | null;
}

export default function GardenHUD({ state, plant }: Props) {
  if (!state || !plant) return null;

  const streakFire = state.ritualStreak >= 3 ? <span aria-label="streak active">🔥</span> : '';

  return (
    <div role="list" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', padding: '1rem' }}>
      <div role="listitem" style={{ textAlign: 'center' }} aria-label={`Growth level ${plant.growthLevel.toFixed(1)}`}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.textPrimary }}>
          {plant.growthLevel.toFixed(1)}
        </div>
        <div style={{ fontSize: '0.75rem', color: colors.textMuted }}>GROWTH</div>
      </div>
      <div role="listitem" style={{ textAlign: 'center' }} aria-label={`Streak ${state.ritualStreak} days`}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.textPrimary }}>
          {state.ritualStreak} {streakFire}
        </div>
        <div style={{ fontSize: '0.75rem', color: colors.textMuted }}>STREAK</div>
      </div>
      <div role="listitem" style={{ textAlign: 'center' }} aria-label={`Essence ${state.essence}`}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.textPrimary }}>
          {state.essence}
        </div>
        <div style={{ fontSize: '0.75rem', color: colors.textMuted }}>ESSENCE</div>
      </div>
      {plant.glowUnlocked && (
        <div role="listitem" style={{ textAlign: 'center' }} aria-label="Glow unlocked">
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.textPrimary }}><span aria-hidden="true">✨</span></div>
          <div style={{ fontSize: '0.75rem', color: colors.textMuted }}>GLOW</div>
        </div>
      )}
    </div>
  );
}
