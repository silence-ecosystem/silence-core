// ===========================================
// SILENCE.OBJECTS - TypeScript Types
// ===========================================

import { Tier, RiskLevel, ReportPhase } from "@/constants/app";

// Re-export canonical contracts from @silence/sdk (SSoT)
export type {
  CrisisCheckResult,
  CrisisCheckRequest,
  CrisisRiskLevel,
  CrisisAction,
  DetectionLayer,
  CrisisRegion,
  RegionalCrisisResources,
  CrisisResource,
  HardKeywordResult,
  SoftKeywordResult,
  ClaudeAssessmentResult,
  CrisisIncident,
  CrisisDetectionConfig,
  CrisisModalData,
  SafetyBannerData,
  EmergencyResponse,
  ProtocolKey,
  OnboardingIntention,
  PracticeAnchor,
} from '@silence/sdk';

// User profile from Supabase
export interface UserProfile {
  id: string;
  email: string;
  tier: Tier;
  object_count: number;
  locale: string;
  onboarding_completed: boolean;
  onboarding_completed_at?: string;
  stripe_customer_id?: string;
  created_at: string;
  updated_at: string;
}

// Voice dump / text input
export interface VoiceDump {
  id: string;
  user_id: string;
  transcription: string;
  audio_url?: string;
  duration_seconds?: number;
  created_at: string;
}

// Phase content (JSONB in database)
export interface PhaseContent {
  summary: string;
  details?: string;
  keywords?: string[];
}

// Single interpretation (one lens)
export interface Interpretation {
  id: string;
  object_id: string;
  lens: "A" | "B";
  phase_1_context: PhaseContent;
  phase_2_tension: PhaseContent;
  phase_3_meaning: PhaseContent;
  phase_4_function: PhaseContent;
  confidence_score: number | null;
  risk_level: string;
  created_at: string;
}

// Legacy interpretation format (for backward compatibility)
export interface LegacyInterpretation {
  id: string;
  object_id: string;
  lens: "A" | "B";
  context: string;
  tension: string;
  meaning: string;
  function: string;
  confidence_score: number;
  created_at: string;
}

// PatternLens Object (primary content unit)
export interface PatternLensObject {
  id: string;
  user_id: string;
  input_text: string;
  input_method: "text" | "voice";
  selected_lens?: "A" | "B" | null;
  detected_theme?: string | null;
  created_at: string;
  deleted_at?: string | null;
}

// Object with interpretations (joined query result)
export interface ObjectWithInterpretations extends PatternLensObject {
  interpretations: Interpretation[];
}

// Archive item (list view)
export interface ArchiveItem {
  id: string;
  input_preview: string;
  input_method: "text" | "voice";
  selected_lens?: "A" | "B" | null;
  detected_theme?: string | null;
  created_at: string;
}

// Crisis detection result (legacy alias — prefer CrisisCheckResponse from @silence/sdk)
export interface CrisisDetectionResultLegacy {
  risk_level: RiskLevel;
  has_hard_keyword: boolean;
  has_soft_keyword: boolean;
  detected_keywords: string[];
  claude_assessment?: string;
  requires_modal: boolean;
}

// API response wrapper
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: "success" | "error";
}

// Recording / voice types
export type RecordingErrorCode =
  | 'BROWSER_UNSUPPORTED'
  | 'PERMISSION_DENIED'
  | 'DEVICE_NOT_FOUND'
  | 'RECORDING_FAILED'
  | 'TIMEOUT'
  | 'TOO_SHORT'
  | 'UNKNOWN';

export interface RecordingError {
  code: RecordingErrorCode;
  message: string;
  recoverable: boolean;
}

export type AudioQuality = 'excellent' | 'good' | 'fair' | 'poor';
export type PermissionStatus = 'prompt' | 'granted' | 'denied' | 'unsupported';

export interface AudioConfig {
  sampleRate: number;
  channels: number;
  mimeType: string;
  maxDuration: number;
  minDuration: number;
}

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  isProcessing: boolean;
  duration: number;
  audioQuality: AudioQuality;
  error: RecordingError | null;
  permissionStatus: PermissionStatus;
  audioBlob?: Blob;
}

// Object generation state
export interface GenerationState {
  phase: ReportPhase | "idle" | "complete" | "error";
  progress: number;
  error?: string;
}

// Paywall trigger reasons
export type PaywallTrigger =
  | "object_limit_reached"
  | "feature_locked"
  | "export_requested";

// Modal types
export type ModalType =
  | "crisis"
  | "paywall"
  | "delete_confirm"
  | "export"
  | null;

// Consent types (GDPR)
export type ConsentType = "structural" | "safety" | "data" | "age";

export interface ConsentRecord {
  consent_type: ConsentType;
  consent_version: string;
  granted: boolean;
  granted_at: string;
}

// Pattern (detected recurring structure)
export interface Pattern {
  id: string;
  user_id: string;
  pattern_name: string;
  pattern_theme?: string | null;
  object_count: number;
  first_detected: string;
  last_updated: string;
}

// Backward compatibility aliases
export type Report = PatternLensObject;
export type ReportWithInterpretations = ObjectWithInterpretations;
