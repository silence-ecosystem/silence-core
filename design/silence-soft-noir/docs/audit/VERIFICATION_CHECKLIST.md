# Checklista Weryfikacyjna Soft-Noir — 8/8 PASS

**[PATH]: docs/audit/VERIFICATION_CHECKLIST.md**

STATUS: CANONICAL | DATA: 2026-06-11

---

Dokument definiuje 8 bloków weryfikacyjnych wymaganych przed każdym merge/deploy.
Wszystkie bloki muszą osiągnąć status PASS. Jeden FAIL = blokada wdrożenia.

Audytor wypełnia tabelę PASS/FAIL i podpisuje każdy blok.
Brak wypełnienia = brak zgody na merge.

---

## BLOK 1: Zakaz ekstremów (Zero Extremes)

| Test | Wynik | Uwaga |
|---|---|---|
| Brak #000000 w tokenach, CSS, SVG, HTML | [ ] PASS / [ ] FAIL | |
| Brak #FFFFFF w tokenach, CSS, SVG, HTML | [ ] PASS / [ ] FAIL | |
| Fallbacki przeglądarki nadpisane tokenami | [ ] PASS / [ ] FAIL | |
| Stany disabled mają jawny token koloru | [ ] PASS / [ ] FAIL | |
| Placeholdery formularzy mają jawny token | [ ] PASS / [ ] FAIL | |

**BLOK 1 STATUS: [ ] PASS / [ ] FAIL**
Audytor: __________________ Data: __________________

---

## BLOK 2: Tokeny i architektura (Token Architecture)

| Test | Wynik | Uwaga |
|---|---|---|
| Zero magic numbers dla koloru w kodzie | [ ] PASS / [ ] FAIL | |
| Zero magic numbers dla spacingu w kodzie | [ ] PASS / [ ] FAIL | |
| Zero magic numbers dla timingu w kodzie | [ ] PASS / [ ] FAIL | |
| Zero lokalnych nadpisań tokenów w CSS komponentów | [ ] PASS / [ ] FAIL | |
| Wszystkie nowe wartości zapisane w phi-tokens | [ ] PASS / [ ] FAIL | |

**BLOK 2 STATUS: [ ] PASS / [ ] FAIL**
Audytor: __________________ Data: __________________

---

## BLOK 3: Hierarchia jasności (Luminance Tiers)

| Test | Wynik | Uwaga |
|---|---|---|
| Wszystkie powierzchnie strukturalne mają tier 0–4 | [ ] PASS / [ ] FAIL | |
| Brak wartości między-tierowych dla elementów strukturalnych | [ ] PASS / [ ] FAIL | |
| Karta/modal ≤ 2 tiery powyżej tła bazowego | [ ] PASS / [ ] FAIL | |
| Hover stany nie tworzą wartości między-tierowych | [ ] PASS / [ ] FAIL | |
| Lₙ = L₀ × (√φ)ⁿ — tiery zgodne z formułą | [ ] PASS / [ ] FAIL | |

**BLOK 3 STATUS: [ ] PASS / [ ] FAIL**
Audytor: __________________ Data: __________________

---

## BLOK 4: Proporcje i spacing (Golden Ratio & Fibonacci)

| Test | Wynik | Uwaga |
|---|---|---|
| Layout główny: 61.8% / 38.2% | [ ] PASS / [ ] FAIL | |
| Złoty prostokąt jako kotwica głównego modułu | [ ] PASS / [ ] FAIL | |
| Spacing wyłącznie ze skali Fib (3,5,8,13,21,34,55) | [ ] PASS / [ ] FAIL | |
| Liczba kroków procesów ∈ {3,5,8,13,21} | [ ] PASS / [ ] FAIL | |
| Brak arbitralnych wartości paddingu/marginesu | [ ] PASS / [ ] FAIL | |

**BLOK 4 STATUS: [ ] PASS / [ ] FAIL**
Audytor: __________________ Data: __________________

---

## BLOK 5: Czas i motion (φ-Timing)

| Test | Wynik | Uwaga |
|---|---|---|
| Wszystkie timingi z tokeny dur.* | [ ] PASS / [ ] FAIL | |
| Brak 500ms, 300ms, 1000ms poza skalą φ | [ ] PASS / [ ] FAIL | |
| Cykl Golden Silence: Entry/Deepening/Silence/Return | [ ] PASS / [ ] FAIL | |
| Faza Silence ma realny czas bezruchu (>0ms) | [ ] PASS / [ ] FAIL | |
| prefers-reduced-motion: animacje wyłączone/skrócone | [ ] PASS / [ ] FAIL | |

**BLOK 5 STATUS: [ ] PASS / [ ] FAIL**
Audytor: __________________ Data: __________________

---

## BLOK 6: Stany i motywy (States & Themes)

| Test | Wynik | Uwaga |
|---|---|---|
| Flow/Focus/Calm są wspierane przez każdy motyw | [ ] PASS / [ ] FAIL | |
| Brak bezpośredniego przejścia Calm → Flow | [ ] PASS / [ ] FAIL | |
| Każdy motyw: visual + audio + haptic kompletne | [ ] PASS / [ ] FAIL | |
| Przejścia stanów mapowane na φ-timingi | [ ] PASS / [ ] FAIL | |
| Komponenty domyślnie działają w Focus | [ ] PASS / [ ] FAIL | |

**BLOK 6 STATUS: [ ] PASS / [ ] FAIL**
Audytor: __________________ Data: __________________

---

## BLOK 7: Dostępność (Accessibility)

| Test | Wynik | Uwaga |
|---|---|---|
| Kontrast tekstu głównego ≥ 4.5:1 | [ ] PASS / [ ] FAIL | wartość: ___:1 |
| Kontrast CTA/nawigacja ≥ AA we wszystkich stanach | [ ] PASS / [ ] FAIL | |
| Kontrast w hover/focus/active/disabled zweryfikowany | [ ] PASS / [ ] FAIL | |
| Focus ring widoczny na wszystkich tłach | [ ] PASS / [ ] FAIL | |
| prefers-reduced-motion implementacja kompletna | [ ] PASS / [ ] FAIL | |

**BLOK 7 STATUS: [ ] PASS / [ ] FAIL**
Audytor: __________________ Data: __________________

---

## BLOK 8: Telemetria i PCS (Compliance)

| Test | Wynik | Uwaga |
|---|---|---|
| Każda istotna interakcja generuje SilenceEventV1 | [ ] PASS / [ ] FAIL | |
| Schema JSON zgodna z silence-event-v1.schema.json | [ ] PASS / [ ] FAIL | |
| Brak PII w eventach | [ ] PASS / [ ] FAIL | |
| Brak języka klinicznego w eventach | [ ] PASS / [ ] FAIL | |
| PCS ≥ 0.97 (wynik kalkulatora) | [ ] PASS / [ ] FAIL | PCS: _____ |

**BLOK 8 STATUS: [ ] PASS / [ ] FAIL**
Audytor: __________________ Data: __________________

---

## Wynik Końcowy

| Blok | Wynik |
|---|---|
| BLOK 1: Zakaz ekstremów | [ ] PASS / [ ] FAIL |
| BLOK 2: Tokeny i architektura | [ ] PASS / [ ] FAIL |
| BLOK 3: Hierarchia jasności | [ ] PASS / [ ] FAIL |
| BLOK 4: Proporcje i spacing | [ ] PASS / [ ] FAIL |
| BLOK 5: Czas i motion | [ ] PASS / [ ] FAIL |
| BLOK 6: Stany i motywy | [ ] PASS / [ ] FAIL |
| BLOK 7: Dostępność | [ ] PASS / [ ] FAIL |
| BLOK 8: Telemetria i PCS | [ ] PASS / [ ] FAIL |

**WYNIK KOŃCOWY: ___ / 8 PASS**

Merge dozwolony tylko przy 8/8 PASS.

Podpis audytora: __________________ Data: __________________

