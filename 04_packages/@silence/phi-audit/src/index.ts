/**
 * [PATH]: 04_packages/@silence/phi-audit/src/index.ts
 *
 * Public API for @silence/phi-audit.
 */

export {
  auditPhiArtifact,
  auditRouteManifest,
  auditS11Copy,
  auditPhiTokens,
  emitPhiAuditRecord,
  getAuditLog,
  _resetAuditLogForTesting,
} from './phi-audit.js';

export type {
  PhiAuditInput,
  PhiAuditFinding,
  PhiAuditResult,
  RouteManifest,
  AuditRecord,
} from './phi-audit.js';
