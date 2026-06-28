// Re-export canonical audio/voice/object API contracts from @silence/sdk (SSoT)
// UI component props (VoiceDumpProps, AudioVisualizerProps, etc.) are defined locally
// in their respective components.
export type {
  AudioRecording,
  TranscriptionResult,
  VoiceUploadResult,
  AnalysisObject,
  DualLensAnalysis,
  LensInterpretation,
  CreateObjectRequest,
  CreateObjectResponse,
  ListObjectsQuery,
  ListObjectsResponse,
  UpdateLensRequest,
  ErrorCode,
  ApiError,
} from '@silence/sdk';
