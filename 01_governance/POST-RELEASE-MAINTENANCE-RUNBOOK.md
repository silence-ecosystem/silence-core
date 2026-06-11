[PATH]: 01_governance/POST-RELEASE-MAINTENANCE-RUNBOOK.md

---
title: POST-RELEASE-MAINTENANCE-RUNBOOK
status: POST_RELEASE
classification: OPERATIONAL
sentinel: S11_ENFORCED
pcs: 0.997
author: silence-architect
validator: kimi-code CLI
date: 2026-06-10
---

# POST-RELEASE MAINTENANCE RUNBOOK

## Purpose

This runbook defines the operational pattern for executing post-release hardening tasks defined in `POST-RELEASE-HARDENING-PLAN.md`. It is a living operational document. All changes must be logged in `EFFECTLOG.md`.

---

## Weekly Execution Pattern

### Monday — Review and Queue
- **Time:** 09:00–10:00
- **Actor:** silence-architect + relevant owner
- **Activities:**
  1. Review `EFFECTLOG.md` entries from prior week.
  2. Verify no boundary violations or S11 regressions were introduced.
  3. Queue items from `POST-RELEASE-HARDENING-PLAN.md` for the current week.
  4. Assign item IDs and update owner status.

### Wednesday — Change Window
- **Time:** 09:00–11:00
- **Actor:** ops-lead or engine-lead (depending on item category)
- **Activities:**
  1. Execute exactly one hardening change batch per change window.
  2. Apply change to staging first.
  3. Run full verification suite (see Verification Steps).
  4. If staging PASS, promote to production CDN / infrastructure.
  5. File `EFFECTLOG.md` entry within the same change window.

### Friday — Verification and Sign-Off
- **Time:** 14:00–15:00
- **Actor:** silence-architect
- **Activities:**
  1. Verify production metrics against Trust Scorecard thresholds.
  2. Confirm no alerts fired since Wednesday change window.
  3. Update `POST-RELEASE-HARDENING-PLAN.md` item status (DONE / IN_PROGRESS / BLOCKED).
  4. If any metric is below PCS_BASE (0.997), freeze further changes and initiate rollback review.

### Saturday–Sunday — Quiet Period
- No infrastructure changes. No deployments. Telemetry aggregation continues.

---

## Verification Steps

### Pre-Change (Staging)

Execute in order. Any failure blocks promotion.

```bash
# 1. Boundary integrity
pnpm boundary-check
# Expected: 0 violations

# 2. Linguistic sterility
pnpm s11-check
# Expected: 0 violations

# 3. Type safety
pnpm typecheck
# Expected: 0 errors

# 4. Monorepo build
pnpm build
# Expected: all tasks successful

# 5. Test suite
pnpm test
# Expected: all suites pass

# 6. Engine equivalence (if engine changed)
cd 04_packages/@silence/engine && cargo test --release
# Expected: 13/13 PASS
cargo test --test equivalence --release
# Expected: 10/10 PASS

# 7. Garden static export
pnpm --filter=@silence/garden-app build
# Expected: 7 routes, 0 errors
```

### Post-Change (Production)

Execute within 30 minutes of production promotion.

```bash
# 1. Header scan (E3 items)
curl -sI https://<production-host>/ | grep -E "Strict-Transport-Security|Content-Security-Policy|X-Frame-Options"
# Expected: all headers present with strict values

# 2. WASM load verification
# Open browser console; verify `silence-engine.wasm` loads without error.
# Verify `computeScheduleJson` returns deterministic output for known seed.

# 3. Telemetry flow verification
# Trigger app_open event; verify batch adapter collects and flushes.

# 4. Quota enforcement spot-check
# Verify 402 response structure matches spec when quota exceeded.
```

### Automated Canary Validation

After any production infrastructure change:
- Observe canary traffic for minimum `phi * 10` minutes (~16 min).
- Monitor: HTTP 5xx rate, WASM load success rate, consent coverage rate.
- Abort threshold: any metric drops below PCS_BASE (0.997) for more than `GOLDENSECOND` ms (~1.618 s sustained dip).

---

## Rollback / Disablement

### Scope
This section applies **only** to hardening changes introduced post-release. MVP runtime is immutable without a new release decision.

### Rollback Triggers
- Any verification step fails in production.
- Trust Scorecard metric drops below target for > `GOLDENSECOND` ms.
- HSM key rotation produces signature verification failure.
- CDN header change breaks static asset loading.

### Rollback Procedures

#### CDN Header Rollback
1. Revert CDN config to previous header set.
2. Meta tags in `layout.tsx` remain as fallback.
3. Verify with `curl -sI`.
4. File `EFFECTLOG.md` entry: `EVENT_TYPE: ROLLBACK`.

#### HSM Key Rollback
1. Revert CI pipeline to file-based key mount (`ENGINE_SIGNING_KEY_PEM`).
2. Update `ENGINE-KEY-MANAGEMENT-POLICY.md` with rollback timestamp.
3. Verify signature on last known good WASM artifact.
4. File `EFFECTLOG.md` entry: `EVENT_TYPE: ROLLBACK`.

#### CPU Fallback Rollback
1. Disable fallback path via feature flag (`SILENCE_CPU_FALLBACK_ENABLED=false`).
2. App falls back to WASM-only behavior (graceful degradation already present).
3. Verify no new console errors.

#### SDK / Guards Rollback
1. Revert `@silence/sdk` or `@silence/guards` to previous version.
2. No runtime impact expected (zero-logic packages).

---

## Coordination with COMP-01 / Annex IV

### Principle
Post-release hardening must not invalidate COMP-01 Annex IV sections already completed (1–4, 6–7). Changes that touch intervention-timing boundaries, consent flows, or telemetry persistence require compliance-lead review.

### Coordination Matrix

| Post-Release Item | COMP-01 Section | Coordination Required |
|---|---|---|
| E3 CDN headers | §6.1 (Transparency) | Notify compliance-lead; no COMP-01 change needed |
| E4 HSM keys | §2.7 (Auditability) | File `EFFECTLOG.md` entry; update key inventory |
| G8b CPU fallback | §5 (System Architecture) | Review if fallback changes data flow diagrams |
| EE1 SDK facade | §6.2 (Open-Core / EE Boundary) | Verify no new boundary crossings |
| M1 Telemetry schema | §7.2 (Post-Market Monitoring) | Schema must align with observer metric definitions |
| SP1–SP4 Specs | §5, §8, §9 | Reference only; do not modify COMP-01 directly |

### Forbidden Actions
- Do not modify `COMP-01-ANNEX-IV-MASTER-TIMELINE.md` without compliance-lead approval.
- Do not mark any COMP-01 section as "complete" without formal review.
- Do not introduce new EE runtime logic without BG4 gate clearance.

---

## Change Windows and Validation Window

### phi-Based Time Constants

| Constant | Formula | Value | Usage |
|---|---|---|---|
| GOLDENSECOND | phi * 1000 ms | 1618 ms | Minimum observation sample for any metric |
| VALIDATION_WINDOW | round(GOLDENSECOND / phi^2) | ~382 ms | Telemetry flush observation interval |
| CHANGE_BATCH_INTERVAL | phi * 10 min | ~16.18 min | Minimum spacing between distinct change batches |
| STABILIZATION_WINDOW | phi^2 * 10 min | ~26.18 min | Minimum duration before declaring a change stable |
| WEEKLY_CYCLE | 7 days | 7 days | Review cadence (fixed; not phi-derived for operational sanity) |

### Wednesday Change Window Protocol

1. **T-0:** Change deployed to staging.
2. **T+CHANGE_BATCH_INTERVAL:** Run full verification suite.
3. **T+STABILIZATION_WINDOW:** Observe staging metrics.
4. If staging PASS, promote to production.
5. **Production T+STABILIZATION_WINDOW:** Run post-change verification.
6. If production PASS, change is accepted.
7. If any step FAIL, initiate rollback within `GOLDENSECOND` ms of detection.

### Metric Observation Protocol

For every production change:
- Sample HTTP status codes every `VALIDATION_WINDOW` for `STABILIZATION_WINDOW`.
- Compute rolling mean over phi samples.
- Accept if rolling mean > PCS_BASE (0.997).
- Reject if rolling mean < PCS_BASE for more than `GOLDENSECOND`.

---

## Math-Core Mapping Table

| Parameter | Derivation | Value | Runbook Relevance |
|---|---|---|---|
| phi | constant | 1.618033988749895 | Time-constant scaling factor |
| GOLDENSECOND | phi * 1000 | 1618 ms | Minimum metric observation sample |
| VALIDATION_WINDOW | GOLDENSECOND / phi^2 | ~382 ms | Telemetry observation interval |
| CHANGE_BATCH_INTERVAL | phi * 10 min | ~16.18 min | Minimum change spacing |
| STABILIZATION_WINDOW | phi^2 * 10 min | ~26.18 min | Stability declaration threshold |
| PCS_BASE | 1 - phi^-12 | 0.997 | Metric acceptance threshold |
| F(5) | Fibonacci(5) | 5 | Null Model period; not touched in maintenance |

---

## 12-Point PASS/FAIL Checklist

- [x] [PATH] present.
- [x] Weekly Execution Pattern defines Monday / Wednesday / Friday / Weekend cadence.
- [x] Verification Steps cover boundary, S11, typecheck, build, test, engine equivalence, and production header scan.
- [x] Rollback section applies only to post-release hardening changes, not MVP runtime.
- [x] Rollback triggers are quantified (metric drop below PCS_BASE for > GOLDENSECOND).
- [x] Coordination with COMP-01 specifies which items require compliance-lead review.
- [x] Forbidden Actions list prevents unauthorized COMP-01 or EE runtime modifications.
- [x] Change Windows are phi-derived with explicit formulas.
- [x] Validation Window is defined with GOLDENSECOND and phi scaling.
- [x] Metric Observation Protocol uses PCS_BASE as acceptance threshold.
- [x] Math-Core mapping contains all runbook-relevant derivations.
- [x] S11 terminology enforced; zero forbidden terms.

---

## EffectLog Reference

- Entry 020: Exact-Match Audit Execution.
- Entry 027: Final Production Sign-Off.
- Entry 028: Post-Release Hardening Plan activation.
- Entry 029: Post-Release Maintenance Runbook activation (this document).
