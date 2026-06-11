/**
 * [PATH]: 04_packages/@silence/symbolic/src/SymbolicEngine.ts
 */
import { SilenceEventBus } from '@silence/events';
import { BehavioralEventType, SilenceEvent, UUID } from '@silence/contracts';
import { SymbolicInference, SymbolicState } from './types';

export class SymbolicEngine {
  private static userStateCache: Map<UUID, { lastLoop?: boolean, lastDrift?: boolean }> = new Map();

  static initialize() {
    const bus = SilenceEventBus.getInstance();

    // Sluchamy zdarzen Sekwencji (Loop)
    bus.subscribe(BehavioralEventType.SEQUENCE_COMPLETED, (event: any) => {
      this.updateState(event.userId, { lastLoop: true });
    });

    // Sluchamy zdarzen Rytmu (Drift)
    bus.subscribe(BehavioralEventType.CAPACITY_SHIFTED, (event: any) => {
      if (event.payload.level === 'low' || event.payload.level === 'unstable') {
        this.updateState(event.userId, { lastDrift: true });
      }
    });
  }

  private static updateState(userId: UUID, update: { lastLoop?: boolean, lastDrift?: boolean }) {
    const current = this.userStateCache.get(userId) || {};
    const next = { ...current, ...update };
    this.userStateCache.set(userId, next);

    this.evaluateInference(userId, next);
  }

  private static evaluateInference(userId: UUID, state: { lastLoop?: boolean, lastDrift?: boolean }) {
    // KLUCZOWA LOGIKA: FUZJA SYMBOLI
    if (state.lastLoop && state.lastDrift) {
      this.publishSymbol(userId, 'COGNITIVE_LOCKUP', ['sequence_loop', 'attentional_drift']);
      
      // Reset cache po wykryciu lockupu, aby uniknac spamu
      this.userStateCache.set(userId, {});
    }
  }

  private static publishSymbol(userId: UUID, symbol: SymbolicState, basis: string[]) {
    console.log(`[SYMBOLIC] Detected: ${symbol} for user ${userId} based on ${basis.join(' + ')}`);
    
    // W produkcji: SilenceEventBus.publish({ type: 'SYMBOLIC_INFERENCE_READY', ... })
  }
}
