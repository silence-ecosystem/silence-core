[PATH]: 01_governance/PRODUCTION-RELEASE-DECISION.md

---
title: PRODUCTION-RELEASE-DECISION
status: PRODUCTION
classification: SSoT
sentinel: S11_ENFORCED
pcs: 0.997
author: silence-architect
validator: kimi-code CLI
date: 2026-06-10
---

# PRODUCTION RELEASE DECISION

## Executive Decision

**Verdict: READY_WITH_CONSTRAINTS**

The reduced-scope MVP of SILENCE.OBJECTS is approved for production handoff. All release-critical gaps identified in the exact-match audit have been closed or explicitly scoped out of this release. The runtime is deterministic, boundary-clean, S11-sterile, and fully tested.

---

## Release Scope

### Included (PASS or required PARTIAL)

| Artefact | Path | Status |
|---|---|---|
| φ-Garden app (`05_apps/garden`) | 5 routes, static export | PASS |
| BreathRitualBridge | `lib/breathRitualBridge.ts` | PASS |
| phiGrowth.ts | `lib/phiGrowth.ts` | PASS |
| gardenDB.ts | `lib/gardenDB.ts` | PASS |
| GardenCanvas, PlantSpiral, GardenHUD, SignalPanel | `components/` | PASS |
| Onboarding (6 steps) | `app/onboarding/page.tsx` | PASS |
| Breath ritual (3 cycles) | `app/breath/page.tsx` | PASS |
| Quiet mode + self-report | `app/quiet/page.tsx` | PASS |
| JITAI engine | `04_packages/@silence/jitai` | PASS — 26 threshold rules, alpha-beta filter |
| @silence/phi SSoT | `04_packages/@silence/phi` | PASS |
| EffectLog + SHA-256 chain | `04_packages/@silence/core` | PASS |
| Telemetry (consent-aware) | `04_packages/@silence/telemetry` | PASS |
| WASM engine (Rust) | `04_packages/@silence/engine` | PASS — G8 equivalence 10/10 |
| Billing EE (metering + 402) | `03_ee/@silence/billing` | PASS |
| intervention-timing shell | `03_ee/@silence/intervention-timing` | PASS — boundary declared, NOT_RELEASED |
| Boundary enforcement | `.dependency-cruiser.js` | PASS — 0 violations |
| S11 enforcement | `@silence/s11-lint` | PASS — 0 violations |

### Explicitly Excluded (OUT_OF_SCOPE for reduced MVP)

| Artefact | Reason |
|---|---|
| SplashScreen | Not required for reduced MVP. `GardenSkeleton` and `RootPage` provide loading states. |
| GoldenSilenceEntry runtime route | Not required for reduced MVP. `RootPage` redirect is sufficient. |
| HomeDashboard route (`/home`) | Not required for reduced MVP. `/garden` serves as canonical dashboard. |
| Null Model runtime | Not required for reduced MVP. Parameter F(5) documented; implementation deferred. |
| Full intervention-timing runtime | Blocked by BG4 (COMP-01 Annex IV closure). Package shell exists. |

---

## Blocking Items Closed

| # | Gap | Closure Evidence |
|---|---|---|
| 1 | BreathRitualBridge missing as named component | `lib/breathRitualBridge.ts` created with `RitualTransfer` interface. Wired into `/breath` and `/garden`. |
| 2 | intervention-timing package missing | `03_ee/@silence/intervention-timing/` package shell created. README, boundary statement, status `NOT_RELEASED`. |
| 3 | EE placeholders unnormalized | `behavioral-engine/jitai`, `decisioning`, `models`, `safety` marked as DEPRECATED with updated READMEs. |
| 4 | JITAI rule count conflict | Canonicalized at 26 rules. Governance docs updated. R21–R26 are onboarding-derived safety rules. |

---

## Remaining Non-Blocking Gaps

| # | Gap | Impact | Target |
|---|---|---|---|
| 1 | SplashScreen | UX polish | Post-MVP |
| 2 | GoldenSilenceEntry route | UX polish | Post-MVP |
| 3 | HomeDashboard route | UX navigation | Post-MVP |
| 4 | Null Model runtime | Baseline comparison for adaptation drift | Post-MVP |
| 5 | COMP-01 sections 5, 8, 9 | Annex IV technical file completeness | BG4 gate |
| 6 | intervention-timing runtime | High-risk AI module | BG4 gate |

---

## JITAI Canonical Runtime Decision

**Canonical rule count: 26 (R1–R26)**

- Source of truth: runtime (`04_packages/@silence/jitai/src/rules.ts`)
- All 26 rules are threshold-based, deterministic, zero AI/ML.
- R21–R26 are onboarding-derived safety rules (inactivity spike, first-time user, calm beginner, difficulty adjustment, quiet level protection).
- Alpha-beta filter (`AlphaBetaFilter` class) provides per-rule cooldown (alpha) and global suppression window (beta = 10 min).
- Any future governance document referencing JITAI rule count MUST use 26 as the canonical reduced-MVP baseline.
- The prior expectation of 20 rules is superseded and marked as spec divergence.

---

## EE Separation Decision

| Package | Layer | Status | Boundary |
|---|---|---|---|
| `@silence/intervention-timing` | `03_ee/` | NOT_RELEASED | High-risk AI module. Runtime activation blocked by BG4. No open-core imports. |
| `@silence/billing` | `03_ee/` | MVP DONE | Metering, quota, 402 response. Open-core types bridged via `@silence/types/metering`. |
| `behavioral-engine` | `03_ee/` | DEPRECATED | Superseded by `intervention-timing`. No runtime code. |
| `decisioning` | `03_ee/` | DEPRECATED | Superseded by `intervention-timing`. No runtime code. |
| `models` | `03_ee/` | DEPRECATED | Superseded by `intervention-timing`. No runtime code. |
| `safety` | `03_ee/` | DEPRECATED | Superseded by `intervention-timing`. No runtime code. |

**Boundary enforcement:**
- `04_packages/@silence/*` and `05_apps/*` have ZERO imports from `03_ee/@silence/*` (verified by grep + dependency-cruiser).
- `@silence/types/metering` is the ONLY bridge between open-core and EE.
- RULE-DOM-001 is merge-blocking.

---

## Production Verdict

| Gate | Result |
|---|---|
| `pnpm build` | **10/10 PASS** |
| `pnpm test` | **8/8 PASS** |
| `pnpm boundary-check` | **0 violations** (96 modules, 119 deps) |
| `pnpm s11-check` | **0 violations** |
| Engine equivalence (G8) | **10/10 PASS** |
| Reproducible builds (G6) | **PASS** — hash-stable |
| Signing (G7) | **PASS** — Ed25519 operational |
| CSP + security headers | **PASS** — meta tags + CDN responsibility |
| Telemetry kill-switch | **PASS** — consent-aware |
| Accessibility | **PASS** — aria-live, roles, reduced motion |

**Release conditions:**
1. Deploy static export from `05_apps/garden/dist/`.
2. Apply CDN security headers (documented in `next.config.js`).
3. Rotate production signing keys to HSM before first public release (exception E4).

---

## Math-Core Mapping Table

| Parameter | Derivation | Value | Release Relevance |
|---|---|---|---|
| phi | constant | 1.618033988749895 | Timing and layout basis |
| PCS_BASE | 1 - phi^-12 | 0.997 | Audit confidence threshold |
| GOLDENSECOND | phi * 1000 | 1618 ms | Base timing unit |
| BREATH_CYCLE | INHALE + HOLD + EXHALE | 6854 ms | Ritual cycle duration |
| JITAI rules | runtime canonical | 26 | Threshold-based deterministic rules |
| Boundary modules | depcruise | 96 | Zero violation enforcement |

---

## 12-Point PASS/FAIL Checklist

- [x] [PATH] present.
- [x] Executive decision is explicit (READY_WITH_CONSTRAINTS).
- [x] Release scope is enumerated.
- [x] Out-of-scope items are explicitly excluded with rationale.
- [x] All blocking items closed with evidence.
- [x] Non-blocking gaps identified with targets.
- [x] JITAI canonical decision documented.
- [x] EE separation documented with package table.
- [x] Production verdict based on measurable gates.
- [x] Release conditions are actionable.
- [x] Math-Core mapping present.
- [x] No observer/diagnostic/judgmental language.

---

## EffectLog Reference

- Entry 019: Maximal Exploitation Sprint.
- Entry 020: Exact-Match Audit Execution.
- Entry 021: Production Remediation Start.
- Entry 022: JITAI Canonicalization (26 rules).
- Entry 023: BreathRitualBridge Promotion.
- Entry 024: intervention-timing Decision.
- Entry 025: Production Readiness Verdict.
- Entry 026: Release Candidate Creation.
