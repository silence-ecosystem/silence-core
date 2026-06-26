# SILENCE

Deterministic, φ-aligned, S11-compliant frontend ecosystem for structural self-observation.

## What is SILENCE?

SILENCE is a hybrid monorepo built around:

- **Determinism** — identical input always produces identical output.
- **φ-derived design** — all timing, spacing and rhythm derive from `PHI = 1.618...` and `GOLDENSECOND = 1618 ms`.
- **S11 language lock** — no pattern-signature, support-protocol or wellness terminology in operational code.
- **RULE-DOM-001** — strict domain boundaries; open-core frontend never imports `03_ee/` enterprise logic.

## Repository structure

```
00_identity/      # EffectLog + MATH_CORE (φ SSOT)
01_governance/    # ADR, AGENTS, ROLES, S11 policy
02_protocols/     # CI enforcement scripts
03_ee/            # Enterprise / high-risk modules (protected)
04_packages/      # Open-core shared packages (@silence/*)
05_apps/          # Frontend applications (patternlens, garden, silence-objects)
06_infrastructure/# Deployment guides
07_archive/       # Legacy artifacts
08_meta/          # System metadata
```

## Quick start

```bash
cd /home/ewa/silence
pnpm install --frozen-lockfile
pnpm boundary-check
pnpm s11-check
pnpm typecheck
pnpm build --filter=...[origin/main...HEAD]
pnpm test --filter=...[origin/main...HEAD]
```

## Agent contract

All automated work in this repository follows `/home/ewa/silence/AGENTS.md`. Read it before making any structural change.

## Public API

Applications consume only `@silence/sdk`. Direct imports from `03_ee/` are forbidden (`WORLDHALT`).

## License

The open-core part of the repository is MIT-licensed, while enterprise and high-risk modules under `03_ee/` remain proprietary and require separate licensing terms.

For details, see `LICENSE.md`.
