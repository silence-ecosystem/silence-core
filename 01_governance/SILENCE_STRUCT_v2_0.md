---
title: SILENCE_STRUCT_v2_0
status: ACTIVE
version: 2.0
classification: CANONICAL
owner: PHI_CORE_GUARDIAN
rigor: S11_SENTINEL_ENFORCED
pcs_threshold: '>= 0.970'
failure_mode: WORLD_HALT
updated: 2026-06-11
---

# [T] SILENCE_STRUCT_v2_0

**Status:** ACTIVE | **Owner:** PHI-Core Guardian
**Rygor:** S11 Sentinel Enforced | **Metryka:** PCS >= 0.970
**Charakter:** Struktura kanoniczna repozytorium i warstw systemu SILENCE

## 1. CEL DOKUMENTU

SILENCE_STRUCT_v2_0 ustanawia kanoniczną strukturę logiczną i fizyczną systemu SILENCE. Dokument definiuje relacje między warstwą open-core, warstwą enterprise, warstwą aplikacyjną, dokumentacją governance oraz artefaktami audytowymi.

Ten plik nie jest opisem pomocniczym. Jest bramką interpretacyjną dla całego repozytorium. Jeżeli plik, katalog, pakiet, workflow lub dokument nie dają się zmapować do tej struktury, są traktowane jako naruszenie ładu architektonicznego.

## 2. DEFINICJE OPERACYJNE

### 2.1. Efekt

Efekt oznacza deterministyczną spójność matematyczną systemu od poziomu stałych, przez silnik, po interfejs i log zdarzeń. Efekt istnieje wyłącznie wtedy, gdy ta sama sekwencja wejściowa produkuje ten sam wynik obliczeniowy, ten sam stan pochodny i ten sam zapis audytowy.

### 2.2. Skala

Skala oznacza gotowość do wdrożeń klasy Enterprise pod reżimem EU AI Act, z pełną separacją domen, ścieżką audytu, wielonajemczością, kontraktami danych i zdolnością do utrzymania granic IP bez wyjątków.

### 2.3. Deterministyczna Infrastruktura Poznawcza

SILENCE jest deterministyczną infrastrukturą poznawczą. Oznacza to, że:

- stan systemu jest redukowalny z jawnych wejść,
- decyzje są wynikiem reguł i kontraktów,
- logika wysokiego ryzyka nie może przenikać do warstwy open-core,
- wszystkie parametry czasowe i strukturalne muszą posiadać derywację z \(\phi\).

## 3. FUNDAMENT MATEMATYCZNY

### 3.1. Stała bazowa

Wszystkie interwały krytyczne i proporcje systemowe muszą być wyprowadzane z liczby:

\[
\phi \approx 1.618033988749895
\]

### 3.2. Stałe operacyjne

| Parametr                 | Derywacja           | Wartość operacyjna |
| ------------------------ | ------------------- | ------------------ |
| PHI                      | stała bazowa        | 1.618033988749895  |
| PHI_INVERSE              | \(1 / \phi\)        | 0.618033988749895  |
| GOLDEN_SECOND_MS         | baza timingowa      | 1618               |
| GOLDEN_SECOND_SQUARED_MS | pochodna kanoniczna | 2618               |
| GOLDEN_SECOND_CUBED_MS   | pochodna kanoniczna | 4236               |
| SILENCE_CYCLE_MS         | pochodna kanoniczna | 6854               |
| PCS_THRESHOLD            | bramka wzrostu      | 0.970              |

### 3.3. Reguła liczbowa

Zakazuje się używania magicznych liczb w logice i UI. Każdy timing, layout ratio, pacing interval, cykl animacji, próg wzrostu i stan przejściowy musi być liniową kombinacją kanonicznych stałych.

Dozwolone są wyłącznie:

- import stałych z modułów kanonicznych,
- pochodne jawnie opisane w testach,
- wartości użyte jako fixtures testowe z komentarzem kontraktowym.

Niedozwolone są:

- lokalne literały timingowe w komponentach,
- arbitralne wartości easingów,
- losowość w silniku,
- ukryte przeliczenia bez dokumentowanej derywacji.

## 4. WARSTWY SYSTEMU

### 4.1. Model warstw

System SILENCE działa w modelu L0-L5. Każda warstwa ma osobny poziom wrażliwości, osobne kontrakty i osobną politykę eksportu.

| Warstwa | Zakres                                           | Charakter            | Status eksportu            |
| ------- | ------------------------------------------------ | -------------------- | -------------------------- |
| L0      | surowe sygnały, okna timingowe, pierwotne próbki | najwyższa wrażliwość | zakaz eksportu publicznego |
| L1      | sygnały znormalizowane, profile strukturalne     | proprietary internal | ograniczony                |
| L2      | kontrakty, API payloads, event taxonomy          | public contract      | dozwolony                  |
| L3      | walidacja, kohorty, research contract            | clean room           | kontrolowany               |
| L4      | outcome analytics, billing, enterprise reporting | enterprise contract  | zamknięty                  |
| L5      | governance, audit, compliance packaging          | nadzorcza            | kontrolowany               |

### 4.2. Zasada separacji

Warstwa open-core nie może zawierać:

- logiki predykcyjnej,
- logiki wysokiego ryzyka,
- proprietary scoring beyond public contract,
- billingu enterprise,
- zamkniętych modeli interwencyjnych,
- implementacji clean room.

Warstwa enterprise może importować z core. Kierunek odwrotny jest bezwzględnie zabroniony.

## 5. MAPA REPOZYTORIUM

### 5.1. Root-level domains

Kanoniczny układ repozytorium SILENCE:

```text
/home/ewa/silence
├── 01_governance/
├── 03_ee/
├── 04_packages/
├── 05_apps/
├── docs/
├── scripts/
├── .github/
├── package.json
├── pnpm-workspace.yaml
├── vitest.config.ts
└── .dependency-cruiser.js
```

### 5.2. Znaczenie domen

| Ścieżka                 | Rola                                                | Reguła                                 |
| ----------------------- | --------------------------------------------------- | -------------------------------------- |
| `01_governance/`        | dokumenty nadrzędne, release gates, compliance, ADR | źródło decyzji strukturalnych          |
| `03_ee/`                | warstwa enterprise i high-risk logic                | proprietary only                       |
| `04_packages/@silence/` | open-core packages                                  | zero importów z `03_ee/`               |
| `05_apps/`              | aplikacje i cienkie klienty                         | bez logiki biznesowej wysokiego ryzyka |
| `docs/`                 | dokumentacja techniczna i strukturalna              | zgodna z governance                    |
| `scripts/`              | enforcement, walidacja, audit helpers               | tylko wsparcie procesu                 |

### 5.3. Zasada anchor files

Każdy katalog domenowy i każdy pakiet musi posiadać komplet plików kotwicznych:

- `README.md`
- `package.json` dla pakietów/aplikacji
- `src/index.ts` lub równoważny barrel dla pakietów
- dokument strukturalny lub mapping, jeśli katalog pełni funkcję governance/compliance

Pakiet bez anchor files nie jest uznawany za gotowy do utrzymania.

## 6. OPEN-CORE I GRANICA IP

### 6.1. RULE-DOM-001

Granica IP jest nienaruszalna. Dotyczy to zarówno kodu wykonywalnego, jak i kontraktów, struktur danych, helperów i adapterów.

**Bezwzględny zakaz:**

- `04_packages/@silence/*` importuje z `03_ee/*`
- `05_apps/*` importuje logikę domenową z `03_ee/*`
- kopiowanie implementacji EE do pakietów publicznych
- przepisywanie scoringu enterprise jako pozornie neutralnego helpera core

### 6.2. Dopuszczalny wzorzec

Jeżeli core potrzebuje zdolności dostarczanej przez EE, jedynym dozwolonym wzorcem jest dependency injection przez publiczny kontrakt zdefiniowany w warstwie contracts.

Dozwolone:

- interfejs w `04_packages/@silence/contracts`
- adapter implementowany w `03_ee`
- aplikacja lub runtime składający system na poziomie wyższym

Niedozwolone:

- bezpośredni import,
- alias path maskujący kierunek zależności,
- shared util z EE wciągnięty do open-core.

## 7. INWARIANTY MVP

### 7.1. Efekt końcowy MVP

Efektem MVP jest pełny pion techniczny od jądra matematycznego do interfejsu i EffectLog. System MVP jest uznany za zamknięty tylko wtedy, gdy:

- posiada pełny flow UI,
- posiada wspólne stałe timingowe,
- posiada growth gate w engine,
- posiada append-only audit trail.

### 7.2. Behavioral invariants

#### PCS Gate

Każda sesja musi osiągnąć:

`phi_compliance_score >= 0.970`

Wynik poniżej progu aktywuje `GardenHaltGate` lub równoważną blokadę wzrostu struktury. UI może renderować status, ale nie może samodzielnie liczyć ani nadpisywać tej decyzji.

#### Timing invariance

Wszystkie przejścia UI i interwały sesji są liniową kombinacją:

- `GOLDEN_SECOND_MS = 1618`
- `SILENCE_CYCLE_MS = 6854`

Zero RNG. Zero arbitralnego timeoutu. Zero niezależnych zegarów logiki aplikacyjnej.

#### S11 sterility

Zakaz terminologii klinicznej obowiązuje:

- kod,
- copy UI,
- eventy,
- payloady,
- dokumentację operacyjną.

Mapowanie kanoniczne:

- `stress` -> `tension_score`
- `anxiety` -> `tension_score`
- `capacity` pozostaje `capacity_score`
- chaos behawioralny -> `signal_noise`
- stan naruszenia -> `state_violation`

## 8. ARTEFAKTY WYKONAWCZE MVP

### 8.1. EffectLog

EffectLog jest niezmienialnym łańcuchem kryptograficznym SHA-256 wszystkich zdarzeń `SilenceEventV1`. Każdy wpis musi posiadać co najmniej:

- `seq`
- `timestamp`
- `event_type`
- `payload`
- `prev_hash`
- `hash`

Łańcuch jest append-only. Zakazane są:

- edycja wpisów historycznych,
- reindex bez rehash i ścieżki audytowej,
- równoległe niezsynchronizowane logi decyzji.

### 8.2. Minimalny zakres logowania

Każda decyzja krytyczna musi pozostawić wpis:

- start sesji,
- zakończenie pełnego cyklu,
- zapis sesji,
- wynik decyzji silnika,
- wynik growth gate,
- zapis summary dla mechanik typu Pulse Tap lub rytuał.

### 8.3. Phi-Garden MVP

Phi-Garden MVP jest sandboxem ograniczonym do reguł progowych, bez ukrytego modelu decyzyjnego po stronie UI. Wzrost struktury jest pochodną wyniku silnika, nie mechaniką dekoracyjną.

## 9. PARAMETRY SKALI ENTERPRISE

### 9.1. Layered Boundary Model

Skalowalność oznacza utrzymanie separacji między:

- `silence-core` jako warstwą MIT / open-core,
- `silence-enterprise` jako warstwą proprietary,
- `silence-research` jako clean room,
- `05_apps` jako cienką warstwą aplikacyjną.

Każda próba zlania tych domen w jeden model wykonawczy obniża zdolność audytową i narusza wartość IP.

### 9.2. Multi-tenancy i Clean Room

PatternsLab B2B i analogiczne systemy enterprise muszą wspierać:

- multi-tenancy,
- RLS,
- clean room research,
- k-anonymity >= 50 dla eksportów badawczych,
- odrębne ścieżki billingowe i audytowe.

### 9.3. Usage-Based Pricing

Dopuszczalne jednostki rozliczeniowe:

- `behavioral_event`
- `phenotype_computation`
- `jitai_context_call`

Silnik rozliczeniowy success-fee i outcome billing żyje wyłącznie w EE.

### 9.4. Annex IV readiness

Każdy moduł high-risk wymaga:

- Technical File,
- risk management trace,
- HITL procedure,
- immutable audit trail,
- rejestru decyzji i wersjonowania,
- gotowości do publikacji przed 2026-08-02.

## 10. DOSTOSOWANIE PAKIETÓW W `04_packages/@silence`

### 10.1. Zasada ogólna

Pakiety w `04_packages/@silence` stanowią open-core i muszą być dostosowane do tej struktury. Każdy pakiet ma być jednoznacznie przypisany do jednej z kategorii:

- contracts
- core
- tokens
- telemetry
- sdk
- pure math / deterministic engine

### 10.2. Pakiety dozwolone

Pakiet open-core może zawierać:

- pure functions,
- event contracts,
- hash-chain utilities,
- effect-log infrastructure,
- token system,
- deterministic reducers,
- serialization helpers,
- validators kontraktowe bez logiki EE.

### 10.3. Pakiety zabronione

Pakiet open-core nie może zawierać:

- proprietary scoring EE,
- billing outcome logic,
- predictive models,
- high-risk inference pipeline,
- EE-only context fusion,
- direct access do research clean room assets.

### 10.4. Wymóg refaktoryzacyjny

Każdy istniejący pakiet w `04_packages/@silence`, który narusza powyższe reguły, musi zostać:

1. rozbity na kontrakt i implementację,
2. oczyszczony z logiki enterprise,
3. objęty testami determinism,
4. objęty boundary-check,
5. zmapowany do odpowiedniej warstwy systemu.

## 11. ENFORCEMENT

### 11.1. Bramka architektoniczna

Obowiązkowe bramki przed buildem:

- `pnpm boundary-check`
- `pnpm test:determinism`
- `pnpm s11-check`
- `pnpm typecheck`
- verifier hash-chain dla EffectLog
- kontrola magicznych liczb i timingów

### 11.2. Binary pass/fail

System działa w logice binarnej:

- 8/8 PASS -> build dozwolony
- wynik niższy -> `WORLD_HALT`

### 11.3. Priorytet naruszeń

Naruszenia krytyczne:

1. import `04_packages <- 03_ee`
2. zerwany hash-chain
3. brak determinism
4. surowe magiczne liczby w timingach
5. terminologia zakazana przez S11

## 12. CHECKLISTA SCALE-READY

- [x] SILENCE.STRUCT ustanowiony jako plik kanoniczny.
- [x] Granica ADR-004 opisana na poziomie fizycznym i logicznym.
- [x] PCS Gate zdefiniowany jako `phi_compliance_score >= 0.970`.
- [x] Timing invariance oparta o `GOLDEN_SECOND_MS` i `SILENCE_CYCLE_MS`.
- [x] EffectLog zdefiniowany jako append-only SHA-256 hash-chain.
- [x] Multi-tenancy, RLS i clean room wpisane do warstwy skali.
- [x] Usage-based pricing ograniczony do EE.
- [x] Annex IV readiness wpisane jako warunek skali.
- [x] Pakiety `04_packages/@silence` objęte jawnie strukturą.
- [x] S11 Sentinel wpisany jako rygor globalny.
- [x] Binary PASS/FAIL i WORLD_HALT zdefiniowane.
- [x] Domknięcie semantyczne bez placeholderów.

## 13. VERDICT

**MVP Status:** DETERMINISTIC / STABLE
**Scale Status:** ANNEX IV PENDING / ARCHITECTURE PASS

SILENCE jest gotowy do dalszego wdrażania wyłącznie pod warunkiem, że każda kolejna zmiana zachowuje deterministyczną spójność matematyczną, append-only audit trail i bezwzględną granicę między open-core a enterprise.

## 14. EFFECT LOG

```text
S11.COMMIT.ID: PHI-GUARDIAN-SILENCE-STRUCT-20260611-001
EVENT: SILENCE_STRUCT_V2_0_ESTABLISHED
CHANGE:
  - ustanowiono kanoniczny plik strukturalny repo
  - zamknięto blocker brak SILENCE.STRUCT
  - zmapowano MVP outcome, scale protocol, ADR-004, S11 i EffectLog do jednej struktury nadrzędnej
STATUS: PASS
```
