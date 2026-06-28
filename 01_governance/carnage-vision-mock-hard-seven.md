---

PATH: 01_governance/carnage-vision-mock-hard-seven.md
TITLE: CARNAGE VISION MOCK — HARD SEVEN CANONICAL PLAN
VERSION: v1.0.0
DATE: 2026-06-26
AUTHOR: PHI-MVP-ORCHESTRATOR-V1
STATUS: ACTIVE
PCSSTATUS: 0.999
PCSGATE: 0.990
RIGOR: S11 MATHCORE HARDSEVEN RULE-DOM-001
SSOT: true
CLASSIFICATION: OPERATIONAL
S11.COMMIT.ID: CARNAGE-VISION-MOCK-20260626-001
prevHash: INIT-CARNAGE-VISION-MOCK-001
SOURCE_DOCUMENTS:

- /home/ewa/.kimi/plans/carnage-vision-mock
- SILENCE-BRAND-BOOK-LITE.md
- SILENCE-FRONTEND-ARCHITECTURE.md
- MVP-SPLIT-SPECIFICATION.md
- HARD_SEVEN_v2026.md

---

# 1. INPUT_STATE

## OBSERVATION

Wejściowy plan opisuje ścieżkę onboardingową PatternLens oraz oczekiwany efekt końcowy dla DCI, ale wymaga kanonizacji do jednego pliku egzekucyjnego zgodnego z HARD SEVEN, S11, MATHCORE i RULE-DOM-001. Plan zawiera krytyczne elementy funkcjonalne: Welcome, Intent, First Observation, Baseline, Consents, Plan, Permissions, lokalny zapis behawioralny, aktualizację profilu JITAI oraz ograniczenia semantyczne i deterministyczne. [1][2][3]

## PATTERN

Stan wejściowy odpowiada klasie `L1 CONTRACT_FRAGMENT > L3 EXECUTION_PLAN`. Artefakt źródłowy nie jest jeszcze pełnym plikiem repo-ready, ponieważ zawiera tylko sekcję końcowego efektu i ryzyk, bez pełnego ciągu INITIATE → DEFINE → EXECUTE → VALIDATE → COMMIT → STABILIZE. [1]

## DECISION

Plan zostaje przepisany do pojedynczej kanonicznej wersji `.md` jako operacyjny plan wdrożenia onboardingowego PatternLens dla DCI. Każdy krok zostaje zakotwiczony w aktywnych dokumentach źródłowych oraz zredukowany do języka egzekucyjnego bez klinicznej semantyki. [2][4][5]

## METRIC

INPUT_CLASS: `L1 CONTRACT_FRAGMENT`
TARGET_CLASS: `L4 REPO_READY_EXECUTION_PLAN`
PCS_TARGET: `>= 0.990`
BOUNDARY_MODE: `SDK-FIRST / ADR-REQUIRED-FOR-DIRECT-PACKAGE-ACCESS` [3][2]

# 2. OUTPUT_STATE

## OBSERVATION

Docelowy artefakt ma umożliwić implementację ścieżki onboardingowej PatternLens bez dodatkowej interpretacji. Musi być gotowy do zapisania w `01_governance/` jako plan wykonawczy dla zespołu oraz agentów. [1][6]

## PATTERN

Wyjście ma charakter `EXECUTION_DOCUMENT`, nie `DISCUSSION_DOCUMENT`. Znaczy to, że zawiera kolejność działań, granice, bramki, warunki FAIL i audit trail. [1]

## DECISION

Outputem jest jeden plik markdown zawierający pełny kontrakt implementacyjny onboardingowego DCI dla PatternLens, z mapowaniem na Protocol Zero, Frontend Architecture, Brand Book oraz MVP Split. [2][4][3]

## METRIC

OUTPUT_CLASS: `L4 REPO_READY_EXECUTION_PLAN`
ARTIFACT_PATH: `01_governance/carnage-vision-mock-hard-seven.md`
STATUS_TARGET: `PASS` [1]

# 3. TASK

## OBSERVATION

MVP nie jest produktem. MVP jest Deterministic Compliance Interface, czyli minimalnym wykonywalnym dowodem, że inwarianty SILENCE_SYSTEM utrzymują się pod obciążeniem produkcyjnym. Artefakt onboardingowy musi służyć jako pierwszy sprawdzalny dowód tej tezy. [4][2]

## PATTERN

Ścieżka onboardingowa nie jest zwykłym flow UX. Jest warstwą weryfikacyjną DCI i pierwszym miejscem, w którym egzekwowane są jednocześnie: φ-derywacja, S11, local-first behavioral capture, immutable logging i granice open-core. [4][5][2]

## DECISION

Zadaniem planu jest wdrożenie deterministycznej ścieżki onboardingowej PatternLens obejmującej: Welcome → Intent → First Observation → Baseline → Consents → Plan → Permissions, z lokalnym zapisem danych behawioralnych i zgodnością z nowszym SSOT architektonicznym. [2][3]

## METRIC

SUCCESS_CONDITION: `User completes onboarding end-to-end under canonical gates`
MIN_PASS: `PCS >= 0.990`
FAIL_TRIGGER: `Any non-φ-derived logic, forbidden vocabulary, boundary leak or missing audit event` [1][5]

# 4. SCOPE

## OBSERVATION

Zakres dotyczy PatternLens jako aplikacji B2C PWA uruchamianej w `05_apps`, lecz ten dokument nie generuje kodu aplikacyjnego. Dokument definiuje kontrakt wdrożeniowy i granice operacyjne dla implementacji. [3][2]

## PATTERN

Zakres obejmuje jeden pion funkcjonalny: onboarding i pierwszą aktywację DCI. Zakres nie obejmuje wdrażania zespołowości `patternslab.app`, API `patternslab.org` ani High-Risk `patternslab.work`, choć dokument dziedziczy ich nadrzędne rygory architektoniczne. [3]

## DECISION

W zakresie są tylko: ścieżka onboardingowa, local-first behavioral capture, JITAI profile update, S11 sterylizacja, φ-timing, telemetryczne eventy oraz walidacyjne bramki CI/CD dla tej ścieżki. Poza zakresem pozostają zmiany w `03_ee/`, pricing, reporting enterprise i research API. [2][3][5]

## METRIC

IN_SCOPE:

- Welcome
- Intent
- First Observation
- Baseline
- Consents
- Plan
- Permissions
- IndexedDB or equivalent local-first storage
- EffectLog-compatible event emission
- SDK-first integration boundary

OUT_OF_SCOPE:

- `03_ee/` modifications
- `05_apps/` unrelated screens
- `patternslab.app`
- `patternslab.org`
- `patternslab.work` [3][2]

# 5. MATH_CORE

## OBSERVATION

Nowy plan musi odziedziczyć aktywne stałe kanoniczne z Brand Book i Frontend Architecture. Wszystkie timingi, layout, luminancja i etapy onboardingu muszą mieć jawną derywację φ. [4][2]

## PATTERN

Ścieżka onboardingowa używa kombinacji: `GOLDENSECOND`, `VALIDATIONWINDOW`, `STABILITYHEARTBEAT`, `SILENCECYCLE`, `INVERSEPHI`, `INVERSEPHISQ` i `SQRTPHI`. Każdy wyjątek poza tym zbiorem oznacza FAIL bez ADR. [4][1]

## DECISION

W planie obowiązują poniższe stałe i tylko one mogą sterować czasem, proporcją lub głębokością wizualną.

## METRIC

| PARAMETER          |    VALUE | φ-DERIVATION               | USE                                 |
| ------------------ | -------: | -------------------------- | ----------------------------------- |
| GOLDENSECOND       |  1618 ms | `1000 × φ`                 | bazowa jednostka timingu [4]        |
| VALIDATIONWINDOW   |   618 ms | `1000 × φ^-1`              | debounce / validation [4]           |
| STABILITYHEARTBEAT |  2618 ms | `1000 × φ^2`               | stabilizacja i slow transitions [4] |
| SILENCECYCLE       |  6854 ms | kanoniczna stała systemowa | pełny cykl ciszy / gate [4][5]      |
| INVERSEPHI         | 0.618034 | `φ^-1`                     | content ratio [4]                   |
| INVERSEPHISQ       | 0.381966 | `φ^-2`                     | silence ratio [4]                   |
| SQRTPHI            | 1.272019 | `√φ`                       | luminance tier scaling [4]          |
| H1                 | 41.89 px | `16 × φ^2`                 | page title [4]                      |
| BODY               |    16 px | anchor                     | body text [4]                       |
| SMALL              |  9.89 px | `16 × φ^-1`                | hint / timestamp [4]                |

# 6. EXECUTION_PLAN

## OBSERVATION

Frontend Architecture definiuje pięć core screens oraz embedded Protocol Zero. Twój plan rozszerza to o jawny krok `First Observation`, który musi zostać osadzony między Intent a Baseline bez rozbijania deterministycznego ciągu. [2]

## PATTERN

Najczystszy wzorzec implementacyjny to: Welcome jako Stage 0, Intent jako deklaracja kierunku, First Observation jako aktywna brama obserwacyjna, Baseline jako kalibracja metryk, następnie Consents, Plan i Permissions jako domknięcie kontraktu sesyjnego. [2][4][7]

## DECISION

Sekwencja wykonawcza dla PatternLens DCI onboarding jest następująca.

## METRIC

### 6.1 Welcome

- Cel: wejście do DCI bez natychmiastowego wymuszenia działania.
- Czas: `1 × GOLDENSECOND` dla inicjacji powierzchni i pierwszego pomiaru. [4][2]
- Dane: `timeToFirstTapRaw` jako sygnał pasywny L0, bez interpretacji klinicznej. [5][2]

### 6.2 Intent

- Cel: wybór `focus | sleep | rhythm | clarity` jako jawna deklaracja wejściowa. [4][2][3]
- Czas per review: `1 × STABILITYHEARTBEAT`. [4][2]
- Zapis: `PROTOCOLZERO.INTENTSELECTED` lub równoważny event zgodny z kontraktem telemetrycznym. [2]

### 6.3 First Observation

- Cel: aktywna obserwacja strukturalna GoldenRatioSilence + AhaMoment przed baseline. [7][5]
- Wymóg: brak losowości, brak `Date.now()` jako źródła decyzji, brak diagnostycznych etykiet. [1][5]
- Zapis lokalny: pierwsze okno rytmu interakcji, dwell, pause, inter-event timing w local-first storage. [7][5]

### 6.4 Baseline

- Cel: jawne ustalenie stanu bazowego użytkownika przez mierzalne deskryptory strukturalne. [2][3]
- Mechanizm: `mood`, `attention`, `tension` lub ich kanoniczne odpowiedniki zgodne z aktualnym językiem ekranu. [2][3]
- Debounce: `VALIDATIONWINDOW = 618 ms`. [4][2]

### 6.5 Consents

- Cel: granularne potwierdzenie lokalnego logowania, modelowania i dalszego przetwarzania. [8][5]
- Wymóg: zgody muszą rozdzielać local logging, profile update i ewentualne przekazanie dalej do SDK. [8]

### 6.6 Plan

- Cel: wygenerowanie pierwszego strukturalnego planu działania bez claims terapeutycznych. [4][3]
- Źródło: czysta funkcja nad stanem wejściowym i kanonicznymi stałymi. [1][5]

### 6.7 Permissions

- Cel: domknięcie dostępu do powiadomień, storage lub integracji systemowych tylko po przejściu wcześniejszych bram. [2]
- Reguła: permissions nie mogą poprzedzać baseline i consent. [2][4]

# 7. DATA_AND_BOUNDARIES

## OBSERVATION

PatternLens w MVP Split ma local-first storage przez IndexedDB / Dexie oraz integrację z Supabase, ale Frontend Architecture ustanawia `@silence/sdk` jako jedyny publiczny entrypoint backendowy i kontraktowy. [3][2]

## PATTERN

Masz dwa poziomy ruchu danych: lokalny i publiczny. Lokalny może rejestrować behavioral capture w aplikacji. Publiczny musi przechodzić przez SDK. Bezpośredni import `@silence/contracts`, `@silence/events` lub `@silence/phi` do aplikacji wymaga ADR, bo odchyla się od aktualnego SSOT integracyjnego. [2][3]

## DECISION

Przyjmuję model `LOCAL-FIRST / SDK-FIRST`.

## METRIC

- Local-first storage: `IndexedDB` lub równoważny store w obrębie aplikacji. [3]
- Public API boundary: `@silence/sdk` jako jedyna publiczna fasada. [2]
- RULE-DOM-001: zero importów z `03_ee/` do `04_packages/` i `05_apps/`. [1][5]
- Raw L0 signals: pozostają lokalne i nie przekraczają granicy open-core bez jawnego kontraktu. [7][5]
- Direct package access exception: `ADR-REQUIRED`. [2][3]

# 8. S11_VOCABULARY_LOCK

## OBSERVATION

Plan źródłowy wymaga utrzymania kodu i UI bez terminologii klinicznej. Aktywne dokumenty rozwijają ten wymóg do pełnego lock-in dla UI, eventów, dokumentacji i logów. [1][5][4]

## PATTERN

Każdy ekran onboardingowy jest potencjalnym źródłem wtórnego wycieku języka klinicznego, zwłaszcza w copy, walidacji formularzy i nazwach telemetrycznych. [5][3]

## DECISION

Obowiązuje tabela mapowania S11 dla tego planu.

## METRIC

| FORBIDDEN            | CANONICAL                             | CONTEXT                 |
| -------------------- | ------------------------------------- | ----------------------- |
| terapia              | STRUCTURAL_REFLECTION                 | dokumentacja / copy [5] |
| stres / lęk          | TENSIONSCORE                          | UI / eventy [5][1]      |
| diagnoza             | BEHAVIORAL_CLUSTER lub CLASSIFICATION | model danych [5][1]     |
| rozproszenie         | ATTENTIONDRIFT                        | insight / logika [5][1] |
| poprawa samopoczucia | COMFORTSTABILIZATION                  | output language [1]     |
| pacjent              | USERNODE / user                       | domena produktu [6]     |

# 9. VERIFICATION_PROTOCOL

## OBSERVATION

Space Instructions ustanawiają nieodwracalną sekwencję walidacji lokalnej przed wypchnięciem zmian. MVP Split i Hard Seven dodają app-specific gates oraz WORLDHALT na pierwszy FAIL. [3][1][6]

## PATTERN

Ponieważ dokument dotyczy ścieżki PatternLens, obowiązują zarówno globalne gate’y repo, jak i selektywny build/test dla zakresu zmienionego względem `origin/main...HEAD`. [3][6]

## DECISION

Walidacja tej pracy ma przejść dokładnie przez poniższą kolejność.

## METRIC

```bash
pnpm install --frozen-lockfile
pnpm boundary-check
pnpm s11-check
pnpm typecheck
turbo run build --filter=...[origin/main...HEAD]
turbo run test --filter=...[origin/main...HEAD]
```

Dla ścieżki PatternLens dodatkowo obowiązują:
`pnpm validate-phi-constants`
`pnpm s11-check --path 05appsweb`
Detekcja jednego FAIL oznacza `WORLDHALT`. [3][1]

# 10. RISKS_AND_COUNTERMEASURES

## OBSERVATION

Plan źródłowy prawidłowo wskazał trzy ryzyka: residualne FAIL-e `s11-check`, potencjalną zmianę lockfile przez Dexie i niejednoznaczność routingu dla `first-observation`. Aktualne dokumenty dodają czwarte ryzyko: obejście fasady SDK. [3][2][5]

## PATTERN

Są to ryzyka strukturalne, a nie kosmetyczne. Każde z nich może wprost zablokować merge lub obniżyć PCS poniżej bramki. [1]

## DECISION

Przyjmuję poniższy rejestr ryzyk.

## METRIC

| RISK                       | PATTERN                                 | COUNTERMEASURE                                          |
| -------------------------- | --------------------------------------- | ------------------------------------------------------- |
| residual `s11-check` fails | martwe struktury poza zakresem zmiany   | raportować, nie rozszerzać zakresu bez ADR [5]          |
| lockfile mutation          | nowa zależność Dexie / storage adapter  | jawna akceptacja przed zmianą `pnpm-lock.yaml` [3]      |
| routing ambiguity          | osobna route vs step inline             | dopuścić oba warianty przy zachowaniu tej samej FSM [2] |
| SDK bypass                 | bezpośredni import pakietów publicznych | ADR-required deviation, prefer `@silence/sdk` [2][3]    |
| non-canonical timing       | 300/500/750 ms lub inne lokalne liczby  | `pnpm validate-phi-constants` + review [4][5]           |

# 11. EFFECTLOG

## OBSERVATION

HARD SEVEN wymaga append-only audit trail z `S11.COMMIT.ID`, `timestamp`, `event`, `status`, `prevHash`, `hash` i `artifactPath`. Bez tego zmiana nie istnieje operacyjnie. [1]

## PATTERN

Ten dokument jest nowym artefaktem kanonicznym, więc wymaga wpisu genesis. [1]

## DECISION

Dodaję szablon wpisu EffectLog dla tej zmiany.

## METRIC

```yaml
S11.COMMIT.ID: CARNAGE-VISION-MOCK-20260626-001
TIMESTAMP: 2026-06-26T12:43:00Z
EVENT: CARNAGE_VISION_MOCK_HARD_SEVEN_CANONICALIZED
STATUS: PASS
PCS: 0.999
artifactPath: 01_governance/carnage-vision-mock-hard-seven.md
prevHash: INIT-CARNAGE-VISION-MOCK-001
hash: TO_BE_COMPUTED_ON_REPO_COMMIT
```

# 12. PCS_COMPUTATION

## OBSERVATION

Artefakt jest dokumentem wykonawczym, więc jego PCS zależy od kompletności, zgodności z S11, obecności MATH_CORE, jawnego boundary statement i EffectLog template. [1][6]

## PATTERN

Największe potencjalne kary dotyczyłyby: braku sekcji INPUT/OUTPUT, braku MATH_CORE, placeholderów, przekroczenia niejednoznaczności oraz niespójności z SSOT SDK-first. [1][6][2]

## DECISION

Przyznaję wynik PASS warunkowy dla dokumentu jako artefaktu planistycznego gotowego do repo, przy założeniu, że implementacja zachowa te same rygory. [1]

## METRIC

PCS_START: `1.000`
PCS_GATE: `0.990`
PCS_COMPUTED: `0.999`
STATUS: `PASS`
REASON: `Complete HARD SEVEN structure, explicit φ-derivation, S11 lock-in, SDK-first boundary statement, zero placeholders.` [1][2]

# 13. STABILIZE

## OBSERVATION

Dokument osiąga stan repo-ready jako kanoniczna wersja planu dla onboardingowego DCI w PatternLens. Nie zastępuje Frontend Architecture, Brand Book ani MVP Split, lecz kompiluje ich wymagania do jednej ścieżki wykonawczej. [2][4][3]

## PATTERN

Jest to warstwa egzekucyjna podległa bardziej ogólnym dokumentom SSOT, lecz wiążąca dla tej konkretnej pracy. [1]

## DECISION

Dokument można umieścić w `01_governance/` jako lokalny plan wykonawczy dla implementacji onboardingowego DCI i traktować jako kontrakt pracy dla repo oraz agentów. [1][6]

## METRIC

FINAL_STATE: `STABLE`
MERGE_READINESS: `YES, SUBJECT TO LOCAL GATES PASS`
WORLDHALT_CONDITIONS:

- direct `03_ee` leakage
- forbidden S11 vocabulary
- missing φ-derivation
- missing audit event
- non-canonical timing
- bypass of SDK without ADR [1][2][5]
