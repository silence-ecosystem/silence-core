import { SilenceEventBus } from '@silence/events';
import { BehavioralEventType } from '@silence/contracts';

/**
 * JITAI ENGINE — Just-In-Time Adaptive Interventions
 * Zasada: Interweniujemy tylko w "momencie krytycznego zmęczenia bez odnowy".
 */
export class JITAIProvider {
  private static lastCapacityState: string = 'OPTIMAL';
  private static lastRecoveryTrajectory: string = 'STAGNANT';

  static init() {
    const bus = SilenceEventBus.getInstance();

    // Słuchamy zmian Capacity i Recovery
    bus.subscribe(BehavioralEventType.CAPACITY_CHANGED, (event: any) => {
      this.lastCapacityState = event.payload.state;
      this.evaluate();
    });

    bus.subscribe('BEHAVIORAL_RECOVERY_UPDATE' as any, (event: any) => {
      this.lastRecoveryTrajectory = event.payload.trajectory;
      this.evaluate();
    });
  }

  private static evaluate() {
    // TWARDA LOGIKA RUCHU 200:
    // Tylko gdy Capacity jest wyczerpane (DEPLETED) ORAZ brak postępów w odnowie (STAGNANT)
    if (this.lastCapacityState === 'DEPLETED' && this.lastRecoveryTrajectory === 'STAGNANT') {
      this.triggerIntervention();
    }
  }

  private static triggerIntervention() {
    console.log("⚠️ [JITAI] Triggering: Critical state detected with stagnant recovery.");
    
    SilenceEventBus.getInstance().publish({
      id: `jitai_${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'SYSTEM_INTERVENTION_READY' as any,
      payload: {
        message: "Wykryto kognitywny lockup. Weź 3 głębokie oddechy lub zmień kontekst na 5 min.",
        priority: 'high',
        suggestion: 'breathing_exercise'
      }
    } as any);
  }
}
