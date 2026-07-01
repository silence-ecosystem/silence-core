# tasks/lessons

## Template

- Date: YYYY-MM-DD
- Source: (workflow / incident / PR-XXX)
- Problem: (short description, e.g. "preview deploy failure because VERCEL_PROJECT_ID missing")
- Applied Rule: (e.g. "PCS_GATE_2.0: P0.1 – external config must be present before merge")
- Verification: (what ensures the problem does not return – checked workflow, added check, etc.)

## 2026-07-01 — Deploy safety and cost discipline

### Observation

Root deployment contracts and Turborepo execution rules must be documented together. Separating Vercel cost controls from CI gates increases drift risk and weakens determinism.

### Lesson

Cost optimization is valid only when three mechanisms stay aligned: `turbo-ignore`, affected-only `--filter=...[origin/main...HEAD]`, and `fetch-depth: 2`. Any one of them removed or loosened invalidates the economic contract.

### Action

Keep `vercel.json`, deploy workflows, and `VERCEL_OPT_PROTOCOL_v1.md` synchronized. Every deploy-facing change must be reflected in EFFECTLOG and checked against PCS, boundary, S11, typecheck, build, and test.
