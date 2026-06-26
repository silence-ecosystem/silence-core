// ===========================================
// SILENCE.OBJECTS - Domain Types
// ===========================================

import { RiskLevel } from "@/constants/app";

export interface LensInterpretation {
  context: string;
  tension: string;
  meaning: string;
  function: string;
  confidence: number;
}

export interface DualLensResponse {
  lensA: LensInterpretation;
  lensB: LensInterpretation;
  riskLevel: RiskLevel;
  isEmergency: boolean;
}

export interface ClaudeMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClaudeRequest {
  model: string;
  max_tokens: number;
  messages: ClaudeMessage[];
  system?: string;
}

export interface ClaudeResponse {
  id: string;
  content: Array<{ type: "text"; text: string }>;
  model: string;
  stop_reason: string;
  usage: { input_tokens: number; output_tokens: number };
}

export interface InterpretSuccessResponse {
  lensA: LensInterpretation;
  lensB: LensInterpretation;
  riskLevel: RiskLevel;
  isEmergency: boolean;
  showBanner?: boolean;
}

export interface InterpretCrisisResponse {
  crisis: true;
  riskLevel: "HIGH";
  detectedKeywords: string[];
}

export interface InterpretErrorResponse {
  error: string;
  code?: string;
}

export type InterpretResponse =
  | InterpretSuccessResponse
  | InterpretCrisisResponse
  | InterpretErrorResponse;
