# GitHub Organization Ruleset Matrix

**[PATH]:** `01_governance/GITHUB_ORG_RULESET_MATRIX.md`  
**Status:** ACTIVE  
**Owner:** PHI_CORE_GUARDIAN  
**Rygor:** S11 Sentinel Enforced | HARD_SEVEN_v2026  
**PCS Threshold:** ≥ 0.990

---

## 1. Purpose

This document defines the canonical organization-level ruleset matrix for the `silence-ecosystem` GitHub organization. Each ruleset is a mandatory governance gate applied to a class of repositories. Repository-specific ruleset JSON files in `.github/rulesets/` are the deployable artifacts derived from this matrix.

## 2. Ruleset Classes

| Ruleset | Scope | Target Repos | Failure Mode |
|---------|-------|--------------|--------------|
| `NCK-SSOT-STABILIZER` | Governance / protocols / canonical docs | `silence-governance`, `silence-protocols`, `01_governance/` domains | WORLDHALT |
| `OPEN-CORE-GUARD` | Public MIT open-core | `silence-core` | WORLDHALT |
| `ENTERPRISE-SENSITIVE` | Proprietary EE, high-risk AI, billing | `silence-enterprise`, `silence-data` | WORLDHALT |

## 3. NCK-SSOT-STABILIZER

Protects sources of truth. Every change to governance, ADR, S11, or EffectLog must be traceable and approved.

- Required linear history.
- Require signed commits.
- Require pull request with at least 2 approvals.
- Require CODEOWNERS review for `01_governance/**`, `02_protocols/**`, `docs/**`.
- Required status checks:
  - `S11 Linguistic Sterility Check`
  - `Immutable Action Policy Check`
  - `EffectLog hash-chain validation` (manual gate until automated)
- Block force pushes and deletions on default branch.
- Require an ADR file changed when `01_governance/ADR/**` or `02_protocols/**` is touched.

## 4. OPEN-CORE-GUARD

Protects the public open-core boundary. Ensures no EE logic, no S11 violations, and no nondeterminism reach `main`.

- Required linear history.
- Require signed commits.
- Require pull request with at least 1 approval.
- Block force pushes and deletions on default branch.
- Required status checks (must all pass):
  - `RULE-DOM-001 Boundary Check`
  - `S11 Linguistic Sterility Check`
  - `Determinism Test Suite`
  - `Vitest Test Suite`
  - `TypeScript Typecheck`
  - `Immutable Action Policy Check`
- Restrict push to `main` to maintainers and release bots.
- Require `.vercelignore` to exclude `03_ee/`, `07_archive/`, `01_governance/`, `02_protocols/`, `docs/`, `design/`.

## 5. ENTERPRISE-SENSITIVE

Protects proprietary enterprise repositories.

- Require pull request with at least 2 approvals, including 1 from `@silence-ecosystem/ee-owners`.
- Block self-merge.
- Block public forks.
- Block force pushes.
- Require signed commits.
- Required status checks:
  - `IP_BOUNDARY_ENFORCEMENT`
  - `SLSA Provenance Generation`
  - `Security scan` (Trivy/Semgrep)
- Require egress allowlisting via `step-security/harden-runner` in all workflows.
- Restrict `contents: write` permissions to release workflows only.

## 6. Deployment

Org-level rulesets are applied via the GitHub API using `scripts/apply-org-rulesets.sh`. Repo-level rulesets are committed to `.github/rulesets/` and imported by GitHub when present.

## 7. Audit Trail

Any change to this matrix or to a ruleset JSON file must be recorded in `01_governance/EFFECTLOG.md` with:

- `S11.COMMIT.ID`
- SHA-256 of the changed ruleset file
- Reference to the PR that deployed it
