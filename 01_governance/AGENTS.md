---
title: AGENTS
version: v1.0.0
date: 2026-06-24
owner: SYSTEM.ARCHITECT
status: ACTIVE
pcs_status: 1.000
sentinel: S11_ENFORCED
scope: 01_governance/AGENTS
ssot: true
---

S11.COMMIT.ID: SILENCE-AGENTS-20260624-001
prevHash: INIT-AGENTS-000
STATUS: ACTIVE
PCS: 1.000
RIGOR: S11_SENTINEL_ENFORCED

---

## AGENTS — META

| Pole            | Wartość                                         |
|-----------------|-------------------------------------------------|
| Wersja          | v1.0.0-STABLE                                   |
| Owner           | SYSTEM.ARCHITECT                                |
| Klasa artefaktu | DEFINITION / USABLE_DIRECTLY                    |
| Ścieżka SSoT    | 01_governance/AGENTS.md                         |
| Status PCS      | 1.000 / PCS_GATE: 0.990                         |
| Rule of 300     | MAX 300 linii (ochrona okna kontekstowego)      |
| RULE-DOM-001    | ACTIVE                                          |

---

## AGENTS — MATH_CORE MAPPING

| Parametr            | Wartość | Derywacja φ   |
|---------------------|---------|---------------|
| GOLDENSECOND        | 1618 ms | φ × 1000      |
| AGENT_RESPONSE_MAX  | 1618 ms | GOLDENSECOND  |
| AGENT_CYCLE         | 6854 ms | SILENCE_CYCLE |
| PCS_THRESHOLD       | 0.990   | GATE_STRATEGIC|
| MAX_LINES_AGENTS    | 300     | stała dyskretna |

---

## AGENTS — REJESTR AGENTÓW

| ID Agenta           | Tier | Domena              | Mandat operacyjny                                    | Dostęp do warstw    |
|---------------------|------|---------------------|------------------------------------------------------|---------------------|
| PHI-DEPLOY-ENFORCER | T1   | 06_infrastructure   | Gwarancja φ-zgodnego, sterylnego deployu             | L3 (PCS), L1 (kontekst) |
| PHI-MVP-ORCHESTRATOR| T1   | 01_governance       | Kompilacja artefaktów MVP; bramka PCS ≥ 0.990        | L3, L1              |
| S11-SENTINEL        | T1   | 01_governance/S11   | Sterylizacja leksykalna; blokada SIGNAL_NOISE        | L3                  |
| BOUNDARY-GUARD      | T1   | 04_packages / 03_ee | Egzekucja RULE-DOM-001; WORLDHALT przy naruszeniu    | L3                  |
| JITAI-KERNEL        | T2   | 03_ee               | Adaptacyjne interwencje w TIMING_WINDOW              | L0 (przez kontrakt) |
| PATTERN-EXTRACTOR   | T2   | 05_apps/patternlens | Ekstrakcja BEHAVIORAL_CLUSTER z szeregów             | L1, L2 (przez SDK)  |
| COMPILED-AI-RUNNER  | T0   | runtime             | Deterministyczne wykonanie Φ-Ritual; zero RNG        | brak dostępu do L0  |

---

## AGENTS — KONTRAKTY WARSTW

| Warstwa | Dane               | Dostęp agentów T1  | Dostęp agentów T2              |
|---------|--------------------|--------------------|--------------------------------|
| L0      | TIMING_WINDOW, JITAI, φ-events | NIE — tylko przez jawny kontrakt | TAK — wyłącznie przez `@silence/contracts` |
| L1      | BEHAVIORAL_CLUSTER | TAK                | TAK                            |
| L2      | SIGNAL_VECTOR      | TAK                | TAK — brak dostępu do L0 bezpośrednio |
| L3      | PCS, AUDIT_TRAIL   | TAK                | NIE                            |

---

## AGENTS — BOUNDARY RULES

- Agent T2 nie może uzyskać dostępu do L0 bez jawnego kontraktu zatwierdzonego w `01_governance`
- `JITAI-KERNEL` komunikuje się z `05_apps` wyłącznie przez `@silence/sdk`
- `COMPILED-AI-RUNNER` nie zawiera żadnego źródła czasu innego niż derywaty φ
- Zakaz przechowywania instrukcji agentów w historii czatu — jedyne SSoT: ten plik

---

## AGENTS — CI GATES

| Gate           | Zakres                   | Blokuje | Warunek PASS                      |
|----------------|--------------------------|---------|-----------------------------------|
| pcs-gate       | każdy PR modyfikujący T2 | merge   | pcs_status ≥ 0.990                |
| s11-check      | wszystkie PR             | merge   | zero SIGNAL_NOISE w identyfikatorach |
| boundary-check | PR dot. agentów T2       | merge   | brak dostępu L2→L0 bez kontraktu  |

---

## AGENTS — EFFECTLOG ENTRY TEMPLATE

```text
S11.COMMIT.ID: SILENCE-AGENTS-20260624-001
prevHash: INIT-AGENTS-000
EVENT: AGENTS_COMPILED
TIMESTAMP: 2026-06-24T01:17:00Z
PATH: 01_governance/AGENTS.md
CLASS: DEFINITION / USABLE_DIRECTLY
PCS: 1.000
BOUNDARY_STATUS: RULE-DOM-001_PASS
S11_STATUS: CLEAN
LENGTH_LINES: <oblicz przy commit>
```
