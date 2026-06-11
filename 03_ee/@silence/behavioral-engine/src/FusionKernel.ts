import { SilenceEventBus } from '@silence/events';
import { AttentionMonitorSnapshot } from '@silence/contracts';

/**
 * FUSION KERNEL — Multi-Modal Integrity Engine
 * Łączy CV (Attention) + Rhythmic Events (Cognition).
 */
export class FusionKernel {
  private static lastCvScore: number = 0;
  private static lastRhythmConfidence: number = 0;

  static init() {
    const bus = SilenceEventBus.getInstance();

    // 1. Słuchamy danych wizyjnych (CV)
    bus.subscribe('BIO_METRIC_UPDATE' as any, (event: any) => {
      this.lastCvScore = event.payload.engagementScore;
      this.calculateIntegrity();
    });

    // 2. Słuchamy rytmu kognitywnego (Events - 11Hz)
    bus.subscribe('RHYTHM_DRIFT_UPDATE' as any, (event: any) => {
      this.lastRhythmConfidence = event.payload.confidence;
      this.calculateIntegrity();
    });
  }

  private static calculateIntegrity() {
    // SYSTEM INTEGRITY ALGORITHM (v4.0)
    // Synergia: (Uważność Wizualna * Spójność Rytmiczna)
    const integrityScore = (this.lastCvScore * 0.6) + (this.lastRhythmConfidence * 0.4);
    
    // Obliczamy dysonans (Dissonance) — gdy patrzysz, ale nie myślisz (lub odwrotnie)
    const dissonance = Math.abs(this.lastCvScore - this.lastRhythmConfidence);

    SilenceEventBus.getInstance().publish({
      id: `fusion_${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'SYSTEM_INTEGRITY_UPDATE' as any,
      payload: {
        score: integrityScore,
        dissonance: dissonance,
        status: integrityScore > 0.7 ? 'STABLE' : integrityScore > 0.4 ? 'FRAGILE' : 'DISRUPTED'
      }
    } as any);
  }
}
