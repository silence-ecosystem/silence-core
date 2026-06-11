/**
 * [PATH]: 03_ee/@silence/billing/src/middleware/quota-enforcement.ts
 *
 * Quota enforcement middleware — returns 402 with rich response body
 * when user exceeds monthly intervention limit.
 */

import { checkQuota, resetQuotaIfNeeded, getMissedInterventions } from '../lib/metering-store.js';
import { buildRich402 } from '../lib/rich-402.js';
import type { QuotaProfile } from '@silence/types/metering';

export interface QuotaEnforcementResult {
  readonly allowed: boolean;
  readonly statusCode: 200 | 402 | 429;
  readonly body?: Record<string, unknown>;
  readonly headers?: Record<string, string>;
}

export function enforceQuota(userId: string, isDevOrStaging: boolean): QuotaEnforcementResult {
  const profile = resetQuotaIfNeeded(userId);
  const metering = checkQuota(userId);

  if (metering.status === 'ok') {
    return { allowed: true, statusCode: 200 };
  }

  if (metering.status === 'warning') {
    return {
      allowed: true,
      statusCode: 429,
      body: { quotaStatus: 'warning', remaining: metering.remaining, monthlyQuota: profile.monthlyQuota },
      headers: {
        'Content-Type': 'application/json',
        'X-Silence-Quota-Status': 'warning',
        'X-Silence-Quota-Remaining': String(metering.remaining),
      },
    };
  }

  const missed = getMissedInterventions(userId);
  const rich402 = buildRich402(profile, missed, isDevOrStaging);

  return {
    allowed: false,
    statusCode: 402,
    body: rich402 as unknown as Record<string, unknown>,
    headers: {
      'Content-Type': 'application/json',
      'X-Silence-Quota-Status': 'exceeded',
    },
  };
}
