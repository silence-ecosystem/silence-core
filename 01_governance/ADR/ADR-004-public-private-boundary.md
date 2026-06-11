[PATH]: 01_governance/ADR/ADR-004-public-private-boundary.md

---

title: ADR-004-PUBLIC-PRIVATE-BOUNDARY
status: PRODUKCJA (IMMUTABLE)
date: 2026-03-31
author: silence-architect
classification: SSoT
sentinel: S11_ENFORCED
adr_status: ACCEPTED
supersedes: none
pcs: 0.999

---

# ADR-004 — FORMAL PUBLIC/PRIVATE BOUNDARY FOR RESEARCH CONTENT

## 1. ZAKRES DECYZJI

Niniejszy artefakt ustanawia twardą granicę pomiędzy warstwą badawczą prywatną a warstwą badawczą publiczną w ekosystemie SILENCE. Granica obejmuje repozytoria badań, dokumenty governance, dane inwestorskie, artefakty compliance oraz reguły transferu treści pomiędzy bytami o odmiennym modelu jawności.

## 2. KONTEKST OPERACYJNY

Ekosystem utrzymuje dwa odrębne repozytoria badawcze. Repozytorium `silence-research` pełni funkcję warstwy prywatnej i zawiera materiały właścicielskie, dane strategiczne oraz artefakty o podwyższonej wrażliwości. Repozytorium `silence-research-open` pełni funkcję warstwy publicznej i zawiera wyłącznie treści przeznaczone do jawnej publikacji.

Brak formalnej granicy powoduje trzy klasy uszkodzeń systemowych: wyciek IP, ekspozycję danych strategicznych oraz dryft źródła prawdy. Dodatkowo utrzymywanie modelu granicznego wyłącznie implicite, poza wersjonowaną dokumentacją, generuje błąd governance i uniemożliwia audyt deterministyczny.

## 3. DECYZJA

Przyjmuje się formalną granicę public/private dla treści badawczych.

### 3.1 Repozytorium prywatne `silence-research`

Repozytorium prywatne zawiera wyłącznie:

- Command Center KPI dashboards (`*.xlsx`)
- nieopublikowane hipotezy badawcze
- strategię IP oraz analizy konkurencyjne
- dane inwestorskie, projekcje finansowe i dokumenty transakcyjne
- wewnętrzne ADR odnoszące się do systemów właścicielskich
- dane identyfikujące lub odwracalnie agregowane

### 3.2 Repozytorium publiczne `silence-research-open`

Repozytorium publiczne zawiera wyłącznie:

- metodologię Benchmark 2030 bez celów wewnętrznych
- publiczną dokumentację architektury φ-engine
- publiczne stanowiska compliance związane z EU AI Act
- opublikowane i zwalidowane wyniki badań
- otwarte standardy governance i polityki językowe

### 3.3 Research Gate

Każdy transfer z `silence-research` do `silence-research-open` wymaga jednoczesnego spełnienia wszystkich warunków:

1. PR w `silence-research-open` z etykietą `research-gate`
2. obowiązkowy review przez właściciela granicy
3. kompletna checklista `RESEARCH-GATE.md`
4. wpis śladu audytowego w dokumencie źródłowym

### 3.4 Model repozytoryjny

Ustanawia się model federated polyrepo. Warstwa publiczna i prywatna pozostają oddzielone fizycznie, ponieważ mają odmienne klasy bezpieczeństwa, odmienne cykle zmian, odmienne audytorie review oraz odmienne obowiązki compliance.

## 4. REGUŁA EGZEKUCJI

Żaden byt z `silence-research-open` nie może zawierać nieopublikowanych hipotez, danych inwestorskich, materiału właścicielskiego ani odwracalnych agregatów. Żaden byt z `silence-research` nie może być traktowany jako automatycznie gotowy do publikacji bez przejścia przez Research Gate.

Każde naruszenie granicy jest klasyfikowane jako `IP_BOUNDARY_BLOCK`. Artefakt naruszający granicę traci ważność publikacyjną i podlega natychmiastowemu cofnięciu z obiegu.

## 5. KONSEKWENCJE

### 5.1 Skutki dodatnie

Granica stabilizuje ochronę IP, przywraca audytowalność przepływu treści, wzmacnia gotowość compliance oraz eliminuje dryft SSoT. Umożliwia również due diligence wobec partnerów, inwestorów i kontroli regulacyjnej.

### 5.2 Skutki ujemne

Proces transferu staje się cięższy operacyjnie, ponieważ każda publikacja wymaga formalnego review i checklisty. W krótkim oknie migracyjnym może również wystąpić czasowa duplikacja treści pomiędzy repozytoriami.

### 5.3 Skutki neutralne

Decyzja nie zmienia natury samych treści. Zmienia wyłącznie ich lokalizację, ścieżkę transferu i warunki zatwierdzania.

## 6. ARTEFAKTY POWIĄZANE

- `GOVERNANCE.md`
- `RESEARCH-GATE.md`
- `ECOSYSTEM-MAP.md`
- `ADR-001`
- `ADR-002`
- `ADR-003`

## 7. MATH_CORE

| Parametr          | Stała Bazowa   | Derywacja               | Wartość Operacyjna |
| ----------------- | -------------- | ----------------------- | ------------------ |
| PCS Threshold     | `PCS_BASE`     | $$1 - \phi^{-12}$$      | > 0.997            |
| Validation Window | `GOLDENSECOND` | $$GS \times \phi^{-2}$$ | ~382ms             |
| Sync Interval     | `GOLDENSECOND` | $$GS \times \phi^{2}$$  | ~2618ms            |
| Layout Ratio      | `PHI_INVERSE`  | $$1 : \phi$$            | 0.618              |

## 8. EFFECTLOG

- `2026-03-31T00:00:00Z` — DEFINE — Ustanowiono granicę public/private dla warstwy research.
- `2026-03-31T00:00:01Z` — ENFORCE — Wymuszono Research Gate dla każdego transferu prywatne → publiczne.
- `2026-03-31T00:00:02Z` — STABILIZE — Ustanowiono federated polyrepo jako model trwały.
