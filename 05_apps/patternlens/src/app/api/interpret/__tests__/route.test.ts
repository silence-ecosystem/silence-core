// ===========================================
// SILENCE.OBJECTS — /api/interpret integration tests
// ===========================================
// Route v6.0: processSilenceEvent() pipeline (ADR-CI-004)
//
// Coverage:
//   ✓ happy path — 200, engineDecision, lensA/lensB shape
//   ✓ error path  — 422 VALIDATION_ERROR on invalid text
// ===========================================

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ─────────────────────────────────────────────────────────────
// Mocks — all declared before any module import via vi.mock()
// ─────────────────────────────────────────────────────────────

// Auth: valid FREE user
vi.mock("@/lib/auth/session", () => ({
  authenticateRequest: vi.fn(),
  checkRateLimit: vi.fn(),
  canCreateObject: vi.fn(),
}));

// Validation: pass-through for valid text, reject for invalid
vi.mock("@/lib/validation/object-validation", () => ({
  validateObjectInput: vi.fn(),
}));

// Safety: never blocks (PASSIVE profile)
vi.mock("@/lib/safety", () => ({
  detectCrisis: vi.fn(),
}));

// Supabase: capture insert calls
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

// local engine stub: deterministic stub
vi.mock("@/lib/engine/interpret", () => ({
  buildSilenceEventV1: vi.fn(),
  processSilenceEvent: vi.fn(),
}));

// ─────────────────────────────────────────────────────────────
// Import route handler (after mocks are hoisted by vitest)
// ─────────────────────────────────────────────────────────────

import { POST } from "../route";
import {
  authenticateRequest,
  checkRateLimit,
  canCreateObject,
} from "@/lib/auth/session";
import { validateObjectInput } from "@/lib/validation/object-validation";
import { detectCrisis } from "@/lib/safety";
import { createClient } from "@/lib/supabase/server";
import {
  buildSilenceEventV1,
  processSilenceEvent,
} from "@/lib/engine/interpret";

// ─────────────────────────────────────────────────────────────
// Test fixtures
// ─────────────────────────────────────────────────────────────

const VALID_USER = {
  id: "user-uuid-001",
  email: "test@silence.objects",
  tier: "FREE" as const,
  objectCount: 2,
  onboardingCompleted: true,
};

const MOCK_EVENT = {
  id: "evt-uuid-001",
  userId: VALID_USER.id,
  source: "app" as const,
  payload: {
    text: "I keep trying to control everything around me",
    objectId: null,
    locale: "pl",
  },
  version: "1.0" as const,
  createdAt: new Date().toISOString(),
  occurredAt: new Date().toISOString(),
};

const MOCK_ENGINE_RESULT = {
  event: MOCK_EVENT,
  decision: "pattern-detected" as const,
  analysis: {
    object: "I keep trying to control everything around me",
    timestamp: new Date().toISOString(),
    patterns: {
      patterns: ["control-seeking", "perfectionism"],
      tensions: ["control-seeking vs surrender"],
      phase: "context" as const,
      confidence: 0.87,
    },
    lenses: {
      lens_a: {
        title: "Wzorzec kontroli",
        interpretation: "Wzorzec kontroli — ochrona przed niepewnością",
        confidence: 0.87,
      },
      lens_b: {
        title: "Stabilizacja przez porządek",
        interpretation: "Funkcja: stabilizacja przez porządek",
        confidence: 0.82,
      },
    },
    archetype_hint: "controller",
  },
  model: "silence-core-local" as const,
  latencyMs: 14,
  processedAt: new Date().toISOString(),
  s11: { clean: true, violations: [] as string[] },
  meta: {
    engineVersion: "0.1.0" as const,
    patternsDetected: 2,
    tensionsDetected: 1,
    confidence: 0.87,
  },
};

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function makeRequest(body: unknown, method = "POST"): NextRequest {
  return new NextRequest("http://localhost/api/interpret", {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// ─────────────────────────────────────────────────────────────
// Setup defaults before each test
// ─────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();

  // Auth → authenticated FREE user
  vi.mocked(authenticateRequest).mockResolvedValue({
    authenticated: true,
    user: VALID_USER,
  });

  // Rate limit → allowed, 9 remaining
  vi.mocked(checkRateLimit).mockReturnValue({
    allowed: true,
    remaining: 9,
    resetAt: Date.now() + 60_000,
  });

  // Object limit → allowed
  vi.mocked(canCreateObject).mockResolvedValue({
    allowed: true,
    remaining: 8,
    limit: 10,
  });

  // Validation → valid by default (text passes through)
  vi.mocked(validateObjectInput).mockImplementation((input: unknown) => ({
    valid: true,
    sanitizedText: String(input),
    errors: [],
  }));

  // Safety → no crisis detected
  vi.mocked(detectCrisis).mockReturnValue({
    isEmergency: false,
    shouldBlock: false,
    riskLevel: 'none',
    detectedKeywords: [],
    resources: [],
    showResources: false,
    message: '',
  });

  // Engine — event builder returns MOCK_EVENT
  vi.mocked(buildSilenceEventV1).mockReturnValue(MOCK_EVENT);

  // Engine — processor returns deterministic result
  vi.mocked(processSilenceEvent).mockResolvedValue(MOCK_ENGINE_RESULT);

  // Supabase — mock insert chain (fire-and-forget)
  const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null });
  vi.mocked(createClient).mockResolvedValue({
    from: vi.fn().mockReturnValue({ insert: mockInsert }),
  } as unknown as Awaited<ReturnType<typeof createClient>>);
});

// ─────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────

describe("POST /api/interpret", () => {
  // ── Test 1: Happy path ───────────────────────────────────

  it("returns 200 with engine output and backward-compatible lensA/lensB shape", async () => {
    const request = makeRequest({
      text: "I keep trying to control everything around me",
    });

    const response = await POST(request);
    const body = await response.json();

    // Status
    expect(response.status).toBe(200);

    // v6.0 new fields
    expect(body.engineDecision).toBe("pattern-detected");
    expect(body.s11Clean).toBe(true);
    expect(body.engineVersion).toBe("0.1.0");

    // Preserved lensA shape (backward compat)
    expect(typeof body.lensA.phase3Meaning).toBe("string");
    expect(body.lensA.phase3Meaning.length).toBeGreaterThan(0);
    expect(typeof body.lensB.phase3Meaning).toBe("string");

    // Metrics
    expect(body.metrics.patternsDetected).toBeGreaterThanOrEqual(0);
    expect(typeof body.metrics.engineMs).toBe("number");
    expect(typeof body.metrics.totalMs).toBe("number");

    // processSilenceEvent was called exactly once
    expect(processSilenceEvent).toHaveBeenCalledTimes(1);
    expect(buildSilenceEventV1).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: VALID_USER.id,
        source: "app",
      })
    );
  });

  // ── Test 2: Error path — invalid text → 422 ─────────────

  it("returns 422 VALIDATION_ERROR when input text fails validation", async () => {
    // Override: validation rejects
    vi.mocked(validateObjectInput).mockReturnValue({
      valid: false,
      sanitizedText: undefined,
      errors: [
        {
          code: "TEXT_TOO_SHORT" as const,
          message: "Tekst musi mieć co najmniej 50 znaków",
          field: "text",
        },
      ],
    });

    const request = makeRequest({ text: "za krótki" });

    const response = await POST(request);
    const body = await response.json();

    // Status
    expect(response.status).toBe(422);

    // Error shape — route forwards the specific validation error code
    expect(body.code).toBe("TEXT_TOO_SHORT");
    expect(typeof body.error).toBe("string");

    // Engine must NOT be reached
    expect(processSilenceEvent).not.toHaveBeenCalled();
    expect(buildSilenceEventV1).not.toHaveBeenCalled();
  });
});
