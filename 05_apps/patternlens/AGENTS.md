<!-- PATH: /home/ewa/silence/05_apps/patternlens/AGENTS.md -->
<!-- STATUS: active -->
<!-- S11.COMMIT.ID: AGENTS-PATTERNLENS-20260625-001 -->
<!-- PREVHASH: INIT-AGENTS-PATTERNLENS-000 -->

# AGENTS.md — `05_apps/patternlens`

## 1. MANDATE

Ten plik jest lokalnym kontraktem operacyjnym dla aplikacji `patternlens`. Obowiązuje wszystkie osoby i agenty wykonawcze działające w tej ścieżce. Wszelkie zmiany muszą być zgodne z root `AGENTS.md` repozytorium `/home/ewa/silence/AGENTS.md`.

## 2. SCOPE

Dozwolony zakres zapisu:

- `src/app/`
- `src/components/`
- `src/hooks/`
- `src/lib/`
- `src/types/`
- `src/styles/`
- root configi aplikacji: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.*`, `turbo.json`, `eslint.config.mjs`

Zakazane:

- bezpośredni zapis do `03_ee/`, `07_archive/`, `04_packages/` (zmiany tam wymagają ADR),
- tworzenie katalogów `temp`, `misc`, `backup`, `final-final`,
- dodawanie nowych zależności bez weryfikacji w workspace.

## 3. BOUNDARY RULES

- `05_apps/patternlens` **nie importuje** z `03_ee/` — `WORLDHALT` przy naruszeniu.
- Publiczny kanał kontraktowy to `@silence/contracts` i `@silence/events`.
- `@silence/sdk` jest obecnie `deprecated` — nie należy go używać do czasu odbudowy.
- Lokalne typy re-exportujące `@silence/contracts` muszą być oznaczone jako wtórne i wskazywać SSoT.

## 4. STACK

- Next.js 15 (App Router, `src/app/`)
- React 19
- TypeScript 5.7
- Tailwind CSS 3.4
- Supabase SSR
- Vitest 4

## 5. DETERMINISM RULES

- Zakaz `Math.random()` w kodzie produkcyjnym i komponentach UI.
- `Date.now()` / `new Date()` w komponentach UI wymagają jawnego uzasadnienia w komentarzu.
- Timestamp dla eventów telemetrycznych musi być injectowany przez caller.
- Identyfikatory sesji/generowane ID muszą być deterministyczne (hash z context).

## 6. S11 LANGUAGE LOCK

W kodzie aplikacji, commitach, nazwach plików i dokumentacji zakazane są terminy wymienione w kanonicznym słowniku S11-01 (`01_governance/S11-01.md`). Nie stosuj etykiet diagnostycznych, interwencji terapeutycznych ani terminologii lifestyle/wellness.

Preferowane terminy operacyjne: `TENSION_SCORE`, `SIGNAL_NOISE`, `STATE_VIOLATION`, `SIGNAL_PURITY`, `RITUAL_STATE`, `DETERMINISTIC_FLOW`, `PATTERN_SIGNATURE`.

## 7. MATH CORE

Wszystkie parametry czasu, spacingu i animacji muszą mieć jawna derywację z `PHI = 1.6180339887` i `GOLDENSECOND = 1618 ms`. Importuj z `@silence/phi` — nie definiuj lokalnie.

## 8. CHECKS BEFORE WRITE

Przed każdym zapisem wykonaj:

```bash
cd /home/ewa/silence
pnpm boundary-check
pnpm s11-check
pnpm --filter patternlens type-check
```

Przy FAIL dowolnej bramy — STOP, raportuj, nie zapisuj.

## 9. LIFECYCLE

Nowe pliki oznaczaj `STATUS: draft` w nagłówku. Po review zmień na `active`. Pliki deprecated wymagają wskazania następcy.

## 10. CONTACT

Architektura i decyzje cross-app: `01_governance/`. Problemy z boundary lub S11: root `AGENTS.md`.
