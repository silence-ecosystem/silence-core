# Security Policy

## Supported versions

Only the latest state of the `main` branch is actively supported. Releases use immutable SemVer tags.

## Reporting a vulnerability

Do not open public issues for security problems. Instead:

1. Email the maintainers listed in `.github/CODEOWNERS`.
2. Include reproduction steps, impact assessment and affected paths.
3. Allow reasonable time for remediation before public disclosure.

## Crisis and self-harm detection

SILENCE includes deterministic safety guardrails. If you encounter content that bypasses crisis detection, report it immediately.

## Scope

In scope: `04_packages/@silence/*`, `05_apps/*`, `03_ee/@silence/*`, CI/CD workflows, Supabase schemas.
Out of scope: third-party dependencies, archived code under `07_archive/`.
