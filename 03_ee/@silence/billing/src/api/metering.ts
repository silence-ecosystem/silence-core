/**
 * [PATH]: 03_ee/@silence/billing/src/api/metering.ts
 *
 * Metering endpoint — returns current usage and 402 if quota exceeded.
 */

import { getQuotaProfile, recordUsage, getUsageLogForUser } from '../lib/metering-store.js';
import { buildRich402 } from '../lib/rich-402.js';
import { enforceQuota } from '../middleware/quota-enforcement.js';

export interface MeteringStatusRequest {
  readonly userId: string;
  readonly isDevOrStaging: boolean;
}

export interface MeteringStatusResponse {
  readonly quota: ReturnType<typeof getQuotaProfile>;
  readonly usageLogLength: number;
  readonly rich402?: Record<string, unknown>;
}

export function getMeteringStatus(req: MeteringStatusRequest): MeteringStatusResponse {
  const quota = getQuotaProfile(req.userId);
  const usageLog = getUsageLogForUser(req.userId);

  return {
    quota,
    usageLogLength: usageLog.length,
  };
}

export { recordUsage, enforceQuota };
