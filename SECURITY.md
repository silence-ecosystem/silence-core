# Security Policy

## Supported versions

Only the latest state of the `main` branch is actively supported. Releases use immutable SemVer tags.

## Reporting a vulnerability

Do not open public issues for security problems. Instead:

Use private disclosure through GitHub Security Advisories when possible, or contact:

**Email:** `security@patternslab.io` (preferred)
**Alternative:** Private GitHub Security Advisory

Include in your report:
- Affected component (`03_ee/`, `04_packages/`, `05_apps/`, etc.)
- Reproduction steps
- Impact assessment
- Proof-of-concept (if applicable)
- Your contact information (name, email, PGP key if available)

Allow reasonable time for remediation before public disclosure.

## Crisis and self-harm detection

SILENCE includes deterministic safety guardrails. If you encounter content that bypasses crisis detection, report it immediately.

## Scope

In scope: `04_packages/@silence/*`, `05_apps/*`, `03_ee/@silence/*`, CI/CD workflows, Supabase schemas.
Out of scope: third-party dependencies, archived code under `07_archive/`.
