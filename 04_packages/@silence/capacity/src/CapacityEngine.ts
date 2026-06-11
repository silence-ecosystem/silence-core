/**
 * [PATH]: 04_packages/@silence/capacity/src/CapacityEngine.ts
 */
import { SilenceEventBus } from '@silence/events';
import { BehavioralEventType, UUID } from '@silence/contracts';
import { CapacityTier, CapacityWindow } from './types';

export class CapacityEngine {
  private static BASELINE_MINUTES = 90; // Standardowe okno koncentracji

  static initialize() {
    const bus = SilenceEventBus.getInstance();

    // Sluchamy wysokopoziomowych symboli z @silence/symbolic
    // (W produkcji: symbolic emituje zdarzenie SYMBOLIC_INFERENCE_READY)
    bus.subscribe(BehavioralEventType.CAPACITY_SHIFTED, (event: any) => {
      this.calculateCapacity(event.userId, event.payload.level);
    });
  }

  static calculateCapacity(userId: UUID, signal: string) {
    let tier: CapacityTier = 'OPTIMAL';
    let multiplier = 1.0;

    // Logika mapowania sygnalów na Tier i pozostaly czas
    switch (signal) {
      case 'unstable':
        tier = 'MODERATE';
        multiplier = 0.6;
        break;
      case 'low':
        tier = 'STRETCHED';
        multiplier = 0.3;
        break;
      case 'COGNITIVE_LOCKUP': // Sygnal z fuzji symbolicznej
        tier = 'DEPLETED';
        multiplier = 0.05;
        break;
      default:
        tier = 'OPTIMAL';
        multiplier = 1.0;
    }

    const window: CapacityWindow = {
      userId,
      tier,
      estimatedMinutesRemaining: Math.floor(this.BASELINE_MINUTES * multiplier),
      basisSymbol: signal,
      timestamp: new Date().toISOString()
    };

    this.publishCapacity(window);
  }

  private static publishCapacity(window: CapacityWindow) {
    console.log(`[CAPACITY] Tier: ${window.tier} | Remainder: ${window.estimatedMinutesRemaining}min | Basis: ${window.basisSymbol}`);
    
    // Publikacja na szyne, aby Portal mógl to wyswietlic
    SilenceEventBus.getInstance().publish({
      id: `cap_${Date.now()}`,
      userId: window.userId,
      timestamp: window.timestamp,
      type: BehavioralEventType.CAPACITY_SHIFTED, // Uzywamy istniejacego typu lub rozszerzamy contracts
      payload: window
    } as any);
  }
}
