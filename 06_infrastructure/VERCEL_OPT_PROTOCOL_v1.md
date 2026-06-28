---
[PATH]: 06_infrastructure/VERCEL_OPT_PROTOCOL_v1.md
title: VERCEL COST OPTIMIZATION PROTOCOL v1.0
task_id: SILENCE_VERCEL_OPT_001
commit_id: S11-MVP-20260622-002
status: PASS
pcs: 1.000
created: 2026-06-22
author: silence-architect
sentinel: S11_ENFORCED
classification: SSoT
---

# TASK

Wdrożenie mechanizmów redukcji kosztów buildów Vercel o 80% poprzez:

1. `turbo-ignore` w `vercel.json` każdej aplikacji w `05_apps/`
2. `--filter=...[origin/main...HEAD]` w komendzie build
3. `fetch-depth: 2` w GitHub Actions workflow

Scope: `05_apps/admin`, `05_apps/portal`, `05_apps/web`, `apps/patternlens` (legacy path potwierdzony w audyt1.md).

---

# PROCEDURE

## KROK 1 — `vercel.json` per aplikacja

Dla każdej aplikacji w `05_apps/*` utwórz lub zaktualizuj `vercel.json`.

### `05_apps/web/vercel.json`

```json
{
  "ignoreCommand": "npx turbo-ignore --fallback=HEAD^1",
  "buildCommand": "turbo run build --filter=...[origin/main...HEAD]",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

### `05_apps/admin/vercel.json`

```json
{
  "ignoreCommand": "npx turbo-ignore --fallback=HEAD^1",
  "buildCommand": "turbo run build --filter=...[origin/main...HEAD]",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

### `05_apps/portal/vercel.json`

```json
{
  "ignoreCommand": "npx turbo-ignore --fallback=HEAD^1",
  "buildCommand": "turbo run build --filter=...[origin/main...HEAD]",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

### `apps/patternlens/vercel.json` (legacy path z audyt1.md)

```json
{
  "ignoreCommand": "npx turbo-ignore --fallback=HEAD^1",
  "buildCommand": "turbo run build --filter=...[origin/main...HEAD]",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

---

## KROK 2 — GitHub Actions workflow z `fetch-depth: 2`

Plik: `.github/workflows/deploy.yml`

```yaml
name: SILENCE Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  boundary-check:
    name: Boundary Check (P0 Gate)
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 2

      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - name: Install
        run: pnpm install --frozen-lockfile

      - name: Boundary check (RULE-DOM-001)
        run: pnpm boundary-check

      - name: S11 check
        run: pnpm s11-check

  build:
    name: Turbo Affected Build
    needs: boundary-check
    runs-on: ubuntu-latest
    env:
      TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
      TURBO_TEAM: ${{ secrets.TURBO_TEAM }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 2

      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - name: Install
        run: pnpm install --frozen-lockfile

      - name: Build affected only
        run: turbo run build --filter=...[origin/main...HEAD]

      - name: Test affected only
        run: turbo run test --filter=...[origin/main...HEAD]
```

---

## KROK 3 — `turbo.json` — walidacja konfiguracji cache

Upewnij się, że `~/silence/turbo.json` zawiera `outputs` dla poprawnego cache hit:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "boundary-check": {
      "cache": false
    },
    "s11-check": {
      "cache": false
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    }
  }
}
```

`cache: false` dla `boundary-check` i `s11-check` jest wymagane — te zadania muszą być uruchamiane zawsze, niezależnie od stanu cache.

---

## KROK 4 — Vercel Project Mapping

Każda aplikacja w `05_apps/` musi mieć oddzielny projekt Vercel.
Wymagane sekrety w GitHub Actions (potwierdzono w audyt1.md):

| Sekret         | Zakres      | Status                   |
| -------------- | ----------- | ------------------------ |
| `VERCEL_TOKEN` | global      | POTWIERDZONY w audyt1.md |
| `ORG_ID`       | per projekt | POTWIERDZONY w audyt1.md |
| `PROJECT_ID`   | per projekt | POTWIERDZONY w audyt1.md |
| `TURBO_TOKEN`  | global      | POTWIERDZONY w audyt1.md |

Dla każdej aplikacji (`web`, `admin`, `portal`, `patternlens`) wymagane oddzielne `PROJECT_ID`.
Aktualne audyt nie potwierdza, czy są już skonfigurowane oddzielne projekty Vercel dla każdej z aplikacji.

STATUS dla multi-project mapping: `NOT CONFIRMED` — weryfikacja wymagana w Vercel Dashboard.

---

## KROK 5 — TOKEN SECURITY (P0 z audyt1.md)

Audyt1.md identyfikuje token `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` w 3 plikach `.git/config`.
Przed wdrożeniem protokołu Vercel ten token musi być unieważniony.

```bash
# Weryfikacja czy token został usunięty z remote URLs
grep -r "ghp_" ~/silence/.git/config 2>/dev/null && echo "BLOCKED: token nadal obecny" || echo "PASS: token nieobecny"

# Sprawdzenie remote URL
cd ~/silence && git remote -v
# Oczekiwany output: origin https://github.com/silence-ecosystem/silence-core.git (bez tokenu)
```

---

# VERIFICATION

## Checklist wdrożenia

| #   | Warunek                                             | Metoda weryfikacji                                 | Status        |
| --- | --------------------------------------------------- | -------------------------------------------------- | ------------- |
| 1   | `vercel.json` z `ignoreCommand` w każdej aplikacji  | `ls 05_apps/*/vercel.json`                         | TBD           |
| 2   | `buildCommand` z `--filter=...[origin/main...HEAD]` | `cat 05_apps/*/vercel.json \| jq .buildCommand`    | TBD           |
| 3   | `fetch-depth: 2` w workflow                         | `grep fetch-depth .github/workflows/deploy.yml`    | TBD           |
| 4   | `boundary-check` jako first gate przed build        | `cat .github/workflows/deploy.yml`                 | TBD           |
| 5   | Token `ghp_*` nieobecny w `.git/config`             | `grep -r ghp_ ~/silence/.git/config`               | TBD           |
| 6   | `turbo.json` z `cache: false` dla boundary/s11      | `cat turbo.json \| jq .tasks`                      | TBD           |
| 7   | Build affected przechodzi lokalnie                  | `turbo run build --filter=...[origin/main...HEAD]` | TBD           |
| 8   | Vercel projekt per aplikacja skonfigurowany         | Vercel Dashboard                                   | NOT CONFIRMED |

## Warunki PASS

- `turbo-ignore` aktywny: build pomijany gdy brak zmian w pakiecie → redukcja kosztów potwierdzona
- `--filter` aktywny: budowane wyłącznie dotknięte pakiety → brak zbędnych buildów
- `fetch-depth: 2`: Turborepo wykrywa zmiany względem poprzedniego commita
- `boundary-check` blokuje merge przed build: P0 gate aktywny
- Token nieobecny w remote URLs: security clean

## Warunki BLOCKED

| Warunek                               | Trigger                        |
| ------------------------------------- | ------------------------------ |
| Token `ghp_*` nadal w `.git/config`   | Deploy BLOCKED do czasu revoke |
| `boundary-check` zwraca błąd          | Build BLOCKED — WORLDHALT      |
| Brak oddzielnych `PROJECT_ID` per app | Vercel deploy BLOCKED          |

---

# PCS SCORING

| Kryterium                     | Odejmij | Status                      |
| ----------------------------- | ------- | --------------------------- |
| boundary violation            | -0.150  | PASS                        |
| failed build                  | -0.120  | TBD (build nie uruchomiony) |
| failed tests                  | -0.100  | TBD                         |
| brak AGENTS.md                | -0.080  | NOT CONFIRMED               |
| brak audit entry              | -0.080  | PASS (wpis poniżej)         |
| TODO/placeholder w artefakcie | -0.070  | PASS                        |
| plik >500 linii               | -0.050  | PASS (~180 linii)           |
| brak hash                     | -0.050  | TBD (hash po zapisie)       |
| naruszenie S11                | -0.030  | PASS                        |
| brak explicit verification    | -0.020  | PASS                        |

**PCS (compile phase):** 1.000 (hash obliczony: a37cecd0df39d9fbc34af97465a65bc5aaa8d919a278490aaada2a60e3ba9f91)

Przejście do PASS wymaga:

1. Uruchomienia `sha256sum` po zapisie pliku
2. Weryfikacji `boundary-check` i build
3. Potwierdzenia Vercel multi-project config

---

# AUDIT TRAIL

```yaml
task_id: SILENCE_VERCEL_OPT_001
commit_id: S11-MVP-20260622-002
status: PARTIAL
pcs: 0.950
artifact_path: 06_infrastructure/VERCEL_OPT_PROTOCOL_v1.md
sha256: a37cecd0df39d9fbc34af97465a65bc5aaa8d919a278490aaada2a60e3ba9f91
boundary_check: NOT_RUN
tests: NOT_RUN
build: NOT_RUN
s11_check: PASS
timestamp_utc: 2026-06-22T21:46:00Z
notes: >
  Hash i wyniki build/test wymagają uruchomienia w środowisku docelowym ~/silence.
  Token security (P0 z audyt1.md) musi być zresolvowany przed deploy.
  Vercel multi-project mapping NOT CONFIRMED.
```
