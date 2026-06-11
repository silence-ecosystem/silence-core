[PATH]: 01_governance/ARCH/REPO-NAMING-DECISION.md

---

title: REPO-NAMING-DECISION
status: PRODUKCJA (IMMUTABLE)
created: 2026-06-06
updated: 2026-06-06
author: silence-architect
classification: SSoT
sentinel: S11_ENFORCED
pcs: 0.999

---

# REPO NAMING DECISION — `silence-ecosystem`

## 1. ZAKRES

Niniejszy artefakt ustanawia kanoniczne nazwy repozytoriów organizacji `silence-ecosystem` zgodnie z rozstrzygnięciami nazewniczymi oraz regułą eliminacji redundancji. Nazwa repozytorium musi być lowercase, kebab-case, bez sufiksów redundantnych i bez semantycznego dublowania warstwy katalogowej.

## 2. REGUŁA KANONICZNA

Repozytoria publiczne i prywatne przyjmują nazwy krótkie, jednoznaczne i zgodne z funkcją warstwy. Sufiksy typu `-ee`, `-gateway`, `-protocol`, `-repo`, `-monolith` są zakazane, jeżeli informacja ta wynika już z klasy repozytorium, domeny albo lokalizacji systemowej.

## 3. MAPOWANIE KANONICZNE

| Stara lub niespójna nazwa | Nazwa kanoniczna        | Status        |
| ------------------------- | ----------------------- | ------------- |
| `Patternslab-ecosystem`   | `silence-ecosystem`     | REPLACE       |
| `RESEARCH`                | `silence-research`      | REPLACE       |
| `silence-research-open`   | `silence-research-open` | KEEP          |
| `silence-core-open`       | `behavior-core`         | REPLACE       |
| `silence-contracts`       | `behavior-contracts`    | REPLACE       |
| `silence-apps`            | `silence-apps`          | KEEP          |
| `behavior-enterprise`     | `behavior-enterprise`   | KEEP          |
| `silence-monorepo`        | `silence-monorepo`      | KEEP INTERNAL |

## 4. REGUŁA EGZEKUCJI

Każdy link, ADR, README, mapa ekosystemu oraz odwołanie kontraktowe musi używać nazwy kanonicznej. Nazwa spoza tej tabeli jest traktowana jako `SIGNAL_NOISE`, chyba że została jawnie dopisana do rejestru konfliktów nazewniczych.

Zmiana nazwy repozytorium wymaga jednoczesnej aktualizacji dokumentów powiązanych, linków do GitHub, map zależności i śladów audytowych. Brak pełnej relokacji referencji oznacza stan niezamknięty i blokadę publikacji.

## 5. UWAGI DLA ADR-004 I ADR-005

W treści ADR-004 należy używać `silence-research` oraz `silence-research-open`. W treści ADR-005 warstwa publicznego schematu i warstwa prywatnych walidatorów powinny być opisywane nazwami kanonicznymi repozytoriów aktualnymi dla organizacji `silence-ecosystem`, bez mieszania starego prefiksu `Patternslab`.

## 6. EFFECTLOG

- `2026-06-06T19:00:00Z` — DEFINE — Ustalono kanoniczne nazwy repozytoriów organizacji `silence-ecosystem`.
- `2026-06-06T19:00:01Z` — ENFORCE — Wprowadzono zasadę traktowania nazwy spoza mapy jako `SIGNAL_NOISE`.
- `2026-06-06T19:00:02Z` — STABILIZE — Powiązano decyzję nazewniczą z ADR-004 i ADR-005.
