[PATH]: 04_packages/@silence/validator/README.md

# @silence/validator

`@silence/validator` is the deterministic validation layer for public open-core contracts in `silence-core`.[1] The package exists to verify structural correctness of payloads, event shapes, identifiers, and contract-facing data before they move through higher layers of the system.[1]

The package belongs to the open-core package layer defined in `SILENCE_STRUCT_v2_0` and must remain free of enterprise logic, predictive scoring, billing logic, and proprietary inference paths.[1] It provides pure validation utilities only, with no dependency on `03_ee/*` and no hidden runtime side effects.[1]

## Purpose

The role of `@silence/validator` is to protect contract integrity at the open-core boundary.[1] It is intended for validating API payloads, event taxonomy inputs, hash-chain related structures, serialization inputs, and other public contract data that must remain deterministic and audit-safe.[1]

This package is not a runtime decision engine, not a deploy orchestrator, and not an enterprise scoring surface.[1] It does not implement proprietary evaluation, high-risk inference, or private tenancy logic.[1]

**Safety note:** `@silence/validator` is not a diagnostic tool and does not implement any high-risk AI logic. It performs only structural, deterministic checks on data shapes and identifiers.

## Design constraints

All exported utilities in this package must be deterministic: the same input must always produce the same validation result.[1] No validator may depend on random values, wall-clock time, network calls, filesystem access, or mutable global state.[1]

All validators must remain structurally scoped and S11-clean in naming, types, comments, and returned messages.[2][1] Clinical, therapeutic, and wellness terminology is forbidden in package code and documentation unless explicitly handled as approved meta-data under S11 enforcement rules.[2]

The package must preserve the open-core to enterprise boundary defined by `RULE-DOM-001`.[1] Imports from `03_ee/*` are prohibited, and contract-level capabilities required by higher layers must remain exposed through public open-core interfaces only.[1]

## Public API

The package exposes stable validation functions and related contract types through `src/index.ts`:

- `validateEffectLogEntry(entry)` — validates a hash-chain effect-log entry.
- `validateEventPayload(payload)` — validates an event payload against the allowed taxonomy.
- `isValidEventType(type)` — type guard for allowed event types.
- `ValidationResult` / `ValidationError` — shared result contract.

Internal helpers that are not part of the public contract remain private to implementation files and are not exported from the barrel.[1]

The package prefers explicit return contracts such as `ValidationResult` over ambiguous booleans where failure detail is required.[1] Validation output remains machine-readable and suitable for tests, CI, and audit-safe runtime handling.[1]

## Usage

```ts
import { validateEffectLogEntry, validateEventPayload, isValidEventType } from '@silence/validator';

const entry = {
  seq: 1,
  timestamp: '2026-06-13T10:00:00Z',
  eventType: 'SILENCE.EVENT.LOGGED',
  payload: { note: 'structural event' },
  prevHash: 'abc123',
  hash: 'def456',
};

const entryResult = validateEffectLogEntry(entry);
if (!entryResult.ok) {
  console.error(entryResult.errors);
}

const eventResult = validateEventPayload({ type: 'SILENCE.SESSION.STARTED' });
if (!eventResult.ok) {
  console.error(eventResult.errors);
}

if (isValidEventType('SILENCE.SESSION.ENDED')) {
  // narrowed to AllowedEventType
}
```

A validator checks structural validity only.[1] It does not mutate input, write state, or infer behavior beyond the declared contract boundary.[1]

## Quality gates

Changes in this package must pass the canonical gate set used by `silence-core`.[1] At minimum, every PR touching `@silence/validator` must pass:

- `pnpm boundary-check`
- `pnpm s11-check`
- `pnpm test:determinism`
- `pnpm test:vitest`
- `pnpm typecheck`

These gates enforce architectural purity, S11 language sterility, deterministic behavior, executable correctness, and TypeScript integrity.[1][2]

## Repository position

`@silence/validator` lives in `04_packages/@silence/*`, which is the open-core package domain in the canonical repository structure.[1] That domain is reserved for pure functions, contract validators, deterministic utilities, serialization helpers, and other public artifacts that do not leak enterprise logic.[1]

Every change in this package must remain compatible with the public `silence-core` role as a deployable open-core runtime prepared for protected CI and production deployment from `main`.[3][1]

## Non-goals

This package must not contain:

- proprietary scoring logic
- enterprise billing behavior
- high-risk decision logic
- research clean-room assets
- tenant-specific runtime coupling
- direct access to private infrastructure
- clinical, diagnostic, or therapeutic terminology as part of its API

If a feature requires any of the above, it belongs outside `@silence/validator` and outside the public open-core boundary.[1]
