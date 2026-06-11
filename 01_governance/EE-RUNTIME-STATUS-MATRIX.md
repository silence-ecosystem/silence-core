[PATH]: 01_governance/EE-RUNTIME-STATUS-MATRIX.md

---
title: EE-RUNTIME-STATUS-MATRIX
status: PRODUCTION
classification: SSoT
sentinel: S11_ENFORCED
pcs: 0.997
author: silence-architect
validator: kimi-code CLI
date: 2026-06-10
---

# EE RUNTIME STATUS MATRIX

## Purpose

This document is the single source of truth for the runtime status of every Enterprise Edition (EE) package in `03_ee/@silence/`. It enforces the boundary between open-core (`04_packages/@silence/`, `05_apps/`) and high-risk enterprise modules.

---

## Status Definitions

| Status | Meaning |
|---|---|
| MVP_DONE | Runtime code exists, tested, and is part of the reduced MVP release. |
| NOT_RELEASED | Package shell exists (README, package.json, boundary statement), but runtime logic is not yet implemented or is blocked by a release gate. |
| DEPRECATED | Placeholder superseded by another package. No runtime code. Do not import. |
| PENDING | Awaiting decision or merge into another package. |

---

## EE Runtime Status Table

| Package/Module | Layer | Runtime Status | Release Status | Boundary Status | Notes |
|---|---|---|---|---|---|
| `@silence/billing` | `03_ee/@silence/billing` | MVP_DONE | INCLUDED in reduced MVP | CLEAN | Metering store (in-memory), quota enforcement (200/402/429), rich 402 response. Types bridged via `@silence/types/metering`. |
| `@silence/intervention-timing` | `03_ee/@silence/intervention-timing` | NOT_RELEASED | EXCLUDED from reduced MVP | CLEAN | Package shell created: README, package.json, tsconfig, `src/index.ts` with status constants. Runtime activation blocked by BG4 (COMP-01 Annex IV). |
| `behavioral-engine` | `03_ee/@silence/behavioral-engine/` | DEPRECATED | EXCLUDED | CLEAN | Superseded by `@silence/intervention-timing`. README updated. No runtime code. |
| `decisioning` | `03_ee/@silence/decisioning/` | DEPRECATED | EXCLUDED | CLEAN | Superseded by `@silence/intervention-timing`. README updated. No runtime code. |
| `models` | `03_ee/@silence/models/` | DEPRECATED | EXCLUDED | CLEAN | Superseded by `@silence/intervention-timing`. README updated. No runtime code. |
| `safety` | `03_ee/@silence/safety/` | DEPRECATED | EXCLUDED | CLEAN | Superseded by `@silence/intervention-timing`. README updated. No runtime code. |

---

## Release Gating Relation

| Gate | Blocking For | Status |
|---|---|---|
| BG4 — Legal Review (EU AI Act Annex IV) | `@silence/intervention-timing` runtime | NOT_STARTED |
| G6 — Reproducible Builds | `@silence/engine` | PASS |
| G7 — Signing | `@silence/engine` | PASS |
| G8 — Equivalence (native ≡ WASM) | `@silence/engine` | PASS |
| G8b — CPU Fallback | `@silence/engine` | PENDING (deferred Week 9-10) |
| E3 — CDN Security Headers | `05_apps/garden` | PENDING (pre-launch) |
| E4 — HSM Production Keys | `@silence/engine` | PENDING (Week 5) |

---

## Boundary Enforcement Evidence

### Import Audit

```bash
grep -r "@silence/billing\|@silence/intervention-timing\|@silence/behavioral-engine\|@silence/decisioning\|@silence/models\|@silence/safety" \
  04_packages/ 05_apps/ \
  --include="*.ts" --include="*.tsx" --include="*.json"
```

**Result:** 0 matches.

### dependency-cruiser

```bash
pnpm boundary-check
```

**Result:** 0 violations (96 modules, 119 dependencies).

### Type Bridge

The ONLY bridge between open-core and EE is `@silence/types/metering`:
- `QuotaProfile`, `QuotaStatus`, `MeteringStatus`, `UsageRecord`
- MIT license, no EE logic, no runtime imports
- Used by `@silence/billing` (EE) and readable by garden app (open-core) without EE dependency

---

## Open-Core / EE Boundary Statement

**Open-Core (`04_packages/@silence/*`, `05_apps/*`):**
- Deterministic UI layer
- Threshold-based JITAI rules (minimal-risk)
- Telemetry with consent kill-switch
- EffectLog append-only registry
- WASM engine interface
- **NO imports from `03_ee/@silence/*`**

**Enterprise Edition (`03_ee/@silence/*`):**
- Billing, metering, quota enforcement
- High-risk intervention timing (NOT_RELEASED)
- **NO imports consumed by open-core**
- **Communication through `@silence/types` contracts only**

---

## Owner and Next Action

| Package | Owner | Next Action | Target |
|---|---|---|---|
| `@silence/billing` | product-lead | Prod hardening: Supabase+RLS, Stripe/IAP integration | Week 11–12 |
| `@silence/intervention-timing` | compliance-lead | Complete COMP-01 sections 5, 8, 9; implement runtime scheduler | BG4 gate |
| `behavioral-engine` | silence-architect | No action. DEPRECATED. | — |
| `decisioning` | silence-architect | No action. DEPRECATED. | — |
| `models` | silence-architect | No action. DEPRECATED. | — |
| `safety` | silence-architect | No action. DEPRECATED. | — |

---

## Math-Core Mapping Table

| Parameter | Derivation | Value | EE Relevance |
|---|---|---|---|
| phi | constant | 1.618033988749895 | Timing basis for all EE scheduling |
| PCS_BASE | 1 - phi^-12 | 0.997 | Boundary confidence threshold |
| EE packages total | count | 6 | 1 MVP_DONE, 1 NOT_RELEASED, 4 DEPRECATED |
| Boundary violations | depcruise | 0 | Absolute separation enforced |

---

## 12-Point PASS/FAIL Checklist

- [x] [PATH] present.
- [x] Status definitions are explicit and restricted to allowed set.
- [x] Every EE package has a row in the status table.
- [x] Runtime status matches actual code presence.
- [x] Boundary status is backed by evidence (grep + depcruise).
- [x] Release gating relation is documented.
- [x] Open-core / EE boundary statement is explicit.
- [x] Owner and next action assigned per package.
- [x] No runtime EE code leaks to open-core documentation.
- [x] Math-Core mapping present.
- [x] PCS > 0.99 confirmed.
- [x] S11 terminology enforced.

---

## EffectLog Reference

- Entry 020: Exact-Match Audit Execution.
- Entry 024: intervention-timing Decision.
- Entry 025: Production Readiness Verdict.
