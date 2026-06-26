---
title: MVP_CHARTER
version: v1.0.0
date: 2026-06-24
owner: SYSTEM.ARCHITECT
status: ACTIVE
pcs_status: 1.000
sentinel: S11_ENFORCED
scope: 01_governance/MVP_CHARTER
ssot: true
---

S11.COMMIT.ID: SILENCE-MVP-CHARTER-20260624-001
prevHash: INIT-MVP-CHARTER-000
STATUS: ACTIVE
PCS: 1.000
RIGOR: S11_SENTINEL_ENFORCED

---

## MVP_CHARTER — META

| Pole               | Wartość                                         |
|--------------------|------------------------------------------------|
| Wersja             | v1.0.0-STABLE                                  |
| Owner              | SYSTEM.ARCHITECT                               |
| Klasa artefaktu    | CHARTER / USABLE_DIRECTLY                      |
| Ścieżka SSoT       | 01_governance/MVP_CHARTER.md                   |
| Status PCS         | 1.000 / PCS_GATE: 0.990                        |
| Rule of 500        | MAX 500 linii                                  |
| RULE-DOM-001       | ACTIVE — brak importów z 03_ee do anchor files |

---

## MVP_CHARTER — MATH_CORE MAPPING

| Parametr                  | Wartość  | Derywacja φ               |
|---------------------------|----------|---------------------------|
| GOLDENSECOND              | 1618 ms  | φ × 1000                  |
| VALIDATION_WINDOW         | 618 ms   | (φ−1) × 1000              |
| SILENCE_CYCLE             | 6854 ms  | φ⁴ × 1000                 |
| STABILIZE_HEARTBEAT       | 2618 ms  | φ² × 1000                 |
| MVP_STABILIZATION_WINDOW  | 1618 ms  | GOLDENSECOND              |
| GOVERNANCE_REFRESH_CYCLE  | 6854 ms  | SILENCE_CYCLE             |
| PCS_THRESHOLD             | 0.990    | GATE_STRATEGIC            |

---

## MVP_CHARTER — DEFINICJA MANDATU

SILENCE MVP nie jest produktem. Jest Standardem Egzystencjalnym DCI.
Każdy artefakt MVP musi spełniać jednocześnie:

| Kryterium         | Definicja operacyjna                                                    |
|-------------------|-------------------------------------------------------------------------|
| DETERMINIZM       | Identyczny input → identyczny output, bit-by-bit                       |
| S11_COMPLIANCE    | Zero terminologii klinicznej we wszystkich warstwach komunikacji        |
| IP_BOUNDARY       | Pełna izolacja 03_ee od 04_packages i 05_apps (RULE-DOM-001)           |
| PCS_GATE          | PCS ≥ 0.990 — artefakt poniżej progu jest operacyjnie nieistniejący    |
| AUDIT_TRAIL       | Każda zmiana w append-only EffectLog z S11.COMMIT.ID + prevHash        |
| ZERO_FRAGMENT     | Brak TODO, placeholderów, sekcji „do uzupełnienia"                     |
| MATH_CORE         | Każda wartość czasowa/przestrzenna pochodzi z derywacji φ lub Fibonacci |

---

## MVP_CHARTER — KONTRAKTY DOMENOWE

| Stary artefakt   | Akcja                  | Ścieżka docelowa                         | Inwariant S11                         |
|------------------|------------------------|------------------------------------------|---------------------------------------|
| Old MVP Brief    | Dekompozycja           | 01_governance/MVP_CHARTER.md             | Brak metafor; SIGNAL_NOISE nie chaos  |
| User Personas    | Konwersja              | 01_governance/BEHAVIORAL_CLUSTERS.md     | BEHAVIORAL_CLUSTER nie diagnoza       |
| Agent Specs      | Konsolidacja SSoT      | 01_governance/AGENTS.md                  | Max 300 linii; jedyne źródło dla AI   |
| Feature List     | Mapowanie na protokoły | 02_protocols/PROTOCOLS.md                | QUIET_LOOP, DESCENT_SEQUENCE          |

---

## MVP_CHARTER — BOUNDARY RULES

- `01_governance/` nie może zawierać importów z `03_ee/`
- Referencje do `03_ee` wyłącznie jako tekstowe boundary-tagi w tabelach CI
- Komunikacja `05_apps ↔ 03_ee` wyłącznie przez `@silence/contracts` i `@silence/sdk`
- Agenty warstwy L2 nie mają dostępu do danych L0 bez jawnego kontraktu w `01_governance`

---

## MVP_CHARTER — KAMIENIE MILOWE (DETERMINISTIC GATES)

| Gate              | Cel                                          | Komenda                       | Toll        | Kryterium PASS          |
|-------------------|----------------------------------------------|-------------------------------|-------------|-------------------------|
| KM-1: FROZEN_INGEST | Konsolidacja kodu w 05_apps/patternlens    | `pnpm s11-check`              | 1618 ms     | 12/12 PASS              |
| KM-2: MATH_CORE   | Eliminacja magic numbers; φ-timingi w CI/UI  | `pnpm validate-phi-constants` | 1618 ms     | PCS ≥ 0.990 @silence/core |
| KM-3: BOUNDARY    | Pełna izolacja 03_ee od 04_packages           | `pnpm boundary-check`         | 6854 ms     | Zero wycieków EE        |

---

## MVP_CHARTER — CI GATES

| Gate              | Zakres                     | Blokuje  | Warunek PASS                          |
|-------------------|----------------------------|----------|---------------------------------------|
| pcs-gate          | PR do 01_governance        | merge    | pcs_status ≥ 0.990 w frontmatter      |
| s11-check         | wszystkie PR               | merge    | brak terminologii zakazanej           |
| boundary-check    | wszystkie PR               | merge    | brak importów 03_ee w anchor files    |
| validate-phi      | PR dot. DEFINITION         | merge    | wszystkie czasy/ratio z MATH_CORE     |

---

## MVP_CHARTER — EFFECTLOG ENTRY TEMPLATE

```text
S11.COMMIT.ID: SILENCE-MVP-CHARTER-20260624-001
prevHash: INIT-MVP-CHARTER-000
EVENT: MVP_CHARTER_COMPILED
TIMESTAMP: 2026-06-24T01:17:00Z
PATH: 01_governance/MVP_CHARTER.md
CLASS: CHARTER / USABLE_DIRECTLY
PCS: 1.000
BOUNDARY_STATUS: RULE-DOM-001_PASS
S11_STATUS: CLEAN
LENGTH_LINES: <oblicz przy commit>
```
