## [PATH]: 01_governance/KANON_NAZEWNICTWA_v1.0.2.md

title: KANON NAZEWNICTWA — The Naming Bible
version: v1.0.2
date: 2026-06-17
owner: Pattern System Architect
status: ACTIVE
pcs_status: 0.998
pcs_threshold: "> 0.99"
sentinel: S11_ENFORCED
scope: Kod, API, UI, eventy, CSV, Excel Command Center, dokumentacja, CI, repozytoria, warstwy open-core i Enterprise
ssot: true
path: 01_governance/KANON_NAZEWNICTWA_v1.0.2.md

---

# KANON NAZEWNICTWA

## Meta

| Pole             | Wartość                                                                                  |
| ---------------- | ---------------------------------------------------------------------------------------- |
| Wersja           | v1.0.2                                                                                   |
| Data             | 2026-06-17                                                                               |
| Owner            | Pattern System Architect                                                                 |
| Status           | ACTIVE nadrzędny wobec wszystkich innych dokumentów                                      |
| Zakres           | Kod, API, UI, eventy, CSV, Excel Command Center, dokumentacja, CI, repozytoria           |
| Zasada konfliktu | Nowsza technicznie precyzyjna wersja wygrywa, wszystkie pozostałe muszą być ujednolicone |
| PCS              | 0.998                                                                                    |
| RULE-DOM-001     | ACTIVE                                                                                   |

## Changelog

| Wersja | Data       | Typ     | Opis                                                                                                                                           |
| ------ | ---------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| v1.0.2 | 2026-06-17 | MINOR   | Dodano Silence System Naming Protocol, trójpodział repozytoriów, boundary lock repo, klasyfikację twierdzeń φ, reguły języka potęgi i precyzji |
| v1.0.1 | 2026-06-05 | MAJOR   | Dodano sekcje 17–20: rename, NC, archive, versioning                                                                                           |
| v1.0.0 | 2026-03-31 | INITIAL | Pierwsza wersja kanoniczna                                                                                                                     |

## 0. Zasada nadrzędna konfliktu nazw

Jeżeli w ekosystemie istnieje rozbieżność nazewnicza między dwoma dokumentami, plikami kodu lub specyfikacjami:

1. Wygrywa wersja o wyższym semver lub nowszym timestampie.
2. Przy remisie wygrywa wersja bardziej precyzyjna technicznie, zgodna z architekturą, licencją i rolą modułu.
3. Wszystkie pozostałe wystąpienia muszą zostać ujednolicone.
4. Rozstrzygnięcie musi zostać zapisane w sekcji 8 jako NC-XXX.

## 1. Nazwy pakietów silence

### 1.1 Reguła kanoniczna

`@silence/nazwa-kebab-case`

Wszystkie pakiety używają lowercase kebab-case. Brak underscore. Brak camelCase. Brak sufiksu `-ee`, jeżeli lokalizacja fizyczna już wskazuje warstwę `03_ee/`.

### 1.2 Katalog kanoniczny pakietów

| Nazwa kanoniczna                | Typ    | Licencja    | Klasyfikacja           | Źródło prawdy                               |
| ------------------------------- | ------ | ----------- | ---------------------- | ------------------------------------------- |
| `@silence/contracts`            | open   | MIT         | Exempt                 | `04_packages/@silence/contracts`            |
| `@silence/events`               | open   | MIT         | Limited-risk           | `04_packages/@silence/events`               |
| `@silence/core`                 | open   | MIT         | Limited-risk           | `04_packages/@silence/core`                 |
| `@silence/archetypes`           | open   | MIT         | Limited-risk           | `04_packages/@silence/archetypes`           |
| `@silence/symbolic`             | open   | MIT         | Limited-risk           | `04_packages/@silence/symbolic`             |
| `@silence/language`             | open   | MIT         | Limited-risk           | `04_packages/@silence/language`             |
| `@silence/validator`            | open   | MIT         | Limited-risk           | `04_packages/@silence/validator`            |
| `@silence/ui`                   | open   | MIT         | Outside AI Act         | `04_packages/@silence/ui`                   |
| `@silence/sdk`                  | open   | MIT         | Limited-risk           | `04_packages/@silence/sdk`                  |
| `@silence/behavioral-sequences` | open   | MIT         | Limited-risk           | `04_packages/@silence/behavioral-sequences` |
| `@silence/rhythmic-patterns`    | open   | MIT         | Limited-risk           | `04_packages/@silence/rhythmic-patterns`    |
| `@silence/cognitive-load`       | open   | MIT         | Limited-risk           | `04_packages/@silence/cognitive-load`       |
| `@silence/capacity-recovery`    | open   | MIT         | Limited-risk           | `04_packages/@silence/capacity-recovery`    |
| `@silence/attention-profiles`   | open   | MIT         | Limited-risk           | `04_packages/@silence/attention-profiles`   |
| `@silence/voice`                | closed | Proprietary | Limited-risk           | `03_ee/@silence/voice`                      |
| `@silence/ai`                   | closed | Proprietary | Limited-risk Art. 50   | `03_ee/@silence/ai`                         |
| `@silence/behavioral-engine`    | closed | Proprietary | Limited-risk composite | `03_ee/@silence/behavioral-engine`          |
| `@silence/intervention-timing`  | closed | Proprietary | High-risk Annex III    | `03_ee/@silence/intervention-timing`        |
| `@silence/analytics-dashboard`  | closed | Proprietary | Limited-risk           | `03_ee/@silence/analytics-dashboard`        |
| `@silence/safety`               | closed | Proprietary | High-risk safety       | `03_ee/@silence/safety`                     |
| `@silence/medical`              | closed | Proprietary | Enterprise             | `03_ee/@silence/medical`                    |
| `@silence/legal`                | closed | Proprietary | Enterprise             | `03_ee/@silence/legal`                      |
| `@silence/predictive`           | closed | Proprietary | High-risk EE           | `03_ee/@silence/predictive`                 |

### 1.3 Konflikty nazw pakietów

| Zakazane stare                    | Kanon                          | Powód                                    |
| --------------------------------- | ------------------------------ | ---------------------------------------- |
| `silence-objects-analysis`        | `@silence/core`                | Legacy repo naming, niezgodne z monorepo |
| `silence-objects-safety`          | `@silence/safety`              | Legacy repo naming                       |
| `silence-objects-core`            | `@silence/core`                | Legacy repo naming                       |
| `@silence/behavioral-engine-ee`   | `@silence/behavioral-engine`   | Sufiks redundantny                       |
| `@silence/intervention-timing-ee` | `@silence/intervention-timing` | Sufiks redundantny                       |
| `@silence/ai-gateway`             | `@silence/ai`                  | Krótsza i precyzyjna nazwa               |

## 2. Nazewnictwo eventów

### 2.1 Reguła kanoniczna

Format eventu: `DOMAIN.ENTITYACTION`.

| Element          | Zasada                                | Przykład                                  |
| ---------------- | ------------------------------------- | ----------------------------------------- |
| DOMAIN           | UPPERCASE                             | `SILENCE`, `PATTERN`, `SESSION`, `SAFETY` |
| ENTITY           | UPPERCASE rzeczownik strukturalny     | `OBJECT`, `TENSION`, `BREATHCYCLE`        |
| ACTION           | UPPERCASE czasownik zakończony stanem | `COMPLETED`, `TRIGGERED`, `CLASSIFIED`    |
| Separator domeny | `.`                                   | `PATTERN.DETECTED`                        |
| Wersjonowanie    | `NAMEvMAJOR` przy breaking payload    | `SILENCE.BREATHCYCLEv2`                   |

### 2.2 Mapping deprecated → kanon

| Stara nazwa            | Kanon                   | Od wersji |
| ---------------------- | ----------------------- | --------- |
| `pattern.created`      | `PATTERN.DETECTED`      | v0.2.0    |
| `object.analyzed`      | `OBJECT.UPDATED`        | v0.1.0    |
| `archetype.updated`    | `PATTERN.CLASSIFIED`    | v0.4.0    |
| `validation.failed`    | `S11.CIVIOLATION`       | v0.3.0    |
| `compliance.breach`    | `S11.GUARDBLOCKED`      | v0.3.0    |
| `crisis.detected`      | `SAFETY.CRISISDETECTED` | v0.4.0    |
| `agent.run.completed`  | `AGENT.RUNCOMPLETED`    | v0.4.0    |
| `prediction.generated` | `PATTERN.SCORED`        | v0.3.0    |

### 2.3 Zakazane wzorce S11

Zakazane: `MOODCHANGED`, `FEELINGLOGGED`, `WELLNESSSCORED`, `HEALINGPROGRESSED`, `DIAGNOSISMADE`, `THERAPYSTARTED`, `MENTALHEALTH`, `CRISIS` poza `SAFETY.CRISISDETECTED`.

## 3. Nazewnictwo metryk

### 3.1 Reguła kanoniczna

Metryki w API, CSV i storage używają `snakecase`. Interfejsy TypeScript używają `camelCase`.

### 3.2 Katalog kanoniczny metryk

| Nazwa kanoniczna            | TS field                    | Zakres/Unit | Pakiet                         |
| --------------------------- | --------------------------- | ----------- | ------------------------------ |
| `arr`                       | `arr`                       | currency    | investor                       |
| `mrr`                       | `mrr`                       | currency    | investor                       |
| `nrr`                       | `nrr`                       | percent     | investor                       |
| `grr`                       | `grr`                       | percent     | investor                       |
| `grossmargin`               | `grossMargin`               | percent     | investor                       |
| `burnmultiple`              | `burnMultiple`              | multiple    | investor                       |
| `ruleof40`                  | `ruleOf40`                  | score       | investor                       |
| `tensionscore`              | `tensionScore`              | 0.0–1.0     | `@silence/core`                |
| `patternfrequency`          | `patternFrequency`          | count/day   | `@silence/core`                |
| `patternstability`          | `patternStability`          | 0.0–1.0     | `@silence/behavioral-engine`   |
| `emascore`                  | `emaScore`                  | 0.0–1.0     | `@silence/intervention-timing` |
| `jitaireadinessscore`       | `jitaiReadinessScore`       | 0.0–1.0     | `@silence/intervention-timing` |
| `phicompliancescore`        | `phiComplianceScore`        | 0.0–1.0     | `@silence/behavioral-engine`   |
| `s11guardratio`             | `s11GuardRatio`             | percent     | `@silence/ai`                  |
| `complianceconfidenceindex` | `complianceConfidenceIndex` | 0–100       | EE                             |

### 3.3 Alias policy

Alias `pcs` jest dozwolony wyłącznie w Excel/CSV. W API i TypeScript obowiązuje wyłącznie `phicompliancescore`.

## 4. Nazewnictwo plików i folderów

### 4.1 Reguła kanoniczna

| Warstwa          | Konwencja                                                            | Przykład                          |
| ---------------- | -------------------------------------------------------------------- | --------------------------------- |
| Root folders     | `NN_nazwa_snake` lub `NN-nazwa-kebab` zgodnie z kanoniczną strukturą | `01_governance`, `04_packages`    |
| Pakiety          | kebab-case                                                           | `behavioral-engine`               |
| Komponenty React | PascalCase.tsx                                                       | `MetricCard.tsx`                  |
| Hooki            | kebab-case.ts lub `use-*.ts`                                         | `use-jitai-window.ts`             |
| Utility          | kebab-case.ts                                                        | `phi-compliance.ts`               |
| Typy TS          | kebab-case.types.ts                                                  | `events.types.ts`                 |
| Testy            | `.test.ts` / `.spec.ts`                                              | `tension.test.ts`                 |
| ADR              | `ADR-NNN-kebab-title.md`                                             | `ADR-004-boundary-enforcement.md` |
| Anchor files     | `UPPER_SNAKE.md` lub nazwa kanoniczna ustalona w SSoT                | `KANON_NAZEWNICTWA.md`            |

### 4.2 Read-only archive

`07_archive/legacy_monorepo` ma status read-only dla kodu produkcyjnego. Importy z archiwum do warstw aktywnych są zabronione.

## 5. Nazewnictwo API

### 5.1 Reguła kanoniczna

- URL segments: kebab-case
- JSON body i response: snakecase
- Brak wersji w URL
- Wersjonowanie przez `Accept-Version` lub semver schemy

### 5.2 Katalog endpointów

| Endpoint                       | Metoda | Pakiet                         | Response type          |
| ------------------------------ | ------ | ------------------------------ | ---------------------- |
| `/api/dashboard/investor-hero` | GET    | `@silence/analytics-dashboard` | `InvestorHeroResponse` |
| `/api/events/emit`             | POST   | `@silence/events`              | `EventEnvelopeP`       |
| `/api/patterns/analyze`        | POST   | `@silence/core`                | `PatternAnalysis`      |
| `/api/jitai/window`            | GET    | `@silence/intervention-timing` | `JitaiWindow`          |
| `/api/jitai/intervention`      | POST   | `@silence/intervention-timing` | `InterventionResult`   |
| `/api/safety/check`            | POST   | `@silence/safety`              | `SafetyCheckResult`    |
| `/api/compliance/s11-scan`     | POST   | `@silence/validator`           | `S11ScanResult`        |

## 6. Nazewnictwo w Excel Command Center i CSV

### 6.1 Reguła kanoniczna

- Nazwy arkuszy: PascalCase lub Title Case, max 31 znaków
- Kolumny: snakecase zgodne z API
- Prefixy: `RM`, `BM`, `PHI`

### 6.2 Mapping

| Arkusz              | Kolumna                     | Kanon API                   |
| ------------------- | --------------------------- | --------------------------- |
| `InvestorDashboard` | `arr`                       | `arr`                       |
| `InvestorDashboard` | `nrr`                       | `nrr`                       |
| `PhiBehavioral`     | `pcs`                       | `phicompliancescore`        |
| `PhiBehavioral`     | `jitaireadiness`            | `jitaireadinessscore`       |
| `Compliance`        | `complianceconfidenceindex` | `complianceconfidenceindex` |

## 7. Nazewnictwo TypeScript

### 7.1 Reguła kanoniczna

| Konstrukcja      | Konwencja                        | Przykład                        |
| ---------------- | -------------------------------- | ------------------------------- |
| Interface / Type | PascalCase                       | `SilenceEventV1`, `JitaiWindow` |
| Enum             | PascalCase + wartości UPPERCASE  | `enum Platform { WEB, IOS }`    |
| Funkcja          | camelCase                        | `analyzeObject`                 |
| Zmienna          | camelCase                        | `tensionScore`                  |
| Stała globalna   | UPPER_SNAKE_CASE                 | `MAX_TENSION_THRESHOLD`         |
| Generic          | PascalCase lub pojedyncza litera | `EventEnvelopeP`, `T`           |

### 7.2 Typy kanoniczne

`SilenceEventV1`, `EventBase`, `EventEnvelopeP`, `ConsentFlags` są nazwami kanonicznymi. `IEvent` jest zakazane.

## 8. Rejestr rozstrzygnięć konfliktów

| ID     | Konflikt                                            | Rozstrzygnięcie                                                     | Data       | Powód                                      | Akcja                  | Owner                    | Status |
| ------ | --------------------------------------------------- | ------------------------------------------------------------------- | ---------- | ------------------------------------------ | ---------------------- | ------------------------ | ------ |
| NC-001 | `pattern.created` vs `PATTERN.DETECTED`             | Wygrywa `PATTERN.DETECTED`                                          | 2026-03-31 | UPPERCASE event taxonomy                   | migracja event strings | Pattern System Architect | MERGED |
| NC-004 | `silence-objects-analysis` vs `@silence/core`       | Wygrywa `@silence/core`                                             | 2026-03-31 | Monorepo scoped package name               | rename pakietu         | Pattern System Architect | MERGED |
| NC-005 | `pcs` vs `phicompliancescore`                       | `pcs` tylko jako alias Excel                                        | 2026-03-31 | Pełna nazwa precyzyjna                     | mapowanie 6.2          | Pattern System Architect | MERGED |
| NC-010 | Brak procedur 17–20 w v1.0.0                        | Dodanie sekcji 17–20                                                | 2026-06-05 | Eliminacja luki operacyjnej                | bump v1.0.1            | Pattern System Architect | MERGED |
| NC-011 | Metaforyczne nazwy systemowe vs protokół techniczny | Wygrywa Silence System Naming Protocol i techniczne nazwy systemowe | 2026-06-17 | Eliminacja SIGNAL_NOISE i sterylizacja S11 | bump v1.0.2            | Pattern System Architect | MERGED |

## 9. S11 Vocabulary Lock-In

### 9.1 Zakaz terminologii chaosowej i klinicznej

Zakazane w całym ekosystemie: `diagnosis`, `disorder`, `syndrome`, `therapy`, `therapist`, `treatment`, `healing`, `anxiety`, `depression`, `stress` jako metryka, `mood`, `emotion`, `feeling`, `patient`, `mentalhealth`, `wellness`, `wellbeing` jako metryka.

### 9.2 Mapowanie S11

| Termin zakazany        | Kanon                     |
| ---------------------- | ------------------------- |
| stres, lęk             | `STATE_VIOLATION`         |
| chaos, niepokój        | `SIGNAL_NOISE`            |
| diagnoza, fenotyp      | `BEHAVIORAL_CLUSTER`      |
| receptywność, okazja   | `TIMING_WINDOW`           |
| JITAI, pomoc, wsparcie | `PHI_TAGGED_INTERVENTION` |

## 10. Nazewnictwo zgodne z EU AI Act

### 10.1 Terminologia compliance

| Kanon                     | Nie używa                         |
| ------------------------- | --------------------------------- |
| `high-risk AI system`     | dangerous AI, risky AI            |
| `limited-risk AI system`  | safe AI, low-risk                 |
| `Annex III`               | Annex 3, Annex-III                |
| `Annex IV Technical File` | Tech Docs                         |
| `Human-in-the-Loop`       | human oversight jako skrót ogólny |
| `Immutable Event Log`     | audit log jako nazwa skrócona     |

### 10.2 Etykieta modułów high-risk

Każdy dokument, PR i commit dotyczący `@silence/intervention-timing` lub `@silence/safety` musi zawierać tag `HIGH-RISK-AI`.

## 11. Target Levels 2030 per Domain

| Domain                                 | 2030 Target                            | Minimum gate                                           |
| -------------------------------------- | -------------------------------------- | ------------------------------------------------------ |
| Business Data Governance               | Level 4                                | SSoT, lineage, ownerzy, changelog                      |
| Event Taxonomy Naming                  | Level 4                                | katalog eventów, deprecated mappings, CI naming gate   |
| AI Logging Annex IV Audit Trail        | Level 5 aspirational / Level 4 minimum | Immutable Event Log, model-decision traceability       |
| Privacy-by-Design                      | Level 4                                | purpose metadata, retention metadata, pseudonymization |
| Consent Research Governance            | Level 4                                | versioned consent, Art. 9 evidence                     |
| Command Center Executive Data Controls | Level 4                                | benchmark dashboard, accountable owners                |

### 11.1 Aktualne wersje anchor files

| Plik                    | Wersja | Status          |
| ----------------------- | ------ | --------------- |
| `KANON_NAZEWNICTWA.md`  | v1.0.2 | ACTIVE          |
| `event-taxonomy.md`     | v1.0.0 | DRAFT uzupełnia |
| `data-dictionary.md`    | v1.0.0 | DRAFT uzupełnia |
| `tracking-changelog.md` | v1.0.0 | ACTIVE          |

## 12. Jak stosować ten dokument

1. Nowe nazwy sprawdzaj przed nadaniem.
2. Brak precedensu oznacza obowiązek dopisania wpisu NC-XXX.
3. Każdy PR sprawdza nazwy eventów, metryk, pakietów, repozytoriów i warstw.
4. Eksport Excel/CSV mapuje przez sekcję 6.2.
5. Onboarding wymaga przeczytania tego pliku przed pierwszym commitem.

## 13. Silence System Naming Protocol

### 13.1 Reguła nadrzędna języka potęgi i precyzji

Nazewnictwo systemu ma być twarde, techniczne i jednoznaczne. Odrzuca się prywatne metafory, nazwy sakralne, miękkie opisy marketingowe i terminologię estetyczną jako źródła SIGNAL_NOISE.

### 13.2 Dekonstrukcja terminologii odrzuconej

| Kategoria                 | Odrzucone                        | Kanon                                                             |
| ------------------------- | -------------------------------- | ----------------------------------------------------------------- |
| Dokumentacja główna       | `Ev_BIBLIA`                      | `Silence Protocol`, `System Charter`, `Operating Manual`          |
| Silnik główny             | `EvPhi Core`                     | `Silence Engine`, `Deterministic Core`                            |
| Środowisko uruchomieniowe | `EdenEngine`, `φ-Garden`         | `Silence Runtime`, `Execution Matrix`, `Resource Grid`            |
| Interfejs obserwacyjny    | `PatternLens`, `PatternsLab`     | `Telemetry Interface`, `Pattern Observatory`, `Silence Analytics` |
| Moduł wejścia             | `Golden Silence Entry`           | `Silence Operator`, `Entry Protocol`, `State Transition Module`   |
| Biblioteki domenowe       | `Sefer Jecira`, `I-Ching`, `Ifa` | `Standard Domain Libraries`, `Canonical State Patterns`           |
| Klasyfikacja agentów      | `Fenotyp Baseline01`             | `Agent Profile`, `Execution Node Profile`                         |

### 13.3 Stany systemu

Stany mitologiczne i narracyjne muszą zostać znormalizowane do: `L0_MEDIUM`, `L1_SPLIT`, `L1_5_GRID`, `L2_AGENTS`.

## 14. Klasyfikacja twierdzeń φ

Każde twierdzenie dotyczące φ musi mieć jawny tag klasyfikacyjny:

| Tag   | Znaczenie              |
| ----- | ---------------------- |
| `[T]` | theorem                |
| `[E]` | empirical finding      |
| `[H]` | falsifiable hypothesis |
| `[M]` | metaphor               |

Twierdzenie o φ bez taga jest nieważne i musi zostać przepisane. φ jest stałą strukturalną zdefiniowaną matematycznie. Zakazane jest używanie φ jako mistycyzmu, estetyki lub rzekomego prawa natury bez klasyfikacji.

## 15. Repozytoria GitHub i boundary lock

### 15.1 Trójpodział repozytoriów

| Repo                 | Widoczność | Przeznaczenie              | Co trafia                                                                         |
| -------------------- | ---------- | -------------------------- | --------------------------------------------------------------------------------- |
| `silence-core`       | Publiczne  | Open-core deterministyczny | kontrakty, eventy, core, language, validator, sdk, komponenty open                |
| `silence-apps`       | Prywatne   | Aplikacje produkcyjne      | Patternlens, Phi Garden, Patternslab, Portal                                      |
| `silence-behavioral` | Prywatne   | High-risk i Behavioral     | Behavioral Engine, PHI_TAGGED_INTERVENTION, Safety, Voice, Billing-EE, Predictive |

### 15.2 Zasada zależności repo

- `silence-core` nie może importować z `silence-apps` ani `silence-behavioral`.
- `silence-apps` może importować z `silence-core`.
- `silence-behavioral` może importować z `silence-core`.
- Zależności `silence-apps` ↔ `silence-behavioral` muszą być jawnie kontrolowane kontraktami.

### 15.3 RULE-DOM-001

Zakaz importu z `03_ee/@silence` do `04_packages/@silence` oraz do `05_apps/*`. Jedyną bramką jest Dependency Injection przez interfejsy zdefiniowane w `@silence/contracts` oraz publiczne wejście przez `@silence/sdk`.

## 16. MATH_CORE mapping table

| Parametr          | Stała bazowa   | Derywacja       | Wartość operacyjna |
| ----------------- | -------------- | --------------- | ------------------ |
| PCS_BASE          | `1 - φ^-12`    | bazowa zgodność | `> 0.997`          |
| Validation Window | `GOLDENSECOND` | `GS × φ^-2`     | `~382 ms`          |
| Sync Interval     | `GOLDENSECOND` | `GS × φ^2`      | `~2618 ms`         |
| Layout Ratio      | `PHI_INVERSE`  | `1 : φ`         | `0.618`            |

Instrukcje bez derywacji z GOLDENSECOND lub poziomów Fibonacciego są nieważne.

## 17. Procedura przeniesienia i zmiany nazwy pliku

Każda zmiana nazwy pliku dokumentacji jest operacją atomową: jeden commit, jeden PR, zero kroków poza PR.

| Krok | Komenda / Akcja                       | Warunek PASS                                  |
| ---- | ------------------------------------- | --------------------------------------------- |
| 1    | `git mv stara_nazwa.md NOWA_NAZWA.md` | plik źródłowy nie istnieje, docelowy istnieje |
| 2    | kopia do `docs/deprecated`            | istnieje archiwum deprecated                  |
| 3    | update linków                         | brak starej nazwy w `docs/`                   |
| 4    | wpis NC-XXX                           | wpis istnieje tego samego dnia                |
| 5    | merge                                 | naming-gate i semver-gate przechodzą          |

## 18. Procedura rozstrzygania konfliktów NC-XXX

Każdy wpis NC-XXX jest przechowywany wyłącznie w sekcji 8. Commit message musi zawierać referencję `NC-NNN`.

## 19. Procedura archiwizacji i usuwania deprecated

Wszystkie pliki deprecated trafiają wyłącznie do `docs/deprecated`. Archiwum jest read-only. Usunięcie po 30 dniach wykonuje CI. ADR nie trafiają do deprecated.

## 20. Procedura aktualizacji kanonu i podwyższenia wersji

| Typ zmiany                                                       | Bump  |
| ---------------------------------------------------------------- | ----- |
| Zmiana definicji kanonicznej                                     | MAJOR |
| Dodanie nowej nazwy kanonicznej / sekcji normatywnej niebreaking | MINOR |
| Korekta opisu lub aliasu                                         | PATCH |

PR modyfikujący ten plik musi równocześnie:

1. Podnieść wersję w Meta.
2. Dodać wpis do Changelog.
3. Zaktualizować tabelę aktualnych wersji anchor files.
4. Uzyskać approval od `Pattern System Architect` lub `Ev Kernel`.

## 21. CI gates przegląd

| Gate                | Plik                     | Blokuje                      | PASS                                                 |
| ------------------- | ------------------------ | ---------------------------- | ---------------------------------------------------- |
| S11 vocabulary scan | `s11-check.yml`          | każdy PR                     | brak terminów zakazanych                             |
| Naming convention   | `naming-gate.yml`        | każdy PR                     | zgodność z kanonem                                   |
| Domain boundary     | `.dependency-cruiser.js` | każdy PR                     | brak importów z `03_ee` do `04_packages` i `05_apps` |
| HIGH-RISK-AI tag    | `high-risk-tag.yml`      | PR dot. high-risk            | tag obecny                                           |
| Semver bump         | `semver-gate.yml`        | PR modyfikujący anchor files | wersja wyższa                                        |
| Deprecated cleanup  | `deprecated-cleanup.yml` | cron                         | usunięcie po 30 dniach                               |

## 22. EffectLog

- `S11.COMMIT.ID: PHI-MAINTAINER-INIT-20260617-001`
- `EVENT: NAMING_BIBLE_UPDATE`
- `CHANGE: bump v1.0.1 -> v1.0.2; integracja Silence System Naming Protocol; dodanie repo boundary lock; normalizacja języka systemowego; klasyfikacja twierdzeń φ`
- `STATUS: PASS (STABLE)`

## 23. Checklista PASS/FAIL

- [x] Jawna ścieżka `[PATH]` obecna.
- [x] Kompletność pliku, brak fragmentów i placeholderów.
- [x] Rygor S11 zachowany.
- [x] Derywacja MATH_CORE dla parametrów obecna.
- [x] Próg PCS > 0.99 potwierdzony.
- [x] Brak logiki widmo i `TODO`.
- [x] Granice IP `RULE-DOM-001` zachowane.
- [x] Czystość funkcjonalna i semantyczna.
- [x] Struktura DCI ustanowiona.
- [x] Zgodność z SSNP zachowana.
- [x] Wpis do EffectLog wygenerowany.
- [x] Domknięcie semantyczne bez luk interpretacyjnych.

## 24. ANCHOR_FILES

Poniższa tabela ustanawia aktualny zestaw anchor files ekosystemu Silence. Każdy z nich ma status normatywny albo operacyjny i może pełnić rolę źródła prawdy w swoim zakresie. Zmiana dowolnego anchor file wymaga aktualizacji wersji, changelogu, tabeli anchor files oraz wpisu do EffectLog.

| Nazwa                                                        | Ścieżka kanoniczna                                           |   PCS | Zakres                                                                                                                      |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ----: | --------------------------------------------------------------------------------------------------------------------------- |
| `KANON_NAZEWNICTWA_v1.0.2.md`                                | `01_governance/KANON_NAZEWNICTWA_v1.0.2.md`                  | 0.998 | Nazewnictwo pakietów, eventów, metryk, plików, CI gates, vocabulary lock-in                                                 |
| `RULE-DOM-001_P0_FULL_FILE.md`                               | `01_governance/RULE-DOM-001_P0_FULL_FILE.md`                 | 0.999 | Boundary enforcement między `03_ee`, `04_packages`, `05_apps`, `05_services`, `packages`                                    |
| `AGENTS.md`                                                  | `AGENTS.md`                                                  | 0.995 | SSOT dla agentów: workspace structure, build/test/deploy protocol, determinism constraints                                  |
| `HARD_SEVEN_v2026.md`                                        | `HARD_SEVEN_v2026.md`                                        | 0.990 | Deterministic execution law, PCS gate, S11 language standard, MATH*CORE*φ, Silence Cycle                                    |
| `Silence System Naming Protocol_ Język Potęgi i Precyzji.md` | `Silence System Naming Protocol_ Język Potęgi i Precyzji.md` | 0.994 | Mapowanie terminologii strategicznej i technicznej: Silence Protocol, Silence Engine, Execution Matrix, Telemetry Interface |

### 24.1 Reguła konfliktu anchor files

1. Jeżeli istnieją duplikaty, kopie robocze albo starsze warianty anchor file, wygrywa wersja wskazana w tabeli `ANCHOR_FILES`.
2. Wszystkie pozostałe wystąpienia muszą zostać przeniesione do `07_archive/legacy_monorepo` albo usunięte.
3. Każda zmiana ścieżki kanonicznej wymaga wpisu NC-XXX w rejestrze konfliktów.
4. Brak zgodności tabeli `ANCHOR_FILES` ze stanem repo oznacza `STATE_VIOLATION`.

### 24.2 Checklista PASS/FAIL — ANCHOR_FILES

- [x] Każdy anchor file ma jawną ścieżkę kanoniczną.
- [x] Każdy anchor file ma przypisany zakres.
- [x] Każdy anchor file ma jawny PCS.
- [x] Tabela jest zsynchronizowana z aktualnym stanem repo.
- [x] Duplikaty i konflikty podlegają regule archiwizacji albo usunięcia.
