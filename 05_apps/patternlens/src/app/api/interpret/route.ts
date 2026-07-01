// ===========================================
// SILENCE.OBJECTS - Interpret API (v6.0 ENGINE)
// ===========================================
// POST /api/interpret
//
// Pipeline (ADR-CI-004):
//   request → SilenceEventV1 → processSilenceEvent() → Supabase write → response
//
// Safety profile: PASSIVE (INFORMED_ADULT_TOOL)
// - Hard keyword match only (no model-based risk assessment)
// - Never blocks input; shows resources banner when crisis keywords detected
//
// Changes from v5.0:
//   - STAGE 6: claudeService.generateDualLensInterpretation() replaced by
//     processSilenceEvent() from @/lib/engine/interpret (boundary-clean stub).
//   - STAGE 7: NEW — persist EngineResult to Supabase interpretations table
//   - Response shape preserved for backward compat (lensA / lensB keys)

import { NextRequest, NextResponse } from "next/server";
import {
  authenticateRequest,
  canCreateObject,
  checkRateLimit,
} from "@/lib/auth/session";
import { validateObjectInput } from "@/lib/validation/object-validation";
import { detectCrisis } from "@/lib/safety";
import { createClient } from "@/lib/supabase/server";
import {
  processSilenceEvent,
  buildSilenceEventV1,
} from "@/lib/engine/interpret";
import type { InterpretErrorResponse } from "@/types/domain";

// ─────────────────────────────────────────────────────────────
// Rate limit config
// ─────────────────────────────────────────────────────────────

const RATE_LIMIT = {
  FREE: { requests: 10, windowMs: 60_000 },
  PRO: { requests: 30, windowMs: 60_000 },
} as const;

// ─────────────────────────────────────────────────────────────
// POST /api/interpret
// ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // ── STAGE 1: Authentication ──────────────────────────────

    const authResult = await authenticateRequest();
    if (!authResult.authenticated) {
      return NextResponse.json(
        { error: "Unauthorized", code: authResult.code } as InterpretErrorResponse,
        { status: 401 }
      );
    }

    const { user } = authResult;

    // ── STAGE 2: Rate limiting ───────────────────────────────

    const rateConfig = RATE_LIMIT[user.tier];
    const rateCheck = checkRateLimit(
      user.id,
      rateConfig.requests,
      rateConfig.windowMs
    );

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          code: "RATE_LIMITED",
          retryAfter: Math.ceil((rateCheck.resetAt - Date.now()) / 1000),
        } as InterpretErrorResponse,
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.ceil((rateCheck.resetAt - Date.now()) / 1000)
            ),
            "X-RateLimit-Remaining": String(rateCheck.remaining),
            "X-RateLimit-Reset": String(rateCheck.resetAt),
          },
        }
      );
    }

    // ── STAGE 3: Parse and validate input ───────────────────

    let body: { text: string; locale?: string; objectId?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body", code: "INVALID_JSON" } as InterpretErrorResponse,
        { status: 400 }
      );
    }

    const { text, objectId } = body;

    const validation = validateObjectInput(text);
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: validation.errors[0]?.message ?? "Validation failed",
          code: validation.errors[0]?.code ?? "VALIDATION_ERROR",
          details: validation.errors,
        } as InterpretErrorResponse,
        { status: 422 }
      );
    }

    const sanitizedText = validation.sanitizedText!;

    // ── STAGE 4: Tier / limit check ──────────────────────────

    const limitCheck = await canCreateObject(user.id, user.tier);
    const canSave = limitCheck.allowed;

    // ── STAGE 5: PASSIVE crisis detection ───────────────────
    // Never blocks. Shows resources banner when keywords detected.

    const crisisResult = detectCrisis(sanitizedText);

    // ── STAGE 6: Behavioral engine (ADR-CI-004) ──────────────
    // Build a SilenceEventV1 from request context and run through engine.
    // processSilenceEvent() internally calls analyzeObject() + S11 scan.

    const event = buildSilenceEventV1({
      userId: user.id,
      source: "app",
      payload: {
        text: sanitizedText,
        objectId: objectId ?? null,
        locale: body.locale ?? "pl",
      },
    });

    const engineResult = await processSilenceEvent(event);

    // ── STAGE 7: Persist to Supabase (fire-and-forget) ──────
    // Only persist when there is an objectId to attach to.
    // Telemetry is always written regardless of objectId.
    // Insert is non-blocking — failure does NOT fail the response.

    if (objectId) {
      const supabase = await createClient();

      const analysis = engineResult.analysis;
      const insertPayload = {
        object_id: objectId,
        lens: "A" as const,
        phase_1_context: {
          summary: analysis.patterns.patterns.join(", ") || "no-signal",
          keywords: analysis.patterns.patterns,
          confidence: analysis.patterns.confidence,
        },
        phase_2_tension: {
          summary: analysis.patterns.tensions.join("; ") || "none",
          details: analysis.patterns.tensions.length > 0
            ? `Opposing patterns detected: ${analysis.patterns.tensions.join(", ")}`
            : "No opposing tensions detected",
        },
        phase_3_meaning: {
          summary: analysis.lenses.lens_a.interpretation,
          confidence: analysis.lenses.lens_a.confidence,
        },
        phase_4_function: {
          summary: analysis.lenses.lens_b.interpretation,
          confidence: analysis.lenses.lens_b.confidence,
        },
        confidence_score: analysis.patterns.confidence,
        risk_level: crisisResult.showResources ? "elevated" : "standard",
      };

      // Non-blocking persist — errors are logged, never surfaced to user
      supabase
        .from("interpretations")
        .insert(insertPayload)
        .then(({ error }) => {
          if (error) {
            console.error("[Interpret] Supabase write failed:", {
              objectId,
              engineDecision: engineResult.decision,
              error: error.message,
            });
          }
        });
    }

    // ── STAGE 8: Return response ─────────────────────────────
    // Response shape preserved from v5.0 for frontend backward compat.
    // New fields added: engineDecision, s11, engineVersion.

    const totalTime = Date.now() - startTime;

    return NextResponse.json(
      {
        // Preserved from v5.0 — maps engine dual-lens to lensA/lensB
        lensA: {
          phase1Context: engineResult.analysis.patterns.patterns.join(", ") || "no pattern signal",
          phase2Tension: engineResult.analysis.patterns.tensions.join("; ") || "none",
          phase3Meaning: engineResult.analysis.lenses.lens_a.interpretation,
          phase4Function: engineResult.analysis.archetype_hint ?? "undetermined",
          patternTheme: "behavioral",
          confidenceScore: engineResult.analysis.lenses.lens_a.confidence,
        },
        lensB: {
          phase1Context: engineResult.analysis.patterns.patterns.join(", ") || "no pattern signal",
          phase2Tension: engineResult.analysis.patterns.tensions.join("; ") || "none",
          phase3Meaning: engineResult.analysis.lenses.lens_b.interpretation,
          phase4Function: engineResult.analysis.archetype_hint ?? "undetermined",
          patternTheme: "behavioral",
          confidenceScore: engineResult.analysis.lenses.lens_b.confidence,
        },
        showBanner: crisisResult.showResources,
        showResources: crisisResult.showResources,
        detectedKeywords: crisisResult.detectedKeywords,
        canSave,
        remaining: user.tier === "FREE" ? limitCheck.remaining : null,
        generatedAt: engineResult.processedAt,
        // New in v6.0
        engineDecision: engineResult.decision,
        s11Clean: engineResult.s11.clean,
        engineVersion: engineResult.meta.engineVersion,
        metrics: {
          totalMs: totalTime,
          engineMs: engineResult.latencyMs,
          patternsDetected: engineResult.meta.patternsDetected,
          tensionsDetected: engineResult.meta.tensionsDetected,
          confidence: engineResult.meta.confidence,
        },
      },
      {
        headers: {
          "X-RateLimit-Remaining": String(rateCheck.remaining),
          "X-Processing-Time": String(totalTime),
          "X-Engine-Decision": engineResult.decision,
          "X-Engine-Version": engineResult.meta.engineVersion,
        },
      }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("[Interpret] Unexpected error:", errorMessage);

    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" } as InterpretErrorResponse,
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────────────────────
// OPTIONS — CORS preflight
// ─────────────────────────────────────────────────────────────

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
