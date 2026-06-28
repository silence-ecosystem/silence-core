[PATH]: 04_packages/@silence/validator/README.md

# @silence/validator

`@silence/validator` is the deterministic validation layer for public open-core contracts in `silence-core`.[file:271] The package exists to verify structural correctness of payloads, event shapes, identifiers, and contract-facing data before they move through higher layers of the system.[file:271]

The package belongs to the open-core package layer defined in `SILENCE_STRUCT_v2_0` and must remain free of enterprise logic, predictive scoring, billing logic, and proprietary inference paths.[file:271] It provides pure validation utilities only, with no dependency on `03_ee/*` and no hidden runtime side effects.[file:271]

## Purpose

The role of `@silence/validator` is to protect contract integrity at the open-core boundary.[file:271] It is intended for validating API payloads, event taxonomy inputs, hash-chain related structures, serialization inputs, and other public contract data that must remain deterministic and audit-safe.[file:271]

This package is not a runtime decision engine, not a deploy orchestrator, and not an enterprise scoring surface.[file:271] It does not implement proprietary evaluation, high-risk inference, or private tenancy logic.[file:271]

## Design constraints

All exported utilities in this package must be deterministic: the same input must always produce the same validation result.[file:271] No validator may depend on random values, wall-clock time, network calls, filesystem access, or mutable global state.[file:271]

All validators must remain structurally scoped and S11-clean in naming, types, comments, and returned messages.[file:283][file:271] Clinical, therapeutic, and wellness terminology is forbidden in package code and documentation unless explicitly handled as approved meta-data under S11 enforcement rules.[file:283]

The package must preserve the open-core to enterprise boundary defined by `RULE-DOM-001`.[file:271] Imports from `03_ee/*` are prohibited, and contract-level capabilities required by higher layers must remain exposed through public open-core interfaces only.[file:271]

## Public API

The package should expose only stable validation functions and related contract types through `src/index.ts`.[file:271] Internal helpers that are not part of the public contract should remain private to implementation files and should not be exported from the barrel.[file:271]

Recommended public API categories include:

- payload validators
- event and identifier validators
- hash-chain structure validators
- serialization and schema guards
- validation result types and error descriptors

The package should prefer explicit return contracts such as `ValidationResult` over ambiguous booleans where failure detail is required.[file:271] Validation output should remain machine-readable and suitable for tests, CI, and audit-safe runtime handling.[file:271]

## Usage

Example shape:

```ts
import { validateEffectLogEntry } from '@silence/validator';

const result = validateEffectLogEntry(entry);

if (!result.ok) {
  console.error(result.errors);
}
```

A validator should check structural validity only.[file:271] It should not mutate input, write state, or infer behavior beyond the declared contract boundary.[file:271]

## Quality gates

Changes in this package must pass the canonical gate set used by `silence-core`.[file:271] At minimum, every PR touching `@silence/validator` must pass:

- `pnpm boundary-check`
- `pnpm s11-check`
- `pnpm test:determinism`
- `pnpm test:vitest`
- `pnpm typecheck`

These gates enforce architectural purity, S11 language sterility, deterministic behavior, executable correctness, and TypeScript integrity.[file:271][file:283]

## Repository position

`@silence/validator` lives in `04_packages/@silence/*`, which is the open-core package domain in the canonical repository structure.[file:271] That domain is reserved for pure functions, contract validators, deterministic utilities, serialization helpers, and other public artifacts that do not leak enterprise logic.[file:271]

Every change in this package must remain compatible with the public `silence-core` role as a deployable open-core runtime prepared for protected CI and production deployment from `main`.[file:221][file:271]

## Non-goals

This package must not contain:

- proprietary scoring logic
- enterprise billing behavior
- high-risk decision logic
- research clean-room assets
- tenant-specific runtime coupling
- direct access to private infrastructure

If a feature requires any of the above, it belongs outside `@silence/validator` and outside the public open-core boundary.[file:271]
