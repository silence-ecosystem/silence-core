/**
 * [PATH]: 04_packages/@silence/rhythm/src/RhythmEngine.ts
 */
import { SilenceEventBus } from '@silence/events';
import { BehavioralEventType } from '@silence/contracts';

export class RhythmObserver {
  private static lastEventTime: number = 0;

  static init() {
    const bus = SilenceEventBus.getInstance();
    
    bus.subscribe(BehavioralEventType.PATTERN_DETECTED, (event) => {
      const now = Date.now();
      if (this.lastEventTime !== 0) {
        const diff = now - this.lastEventTime;
        const freq = 1000 / diff; // Prosta estymacja Hz

        // Jesli czestotliwosc odbiega od 11Hz (Nature 2026 baseline), zglaszamy dryft
        if (freq < 9 || freq > 13) {
          SilenceEventBus.getInstance().publish({
            type: BehavioralEventType.RHYTHM_DRIFT,
            timestamp: new Date().toISOString(),
            userId: event.userId,
            payload: { driftValue: freq, dominantFreq: 11 }
          } as any);
        }
      }
      this.lastEventTime = now;
    });
  }
}
