/**
 * [PATH]: 04_packages/@silence/types/metering.ts
 *
 * Open-core metering types — readable by garden app without EE import.
 * S11-safe. MIT license.
 */

export interface QuotaProfile {
  readonly userId: string;
  readonly monthlyQuota: number;
  readonly currentUsage: number;
  readonly quotaResetsAt: string; // ISO-8601
  readonly plan: 'free' | 'pro' | 'enterprise';
}

export type QuotaStatus = 'ok' | 'warning' | 'exceeded';

export interface UsageRecord {
  readonly userId: string;
  readonly orgId?: string;
  readonly eventType: 'intervention' | 'insight' | 'api_call';
  readonly timestamp: string; // ISO-8601
  readonly inputHash: string;
}

export interface MeteringStatus {
  readonly allowed: boolean;
  readonly remaining: number;
  readonly status: QuotaStatus;
  readonly profile: QuotaProfile;
}
