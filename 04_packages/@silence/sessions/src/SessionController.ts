/**
 * [PATH]: 04_packages/@silence/sessions/src/SessionController.ts
 */
﻿import { SilenceEventBus } from '@silence/events';
import { SessionContext } from './types';
import { IntegrityReporter } from '@silence/reporting';

export class SessionController {
  private static currentSession: SessionContext | null = null;
  private static sessionBuffer: any[] = [];

  static start(tenantId: string, actorId: string): string {
    const sessionId = `SID_${Date.now()}`;
    this.currentSession = {
      sessionId,
      tenantId,
      actorId,
      startTime: new Date().toISOString(),
      status: 'ACTIVE'
    };
    this.sessionBuffer = [];
    
    SilenceEventBus.getInstance().publish({
      type: 'SESSION_STARTED' as any,
      payload: this.currentSession
    } as any);

    // Automatyczne bindowanie Integrity Updates do bufora sesji
    SilenceEventBus.getInstance().subscribe('SYSTEM_INTEGRITY_UPDATE' as any, (event: any) => {
      if (this.currentSession?.status === 'ACTIVE') {
        this.sessionBuffer.push(event.payload);
      }
    });

    return sessionId;
  }

  static stop(): any {
    if (!this.currentSession) return null;

    this.currentSession.status = 'COMPLETED';
    this.currentSession.endTime = new Date().toISOString();

    // Generowanie raportu końcowego przez IntegrityReporter
    const report = IntegrityReporter.generateSummary(this.sessionBuffer, this.currentSession.tenantId);

    SilenceEventBus.getInstance().publish({
      type: 'SESSION_COMPLETED' as any,
      payload: { session: this.currentSession, report }
    } as any);

    const finalResult = { ...this.currentSession, report };
    this.currentSession = null;
    return finalResult;
  }
}
