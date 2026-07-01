[PATH]: 01_governance/POST_IMPL_CHECKLIST.md

---

id: POST_IMPL_CHECKLIST
version: 1.0.0
status: CANONICAL
pcs_status: 0.997
s11_compliant: true
failure_mode: WORLDHALT
owner: PHI-CORE-GUARDIAN
updated: 2026-06-20
repository: silence-ecosystem/silence-core

---

# CHECKLISTA POST-IMPLEMENTACYJNA

## SILENCE Ecosystem · HARD_SEVEN_v2026

Każda pozycja: `[ ]` = STATE_VIOLATION · `[x]` = PASS.
Jeden FAIL = merge zablokowany.

---

## BLOK 0 — STRUKTURA REPO

| #   | Weryfikacja                                                                          | Polecenie / Dowód                                           |
| --- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| 0.1 | 8 katalogów root istnieje (`01`–`08`)                                                | `ls -d 0*/`                                                 |
| 0.2 | Każdy root posiada `README.MD` i `INDEX.MD`                                          | `bash s-init-monorepo.sh --validate`                        |
| 0.3 | `03_ee/` zawiera podkatalogi: `jitai`, `safety`, `decisioning`, `models`             | `ls 03_ee/`                                                 |
| 0.4 | `04_packages/` zawiera: `sdk`, `core`, `guards`, `types`                             | `ls 04_packages/`                                           |
| 0.5 | `CLAUDE.md` i `AGENTS.md` obecne w root — treść identyczna                           | `diff CLAUDE.md AGENTS.md`                                  |
| 0.6 | `pnpm-workspace.yaml` deklaruje `04_packages/*` i `05_apps/*` — zero `03_ee/*`       | `cat pnpm-workspace.yaml`                                   |
| 0.7 | `07_archive/legacy-monorepo` — status read-only, zero importów w kodzie produkcyjnym | `grep -r "07_archive" 04_packages/ 05_apps/` → brak wyników |

---

## BLOK 1 — RULE-DOM-001 / BOUNDARY

| #   | Weryfikacja                                                                                          | Polecenie / Dowód                           |
| --- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| 1.1 | `.dependency-cruiser.js` obecny w root, reguły `no-open-core-to-ee` i `no-apps-direct-to-ee` aktywne | `cat .dependency-cruiser.js`                |
| 1.2 | `pnpm boundary-check` → exit 0, zero naruszeń                                                        | `pnpm boundary-check`                       |
| 1.3 | Żaden pakiet w `04_packages/` nie importuje z `03_ee/`                                               | `grep -r "from.*03_ee" 04_packages/` → brak |
| 1.4 | Żadna aplikacja w `05_apps/` nie importuje z `03_ee/` bezpośrednio                                   | `grep -r "from.*03_ee" 05_apps/` → brak     |
| 1.5 | Komunikacja `05_apps/ → 03_ee/` wyłącznie przez `@silence/sdk`                                       | Audyt `import` w `05_apps/`                 |
| 1.6 | `05_services/` spełnia te same reguły co `05_apps/`                                                  | `grep -r "from.*03_ee" 05_services/` → brak |

---

## BLOK 2 — S11 VOCABULARY SENTINEL

| #   | Weryfikacja                                                                       | Polecenie / Dowód                                                                 |
| --- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| 2.1 | `pnpm s11-check` → exit 0                                                         | `pnpm s11-check`                                                                  |
| 2.2 | Zero wystąpień terminów zakazanych w `04_packages/`, `05_apps/`, `01_governance/` | Patrz tabela niżej                                                                |
| 2.3 | Terminy zakazane nieobecne w ciągach UI, komentarzach, nazwach zmiennych          | `grep -rn "TENSION_SCORE\|TENSION_SCORE\|chaos\|błąd\|mindfulness\|COMFORT_STABILIZATION" 04_packages/ 05_apps/` |
| 2.4 | Nazwy eventów zgodne z `KANON_NAZEWNICTWA_v1.0.2`: format `DOMAIN.ENTITY.ACTION`  | Audyt `events.types.ts`                                                           |
| 2.5 | Nazwy metryk zgodne z kanonem (snake_case w API, camelCase w TS)                  | Audyt `*.types.ts`                                                                |

**Terminy zakazane → kanon S11:**

| Zakazany           | Kanoniczny           |
| ------------------ | -------------------- |
| TENSION_SCORE / TENSION_SCORE        | `TENSION_SCORE`      |
| błąd / error       | `STATE_VIOLATION`    |
| chaos              | `SIGNAL_NOISE`       |
| przeciążenie       | `LOAD_EXCEEDED`      |
| rozproszenie       | `ATTENTION_DRIFT`    |
| mindfulness        | `RITUAL_STATE`       |
| COMFORT_STABILIZATION / zdrowie | `SIGNAL_PURITY`      |
| intuicyjny         | `DETERMINISTIC_FLOW` |

---

## BLOK 3 — MATHCORE φ / DETERMINIZM

| #   | Weryfikacja                                                                                  | Polecenie / Dowód                                            |
| --- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| 3.1 | `pnpm --filter @silence/core test:determinism` → PASS                                        | `pnpm --filter @silence/core test:determinism`               |
| 3.2 | Zero wystąpień `Math.random()` w kodzie sesji behawioralnych                                 | `grep -rn "Math.random" 04_packages/ 05_apps/` → brak w src/ |
| 3.3 | Zero `unseeded Date.now()` jako źródła entropii w core                                       | Audyt `04_packages/core/`                                    |
| 3.4 | Stałe `PHI`, `GOLDENSECOND`, `FIB` importowane z `@silence/core` — nie redefinowane lokalnie | `grep -rn "PHI = " 05_apps/` → brak                          |
| 3.5 | Wartości timing/layout mają jawną derywację φ w komentarzu lub typie                         | Audyt `constants.ts`                                         |
| 3.6 | `GOLDENSECOND_CASCADE: [62, 100, 162, 262, 424, 618, 1000, 1618]` — wartości niezmienione    | `cat 04_packages/core/src/constants.ts`                      |

---

## BLOK 4 — NAZEWNICTWO (KANON v1.0.2)

| #   | Weryfikacja                                                                        | Polecenie / Dowód                                                               |
| --- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 4.1 | Pakiety `04_packages/` nazwane `@silence/<kebab-case>` bez sufiksu `-ee`           | `cat 04_packages/*/package.json \| grep '"name"'`                               |
| 4.2 | Pliki komponentów: `PascalCase.tsx`                                                | `find 05_apps/ -name "*.tsx" \| grep -v PascalCase` → brak anomalii             |
| 4.3 | Hooki: `use-*.ts` lub `use*.ts`                                                    | Audyt `hooks/`                                                                  |
| 4.4 | Anchor files: `UPPER_SNAKE.md`                                                     | Audyt `01_governance/`                                                          |
| 4.5 | ADR: format `ADR-NNN-kebab-title.md`                                               | `ls 01_governance/decisions/`                                                   |
| 4.6 | Brak barrel files (`index.ts` re-eksportujących wszystko)                          | `grep -rn "export \* from" 04_packages/` → brak                                 |
| 4.7 | Przestarzałe nazwy (`silence-objects-*`, sufiks `-ee`) nieobecne w aktywnym kodzie | `grep -rn "silence-objects\|behavioral-engine-ee" 04_packages/ 05_apps/` → brak |

---

## BLOK 5 — CI GATE SET

| #   | Gate               | Polecenie                                      | Wynik      |
| --- | ------------------ | ---------------------------------------------- | ---------- |
| 5.1 | `boundary-check`   | `pnpm boundary-check`                          | `[ ] PASS` |
| 5.2 | `s11-check`        | `pnpm s11-check`                               | `[ ] PASS` |
| 5.3 | `test:determinism` | `pnpm --filter @silence/core test:determinism` | `[ ] PASS` |
| 5.4 | `test:vitest`      | `pnpm test`                                    | `[ ] PASS` |
| 5.5 | `type-check`       | `turbo run type-check`                         | `[ ] PASS` |
| 5.6 | `lint`             | `turbo run lint`                               | `[ ] PASS` |

Kolejność deterministyczna: `5.1 → 5.2 → 5.3 → 5.4 → 5.5 → 5.6`.
Jeden FAIL blokuje resztę.

---

## BLOK 6 — DEPLOY VERCEL

| #   | Weryfikacja                                                                                 | Polecenie / Dowód                         |
| --- | ------------------------------------------------------------------------------------------- | ----------------------------------------- |
| 6.1 | `deploy-guard` workflow green przed `vercel --prod`                                         | GitHub Actions → zielony                  |
| 6.2 | `vercel.json` zawiera `ignoreCommand: "npx turbo-ignore --fallback=HEAD^1"`                 | `cat apps/patternlens/vercel.json`        |
| 6.3 | Z Vercel build scope wykluczone: `03_ee/`, `07_archive/`, `01_governance/`, `02_protocols/` | `.vercelignore`                           |
| 6.4 | Sekrety przekazywane przez `env:` — zero interpolacji w `run:`                              | Audyt `.github/workflows/`                |
| 6.5 | `EFFECT_LOG` zaktualizowany przed deployem prod                                             | `cat 02_protocols/effect-log/DEPLOYS.log` |
| 6.6 | Region: `fra1` (EU residency)                                                               | `vercel.json → regions`                   |

---

## BLOK 7 — GIT / COMMIT COMPLIANCE

| #   | Weryfikacja                                            | Dowód                      |
| --- | ------------------------------------------------------ | -------------------------- |
| 7.1 | Commit message: `<type>(<scope>): <opis max 72 znaki>` | `git log -1 --format="%s"` |
| 7.2 | Trailer `S11.COMMIT.ID` obecny                         | `git log -1 --format="%b"` |
| 7.3 | Commit podpisany GPG/SSH → badge `Verified` na GitHub  | GitHub commit view         |
| 7.4 | PR: squash merge, linear history                       | GitHub PR settings         |
| 7.5 | Gałąź robocza usunięta po merge                        | GitHub branch list         |

---

## BLOK 8 — RULE OF 500 / FRAGMENTACJA

| #   | Weryfikacja                                                   | Polecenie                                                                                         |
| --- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 8.1 | Żaden plik produkcyjny > 500 linii                            | `find 04_packages/ 05_apps/ -name "*.ts" -o -name "*.tsx" \| xargs wc -l \| sort -rn \| head -20` |
| 8.2 | `AGENTS.md` per pakiet ≤ 300 linii                            | `wc -l 04_packages/*/AGENTS.md`                                                                   |
| 8.3 | Zero plików z `TODO`, `FIXME`, placeholder w production scope | `grep -rn "TODO\|FIXME\|placeholder" 04_packages/ 05_apps/` → brak                                |

---

## BLOK 9 — EFFECT LOG / AUDIT TRAIL

| #   | Weryfikacja                                                                   | Dowód                                     |
| --- | ----------------------------------------------------------------------------- | ----------------------------------------- |
| 9.1 | Wpis w `01_governance/EFFECT_LOG.md` dla tej zmiany                           | Sekcja z `S11.COMMIT.ID` bieżącej zmiany  |
| 9.2 | `prevHash` wskazuje na poprzedni wpis                                         | Weryfikacja sekwencji                     |
| 9.3 | Wpis zawiera: `EVENT`, `TIMESTAMP_INPUT`, `PR`, `SQUASH_SHA`, `STATUS`, `PCS` | Audyt EFFECT_LOG                          |
| 9.4 | `DEPLOYS.log` zaktualizowany dla deploy produkcyjny                           | `cat 02_protocols/effect-log/DEPLOYS.log` |

---

## BLOK 10 — SESSION START PROTOCOL (agenci AI)

Przed każdą sesją agent wykonuje:

```bash
# 1. Weryfikacja lokalizacji
git remote -v

# 2. Anchor file
head -60 AGENTS.md

# 3. Determinism test
pnpm --filter @silence/core test:determinism

# 4. Potwierdzenie
echo "SESSION START PROTOCOL COMPLETE. Poprawnie zakotwiczony w silence-core. Gotowy."
```

Brak potwierdzenia = agent nieoperacyjny w tej sesji.

---

## WERDYKT KOŃCOWY

```
[ ] BLOK 0  — Struktura repo        (7 pozycji)
[ ] BLOK 1  — RULE-DOM-001          (6 pozycji)
[ ] BLOK 2  — S11 Vocabulary        (5 pozycji)
[ ] BLOK 3  — MATHCORE φ            (6 pozycji)
[ ] BLOK 4  — Nazewnictwo           (7 pozycji)
[ ] BLOK 5  — CI Gate Set           (6 pozycji)
[ ] BLOK 6  — Deploy Vercel         (6 pozycji)
[ ] BLOK 7  — Git Compliance        (5 pozycji)
[ ] BLOK 8  — Rule of 500           (3 pozycje)
[ ] BLOK 9  — Effect Log            (4 pozycje)
[ ] BLOK 10 — Session Protocol      (4 kroki)
```

**Wszystkie BLOKI PASS → STATUS: STABLE · PCS ≥ 0.997**
Jeden FAIL → **WORLDHALT** · merge zablokowany · eskalacja do `PHI-CORE-GUARDIAN`.

---

## EFFECT LOG

```
S11.COMMIT.ID: GOVERNANCE-POST-IMPL-CHECKLIST-20260620-001
EVENT: POST_IMPL_CHECKLIST_CANONICAL_CREATION
TIMESTAMP_INPUT: 2026-06-20T17:41:00+02:00
PREV_HASH: GOVERNANCE-GITRULES-20260620-001
SCOPE: 01_governance/POST_IMPL_CHECKLIST.md
STATUS: PASS
PCS: 0.997
```
