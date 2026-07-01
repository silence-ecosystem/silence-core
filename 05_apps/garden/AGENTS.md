# Garden App — Agent Guide

> **Scope:** `05_apps/garden` (`@silence/garden-app`)  
> **Tag:** `S11-GARDEN-20260623-001`  
> **Merge SHA-256:** *(to be filled after merge)*

This guide is the single source of truth for agents working on the Silence Garden application.

---

## App Overview

Garden is a phi-aware, breath-ritual UI slice built on Next.js 14.2.3 + React 18. It consumes packages from `04_packages/@silence/*` (e.g., `@silence/phi`) and must never import directly from `03_ee/`.

- **Package name:** `@silence/garden-app`
- **Version:** `0.1.0-mvp`
- **Framework:** Next.js 14.2.3
- **React:** 18.x
- **ESLint:** flat config (`eslint.config.mjs`)

---

## Verification Commands

Run these commands from the repository root to confirm the app is in the documented state.

### 1. Domain boundary check

```bash
pnpm boundary-check
```

**Expected:** `✔ no dependency violations found`

### 2. Lint, typecheck, and test

```bash
# Option A: by package name
pnpm turbo run lint typecheck test --filter=@silence/garden-app

# Option B: by directory path (note the leading ./)
pnpm turbo run lint typecheck test --filter=./05_apps/garden
```

**Expected:** `Tasks: 3 successful, 3 total`

- `lint` exits with warnings only (2 warnings documented below).
- `typecheck` exits cleanly.
- `test` exits with code 0 (no test files yet, `--passWithNoTests`).

> **Note:** `--filter=05_apps/garden` (without `./`) is not accepted by Turbo; it treats the value as a package name.

### 3. Production build

```bash
# Option A: by package name
pnpm turbo run build --filter=@silence/garden-app

# Option B: by directory path
pnpm turbo run build --filter=./05_apps/garden
```

**Expected:** `Tasks: 4 successful, 4 total` and static pages generated.

---

## Known Lint Warnings (Non-blocking)

The following warnings are accepted in this snapshot and do not fail the gate:

```text
/home/ewa/silence/05_apps/garden/hooks/useBreathRitual.ts
  44:11  warning  'start' is never reassigned. Use 'const' instead  prefer-const

/home/ewa/silence/05_apps/garden/hooks/useJitaiSignals.ts
  78:54  warning  React Hook useMemo has an unnecessary dependency: 'lastEvaluated'  react-hooks/exhaustive-deps
```

These are intentionally kept as warnings to avoid modifying application logic during tooling stabilization. Future refactors may address them.

---

## Critical Constraints

- **No imports from `03_ee/`** — this is enforced by `boundary-check` (RULE-DOM-001).
- **Determinism** — Garden uses `@silence/core` and `@silence/phi`; never introduce `Math.random()` or unseeded `Date.now()` in logic that depends on deterministic outputs.
- **ESLint** — Garden uses flat config (`eslint.config.mjs`). Do not add `.eslintrc.json`; ESLint 9 does not read it.

---

## CI Checklist

For any PR touching this directory, CI must verify:

- [ ] `pnpm boundary-check` passes.
- [ ] `pnpm turbo run lint typecheck test --filter=@silence/garden-app` (or `--filter=./05_apps/garden`) passes.
- [ ] `pnpm turbo run build --filter=@silence/garden-app` (or `--filter=./05_apps/garden`) passes.
- [ ] No new S11 violations introduced in `05_apps/garden`.

---

## Post-Merge Record

After this file is merged, update the line below with the SHA-256 of the merge commit:

```text
MERGE_SHA256: <hash>
```

---

## Files Managed by This Guide

- `05_apps/garden/package.json`
- `05_apps/garden/eslint.config.mjs`
- `05_apps/garden/vitest.config.ts`
- `05_apps/garden/vercel.json`
- `05_apps/garden/tsconfig.json`
- `05_apps/garden/app/`
- `05_apps/garden/components/`
- `05_apps/garden/hooks/`
- `05_apps/garden/lib/`
