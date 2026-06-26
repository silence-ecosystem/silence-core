# Contributing to SILENCE

Thank you for contributing. This repository is governed by `AGENTS.md` — read it first.

## Development workflow

1. **Plan first.** Every new folder, workflow or architectural decision requires explicit planning.
2. **Use feature branches:** `feat/*`, `fix/*`, `refactor/*`, `chore/*`, `docs/*`, `test/*`.
3. **Commit format:** `<type>: <description>` where type is `feat`, `fix`, `refactor`, `test`, `docs`, or `chore`.
4. **Run gates locally before pushing:**
   ```bash
   pnpm install --frozen-lockfile
   pnpm boundary-check
   pnpm s11-check
   pnpm typecheck
   pnpm build --filter=...[origin/main...HEAD]
   pnpm test --filter=...[origin/main...HEAD]
   ```

## S11 language lock

- Forbidden terms: clinical, therapeutic, wellness, diagnostic language.
- Preferred operational terms: `TENSION_SCORE`, `SIGNAL_NOISE`, `STATE_VIOLATION`, `SIGNAL_PURITY`, `RITUAL_STATE`, `DETERMINISTIC_FLOW`.
- `pnpm s11-check` must pass.

## Domain boundaries (RULE-DOM-001)

- `04_packages/` and `05_apps/` do not import `03_ee/`.
- Applications use `@silence/sdk` as the only public entrypoint.
- `@silence/contracts` is the canonical public contract channel.

## Determinism

- No `Math.random()` in decision logic.
- No wall-clock reads unless injected or UI-only.
- All φ-derived constants come from `@silence/phi` / MATH_CORE.

## Questions?

Open a discussion in `01_governance/` or refer to the ADR index.
