/**
 * [PATH]: 03_ee/@silence/billing/src/lib/rich-402.ts
 *
 * Rich 402 response builder — G2 metering pipeline.
 */

import type { QuotaProfile, Rich402Response, UpgradeOption } from '../types/metering.js';

const UPGRADE_OPTIONS: readonly UpgradeOption[] = [
  {
    plan: 'pro',
    monthlyPrice: 29,
    currency: 'USD',
    features: [
      'Unlimited interventions',
      'Advanced rhythm analytics',
      'Priority support',
    ],
    url: '/upgrade/pro',
  },
  {
    plan: 'enterprise',
    monthlyPrice: 199,
    currency: 'USD',
    features: [
      'Organization-wide metering',
      'Custom integration',
      'Dedicated infrastructure',
      'SLA guarantee',
    ],
    url: '/upgrade/enterprise',
  },
];

const DATA_RETENTION_NOTE =
  'Usage data is retained for 90 days post-cancellation. ' +
  'Export available via dashboard before deletion.';

export function buildRich402(
  profile: QuotaProfile,
  missedInterventions: number,
  isDevOrStaging: boolean
): Rich402Response {
  const estimatedValueMissed =
    missedInterventions > 0
      ? `${(missedInterventions * 4.5).toFixed(2)} USD`
      : 'N/A';

  const debug = isDevOrStaging
    ? {
        userId: profile.userId,
        plan: profile.plan,
        resetDay: new Date(profile.quotaResetsAt).getDate(),
        computedAt: new Date().toISOString(),
      }
    : undefined;

  const response: Rich402Response = {
    currentUsage: profile.currentUsage,
    monthlyQuota: profile.monthlyQuota,
    quotaResetsAt: profile.quotaResetsAt,
    missedInterventions,
    estimatedValueMissed,
    upgradeOptions: UPGRADE_OPTIONS,
    dataRetentionNote: DATA_RETENTION_NOTE,
    ...(debug ? { debug } : {}),
  };

  return response;
}
