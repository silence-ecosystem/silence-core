// ============================================
// VOICE RECORDING TYPES
// ============================================

export interface AudioRecording {
  id: string;
  blob: Blob;
  duration: number;
  mimeType: string;
  createdAt: Date;
  size: number;
}

export interface TranscriptionResult {
  transcript: string;
  duration: number | null;
  language: string;
  confidence?: number;
}

export interface VoiceUploadResult {
  url: string;
  path: string;
  size: number;
}

// ============================================
// ANALYSIS TYPES
// ============================================

export interface DualLensAnalysis {
  lens_a: string;
  lens_b: string;
  lens_a_title: string;
  lens_b_title: string;
  structural_patterns: string[];
  tension_points: string[];
}

export interface AnalysisObject {
  id: string;
  user_id: string;
  input_text: string;
  input_source: 'text' | 'voice';
  input_audio_url?: string;
  lens_a: string;
  lens_b: string;
  lens_a_title: string;
  lens_b_title: string;
  selected_lens: 'a' | 'b' | null;
  structural_patterns: string[];
  tension_points: string[];
  created_at: string;
  updated_at: string;
}

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================

export interface CreateObjectRequest {
  input_text: string;
  input_source: 'text' | 'voice';
  input_audio_url?: string;
}

export interface CreateObjectResponse extends AnalysisObject {}

export interface ListObjectsQuery {
  limit?: number;
  offset?: number;
  sort?: 'created_at' | 'updated_at';
  order?: 'asc' | 'desc';
}

export interface ListObjectsResponse {
  objects: AnalysisObject[];
  total: number;
  hasMore: boolean;
}

export interface UpdateLensRequest {
  selected_lens: 'a' | 'b';
}

// ============================================
// ERROR TYPES
// ============================================

export type ErrorCode =
  | 'AUTH_REQUIRED'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMIT'
  | 'TIER_LIMIT'
  | 'EMERGENCY_DETECTED'
  | 'TRANSCRIPTION_ERROR'
  | 'ANALYSIS_ERROR'
  | 'UPLOAD_ERROR'
  | 'NOT_FOUND'
  | 'INTERNAL_ERROR';

export interface ApiError {
  error: string;
  code: ErrorCode;
  details?: Record<string, unknown>;
}

export interface EmergencyResponse extends ApiError {
  code: 'EMERGENCY_DETECTED';
  resources: CrisisResource[];
}

export interface CrisisResource {
  name: string;
  phone: string;
  url?: string;
  available: string;
  region: 'PL' | 'US' | 'UK' | 'global';
}

// ============================================
// OFFLINE QUEUE TYPES
// ============================================

export interface PendingObject {
  id: string;
  input_text: string;
  input_source: 'text' | 'voice';
  input_audio_blob?: string; // Base64 encoded
  created_at: string;
  retryCount: number;
  lastAttempt?: string;
  status: 'pending' | 'syncing' | 'failed';
}

export interface OfflineQueueState {
  queue: PendingObject[];
  isOnline: boolean;
  isSyncing: boolean;
  syncProgress: number;
  lastSyncError?: string;
}

// ============================================
// MEDIA RECORDER TYPES
// ============================================

export interface MediaRecorderState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  error: string | null;
  hasPermission: boolean | null;
}

export interface MediaRecorderOptions {
  maxDuration?: number;
  mimeType?: string;
  audioBitsPerSecond?: number;
  onMaxDurationReached?: () => void;
  onError?: (error: Error) => void;
}

// ============================================
// COMPONENT PROPS TYPES
// ============================================

export interface VoiceDumpProps {
  onAnalysisComplete?: (result: AnalysisObject) => void;
  onEmergencyDetected?: () => void;
  onRecordingStart?: () => void;
  onRecordingStop?: (blob: Blob) => void;
  maxDuration?: number;
  className?: string;
  disabled?: boolean;
}

export interface RecordButtonProps {
  isRecording: boolean;
  isPaused: boolean;
  isProcessing: boolean;
  hasPermission: boolean | null;
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
  className?: string;
}

export interface AudioVisualizerProps {
  stream: MediaStream | null;
  isRecording: boolean;
  className?: string;
}
