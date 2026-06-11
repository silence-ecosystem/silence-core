'use client';

import { useState, useEffect, useCallback } from 'react';
import type { GardenState, Plant } from '@/lib/gardenTypes';
import {
  calculateRitualGrowth,
  calculateIdleGrowth,
  updateStreak,
  seedFirstPlant,
} from '@/lib/phiGrowth';
import { loadGardenState, saveGardenState } from '@/lib/gardenDB';

const DEFAULT_STATE: GardenState = {
  ritualStreak: 0,
  essence: 0,
  plants: [seedFirstPlant()],
  lastSessionTimestamp: 0,
  prestige: 0,
};

export function useGardenState() {
  const [state, setState] = useState<GardenState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setState(DEFAULT_STATE);
      setIsLoading(false);
      return;
    }
    loadGardenState()
      .then((loaded) => {
        if (!loaded || loaded.plants.length === 0) {
          setState(DEFAULT_STATE);
        } else {
          setState(loaded);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load garden state');
        setState(DEFAULT_STATE);
        setIsLoading(false);
      });
  }, []);

  const plant = state?.plants[0] ?? null;

  const persist = useCallback(
    (nextState: GardenState) => {
      setState(nextState);
      saveGardenState(nextState).catch(() => {
        // IndexedDB failed — fallback already handled inside gardenDB
      });
    },
    [setState]
  );

  const applyRitual = useCallback(
    (breathCount: number) => {
      if (!state || !plant) return;

      const ritualDate = new Date();
      const lastRitualDate = plant.lastRitualAt ? new Date(plant.lastRitualAt) : null;
      const isNewDay = !lastRitualDate || lastRitualDate.toDateString() !== ritualDate.toDateString();

      const newStreak = updateStreak(state.ritualStreak, plant.lastRitualAt, isNewDay);
      const growth = calculateRitualGrowth(plant.growthLevel, newStreak, breathCount);

      const updatedPlant: Plant = {
        ...plant,
        growthLevel: growth.newLevel,
        lastRitualAt: Date.now(),
        glowUnlocked: growth.glowUnlocked,
      };

      const updatedState: GardenState = {
        ...state,
        ritualStreak: newStreak,
        essence: state.essence + breathCount,
        plants: [updatedPlant],
        lastSessionTimestamp: Date.now(),
      };

      persist(updatedState);
    },
    [state, plant, persist]
  );

  const applyIdle = useCallback(() => {
    if (!state || !plant) return;

    const growth = calculateIdleGrowth(state.lastSessionTimestamp, plant.growthLevel, state.prestige);
    if (growth.delta > 0) {
      const updatedPlant: Plant = {
        ...plant,
        growthLevel: growth.newLevel,
        glowUnlocked: growth.glowUnlocked,
      };
      const updatedState: GardenState = {
        ...state,
        plants: [updatedPlant],
      };
      persist(updatedState);
    }
  }, [state, plant, persist]);

  return { state, plant, applyRitual, applyIdle, isLoading, error };
}
