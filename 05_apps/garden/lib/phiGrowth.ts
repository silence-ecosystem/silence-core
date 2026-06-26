/**
 * [PATH]: 05_apps/garden/lib/phiGrowth.ts
 *
 * Growth calculations for garden — phi-derived, deterministic.
 */

import { PHI } from '@silence/sdk';
import type { Plant, GardenState } from './gardenTypes.js';

export function calculateRitualGrowth(
  currentLevel: number,
  streak: number,
  breathCount: number
): { newLevel: number; glowUnlocked: boolean } {
  const baseGrowth = breathCount * 0.1;
  const streakBonus = Math.min(streak * 0.05, 0.5);
  const newLevel = Math.min(13, currentLevel + baseGrowth + streakBonus);
  return {
    newLevel,
    glowUnlocked: newLevel >= 8,
  };
}

export function calculateIdleGrowth(
  lastSessionTimestamp: number,
  currentLevel: number,
  prestige: number
): { delta: number; newLevel: number; glowUnlocked: boolean } {
  const hoursInactive = (Date.now() - lastSessionTimestamp) / 3600000;
  if (hoursInactive < 1) return { delta: 0, newLevel: currentLevel, glowUnlocked: currentLevel >= 8 };

  const idleGrowth = Math.min(0.05 * hoursInactive, 0.3) * (1 + prestige * 0.1);
  const newLevel = Math.min(13, currentLevel + idleGrowth);
  return {
    delta: idleGrowth,
    newLevel,
    glowUnlocked: newLevel >= 8,
  };
}

export function updateStreak(
  currentStreak: number,
  lastRitualAt: number | null,
  isNewDay: boolean
): number {
  if (!lastRitualAt) return 1;
  if (isNewDay) return currentStreak + 1;
  return currentStreak;
}

export function seedFirstPlant(): Plant {
  return {
    id: 'plant-001',
    growthLevel: 0,
    lastRitualAt: 0,
    glowUnlocked: false,
  };
}

export function getPhiDimensions(growthLevel: number) {
  const major = 80 + growthLevel * 12;
  const minor = major / PHI;
  const spiralTurns = 1 + growthLevel * 0.3;
  const opacity = Math.min(1, 0.3 + growthLevel * 0.08);
  return { major, minor, spiralTurns, opacity };
}
