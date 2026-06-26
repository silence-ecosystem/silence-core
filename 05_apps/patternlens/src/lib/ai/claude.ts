// ===========================================
// SILENCE.OBJECTS - Claude API Client
// ===========================================

import { CLAUDE_MODEL } from "@/constants/app";
import {
  ClaudeRequest,
  ClaudeResponse,
  LensInterpretation,
  DualLensResponse,
} from "@/types/domain";
import { SYSTEM_PROMPT, DUAL_LENS_PROMPT } from "./prompts";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

async function callClaude(userMessage: string, systemPrompt: string = SYSTEM_PROMPT): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");

  const request: ClaudeRequest = {
    model: CLAUDE_MODEL,
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  };

  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Claude API error:", response.status, errorBody);
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data: ClaudeResponse = await response.json();
  if (!data.content?.length) throw new Error("Empty response from Claude");
  return data.content[0].text;
}

function parseJson<T>(text: string): T {
  const cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    console.error("JSON parse error. Raw:", text);
    throw new Error("Failed to parse Claude response as JSON");
  }
}

function validateLens(lens: unknown): LensInterpretation {
  const l = lens as Record<string, unknown>;
  if (
    typeof l?.context !== "string" ||
    typeof l?.tension !== "string" ||
    typeof l?.meaning !== "string" ||
    typeof l?.function !== "string" ||
    typeof l?.confidence !== "number"
  ) {
    throw new Error("Invalid lens interpretation structure");
  }
  return {
    context: l.context,
    tension: l.tension,
    meaning: l.meaning,
    function: l.function,
    confidence: Math.max(0, Math.min(1, l.confidence)),
  };
}

export async function generateDualLensInterpretation(
  userInput: string,
  riskLevel: "HIGH" | "MEDIUM" | "LOW" | "NONE" = "NONE"
): Promise<DualLensResponse> {
  const raw = await callClaude(DUAL_LENS_PROMPT(userInput));
  const parsed = parseJson<{ lensA: unknown; lensB: unknown }>(raw);
  return {
    lensA: validateLens(parsed.lensA),
    lensB: validateLens(parsed.lensB),
    riskLevel,
    isEmergency: riskLevel === "HIGH",
  };
}

// assessCrisisLevel REMOVED — PASSIVE mode (v5.0 ADR)
// Crisis detection uses synchronous hard keyword match only.
// No Claude risk assessment. See src/lib/safety/detector.ts.
