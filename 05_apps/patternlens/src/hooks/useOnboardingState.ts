'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Finite-step onboarding state machine with localStorage persistence.
 * Canonical sequence: WELCOME → INTENT → FIRST_OBSERVATION → BASELINE → CONSENTS → PLAN → PERMISSIONS.
 */

export type OnboardingStep =
  | 'WELCOME'
  | 'INTENT'
  | 'FIRST_OBSERVATION'
  | 'BASELINE'
  | 'CONSENTS'
  | 'PLAN'
  | 'PERMISSIONS'
  | 'COMPLETE';

export interface OnboardingState {
  step: OnboardingStep;
  primaryGoal: string | null;
  experienceLevel: string | null;
  practiceTime: string | null;
  firstObservationCategory: string | null;
  baselineResult: number | null;
  notificationOptIn: boolean | null;
  onboardingComplete: boolean;
}

const STORAGE_KEY = 'patternlens:onboarding-state';

const INITIAL: OnboardingState = {
  step: 'WELCOME',
  primaryGoal: null,
  experienceLevel: null,
  practiceTime: null,
  firstObservationCategory: null,
  baselineResult: null,
  notificationOptIn: null,
  onboardingComplete: false,
};

export function useOnboardingState() {
  const [state, setState] = useState<OnboardingState>(INITIAL);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<OnboardingState>;
        setState({ ...INITIAL, ...parsed });
      }
    } catch {
      // Ignore corrupt storage; fall back to initial state.
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors.
    }
  }, [state]);

  const setStep = useCallback((step: OnboardingStep) => {
    setState((s) => ({ ...s, step }));
  }, []);

  const setPrimaryGoal = useCallback((primaryGoal: string) => {
    setState((s) => ({ ...s, primaryGoal }));
  }, []);

  const setExperienceLevel = useCallback((experienceLevel: string) => {
    setState((s) => ({ ...s, experienceLevel }));
  }, []);

  const setPracticeTime = useCallback((practiceTime: string) => {
    setState((s) => ({ ...s, practiceTime }));
  }, []);

  const setFirstObservation = useCallback((firstObservationCategory: string) => {
    setState((s) => ({ ...s, firstObservationCategory }));
  }, []);

  const setBaselineResult = useCallback((baselineResult: number) => {
    setState((s) => ({ ...s, baselineResult }));
  }, []);

  const setNotificationOptIn = useCallback((notificationOptIn: boolean) => {
    setState((s) => ({ ...s, notificationOptIn }));
  }, []);

  const goNext = useCallback((from: OnboardingStep, to: OnboardingStep) => {
    setState((s) => (s.step === from ? { ...s, step: to } : s));
  }, []);

  const completeOnboarding = useCallback(() => {
    setState((s) => ({ ...s, step: 'COMPLETE', onboardingComplete: true }));
  }, []);

  const reset = useCallback(() => {
    setState(INITIAL);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return {
    state,
    setStep,
    setPrimaryGoal,
    setExperienceLevel,
    setPracticeTime,
    setFirstObservation,
    setBaselineResult,
    setNotificationOptIn,
    goNext,
    completeOnboarding,
    reset,
  };
}
