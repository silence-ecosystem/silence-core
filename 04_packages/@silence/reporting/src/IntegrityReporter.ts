/**
 * [PATH]: 04_packages/@silence/reporting/src/IntegrityReporter.ts
 */
﻿import { IntegritySessionSummary } from './types';
import { TenantID } from '@silence/contracts';

export class IntegrityReporter {
  static generateSummary(sessionData: any[], tenantId: TenantID): IntegritySessionSummary & { tenantId: TenantID } {
    const integrityScores = sessionData.map(d => d.score);
    const avgIntegrity = integrityScores.reduce((a, b) => a + b, 0) / integrityScores.length;
    
    const peakFlow = sessionData.filter(d => d.score > 0.8).length; 
    const highDissonance = sessionData.filter(d => d.dissonance > 0.5).length;

    return {
      tenantId, // Twarde przypisanie do organizacji
      sessionId: `SES_${Date.now()}`,
      durationMinutes: Math.floor(sessionData.length / 60),
      averageIntegrity: parseFloat(avgIntegrity.toFixed(2)),
      peakFlowMinutes: peakFlow,
      totalDissonanceEvents: highDissonance,
      integrityTrend: integrityScores.filter((_, i) => i % 60 === 0),
      recommendation: this.getRecommendation(avgIntegrity, highDissonance)
    };
  }

  private static getRecommendation(score: number, dissonance: number): string {
    if (score > 0.8) return "Doskonała synchronizacja. Utrzymaj ten rytm pracy.";
    if (dissonance > 0.4) return "Wykryto wysoki dysonans. Spróbuj ograniczyć multitasking.";
    return "Stabilna praca, ale Twoje rezerwy kognitywne mogą wymagać regeneracji.";
  }
}
