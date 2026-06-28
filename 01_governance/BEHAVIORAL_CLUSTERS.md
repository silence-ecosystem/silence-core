---
title: BEHAVIORAL_CLUSTERS
version: v1.0.0
date: 2026-06-24
owner: SYSTEM.ARCHITECT
status: ACTIVE
pcs_status: 1.000
sentinel: S11_ENFORCED
scope: 01_governance/BEHAVIORAL_CLUSTERS
ssot: true
---

S11.COMMIT.ID: SILENCE-BEHAVIORAL-CLUSTERS-20260624-001
prevHash: INIT-BEHAVIORAL-CLUSTERS-000
STATUS: ACTIVE
PCS: 1.000
RIGOR: S11_SENTINEL_ENFORCED

---

## BEHAVIORAL_CLUSTERS — META

| Pole            | Wartość                                              |
|-----------------|------------------------------------------------------|
| Wersja          | v1.0.0-STABLE                                        |
| Owner           | SYSTEM.ARCHITECT                                     |
| Klasa artefaktu | DEFINITION / USABLE_DIRECTLY                         |
| Ścieżka SSoT    | 01_governance/BEHAVIORAL_CLUSTERS.md                 |
| Status PCS      | 1.000 / PCS_GATE: 0.990                              |
| Zastępuje       | User Personas (terminologia kliniczna — SIGNAL_NOISE)|
| RULE-DOM-001    | ACTIVE                                               |

---

## BEHAVIORAL_CLUSTERS — MATH_CORE MAPPING

| Parametr               | Wartość | Derywacja φ    |
|------------------------|---------|----------------|
| GOLDENSECOND           | 1618 ms | φ × 1000       |
| TIMING_WINDOW_ENTRY    | 1618 ms | GOLDENSECOND   |
| TIMING_WINDOW_DEEPENING| 2618 ms | φ² × 1000      |
| TIMING_WINDOW_RETURN   | 4236 ms | φ³ × 1000      |
| TENSION_SCORE_HIGH     | 0.850   | 1 − (1/φ²)     |
| TENSION_SCORE_BASELINE | 0.618   | 1/φ            |
| ATTENTION_DRIFT_FLOOR  | 0.382   | 1 − (1/φ)      |
| FIBONACCI_LEVELS       | {1,2,3,5,8,13,21} | ciąg kanoniczny |

---

## BEHAVIORAL_CLUSTERS — KONTRAKT KLASTRÓW

Klaster jest grupowaniem statystycznym wzorców interakcji (BEHAVIORAL_CLUSTER).
Klaster NIE jest diagnozą medyczną ani etykietą kliniczną.

| ID Klastra  | Sygnatura wzorca                              | TENSION_SCORE | TIMING_WINDOW aktywny  |
|-------------|-----------------------------------------------|---------------|------------------------|
| BC-01       | Wysoka częstość przełączania (≥8/h)          | ≥ 0.850       | TIMING_WINDOW_ENTRY    |
| BC-02       | Przedłużona supresja aktywacji (≥14 dni)     | ≤ 0.382       | TIMING_WINDOW_DEEPENING|
| BC-03       | Cykliczne wahania rytmu (3-dniowy cykl)       | 0.382–0.618   | TIMING_WINDOW_RETURN   |
| BC-04       | Rozproszenie zasobów (ATTENTION_DRIFT)       | 0.618–0.850 | TIMING_WINDOW_ENTRY  |
| BC-05       | Stabilny profil (ATTENTION_PROFILE)           | 0.500–0.618   | GOLDENSECOND           |

---

## BEHAVIORAL_CLUSTERS — BOUNDARY RULES

- BEHAVIORAL_CLUSTER jest jedynym dozwolonym terminem dla grupowania wzorców USER_NODE
- Zakaz: diagnoza, zaburzenie, pacjent, terapia, leczenie — mapowanie S11 obowiązkowe
- Klastry dostępne dla agentów L2 wyłącznie przez `@silence/contracts`
- Surowce L0 (okna receptywności, timing JITAI) dostępne tylko przez jawny kontrakt w `01_governance`

---

## BEHAVIORAL_CLUSTERS — S11 MAPPING OBOWIĄZKOWE

| Termin zakazany (SIGNAL_NOISE)  | Termin kanoniczny S11     | Uzasadnienie numeryczne                        |
|---------------------------------|---------------------------|------------------------------------------------|
| diagnoza                        | BEHAVIORAL_CLUSTER        | Grupowanie statystyczne wzorców                |
| stres / lęk                     | TENSION_SCORE             | Mierzalne napięcie sygnału                     |
| niepokój / błąd                 | STATE_VIOLATION           | Naruszenie niezmienników systemu               |
| chaos / bałagan                 | SIGNAL_NOISE              | Zakłócenia w czystości danych                  |
| fokus                           | ATTENTION_PROFILE         | Profil dystrybucji zasobów poznawczych         |
| terapia / leczenie              | STRUCTURAL_REFLECTION     | Proces analizy i korekty wzorca                |
| pacjent / klient                | USER_NODE                 | Jednostka w sieci szeregów czasowych           |
| nastrój                         | ACTIVATION_STATE          | Stan automatu FSM-Φ                            |
| emocja                          | SIGNAL_VECTOR             | Wektor sygnałowy w przestrzeni φ               |

---

## BEHAVIORAL_CLUSTERS — CI GATES

| Gate           | Zakres                          | Blokuje | Warunek PASS                        |
|----------------|---------------------------------|---------|-------------------------------------|
| s11-check      | każdy PR modyfikujący BC        | merge   | zero terminów z SIGNAL_NOISE        |
| pcs-gate       | PR do 01_governance             | merge   | pcs_status ≥ 0.990                  |
| boundary-check | każdy PR                        | merge   | brak importów 03_ee                 |

---

## BEHAVIORAL_CLUSTERS — EFFECTLOG ENTRY TEMPLATE

```text
S11.COMMIT.ID: SILENCE-BEHAVIORAL-CLUSTERS-20260624-001
prevHash: INIT-BEHAVIORAL-CLUSTERS-000
EVENT: BEHAVIORAL_CLUSTERS_COMPILED
TIMESTAMP: 2026-06-24T01:17:00Z
PATH: 01_governance/BEHAVIORAL_CLUSTERS.md
CLASS: DEFINITION / USABLE_DIRECTLY
PCS: 1.000
BOUNDARY_STATUS: RULE-DOM-001_PASS
S11_STATUS: CLEAN
LENGTH_LINES: <oblicz przy commit>
```
