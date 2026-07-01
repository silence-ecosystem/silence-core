/**
 * [PATH]: 04_packages/@silence/contracts/src/audio.ts
 * @silence/contracts
 * Canonical audio / voice / transcription API contracts.
 *
 * UI-specific component props (VoiceDumpProps, AudioVisualizerProps, etc.)
 * belong in the consuming application, not here.
 */

export interface AudioRecording {
  readonly id: string;
  readonly userId: string;
  readonly blobUrl?: string;
  readonly durationSeconds: number;
  readonly mimeType: string;
  readonly createdAt: string;
}

export interface TranscriptionResult {
  readonly text: string;
  readonly original?: string;
  readonly language?: string;
  readonly confidence?: number;
}

export interface VoiceUploadResult {
  readonly success: boolean;
  readonly transcription: string;
  readonly language?: string;
  readonly error?: string;
}

export interface AnalysisObject {
  readonly id: string;
  readonly userId: string;
  readonly inputText: string;
  readonly inputMethod: 'text' | 'voice';
  readonly selectedLens?: 'A' | 'B' | null;
  readonly detectedTheme?: string | null;
  readonly createdAt: string;
}

export interface DualLensAnalysis {
  readonly objectId: string;
  readonly lensA: LensInterpretation;
  readonly lensB: LensInterpretation;
  readonly archetypeHint?: string;
  readonly confidence: number;
}

export interface LensInterpretation {
  readonly title: string;
  readonly interpretation: string;
  readonly confidence: number;
}

export interface CreateObjectRequest {
  readonly text: string;
  readonly inputMethod?: 'text' | 'voice';
  readonly locale?: string;
}

export interface CreateObjectResponse {
  readonly id: string;
  readonly userId: string;
  readonly inputText: string;
  readonly createdAt: string;
}

export interface ListObjectsQuery {
  readonly limit?: number;
  readonly offset?: number;
  readonly includeDeleted?: boolean;
}

export interface ListObjectsResponse {
  readonly items: readonly AnalysisObject[];
  readonly total: number;
  readonly hasMore: boolean;
}

export interface UpdateLensRequest {
  readonly objectId: string;
  readonly selectedLens: 'A' | 'B';
}

export type ErrorCode =
  | 'UNAUTHORIZED'
  | 'RATE_LIMITED'
  | 'VALIDATION_ERROR'
  | 'INVALID_JSON'
  | 'INTERNAL_ERROR'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'SERVICE_UNAVAILABLE';

export interface ApiError {
  readonly code: ErrorCode;
  readonly message: string;
  readonly field?: string;
  readonly retryAfter?: number;
}
