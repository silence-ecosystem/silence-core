/**
 * [PATH]: 04_packages/@silence/capacity/src/types.ts
 */
import { UUID, Timestamp } from '@silence/contracts';

export type CapacityTier = 'OPTIMAL' | 'MODERATE' | 'STRETCHED' | 'DEPLETED';

export interface CapacityWindow {
  userId: UUID;
  tier: CapacityTier;
  estimatedMinutesRemaining: number;
  basisSymbol: string;
  timestamp: Timestamp;
}
