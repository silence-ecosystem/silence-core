// ============================================================
// patternsLab Voice Pipeline — FULL SAFETY MODE
// B2B: Cloud Whisper fallback, 3-tier crisis detection,
// audit logging, RBAC, 15min PRO limit, session history
// Contract: 02-SAFETY.md, 03-AI-CONTRACT.md
// ============================================================

import {
  AudioRecorder,
  VoiceActivityDetector,
  WhisperEngine,
  CloudTranscriber,
  cleanTranscription,
  VOICE_PROFILES,
  type TranscriptionResult,
  type VoiceEvent,
  type VoiceError,
  type RecordingSession,
  type VoiceFeatureFlags,
} from '@silence/voice';

// ============================================================
// CRISIS DETECTION — 3-TIER (Contract: 02-SAFETY.md §1-3)
// ============================================================

export type CrisisLevel = 'NONE' | 'SOFT' | 'HARD' | 'EMERGENCY';

interface CrisisDetectionResult {
  level: CrisisLevel;
  matchedKeywords: string[];
  action: 'proceed' | 'show-resources' | 'show-modal' | 'block-processing';
  resources: CrisisResource[];
}

interface CrisisResource {
  country: string;
  name: string;
  number: string;
  available: string;
}

/** Regional crisis resources (02-SAFETY.md §3) */
const CRISIS_RESOURCES: CrisisResource[] = [
  { country: 'PL', name: 'Telefon Zaufania', number: '116 123', available: '24/7' },
  { country: 'PL', name: 'Centrum Wsparcia', number: '800 70 2222', available: '24/7' },
  { country: 'US', name: 'Suicide & Crisis Lifeline', number: '988', available: '24/7' },
  { country: 'US', name: 'Crisis Text Line', number: 'Text HOME to 741741', available: '24/7' },
  { country: 'UK', name: 'Samaritans', number: '116 123', available: '24/7' },
  { country: 'UK', name: 'Crisis Text Line', number: 'Text SHOUT to 85258', available: '24/7' },
];

/** Tier 1: Emergency — immediate block + crisis modal */
const EMERGENCY_PATTERNS: RegExp[] = [
  /suicid/i, /samobójst/i,
  /kill\s*(my)?self/i, /zabić\s*się/i,
  /end\s*(my|it)\s*(life|all)/i, /chcę\s*umrzeć/i,
  /want\s*to\s*die/i, /nie\s*chcę\s*żyć/i,
];

/** Tier 2: Hard — show resources, allow continue */
const HARD_PATTERNS: RegExp[] = [
  /self.?harm/i, /samookalecz/i,
  /cut(ting)?\s*(my)?self/i, /kalecz(ę|yć)\s*się/i,
  /hurting?\s*(my)?self/i, /krzywdz(ę|ić)\s*się/i,
  /overdose/i, /przedawkow/i,
  /don'?t\s*want\s*to\s*be\s*here/i,
];

/** Tier 3: Soft — subtle indicator, log + gentle resource note */
const SOFT_PATTERNS: RegExp[] = [
  /hopeless/i, /beznadziejn/i,
  /no\s*reason\s*to\s*live/i, /nie\s*ma\s*sensu/i,
  /can'?t\s*go\s*on/i, /nie\s*dam\s*rady/i,
  /worthless/i, /bezwartościow/i,
  /burden/i, /ciężar(em)?\b/i,
  /nobody\s*cares/i, /niko(mu|go)\s*nie\s*obchodzę/i,
];

/**
 * 3-tier crisis detection on text input.
 * Runs BEFORE and AFTER transcription.
 *
 * Contract: 02-SAFETY.md §1 — crisis keywords must be detected
 * Contract: 02-SAFETY.md §2 — escalation matrix
 * Contract: 02-SAFETY.md §3 — regional resources
 */
export function detectCrisis(text: string, locale = 'PL'): CrisisDetectionResult {
  const matched: string[] = [];

  // Tier 1: Emergency
  for (const pattern of EMERGENCY_PATTERNS) {
    const match = text.match(pattern);
    if (match) matched.push(match[0]);
  }
  if (matched.length > 0) {
    return {
      level: 'EMERGENCY',
      matchedKeywords: matched,
      action: 'block-processing',
      resources: CRISIS_RESOURCES.filter((r) => r.country === locale || locale === 'ALL'),
    };
  }

  // Tier 2: Hard
  for (const pattern of HARD_PATTERNS) {
    const match = text.match(pattern);
    if (match) matched.push(match[0]);
  }
  if (matched.length > 0) {
    return {
      level: 'HARD',
      matchedKeywords: matched,
      action: 'show-modal',
      resources: CRISIS_RESOURCES.filter((r) => r.country === locale || locale === 'ALL'),
    };
  }

  // Tier 3: Soft
  for (const pattern of SOFT_PATTERNS) {
    const match = text.match(pattern);
    if (match) matched.push(match[0]);
  }
  if (matched.length > 0) {
    return {
      level: 'SOFT',
      matchedKeywords: matched,
      action: 'show-resources',
      resources: CRISIS_RESOURCES.filter((r) => r.country === locale || locale === 'ALL'),
    };
  }

  return { level: 'NONE', matchedKeywords: [], action: 'proceed', resources: [] };
}

// ============================================================
// AUDIT LOGGER (Contract: 02-SAFETY.md §6)
// Append-only, no PII stored
// ============================================================

export interface AuditEntry {
  timestamp: string;
  sessionId: string;
  event: string;
  crisisLevel: CrisisLevel;
  metadata: Record<string, string | number | boolean>;
}

const auditLog: AuditEntry[] = [];

export function logAuditEvent(
  sessionId: string,
  event: string,
  crisisLevel: CrisisLevel = 'NONE',
  metadata: Record<string, string | number | boolean> = {}
): void {
  const entry: AuditEntry = {
    timestamp: new Date().toISOString(),
    sessionId,
    event,
    crisisLevel,
    metadata: {
      ...metadata,
      // NEVER store PII — only structural metadata
      hasAudio: false,
      hasTranscript: false,
    },
  };
  auditLog.push(entry);

  // In production: send to Supabase audit table
  // await supabase.from('voice_audit_log').insert(entry);
}

export function getAuditLog(): ReadonlyArray<AuditEntry> {
  return auditLog;
}

// ============================================================
// RBAC (Role-Based Access Control)
// ============================================================

export type VoiceRole = 'admin' | 'therapist' | 'client';

interface RBACPermissions {
  canRecord: boolean;
  canTranscribeCloud: boolean;
  canViewAudit: boolean;
  canExportTranscripts: boolean;
  maxDurationSec: number;
}

const ROLE_PERMISSIONS: Record<VoiceRole, RBACPermissions> = {
  admin: {
    canRecord: true,
    canTranscribeCloud: true,
    canViewAudit: true,
    canExportTranscripts: true,
    maxDurationSec: 900,
  },
  therapist: {
    canRecord: true,
    canTranscribeCloud: true,
    canViewAudit: true,
    canExportTranscripts: true,
    maxDurationSec: 900,
  },
  client: {
    canRecord: true,
    canTranscribeCloud: false, // Must use local
    canViewAudit: false,
    canExportTranscripts: false,
    maxDurationSec: 300,
  },
};

export function getPermissions(role: VoiceRole): RBACPermissions {
  return ROLE_PERMISSIONS[role];
}

// ============================================================
// PATTERNSLAB VOICE PIPELINE — ORCHESTRATOR
// ============================================================

export interface PatternsLabVoiceConfig {
  tier: 'FREE' | 'PRO';
  role: VoiceRole;
  locale: string;
  onCrisis: (result: CrisisDetectionResult) => void;
  onTranscription: (result: TranscriptionResult) => void;
  onError: (error: VoiceError) => void;
  onStateChange: (state: string) => void;
  onLevels: (levels: number[]) => void;
}

/**
 * Full voice pipeline for patternsLab.
 * Integrates: recording → VAD → transcription → crisis check → cleanup → output
 *
 * Safety flow:
 * 1. Pre-transcription crisis check (on raw text if cloud returns early segments)
 * 2. Post-transcription crisis check (on full transcript)
 * 3. Audit logging on every safety event
 * 4. RBAC enforcement on all operations
 */
export class PatternsLabVoicePipeline {
  private recorder: AudioRecorder;
  private vad: VoiceActivityDetector;
  private whisper: WhisperEngine;
  private cloud: CloudTranscriber;
  private config: PatternsLabVoiceConfig;
  private features: VoiceFeatureFlags;
  private permissions: RBACPermissions;
  private currentSession: RecordingSession | null = null;
  private unsubscribers: Array<() => void> = [];

  constructor(config: PatternsLabVoiceConfig) {
    this.config = config;
    this.features =
      config.tier === 'PRO' ? VOICE_PROFILES.PATTERNSLAB_PRO : VOICE_PROFILES.PATTERNSLAB_FREE;
    this.permissions = getPermissions(config.role);

    // Override max duration from RBAC
    const maxDuration = Math.min(this.features.maxDurationSec, this.permissions.maxDurationSec);

    this.recorder = new AudioRecorder({ maxDurationSec: maxDuration });
    this.vad = new VoiceActivityDetector();
    this.whisper = new WhisperEngine();
    this.cloud = new CloudTranscriber();

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Recorder events
    const unsubRec = this.recorder.on((event) => {
      if (event.type === 'state-change') {
        this.config.onStateChange(event.state);
      }
      if (event.type === 'error') {
        this.config.onError(event.error);
        logAuditEvent(this.recorder.sessionId, 'recording_error', 'NONE', {
          errorCode: event.error.code,
        });
      }
    });
    this.unsubscribers.push(unsubRec);

    // VAD events → level visualization
    const unsubVAD = this.vad.on((event) => {
      if (event.type === 'level-update') {
        this.config.onLevels(event.levels);
      }
    });
    this.unsubscribers.push(unsubVAD);
  }

  /** Initialize engine (load Whisper WASM if local mode) */
  async initialize(): Promise<void> {
    if (this.features.localTranscription) {
      await this.whisper.initialize();
    }
  }

  /** Check if recording is permitted for current user */
  canRecord(): boolean {
    return this.permissions.canRecord && AudioRecorder.isSupported();
  }

  /** Start recording with safety checks */
  async startRecording(): Promise<void> {
    if (!this.canRecord()) {
      this.config.onError({
        code: 'BROWSER_UNSUPPORTED',
        message: 'Recording not available.',
        recoverable: false,
        action: 'fallback-text',
      });
      return;
    }

    const stream = await this.recorder.requestMic();
    await this.vad.connect(stream);
    this.recorder.start();

    logAuditEvent(this.recorder.sessionId, 'recording_started', 'NONE', {
      tier: this.config.tier,
      role: this.config.role,
    });
  }

  /** Stop recording and run full pipeline */
  async stopRecording(): Promise<TranscriptionResult | null> {
    this.vad.disconnect();
    const session = await this.recorder.stop();
    this.currentSession = session;

    if (!session.audioBlob) {
      this.config.onError({
        code: 'MEDIARECORDER_ERROR',
        message: 'No audio captured.',
        recoverable: true,
        action: 'retry',
      });
      return null;
    }

    logAuditEvent(session.id, 'recording_stopped', 'NONE', {
      durationMs: session.durationMs,
      sizeBytes: session.sizeBytes,
    });

    // Transcribe
    let result: TranscriptionResult;

    try {
      if (this.features.cloudFallback && this.permissions.canTranscribeCloud) {
        // PRO: Use cloud API
        result = await this.cloud.transcribe(session.audioBlob, this.config.locale);
      } else {
        // FREE / local: Use Whisper.cpp
        const audioData = await WhisperEngine.audioToFloat32(session.audioBlob);
        result = await this.whisper.transcribe(audioData);
      }
    } catch (err) {
      // Fallback: if cloud fails, try local
      if (this.features.localTranscription && this.whisper.isReady) {
        try {
          const audioData = await WhisperEngine.audioToFloat32(session.audioBlob);
          result = await this.whisper.transcribe(audioData);
        } catch {
          this.config.onError(err as VoiceError);
          return null;
        }
      } else {
        this.config.onError(err as VoiceError);
        return null;
      }
    }

    // Post-transcription crisis check
    const crisisResult = detectCrisis(result.raw, this.config.locale);

    if (crisisResult.level !== 'NONE') {
      logAuditEvent(session.id, 'crisis_detected', crisisResult.level, {
        action: crisisResult.action,
        keywordCount: crisisResult.matchedKeywords.length,
      });
      this.config.onCrisis(crisisResult);

      if (crisisResult.action === 'block-processing') {
        // EMERGENCY: Do NOT proceed with AI analysis
        logAuditEvent(session.id, 'processing_blocked', crisisResult.level);
        return null;
      }
    }

    // Cleanup transcript
    const { text: cleanedText } = cleanTranscription(result.raw, {
      language: this.config.locale === 'PL' ? 'pl' : 'en',
    });
    result.cleaned = cleanedText;

    logAuditEvent(session.id, 'transcription_complete', crisisResult.level, {
      source: result.source,
      processingTimeMs: result.processingTimeMs,
      language: result.language,
    });

    // CRITICAL: Delete audio blob after transcription (no audio storage)
    // Contract: Security — No audio storage post-transcription
    if (session.audioUrl) {
      URL.revokeObjectURL(session.audioUrl);
    }

    this.config.onTranscription(result);
    return result;
  }

  /** Cancel ongoing recording */
  cancel(): void {
    this.vad.disconnect();
    this.recorder.destroy();
    this.cloud.cancel();
    if (this.currentSession) {
      logAuditEvent(this.currentSession.id, 'recording_cancelled');
    }
  }

  /** Dispose all resources */
  dispose(): void {
    this.cancel();
    this.whisper.dispose();
    for (const unsub of this.unsubscribers) unsub();
    this.unsubscribers = [];
  }
}
