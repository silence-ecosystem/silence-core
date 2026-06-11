[PATH]: 04_packages/@silence/engine/README.md

---
title: PKG-engine
status: MVP
classification: SSoT
sentinel: S11_ENFORCED
determinism_profile: strict
phi_anchor: true
created: 2026-06-10
updated: 2026-06-10
---

# @silence/engine — Deterministic Behavioral Scheduler

## Operational Mandate

Deterministic scheduler for contextual prompts based on phi-derived timing windows. CPU-only, single-threaded, batch inference. No ML model. No GPU. No system clock reads inside engine.

## Determinism Contract

1. **Identical inputs → identical outputs** (bitwise)
2. **No OS entropy** — seed derived solely from `SHA-256(serialized_input)`
3. **No floating-point** in deterministic path — fixed-point `PHI_INV_NUM/PHI_INV_DEN`
4. **No nondeterministic collections** — sorted `Vec`, no `HashMap` iteration
5. **No thread scheduling** — single-threaded, synchronous batch

## Architecture

```
EngineInput
    ↓
serialize (little-endian, fixed-width)
    ↓
SHA-256 → input_hash
    ↓
first 8 bytes → seed (u64)
    ↓
compute_interval_ms (fixed-point phi-inverse)
    ↓
generate SignalSlots (sorted by scheduled_ms)
    ↓
SHA-256(seed + serialized_slots) → output_hash
    ↓
EngineOutput
```

## Math-Core Constants

| Constant | Value | Usage |
|---|---|---|
| `GOLDENSECOND` | 1618 ms | Base temporal unit |
| `PHI_INV_NUM` | 618033988749894 | Fixed-point numerator (1/φ) |
| `PHI_INV_DEN` | 1000000000000000 | Fixed-point denominator |
| `MAX_SLOTS_PER_CYCLE` | 3 | Rate limiter |
| `VALIDATION_WINDOW_MS` | 382 ms | Max latency (p99) |

## Build

```bash
# Native
cargo build --release

# WASM
cargo build --target wasm32-unknown-unknown --release --features wasm
wasm-opt -Oz target/wasm32-unknown-unknown/release/silence_engine.wasm -o silence_engine.optim.wasm

# Docker (reproducible)
docker build -t silence-engine:local .
```

## Panic Strategy

Release profile uses `panic = "unwind"` (not `abort`) to allow integration-test runner to catch panics during equivalence validation. This is an intentional MVP concession: binary size grows slightly, but determinism verification remains exhaustive. Future hardening may switch to `abort` with a custom `release-test` profile.

## Test

```bash
# Unit + integration (release)
cargo test --release

# Equivalence suite (exact command used in CI gate G8)
cargo test --test equivalence --release

# CLI
echo '{"observer":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"timestamp_ms":1700000000000,"attention_depth":3,"last_signal_ms":null,"entropy":[0,0,0,0,0,0,0,0]}' | cargo run --bin engine-cli -- compute
```

## CI Pipeline

`.github/workflows/engine-build.yml`
1. Clippy (deny warnings)
2. Native tests
3. Equivalence tests
4. WASM build + `wasm-opt`
5. Reproducibility verification (3x Docker build, golden hash comparison)
6. Ed25519 signing + verification

## Boundary Compliance

- Package resides in `04_packages/@silence/engine/` (Open-Core)
- Zero imports from `03_ee/`
- Verified by `pnpm boundary-check`

## S11 Compliance

- Zero forbidden terminology in source
- All variables use structural vocabulary (pattern, signal, slot, trajectory, observer)
- Scanned by `@silence/s11-lint` v2.1.0
