---
title: PROTOCOLS
version: v1.0.0
date: 2026-06-24
owner: SYSTEM.ARCHITECT
status: ACTIVE
pcs_status: 1.000
sentinel: S11_ENFORCED
scope: 02_protocols/PROTOCOLS
ssot: true
---

S11.COMMIT.ID: SILENCE-PROTOCOLS-20260624-001
prevHash: INIT-PROTOCOLS-000
STATUS: ACTIVE
PCS: 1.000
RIGOR: S11_SENTINEL_ENFORCED

---

## PROTOCOLS — META

| Pole            | Wartość                                         |
|-----------------|-------------------------------------------------|
| Wersja          | v1.0.0-STABLE                                   |
| Owner           | SYSTEM.ARCHITECT                                |
| Klasa artefaktu | DEFINITION / USABLE_DIRECTLY                    |
| Ścieżka SSoT    | 02_protocols/PROTOCOLS.md                       |
| Status PCS      | 1.000 / PCS_GATE: 0.990                         |
| Zastępuje       | Feature List (terminologia opisowa)             |
| RULE-DOM-001    | ACTIVE                                          |

---

## PROTOCOLS — MATH_CORE MAPPING

| Parametr                | Wartość  | Derywacja φ              |
|-------------------------|----------|--------------------------|
| GOLDENSECOND            | 1618 ms  | φ × 1000                 |
| QUIET_LOOP_INTERVAL     | 1618 ms  | GOLDENSECOND             |
| DESCENT_STEP_1          | 1618 ms  | GOLDENSECOND             |
| DESCENT_STEP_2          | 2618 ms  | φ² × 1000                |
| DESCENT_STEP_3          | 4236 ms  | φ³ × 1000                |
| DESCENT_STEP_5          | 6854 ms  | φ⁴ × 1000 ≈ SILENCE_CYCLE|
| RETURN_WINDOW           | 2618 ms  | φ² × 1000                |
| FIBONACCI_STEPS         | {1,2,3,5,8,13,21} | ciąg kanoniczny |

---

## PROTOCOLS — QUIET_LOOP

**Cel:** Cykliczne podtrzymywanie stanu niskiego TENSION_SCORE w oknie receptywności USER_NODE.

| Krok | Akcja                                 | Czas       | Derywacja φ     |
|------|---------------------------------------|------------|-----------------|
| 1    | SAMPLE — pobranie SIGNAL_VECTOR       | t₀         | t₀ = dowolny    |
| 2    | EVAL — ocena TENSION_SCORE            | t₀ + 618 ms| VALIDATION_WINDOW|
| 3    | DISPATCH — JITAI jeśli score ≥ 0.850 | t₀ + 1618 ms| GOLDENSECOND   |
| 4    | LOG — wpis do EffectLog               | t₀ + 1618 ms| GOLDENSECOND   |
| 5    | WAIT — oczekiwanie do następnego cyklu| 1618 ms    | GOLDENSECOND   |

**Niezmienniki:**
- Brak RNG — każda decyzja oparta na TENSION_SCORE (deterministyczny threshold)
- Pętla używa wyłącznie `loop_fib(n)` dla n ∈ {1, 2, 3, 5, 8, 13, 21}
- Zapis do EffectLog jest jedynym efektem ubocznym

---

## PROTOCOLS — DESCENT_SEQUENCE

**Cel:** Prowadzenie USER_NODE przez fazę obniżonej aktywności (SILENCE_OPERATOR) w sekwencji φ-kroków.

| Faza       | Nazwa             | Czas kumulatywny | Derywacja φ   |
|------------|-------------------|------------------|---------------|
| Faza 1     | ENTRY             | 1618 ms          | GOLDENSECOND  |
| Faza 2     | DEEPENING         | 4236 ms          | φ³ × 1000     |
| Faza 3     | SILENCE           | 6854 ms          | φ⁴ × 1000     |
| Faza 5     | RETURN            | 9472 ms          | φ⁴ + φ² ms    |
| Faza 8     | STABILIZE         | 11090 ms         | φ⁵ × 1000     |

**Kontrakt wykonawczy:**
- `DESCENT_SEQUENCE` nie może być przerwana bez wpisu `STATE_VIOLATION` do EffectLog
- Każdy krok musi przejść przez `validateSilenceEvent()` w `@silence/safety`
- Brak dostępu do L0 bez kontraktu zatwierdzonego przez SYSTEM.ARCHITECT

---

## PROTOCOLS — KONTRAKT MAPOWANIA FEATURE → PROTOCOL

| Stara cecha (Feature)             | Protokół kanoniczny   | Moduł docelowy               |
|-----------------------------------|-----------------------|------------------------------|
| Focus session timer               | QUIET_LOOP            | 05_apps/patternlens          |
| Guided wind-down                  | DESCENT_SEQUENCE      | 05_apps/patternlens          |
| Attention pattern analysis        | QUIET_LOOP (SAMPLE)   | @silence/core                |
| Adaptive intervention             | QUIET_LOOP (DISPATCH) | 03_ee/jitai (przez SDK)      |
| Pattern visualization             | DESCENT_SEQUENCE      | 05_apps/patternlens          |

---

## PROTOCOLS — BOUNDARY RULES

- `02_protocols/` nie zawiera kodu wykonywalnego — wyłącznie kontrakty i schematy protokołów
- Referencje do `03_ee` wyłącznie jako tekstowe boundary-tagi
- Implementacja `QUIET_LOOP` i `DESCENT_SEQUENCE` w `@silence/core` (open-core)
- Adaptacyjna warstwa `JITAI` w `03_ee/jitai` — dostęp wyłącznie przez `@silence/sdk`

---

## PROTOCOLS — CI GATES

| Gate           | Zakres                     | Blokuje | Warunek PASS                          |
|----------------|----------------------------|---------|---------------------------------------|
| s11-check      | wszystkie PR               | merge   | zero terminów klinicznych             |
| pcs-gate       | PR do 02_protocols         | merge   | pcs_status ≥ 0.990                    |
| boundary-check | każdy PR                   | merge   | brak importów 03_ee w kontraktach     |
| validate-phi   | PR dot. PROTOCOLS          | merge   | wszystkie czasy z MATH_CORE           |

---

## PROTOCOLS — EFFECTLOG ENTRY TEMPLATE

```text
S11.COMMIT.ID: SILENCE-PROTOCOLS-20260624-001
prevHash: INIT-PROTOCOLS-000
EVENT: PROTOCOLS_COMPILED
TIMESTAMP: 2026-06-24T01:17:00Z
PATH: 02_protocols/PROTOCOLS.md
CLASS: DEFINITION / USABLE_DIRECTLY
PCS: 1.000
BOUNDARY_STATUS: RULE-DOM-001_PASS
S11_STATUS: CLEAN
LENGTH_LINES: <oblicz przy commit>
```
