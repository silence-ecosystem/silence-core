// File: /home/ewa/silence/.github/PULL_REQUEST_TEMPLATE.md

## Scope

<!-- opisz zmianę deterministycznie -->

## Gates

- [ ] `pnpm install --frozen-lockfile`
- [ ] `pnpm boundary-check`
- [ ] `pnpm s11-check`
- [ ] `pnpm typecheck`
- [ ] `pnpm test:determinism` lub `pnpm testdeterminism`
- [ ] `turbo run build --filter=...[origin/main...HEAD]`

## RULE-DOM-001

- [ ] brak importów `03_ee` -> `04_packages`
- [ ] brak importów `03_ee` -> `05_apps`
- [ ] brak importów z archiwum do kodu produkcyjnego

## S11

- [ ] brak terminologii zakazanej w kodzie, docs, workflowach i logach

## Release Surface

- [ ] README zaktualizowany, jeśli zmiana wpływa na publiczny kontrakt
- [ ] Pages / website zaktualizowane, jeśli zmiana wpływa na onboarding
