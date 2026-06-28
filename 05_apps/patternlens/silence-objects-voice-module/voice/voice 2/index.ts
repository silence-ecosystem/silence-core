// Audio Recording Hooks - PatternLens
// =====================================

export { useMediaRecorder } from './useMediaRecorder';
export type { MediaRecorderState, UseMediaRecorderReturn } from './useMediaRecorder';

export { useAnalysis, EmergencyError } from './useAnalysis';
export type { 
  AnalysisState, 
  AnalysisStatus, 
  AnalysisResult, 
  DualLensAnalysis 
} from './useAnalysis';

export { useOfflineQueue } from './useOfflineQueue';
export type { PendingObject } from './useOfflineQueue';
