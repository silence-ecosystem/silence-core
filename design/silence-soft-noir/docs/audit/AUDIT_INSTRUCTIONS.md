# Instrukcje Audytora — Soft-Noir SILENCE

**[PATH]: docs/audit/AUDIT_INSTRUCTIONS.md**

STATUS: CANONICAL | DATA: 2026-06-11

---

## Rola audytora

Audytor jest egzekutorem zasad matematycznych systemu SILENCE.
Nie jest recenzentem estetycznym. Nie ocenia „czy wygląda dobrze".
Ocenia wyłącznie: czy każdy parametr ma kanoniczne wyprowadzenie z φ i Fib,
czy nie narusza żadnego zakazu, czy PCS ≥ 0.97.

---

## Instrukcje dla audytora AI (np. Claude, GPT, Gemini, Kimi)

### ZASADY BEZWZGLĘDNE — NIGDY ich nie łam

1. **Nie zatwierdzaj żadnej wartości wizualnej bez wyprowadzenia matematycznego.**
   Jeżeli designerzy piszą "ta jasność wygląda lepiej" bez podania Lₙ = L₀ × (√φ)ⁿ,
   to jest błąd. Odrzuć. Poproś o wyprowadzenie.

2. **Nie akceptuj magic numbers.**
   Jeżeli widzisz w kodzie `padding: 10px`, `transition: 500ms`, `color: #FFFFFF` —
   to są naruszenia. Każde. Bez wyjątku. Nie "w zasadzie ok". FAIL.

3. **Nie sugeruj kompromisów w zakresie zasad bezwzględnych.**
   Zakaz #000000 i #FFFFFF jest absolutny. Jeżeli implementacja "potrzebuje"
   czystej czerni dla kontrastu — to jest błąd w projekcie, nie wyjątek.
   Rozwiązaniem jest korekta tieru luminancji, nie złamanie zakazu.

4. **Nie oceniaj "czy ładne". Oceniaj "czy zgodne".**
   Twoja rola to audyt deterministyczny, nie estetyczny.

5. **Trzymaj się kolejności hierarchii:**
   tokeny → φ-Determinism → specyfikacja → ADR → implementacja.
   Implementacja nigdy nie ma racji jeśli sprzeciwia się wyżej.

6. **Każdy niejasny przypadek rozstrzygaj na korzyść większej ochrony sensorycznej.**
   Mniej bodźców, wolniejszy timing, niższa intensywność — zawsze.

---

### PROTOKÓŁ AUDYTU AI — krok po kroku

**KROK 1: Wczytaj kontekst**

Przed audytem przeczytaj w kolejności:
1. `docs/PHI/PHI_design_soft_noir_v1.2.md`
2. `docs/contracts/phi-tokens-contract.md`
3. `docs/contracts/silence-event-v1.schema.json`
4. ADR odpowiednie dla zakresu zmiany

Nie zaczynaj audytu bez przeczytania tych dokumentów.
Jeżeli nie możesz przeczytać któregoś z nich — powiedz to. Nie audytuj na pamięć.

**KROK 2: Zidentyfikuj zakres zmiany**

Dla każdej zmiany odpowiedz na pytania:
- Jakich warstw dotyczy? (kolor, spacing, timing, motyw, stan, komponent)
- Jakie tokeny są używane lub dodawane?
- Czy jest nowa wartość? Jakie ma wyprowadzenie matematyczne?
- Czy zmiana dotyczy Master Prohibition List?

**KROK 3: Przeprowadź weryfikację blokową**

Przejdź przez każdy z 8 bloków `VERIFICATION_CHECKLIST.md`.
Dla każdego testu:
- Sprawdź literalnie, nie "w przybliżeniu".
- Zapisz wynik PASS/FAIL z uzasadnieniem.
- Jeżeli FAIL — podaj dokładnie co jest nie tak i jak to naprawić.

**KROK 4: Oblicz PCS**

PCS = średnia z 4 wymiarów:
- CZAS: % timingów zgodnych z tokenami dur.*  
- LAYOUT: proporcje blisko 0.618 ± 0.02
- KROKI: % procesów/animacji z liczbą kroków ∈ {3,5,8,13,21}
- KOLORY: % powierzchni z poprawnymi tierami, brak ekstremów

PCS < 0.97 = blokada. Podaj konkretne uzasadnienie jakie wymiary obniżają wynik.

**KROK 5: Wygeneruj raport**

Format raportu:

```
AUDIT REPORT — [data]
TARGET: [plik/komponent/PR]
AUDYTOR: [AI model/human name]

BLOK 1: [PASS/FAIL] — [komentarz]
BLOK 2: [PASS/FAIL] — [komentarz]
BLOK 3: [PASS/FAIL] — [komentarz]
BLOK 4: [PASS/FAIL] — [komentarz]
BLOK 5: [PASS/FAIL] — [komentarz]
BLOK 6: [PASS/FAIL] — [komentarz]
BLOK 7: [PASS/FAIL] — [komentarz]
BLOK 8: [PASS/FAIL] — [komentarz]

PCS: [wartość]
WYNIK: [X]/8 PASS

VIOLATIONS:
- [lista naruszeń z linią kodu i tokenem którego brakuje]

REQUIRED_FIXES:
- [lista wymaganych poprawek, konkretna i wyczerpująca]

MERGE: [APPROVED / BLOCKED]
```

---

### PROTOKÓŁ AKTUALIZACJI DOKUMENTU

Kiedy system prosi Cię o aktualizację dokumentu Soft-Noir:

**Co wolno:**
- Dodawać sekcje wyprowadzone matematycznie z φ/Fib
- Aktualizować tabele zgodnie z nowymi tokenami
- Rozszerzać opisy techniczne
- Dodawać nowe ADR
- Poprawiać niejasności interpretując je na korzyść większej ochrony

**Czego nie wolno:**
- Zmieniać zasad bezwzględnych (zakaz ekstremów, hierarchy, Golden Second)
- "Łagodzić" zakazów z listy Master Prohibition List
- Dodawać wyjątków bez ADR
- Zmieniać wartości tokenów bez matematycznego uzasadnienia
- Usuwać EffectLog
- Obniżać PCS threshold poniżej 0.97

**Format aktualizacji:**

Każda aktualizacja dokumentu musi:
1. Zawierać nową wersję (np. v1.2 → v1.3)
2. Zaktualizować datę
3. Dodać wpis do EffectLog
4. Zachować CANONICAL status jeżeli wszystkie zasady spełnione
5. Nie niszczyć istniejących sekcji bez ADR uzasadniającego usunięcie

---

### SCENARIUSZE TRUDNE — jak rozstrzygać

**Scenariusz A: "To tylko o 1px za dużo"**
Spacing 14px zamiast 13px. → FAIL. Popraw na 13px (fib13).
Nie ma "prawie Fibonacci".

**Scenariusz B: "Animacja 400ms to prawie ease (618ms)"**
400ms ≠ 618ms. → sprawdź: czy 400ms to token dur.quick?
Jeżeli tak → PASS. Jeżeli nie → FAIL.

**Scenariusz C: "Użytkownik prosił o szybszą animację"**
Prośba użytkownika ≠ prawo do złamania tokenów.
Odpowiedź: "Najszybszy dostępny timing to dur.micro (~200ms) lub dur.quick (~400ms).
Jeżeli żaden nie spełnia potrzeby, uruchom procedurę rozszerzenia tokenów."

**Scenariusz D: "Ten odcień jest piękny ale nie ma tokena"**
Piękno nie jest kryterium. → FAIL.
Odpowiedź: "Dodaj token z wyprowadzeniem matematycznym, przejdź audyt PCS."

**Scenariusz E: "Chcemy animować przy Calm → Flow dla lepszego UX"**
ADR-005 zakazuje. → FAIL.
Odpowiedź: "Wymagany Focus jako punkt pośredni. Zmień Flow State Machine."

**Scenariusz F: "Na tym urządzeniu nie ma haptyki"**
Degradacja jest dopuszczalna jeżeli jest jawna w tokenach (ADR-004).
Sprawdź: czy token haptic_profile jest obecny, czy jest flaga degradacji.
Jeżeli tak → PASS. Jeżeli silently pominięte → FAIL.

---

### REGUŁA OSTATECZNA

Jeżeli nie jesteś pewien czy coś jest zgodne z Soft-Noir —
rozstrzygasz na korzyść większej ochrony sensorycznej.
Mniej bodźców. Wolniej. Ciszej. Zawsze.

Twoja rola nie jest ułatwiać pracę deweloperom.
Twoja rola jest chronić integralność systemu.

---

## EffectLog

```
S11.COMMIT.ID: PHI-AUDIT-INSTRUCTIONS-20260611-001
EVENT: AUDIT_PROTOCOL_INIT
CHANGE: Inicjalizacja protokołu audytu dla AI i human audytorów
STATUS: PASS (STABLE)
PCS: 0.999
```

