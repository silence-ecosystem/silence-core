<!--
[PATH]: 01_governance/PR_POST_MERGE_CHECKLIST_silence-core.md
-->

***
title: PR_POST_MERGE_CHECKLIST_silence-core
status: ACTIVE
version: 1.0
classification: CANONICAL
owner: PHI_CORE_GUARDIAN
rigor: S11_SENTINEL_ENFORCED
pcs_threshold: ">= 0.970"
failure_mode: WORLD_HALT
updated: 2026-06-12
repository: silence-ecosystem/silence-core
***

# [T] PR Post-Merge Checklist — silence-core

## 1. Cel dokumentu [T]

Niniejszy dokument ustanawia obowiązkową checklistę weryfikacyjną po pierwszym i każdym kolejnym PR w repozytorium `silence-ecosystem/silence-core`. Celem checklisty jest utrzymanie matematycznej czystości warstwy publicznej, aktywnej separacji domen open-core i enterprise oraz pełnej zgodności z S11, ADR-004 i binarną logiką PASS/WORLD_HALT.

Dokument ma status governance i jest przeznaczony do użycia w review PR, kontroli merge readiness, audytach CI/CD oraz przy migracji kolejnych modułów z lokalnego repo do publicznego `silence-core`.

## 2. Zasada nadrzędna [T]

Każdy PR w `silence-core` jest ważny operacyjnie wyłącznie wtedy, gdy pozostaje mapowalny do `SILENCE_STRUCT_v2_0`, zachowuje granicę IP oraz przechodzi komplet wymaganych bramek buildowych i językowych. Artefakt bez determinizmu, bez ścieżki audytowej lub z naruszeniem S11 jest traktowany jako nieważny operacyjnie zgodnie z `S11-DOC-01`.

## 3. Weryfikacja CI gates [T]

Przed analizą diffu reviewer musi sprawdzić wynik automatycznych strażników.

### IP Boundary Check (ADR-004)

Sprawdź wynik `pnpm boundary-check` na PR: musi raportować **0 violations**. To potwierdza, że nie ma importów z domen enterprise (`03_ee/*`) do open-core (`04_packages/@silence/*`) ani do `05_apps/*`.

### S11 Guardrail (Language Sentinel)

Wynik `pnpm s11-check` musi być **0 violations**. To gwarantuje brak klinicznej / wellness-owej terminologii w kodzie, komentarzach, stringach UI i dokumentacji wchodzącej w skład PR.

### PCS Gate / Φ-consistency

Dla tego PR proxy metryką PCS jest komplet bramek strukturalnych, a nie liczba wyliczana w runtime. Przyjmujemy, że `PCS >= 0.97` oznacza jednoczesny PASS wszystkich z poniższych:

- `boundary-check`
- `s11-check`
- `test:determinism`
- `test:vitest`
- `typecheck`
- hash-chain EffectLog bez przerw
- brak magicznych liczb poza kanonem Φ

### SHA pinning w CI

W plikach `.github/workflows/*.yml` wszystkie użyte GitHub Actions muszą być przypięte do pełnych SHA (tak jak wymaga `git-workflow-and-versioning`), nigdy same `v4`, `v3` itd.

> Jeśli PR dotyka workflowów, reviewer musi sprawdzić diff w sekcji `uses:` pod kątem pełnych hashy.

## 4. Vercel scope i wyciek sekretów [T]

Ten krok weryfikuje, że publiczny deploy nie „zaciąga" warstwy EE ani sekretów serwerowych.

### Vercel scope / `.vercelignore`

Sprawdź diff `.vercelignore` i `vercel.json` w `silence-core`:

- `03_ee/`, `07_archive/`, `01_governance/`, `02_protocols/`, `docs/`, `design/` muszą być wykluczone z uploadu.
- `vercel.json` nie może wprowadzać ścieżek, które budują lub deployują cokolwiek z EE.

### Turbo-ignore / build scope

W CI (lub lokalnie) `turbo run` musi być ograniczone do pakietów dotkniętych PR-em i ich zależności, ale nie może „przypadkiem" budować EE, bo EE w tym repo nie powinno istnieć lub być objęte `boundary-check` jako niedostępne.

> Jeżeli używasz `npx turbo-ignore` / podobnego mechanizmu, sprawdź, że obejmuje tylko open-core + apps.

### Environment variables (leak audit)

- W PR nie może być żadnych nowych wpisów z sekretami w `.env*`, `vercel.json`, workflowach czy README.
- Klasy typu `SUPABASE_SERVICE_ROLE_KEY`, klucze do Neon, Inngest itp. nie mogą pojawić się w diffie.
- Każda zmienna wystawiana do frontendu musi być jawnie oznaczona `NEXT_PUBLIC_`, ale żadna wrażliwa flaga (klucz, token, secret) nie może mieć tego prefiksu.

## 5. Audyt S11 w diffie (sterilność językowa) [T]

Mimo automatycznego `s11-check` wymagany jest ręczny skan diffu.

### Brak terminologii klinicznej / wellness

W diffie nie mogą występować jako język systemu m.in.: `diagnosis`, `diagnose`, `disorder`, `syndrome`, `therapy`, `therapist`, `treatment`, `heal`, `healing`, `anxiety`, `depression`, `stress` jako metryka, `wellness`, `wellbeing`.

Jeśli pojawiają się w cytacie lub meta-dokumencie, musi być to zgodne z wyjątkami S11 i oznaczone jako zewnętrzna referencja, nie słownictwo systemu.

### Nomenklatura eventów

Nowe eventy i typy zdarzeń powinny używać formatów strukturalnych, np.:

- `SILENCE.GARDEN.STEP_EXECUTED`
- `SILENCE.SESSION.STARTED`
- `SILENCE.BREATH_CYCLE.COMPLETED`

Niedopuszczalne jest wprowadzanie eventów sugerujących diagnozę lub stany kliniczne.

### Nazewnictwo pakietów i identyfikatorów

- Nowe pakiety w `04_packages/@silence/*` muszą używać `lowercase-kebab-case` pod scopem `@silence/` (np. `@silence/validator`, `@silence/language`).
- Nazwy plików i katalogów muszą być zgodne z SSNP i nie mogą zawierać terminów klinicznych.

## 6. Spójność SSoT (local vs remote) [T]

Celem jest upewnienie się, że stan w `/home/ewa/silence` i na `github.com/silence-ecosystem/silence-core` jest deterministycznie spójny.

### Pochodzenie brancha (branch origin)

Upewnij się, że `fix/typecheck-eight-packages` został utworzony z aktualnego `main` w `silence-core` (lub z gałęzi, która jest fast-forward do `main`).

W razie wątpliwości:

```bash
git fetch origin && git rebase origin/main
```

przed finalnym push/merge.

### Anchor files

- Każdy nowy pakiet w `04_packages/@silence/*` musi posiadać `README.md`, `package.json` i anchor w postaci `src/index.ts` lub równoważnego barrel file.
- Nowe katalogi governance muszą mieć jawny `[PATH]` w pliku oraz pełny frontmatter, zgodnie z `S11-DOC-01`.

### SILENCE_STRUCT

Sprawdź, czy nowo dodane pakiety/katalogi są mapowalne na sekcje `SILENCE_STRUCT_v2_0`; jeśli nie, jest to naruszenie porządku architektonicznego.

### Changesets / wersjonowanie

Jeżeli `silence-core` używa changesetów, PR powinien zawierać odpowiedni plik changeset opisujący typ zmiany (`fix`/`feat`) i wpływ na wersjonowanie pakietów.

Przy zmianach stricte infra (hardening, typecheck) dopuszczalne jest oznaczenie jako `patch` / `infra-only`, o ile polityka repo tak przewiduje.

## 7. Automatyzacja (ustawienia docelowe dla silence-core) [T]

Aby checklista działała bez ręcznego pilnowania, docelowa konfiguracja w `silence-core` powinna obejmować:

### S11 linter (G1)

Utrzymuj `scripts/s11-check` / `@silence/s11-lint` jako CI job oraz, opcjonalnie, pre-commit hook. Lista zakazanych terminów musi być zgodna z `S11-01 Language Standard`.

### Boundary enforcement w turbo

W `turbo.json` włącz enforcement dla granic pakietów (np. przez dedykowane zadania lub integrację z `boundary-check`), aby importy `04_packages ← 03_ee` były blokowane już na etapie build/test, nie tylko przez osobny script.

### GitHub rulesets

W organizacji `silence-ecosystem` skonfiguruj ruleset dla `silence-core`, który wymusza:

- signed commits,
- squash merge na `main`,
- wymagane status checks: `boundary-check`, `s11-check`, `test:determinism`, `vitest`, `typecheck`.

### Vercel + CI master gate (Benchmark 2030)

Docelowo możesz wzorować się na `benchmark-2030.yml` / `deploy-vercel.md` (INP, Scorecard, SLSA), ale w aktualnym etapie kluczowe jest, by Vercel deploy był zablokowany, jeśli którykolwiek z gate’ów S11/boundary/typecheck nie przejdzie.

## 8. Status „Żelaznej Granicy" [T]

Po tym pierwszym PR (git governance + Vercel scope + typecheck + 8 fixów) możesz uznać, że:

- „Żelazna Granica" między open-core a enterprise w `silence-core` działa operacyjnie;
- `silence-core` jest gotowy na przyjmowanie kolejnych modułów z lokalnego `/home/ewa/silence`, pod warunkiem, że każdy kolejny PR przejdzie tę samą checklistę (gates, S11, IP boundary, SSoT).

## 9. Checklista PASS/FAIL [T]

- [x] Jawna ścieżka `[PATH]` obecna.
- [x] Repo docelowe wskazane jako `silence-ecosystem/silence-core`.
- [x] CI gates opisane jako obowiązkowe.
- [x] Granica ADR-004 opisana fizycznie i logicznie.
- [x] Vercel scope opisany z wykluczeniem domen niepublicznych.
- [x] Audyt S11 opisany jako automatyczny i ręczny.
- [x] Spójność local vs remote ujęta jawnie.
- [x] Anchor files i `[PATH]` wpisane jako wymóg.
- [x] Rulesety GitHub i signed commits ujęte jako automatyzacja docelowa.
- [x] Status Żelaznej Granicy opisany operacyjnie.
- [x] Brak placeholderów i TODO.
- [x] Domknięcie semantyczne zachowane.
