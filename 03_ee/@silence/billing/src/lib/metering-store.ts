/**
 * [PATH]: 03_ee/@silence/billing/src/lib/metering-store.ts
 *
 * In-memory metering store — MVP baseline.
 * Production target: Supabase table with RLS (auth.uid() = user_id).
 */

import type { UsageRecord, QuotaProfile, QuotaStatus, MeteringStatus } from '@silence/types/metering';

const usageLog: UsageRecord[] = [];
const quotaMap = new Map<string, QuotaProfile>();
const userQueues = new Map<string, Promise<unknown>>();

const DEFAULT_QUOTA = 100;
const RESET_DAY = 1;
const WARNING_THRESHOLD = 0.8;

function getNextResetDate(): string {
  const now = new Date();
  const year = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();
  const month = now.getMonth() === 11 ? 0 : now.getMonth() + 1;
  return new Date(year, month, RESET_DAY).toISOString();
}

export function recordUsage(record: UsageRecord): void {
  usageLog.push(record);

  const profile = getQuotaProfile(record.userId);
  quotaMap.set(record.userId, {
    ...profile,
    currentUsage: profile.currentUsage + 1,
  });
}

export function recordUsageAsync(record: UsageRecord): Promise<void> {
  const previous = userQueues.get(record.userId) ?? Promise.resolve();
  const next = previous.then(() => recordUsage(record));
  userQueues.set(record.userId, next);
  return next as Promise<void>;
}

export function getQuotaProfile(userId: string): QuotaProfile {
  if (!quotaMap.has(userId)) {
    quotaMap.set(userId, {
      userId,
      monthlyQuota: DEFAULT_QUOTA,
      currentUsage: 0,
      quotaResetsAt: getNextResetDate(),
      plan: 'free',
    });
  }
  return quotaMap.get(userId)!;
}

export function checkQuota(userId: string): MeteringStatus {
  const profile = getQuotaProfile(userId);
  const remaining = profile.monthlyQuota - profile.currentUsage;
  const ratio = profile.currentUsage / profile.monthlyQuota;
  const status: QuotaStatus = remaining <= 0 ? 'exceeded' : ratio >= WARNING_THRESHOLD ? 'warning' : 'ok';
  return { allowed: remaining > 0, remaining, status, profile };
}

export function getUsageLogForUser(userId: string): readonly UsageRecord[] {
  return usageLog.filter((r) => r.userId === userId);
}

export function getMissedInterventions(userId: string): number {
  const profile = getQuotaProfile(userId);
  if (profile.currentUsage <= profile.monthlyQuota) return 0;
  return profile.currentUsage - profile.monthlyQuota;
}

export function resetQuotaIfNeeded(userId: string): QuotaProfile {
  const profile = getQuotaProfile(userId);
  const now = new Date();
  const resetAt = new Date(profile.quotaResetsAt);

  if (now >= resetAt) {
    const newProfile: QuotaProfile = {
      ...profile,
      currentUsage: 0,
      quotaResetsAt: getNextResetDate(),
    };
    quotaMap.set(userId, newProfile);
    return newProfile;
  }

  return profile;
}
