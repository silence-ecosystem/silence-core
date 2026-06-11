# PHI / Design Soft-Noir w systemie SILENCE

**[PATH]: docs/PHI/PHI_design_soft_noir_v1.2.md**

STATUS: CANONICAL | WERSJA: 1.2 | DATA: 2026-06-11 | PCS: 0.998

---

## ZAKRES

### Zakres produktowy

| Moduł / Komponent | Objęty Soft-Noir | Uwaga |
|---|---|---|
| PatternLens | TAK — PEŁNY | wszystkie widoki |
| Phi-Garden | TAK — PEŁNY | GardenCanvas, ogród |
| Golden Silence | TAK — PEŁNY | sesja startowa, kalibracja |
| PhiBreathSurface | TAK — PEŁNY | animacja oddechu |
| GoldenSilenceScreen | TAK — PEŁNY | |
| PhaseCard | TAK — PEŁNY | |
| LensBar | TAK — PEŁNY | |
| ObjectCard / ObjectHeader | TAK — PEŁNY | |
| VoiceDump | TAK — PEŁNY | hub głosowy |
| Ghost Patterns | TAK — PEŁNY | wzorce zachowań |
| CalmSurface | TAK — PEŁNY | |
| DisclaimerStrip | TAK — PEŁNY | |
| JITAI UI Layer | TAK — PEŁNY | warstwy wizualne silnika JITAI |
| Każdy nowy komponent | TAK — DOMYŚLNIE | brak wyjątku bez ADR |

### Zakres techniczny

Dokument obejmuje osiem warstw:
1. Kolor i paleta
2. Typografia
3. Spacing i proporcje layoutu
4. Hierarchia jasności (Luminance Tiers)
5. Czas i motion
6. Stany systemowe (Flow / Focus / Calm)
7. Motywy Ciszy (visual + audio + haptic)
8. Dostępność, telemetria i reguły rozszerzania

### Zakres administracyjny — hierarchia konfliktów

1. `@silence/phi-tokens` (wartości tokenów)
2. Zasady φ-Determinism
3. Niniejszy dokument
4. ADR
5. Implementacja

Implementacja nigdy nie nadpisuje specyfikacji.

---

## 1. Cel i charakter dokumentu

Soft-Noir jest deterministyczną warstwą bezpieczeństwa sensorycznego systemu SILENCE.
Jego celem jest redukcja szumu kognitywnego, ograniczenie przebodźcowania oraz
utrzymanie czytelności treści i kontroli interakcji w środowiskach o podwyższonym
rygorze sensorycznym.

System jest projektowany dla profili neuroatypowych (ADHD-hiper, HSP) oraz
użytkowników przeciążonych zadaniowo. Obowiązuje globalnie — nie istnieje osobny
„tryb dla wrażliwych". Każdy piksel w SILENCE jest objęty Soft-Noir.

Soft-Noir pozwala na kreatywność wyłącznie wewnątrz sztywnych reguł matematycznych.
Kreatywność oznacza komponowanie doświadczeń z kanonicznych tokenów, proporcji i stanów —
nigdy swobodę parametrów.

---

## 2. Fundament matematyczny φ-Determinism

Jedynym dopuszczalnym źródłem proporcji, skali i rytmu jest:
- liczba φ wyprowadzona z x² = x + 1, φ ≈ 1.618033988749895
- ciąg Fibonacciego jako dyskretna reprezentacja wzrostu

System jest deterministyczny bit-po-bicie: identyczny input = identyczny output,
niezależnie od sprzętu, wątków i czasu.

Wszystkie parametry muszą należeć do jednej z klas:

| Klasa | Formuła | Przykłady |
|---|---|---|
| Proporcje layoutu | φ, φ⁻¹, φ⁻², φ⁻³ | 61.8/38.2, 38.2/23.6 |
| Spacing | F(n) | 3, 5, 8, 13, 21, 34, 55 px |
| Timingi | n × 1618 ms | 618, 1618, 2618, 4236 ms |
| Luminancja | L₀ × (√φ)ⁿ | 12%, 15.3%, 19.4%, 24.7% |
| Liczby kroków | {3, 5, 8, 13, 21} | kroki procesu, animacji |

Każda liczba użyta w systemie, która nie należy do żadnej z tych klas,
jest niedozwolona bez przejścia formalnej procedury rozszerzenia.

---

## 3. Zakaz ekstremów

System bezwzględnie zabrania #000000 i #FFFFFF w dowolnym miejscu interfejsu.

Zakaz obejmuje:
- tło, tekst, ikony, SVG, focus ringi, placeholdery, loadery
- gradienty, maski, stany błędu, puste stany, fallbacki
- asset SVG z wbudowanym #000000 lub #FFFFFF
- fallback przeglądarki przy braku stylu
- domyślny kolor tekstu user agent stylesheet
- stan disabled bez jawnego tokena
- niedookreślony kolor placeholdera

Jedyną dopuszczalną domeną kolorystyczną jest paleta Soft-Noir w `@silence/phi-tokens`.
Jeżeli element nie ma przypisanego tokena — nie może wejść do produkcyjnego runtime.

---

## 4. Paleta bazowa

| Token | Hex | Rola |
|---|---|---|
| neutrals.soft_noir.abyss | ~#1F1E1D | warm obsidian, Tier 0 |
| theme.ember_silence.bg | #20241C | anthracite ember |
| theme.graphite_drift.bg | #0E1116 | tidal graphite |
| theme.midnight_paper.bg | #111218 | peat whisper |
| theme.ion_haze.bg | #0E1318 | slate pulse |
| neutrals.soft_noir.text_primary | #E8E4DF | off-white ciepła biel |

Implementacja używa wyłącznie nazwanych tokenów — nigdy literalnych hexów w kodzie.

---

## 5. Hierarchia jasności (Luminance Tiers)

Formuła: Lₙ = L₀ × (√φ)ⁿ, gdzie L₀ ≈ 12%, √φ ≈ 1.272

| Tier | Lₙ | Rola | Token |
|---|---|---|---|
| Tier 0 | ~12.0% | Background / Abyss | neutrals.soft_noir.tier0 |
| Tier 1 | ~15.3% | Sunken / Secondary BG | neutrals.soft_noir.tier1 |
| Tier 2 | ~19.4% | Card / Surface | neutrals.soft_noir.tier2 |
| Tier 3 | ~24.7% | Raised / Modal | neutrals.soft_noir.tier3 |
| Tier 4 | ~30-32% | Highlight / Active | neutrals.soft_noir.tier4 |

Reguły bezwzględne:
- Każda powierzchnia strukturalna należy do dokładnie jednego tieru.
- Wartości między-tierowe są zabronione dla elementów strukturalnych.
- Karta lub modal może być maksymalnie 2 tiery wyżej niż tło bazowe.
- Więcej niż 2 tiery różnicy = błąd krytyczny.

---

## 6. Głębia bez cieni

Nośniki głębi w Soft-Noir:
1. Różnica tierów luminancji (podstawowy)
2. Spacing Fibonacci (rytm i separacja)
3. Złoty podział kompozycyjny

Drop-shadow jako główny mechanizm wynoszenia komponentu jest zabroniony.
Dopuszcza się wyłącznie szerokie, subtelne aureole gdy:
- nie pełnią roli głównego nośnika głębi
- promień wynika ze skali Fib
- są zdefiniowane w tokenach, nie lokalnie

Jeżeli karta wymaga mocnego cienia = błąd w hierarchii luminancji.

---

## 7. Typografia

| Reguła | Wartość |
|---|---|
| Kolor tekstu głównego | neutrals.soft_noir.text_primary (~#E8E4DF) |
| Min. waga fontu < 14px w kontekście decyzyjnym | 600 |
| Relacja między poziomami | ~1 : φ |
| Zakaz | czysta biel, ultracienkie kroje w CTA/formularzach |

Każdy nowy poziom typograficzny musi być wyprowadzony z φ-TypographyScale
i zapisany w tokenach. Jednorazowe „ręczne dopasowanie" rozmiaru jest zabronione.

---

## 8. Layout i spacing

Główny podział: 61.8% treść aktywna / 38.2% przestrzeń oddechu.
Złoty prostokąt (1:φ) jest kotwicą dla głównego modułu skupienia każdego widoku.

Spacing Fibonacci (px bazowe):

```
3 — 5 — 8 — 13 — 21 — 34 — 55
```

Wartości spoza tej skali (np. 7, 11, 18, 26 px) są niedozwolone bez formalnego
wyprowadzenia i zapisu do tokenów.

Przestrzeń pusta jest aktywnym komponentem regulacji sensorycznej.
Upychanie treści „do pełna" jest naruszeniem bezpieczeństwa sensorycznego.

---

## 9. Skala czasu i Golden Second

Golden Second = 1618 ms = token `dur.golden`.

| Token | Wartość | Wyprowadzenie |
|---|---|---|
| dur.instant | 0 ms | zero |
| dur.micro | ~100–200 ms | GS × φ⁻⁴ |
| dur.quick | ~262–400 ms | GS × φ⁻³ |
| dur.ease | ~424–618 ms | GS × φ⁻² |
| dur.golden | 1618 ms | GS × 1 |
| dur.breathe | 2618 ms | GS × φ |
| dur.ceremony | 4236 ms | GS × φ² |

Magic numbers (np. 500 ms, 750 ms, 1000 ms) są zabronione, jeżeli nie wynikają
z powyższej skali.

---

## 10. Cykl oddechowy Golden Silence

Czterofazowy cykl — obowiązkowy dla wszystkich interakcji Golden Silence:

| Faza | Czas | Opis |
|---|---|---|
| Entry | 0–618 ms | fade-in, opacity 0→1 |
| Deepening | 618–1236 ms | subtelna zmiana koloru/skali |
| Silence | 1236–1854 ms | zero ruchu, zero pulsowania |
| Return | 1854–2236 ms | fade-out, powrót do stanu bazowego |

Faza Silence jest krytyczna. Interfejs musi umieć zatrzymać ruch.
Komponent bez realnego stanu bezruchu nie spełnia wymogu parasola sensorycznego.

Skrócona kaskada wdech–zatrzymanie–wydech: 38.2% — 23.6% — 38.2%.

---

## 11. Stany systemowe: Flow / Focus / Calm

### Reguła przejść
Przejście Calm → Flow bezpośrednie jest **zabronione**.
Wymagana kolejność: Calm → Focus → Flow.
Każde przejście musi być mapowane na cykl oddechowy i używać φ-timingów.

### Flow
- Tło: minimalnie ciemniejsze i cieplejsze
- Akcenty: wyższa saturacja i luminancja
- Motion: energetyczny, ale nadal φ-timing
- Zakaz: strobing, bounce, wysokokontrastowe flashe, agresywne glowy

### Focus (stan referencyjny)
- Wszystkie komponenty muszą domyślnie działać w Focus
- Neutralny grafit, ograniczone akcenty, minimalny szum

### Calm
- Tło: cieplejsze i nieznacznie jaśniejsze (unikanie efektu tunelu)
- Akcenty: maksymalnie desaturowane
- Motion: spowolniony lub wyłączony
- Priorytet: spokój > atrakcyjność wizualna, zawsze

---

## 12. Motywy Ciszy

Każdy motyw = komplet {kolor, audio, haptyka}. Partial deploy jest zabroniony.

### Ember Silence / Anthracite Ember
- BG: #20241C | Akcent: #D8A45A
- Audio: warm brown noise, pasmo 60–120 Hz
- Haptyka: pojedyncze impulsy 30–40 ms

### Graphite Drift / Tidal Graphite
- BG: #0E1116 | Akcent: #6E7A8C lub #6B8F96
- Audio: pink noise z panningiem
- Haptyka: podwójne impulsy falowe

### Midnight Paper / Peat Whisper
- BG: #111218 | Akcent: #C49A6A
- Audio: room tone + szum taśmy analogowej
- Haptyka: łagodne impulsy ~60 ms, krzywa opadająca

### Ion Haze / Slate Pulse
- BG: #0E1318 | Akcent: #8EC0C7
- Audio: air hum
- Haptyka: kaskadowe malejące impulsy w rytmie φ (618, 381, 237 ms)

---

## 13. Dostępność

| Standard | Wymaganie |
|---|---|
| WCAG | minimum AA, preferencyjnie AAA |
| Kontrast tekstu głównego | ≥ 4.5:1, typowo ~14.2:1 |
| Kontrast CTA/nawigacja/komunikaty | ≥ AA we wszystkich stanach |
| prefers-reduced-motion | obowiązkowe bez wyjątku |

W reduced motion:
- Animacje > micro → skrócone lub wyłączone
- Stany cyklu oddechowego → dyskretne zmiany opacity/koloru bez transformacji
- Timery logiczne działają; ruch wizualny zredukowany do minimum

---

## 14. Telemetria — SilenceEventV1

Każda istotna interakcja Soft-Noir MUSI generować SilenceEvent.

Kontrakt minimalny (schema w docs/contracts/silence-event-v1.schema.json):

```json
{
  "eventType": "string",
  "visualMode": "soft-noir",
  "theme": "ember_silence | graphite_drift | midnight_paper | ion_haze",
  "systemState": "flow | focus | calm",
  "breathingPhase": "entry | deepening | silence | return | idle",
  "timestamp": "ISO8601",
  "componentId": "string",
  "pcsSnapshot": "number (0-1)"
}
```

Zakazy telemetryczne:
- Brak PII
- Brak języka klinicznego
- Brak danych zdrowotnych

---

## 15. Master Prohibition List

| # | Zakaz | Kategoria |
|---|---|---|
| 1 | #000000 w jakimkolwiek miejscu UI | Kolor |
| 2 | #FFFFFF w jakimkolwiek miejscu UI | Kolor |
| 3 | Magic numbers dla koloru w kodzie | Architektura |
| 4 | Magic numbers dla spacingu w kodzie | Architektura |
| 5 | Magic numbers dla timingu w kodzie | Architektura |
| 6 | Drop-shadow jako główny nośnik głębi | Głębia |
| 7 | Powierzchnia między-tierowa | Luminancja |
| 8 | Karta >2 tiery powyżej tła | Luminancja |
| 9 | Przejście Calm → Flow bezpośrednio | Stany |
| 10 | Partial deploy motywu (bez audio/haptic) | Motywy |
| 11 | RNG lub probabilistyka w UI runtime | Determinizm |
| 12 | Brak prefers-reduced-motion | Dostępność |
| 13 | Brak SilenceEvent dla istotnej interakcji | Telemetria |
| 14 | Lokalne nadpisanie tokena w CSS komponentu | Tokeny |
| 15 | Rozszerzenie bez audytu PCS ≥ 0.97 | Compliance |

---

## 16. Procedura rozszerzania

Każde rozszerzenie Soft-Noir musi przejść trzy etapy:

1. **Definicja matematyczna** — zapis równań i relacji względem φ i Fib
2. **Implementacja tokenów** — dopiero po formalnym wyprowadzeniu
3. **Audyt φ-Compliance** — PCS < 0.97 = odrzucenie

Brak decyzji = błąd. Neutralność nie istnieje w SILENCE.

---

## EffectLog

```
S11.COMMIT.ID: PHI-SOFT-NOIR-V1.2-20260611-002
EVENT: SPEC_UPDATE
CHANGE: Dodanie tabeli Zakres produktowy, formuły Lₙ, reguły Calm→Focus→Flow,
        Master Prohibition List, SilenceEventV1 schema reference
STATUS: PASS (STABLE)
PCS: 0.998
```

