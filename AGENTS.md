# Silence Ecosystem — Agent Guide

> **CLAUDE.md** is an alias/symlink to this file.
>
> This is the single source of truth for all coding agents working in this repository.

## Workspace Structure

This is an **8-root numbered monorepo** designed for maximum agent efficiency and determinism.

```
silence-core/

├── 01_governance/          # ADRs, DIRs, policies, compliance artifacts
├── 02_protocols/           # φ-contracts, behavioral schemas, EffectLog
├── 03_ee/                  # Execution environments, determinism harness
├── 04_packages/            # Core packages (@silence/core is THE deterministic engine)
├── 05_apps/                # Vertical feature slices (PatternLens, Garden, etc.)
├── 06_infrastructure/      # Deployment, Vercel, Supabase, CI
├── 07_research/            # Experiments, phenotyping, data pipelines
├── 08_meta/                # Tooling, scripts, initialization
├── .agents/skills/         # Progressive disclosure skills for agents
├── design/                 # silence-soft-noir design system
└── docs/                   # Public and internal documentation
```

**Rule:** Never modify more than one top-level numbered domain in a single PR without an ADR in `01_governance/decisions/`.

## Build & Test Commands

```bash
pnpm install
turbo run build --filter=...affected
pnpm --filter=@silence/core test:determinism     # MANDATORY after core changes
pnpm test
```

## Critical Constraints (Non-Negotiable)

**Determinism (Highest Priority)**

`@silence/core` must remain bit-exact.

**FORBIDDEN:** `Math.random()`, unseeded `Date.now()`, any randomness in core.

After changes in `04_packages/core/`: always run `pnpm --filter=@silence/core test:determinism`.

**φ-Rigor**

Prefer Fibonacci numbers and φ (1.618...) in timing, spacing and structure where possible.

**Boundary Enforcement (RULE-DOM-001)**

No direct imports from `03_ee/` into `04_packages/` without ADR.

## Code Style

- TypeScript strict + no `any`
- Zod first
- Vertical slices in `05_apps/`
- No barrel files
- Pattern Language tokens = single source of truth

## Skills

- `$vercel-deploy`
- `$governance`
- `$design-system`
- `$eu-ai-act`
- `$determinism`

## Deployment Protocol

Before any `vercel --prod`:

1. `deploy-guard` workflow must be green
2. All gates from `06_infrastructure/VERCEL_DEPLOYMENT_GUIDE.md` passed
3. EffectLog updated
4. Only then deploy

## Session Start Protocol (LOCAL AGENTS)

Every new session must:

1. Verify location + remote
2. Read `AGENTS.md | head -60` + key skills
3. Run determinism test
4. Output:
   `"SESSION START PROTOCOL COMPLETE. Poprawnie zakotwiczony w silence-core. Gotowy."`

If location is wrong → run **AGENT RE-ANCHOR PROTOCOL** immediately.

## Security & Compliance

- EffectLog (`02_protocols/effectlog/DEPLOYS.log`) is intentionally tracked
- S11 sterility enforced
- Update compliance artifacts when risk classification changes
