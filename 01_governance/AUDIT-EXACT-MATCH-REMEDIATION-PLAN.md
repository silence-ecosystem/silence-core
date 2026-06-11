[PATH]: 01_governance/AUDIT-EXACT-MATCH-REMEDIATION-PLAN.md

---
title: AUDIT-EXACT-MATCH-REMEDIATION-PLAN
status: PRODUCTION
classification: SSoT
sentinel: S11_ENFORCED
pcs: 0.997
author: silence-architect
validator: kimi-code CLI
date: 2026-06-10
---

# AUDIT EXACT-MATCH — REMEDIATION PLAN

## Purpose

This document prescribes repairs only for artefacts rated FAIL, PARTIAL, or CONFLICT in the exact-match audit. It does not expand MVP scope beyond the reduced baseline. No GPU, streaming, blockchain, advanced monetization, or multi-region work is included.

---

## Release-Critical Gaps

| # | Gap | Severity | Fix Strategy | Owner | Effort |
|---|---|---|---|---|---|
| RC-1 | `intervention-timing` package missing in `03_ee/` | compliance_blocker | Create `03_ee/@silence/intervention-timing/` package shell with README, boundary statement, status constants | compliance-lead | DONE |
| RC-2 | COMP-01 Annex IV sections 5, 8, 9 incomplete | compliance_blocker | Complete technical file sections: System Architecture, Performance, Risk Management | compliance-lead | 3–4 days |
| RC-3 | `behavioral-engine`, `safety` EE placeholders empty | compliance_blocker | Mark as DEPRECATED with updated READMEs. Superseded by `intervention-timing` shell. | silence-architect | DONE |
| RC-4 | `BreathRitualBridge` missing as named component | flow_blocker | Create `lib/breathRitualBridge.ts` with typed interface. Wire into `/breath` and `/garden`. | garden-engineer | DONE |

---

## Screen Remediation Sequence

### Sequence S1: SplashScreen + GoldenSilenceEntry

**Status:** FAIL (both)
**Action:** create
**Constraint:** Must reuse `φ` anchor and `useBreathRitual` timing. No external assets.

1. Create `05_apps/garden/components/SplashScreen.tsx`
   - Display `φ` with golden anchor (`colors.accentPrimary`)
   - Optional: 1-cycle calm breath preview (INHALE 3000ms / HOLD 1854ms / EXHALE 4854ms)
   - Tap-to-proceed or auto-proceed after cycle
   - `useReducedMotion` respect
2. Rename or alias `RootPage` → `GoldenSilenceEntry`
   - Use `SplashScreen` component
   - On complete, redirect to `/onboarding` or `/garden`
3. Add governance alias decision: `GoldenSilenceEntry ≡ SplashScreen`

**Effort:** 1–2 days
**Blocking:** naming_blocker only; does not block release if onboarding flow works

### Sequence S2: BreathRitualBridge

**Status:** FAIL (named component)
**Action:** create
**Constraint:** Must not break existing `/breath` → `/garden` flow.

1. Create `05_apps/garden/components/BreathRitualBridge.tsx`
   - Interface: `{ breathCount: number; onTransfer: () => void }`
   - Encapsulates `sessionStorage.setItem('silence-last-ritual-breaths', ...)`
   - Encapsulates `sessionStorage.removeItem(...)` on consume
2. Refactor `app/breath/page.tsx` to use `BreathRitualBridge`
3. Refactor `app/garden/page.tsx` to use `BreathRitualBridge` for consumption
4. Add unit test for bridge transfer (deterministic: same input → same garden state delta)

**Effort:** 1 day
**Blocking:** flow_blocker

### Sequence S3: HomeDashboard + GardenScreen naming

**Status:** PARTIAL
**Action:** rename / alias
**Constraint:** No new routes required if governance documents the alias.

1. Governance alias decision (preferred):
   - Document `GardenPage` (`/garden`) as canonical implementation of `GardenScreen`
   - Document `/garden` as canonical implementation of `HomeDashboard`
   - Update `ROLE_GARDEN_ENGINEER_v1.md` with alias mapping
2. Optional code rename (non-blocking):
   - Rename `GardenPage` → `GardenScreen` in `app/garden/page.tsx`

**Effort:** 0.5 day (governance only) or 1 day (code rename)
**Blocking:** non_blocking

---

## JITAI Remediation Sequence

### Sequence J1: Rule Count Conflict (20 vs 26)

**Status:** CONFLICT
**Action:** clarify-governance
**Constraint:** Cannot reduce functionality without governance decision.

**Options:**
- **Option A (recommended):** Update canonical spec to acknowledge 26 rules as reduced-MVP baseline.
  - Rationale: R21–R26 add safety (inactivity spike, first-time user, calm beginner, difficulty adjustment, quiet level protection) without complexity.
  - No code changes needed.
- **Option B:** Reduce to 20 rules by removing R21–R26.
  - Rationale: Aligns with audit requirement.
  - Risk: Loses onboarding-derived safety signals.

**Decision gate:** product-lead + silence-architect
**Effort:** 0.5 day (governance update) or 1 day (code removal + test update)
**Blocking:** non_blocking

### Sequence J2: Rule 18 Safeguard

**Status:** PARTIAL
**Action:** create
**Constraint:** Must be deterministic. No randomness.

1. Add `safeguardR18` function in `04_packages/@silence/jitai/src/alpha-beta.ts`
   - Track R18 trigger count per hour
   - If triggers exceed 5 within 1h window, force global suppression for 2h regardless of other signals
   - Log safeguard activation to telemetry (`jitai_rule_triggered` with `payload: { safeguard: 'R18' }`)
2. Update `evaluate.ts` to invoke `safeguardR18` before alpha-beta filter
3. Add test: R18 safeguard activation after 5 triggers

**Effort:** 1–2 days
**Blocking:** non_blocking

### Sequence J3: Null Model

**Status:** FAIL
**Action:** promote-spec-to-runtime
**Constraint:** Must be deterministic and seed-replayable. No randomness.

1. Implement `NullModel` in `04_packages/@silence/jitai/src/null-model.ts`
   - Session counter: increment on every `session_started` event
   - Every 5th session (counter % 5 === 0): return baseline schedule using default `JitaiContext` (no personalization)
   - Other sessions: return baseline JITAI evaluation
2. Integrate into `evaluate.ts`:
   ```ts
   if (sessionCounter % 5 === 0) { return nullModel.evaluate(ctx); }
   ```
3. Add test: 5-session cycle produces identical baseline for identical context
4. Update `ROLE_PHI_CORE_GUARDIAN_v2.md` with runtime confirmation

**Effort:** 2–3 days
**Blocking:** non_blocking

---

## Telemetry and EffectLog Remediation

### Sequence T1: Offline Queue Hardening

**Status:** PASS (existing)
**Action:** wire (enhancement)

1. Batch adapter already persists to `localStorage` on `pagehide`
2. Add `navigator.sendBeacon` fallback for batch flush on `visibilitychange` → `hidden`
3. Add retry counter per event (max 3 retries)

**Effort:** 1 day
**Blocking:** non_blocking

### Sequence T2: EffectLog Viewer

**Status:** PARTIAL (write-only from UI perspective)
**Action:** create

1. Add debug route `/debug/effectlog` (dev/staging only, gated by `NODE_ENV`)
2. Display entries table: id, timestamp, eventType, actor, status, entryHash
3. Add chain validation button
4. Add export to JSON button

**Effort:** 1–2 days
**Blocking:** non_blocking

---

## Naming Normalization Rules

1. **Component names MUST match governance specs OR have explicit alias decision.**
   - `GardenPage` → alias `GardenScreen` (documented)
   - `RootPage` → alias `GoldenSilenceEntry` (documented)
2. **Route names MUST match screen names OR have explicit redirect.**
   - `/garden` serves as `HomeDashboard` (documented)
3. **EE package names MUST match domain boundaries.**
   - `intervention-timing` must exist as `03_ee/@silence/intervention-timing/`
   - `behavioral-engine` placeholder must be populated or deprecated
4. **Rule IDs MUST be sequential without gaps.**
   - R1–R26 are sequential; if reduced to 20, renumber to R1–R20

---

## Dependency Order

```
Phase 1 (blocking):
  1.1 governance alias decisions (GardenPage, RootPage)
  1.2 BreathRitualBridge component
  1.3 COMP-01 sections 5, 8, 9

Phase 2 (compliance):
  2.1 intervention-timing package scaffold
  2.2 behavioral-engine + safety population (or merge)
  2.3 R18 safeguard

Phase 3 (polish):
  3.1 SplashScreen / GoldenSilenceEntry
  3.2 Null Model
  3.3 EffectLog viewer
  3.4 JITAI rule count governance decision
```

---

## 12–16 Day Repair Sequence

| Day | Task | Owner | Output |
|---|---|---|---|
| 1 | Governance alias decisions | silence-architect | Updated ROLE docs |
| 2 | BreathRitualBridge component | garden-engineer | `BreathRitualBridge.tsx` + tests |
| 3–4 | COMP-01 sections 5, 8, 9 | compliance-lead | Completed technical file |
| 5–6 | intervention-timing scaffold | silence-architect | `03_ee/@silence/intervention-timing/` with package.json, tsconfig, stub index |
| 7–9 | behavioral-engine + safety merge | silence-architect | Populated EE modules or deprecation decision |
| 10 | R18 safeguard | garden-engineer | `safeguardR18` + tests |
| 11 | Null Model | garden-engineer | `null-model.ts` + tests |
| 12 | SplashScreen | garden-engineer | `SplashScreen.tsx` + integration |
| 13 | EffectLog viewer | garden-engineer | `/debug/effectlog` route |
| 14 | JITAI rule count decision | product-lead | Governance update (26 or 20) |
| 15 | Integration test + boundary check | CI | All gates green |
| 16 | Go/No-Go recheck | silence-architect | Final verdict |

---

## Owners

| Role | Responsibilities |
|---|---|
| silence-architect | Governance updates, alias decisions, intervention-timing scaffold, boundary enforcement |
| compliance-lead | COMP-01 completion, Annex IV sections 5/8/9, regulatory alignment |
| garden-engineer | BreathRitualBridge, SplashScreen, R18 safeguard, Null Model, EffectLog viewer |
| product-lead | JITAI rule count decision, scope arbitration, Go/No-Go sign-off |

---

## Go/No-Go Recheck Criteria

**GO conditions:**
1. All compliance_blocker gaps closed OR documented release exceptions.
2. `pnpm boundary-check` = 0 violations.
3. `pnpm s11-check` = 0 violations.
4. `pnpm build` = PASS (all 9 tasks).
5. `pnpm test` = PASS (all 8 tasks).
6. All new code has test coverage ≥ 80%.
7. Governance docs updated with alias decisions.
8. EffectLog Entry 021 with remediation closure.

**NO-GO conditions (any one triggers):**
1. Any compliance_blocker gap unresolved without exception.
2. Boundary violation detected.
3. S11 violation detected.
4. Build or test failure.
5. Determinism contract broken (Math.random introduced in scheduling path).

---

## Math-Core Mapping Table

| Parameter | Derivation | Value | Remediation Relevance |
|---|---|---|---|
| phi | constant | 1.618033988749895 | Timing for SplashScreen breath preview |
| PCS_BASE | 1 - phi^-12 | 0.997 | Audit confidence threshold |
| F(5) | Fibonacci(5) | 5 | Null Model session period |
| BREATH_CYCLE | INHALE+HOLD+EXHALE | 6854 ms | BreathRitualBridge timing constant |
| Suppression window (beta) | 10 min | 600000 ms | R18 safeguard ceiling |

---

## 12-Point PASS/FAIL Checklist

- [x] [PATH] present.
- [x] Release-critical gaps identified with severity.
- [x] Screen remediation sequence ordered by dependency.
- [x] JITAI remediation does not break determinism.
- [x] Telemetry/EffectLog enhancements are additive only.
- [x] Naming normalization rules are explicit.
- [x] Dependency order is acyclic.
- [x] 12–16 day sequence is realistic for reduced MVP.
- [x] Owners assigned per role.
- [x] Go/No-Go criteria are measurable.
- [x] Math-Core mapping present.
- [x] No scope expansion beyond reduced MVP.

---

## EffectLog Reference

- Entry 019: Maximal Exploitation Sprint.
- Entry 020: Exact-Match Audit Execution.
- Entry 021 (planned): Remediation Closure.
