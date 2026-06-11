/**
 * [PATH]: 04_packages/@silence/symbolic/src/types.ts
 */
import { UUID } from '@silence/contracts';

export type SymbolicState = 'COGNITIVE_LOCKUP' | 'FLOW_RESONANCE' | 'SYSTEM_DRIFT' | 'RECOVERY_ARC';

export interface SymbolicInference {
  userId: UUID;
  symbol: SymbolicState;
  confidence: number;
  basis: string[];
}
