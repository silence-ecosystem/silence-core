PATH: /home/ewa/silence/AGENTS.md
VERSION: 1.0
STATUS: ACTIVE
PCSSTATUS: 1.000
SSOT: true
S11.COMMIT.ID: AGENTS-MONOREPO-PROTOCOL-20260625-001
PREVHASH: INIT-AGENTS-MONOREPO-000

# AGENTS.md — SILENCE MONOREPO ROOT

## 1. MANDATE

Ten plik jest kanonicznym kontraktem operacyjnym dla całego monorepo SILENCE i obowiązuje każdego operatora lokalnego oraz każdego agenta wykonawczego działającego w ścieżce `/home/ewa/silence`. Projektowanie struktur plików, folderów, przepływu wiedzy i automatyzacji odbywa się w trybie bezwzględnym, bez wyjątków, z naciskiem na dalekowzroczność, prostotę, Single Source of Truth i pełną odwracalność decyzji architektonicznych przez jawne ADR. [1][2]

Zgodnie z dokumentami KANON NAZEWNICTWA oraz git-workflow-and-versioning.md, obowiązują następujące zasady:

Gałęzie (Branches): Wyłącznie małe litery, format kebab-case, max 50 znaków. Przykłady: feat/phi-engine, fix/issue-description.

Commity: Format <type>: <description>, gdzie typ to: feat, fix, refactor, test, docs, chore.

Tagi: Wersjonowanie SemVer: v<major>.<minor>.<patch> (np. v1.0.0). Wszystkie tagi wydawnicze v\* podlegają zasadzie Immutable Releases i są chronione przed force-push.

High-Risk AI: Każdy commit/PR modyfikujący pakiety wysokiego ryzyka (np. @silence/safety, @silence/intervention-timing) musi zawierać tag [HIGH-RISK-AI] w pierwszej linii.

2. Konfiguracja i zabezpieczenia repozytorium (GitHub Rulesets)

Zamiast klasycznej ochrony branchy, system wymusza stosowanie GitHub Rulesets. Kluczowe parametry:

Merge Policy: Blokada merge commits. Dozwolone wyłącznie Squash merge lub Rebase.

Ochrona gałęzi main: Wymagany Pull Request, minimum 1 zatwierdzenie (approval), podpisane commity (signed commits), liniowa historia oraz blokada force-push.

Automatyzacja: Wymagane automatyczne usuwanie gałęzi po merge'u (Automatically delete head branches).

3. Konfiguracja CI/CD (GitHub Actions)

Dokumentacja techniczna wdrożenia (np. VERCEL_DEPLOYMENT_GUIDE) narzuca specyficzne parametry operacyjne:

Fetch-Depth: W workflowach należy ustawić fetch-depth: 2 (umożliwia to Turborepo poprawną detekcję zmian i działanie turbo-ignore).

SHA Pinning: Bezwzględny wymóg używania pełnych skrótów SHA-256 dla akcji (uses: actions/checkout@SHA...) zamiast tagów wersji.

Uprawnienia: Domyślnie permissions: read-all, eskalowane per-job tylko gdy niezbędne.

Sekrety: Przekazywane wyłącznie przez env:, zakaz interpolacji bezpośrednio w sekcji run:.

Lokalna konfiguracja i struktura. Zgodnie z Session Start Protocol, lokalne środowisko pracy dewelopera (ewa) powinno być zakotwiczone w:

Ścieżka lokalna: /home/ewa/silence. tutaj tworzysz zmiane i uruchamiasz lokalne komendy walidacyjne i dopiero wtedy przygotowujesz commit do GitHub https://github.com/silence-ecosystem/silence-core

Dla tego repo kluczowe komendy przed wypchnięciem zmian to pnpm install --frozen-lockfile, pnpm boundary-check, pnpm s11-check, pnpm typecheck, a następnie build i test tylko dla zakresu zmienionego względem origin/main...HEAD przez turbo run ... --filter=...[origin/main...HEAD].

To oznacza, że GitHub nie jest tu miejscem „sprawdzimy po merge’u”, tylko etapem, do którego trafia już kod po przejściu lokalnych gate’ów. ustawienia Git są rygorystycznie zdefiniowane w celu zapewnienia determinizmu, bezpieczeństwa łańcucha dostaw oraz sterylności językowej S11. istotne są konkretne nazwy i ścieżki, bo one same są częścią kontraktu operacyjnego. Najważniejsze z nich to: main jako domyślna gałąź Git, Silence-ecosystem jako nazwa organizacji i użytkownika Git, globalnetworkstudio@gmail.com jako mail Git, 03_ee, 04_packages/@silence/_, 05_apps/_ jako główne domeny repo, silencesdk jako jedyny publiczny entrypoint dla aplikacji oraz pnpm, turbo, dependency-cruiser, s11-check, turbo-ignore i vercel.json jako podstawowe narzędzia i pliki pipeline’u.

## 2. ROOT SCOPE

Ścieżka lokalna: /home/ewa/silence. tutaj tworzysz zmiane i uruchamiasz lokalne komendy walidacyjne i dopiero wtedy przygotowujesz commit do GitHub https://github.com/silence-ecosystem/silence-core

Dla tego repo kluczowe komendy przed wypchnięciem zmian to pnpm install --frozen-lockfile, pnpm boundary-check, pnpm s11-check, pnpm typecheck, a następnie build i test tylko dla zakresu zmienionego względem origin/main...HEAD przez turbo run ... --filter=...[origin/main...HEAD].

To oznacza, że GitHub nie jest tu miejscem „sprawdzimy po merge’u”, tylko etapem, do którego trafia już kod po przejściu lokalnych gate’ów. ustawienia Git są rygorystycznie zdefiniowane w celu zapewnienia determinizmu, bezpieczeństwa łańcucha dostaw oraz sterylności językowej S11. istotne są konkretne nazwy i ścieżki, bo one same są częścią kontraktu operacyjnego. Najważniejsze z nich to: main jako domyślna gałąź Git, Silence-ecosystem jako nazwa organizacji i użytkownika Git, globalnetworkstudio@gmail.com jako mail Git, 03*ee, 04_packages/@silence/*, 05*apps/* jako główne domeny repo, silencesdk jako jedyny publiczny entrypoint dla aplikacji oraz pnpm, turbo, dependency-cruiser, s11-check, turbo-ignore i vercel.json jako podstawowe narzędzia i pliki pipeline’u.

Dozwolony zakres zapisu obejmuje wyłącznie aktywne domeny repo i pliki jawnie dopuszczone przez kontrakt. Strefy `03_ee/` są no-touch dla tej persony, `05_apps/` są no-write, a `pnpm-lock.yaml` pozostaje nienaruszalny poza przypadkiem jawnej decyzji właściciela repo i pełnej walidacji `--frozen-lockfile`. [2]

Dozwolone domeny robocze:

- `01_governance/`
- `02_protocols/`
- `04_packages/`
- `06_infrastructure/`
- `.github/`
- `scripts/`
- `tasks/`
- root config files bez naruszenia boundary rules

## 3. PLAN FIRST

Zanim powstanie nowy folder, nowa struktura lub nowy workflow, operator kończy pełny tryb planowania. Nie ma skrótów. Nie ma wdrożenia bez analizy celu systemu, typów treści, przepływu wiedzy, SSoT, lifecycle dokumentu, modelu metadata, punktów integracji i wpływu skali 10x. [1]

Każda zmiana architektoniczna przechodzi sekwencję `INITIATE → DEFINE → EXECUTE → VALIDATE → COMMIT → STABILIZE`. Brak pełnej sekwencji oznacza `STATE_VIOLATION`. [1]

## 4. FOLDER LAW

Każdy folder ma jedno jasne przeznaczenie. Zakazane są foldery `misc`, `other`, `temp`, `new`, `final-final`, `backup` bez jawnej polityki TTL i właściciela. Każda nowa jednostka struktury musi mieć nazwę, odpowiedzialność, lifecycle i powód istnienia. [1]

Reguła głębokości: normalna praca nie przekracza 4 poziomów hierarchii. Głębiej wolno wejść wyłącznie dla silnie uzasadnionych podsystemów z ADR. [1]

## 5. KNOWLEDGE FLOW

Model przepływu wiedzy jest obowiązkowy i jednokierunkowy: wejście surowe trafia do inbox, materiał jest klasyfikowany i wzbogacany metadata, stan roboczy trafia do właściwej domeny, stan kanoniczny istnieje wyłącznie jako SSoT, a stan wygaszony przechodzi do deprecation i archive zgodnie z lifecycle. [1]

Agent AI nigdy nie zapisuje bezpośrednio do struktury kanonicznej. Agent zapisuje wyłącznie do inbox lub draft zone i oznacza wynik jako wymagający przeglądu człowieka. [1]

## 6. SINGLE SOURCE OF TRUTH

Jeden fakt istnieje w jednym miejscu. Referencje wskazują na źródło, a nie kopiują treści. Duplikacja treści, równoległe wersje dokumentów i niejawne rozgałęzienia statusu są traktowane jako dług architektoniczny wiedzy. [1]

Jeżeli dwa pliki opisują ten sam kontrakt, jeden z nich musi zostać oznaczony jako wtórny, zdeprecjonowany lub scalony do SSoT. [1]

## 7. NAMING CANON

Gałęzie: małe litery, kebab-case, max 50 znaków. Format preferowany: `feat/*`, `fix/*`, `refactor/*`, `chore/*`, `docs/*`, `test/*`. Commity mają format `<type>: <description>`, gdzie dozwolone typy to `feat`, `fix`, `refactor`, `test`, `docs`, `chore`. Tagi wydawnicze używają SemVer `v<major>.<minor>.<patch>` i są objęte immutable release policy. [2]

## 8. S11 LANGUAGE LOCK

Język operacyjny pozostaje strukturalny. Zakazane są terminy kliniczne, terapeutyczne i wellness w commitach, branchach, PR, logach operacyjnych i dokumentacji egzekucyjnej. Obowiązuje słownik S11 oraz kontrola pre-commit i CI. [2]

Preferowane terminy operacyjne: `TENSION_SCORE`, `SIGNAL_NOISE`, `STATE_VIOLATION`, `SIGNAL_PURITY`, `RITUAL_STATE`, `DETERMINISTIC_FLOW`. [2]

## 9. MATH CORE

Wszystkie parametry czasu i heartbeatów muszą mieć jawną derywację z `PHI = 1.6180339887` i `GOLDENSECOND = 1618 ms`. Kanoniczne wartości operacyjne: `VALIDATION_WINDOW = 618 ms`, `STABILITY_HEARTBEAT = 2618 ms`, `COHERENCE_TIMEOUT = 6854 ms`, `UI_GRID_GUTTER = 13 px`, `UI_SIDEBAR_WIDTH = 38.2%`, `CONTENT_MAIN_WIDTH = 61.8%`. Magic numbers bez derywacji są zakazane. [1]

## 10. RULE-DOM-001

Granica IP jest nienaruszalna: `04_packages/` nie importuje `03_ee/`, `05_apps/` nie importuje `03_ee/`, kod produkcyjny nie importuje `07_archive/`, publiczny kanał kontraktowy to `@silence/contracts`, a aplikacje korzystają z `@silence/sdk` jako jedynego publicznego entrypointu. Naruszenie granicy = `WORLDHALT`. [2]

## 11. AI AGENT CONTRACT

Każdy agent działa wg jawnego kontraktu: `reads_from`, `writes_to`, `requires_approval: true`, `fallback`. Agent nie ma prawa nadpisywać struktur kanonicznych, rulesetów, hash-chain ani wpisów audit trail. [1]

## 12. LIFECYCLE

Każdy plik i artefakt ma jawny status: `draft`, `review`, `active`, `deprecated`, `archive`. Brak statusu oznacza `draft`. Dokument zdeprecjonowany musi wskazywać następcę lub powód wygaszenia. [1]

## 13. REQUIRED ROOT FILES

Root repo utrzymuje minimalny zestaw plików kotwicznych: `README.md`, `LICENSE`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `.github/CODEOWNERS`, `.github/compliance.yaml`, `AGENTS.md`, `package.json`, `turbo.json`. Brak któregoś z plików kotwicznych wymaga remediacji przed dalszą rozbudową. [2]

## 14. GITHUB HARDENING

Workflowy GitHub Actions muszą spełniać zasady: pełne SHA pinning dla `uses:`, `permissions: read-all` domyślnie z eskalacją per-job, sekrety tylko przez `env:`, brak nieaudytowanego `pull_request_target`, rulesets zamiast legacy branch protection, ochrona tagów wydawniczych, liniowa historia, tylko squash merge lub rebase, automatyczne usuwanie gałęzi po merge i signed commits na `main`. [2][3]
Gałęzie (Branches): Wyłącznie małe litery, format kebab-case, max 50 znaków. Przykłady: feat/phi-engine, fix/issue-description.

Commity: Format <type>: <description>, gdzie typ to: feat, fix, refactor, test, docs, chore.

Tagi: Wersjonowanie SemVer: v<major>.<minor>.<patch> (np. v1.0.0). Wszystkie tagi wydawnicze v\* podlegają zasadzie Immutable Releases i są chronione przed force-push.

High-Risk AI: Każdy commit/PR modyfikujący pakiety wysokiego ryzyka (np. @silence/safety, @silence/intervention-timing) musi zawierać tag [HIGH-RISK-AI] w pierwszej linii.
Merge Policy: Blokada merge commits. Dozwolone wyłącznie Squash merge lub Rebase.

Ochrona gałęzi main: Wymagany Pull Request, minimum 1 zatwierdzenie (approval), podpisane commity (signed commits), liniowa historia oraz blokada force-push.

Automatyzacja: Wymagane automatyczne usuwanie gałęzi po merge'u (Automatically delete head branches).

Konfiguracja CI/CD (GitHub Actions)

Dokumentacja techniczna wdrożenia (np. VERCEL_DEPLOYMENT_GUIDE) narzuca specyficzne parametry operacyjne:

Fetch-Depth: W workflowach należy ustawić fetch-depth: 2 (umożliwia to Turborepo poprawną detekcję zmian i działanie turbo-ignore).

SHA Pinning: Bezwzględny wymóg używania pełnych skrótów SHA-256 dla akcji (uses: actions/checkout@SHA...) zamiast tagów wersji.

Uprawnienia: Domyślnie permissions: read-all, eskalowane per-job tylko gdy niezbędne.

Sekrety: Przekazywane wyłącznie przez env:, zakaz interpolacji bezpośrednio w sekcji run:.

## 15. LOCAL VALIDATION

Kolejność walidacji lokalnej jest nienaruszalna:

```bash
cd /home/ewa/silence
pnpm install --frozen-lockfile
pnpm boundary-check
pnpm s11-check
pnpm typecheck
pnpm build --filter=...[origin/main...HEAD]
pnpm test --filter=...[origin/main...HEAD]
```

Dla zakresów infrastrukturalnych dopuszczalne są dodatkowe checki YAML, policy scan i boundary scripts, ale nie zastępują one bram kanonicznych. [2]

## 16. CHECKS BEFORE WRITE

Przed każdym zapisem operator odpowiada na sześć pytań kontrolnych: czy każdy folder ma jedno przeznaczenie, czy nie ma duplikacji odpowiedzialności, czy struktura obsługuje pełny zakres diagnozy, czy lessons loop jest aktywna, czy nowa osoba zrozumie system w mniej niż 10 minut i czy struktura skaluje się 10x bez refaktoryzacji. Jedna odpowiedź `nie` oznacza powrót do planowania. [1]

## 17. TASKS LOOP

Repo utrzymuje aktywną pętlę samodoskonalenia: `tasks/lessons.md`, `tasks/decisions.md` i `tasks/metrics.md`. Każdy problem źródłowy kończy się zasadą zapisaną w lessons lub decyzją zapisaną w ADR. [1]

## 18. METRICS

Minimalne metryki zdrowia ekosystemu: komplet metadata ≥ 95%, status plików 100%, TTL inbox < 24h, aktywne linki wewnętrzne ≥ 99%, pliki poza właściwym folderem = 0, aktualność ADR < 30 dni od ostatniego wpisu, onboarding nowej osoby < 10 min. Alert aktywuje review architektury. [1]

## 19. ZERO FRAGMENT POLICY

Zakazane są `TODO`, placeholdery, niekompletne sekcje, pliki robocze bez statusu, katalogi tymczasowe bez TTL oraz dokumenty bez właściciela lub bez funkcji. Każdy plik dostarczany przez operatora musi być kompletny i gotowy do walidacji. [1]

## 20. EFFECTLOG

Każda istotna zmiana generuje wpis append-only z polami:

```text
ENTRY: <numer>
TASK_ID: <id>
S11.COMMIT.ID: <id>
STATUS: PASS | PARTIAL | BLOCKED
PATHS: <lista>
PREV_HASH: <sha256>
ENTRY_HASH: <sha256>
SUMMARY: <opis>
```

Nadpisanie `prevHash` jest zakazane. Brak wpisu = brak zmiany operacyjnej. [1]

---

## AGENTS — DEFINICJA ROLI

Agenty to logiczne role funkcjonalne w systemie, nie konkretne implementacje.
Każdy agent może być realizowany jako:

- Skrypt CI (`boundary-check.sh`, `s11-check.sh`)
- Agent Claude (na bazie `CLAUDE.md`)
- Proces zautomatyzowany (typecheck, lint, build)

**RULE:** Implementacja agenta nie zmienia jego logicznej roli ani kontraktu.

---

## AGENTS — TERMINOLOGY

**WORLDHALT**: Stan całkowitego blokowania zmian. Równoważne:
- `git push` zablokowany przez CI gate
- PR nie może być mergowany
- Zmiana musi być wycofana ALBO przywrócona do compliance
- Wymaga ręcznej eskalacji do governance team

**Tier**: Priorytet agenta
- **T0** — Runtime execution (zero access to governance)
- **T1** — Strategic gates (full governance access for gating decisions)
- **T2** — Operational execution (read-only access to contracts)

**Layer (L0-L3)**: Dostęp do danych
- **L0** — TIMING_WINDOW, JITAI kernel, φ-events (core logic, top secret)
- **L1** — BEHAVIORAL_CLUSTER, signal processing (semi-sensitive)
- **L2** — SIGNAL_VECTOR, aggregate metrics (operational)
- **L3** — PCS, AUDIT_TRAIL, governance (governance-only)

## 21. KIMI LOCAL ACTIVATION

Docelowa ścieżka kontraktu operatora:

```text
/home/ewa/silence/AGENTS.md
```

Minimalna aktywacja Kimi lokalnie:

```bash
cd /home/ewa/silence
kimi --cwd /home/ewa/silence --system-file /home/ewa/silence/AGENTS.md
```

Jeżeli wrapper nie wspiera `--system-file`, użyj:

```bash
cd /home/ewa/silence
kimi "Pracuj wyłącznie wg /home/ewa/silence/AGENTS.md. Najpierw wykonaj: pnpm boundary-check && pnpm s11-check && pnpm typecheck. Nie zapisuj nic przy FAIL dowolnej bramy."
```

Check-only prompt:

```text
Pracuj wyłącznie w /home/ewa/silence. Użyj /home/ewa/silence/AGENTS.md jako jedynego kontraktu operacyjnego. Wykonaj kolejno: pnpm boundary-check, pnpm s11-check, pnpm typecheck. Zwróć tylko STATUS, PASS/FAIL i minimalny plan remediacji. Bez zapisu plików.
```

Ścieżka lokalna: /home/ewa/silence. tutaj tworzysz zmiane i uruchamiasz lokalne komendy walidacyjne i dopiero wtedy przygotowujesz commit do GitHub

https://github.com/silence-ecosystem/silence-core

Dla tego repo kluczowe komendy przed wypchnięciem zmian to pnpm install --frozen-lockfile, pnpm boundary-check, pnpm s11-check, pnpm typecheck, a następnie build i test tylko dla zakresu zmienionego względem origin/main...HEAD przez turbo run ... --filter=...[origin/main...HEAD].

To oznacza, że GitHub nie jest tu miejscem „sprawdzimy po merge’u”, tylko etapem, do którego trafia już kod po przejściu lokalnych gate’ów. ustawienia Git są rygorystycznie zdefiniowane w celu zapewnienia determinizmu, bezpieczeństwa łańcucha dostaw oraz sterylności językowej S11. istotne są konkretne nazwy i ścieżki, bo one same są częścią kontraktu operacyjnego. Najważniejsze z nich to: main jako domyślna gałąź Git, Silence-ecosystem jako nazwa organizacji i użytkownika Git, globalnetworkstudio@gmail.com jako mail Git, 03*ee, 04_packages/@silence/*, 05*apps/* jako główne domeny repo, silencesdk jako jedyny publiczny entrypoint dla aplikacji oraz pnpm, turbo, dependency-cruiser, s11-check, turbo-ignore i vercel.json jako podstawowe narzędzia i pliki pipeline’u.

deploy URL: https://github.com/silence-ecosystem/silence-core

## 22. FINAL CHECKLIST

Przed zakończeniem pracy operator potwierdza: PATH jest jawny, SSoT jest jednoznaczny, brak duplikacji funkcji, brak naruszeń S11, brak naruszeń RULE-DOM-001, wszystkie timeouty mają derywację MATH CORE, wszystkie workflowy używają SHA pinning, wszystkie sekrety przechodzą przez `env:`, brak TODO i plik `AGENTS.md` mieści się w limicie 300 linii. PASS wszystkich punktów = artefakt gotowy do wklejenia 1:1. [1][2][3]
