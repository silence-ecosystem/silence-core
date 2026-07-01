/**
 * [PATH]: 05_apps/silence-objects/lib/store.ts
 *
 * Global Zustand store for SILENCE.OBJECTS Command Center.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Profile, Consent, Report, Subscription, LegacyReport } from './types';

export type State = {
  profile: Profile | null;
  consent: Consent | null;
  reports: Report[];
  subscription: Subscription;
  setProfile: (profile: Profile) => void;
  setConsent: (consent: Consent) => void;
  addReport: (report: Report) => void;
  deleteReport: (id: string) => void;
  deleteAllReports: () => void;
  upgrade: () => void;
};

function migrateReports(reports: unknown): Report[] {
  if (!Array.isArray(reports)) return [];

  return reports.map((r: LegacyReport | Report): Report => {
    if ('alternatives' in r && Array.isArray(r.alternatives)) {
      return r as Report;
    }

    const legacy = r as LegacyReport;
    return {
      ...legacy,
      alternatives: [legacy.alternative || ''],
    };
  });
}

export const useAppStore = create<State>()(
  persist(
    (set) => ({
      profile: null,
      consent: null,
      reports: [],
      subscription: 'free',
      setProfile: (profile) => set({ profile }),
      setConsent: (consent) => set({ consent }),
      addReport: (report) => set((state) => ({ reports: [report, ...state.reports] })),
      deleteReport: (id) =>
        set((state) => ({ reports: state.reports.filter((r) => r.id !== id) })),
      deleteAllReports: () => set({ reports: [] }),
      upgrade: () => set({ subscription: 'pro' }),
    }),
    {
      name: 'silence:store',
      version: 1,
      migrate: (persistedState: unknown, version) => {
        const state = persistedState as Partial<State>;
        if (version === 0 || !state.reports) {
          return {
            ...state,
            reports: migrateReports(state.reports),
          } as State;
        }
        return state as State;
      },
      partialize: (state) => ({
        profile: state.profile,
        consent: state.consent,
        reports: state.reports,
        subscription: state.subscription,
      }),
    }
  )
);
