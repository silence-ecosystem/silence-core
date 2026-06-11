/**
 * [PATH]: 04_packages/@silence/sessions/src/types.ts
 */
﻿import { TenantID } from '@silence/contracts';

export interface SessionContext {
  sessionId: string;
  tenantId: TenantID;
  actorId: string;
  startTime: string;
  endTime?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ABORTED';
}

export interface SessionEventWrapper {
  sessionId: string;
  payload: any;
  timestamp: string;
}
