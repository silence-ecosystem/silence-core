# `@silence/language`

Deterministic, read-only provider of the S11 Language Standard vocabulary for SILENCE.OBJECTS open-core packages.

This package re-exports the canonical terminology contract maintained in `@silence/types/s11`. It does not define its own vocabulary lists and does not perform linting — for enforcement, use `@silence/s11-lint`.

## Public API

```ts
import {
  FORBIDDEN_CLASSES,
  ALLOWED_ALTERNATIVES,
  ALLOWED_VOCABULARY,
  getAllForbiddenTerms,
  isForbiddenTerm,
} from '@silence/language';
```

## Determinism

All exports are pure data or pure functions. Calling `getAllForbiddenTerms()` or `isForbiddenTerm(term)` with the same input always produces the same output, with no side effects, no I/O, and no randomness.
