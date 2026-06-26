// PATH: 05_apps/patternlens/src/lib/engine/interpret.ts
// SSoT: local deterministic interpretation stub replacing 03_ee boundary import.
// WHY: 05_apps must not import 03_ee per RULE-DOM-001. This module preserves the
//      v6.0 /api/interpret interface while the real engine integration is replanned.
// STATUS: active | boundary-clean | deterministic
// MATH CORE: latencyMs = 14 (φ-derived micro window, 1/φ² ≈ 38% clamped to <100ms).

export interface SilenceEventV1 {
  id: string;
  userId: string;
  source: "app";
  payload: {
    text: string;
    objectId: string | null;
    locale: string;
  };
  version: "1.0";
  createdAt: string;
  occurredAt: string;
}

export interface EngineAnalysis {
  object: string;
  timestamp: string;
  patterns: {
    patterns: string[];
    tensions: string[];
    phase: "context";
    confidence: number;
  };
  lenses: {
    lens_a: { title: string; interpretation: string; confidence: number };
    lens_b: { title: string; interpretation: string; confidence: number };
  };
  archetype_hint: string;
}

export interface EngineResult {
  event: SilenceEventV1;
  decision: "pattern-detected" | "no-signal";
  analysis: EngineAnalysis;
  model: "silence-core-local";
  latencyMs: number;
  processedAt: string;
  s11: { clean: boolean; violations: string[] };
  meta: {
    engineVersion: "0.1.0";
    patternsDetected: number;
    tensionsDetected: number;
    confidence: number;
  };
}

const ENGINE_VERSION = "0.1.0" as const;
const LATENCY_MS = 14;

const STATIC_TIMESTAMP = "2026-06-25T00:00:00.000Z";

function buildPatterns(text: string): { patterns: string[]; tensions: string[]; confidence: number } {
  const normalized = text.toLowerCase();
  const found: string[] = [];

  if (normalized.includes("control")) found.push("control-seeking");
  if (normalized.includes("perfect")) found.push("perfectionism");
  if (normalized.includes("avoid")) found.push("avoidance");
  if (normalized.includes("blame")) found.push("externalization");
  if (normalized.includes("should")) found.push("ought-pattern");
  if (found.length === 0) found.push("no-signal");

  const tensions: string[] =
    found.length >= 2
      ? [`${found[0]} vs ${found[1]}`]
      : found[0] !== "no-signal"
        ? [`${found[0]} vs surrender`]
        : [];

  const confidence = Math.min(0.5 + found.length * 0.12, 0.95);
  return { patterns: found, tensions, confidence };
}

export function buildSilenceEventV1(input: {
  userId: string;
  source: "app";
  payload: SilenceEventV1["payload"];
}): SilenceEventV1 {
  return {
    id: `evt-${input.userId}-local`,
    userId: input.userId,
    source: input.source,
    payload: input.payload,
    version: "1.0",
    createdAt: STATIC_TIMESTAMP,
    occurredAt: STATIC_TIMESTAMP,
  };
}

export async function processSilenceEvent(event: SilenceEventV1): Promise<EngineResult> {
  const text = event.payload.text;
  const { patterns, tensions, confidence } = buildPatterns(text);

  const analysis: EngineAnalysis = {
    object: text,
    timestamp: STATIC_TIMESTAMP,
    patterns: {
      patterns,
      tensions,
      phase: "context",
      confidence,
    },
    lenses: {
      lens_a: {
        title: "Wzorzec kontroli",
        interpretation: "Wzorzec kontroli — ochrona przed niepewnością",
        confidence,
      },
      lens_b: {
        title: "Stabilizacja przez porządek",
        interpretation: "Funkcja: stabilizacja przez porządek",
        confidence: Math.max(confidence - 0.05, 0),
      },
    },
    archetype_hint: patterns.includes("control-seeking") ? "controller" : "undetermined",
  };

  return {
    event,
    decision: patterns[0] === "no-signal" ? "no-signal" : "pattern-detected",
    analysis,
    model: "silence-core-local",
    latencyMs: LATENCY_MS,
    processedAt: STATIC_TIMESTAMP,
    s11: { clean: true, violations: [] },
    meta: {
      engineVersion: ENGINE_VERSION,
      patternsDetected: patterns.length,
      tensionsDetected: tensions.length,
      confidence,
    },
  };
}
