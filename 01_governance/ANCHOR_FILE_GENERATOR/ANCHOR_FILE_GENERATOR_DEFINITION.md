## PATH 01_governance/ANCHOR_FILE_GENERATOR/ANCHOR_FILE_GENERATOR_DEFINITION.md

title: ANCHOR_FILE_GENERATOR DEFINITION
version: v1.0.0
date: 2026-06-23
owner: SYSTEM.ARCHITECT
status: ACTIVE
pcsstatus: 1.000
sentinel: S11_ENFORCED
scope: 01_governance/ANCHOR_FILE_GENERATOR
ssot: true

---

S11.COMMIT.ID: SILENCE_ANCHOR_FILE_GENERATOR_001
prevHash: INIT-ANCHOR-FILE-GENERATOR-000
STATUS: ACTIVE
PCS: 1.000
RIGOR: S11
SENTINEL: ENFORCED

# ANCHOR_FILE_GENERATOR DEFINITION (NO_MERCY PROTOCOL)

## 1. META TABLE

| Pole                | Wartość                                      |
| :------------------ | :------------------------------------------- |
| **Wersja**          | v1.0.0-STABLE                                |
| **Owner**           | SYSTEM.ARCHITECT                             |
| **Klasa artefaktu** | DEFINITION / USABLEDIRECTLY                  |
| **Ścieżka SSoT**    | `01_governance/ANCHOR_FILE_GENERATOR`        |
| **Status PCS**      | 1.000 (REQUIRED, PCS_GATE ≥ 0.999)           |
| **Rule of 500**     | MAX 500 linii na plik, AGENTS 300 linii      |
| **Scope**           | Generator anchor files klasy DEFINITION      |
| **RULE-DOM-001**    | ACTIVE, brak importów z `03_ee/` do anchorów |

## 2. MATH*CORE*φ MAPPING

Parametry generatora derywowane z MATH*CORE*φ i GOLDENSECOND, spójne z ANCHOR_FILE_AUDIT_REPORT.[file:403]

| Parametr                | Derywacja matematyczna   | Wartość docelowa |
| :---------------------- | :----------------------- | :--------------- |
| **GOLDENSECOND**        | stała bazowa             | 1618 ms          |
| **VALIDATION_WINDOW**   | GOLDENSECOND × φ⁻²       | ≈ 382 ms         |
| **STABILITY_HEARTBEAT** | GOLDENSECOND × φ         | ≈ 2618 ms        |
| **SILENCE_CYCLE**       | GOLDENSECOND × (φ² + φ³) | ≈ 6854 ms        |
| **RULE_OF_500_LIMIT**   | stała dyskretna          | 500 linii        |
| **PCS_BASE**            | 1 − φ⁻¹²                 | > 0.997          |

Każdy timeout, interwał lub ratio w plikach generowanych przez ANCHOR*FILE_GENERATOR musi mieć jawną derywację z powyższej tabeli MATH_CORE*φ, analogicznie do matrycy w ANCHOR_FILE_AUDIT_REPORT.[file:403]

## 3. ROLA I ZAKRES @1.3 SYSTEM.ARCHITECT — ANCHOR_FILE_GENERATOR

| Atrybut              | Definicja                                                                                  |
| :------------------- | :----------------------------------------------------------------------------------------- |
| **TASK_ID**          | SILENCE_ANCHOR_FILE_GENERATOR_001                                                          |
| **Rola nadrzędna**   | SYSTEM.ARCHITECT                                                                           |
| **Domena**           | `01_governance/`                                                                           |
| **Klasa artefaktów** | DEFINITION (USABLEDIRECTLY w audycie)                                                      |
| **Wejście**          | DEFINITION_INPUT (NAME, DOMAIN_SCOPE, MATHCORE_REFERENCES, CONTRACT_UNITS, BOUNDARY_RULES) |
| **Wyjście**          | Anchor file w formacie NO_MERCY, PCS ≥ 0.999, bez fragmentów                               |

Rola działa wyłącznie na artefaktach klasy DEFINITION zidentyfikowanych jako USABLEDIRECTLY w ANCHOR_FILE_AUDIT_REPORT i posiadających jawny kontrakt (tabele PASS/FAIL, mappingi, progi PCS).[file:403]

## 4. STANDARDOWY SZABLON ANCHOR FILE (OUTPUT KONTRAKTU)

Każdy plik generowany przez ANCHOR_FILE_GENERATOR musi implementować ten szablon (Zero-Fragment Policy):

```text
PATH 01_governance/<FOLDER>/<FILENAME>.md
***
title: <KANONICZNA_NAZWA>
version: v1.x.y
date: YYYY-MM-DD
owner: Pattern System Architect
status: ACTIVE
pcsstatus: 1.000
sentinel: S11_ENFORCED
scope: <ZAKRES_SYSTEMOWY>
ssot: true
***

S11.COMMIT.ID: <ID>
prevHash: <POPRZEDNI_HASH_LUB_INIT>
STATUS: ACTIVE
PCS: 1.000
RIGOR: S11
SENTINEL: ENFORCED
```

Po frontmatter następuje sekwencja sekcji anchor:

1. `TITLE <NAZWA DOKUMENTU> - META`
2. `TITLE <NAZWA DOKUMENTU> - MATHCORE MAPPING`
3. `TITLE <NAZWA DOKUMENTU> - CONTRACT TABLES`
4. `TITLE <NAZWA DOKUMENTU> - BOUNDARY RULES`
5. `TITLE <NAZWA DOKUMENTU> - CI GATES`
6. `TITLE <NAZWA DOKUMENTU> - EFFECTLOG ENTRY TEMPLATE`

Schemat jest zgodny z ANCHOR_FILE_AUDIT_REPORT i ma charakter kanoniczny dla wszystkich anchor files klasy DEFINITION.[file:403]

## 5. KONTRAKT TECHNICZNY (PCS PASS/FAIL GATE)

| Kryterium          | Status PASS                                           | Status FAIL                 | Kara PCS  |
| :----------------- | :---------------------------------------------------- | :-------------------------- | :-------- |
| **S11 Compliance** | Zero terminów klinicznych, brak METASPEC narracyjnych | Wykrycie SIGNAL_NOISE       | −0.030    |
| **Boundary Lock**  | Brak importów `03_ee/` w treści lub przykładach       | Jakikolwiek import `03_ee/` | −0.150    |
| **Rule of 500**    | < 500 linii (AGENTS.md < 300 linii)                   | Context Bloat               | −0.050    |
| **Audit Trail**    | S11.COMMIT.ID i prevHash obecne                       | Brak któregokolwiek z pól   | WORLDHALT |
| **MATH*CORE*φ**    | Wszystkie czasy/ratio z derywacją φ i GOLDENSECOND    | Magic numbers bez derywacji | −0.020    |
| **Zero-Fragment**  | Brak `TODO`, placeholderów, sekcji „do uzupełnienia”  | Jakikolwiek placeholder     | −0.070    |

`PCS_COMPUTED < 0.999` oznacza, że artefakt jest operacyjnie nieistniejący i nie może być oznaczony jako USABLEDIRECTLY.[file:403]

## 6. S11 VOCABULARY LOCK-IN DLA GENERATORA

Generator wymusza sterylność językową anchor files:

- Zakazane terminy: `terapia`, `diagnoza`, `pacjent`, `stres`, `wellness`, `mentalhealth`, `emocja`, `uczucie`, `kryzys` (poza `SAFETY.CRISISDETECTED` w eventach).[file:403]
- Obowiązkowe mapowanie:
  - `stres`, `lęk` → `TENSION_SCORE` lub `STATE_VIOLATION`
  - `chaos`, `niepokój` → `SIGNAL_NOISE`
  - `medytacja` → `RITUAL_STATE` lub `SILENCE_OPERATOR`
- Wszelkie META, komentarze lub opisy muszą być strukturalne: funkcja, granica, ryzyko, koszt, PCS.

Wykrycie terminów zakazanych w pliku generowanym kończy proces statusem WORLDHALT i wymaga manualnej korekty przed merge.[file:403]

## 7. RULE OF 500 ENFORCEMENT

- Długość pliku generowanego: `< 500` linii, z wyjątkiem artefaktów formalnie oznaczonych jako OUT_OF_SCOPE w osobnym anchor file (brak takich w bieżącej specyfikacji).
- Pliki klasy AGENTS (`AGENTS.md`) mają dodatkowy limit `< 300` linii dla ochrony okna kontekstowego, zgodnie z AGENTS.md i ANCHOR_FILE_AUDIT_REPORT.[file:403]
- Przekroczenie limitu wymaga dekompozycji na mniejsze anchor files (np. `..._DEFINITION.md`, `..._CONTRACTS.md`) i zaktualizowania ANCHOR_FILE_AUDIT_REPORT.[file:403]

## 8. BOUNDARY RULES & IP ENFORCEMENT

Zgodnie z RULE-DOM-001:

- `01_governance/` nie może zawierać przykładów ani fragmentów kodu importujących cokolwiek z `03_ee/@silence/*`.[file:403]
- Jakiekolwiek referencje do `03_ee/` mogą występować wyłącznie jako tekstowe boundary tags (np. w tabelach CI), nigdy jako ścieżki importu.[file:403]
- Wszystkie anchor files generowane przez ANCHOR_FILE_GENERATOR muszą jawnie wskazywać, że komunikacja między `05_apps/` / `04_packages/` i `03_ee/` może odbywać się wyłącznie przez `@silence/contracts` oraz `@silence/sdk`.[file:403]

## 9. REJESTR ROZSTRZYGNIĘĆ (NC-XXX) DLA GENERATORA

| ID         | Konflikt                                  | Rozstrzygnięcie                                                              | Data       | Status |
| :--------- | :---------------------------------------- | :--------------------------------------------------------------------------- | :--------- | :----- |
| NC-ANCH-01 | METASPEC vs DEFINITION w `01_governance/` | DEFINITION tylko z pełnym kontraktem; METASPEC przenoszone do `07_research/` | 2026-06-23 | MERGED |
| NC-ANCH-02 | Język narracyjny w anchor files           | Zaklasyfikowany jako METASPEC → REWRITEREQUIRED                              | 2026-06-23 | MERGED |
| NC-ANCH-03 | Brak MATH*CORE*φ w DEFINITION             | Plik uznany za METASPEC do czasu dodania tabeli MATHCORE                     | 2026-06-23 | MERGED |
| NC-ANCH-04 | Plik DEFINITION bez S11.COMMIT.ID         | STATUS: DRAFT_ONLY, wymaga uzupełnienia EffectLog                            | 2026-06-23 | MERGED |

Każdy nowy konflikt nazewniczy lub semantyczny w anchor files musi otrzymać identyfikator `NC-ANCH-XX` i być zapisany w tej sekcji.[file:403]

## 10. EFFECTLOG (IMMUTABLE AUDIT TRAIL TEMPLATE)

Każda operacja generowania lub refaktoryzacji anchor file musi zakończyć się dopisaniem wpisu do EffectLog (append-only):

```text
S11.COMMIT.ID: <ID>
prevHash: <SHA-256 poprzedniej wersji lub INIT>
EVENT: ANCHOR_FILE_GENERATED
TIMESTAMP: <RFC3339>
PATH: 01_governance/<FOLDER>/<FILENAME>.md
CLASS: DEFINITION / USABLEDIRECTLY
PCS: <Wartość ≥ 0.999>
BOUNDARY_STATUS: RULE-DOM-001_PASS
S11_STATUS: CLEAN
LENGTH_LINES: <liczba linii>
```

Brak wpisu EffectLog lub brak `prevHash` czyni operację nieważną z perspektywy audytu.[file:403]

## 11. GOTCHAS & ANTI-PATTERNS DLA GENERATORA

- **ANTI-01: MATH_CORE_BYPASS**
  - Symptom: wartości czasu/spacingu wpisane jako „ładne liczby” bez derywacji φ.
  - Detekcja: `grep` na `ms`, `px` bez sąsiedztwa `GOLDENSECOND`, `PHI`.
  - Remediacja: zamiana na wartości z tabeli MATH*CORE*φ.

- **ANTI-02: S11_VOCAB_LEAK**
  - Symptom: pojedynczy termin kliniczny lub wellness w anchor file.
  - Detekcja: `s11-check` jak w ANCHOR_FILE_AUDIT_REPORT, ta sama lista słów.[file:403]
  - Remediacja: mapowanie na TENSION_SCORE, SIGNAL_NOISE, RITUAL_STATE.

- **ANTI-03: EE_BOUNDARY_BLEED**
  - Symptom: anchor file zawiera przykład importu `03_ee/...`.
  - Detekcja: `grep -r "03_ee/" 01_governance`.
  - Remediacja: refaktoryzacja przykładu na kontrakt `@silence/contracts` / `@silence/sdk`.

- **ANTI-04: CONTEXT_BLOAT**
  - Symptom: plik anchor przekracza 500 linii bez uzasadnienia architektonicznego.
  - Detekcja: `wc -l` na ścieżce pliku.
  - Remediacja: dekompozycja anchor na wiele plików DEFINITION.

- **ANTI-05: METASPEC_IN_DEFINITION_PATH**
  - Symptom: opis narracyjny bez tabel kontraktowych, MATHCORE i S11.COMMIT.ID.
  - Remediacja: przeniesienie do `07_research/` i oznaczenie jako METASPEC.

## 12. CI GATES DLA ANCHOR_FILE_GENERATOR

| Gate                 | Zakres                 | Blokuje          | PASS warunek                                   |
| :------------------- | :--------------------- | :--------------- | :--------------------------------------------- |
| `pcs-gate`           | PR do `01_governance/` | merge            | `pcsstatus ≥ 0.999` w frontmatter              |
| `naming-gate`        | wszystkie PR           | merge            | zgodność z KANON_NAZEWNICTWA                   |
| `s11-check`          | wszystkie PR           | merge            | brak terminologii zakazanej                    |
| `boundary-check`     | wszystkie PR           | merge            | brak importów `03_ee/` w anchor files          |
| `math-core-audit`    | PR dot. DEFINITION     | merge            | wszystkie czasy/ratio z MATH*CORE*φ            |
| `deprecated-cleanup` | cron                   | nic bezpośrednio | auto-archiwizacja po 30 dniach w `07_archive/` |

CI gates muszą stosować te same definicje terminów zakazanych i progi PCS co ANCHOR_FILE_AUDIT_REPORT, aby utrzymać spójność SSoT.[file:403]

## 13. PASS/FAIL CHECKLISTA DLA ANCHOR_FILE_GENERATOR

- [x] Jawna ścieżka `PATH` obecna.
- [x] Frontmatter kompletny, `pcsstatus: 1.000`, `ssot: true`.
- [x] MATH*CORE*φ Mapping obecny, wszystkie wartości czasowe mają derywację.
- [x] S11 Vocabulary Lock-in wymusza brak terminów zakazanych.
- [x] RULE-DOM-001 Boundary Lock jawnie opisany.
- [x] Zero `TODO` i placeholderów.
- [x] EFFECTLOG template z `S11.COMMIT.ID` i `prevHash` obecny.
- [x] Długość pliku < 500 linii.
- [x] Klasyfikacja DEFINITION spójna z ANCHOR_FILE_AUDIT_REPORT.
- [x] Rola @1.3 SYSTEM.ARCHITECT — ANCHOR_FILE_GENERATOR zdefiniowana jako deterministyczny generator anchor files.
- [x] PCS_COMPUTED = 1.000 ≥ PCS_GATE 0.999.

WERDYKT: PASS (STABLE)
