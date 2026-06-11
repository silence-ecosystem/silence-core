# φ-Garden

**SILENCE.OBJECTS flagship application.**

A minimal, deterministic ritual interface built on Next.js 16 with static export. The garden grows not from streaks, but from the consistency of attention you bring to each entry.

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Root redirect (onboarding vs garden) |
| `/onboarding` | 6-step consent + preference flow |
| `/breath` | Phi-harmonic breath ritual (3 cycles) |
| `/garden` | Personal garden dashboard |
| `/quiet` | Signal-reduction timer + self-report |

## Architecture

- **Framework**: Next.js 16.2.9, React 19.1.0, TypeScript 5.7+
- **Export**: Static (`output: 'export'`)
- **Engine**: Rust/WASM (`silence-engine.wasm`) loaded via `WebAssembly.instantiate`
- **Persistence**: IndexedDB (`silence-garden-db`) with localStorage fallback
- **Telemetry**: `@silence/telemetry` with consent-aware kill-switch
- **Signals**: `@silence/jitai` — 26 deterministic threshold rules

## Local Development

```bash
pnpm install
pnpm dev        # localhost:3000
pnpm build      # static export to ./dist
```

## Determinism

- No `Math.random()` in scheduling logic
- Breath timing: inhale 3000ms / hold 1854ms / exhale 4854ms (φ-derived)
- Engine equivalence verified: 10/10 tests PASS (native ≡ WASM)

## Accessibility

- `aria-live` regions for breath phase changes and garden signals
- `role="progressbar"` for breath dots and onboarding progress
- `prefers-reduced-motion` respected for particles and breath scale
- All interactive elements have accessible labels

## S11 Compliance

Zero diagnostic, therapeutic, or judgmental language in UI copy. All messaging uses structural, observational vocabulary.
