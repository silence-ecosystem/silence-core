[PATH]: 01_governance/GITHUB_RULESET_BOOTSTRAP_silence-core.md

---

title: GITHUB_RULESET_BOOTSTRAP_silence-core
status: ACTIVE
version: 1.0
classification: CANONICAL
owner: PHI_CORE_GUARDIAN
rigor: S11_SENTINEL_ENFORCED
pcs_threshold: ">= 0.970"
failure_mode: WORLD_HALT
updated: 2026-06-13
repository: silence-ecosystem/silence-core
deployment_target: vercel-production

---

# [T] GitHub Ruleset Bootstrap — silence-core

## 1. Cel dokumentu [T]

Niniejszy dokument ustanawia minimalny, obowiązkowy bootstrap rulesetów GitHub dla publicznego repozytorium `silence-ecosystem/silence-core`.[1][2] Celem jest jednoczesne utrzymanie ochrony `main`, spójności CI, zgodności z ADR-004 oraz bezpiecznego wdrażania produkcyjnego na Vercel bez dopuszczenia logiki enterprise do publicznego runtime.[3][2]

Dokument obowiązuje jako artefakt governance dla konfiguracji repo, branch policy, required status checks i warunków deployu produkcyjnego.[4]

## 2. Zasada nadrzędna [T]

`main` w `silence-core` jest jedyną gałęzią kanoniczną dla publicznego open-core i musi pozostawać stale deployowalna.[1][2] Każda zmiana dopuszczona do `main` musi przejść komplet bramek strukturalnych, zachować granicę IP oraz pozostawać zgodna z S11 i z zakresem deployu Vercela.[3][2][5]

Gałęzie `fix/*` i `feature/*` są gałęziami krótkiego życia. Ich rola kończy się po review, squash merge lub zamknięciu bez merge; nie stanowią one długoterminowej powierzchni operacyjnej.[1]

## 3. Zakres wdrożenia [T]

Bootstrap obejmuje wyłącznie konfigurację governance i CI na poziomie GitHub dla repo `silence-core`.[1] Zakres plików objętych tym dokumentem obejmuje: `.github/workflows/*`, `.github/rulesets/*`, `.github/CODEOWNERS`, `.github/compliance.yaml` oraz ustawienia repozytorium konfigurowane w interfejsie GitHub.[1]

Bootstrap nie obejmuje zmian runtime w `04_packages/@silence/*`, `05_apps/*`, `03_ee/*`, `scripts/*` ani modyfikacji logiki domenowej.[2] Jeżeli zmiana wymaga dotknięcia tych obszarów, musi zostać wykonana w osobnym PR i oceniona przez odrębny artefakt governance.[4]

## 4. Ruleset dla main [T]

Dla gałęzi `main` należy ustanowić ruleset `main-protection` jako aktywny i blokujący.[1] Ruleset musi zawierać: wymóg pull request przed merge, minimum 1 approval, require signed commits, require linear history, block force pushes oraz block deletions.[1]

Required status checks dla `main` muszą odpowiadać realnym i utrzymywanym bramkom `silence-core`: `pnpm boundary-check`, `pnpm s11-check`, `pnpm test:determinism`, `pnpm test:vitest` oraz `pnpm typecheck`.[2] Ruleset nie może wymagać jobów, które nie są aktywnie utrzymywane lub które należą do nieprzeniesionych jeszcze domen repo, ponieważ generowałoby to fałszywe blokady merge.[1]

## 5. Ruleset dla fix/_ i feature/_ [T]

Dla wzorców `fix/*` i `feature/*` należy ustanowić lżejszy ruleset ochronny.[1] Minimalny zestaw wymagań dla tych gałęzi to block force pushes, block deletions oraz opcjonalnie require signed commits, przy zachowaniu krótkiego czasu życia branchy zgodnie z trunk-based workflow.[1]

Nie należy wymuszać na branchach roboczych cięższego reżimu niż na `main`, jeżeli nie służy to bezpośrednio jakości merge do gałęzi kanonicznej.[1] Priorytetem jest twarda ochrona wejścia do `main`, a nie długotrwała konserwacja gałęzi pośrednich.[1]

## 6. Required CI gate set [T]

Minimalny i obowiązkowy zestaw gate'ów dla `silence-core` musi odzwierciedlać stan lokalnie zweryfikowany i zgodny z `SILENCE_STRUCT_v2_0`.[2] Obowiązkowe bramki to:

- `boundary-check` — brak importów `04_packages <- 03_ee` oraz `05_apps <- 03_ee`.[2]
- `s11-check` — brak naruszeń S11 w kodzie, komentarzach, dokumentacji i stringach systemowych.[5]
- `test:determinism` — utrzymanie właściwości deterministycznych rdzenia i testów kontraktowych.[2]
- `test:vitest` — podstawowy zestaw testów wykonawczych dla open-core.[2]
- `typecheck` — pełna zgodność TypeScript dla workspace.[2]

Joby spoza tego zestawu, takie jak pełny monorepo build, eksport statyczny Garden, natywna równoważność engine lub inne nieskalibrowane pipeline'y, nie mogą być required checks, dopóki nie zostaną jawnie zmapowane do aktualnego repo `silence-core`.[1]

## 7. Vercel production gate [T]

Repo `silence-core` jest przygotowywane do aktywnego wdrażania produkcyjnego na Vercel, dlatego rulesety i workflowy muszą być powiązane z realnym gate'em deployowym.[3] Deploy produkcyjny może być uruchamiany wyłącznie z `main` po przejściu całego required CI gate setu i po potwierdzeniu, że `.vercelignore` oraz `vercel.json` nie otwierają ścieżki do domen niepublicznych.[3][2]

Z zakresu uploadu i build scope Vercela muszą pozostać wykluczone co najmniej: `03_ee/`, `07_archive/`, `01_governance/`, `02_protocols/`, `docs/` i `design/`.[2] Produkcyjny deploy Vercela musi być traktowany jako końcowy etap po PASS wszystkich bramek, nie jako substytut walidacji repo.[3][2]

## 8. GitHub Actions security baseline [T]

Każdy workflow modyfikowany lub tworzony w ramach bootstrapu musi stosować pełne SHA pinning dla `uses:` zamiast tagów wersji.[1] Workflowy muszą używać minimalnych uprawnień, z domyślnym `read-all` i eskalacją tylko per-job tam, gdzie jest to konieczne.[1]

Zakazane jest używanie `pull_request_target` bez odrębnego audytu bezpieczeństwa oraz interpolowanie sekretów bezpośrednio w `run`.[1] Sekrety mają być przekazywane wyłącznie przez `env` i muszą pozostawać odseparowane od przestrzeni bundle'u przeglądarkowego i od konfiguracji Vercel public runtime.[1][3]

## 9. Ochrona IP i ADR-004 [T]

Bootstrap rulesetów i CI nie może rozmywać Żelaznej Granicy pomiędzy open-core a enterprise.[2] `silence-core` pozostaje repo publicznym MIT i nie może zawierać wykonawczej logiki predykcyjnej, high-risk, proprietary scoringu, billingu enterprise ani clean-room assets.[2]

Wszystkie workflowy, required checks i reguły review muszą wspierać wykrywanie naruszeń `RULE-DOM-001`, a nie obchodzić je przez wyjątki infrastrukturalne.[2][4] Jeśli jakaś bramka jest niezgodna z aktualną topologią repo, należy ją wyłączyć jako required check i zastąpić poprawną, a nie osłabiać kontrolę granic IP.[2]

## 10. Instrukcja wykonawcza dla małego PR [T]

Należy utworzyć osobny, mały PR wyłącznie dla bootstrapu rulesetów i workflowów, bez zmian runtime.[1] Rekomendowana nazwa brancha: `fix/ci-align-silence-core`.[1]

PR musi zawierać tylko zmiany w `.github/workflows/*`, `.github/rulesets/*`, `.github/CODEOWNERS`, `.github/compliance.yaml` oraz, jeśli wymagane przez repo, drobne korekty ustawień konfiguracyjnych w dokumentach opisujących same workflowy.[1] Tytuł PR powinien brzmieć: `fix: align rulesets and CI with silence-core gates`.[1]

W opisie PR należy jawnie wskazać, że jest to zmiana CI-only, bez zmian runtime i bez wpływu na logikę domenową, oraz że jej celem jest usunięcie fałszywie czerwonych checków i dopasowanie GitHub Actions do rzeczywistego gate setu `silence-core`.[1][2]

## 11. Checklista PASS/FAIL [T]

- [x] Jawna ścieżka `[PATH]` obecna.[4]
- [x] Repo docelowe wskazane jako `silence-ecosystem/silence-core`.[1]
- [x] `main` opisany jako gałąź kanoniczna.[1][2]
- [x] Ruleset `main-protection` opisany jawnie.[1]
- [x] Ruleset dla `fix/*` i `feature/*` opisany jawnie.[1]
- [x] Required CI gate set zmapowany do realnych bramek repo.[2]
- [x] Vercel production gate opisany jako etap po PASS wszystkich bramek.[3][2]
- [x] SHA pinning i minimalne uprawnienia GitHub Actions ujęte.[1]
- [x] ADR-004 i `RULE-DOM-001` zachowane.[2]
- [x] Zakres małego PR ograniczony do `.github/*` i konfiguracji CI.[1]
- [x] Brak placeholderów i TODO.[4]
- [x] Domknięcie semantyczne zachowane.[4]

## 12. EffectLog binding [T]

Wdrożenie tego dokumentu jako aktywnego artefaktu governance wymaga dodania kolejnego wpisu do `01_governance/EFFECTLOG.md`.[2] Wpis musi zawierać co najmniej: identyfikator zdarzenia, commit ustanawiający dokument, ścieżkę pliku, hash SHA-256 dokumentu oraz referencję do PR bootstrapującego rulesety i workflowy.[2]
