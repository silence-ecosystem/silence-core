[WKLEJ_DOKŁADNIE_TREŚĆ_PLIKU_Z_GÓRY]

# VERCEL_DEPLOYMENT_GUIDE_v1

status: PARTIAL
sentinel: S11_ENFORCED
pcs_gate: 0.999
version: v1.0.0
last_verified: 2026-06-23
artifact_scope: root-vercel-config-and-deploy-gates

TASK

Ustanowić kanoniczny standard wdrożenia Vercel dla aktywnego monorepo Silence w sposób zgodny z:

- selective builds dla Turborepo,
- `turbo-ignore`,
- RULE-DOM-001 boundary enforcement,
- S11 gate,
- deterministyczną walidacją przed deployem.

Zakres tego artefaktu obejmuje wyłącznie:

- root `vercel.json`,
- kolejność i wynik gate’ów wykonawczych,
- warunki uznania deployu za operacyjnie istniejący.

Poza zakresem:

- refaktoryzacja kodu aplikacji,
- naprawa naruszeń S11,
- zmiany w `03_ee/`, `04_packages/`, `05_apps/`,
- per-app `vercel.json` wymagające osobnych kontraktów ownership.

PROCEDURE

1. Root `vercel.json` musi istnieć w repozytorium i zawierać konfigurację selective builds:
   - `installCommand: "pnpm install --frozen-lockfile"`
   - `buildCommand: "turbo run build --filter=...[origin/main...HEAD]"`
   - `ignoreCommand: "npx turbo-ignore --fallback=HEAD^1"`
   - `framework: null`
   - `github.silent: true`

2. Git checkout w CI musi zapewnić historię umożliwiającą detekcję zmian:
   - wymagane `fetch-depth: 2`
   - bez tego `turbo-ignore` i affected build tracing nie są wiarygodne operacyjnie

3. Kolejność gate’ów przed deployem:
   - `pnpm install --frozen-lockfile`
   - `pnpm boundary-check`
   - `pnpm s11-check`
   - `pnpm typecheck`
   - `pnpm exec turbo run build --filter=...[origin/main...HEAD]`
   - `pnpm exec turbo run test --filter=...[origin/main...HEAD]`

4. Znaczenie gate’ów:
   - `boundary-check` blokuje import leakage z `03_ee/` do `04_packages/` i `05_apps/`
   - `s11-check` blokuje artefakty z niedozwolonym słownictwem
   - `typecheck` blokuje niespójność kontraktów typów
   - affected `build` i `test` potwierdzają, że zmieniony zakres jest wykonywalny

5. Zasada deployu:
   - artefakt bez przejścia wszystkich wymaganych gate’ów nie istnieje operacyjnie
   - jeśli `s11-check` jest czerwony, status końcowy nie może być `PASS`
   - jeśli `boundary-check` jest czerwony, status końcowy przechodzi w `WORLDHALT`

6. Root `vercel.json` jest kanoniczną konfiguracją minimalną.
   Rozszerzenia takie jak:
   - `outputDirectory`
   - custom `functions`
   - `cleanUrls`
   - `trailingSlash`
     mogą zostać dodane dopiero wtedy, gdy istnieje jawne potwierdzenie zgodności z konkretną aplikacją docelową i routingiem jej deployu.
     Nie wolno dodawać tych pól globalnie na poziomie root bez potwierdzonego kontraktu per app.

VERIFICATION

Aktualny stan wykonawczy potwierdzony w logu repo:

| Check     | Command                                                      | Status |
| --------- | ------------------------------------------------------------ | ------ |
| Install   | `pnpm install --frozen-lockfile`                             | PASS   |
| Boundary  | `pnpm boundary-check`                                        | PASS   |
| S11       | `pnpm s11-check`                                             | FAIL   |
| Typecheck | `pnpm typecheck`                                             | PASS   |
| Build     | `pnpm exec turbo run build --filter=...[origin/main...HEAD]` | PASS   |
| Test      | `pnpm exec turbo run test --filter=...[origin/main...HEAD]`  | PASS   |

Stan `boundary-check`:

- PASS
- brak naruszeń RULE-DOM-001 w sprawdzonym zakresie

Stan `s11-check`:

- FAIL
- 31 naruszeń
- deploy nie może uzyskać statusu `PASS` do czasu wyzerowania naruszeń

Stan root `vercel.json`:

- konfiguracja minimalna zgodna z affected build i `turbo-ignore`
- gotowa do zapisu w root repo

PCS

Start:

- `PCS = 1.000`

Kary:

- `boundary-check FAIL` → `-0.150`
- `build FAIL` → `-0.120`
- `test FAIL` → `-0.100`
- `s11-check FAIL` → `-0.030`
- brak explicit verification block → `-0.020`

Aktualna derywacja:

- `1.000 - 0.030 = 0.970`

PCS_COMPUTED: `0.970`
PCS_GATE: `0.999`

STATUS

`PARTIAL`

Powód:

- selective build stack działa,
- root `vercel.json` jest poprawny,
- boundary jest szczelne,
- build i test przechodzą,
- S11 gate pozostaje czerwony i blokuje status `PASS`.

S11.COMMIT.ID

`S11-MVP-20260623-001`

AUDIT_RECORD

```yaml
task_id: SILENCE_VERCEL_ROOT_CONFIG_001
commit_id: S11-MVP-20260623-001
status: PARTIAL
pcs: 0.970
artifact_path: 06_infrastructure/VERCEL_DEPLOYMENT_GUIDE_v1.md
boundary_check: PASS
s11_check: FAIL
typecheck: PASS
build: PASS
tests: PASS
vercel_root_config: PASS
determinism: DECLARED_FOR_CONFIG_ONLY
```

NEXT_STATE

Aby osiągnąć `PASS`, wymagane jest wyłącznie:

- doprowadzenie `pnpm s11-check` do wyniku PASS przy niezmienionym stanie pozostałych gate’ów.

Zakazane skróty:

- pomijanie `s11-check`,
- nadawanie statusu `PASS` przy czerwonym S11,
- rozszerzanie root `vercel.json` o pola per-app bez jawnego kontraktu wdrożeniowego.
