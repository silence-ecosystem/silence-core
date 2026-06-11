[PATH]: 04_packages/@silence/core/README.md

---
title: PKG-core
status: STABLE
classification: SSoT
sentinel: S11_ENFORCED
determinism_profile: strict
phi_anchor: true
created: 2026-06-06
updated: 2026-06-10
---

# @silence/core — Open-Core Primitives

## Modules

### effect-log.ts
- `EffectLogEntry` — immutable governance entry
- `EffectLog` — append-only registry with SHA-256 chain validation
- Chain continuity: `prevHash` of entry N must equal `entryHash` of entry N-1

### hash-chain.ts
- `sha256(input)` — universal SHA-256 (Web Crypto / Node)
- `computeEntryHash(...)` — deterministic entry hash from structured fields
- `verifyChainContinuity(prev, current)` — boolean validation

## Determinism

- All hash computations deterministic across browser + Node
- JSON serialization uses stable key order (no `HashMap` nondeterminism)
- Zero EE dependencies

## Boundary

- Open-Core (`04_packages/@silence/core/`)
- Consumed by `@silence/telemetry`, `@silence/jitai`, apps
