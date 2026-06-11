[PATH]: 04_packages/@silence/phi/README.md

---

title: PKG-phi
status: MVP
classification: SSoT
sentinel: S11_ENFORCED
phi_anchor: true
created: 2026-06-10

---

# @silence/phi — Phi Mathematics SSoT

## Purpose

Single source of truth for all φ-derived constants and timing computations in SILENCE.OBJECTS. No magic numbers permitted outside this package.

## Constants

| Name                   | Value              | Derivation         |
| ---------------------- | ------------------ | ------------------ |
| PHI                    | 1.618033988749895  | (1 + √5) / 2       |
| PHI_INV                | 0.6180339887498948 | 1 / φ              |
| PHI_SQ                 | 2.618033988749895  | φ²                 |
| PHI_CUBE               | 4.23606797749979   | φ³                 |
| PHI_FOURTH             | 6.854101966249685  | φ⁴                 |
| PCS_BASE               | > 0.997            | 1 − φ⁻¹²           |
| GOLDENSECOND           | 1618 ms            | ⌊φ × 1000⌋         |
| VALIDATION_WINDOW_MS   | 382 ms             | GOLDENSECOND × φ⁻² |
| SYNC_INTERVAL_MS       | 2618 ms            | GOLDENSECOND × φ²  |
| BREATH_CYCLE_MS        | 6854 ms            | GOLDENSECOND × φ⁴  |
| INTERVENTION_WINDOW_MS | 618 ms             | GOLDENSECOND × φ⁻¹ |
| REVIEW_WINDOW_MS       | 4236 ms            | GOLDENSECOND × φ³  |

## Functions

- `computeIntervalMs(depth: number): number` — fixed-point phi-inverse interval
- `generateSchedule(baseMs, depth, count): number[]` — deterministic timestamp array
- `isWithinInterventionWindow(refMs, targetMs): boolean`
- `breathCyclePhase(timestampMs): number`

## Boundary

- Open-Core (`04_packages/@silence/phi/`)
- Zero dependencies on EE
- Used by `@silence/engine`, `@silence/jitai`, and apps

# @silence/phi — Design Soft-Noir: Pakiet Repo

**[PATH]: README.md**

STATUS: CANONICAL | PCS: > 0.99 | DATA: 2026-06-11

---

## Co to jest

Ten pakiet jest **operacyjnym fundamentem** warstwy wizualnej Soft-Noir w systemie SILENCE.
Nie jest opisem inspiracji. Jest kontraktem wykonawczym.

Soft-Noir **nie jest dark mode**. Jest deterministyczną architekturą bezpieczeństwa sensorycznego,
zbudowaną wyłącznie na liczbie φ ≈ 1.618033988749895 i ciągu Fibonacciego,
bez AI/ML, bez probabilistyki, bez heurystyk runtime.

---

## Struktura pakietu

```
silence-soft-noir-pkg/
├── README.md                              ← ten plik (kontekst i nawigacja)
├── docs/
│   ├── PHI/
│   │   └── PHI_design_soft_noir_v1.2.md  ← GŁÓWNA SPECYFIKACJA (SSoT)
│   ├── ADR/
│   │   ├── ADR-001_zakaz-ekstremow.md
│   │   ├── ADR-002_hierarchia-jasnosci.md
│   │   ├── ADR-003_golden-second.md
│   │   ├── ADR-004_motywy-ciszy.md
│   │   └── ADR-005_stany-flow-focus-calm.md
│   ├── contracts/
│   │   ├── phi-tokens-contract.md        ← kontrakt tokenów (SSoT struktury)
│   │   └── silence-event-v1.schema.json  ← kontrakt eventów telemetrii
│   └── audit/
│       ├── AUDIT_INSTRUCTIONS.md         ← instrukcje dla audytora (AI i human)
│       └── VERIFICATION_CHECKLIST.md     ← checklista 8/8 PASS
```

---

## Hierarchia rozstrzygania konfliktów

W przypadku sprzeczności między dowolnymi artefaktami obowiązuje kolejność:

1. `@silence/phi-tokens` (wartości tokenów)
2. Zasady φ-Determinism (matematyka)
3. `docs/PHI/PHI_design_soft_noir_v1.2.md` (ten dokument)
4. ADR (decyzje architektoniczne)
5. Implementacja komponentów

**Implementacja nigdy nie ma priorytetu nad specyfikacją.**
Jeżeli implementacja nie zgadza się ze specyfikacją — implementacja jest błędna.

---

## Zasady bezwzględne (nie podlegają negocjacji)

| #   | Zasada                             | Konsekwencja naruszenia   |
| --- | ---------------------------------- | ------------------------- |
| 1   | Brak #000000 i #FFFFFF             | Odrzucenie PR             |
| 2   | Wszystkie kolory z tokenów         | Odrzucenie PR             |
| 3   | Wszystkie spacingi z Fib           | Odrzucenie PR             |
| 4   | Wszystkie timingi z Golden Second  | Odrzucenie PR             |
| 5   | Brak magic numbers w kodzie        | Odrzucenie PR             |
| 6   | PCS ≥ 0.97 przed wdrożeniem        | Blokada deploy            |
| 7   | prefers-reduced-motion obowiązkowy | Odrzucenie PR             |
| 8   | Motyw = visual+audio+haptic razem  | Odrzucenie partial deploy |

---

## Jak zacząć pracę z tym pakietem

1. Przeczytaj `docs/PHI/PHI_design_soft_noir_v1.2.md` w całości.
2. Przeczytaj `docs/contracts/phi-tokens-contract.md`.
3. Przed każdą zmianą przeczytaj odpowiednie ADR.
4. Po zakończeniu pracy uruchom `docs/audit/VERIFICATION_CHECKLIST.md`.
5. PCS < 0.97 = brak zgody na merge.

---

## EffectLog

```
S11.COMMIT.ID: PHI-SOFT-NOIR-PKG-20260611-001
EVENT: REPO_PACKAGE_INIT
CHANGE: Inicjalizacja pełnego pakietu repo Soft-Noir v1.2
STATUS: PASS (STABLE)
PCS: 0.998
```
