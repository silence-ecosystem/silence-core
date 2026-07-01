# VERCEL COST OPTIMIZATION PROTOCOL v1.1

**status:** PARTIAL (SYSTEM) / PASS (ROOT CONFIG)
**sentinel:** S11_ENFORCED
**pcs_gate:** 0.999
**pcs_computed:** 0.970
**version:** v1.2
**last_verified:** 2026-07-01
**derivation_source:** `06_infrastructure/vercel.json` + `turbo.json` + audit logs (`2.md`)

> **Zmiana tego pliku** wymaga nowego ADR w `01_governance/decisions/` oraz podbicia wersji.
> Dokument opisuje stan wykonawczy zweryfikowany w repo, a nie stan docelowy deklaratywny.

## Cel

Celem protokołu jest ustanowienie kanonicznych zasad redukcji kosztów Vercel dla monorepo SILENCE przy zachowaniu deterministycznego wykonania, szczelnych granic architektonicznych i jawnych bramek jakości. Protokół wiąże warstwę konfiguracji Vercel z rzeczywistym grafem zadań Turborepo i z operacyjnym statusem pipeline'u.

Wersja 1.2 aktualizuje v1.1 do stanu faktycznie wdrożonego w repo. Źródłem prawdy dla konfiguracji Vercel jest `06_infrastructure/vercel.json`; root `vercel.json` został zarchiwizowany w `07_archive/legacy_monorepo/`. Aktualny `turbo.json` oraz zweryfikowany ciąg komend CI pozostają częścią kontraktu.

## Zakres

Dokument obejmuje wyłącznie rootową konfigurację Vercel, strategię affected-only builds, relację z `turbo-ignore`, wymagane bramki CI oraz kryteria PCS dla statusów PASS i PARTIAL. Dokument nie ustanawia jeszcze kontraktów per aplikacja dla `05_apps/*` i nie zastępuje lokalnych kontraktów modułowych typu `AGENTS.md`.

Jeżeli dana aplikacja wymaga własnego `vercel.json`, `outputDirectory`, `functions`, `cleanUrls` albo dedykowanego mapowania projektu Vercel, musi to zostać opisane w osobnym kontrakcie aplikacyjnym. Brak takiego kontraktu oznacza, że niniejszy protokół obowiązuje wyłącznie na poziomie root repo.

## Root configuration

Kanoniczna konfiguracja `vercel.json` jest następująca i znajduje się wyłącznie w `06_infrastructure/vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "version": 2,
  "installCommand": "pnpm install --frozen-lockfile",
  "buildCommand": "pnpm exec turbo run build --filter=...[origin/main...HEAD]",
  "ignoreCommand": "npx turbo-ignore --fallback=HEAD^1",
  "framework": null,
  "github": {
    "silent": true,
    "enabled": false
  }
}
```

Ta konfiguracja jest kanoniczna dla zadania `SILENCE_VERCEL_ROOT_CONFIG_001`. Każda zmiana usuwająca `turbo-ignore`, usuwająca filtr `...[origin/main...HEAD]` albo rozluźniająca deterministyczny `installCommand` jest naruszeniem protokołu kosztowego.

## Model kosztowy

Kluczowe mechanizmy optymalizacji kosztów redukują liczbę zbędnych buildów o około 80% poprzez połączenie selekcji zmian z kontrolą wykonania na poziomie Vercel i Turborepo. Model ten opiera się na trzech wzajemnie zależnych mechanizmach, które muszą występować równocześnie, aby protokół był operacyjnie ważny.

`turbo-ignore` jest wymagany w `vercel.json` w postaci `npx turbo-ignore --fallback=HEAD^1`. Mechanizm ten pozwala Vercelowi pominąć build, gdy zmiany nie dotyczyły danej aplikacji lub jej grafu zależności.

Affected Builds są wymagane w `buildCommand` i muszą używać dokładnie filtra `--filter=...[origin/main...HEAD]`. Oznacza to budowanie i testowanie wyłącznie pakietów zmienionych względem `origin/main` oraz ich konsumentów, zamiast pełnego monorepo.

Git `fetch-depth: 2` jest ustawieniem bezwzględnym dla workflowów deploy i walidacji, o ile dany workflow nie ma jawnie uzasadnionej potrzeby pełnej historii. Bez tej wartości Turborepo nie ma poprawnego kontekstu do identyfikacji zakresu zmian, a affected-only execution przestaje być wiarygodne.

W praktyce oznacza to, że koszt nie jest już generowany przez pełny build całego monorepo przy każdym pushu, lecz przez minimalny podgraf wymagany do poprawnej walidacji zmiany. Protokół uznaje brak któregokolwiek z tych trzech mechanizmów za stratę ekonomiczną i naruszenie zasady przewagi kosztowej.

## Relacja z Turborepo

Protokół zakłada, że Vercel nie działa w izolacji, lecz jako warstwa wykonawcza nad `pnpm` i `Turborepo`. Root `vercel.json` musi być czytany łącznie z `turbo.json`, ponieważ to właśnie `turbo.json` definiuje relacje między `boundary-check`, `s11-check`, `build`, `typecheck`, `lint` i `test`.

Affected-only build na Vercelu jest prawidłowy wyłącznie wtedy, gdy lokalnie i w CI obowiązuje ten sam model selekcji zadań. Oznacza to użycie `--filter=...[origin/main...HEAD]` także w ręcznych komendach walidacyjnych i w dokumentacji technicznej repo.

## Sekwencja pipeline przed deployem

Przed każdym deployem musi zostać wykonana następująca sekwencja pipeline:

1. `pnpm install --frozen-lockfile`
2. `pnpm boundary-check`
3. `pnpm s11-check`
4. `pnpm typecheck`
5. `pnpm exec turbo run build --filter=...[origin/main...HEAD]`
6. `pnpm exec turbo run test --filter=...[origin/main...HEAD]`

`pnpm boundary-check` potwierdza brak wycieku IP i szczelność `RULE-DOM-001` między `03_ee`, `04_packages` i `05_apps`. `pnpm s11-check` egzekwuje zero naruszeń leksykalnych i jest twardym warunkiem wejścia w status PASS. `typecheck`, `build` i `test` domykają walidację wykonania technicznego dla zmienionego podgrafu repo.

## Stan zweryfikowany

Na podstawie ostatniego pełnego audytu wykonawczego stan jest następujący:

- `pnpm install --frozen-lockfile` — PASS
- `pnpm boundary-check` — PASS
- `pnpm s11-check` — FAIL
- `pnpm typecheck` — PASS
- `pnpm exec turbo run build --filter=...[origin/main...HEAD]` — PASS
- `pnpm exec turbo run test --filter=...[origin/main...HEAD]` — PASS

Jedynym aktywnym blokerem systemowym pozostaje `s11-check`, który raportuje 31 naruszeń w 4 plikach. Z tego powodu root config może być uznany za poprawny, ale cały system nie osiąga jeszcze statusu `PASS`.

## PCS

Aktualna ocena PCS dla systemu wynosi `0.970` przy bramce `0.999`. Szczegółowe definicje bram PCS, tabela kar oraz pełny model obliczeniowy znajdują się w kanonicznym dokumencie `02_protocols/PCS_GATE_2.0.md` (SSoT). Niniejszy protokół przyjmuje te progi jako część kontraktu deployowego.

W praktyce oznacza to rozdzielenie dwóch stanów. `PASS (ROOT CONFIG)` oznacza poprawność techniczną i zgodność `06_infrastructure/vercel.json` z protokołem. `PARTIAL (SYSTEM)` oznacza, że cały system nie może wejść do pełnego stanu produkcyjnego, dopóki `pnpm s11-check` nie zwróci wyniku PASS oraz dopóki PCS nie osiągnie progu `0.997`.

## Migracja v1.1 → v1.2

Wersja 1.2 przenosi kanoniczną konfigurację Vercel z root `vercel.json` do `06_infrastructure/vercel.json`, co jest zgodne z zakresem odpowiedzialności domeny infrastrukturalnej i zasadą Single Source of Truth. Rootowy plik został zarchiwizowany w `07_archive/legacy_monorepo/` bez usuwania go na stałe. Aktualizacja obejmuje również doprecyzowanie trzech mechanizmów kosztowych (`turbo-ignore`, affected-only builds, `fetch-depth: 2`), wpisanie rzeczywistej sekwencji gate'ów oraz jawne odnotowanie systemowego statusu `PARTIAL`.

Wersja 1.2 nie rozszerza jeszcze zakresu na per-app deployment contracts. Ten obszar pozostaje do zdefiniowania osobno dla aplikacji, które rzeczywiście posiadają kompletne kontrakty wdrożeniowe i własną odpowiedzialność za runtime.

## Kryterium aktualizacji

Dokument wymaga nowej wersji, gdy zmienia się root `vercel.json`, logika `turbo.json`, kolejność gate'ów CI, zakres PCS albo model deployu dla `05_apps/*`. Nie wolno aktualizować tego dokumentu w trybie ad hoc bez wskazania nowego źródła prawdy i bez spójności z wykonanym audytem.
