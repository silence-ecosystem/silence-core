/**
 * [PATH]: 03_ee/@silence/billing/src/types/metering.ts
 *
 * Metering and 402 response types — SSoT for G2 Billing EE.
 */

export interface UsageRecord {
  readonly userId: string;
  readonly orgId?: string;
  readonly eventType: 'intervention' | 'insight' | 'api_call';
  readonly timestamp: string; // ISO-8601
  readonly inputHash: string;
}

export interface QuotaProfile {
  readonly userId: string;
  readonly monthlyQuota: number;
  readonly currentUsage: number;
  readonly quotaResetsAt: string; // ISO-8601
  readonly plan: 'free' | 'pro' | 'enterprise';
}

export interface Rich402Response {
  readonly currentUsage: number;
  readonly monthlyQuota: number;
  readonly quotaResetsAt: string;
  readonly missedInterventions: number;
  readonly estimatedValueMissed: string; // formatted currency or "N/A"
  readonly upgradeOptions: readonly UpgradeOption[];
  readonly dataRetentionNote: string;
  readonly debug?: Record<string, unknown>; // dev/staging only
}

export interface UpgradeOption {
  readonly plan: string;
  readonly monthlyPrice: number;
  readonly currency: string;
  readonly features: readonly string[];
  readonly url: string;
}

export interface MeteringConfig {
  readonly defaultQuota: number;
  readonly resetDayOfMonth: number;
  readonly plans: ReadonlyMap<string, number>;
}
