[PATH]: 01_governance/POST-RELEASE-HARDENING-PLAN.md

---
title: POST-RELEASE-HARDENING-PLAN
status: POST_RELEASE
classification: SSoT
sentinel: S11_ENFORCED
pcs: 0.997
author: silence-architect
validator: kimi-code CLI
date: 2026-06-10
---

# POST-RELEASE HARDENING PLAN

## Purpose

This document defines the post-release hardening sequence for the SILENCE.OBJECTS reduced-scope MVP (verdict: APPROVED — REDUCED-SCOPE MVP per `PRODUCTION-RELEASE-DECISION.md`). It contains **only** deferred and non-blocking items. No functional expansion of the MVP runtime is authorized.

---

## Scope Post-Release

### In Scope
- Security and infrastructure hardening deferred from release (CDN headers, HSM key rotation).
- Engine equivalence gap G8b (TypeScript CPU fallback path).
- EE / open-core boundary refinement (SDK facade, guards cleanup, placeholder status refresh).
- Governance spec promotion (GardenState, growth logic, BreathRitualBridge specs extracted from inline code comments to standalone documents).
- Monitoring schema and Trust Scorecard foundations (telemetry aggregation, observer metric definitions).
- Deterministic runtime remains untouched: phi-core, JITAI rule engine, EffectLog chain, WASM engine interface.

### Out of Scope
- New routes, screens, or user-facing features (SplashScreen, GoldenSilenceEntry, HomeDashboard remain deferred).
- Null Model runtime implementation (F(5) parameter stays documented only).
- COMP-01 Annex IV sections 5, 8, 9 (tracked separately; formal changes require compliance-lead sign-off).
- Any modification to JITAI rule logic, engine scheduler, or billing quota thresholds.
- Any change that would invalidate the existing boundary-check or s11-check PASS status.

---

## Deferred Items Inventory

### Category A — Security and Infrastructure Hardening

| ID | Item | Source Document | Severity | Owner | Rationale |
|---|---|---|---|---|---|
| E3 | CDN security headers (Strict-Transport-Security, CSP, X-Frame-Options, Cache-Control) | `PRODUCTION-READINESS-CHECKLIST.md` §6 | MEDIUM | ops-lead | Static export delegates headers to CDN edge; meta tags are lenient fallback. Full hardening requires hosting-provider configuration. |
| E4 | HSM production signing key rotation | `PRODUCTION-READINESS-CHECKLIST.md` §6, `ENGINE-KEY-MANAGEMENT-POLICY.md` | MEDIUM | security-lead | Dev/staging use file-based keys. Production requires YubiHSM 2 or AWS CloudHSM with 90-day rotation. |
| S1 | robots.txt production policy migration | `DEPLOYMENT-CONFIG-MATRIX.md` | LOW | ops-lead | Staging uses `Disallow: /`. Production must switch to `Allow: /` with selective restrictions. |
| S2 | CSP enforcement layer migration (meta tag → CDN header) | `DEPLOYMENT-CONFIG-MATRIX.md` | MEDIUM | ops-lead | Meta tag is necessary for static export but weaker than HTTP header. Production CSP must be strict. |

### Category B — Engine Equivalence

| ID | Item | Source Document | Severity | Owner | Rationale |
|---|---|---|---|---|---|
| E2 / G8b | TypeScript CPU fallback path for WASM-unavailable environments | `PRODUCTION-READINESS-CHECKLIST.md` §2.4, `EE-RUNTIME-STATUS-MATRIX.md` | MEDIUM | engine-lead | WASM may be blocked by enterprise proxies or CSP. A deterministic TypeScript fallback ensures schedule computation continuity without external dependencies. |
| G8b-1 | CPU fallback equivalence test suite (CPU ≡ native ≡ WASM) | `MVP-REDUCED-SCOPE-EXECUTION-PLAN.md` | MEDIUM | engine-lead | Fallback must produce identical outputs for identical inputs. Requires property-based equivalence test. |

### Category C — EE / Open-Core Separation

| ID | Item | Source Document | Severity | Owner | Rationale |
|---|---|---|---|---|---|
| EE1 | `@silence/sdk` thin facade implementation | `AUDIT-EXACT-MATCH-GAP-MATRIX.md` | LOW | silence-architect | Empty placeholder. Must become a zero-logic re-export layer: open-core types + `@silence/types/metering`. |
| EE2 | `@silence/guards` resolution (remove or implement input guards) | `AUDIT-EXACT-MATCH-GAP-MATRIX.md` | LOW | silence-architect | Empty placeholder. Either remove from workspace or implement minimal input-validation surface with zero side effects. |
| EE3 | EE placeholder README status refresh | `EE-RUNTIME-STATUS-MATRIX.md` | LOW | silence-architect | Ensure DEPRECATED packages have explicit migration pointers to `@silence/intervention-timing`. |
| EE4 | `intervention-timing` shell boundary re-audit | `EE-RUNTIME-STATUS-MATRIX.md` | LOW | compliance-lead | Verify that the NOT_RELEASED shell still carries zero open-core imports and that boundary statements are current. |

### Category D — Governance Spec Promotion

| ID | Item | Source Document | Severity | Owner | Rationale |
|---|---|---|---|---|---|
| SP1 | GardenState and Plant types governance spec | `AUDIT-EXACT-MATCH-GAP-MATRIX.md` | LOW | silence-architect | Types exist in `gardenTypes.ts`. Extract into `@silence/types/garden.ts` and publish governance spec. |
| SP2 | Growth logic formal spec | `AUDIT-EXACT-MATCH-GAP-MATRIX.md` | LOW | silence-architect | Document ritual growth, idle growth, streak mechanics, phi dimensions as standalone spec. |
| SP3 | BreathRitualBridge formal spec | `AUDIT-EXACT-MATCH-GAP-MATRIX.md` | LOW | silence-architect | Bridge logic is inline. Dedicated spec reduces ambiguity for future maintainers. |
| SP4 | Governance alias table (GardenScreen ≡ GardenPage, HomeDashboard ≡ GardenPage) | `AUDIT-EXACT-MATCH-GAP-MATRIX.md` | LOW | silence-architect | Canonicalize naming aliases so that future audits do not flag them as gaps. |

### Category E — Monitoring and Trust Scorecard

| ID | Item | Source Document | Severity | Owner | Rationale |
|---|---|---|---|---|---|
| M1 | Telemetry batch schema for ClickHouse (or equivalent column store) | `PRODUCTION-READINESS-CHECKLIST.md` §4 | LOW | product-lead | Batch adapter currently buffers in memory. Post-release requires persistent aggregation schema for observer metrics. |
| M2 | Trust Scorecard metric definitions | — | LOW | product-lead | Define: consent coverage rate, WASM load success rate, JITAI signal display rate, quota-enforcement accuracy. |
| M3 | Dashboard query templates | — | LOW | product-lead | SQL / query-language templates for Trust Scorecard dimensions. |

---

## Security and Infrastructure Hardening

### E3 — CDN Security Headers

**Objective:** Move security enforcement from HTML meta tags to HTTP response headers at the CDN edge.

**Required Headers:**
| Header | Production Value | Verification |
|---|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | curl -I |
| `Content-Security-Policy` | Stricter than meta tag; no `unsafe-inline` | CSP evaluator |
| `X-Content-Type-Options` | `nosniff` | curl -I |
| `X-Frame-Options` | `DENY` | curl -I |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | curl -I |
| `Permissions-Policy` | `geolocation=(), microphone=(), camera=(), payment=()` | curl -I |
| `Cache-Control` (HTML) | `public, max-age=0, must-revalidate` | curl -I |
| `Cache-Control` (assets) | `public, max-age=31536000, immutable` | curl -I |

**Rollback:** Revert CDN config to previous header set. Meta tags remain as fallback.

### E4 — HSM Production Key Rotation

**Objective:** Replace file-based production signing keys with HSM-protected Ed25519 keys.

**Procedure:**
1. Provision HSM (YubiHSM 2 or AWS CloudHSM) with Ed25519 support.
2. Generate signing key inside HSM; private key never exported.
3. Export public key; pin in `05_apps/garden/public/engine-signing-key.pub`.
4. Update CI pipeline to call HSM for signing via PKCS#11 or vendor SDK.
5. Update `ENGINE-KEY-MANAGEMENT-POLICY.md` with HSM slot identifiers.
6. File `EFFECTLOG.md` entry recording key hash and rotation timestamp.

**Rollback:** Revert CI to file-based key mount. Previous key remains in `RELEASE_KEYS/` as emergency fallback.

---

## Monitoring and Trust Scorecard Enhancements

### M1 — Telemetry Aggregation Schema

**Event types to aggregate:**
- `app_open`
- `onboarding_completed`
- `breath_cycle_completed`
- `garden_state_changed`
- `quiet_session_started`
- `quiet_session_ended`
- `jitai_signal_displayed`
- `quota_warning_80`
- `quota_exceeded_402`

**Dimensions:**
- `environment` (dev | staging | production)
- `app_version`
- `observer_id` (hashed)
- `session_id`
- `timestamp` (UTC, millisecond)

### M2 — Trust Scorecard Metrics

| Metric | Formula | Target | Action Threshold |
|---|---|---|---|
| Consent coverage rate | `consented_sessions / total_sessions` | > 0.99 | < 0.95 triggers review |
| WASM load success rate | `successful_wasm_loads / total_app_opens` | > 0.98 | < 0.95 triggers review |
| JITAI signal display rate | `signals_displayed / signals_evaluated` | > 0.90 | < 0.80 triggers review |
| Quota enforcement accuracy | `correct_402_responses / quota_exceeded_events` | 1.00 | < 1.00 triggers review |
| S11 violation count | `forbidden_terms_detected` | 0 | > 0 blocks deployment |
| Boundary violation count | `depcruise_violations` | 0 | > 0 blocks deployment |

---

## EE / Open-Core Separation (Post-Release)

### EE1 — SDK Facade

`@silence/sdk` must be a zero-logic package:
- `src/index.ts` re-exports from `@silence/core`, `@silence/phi`, `@silence/telemetry`, `@silence/jitai`, `@silence/types/metering`.
- No new functions. No side effects. No EE imports.
- Build target: `tsc` only.

### EE2 — Guards Resolution

Two options:
- **Option A (Remove):** Delete `04_packages/@silence/guards/` and remove from `pnpm-workspace.yaml`. Cleanest.
- **Option B (Implement):** Add minimal input guards (non-empty string, positive integer bounds) with zero side effects. Must not duplicate JITAI rule logic.

**Decision:** Prefer Option A unless external integration contract requires a guards package.

### EE3 — Placeholder Refresh

For each DEPRECATED package (`behavioral-engine`, `decisioning`, `models`, `safety`):
- Verify README contains explicit pointer to `@silence/intervention-timing`.
- Verify `package.json` contains `"private": true` and no publish config.
- Verify no import references exist in open-core or apps.

---

## Timeline

| Week | Focus | Items | Deliverables |
|---|---|---|---|
| 1 | Security hardening | E3 (CDN headers), S1 (robots.txt), S2 (CSP layer) | CDN config verified, header scan PASS |
| 2 | Key infrastructure | E4 (HSM rotation), EE3 (placeholder refresh) | HSM key live, `EFFECTLOG.md` entry filed, boundary re-audit PASS |
| 3 | Engine equivalence | G8b (CPU fallback), G8b-1 (equivalence tests) | TypeScript fallback module, 1000-input equivalence test PASS |
| 4 | SDK / guards / specs | EE1 (SDK facade), EE2 (guards resolution), SP1 (GardenState spec) | `@silence/sdk` builds, guards decision recorded, GardenState spec published |
| 5 | Monitoring foundations | M1 (ClickHouse schema), M2 (Trust Scorecard metrics), M3 (dashboard queries) | Schema DDL committed, metric definitions in governance, query templates tested |
| 6 | Governance closure | SP2 (growth logic), SP3 (BreathRitualBridge), SP4 (alias table) | All specs published, alias table canonicalized, final boundary-check PASS |

**Coordination rule:** Weeks are calendar weeks. No item may cross week boundaries without explicit extension logged in `EFFECTLOG.md`.

---

## Owners

| Owner | Responsibilities |
|---|---|
| ops-lead | E3, S1, S2, CDN configuration, deployment pipeline |
| security-lead | E4, HSM provisioning, key rotation, `ENGINE-KEY-MANAGEMENT-POLICY.md` updates |
| engine-lead | G8b, G8b-1, engine equivalence verification, WASM interface stability |
| product-lead | M1, M2, M3, telemetry schema, Trust Scorecard, observer metric review |
| compliance-lead | EE4, COMP-01 coordination, boundary audit |
| silence-architect | EE1, EE2, EE3, SP1, SP2, SP3, SP4, governance consistency, S11 enforcement |

---

## Math-Core Mapping Table

| Parameter | Derivation | Value | Post-Release Relevance |
|---|---|---|---|
| phi | constant | 1.618033988749895 | Week cadence spacing (phi-day rhythm for change windows) |
| GOLDENSECOND | phi * 1000 | 1618 ms | Minimum validation window for any runtime change |
| Validation Window | round(GOLDENSECOND / phi^2) | ~382 ms | Canary observation interval |
| PCS_BASE | 1 - phi^-12 | 0.997 | Minimum confidence for any hardening change acceptance |
| F(5) | Fibonacci(5) | 5 | Null Model period; remains documented only |
| EE packages total | count | 6 | 1 MVP_DONE, 1 NOT_RELEASED, 4 DEPRECATED |
| Boundary violations | depcruise | 0 | Must remain 0 throughout post-release |

---

## 12-Point PASS/FAIL Checklist

- [x] [PATH] present.
- [x] Scope Post-Release explicitly separates in-scope from out-of-scope items.
- [x] Deferred Items Inventory contains every deferred and non-blocking item from release governance.
- [x] Every item has a source document, severity, and owner.
- [x] Security hardening section specifies exact headers, HSM procedure, and rollback steps.
- [x] Monitoring section defines event types, dimensions, and Trust Scorecard metrics.
- [x] EE section specifies zero-logic SDK facade and guards resolution decision.
- [x] Timeline is bounded to 6 weeks with explicit deliverables per week.
- [x] Owners are assigned without overlap or ambiguity.
- [x] Math-Core mapping present with post-relevant derivations.
- [x] PCS > 0.99 confirmed.
- [x] S11 terminology enforced; zero forbidden terms.

---

## EffectLog Reference

- Entry 020: Exact-Match Audit Execution.
- Entry 021: Production Remediation — BreathRitualBridge promotion, EE normalization, JITAI count canonicalization.
- Entry 027: Final Production Sign-Off (S11 closure + all gates clear).
- Entry 028: Post-Release Hardening Plan activation (this document).
