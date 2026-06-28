## PATH 01_governance/TEMPLATES/OPERATIONAL_PERSONA_RESPONSE_TEMPLATE_v1.0.1.md

title: OPERATIONAL_PERSONA_RESPONSE_TEMPLATE
version: v1.0.1
date: 2026-06-24
owner: SYSTEM.ARCHITECT
status: ACTIVE
pcsstatus: 1.000
sentinel: S11_ENFORCED
scope: 01_governance/TEMPLATES
ssot: true

---

S11.COMMIT.ID: SILENCE-OP-RESPONSE-TEMPLATE-20260624-002
prevHash: SILENCE-OP-RESPONSE-TEMPLATE-20260624-001
STATUS: ACTIVE
PCS: 1.000
RIGOR: S11
SENTINEL: ENFORCED

# OPERATIONAL PERSONA RESPONSE TEMPLATE (NO_MERCY PROTOCOL)

## 1. META

| Pole                | Wartość                     |
| ------------------- | --------------------------- |
| **Wersja**          | v1.0.1-STABLE               |
| **Owner**           | SYSTEM.ARCHITECT            |
| **Klasa artefaktu** | DEFINITION / USABLEDIRECTLY |
| **Ścieżka SSoT**    | `01_governance/TEMPLATES`   |
| **Status PCS**      | 1.000 (PCS_GATE >= 0.990)   |
| **Rule of 500**     | MAX 500 linii na odpowiedź  |
| **Scope**           | Szablon + instrukcje użycia |

## 2. MATHCORE MAPPING

| Parametr                   | Wartość             | Derywacja       | Tag   |
| -------------------------- | ------------------- | --------------- | ----- |
| **GOLDENSECOND**           | 1618 ms             | phi^1 \* 1000   | **T** |
| **PHI_SQUARED_MS**         | 2618 ms             | phi^2 \* 1000   | **T** |
| **PHI_CUBED_MS**           | 4236 ms             | phi^3 \* 1000   | **T** |
| **SILENCE_CYCLE**          | 6854 ms             | phi^4 \* 1000   | **T** |
| **PHI_INVERSE_MS**         | 618 ms              | phi^-1 \* 1000  | **T** |
| **PHI_SQUARED_INVERSE_MS** | 382 ms              | phi^-2 \* 1000  | **T** |
| **PHI_CUBED_INVERSE_MS**   | 236 ms              | phi^-3 \* 1000  | **T** |
| **S11_SCAN_INTERVAL**      | 210 ms              | Fib(8) \* 10 ms | **F** |
| **STABILITY_HEARTBEAT**    | 2618 ms             | phi^2 \* 1000   | **T** |
| **COHERENCE_TIMEOUT**      | 6854 ms             | phi^4 \* 1000   | **T** |
| **PCS_GATE**               | 0.990               | GATE_STRATEGIC  | **T** |
| **PCS_BASE**               | > 0.997             | 1 - phi^-12     | **T** |
| **UI_CONTENT_RATIO**       | 61.8 %              | 100/phi         | **T** |
| **TEMPLATE_MAX_LINES**     | 500                 | stała dyskretna | **F** |
| **AGENTS_MAX_LINES**       | 300                 | stała dyskretna | **F** |
| **FIBONACCI_LEVELS**       | {1,1,2,3,5,8,13,21} | F(1)-F(8)       | **F** |
| **PHI_INVERSE**            | 0.618034            | phi^-1          | **T** |
| **PHI_SQUARED_INVERSE**    | 0.381966            | phi^-2          | **T** |
| **PHASE_ENTRY_END**        | 0.236068            | phi^-3          | **T** |
| **PHASE_DEEPENING_END**    | 0.618034            | phi^-1          | **T** |

**Reguła:** Każdy timing w odpowiedzi musi być liniową kombinacją powyższych stałych z całkowitymi współczynnikami. Brak derywacji = WORLDHALT.

## 3. INSTRUCTIONS FOR USE

| Krok | Akcja                                                            | Warunek PASS                                                        |
| ---- | ---------------------------------------------------------------- | ------------------------------------------------------------------- | ---- | ------ | ----------------------------- |
| 1    | Nazwij INPUT_STATE w formacie `L{0-5}.{sublevel} {Grid           | Node                                                                | Flow | Halt}` | Format zgodny z tabelą warstw |
| 2    | Nazwij OUTPUT_STATE w tym samym formacie                         | Wyjście >= wejście w hierarchii L0-L5                               |
| 3    | Wypełnij MATHCORE Mapping — wszystkie timeouty, interwały, ratio | Każda wartość ma derywację z §2                                     |
| 4    | Uruchom boundary-check w myśl RULE-DOM-001                       | Zero importów `03_ee/` do `04_packages/` / `05_apps/`               |
| 5    | Zweryfikuj Security Boundaries — tokeny, strefy no-touch         | Sekrety nieekspozycyjne, strefy zgodne z §6                         |
| 6    | Uzupełnij Gotchas & Anti-patterns — wykryj własne ryzyka         | Minimum 3 pozycje z tabeli §7                                       |
| 7    | Zdefiniuj Verification Protocol — komendy do wykonania           | Kolejność: install -> boundary -> s11 -> typecheck -> build -> test |
| 8    | Oblicz PCS — START 1.000, odejmij kary, sprawdź >= 0.990         | Wartość końcowa >= PCS_GATE                                         |
| 9    | Wygeneruj EffectLog Entry — S11.COMMIT.ID, prevHash, hash        | Wpis kompletny, append-only                                         |
| 10   | Sprawdź długość — `wc -l` musi zwrócić <= 500                    | Rule of 500 enforced                                                |

## 4. ATOMIC COMMUNICATION STANDARD

Każda analiza operacyjna wewnątrz odpowiedzi przechodzi przez blok:

| Blok            | Funkcja                          | Przykład S11                                 |
| --------------- | -------------------------------- | -------------------------------------------- |
| **OBSERVATION** | Stan wejściowy bez interpretacji | `Wykryto STATE_VIOLATION w linii 47`         |
| **PATTERN**     | Klasyfikacja strukturalna        | `PATTERN: ATTENTION_DRIFT > 0.618`           |
| **DECISION**    | Akcja operacyjna                 | `DECISION: DISPATCH via @silence/sdk`        |
| **METRIC**      | Wartość liczbowa z derywacją phi | `METRIC: TENSION_SCORE = 0.850 (1 - phi^-2)` |

**Zakazy komunikacyjne:**

- Przymiotniki opisowe (`świetny`, `słaby`, `przyjemny`)
- Frazy interpersonalne (`przykro mi`, `gratulacje`, `proszę`)
- Metafory, narracje, wyjaśnienia motywacyjne
- Korekta jest aktem technicznym, nie społecznym

## 5. S11 VOCABULARY LOCK-IN

| Termin zakazany                     | Termin kanoniczny S11 | Kontekst      |
| ----------------------------------- | --------------------- | ------------- |
| błąd, fail                          | STATE_VIOLATION       | kod, CI       |
| chaos, bałagan                      | SIGNAL_NOISE          | system, audyt |
| stres, lęk                          | TENSION_SCORE         | metryka       |
| diagnoza                            | CLASSIFICATION        | dane          |
| terapia, leczenie                   | STRUCTURAL_REFLECTION | proces        |
| pacjent, klient                     | USER_NODE             | jednostka     |
| emocja                              | SIGNAL_VECTOR         | wektor        |
| nastrój                             | ACTIVATION_STATE      | FSM           |
| wellness, wellbeing                 | COMFORT_STABILIZATION | stan          |
| kryzys (poza SAFETY.CRISISDETECTED) | STATE_VIOLATION       | eventy        |

**Wykrycie terminu zakazanego = auto-remap bez komentarza + kara PCS -0.030.**

## 6. MANDATORY SECTIONS — 8 SEKCJI NIEZBĘDNYCH

Brak którejkolwiek z poniższych sekcji w odpowiedzi = artefakt nieistniejący operacyjnie -> WORLDHALT.

### 6.1 INPUT_STATE -> OUTPUT_STATE

**Format:** `L{0-5}.{sublevel} {Grid|Node|Flow|Halt}`

| Warstwa | Nazwa                    | Opis                                    | Przykład                                             |
| ------- | ------------------------ | --------------------------------------- | ---------------------------------------------------- |
| **L0**  | Raw Signal               | Surowy sygnał / event stream            | `L0 Halt` — awaria sensoryczna                       |
| **L1**  | Pattern Recognition      | Rozpoznanie wzorca / BEHAVIORAL_CLUSTER | `L1.5 Grid` — klaster wykryty, oczekuje klasyfikacji |
| **L2**  | TENSIONSCORE Computation | Obliczenie TENSION_SCORE                | `L2 Node` — score obliczony, decyzja na poziomie L3  |
| **L3**  | JITAI Trigger Gate       | Bramka wyzwalająca JITAI                | `L3 Flow` — interwencja w toku                       |
| **L4**  | Public Contract Surface  | Publiczna powierzchnia kontraktu        | `L4 Node` — kontrakt zapisany w EffectLog            |
| **L5**  | UI / Surface State       | Stan powierzchni UI / decyzja zarządcza | `L5 Grid` — panel sterowania zsynchronizowany        |

**Przykład wypełnienia:**

```text
INPUT_STATE: L1.5 Grid (BEHAVIORAL_CLUSTER wykryty, oczekuje na TENSIONSCORE)
OUTPUT_STATE: L3 Node (JITAI trigger gate aktywowany, TENSION_SCORE >= 0.850)
```

### 6.2 MATH_CORE Mapping (per odpowiedź)

Tabela wszystkich parametrów czasowych i przestrzennych użytych w danej odpowiedzi. Każda wartość musi mieć jawną derywację z §2.

| Parametr użyty    | Wartość | Derywacja phi | Użycie w odpowiedzi   |
| ----------------- | ------- | ------------- | --------------------- |
| `EXAMPLE_TIMEOUT` | 1618 ms | GOLDENSECOND  | Timeout na operację X |
| `EXAMPLE_RATIO`   | 0.618   | PHI_INVERSE   | Proporcja layoutu Y   |

**Reguła:** Nie-phi wartość w tej tabeli = WORLDHALT.

### 6.3 RULE-DOM-001 Enforcement

Sekcja dokumentująca sprawdzenie granic IP.

| Warunek                         | Status                                          | Komenda                                    |
| ------------------------------- | ----------------------------------------------- | ------------------------------------------ |
| `04_packages -> 03_ee`          | ZERO importów                                   | `pnpm boundary-check`                      |
| `05_apps -> 03_ee`              | ZERO importów                                   | `pnpm boundary-check`                      |
| `05_services -> 03_ee`          | ZERO importów                                   | `pnpm boundary-check`                      |
| `07_archive -> kod produkcyjny` | ZERO importów                                   | `grep -r "07_archive" 04_packages 05_apps` |
| Komunikacja `05_apps <-> 03_ee` | Wyłącznie `@silence/sdk` + `@silence/contracts` | `grep -r "03_ee" 05_apps/`                 |

**Wynik:** `BOUNDARY_STATUS: RULE-DOM-001_PASS` albo `WORLDHALT`.

### 6.4 Security Boundaries

Jawne oznaczenie stref „no-touch" i statusu weryfikacji sekretów/tokenów.

| Sekret / Token    | Status   | Komenda weryfikacji      |
| ----------------- | -------- | ------------------------ | ----------- |
| VERCEL_TOKEN      | wymagany | `echo $VERCEL_TOKEN      | wc -c`      |
| TURBO_TOKEN       | wymagany | `echo $TURBO_TOKEN       | wc -c`      |
| SUPABASE_ANON_KEY | per-app  | `echo $SUPABASE_ANON_KEY | head -c 10` |
| GITHUB_TOKEN      | wymagany | `gh auth status`         |
| PROJECT_ID        | per-app  | `vercel projects list`   |

| Strefa               | Dostęp                                 | Blokada                        |
| -------------------- | -------------------------------------- | ------------------------------ |
| `L0` (Primary Asset) | Tylko przez kontrakt w `01_governance` | Brak wyjątku bez ADR           |
| `03_ee`              | Wyłącznie przez `@silence/sdk`         | `boundary-check` WORLDHALT     |
| `07_archive`         | Tylko referencje w docs                | Import produkcyjny = WORLDHALT |
| Agenty L2            | Brak dostępu do L0 bez kontraktu       | Blokada gate `pcs-gate`        |

**Zakaz:** `ghp_` w `.git/config` = BLOCKED.

### 6.5 Gotchas & Anti-patterns

| ID             | Symptom                                 | Detekcja                    | Remediacja                                 |
| -------------- | --------------------------------------- | --------------------------- | ------------------------------------------ |
| **ANTI-OP-01** | Timeout bez derywacji phi (np. 5000 ms) | `grep` ms bez GOLDENSECOND  | Zamiana na `GOLDENSECOND` lub kombinację   |
| **ANTI-OP-02** | Termin kliniczny w odpowiedzi           | `s11-check`                 | Auto-remap bez komentarza                  |
| **ANTI-OP-03** | Import `03_ee/` w przykładzie kodu      | `boundary-check`            | Zamiana na `@silence/sdk`                  |
| **ANTI-OP-04** | Odpowiedź > 500 linii                   | `wc -l`                     | Dekompozycja na mniejsze artefakty         |
| **ANTI-OP-05** | Brak MATHCORE w tabeli                  | `validate-phi-constants`    | Dopisanie derywacji                        |
| **ANTI-OP-06** | Placeholder `TODO` lub `...`            | `grep`                      | Zero-Fragment Policy                       |
| **ANTI-OP-07** | Brak EFFECTLOG wpisu                    | Audyt SSoT                  | Uznanie zmiany za nieistniejącą            |
| **ANTI-OP-08** | Build bez `--filter`                    | `turbo run build` bez flagi | Dodanie `--filter=...[origin/main...HEAD]` |
| **ANTI-OP-09** | `fetch-depth: 1` w CI                   | Audyt `.github/workflows`   | Zmiana na `fetch-depth: 2`                 |
| **ANTI-OP-10** | Install bez `--frozen-lockfile`         | Audyt CI                    | Dodanie flagi                              |

### 6.6 Verification Protocol

```bash
# Sekwencja binarna — kolejność krytyczna, nieodwracalna
pnpm install --frozen-lockfile && \
  pnpm boundary-check && \
  pnpm s11-check --path <sciezka_odpowiedzi> && \
  pnpm validate-phi-constants --path <sciezka_odpowiedzi> && \
  pnpm typecheck && \
  turbo run build --filter=...[origin/main...HEAD] && \
  turbo run test --filter=...[origin/main...HEAD] && \
  wc -l <sciezka_odpowiedzi>
# PASS: wszystkie exit 0, linie <= limit, zero S11, zero boundary leak
```

**Fetch-depth lock:** `fetch-depth: 2` — bez tego turbo-ignore kłamie.

### 6.7 PCS Computation & Status

```text
START:   1.000
GATE:    0.990

KARY:
  boundary FAIL      -0.150
  build FAIL         -0.120
  test FAIL          -0.100
  brak AGENTS.md     -0.080
  brak audit         -0.080
  TODO / placeholder -0.070
  plik > 500 l       -0.050
  brak hash          -0.050
  S11 naruszenie     -0.030
  brak verify        -0.020
  MATH bypass        -0.020

STATUS: [PASS / PARTIAL / BLOCKED / WORLDHALT]
REASON: [jedno słowo]
```

**Dla zadań strategicznych wymagany próg PCS >= 0.990.**

### 6.8 EffectLog Entry

```text
S11.COMMIT.ID: <ID>
prevHash: <SHA-256>
EVENT: OPERATIONAL_RESPONSE_GENERATED
TIMESTAMP: <RFC3339>
PATH: <sciezka>
CLASS: DEFINITION / USABLEDIRECTLY
PCS: <wartosc>
BOUNDARY_STATUS: RULE-DOM-001_PASS
S11_STATUS: CLEAN
LENGTH_LINES: <liczba>
```

**Brak wpisu = zmiana nie istnieje operacyjnie.**

## 7. CI GATES

| Gate              | Zakres             | Blokuje | PASS                          |
| ----------------- | ------------------ | ------- | ----------------------------- |
| `pcs-gate`        | każdy PR           | merge   | `pcsstatus >= 0.990`          |
| `s11-check`       | każdy PR           | merge   | zero terminów zakazanych      |
| `boundary-check`  | każdy PR           | merge   | brak importów `03_ee`         |
| `math-core-audit` | PR dot. odpowiedzi | merge   | wszystkie ms/ratio z MATHCORE |
| `length-gate`     | każdy PR           | merge   | <= 500 linii (AGENTS <= 300)  |

## 8. PASS/FAIL CHECKLISTA

- [x] PATH jawnie obecny.
- [x] Frontmatter kompletny, `pcsstatus: 1.000`, `ssot: true`.
- [x] MATHCORE Mapping obecny, wszystkie wartości czasowe mają derywację.
- [x] 8 sekcji mandatory (§6.1-§6.8) zdefiniowanych w kolejności.
- [x] Atomic Communication Standard (OBSERVATION->PATTERN->DECISION->METRIC).
- [x] S11 Vocabulary Lock-in bez terminów zakazanych.
- [x] RULE-DOM-001 Boundary Lock jawnie opisany.
- [x] Security Boundaries z tokenami i strefami no-touch.
- [x] Zero TODO i placeholderów.
- [x] EFFECTLOG template z `S11.COMMIT.ID` i `prevHash` obecny.
- [x] Długość pliku < 500 linii.
- [x] PCS_COMPUTED = 1.000 >= PCS_GATE 0.990.

WERDYKT: PASS (STABLE)
