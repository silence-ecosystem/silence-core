/**
 * [PATH]: 04_packages/@silence/reporting/src/types.ts
 */
export interface IntegritySessionSummary {
  sessionId: string;
  durationMinutes: number;
  averageIntegrity: number;
  peakFlowMinutes: number;
  totalDissonanceEvents: number;
  integrityTrend: number[]; // Punkty do wykresu
  recommendation: string;
}
