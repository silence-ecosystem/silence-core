# OIDC Migration Plan

PATH: /home/ewa/silence/02_protocols/OIDC_MIGRATION.md
SSOT: true
DOMAIN: 02_protocols
STATUS: draft
PCSSTATUS: 0.980

## Purpose

This document records the migration plan from classic long-lived secrets (`VERCEL_TOKEN`, cloud provider keys) to federated OpenID Connect (OIDC) identity for GitHub Actions, as required by `PCS_GATE_2.0.md` OIDC Gate.

## Current state

- `deploy.yml` uses `secrets.VERCEL_TOKEN` for Vercel CLI authentication.
- `deploy.yml` uses `secrets.TURBO_TOKEN` and `secrets.TURBO_TEAM` for Turborepo Remote Cache.
- OIDC is used only in `.github/workflows/slsa-attestation.yml` for SLSA provenance.

## Target state

- Vercel deploys use OIDC trust relationship between GitHub Actions and Vercel (when supported) or short-lived Vercel tokens issued via OIDC.
- Turborepo Remote Cache uses OIDC or short-lived tokens where the provider supports it.
- All other cloud/chmura deployments use OIDC federation with no long-lived secrets in GitHub Secrets.

## Migration steps

1. **Vercel OIDC trust** — configure GitHub as an identity provider in Vercel dashboard for project `silence-core`.
2. **Repository variables** — replace `secrets.VERCEL_TOKEN` usage with `vars.VERCEL_ORG_ID` / `vars.VERCEL_PROJECT_ID` and OIDC token exchange.
3. **Workflow update** — modify `deploy.yml` `deploy-vercel` and `deploy-preview` jobs to use `id-token: write` and exchange the OIDC token for a short-lived Vercel token.
4. **Turbo Remote Cache OIDC** — evaluate Vercel/Turborepo support for OIDC-based cache authentication; migrate if available.
5. **Validation** — verify preview and production deploys succeed without `secrets.VERCEL_TOKEN`.
6. **Deprecation** — remove `VERCEL_TOKEN` from GitHub Secrets after 30 days of stable OIDC operation.

## PCS impact

- Until OIDC is operational for at least one critical workflow: PCS penalty `-0.020` per `PCS_GATE_2.0.md` OIDC Gate.
- Target completion date: to be set by governance after dashboard configuration.

## Owner

- silence-core-team / infrastructure lead
