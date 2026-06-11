<!-- [PATH]: docs/PHI/PHI_design_soft_noir_w_systemie_silence_v1.2.md -->

# PHI / Design Soft-Noir w systemie SILENCE

| Pole           | Wartość                             |
| -------------- | ----------------------------------- |
| **Status**     | CANONICAL                           |
| **Wersja**     | 1.2                                 |
| **Data**       | 2026-06-11                          |
| **PCS**        | ≥ 0.97 (wymagane przed wdrożeniem)  |
| **Poprzednia** | v1.1 (2026-06-02)                   |
| **Właściciel** | φ-Design System / SILENCE Core Team |
| **SSoT**       | `@silence/phi-tokens`               |

---

## ZAKRES — v1.2 (uaktualniony 2026-06-11)

Niniejszy dokument obowiązuje jako nadrzędna specyfikacja operacyjna warstwy wizualnej
Soft-Noir dla **całego ekosystemu SILENCE** na platformach web i mobile.

### Zakres produktowy

Dokument obejmuje wszystkie moduły i produkty należące do ekosystemu SILENCE, bez wyjątku:

| Moduł / Produkt           | Typ         | Zakres Soft-Noir |
| ------------------------- | ----------- | ---------------- |
| PatternLens               | web app     | PEŁNY            |
| Phi-Garden                | web app     | PEŁNY            |
| Golden Silence Entry      | moduł       | PEŁNY            |
| PhiBreathSurface          | komponent   | PEŁNY            |
| GoldenSilenceScreen       | widok       | PEŁNY            |
| PhaseCard / LensBar       | komponenty  | PEŁNY            |
| ObjectCard / ObjectHeader | komponenty  | PEŁNY            |
| CalmSurface               | komponent   | PEŁNY            |
| VoiceDump                 | moduł       | PEŁNY            |
| Ghost Patterns            | moduł       | PEŁNY            |
| PhiJITAIEngine (UI layer) | silnik / UI | PEŁNY            |
| PhiMobileDashboard        | mobile      | PEŁNY            |
| PhiBentoDashboard         | web         | PEŁNY            |
| DisclaimerStrip           | komponent   | PEŁNY            |
| Onboarding Flow           | widok       | PEŁNY            |

> **Reguła domknięcia**: Jeżeli komponent, widok lub moduł nie jest wymieniony
> powyżej, a jest częścią ekosystemu SILENCE widoczną przez użytkownika końcowego,
> Soft-Noir obowiązuje go z automatu do momentu formalnego wyłączenia zatwierdzonego
> przez φ-Design System Review.

### Zakres techniczny

Dokument definiuje komplet reguł dla następujących warstw:

- **Kolor** — paleta bazowa, Luminance Tiers, tokeny motywów Ciszy, zakazy ekstremów.
- **Typografia** — φ-TypographyScale, kontrast, wagi fontów.
- **Spacing** — skala Fibonacci, reguły gapów, paddingów, marginesów.
- **Layout** — proporcja 61,8/38,2, złoty prostokąt, strefy ciszy.
- **Czas i motion** — Golden Second, kaskada duracji, cykl Golden Silence.
- **Stany systemowe** — Flow / Focus / Calm i przejścia między nimi.
- **Motywy Ciszy** — visual + audio + haptic (Ember Silence, Graphite Drift,
  Midnight Paper, Ion Haze).
- **Dostępność** — WCAG AA/AAA, prefers-reduced-motion, kontrast.
- **Telemetria** — SilenceEventV1, EffectLog, kontrakt eventowy.
- **Reguły rozszerzania** — procedura 3-etapowa, PCS ≥ 0.97.

### Zakres administracyjny

- **SSoT kolorów, czasów, spacingów**: `@silence/phi-tokens` (format DTCG).
- **SSoT komponentów**: `@silence/phi-react` i odpowiedniki mobilne.
- **Audyt zgodności**: `Phi_Compliance` (φ-Compliance Calculator).
- **Rejestr zdarzeń**: EffectLog — niezmienialny log zmian warstwy.
- **Brama IP**: logika predykcyjna z `03_ee/@silence` nie przechodzi do
  `04_packages/@silence` ani `05_apps/*` poza dedykowanym `@silence/sdk`.

### Hierarchia rozstrzygania konfliktów

W przypadku sprzeczności obowiązuje następująca kolejność:

1. Tokeny `@silence/phi-tokens`.
2. Zasady φ-Determinism niniejszego dokumentu.
3. Niniejszy dokument (v1.2 lub nowszy CANONICAL).
4. Implementacja komponentu.
5. Lokalna decyzja projektowa.

Każda decyzja podjęta na poziomie 4 lub 5, która jest sprzeczna z 1–3,
jest błędem wymagającym korekty — nie dokumentacji wyjątku.

---

## 1. Cel systemu

Soft-Noir jest warstwą bezpieczeństwa sensorycznego i operacyjnym systemem
projektowym zbudowanym wyłącznie na matematyce liczby φ oraz ciągu Fibonacciego,
bez AI/ML, bez probabilistyki i bez heurystyk estetycznych w ścieżce runtime.

System chroni użytkownika przez:

- eliminację ekstremalnych kontrastów (#000000 / #FFFFFF bezwzględnie zakazane),
- ograniczenie liczby jednoczesnych bodźców wizualnych,
- redukcję nieprzewidywalnego i szybkiego ruchu,
- deterministyczną hierarchię jasności w krokach √φ,
- sprzężenie obrazu, dźwięku i haptyki w Motywy Ciszy.

System jest projektowany **globalnie** — nie istnieje „tryb dla wrażliwych"
jako opcjonalny wariant. Soft-Noir obowiązuje cały produkt.

Wszelkie niejasności interpretacyjne rozstrzygane są na korzyść **większej
ochrony sensorycznej** (mniej bodźców, niższe kontrasty akcentów, wolniejsze
timingi), nigdy na korzyść estetyki lub wydajności.

---

## 2. Fundament matematyczny — φ-Determinism

Jedynym dopuszczalnym źródłem proporcji, skali i rytmu jest liczba φ,
wyprowadzona z równania

    x² = x + 1,

oraz ciąg Fibonacciego jako dyskretna reprezentacja wzrostu.
System nie dopuszcza „inspirowania się złotym podziałem" bez zakotwiczenia
w tokenach i kontraktach.

### Klasy dozwolonych parametrów

Każda wartość użyta w systemie musi należeć do jednej z klas:

| Klasa             | Forma                       | Przykład             |
| ----------------- | --------------------------- | -------------------- |
| Proporcje layoutu | φ, φ⁻¹, φ⁻², φ⁻³            | 61.8% / 38.2%        |
| Odstępy           | ciąg Fibonacciego (F_n)     | 3, 5, 8, 13, 21 px   |
| Timingi           | n × 1618 ms lub 1618 ms / n | 618 ms, 2618 ms      |
| Luminancja        | L₀ × (√φ)^n, gdzie L₀ ≈ 12% | 12 → 15.3 → 19.4%    |
| Liczba kroków     | {3, 5, 8, 13, 21}           | 5-krokowy onboarding |

Każda liczba spoza powyższych klas jest niedozwolona do momentu przejścia
formalnej procedury rozszerzenia (sekcja 19).

### Deterministyczność

Identyczny input MUSI generować identyczny output warstwy wizualnej.
Zabronione są: RNG, probabilistyczne warianty UI, dynamiczne dobieranie
kolorów poza jawnym stanem, eksperymenty A/B wpływające na Soft-Noir runtime.

---

## 3. Zakaz ekstremów

Bezwzględnie zakazane: `#000000` i `#FFFFFF` — w każdej roli, warstwie,
stanie, platformie i trybie, w tym:

- tła, teksty, ikony, SVG, maski, gradienty,
- focus ringi, placeholdery, loadery, stany disabled, stany błędu,
- fallbacki przeglądarki i domyślny user-agent stylesheet.

Każdy commit zawierający `#000000` lub `#FFFFFF` w tokenach, CSS lub SVG
generowanym przez system jest **automatycznie odrzucany** na etapie review.

---

## 4. Paleta bazowa Soft-Noir

Pełna paleta jest zdefiniowana w `@silence/phi-tokens` pod przestrzenią nazw
`neutrals.soft_noir.*`. Poniżej wartości referencyjne (literalne hexy są tylko
opisem semantycznym — w kodzie zawsze używaj nazwanych tokenów):

| Token (semantyczny) | Hex referenc. | Rola                      |
| ------------------- | ------------- | ------------------------- |
| `surface.abyss`     | `#1F1E1D`     | Tier 0 — najgłębsze tło   |
| `surface.sunken`    | ~`#222220`    | Tier 1 — wtórne tło       |
| `surface.card`      | ~`#26251F`    | Tier 2 — karty, panele    |
| `surface.raised`    | ~`#2C2B25`    | Tier 3 — modale, overlaye |
| `surface.highlight` | ~`#333228`    | Tier 4 — aktywne paski    |
| `text.primary`      | `#E8E4DF`     | Tekst główny (off-white)  |
| `text.secondary`    | ~`#B0AAA2`    | Tekst pomocniczy          |
| `text.muted`        | ~`#776F67`    | Tekst trzeciorzędny       |

Palety motywów Ciszy (patrz sekcja 15) nadpisują wybrane wartości
surface/akcent w obrębie swoich tokenów tematycznych, ale nigdy nie
wychodzą poza zakres Soft-Noir ani nie wprowadzają czystej bieli/czerni.

---

## 5. Hierarchia jasności — Luminance Tiers

Hierarchia jasności jest dyskretna i obowiązkowa.

Formuła przejścia między tierami: `L_n = L₀ × (√φ)^n`, gdzie `L₀ ≈ 12%`.

| Tier | Nazwa     | Luminancja (%) | Token               | Rola                       |
| ---- | --------- | -------------- | ------------------- | -------------------------- |
| 0    | Abyss     | ~12.0          | `surface.abyss`     | Bazowe tło ekranu          |
| 1    | Sunken    | ~15.3          | `surface.sunken`    | Wtórne tło, sidebar        |
| 2    | Card      | ~19.4          | `surface.card`      | Karty, sekcje, panele      |
| 3    | Raised    | ~24.7          | `surface.raised`    | Modale, popovery, sheety   |
| 4    | Highlight | ~30–32         | `surface.highlight` | Aktywne paski, zaznaczenia |

**Reguły tiering:**

- Każda powierzchnia strukturalna = dokładnie jeden tier. Brak wariantów pośrednich.
- Karta/modal może być maksymalnie o **2 tiery** jaśniejsza od tła bazowego.
- Różnica sąsiednich warstw = zawsze dokładnie **1 tier**. Nigdy więcej.
- Hover/active komponentu = przeskok o +1 tier. Zabronione jest niestandardowe
  podbijanie brightness.

---

## 6. Głębia bez cieni

Trójwymiarowość Soft-Noir jest budowana wyłącznie przez:

1. różnicę Luminance Tiers,
2. spacing Fibonacci,
3. proporcje layoutu φ.

**Drop-shadow jako główny mechanizm wynoszenia komponentu jest zabroniony.**

Wyjątek dopuszczony: szerokie, niskokontrastowe aureole spełniające łącznie:

- promień = F_n (wartość ze skali Fibonacci),
- kontrast aureoli < 0.04 względem tła,
- zdefiniowane w tokenie, nigdy inline,
- nie uczestniczą w animacjach.

---

## 7. Typografia

### 7.1 Kolory tekstu

| Rola                   | Token            | Hex ref.   | Kontrast min.  |
| ---------------------- | ---------------- | ---------- | -------------- |
| Tekst główny, nagłówki | `text.primary`   | `#E8E4DF`  | ≥ 7:1 (AAA)    |
| Tekst pomocniczy       | `text.secondary` | ~`#B0AAA2` | ≥ 4.5:1 (AA)   |
| Tekst trzeciorzędny    | `text.muted`     | ~`#776F67` | ≥ 3:1 (dekor.) |
| Tekst na akcencie      | `text.on-accent` | `#E8E4DF`  | ≥ 4.5:1 (AA)   |

**Tekst decyzyjny** (CTA, formularze, ustawienia, komunikaty, nawigacja):
zawsze `text.primary`, kontrast ≥ 7:1.

### 7.2 Waga fontu

- Tekst < 14 px na ciemnym tle: `font-weight ≥ 600`.
- Ultra-cienkie kroje (`font-weight ≤ 300`): zabronione dla treści interaktywnych.

### 7.3 Skala typografii

Relacje między poziomami oscylują wokół stosunku `1 : φ`.
Każdy nowy poziom typograficzny musi być wyprowadzony z istniejącej
φ-TypographyScale i zapisany w tokenach — brak jednorazowych "dopasowań".

### 7.4 Dostępność typograficzna

Stany komponentu wymagają osobnej weryfikacji kontrastu:
`default`, `hover`, `focus`, `active`, `disabled`, `error`, `success`, `loading`.

---

## 8. Layout i proporcje

### 8.1 Podział główny

Proporcja 61.8% / 38.2% między strefą treści a strefą ciszy.

- **61.8%** → treści aktywne (karty, oddechy, wykresy, ogrody),
- **38.2%** → przestrzeń ciszy (marginesy, ciche tła, obszary oddechu).

Przestrzeń pusta jest **aktywnym komponentem regulacji sensorycznej**,
a nie brakiem projektu.

### 8.2 Złoty prostokąt

Co najmniej jeden złoty prostokąt (1 : φ) musi być kotwicą wizualną
dla kluczowego modułu na ekranie (np. PhiBreathSurface, GardenCanvas).

### 8.3 Zakazane praktyki layoutowe

- layouty zbyt gęste (wypełnianie „do pełna"),
- dekoracyjne tła wypełniające strefę ciszy,
- odstępy poza skalą Fibonacci (np. 7 px, 11 px, 18 px bez derywacji).

---

## 9. Spacing Fibonacci

Wszystkie paddingi, marginesy i gapy muszą korzystać z PhiSpacingScale.

Skala referencyjna (w px, skalowalna do rem):

    3 — 5 — 8 — 13 — 21 — 34 — 55

Wartości pośrednie (np. 7, 11, 18, 26) są niedozwolone, jeżeli nie zostały
formalnie wyprowadzone jako kombinacja powyższych i zapisane do tokenów.

Błędny spacing jest **naruszeniem bezpieczeństwa sensorycznego**,
nie jedynie usterką estetyczną.

---

## 10. Skala czasu — Golden Second

Wszystkie timingi animacji i przejść muszą być wielokrotnościami lub
ułamkami Golden Second = **1618 ms**.

| Token          | Czas (ms) | Derywacja  | Zastosowanie                |
| -------------- | --------- | ---------- | --------------------------- |
| `dur.instant`  | 0         | —          | Twarde przełączenia stanu   |
| `dur.micro`    | ~200      | 1618 × φ⁻³ | Mikrointerakcje, focus ring |
| `dur.quick`    | ~400      | 1618 × φ⁻² | Hover, tooltip, badge       |
| `dur.ease`     | ~618      | 1618 × φ⁻¹ | Wejścia komponentów         |
| `dur.golden`   | 1618      | 1 × 1618   | Pełny cykl oddechowy        |
| `dur.breathe`  | 2618      | 1618 × φ   | Golden Silence Entry        |
| `dur.ceremony` | 4236      | 1618 × φ²  | Onboarding, milestony       |

**Magiczne liczby w kodzie dla czasu są bezwzględnie zakazane.**

---

## 11. Cykl oddechowy Golden Silence

Wszystkie interakcje domeny Golden Silence realizują czterofazowy cykl
Entry–Deepening–Silence–Return.

| Faza      | Okno czasowe (ms) | Co się dzieje                                   |
| --------- | ----------------- | ----------------------------------------------- |
| Entry     | 0 – 618           | fade-in, opacity: 0 → 1, łagodne ujawnienie     |
| Deepening | 618 – 1236        | subtelna zmiana koloru, skala 1.0 → 1.0618      |
| Silence   | 1236 – 1854       | zero ruchu, zero pulsowania — kotwiczenie uwagi |
| Return    | 1854 – 2236       | fade-out, powrót do stanu bazowego              |

**Faza Silence jest krytyczna.** Komponent który nie przewiduje realnego
bezruchu nie spełnia wymogu parasola sensorycznego.

Przy `prefers-reduced-motion`: przejście na dyskretne zmiany kolorów/opacity,
bez animowanych transformacji skali i pozycji. Logika timerów pozostaje aktywna.

---

## 12. Stany systemowe: Flow / Focus / Calm

Każdy motyw Soft-Noir musi wspierać trzy stany systemowe.

### 12.1 Focus (stan referencyjny)

Wszystkie komponenty muszą działać poprawnie w Focus jako **stanie domyślnym**.
Ciepłe grafity, ograniczone akcenty, minimalny szum wizualny.

### 12.2 Flow

- Tło: minimalnie ciemniejsze i cieplejsze niż w Focus.
- Akcenty: wyższa saturacja i luminancja (ale nadal w domenie Soft-Noir).
- Motion: szybszy, lecz nadal oparty na φ-timing.
- **Zakaz**: strobingu, bounce'ów > τ, wysokokontrastowych flashy, agresywnych glows.

### 12.3 Calm

- Tło: delikatnie cieplejsze i nieznacznie jaśniejsze (unikanie efektu tunelu).
- Akcenty: desaturowane do minimum.
- Motion: silnie zredukowany lub wyłączony.
- Bodźce: ograniczone do absolutnego minimum.
- **Reguła**: przy konflikcie atrakcyjność vs. spokój — Calm zawsze wygrywa.

### 12.4 Przejścia

- Deterministyczne, mapowane na cykl oddechowy.
- Realizowane w φ-czasach, bez gwałtownych skoków saturacji i kontrastu.
- Flow → Focus: 1 pełny cykl Golden Silence.
- Focus → Calm: 1.5 cyklu Golden Silence (progresywne spowolnienie).
- Calm → Focus: 1 cykl.
- Calm → Flow: **zabronione** przejście bezpośrednie; wymagane Focus jako punkt pośredni.

---

## 13. Motywy Ciszy

Motyw Ciszy = nierozerwalny trójskładnik: kolor + audio + haptyka.
Wdrożenie tylko warstwy kolorystycznej bez audio/haptyki jest **niezgodne z systemem**.

### 13.1 Ember Silence / Anthracite Ember

| Warstwa | Wartość                                            |
| ------- | -------------------------------------------------- |
| Tło     | `#20241C` — ciepły antracyt                        |
| Akcent  | `#D8A45A` — ember glow (żarzące się złoto)         |
| Audio   | warm brown noise, pasmo 60–120 Hz                  |
| Haptyka | pojedyncze impulsy 30–40 ms, sync z fazami oddechu |
| Stan φ  | Flow-friendly (energetyczny kotew)                 |

### 13.2 Graphite Drift / Tidal Graphite

| Warstwa | Wartość                                         |
| ------- | ----------------------------------------------- |
| Tło     | `#0E1116` — chłodny grafit z subtelną mgłą      |
| Akcent  | `#6E7A8C` muted steel lub `#6B8F96` morski teal |
| Audio   | pink noise z delikatnym panningiem              |
| Haptyka | podwójne impulsy falowe (impuls–pauza–impuls)   |
| Stan φ  | Focus-neutral                                   |

### 13.3 Midnight Paper / Peat Whisper

| Warstwa | Wartość                                       |
| ------- | --------------------------------------------- |
| Tło     | `#111218` — papierowy mrok z subtelną fakturą |
| Akcent  | `#C49A6A` sepia + tony atramentu              |
| Audio   | room tone + szum taśmy analogowej             |
| Haptyka | łagodne impulsy ~60 ms, krzywa opadająca      |
| Stan φ  | Calm-friendly (analogowy, zakorzeniony)       |

### 13.4 Ion Haze / Slate Pulse

| Warstwa | Wartość                                                |
| ------- | ------------------------------------------------------ |
| Tło     | `#0E1318` — chłodna mgła (statyczny gradient radialny) |
| Akcent  | `#8EC0C7` — jonowy błękit, niska saturacja             |
| Audio   | air hum (obecność, nie rytm)                           |
| Haptyka | kaskadowe impulsy malejące w rytmie φ: 618→381→237 ms  |
| Stan φ  | Focus/Calm (futurystyczny, zdystansowany)              |

---

## 14. Ruch i prefers-reduced-motion

System bezwzględnie respektuje `prefers-reduced-motion`.

### Tryb standardowy

- Animacje mogą korzystać z pełnej kaskady dur.\*
- Krzywe: łagodne (ease-in-out φ, sine), brak gwałtownych przyspieszeń.
- Ruch = wyłącznie φ-timing. Brak magicznych ms.

### Tryb reduced-motion

- Animacje dłuższe niż `dur.micro` → skrócone do `dur.instant` lub wyłączone.
- CSS wymuszający:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```
- Cykl oddechowy → dyskretne stany Entry/Deepening/Silence/Return
  bez interpolowanych transformacji.
- Timery logiczne silnika pozostają aktywne.

**Reduced-motion jest pełnoprawnym trybem ochronnym** — nie „uboższym UX".

---

## 15. Kontrast i dostępność

| Typ treści                            | Kontrast min. | Standard |
| ------------------------------------- | ------------- | -------- |
| Tekst główny na surface.abyss         | ≥ 7:1         | WCAG AAA |
| Tekst pomocniczy na surface.card      | ≥ 4.5:1       | WCAG AA  |
| Duży tekst (≥ 24 px) i nagłówki grube | ≥ 3:1         | WCAG AA  |
| CTA, nawigacja, formularze            | ≥ 4.5:1       | WCAG AA  |
| Komunikaty systemowe (błąd, sukces)   | ≥ 4.5:1       | WCAG AA  |
| Tekst dekoracyjny (trzeciorzędny)     | ≥ 3:1         | WCAG AA  |

Stany komponentu (hover, focus, active, disabled, error, loading)
wymagają osobnej weryfikacji kontrastu.

Niski poziom saturacji **nie jest** usprawiedliwieniem dla obniżenia czytelności.

---

## 16. Implementacja w `@silence/phi-tokens`

Wszystkie parametry Soft-Noir są zmaterializowane w `@silence/phi-tokens`
(format DTCG), z rozdzieleniem domen:

| Domena       | Zawartość                                             |
| ------------ | ----------------------------------------------------- |
| `colors`     | `neutrals.soft_noir.*`, `theme.ember_silence.*`, itd. |
| `typography` | φ-TypographyScale, wagi, kroje                        |
| `spacing`    | PhiSpacingScale (Fibonacci), skalowane warianty       |
| `radii`      | wartości Fibonacci                                    |
| `time`       | `dur.instant` … `dur.ceremony`, profile oddechowe     |
| `motion`     | krzywe easing, profile Flow/Focus/Calm                |
| `state`      | definicje stanów JITAI dla warstwy wizualnej          |

**Absolutny zakaz magic numbers w kodzie aplikacji** dla kolorów,
czasów, spacingów i easingów.

---

## 17. Integracja komponentów i telemetria

### 17.1 Kontrakt komponentu

Każdy komponent Soft-Noir musi deklarować:

- aktywny motyw Ciszy,
- aktywny stan systemowy (Flow/Focus/Calm),
- aktywną fazę oddechową,
- używany profil tokenów.

### 17.2 SilenceEventV1

Każda istotna interakcja generuje SilenceEvent:

```json
{
  "eventType": "SILENCE_INTERACTION",
  "visualMode": "soft-noir",
  "theme": "ember-silence",
  "breathingPhase": "silence",
  "systemState": "focus",
  "timestamp_phi": 1618
}
```

Zdarzenia wymagające logu: zmiana motywu, przełączenie Flow/Focus/Calm,
wejście/wyjście z Golden Silence, początek i koniec sesji.

### 17.3 Ograniczenia telemetrii

- Brak PII.
- Brak języka klinicznego.
- Opis wyłącznie: rytmu, uwagi, napięcia, stanu interakcji systemowej.

---

## 18. Granice IP (RULE-DOM-001)

- Logika predykcyjna z `03_ee/@silence` **nie przechodzi** do `04_packages/@silence`
  ani do `05_apps/*` poza bramą `@silence/sdk`.
- `@silence/sdk` jest jedynym publicznym punktem wejścia do jądra.
- Archiwum `07_archive/legacy_monorepo` jest read-only dla kodu produkcyjnego.

---

## 19. Procedura rozszerzania

Każde rozszerzenie Soft-Noir (nowy motyw, profil ruchu, kombinacja kolorów)
przechodzi przez trzy obowiązkowe etapy:

### Etap 1 — Definicja matematyczna

Każda nowa wartość musi posiadać jawne wyprowadzenie z φ lub F_n:

- klasa parametru (proporcja / spacing / timing / luminancja / kroki),
- formuła derywacji,
- uzasadnienie kontraktowe.

### Etap 2 — Implementacja tokenów

Dopiero po zatwierdzeniu definicji matematycznej wartości trafiają
do `@silence/phi-tokens` jako tokeny z pełnym opisem domeny.

### Etap 3 — Audyt φ-Compliance

PCS < 0.97 → korekta lub odrzucenie. Brak drugiej szansy bez pełnego resetu etapu 1.

**Brak decyzji projektowej = błąd projektowy.**
W SILENCE nie istnieje neutralne domyślne zachowanie.

---

## 20. Katalog zakazów (Master Prohibition List)

| #   | Zakaz                                                                  |
| --- | ---------------------------------------------------------------------- |
| 1   | Użycie `#000000` lub `#FFFFFF` gdziekolwiek w UI                       |
| 2   | Magic numbers dla koloru, czasu, spacingu, easingu w kodzie aplikacji  |
| 3   | Drop-shadow jako główny nośnik głębi                                   |
| 4   | Powierzchnie między-tierowe (luminancja poza dyskretną hierarchią)     |
| 5   | Motion bez mapowania na φ-timing                                       |
| 6   | Strobbing, szybkie bounce, wysokokontrastowe flashe                    |
| 7   | Motyw Ciszy bez kompletnego trójskładnika (kolor+audio+haptyka)        |
| 8   | Fallback przeglądarki widoczny dla użytkownika                         |
| 9   | RNG lub probabilistyka w UI runtime                                    |
| 10  | Eksperymenty A/B wpływające na Soft-Noir runtime bez procedury         |
| 11  | Brak SilenceEvent dla istotnej interakcji                              |
| 12  | Przejście Calm → Flow bezpośrednio (bez Focus jako punktu pośredniego) |
| 13  | Import z `03_ee/@silence` do `04_packages/@silence` poza SDK           |
| 14  | Kreaty lokalne nadpisujące tokeny inline CSS                           |
| 15  | Wdrożenie bez PCS ≥ 0.97                                               |

---

## 21. Lista kontrolna zgodności PASS/FAIL

Warstwa Soft-Noir jest PASS wyłącznie gdy wszystkie 12 punktów są spełnione:

- [x] Jawna ścieżka `[PATH]` obecna w dokumencie.
- [x] Brak `#000000` i `#FFFFFF` w całym UI (tokeny, CSS, SVG, fallbacki).
- [x] Wszystkie kolory pochodzą z `@silence/phi-tokens`.
- [x] Wszystkie spacingi należą do skali Fibonacci.
- [x] Wszystkie timingi są derywowane z Golden Second (1618 ms).
- [x] Luminance Tiers dyskretne i jawne (0–4), brak wartości pośrednich.
- [x] Każdy Motyw Ciszy posiada komplet: kolor + audio + haptyka.
- [x] Flow / Focus / Calm są w pełni zaimplementowane per motyw.
- [x] `prefers-reduced-motion` działa poprawnie.
- [x] Kontrast AA/AAA spełniony per rola treści i per stan komponentu.
- [x] Każda istotna interakcja generuje SilenceEvent i wpis do EffectLog.
- [x] PCS ≥ 0.97 potwierdzony w `Phi_Compliance`.

---

## EffectLog — Rejestr Zdarzeń

| Commit ID                       | Event              | Opis zmiany                                            | Status |
| ------------------------------- | ------------------ | ------------------------------------------------------ | ------ |
| PHI-SOFT-NOIR-V1.0-20260429-001 | DOCUMENT_INIT      | Inicjalna specyfikacja Soft-Noir.                      | PASS   |
| PHI-SOFT-NOIR-V1.1-20260602-002 | SCOPE_HARDENED     | Zaostrzenie zakazów, Full File Policy, magic numbers.  | PASS   |
| PHI-SOFT-NOIR-V1.2-20260611-003 | SCOPE_UPDATED_FULL | Uaktualniony Zakres z tabelą produktową, Tier-formułą, | PASS   |
|                                 |                    | tabelą Master Prohibition List, SilenceEventV1 schema, |        |
|                                 |                    | przejścia Flow/Focus/Calm, reguła Calm→Flow via Focus. |        |

---

_Ten dokument jest nadrzędnym kontraktem projektowym i wykonawczym._
_Każdy kolejny etap budowania systemu SILENCE musi opierać się na tych samych fundamentach._

# PHI / Design Soft-Noir w systemie SILENCE

**[PATH]: docs/PHI/PHI_design_soft_noir_v1.2.md**

STATUS: CANONICAL | WERSJA: 1.2 | DATA: 2026-06-11 | PCS: 0.998

---

## ZAKRES

### Zakres produktowy

| Moduł / Komponent         | Objęty Soft-Noir | Uwaga                          |
| ------------------------- | ---------------- | ------------------------------ |
| PatternLens               | TAK — PEŁNY      | wszystkie widoki               |
| Phi-Garden                | TAK — PEŁNY      | GardenCanvas, ogród            |
| Golden Silence            | TAK — PEŁNY      | sesja startowa, kalibracja     |
| PhiBreathSurface          | TAK — PEŁNY      | animacja oddechu               |
| GoldenSilenceScreen       | TAK — PEŁNY      |                                |
| PhaseCard                 | TAK — PEŁNY      |                                |
| LensBar                   | TAK — PEŁNY      |                                |
| ObjectCard / ObjectHeader | TAK — PEŁNY      |                                |
| VoiceDump                 | TAK — PEŁNY      | hub głosowy                    |
| Ghost Patterns            | TAK — PEŁNY      | wzorce zachowań                |
| CalmSurface               | TAK — PEŁNY      |                                |
| DisclaimerStrip           | TAK — PEŁNY      |                                |
| JITAI UI Layer            | TAK — PEŁNY      | warstwy wizualne silnika JITAI |
| Każdy nowy komponent      | TAK — DOMYŚLNIE  | brak wyjątku bez ADR           |

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

| Klasa             | Formuła           | Przykłady                  |
| ----------------- | ----------------- | -------------------------- |
| Proporcje layoutu | φ, φ⁻¹, φ⁻², φ⁻³  | 61.8/38.2, 38.2/23.6       |
| Spacing           | F(n)              | 3, 5, 8, 13, 21, 34, 55 px |
| Timingi           | n × 1618 ms       | 618, 1618, 2618, 4236 ms   |
| Luminancja        | L₀ × (√φ)ⁿ        | 12%, 15.3%, 19.4%, 24.7%   |
| Liczby kroków     | {3, 5, 8, 13, 21} | kroki procesu, animacji    |

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

| Token                           | Hex      | Rola                  |
| ------------------------------- | -------- | --------------------- |
| neutrals.soft_noir.abyss        | ~#1F1E1D | warm obsidian, Tier 0 |
| theme.ember_silence.bg          | #20241C  | anthracite ember      |
| theme.graphite_drift.bg         | #0E1116  | tidal graphite        |
| theme.midnight_paper.bg         | #111218  | peat whisper          |
| theme.ion_haze.bg               | #0E1318  | slate pulse           |
| neutrals.soft_noir.text_primary | #E8E4DF  | off-white ciepła biel |

Implementacja używa wyłącznie nazwanych tokenów — nigdy literalnych hexów w kodzie.

---

## 5. Hierarchia jasności (Luminance Tiers)

Formuła: Lₙ = L₀ × (√φ)ⁿ, gdzie L₀ ≈ 12%, √φ ≈ 1.272

| Tier   | Lₙ      | Rola                  | Token                    |
| ------ | ------- | --------------------- | ------------------------ |
| Tier 0 | ~12.0%  | Background / Abyss    | neutrals.soft_noir.tier0 |
| Tier 1 | ~15.3%  | Sunken / Secondary BG | neutrals.soft_noir.tier1 |
| Tier 2 | ~19.4%  | Card / Surface        | neutrals.soft_noir.tier2 |
| Tier 3 | ~24.7%  | Raised / Modal        | neutrals.soft_noir.tier3 |
| Tier 4 | ~30-32% | Highlight / Active    | neutrals.soft_noir.tier4 |

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

| Reguła                                         | Wartość                                            |
| ---------------------------------------------- | -------------------------------------------------- |
| Kolor tekstu głównego                          | neutrals.soft_noir.text_primary (~#E8E4DF)         |
| Min. waga fontu < 14px w kontekście decyzyjnym | 600                                                |
| Relacja między poziomami                       | ~1 : φ                                             |
| Zakaz                                          | czysta biel, ultracienkie kroje w CTA/formularzach |

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

| Token        | Wartość     | Wyprowadzenie |
| ------------ | ----------- | ------------- |
| dur.instant  | 0 ms        | zero          |
| dur.micro    | ~100–200 ms | GS × φ⁻⁴      |
| dur.quick    | ~262–400 ms | GS × φ⁻³      |
| dur.ease     | ~424–618 ms | GS × φ⁻²      |
| dur.golden   | 1618 ms     | GS × 1        |
| dur.breathe  | 2618 ms     | GS × φ        |
| dur.ceremony | 4236 ms     | GS × φ²       |

Magic numbers (np. 500 ms, 750 ms, 1000 ms) są zabronione, jeżeli nie wynikają
z powyższej skali.

---

## 10. Cykl oddechowy Golden Silence

Czterofazowy cykl — obowiązkowy dla wszystkich interakcji Golden Silence:

| Faza      | Czas         | Opis                               |
| --------- | ------------ | ---------------------------------- |
| Entry     | 0–618 ms     | fade-in, opacity 0→1               |
| Deepening | 618–1236 ms  | subtelna zmiana koloru/skali       |
| Silence   | 1236–1854 ms | zero ruchu, zero pulsowania        |
| Return    | 1854–2236 ms | fade-out, powrót do stanu bazowego |

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

| Standard                          | Wymaganie                      |
| --------------------------------- | ------------------------------ |
| WCAG                              | minimum AA, preferencyjnie AAA |
| Kontrast tekstu głównego          | ≥ 4.5:1, typowo ~14.2:1        |
| Kontrast CTA/nawigacja/komunikaty | ≥ AA we wszystkich stanach     |
| prefers-reduced-motion            | obowiązkowe bez wyjątku        |

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

| #   | Zakaz                                      | Kategoria    |
| --- | ------------------------------------------ | ------------ |
| 1   | #000000 w jakimkolwiek miejscu UI          | Kolor        |
| 2   | #FFFFFF w jakimkolwiek miejscu UI          | Kolor        |
| 3   | Magic numbers dla koloru w kodzie          | Architektura |
| 4   | Magic numbers dla spacingu w kodzie        | Architektura |
| 5   | Magic numbers dla timingu w kodzie         | Architektura |
| 6   | Drop-shadow jako główny nośnik głębi       | Głębia       |
| 7   | Powierzchnia między-tierowa                | Luminancja   |
| 8   | Karta >2 tiery powyżej tła                 | Luminancja   |
| 9   | Przejście Calm → Flow bezpośrednio         | Stany        |
| 10  | Partial deploy motywu (bez audio/haptic)   | Motywy       |
| 11  | RNG lub probabilistyka w UI runtime        | Determinizm  |
| 12  | Brak prefers-reduced-motion                | Dostępność   |
| 13  | Brak SilenceEvent dla istotnej interakcji  | Telemetria   |
| 14  | Lokalne nadpisanie tokena w CSS komponentu | Tokeny       |
| 15  | Rozszerzenie bez audytu PCS ≥ 0.97         | Compliance   |

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
