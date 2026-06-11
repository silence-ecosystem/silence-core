/**
 * [PATH]: 05_apps/garden/lib/gardenTypes.ts
 *
 * Garden domain types — S11-safe structural vocabulary.
 */

export interface Plant {
  readonly id: string;
  growthLevel: number; // 0-13
  lastRitualAt: number; // timestamp ms
  glowUnlocked: boolean;
}

export interface GardenState {
  ritualStreak: number;
  essence: number;
  plants: Plant[];
  lastSessionTimestamp: number;
  prestige: number;
}
