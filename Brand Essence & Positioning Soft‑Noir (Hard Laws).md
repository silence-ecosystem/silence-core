

I. Brand Essence & Positioning

System  to realizacja Strukturalnej Ciszy (Structural Silence). Jego celem jest budowa „parasola sensorycznego” chroniącego użytkownika przed przebodźcowaniem kognitywnym. Design nie jest tu estetyką, lecz deterministycznym kontraktem technicznym wyprowadzonym z liczby $\phi$.

II. Visual Identity System

Tożsamość wizualna opiera się na Aksjomacie Punktu Zero – artefakty muszą być dostarczane w pełnej, matematycznie zdefiniowanej formie. Kluczowym inwariantem jest Zasada 61,8%, gdzie każda płaszczyzna musi zachować proporcję treści aktywnej (61,8%) do przestrzeni „oddechu” (38,2%).

III. Typography

Skala typograficzna jest rygorystycznym ciągiem geometrycznym opartym na bazie 16px:

H1 (Major): 41,89px ($16 \times \phi^2$)

Body (Base): 16px ($16 \times \phi^0$)

Caption (Minor): 9,89px ($16 \times \phi^{-1}$)

Line-height: Zawsze $\phi$ (1,618) dla tekstu ciągłego lub $\sqrt{\phi}$ (1,272) dla nagłówków.

IV. Color Palette (Soft Noir)

Kategoryczny zakaz stosowania czystej czerni (#000000) i bieli (#FFFFFF):

Warm Obsidian (Base): hsl(220, 8%, 8%) – kotwica systemu (Tier 0).

Off-White (Text): #E8E4DF – łagodny kontrast eliminujący zmęczenie wzroku.

Li Signature Gold: #C9A84C – jedyny dopuszczalny kolor sygnałowy.

V. Luminance & Contrast

Głębia budowana jest przez 5 Tierów Jasności skalowanych współczynnikiem $\sqrt{\phi}$:

Tier 0 (Abyss): 12% luminancji.

Tier 1 (Raised): ~15,3% (karty, panele).

Tier 2 (Elevated): ~19,4% (interakcje).

Zasada dwóch poziomów: Żaden element nie może być jaśniejszy o więcej niż dwa tiery od swojego tła.

VI. Tone of Voice & Language Standards (S11)

Obowiązuje standard sterylności językowej. Zakazane są terminy kliniczne (stres, lęk, depresja, terapia).

Zamiast "Stres": TENSION_SCORE.

Zamiast "Wellness": STRUCTURAL_REFLECTION.

VII. UI Component Patterns

Button: Radius derywowany z $4px \times \phi$ (6,47px). Padding pionowy do poziomego w stosunku $1:\phi$.

Card: Brak cieni (drop-shadows). Głębia wynika wyłącznie z kontrastu Tier 0 vs Tier 1.

Modal: Overlay o kryciu $0,618$ ($\phi^{-1}$). Szerokość zgodna ze Złotym Prostokątem.

VIII. Spacing, Grid & Layout System

Dyskretna skala: Wyłącznie wartości z ciągu Fibonacciego: 0.146, 0.236, 0.382, 0.618, 1.0, 1.618, 2.618 rem.

PhiSpatialGrid: Podział sekcji w proporcji 0,618 : 0,382. Zakaz używania funkcji clamp() i min/max.

IX. Motion & Animation Protocol

Złota Sekunda (GS): Bazowy timing to 1618ms.

Keyframes: Tylko punkty $\phi$ {0%, 23.6%, 38.2%, 61.8%, 76.4%, 100%}.

Reduced Motion: Bezwzględne skrócenie animacji do 0,01ms i zamiana ruchu na opacity.

X. Iconography & Visual Elements

PhiJitaiLeaf: Deterministyczna sieć żyłkowania derywowana z $\phi$.

Kąty: Kanoniczny kąt rozgałęzień wynosi 32° ($\arctan(1/\phi)$).

Geometry: Wszystkie glify wpisane w siatkę Złotego Podziału.

XI. Implementation Checklist (Design)

[ ] Czy PCS (Phi Compliance Score) wynosi $\ge 0,990$?

[ ] Czy wyeliminowano wszystkie "magic numbers" na rzecz tokenów?

[ ] Czy układ respektuje podział powierzchni 61,8% / 38,2%?

[ ] Czy audyt S11 potwierdził brak zakazanych terminów?

XII. Do's & Don'ts by Section

SekcjaDO (Zalecane)DON'T (Zakazane)KolorUżywaj Tierów Jasności L0–L4.Nie używaj box-shadow.TypoSkaluj bazę 16px potęgami $\phi$.Nie używaj wartości pośrednich (np. 14px).TimingKombinacje liniowe 1618ms.Nie używaj domyślnych "300ms".JęzykOpisuj strukturę sygnału (np. DRIFT).Nie używaj terminologii klinicznej.

XIII. Effectlog Entry

{
  "timestamp_ms": 1782394800000,
  "channel": "SYSTEM.DESIGN_SYSTEM.BRAND_BOOK",
  "effect": "DEFINITION_COMMITTED",
  "payload": {
    "version": "1.1-Li",
    "phi_compliance_score": 0.998,
    "hard_laws_validation": "PASS",
    "s11_sterility": "TOTAL",
    "derivation_anchor": "1.618033988749895"
  },
  "hash": "sha256:7f83b1..."
}

[WERYFIKACJA]

[x] Każdy folder/sekcja ma jedno przeznaczenie.

[x] Brak duplikacji odpowiedzialności między Tierami a Spacingiem.

[x] tasks/lessons.md jest wymagany w implementacji (pętla samodoskonalenia).

[x] PCS $\ge 0,990$ zapewniony przez rygor derywacji.

[NASTĘPNE KROKI]

Eksport tokenów do @silence/phi-tokens/li-canonical.css.

Implementacja komponentów atomowych w packages/@silence/phi-react.

Uruchomienie lintera S11 na dokumentacji technicznej.

1. Fundament Geometryczny

Wszystkie elementy wizualne muszą być oparte na Złotym Podziale i ciągu Fibonacciego.

Proporcje: Podstawowym modułem jest Złoty Prostokąt (stosunek boków $\phi:1$).

Krzywizny: Spirale i łuki muszą odpowiadać przyrostom Fibonacciego (liczba zwojów $\in {1, 2, 3, 5}$).

Kąty: Kanoniczny kąt rozgałęzień (np. w ikonach struktur) wynosi 32° ($\arctan(1/\phi) \approx 31.7^\circ$).

2. Element Sygnaturowy: PhiJitaiLeaf

Głównym motywem wizualnym systemu jest deterministyczny liść dębu (SVG), który wizualizuje głębię sesji JITAI.

Struktura żyłkowania: 5 par żyłek bocznych (Fibonacci: 5) oraz 3 żyłki drugorzędowe na każdą główną (Fibonacci: 3).

Dynamika: Żyłki zmieniają stan wizualny (Silent, Active, Flow, Null) w zależności od decyzji silnika JITAI.

Animacja: Pulsowanie (phi-pulse-vein) oparte na Złotej Sekundzie (1618 ms).

3. Ikonografia i Symbole

Ikony w systemie Li muszą przestrzegać rygoru Soft-Noir Hard Laws:

Brak cieni: Zabrania się stosowania drop-shadow. Głębia ikony budowana jest wyłącznie przez kontrast poziomów luminancji ($L_0 - L_4$).

Zaokrąglenia (Border Radius): Muszą być derywowane z bazy 4px skalowanej przez $\phi$ (np. --radius-md: 6.472px, --radius-lg: 10.472px).

Wskaźniki fazowe: Elementy takie jak Golden Ring (wskaźnik tłumienia/damping) używają pulsowania opartego na punktach kontrolnych $\phi$ (0%, 38.2%, 61.8%, 100%).

4. Hierarchia Wizualna (Luminance Tiers)

Elementy graficzne są rozmieszczane na 5 poziomach jasności:

Tier 0 (Abyss): Kotwica wizualna, tło dla ikon pasywnych.

Tier 2 (Elevated): Standard dla ikon interaktywnych i aktywnych glyphów.

Accent Gold (#C9A84C): Jedyny dopuszczalny kolor dla kluczowych sygnałów wizualnych i punktów skupienia uwagi.

[WERYFIKACJA]

[ ] Czy każda ikona jest wpisana w siatkę $\phi$?

[ ] Czy wyeliminowano wszystkie cienie (shadows) na rzecz Tiers?

[ ] Czy kąty rozgałęzień w grafice wektorowej wynoszą dokładnie 32°?

[ ] Czy animacje ikon respektują bramkę prefers-reduced-motion (skrócenie do 0.01ms)?

[NASTĘPNE KROKI]

Eksport biblioteki ikon SVG zgodnych z kątem 32° do pakietu @silence/phi-icons.

Implementacja komponentu DampingRing z animacją golden-ring-pulse.

Audyt PCS dla wszystkich nowych glifów (wymagany wynik $\ge 0.990$).

Prawa Timingu ($\phi$)

1. Chronometria: Złota Sekunda ($GS$)

Fundamentem wszystkich animacji jest Złota Sekunda, zdefiniowana jako dokładnie 1618 ms.

Reguła derywacji: Każdy parametr czasowy (czas trwania, opóźnienie) musi być liniową kombinacją stałych kanonicznych derywowanych z $GS$ i potęg liczby $\phi$.

Zakaz „Magic Numbers”: Użycie wartości spoza kaskady timingów skutkuje błędem STATE_VIOLATION i blokuje proces budowy systemu.

2. Kaskada Timingów (Timing Scale)

System wymusza stosowanie dyskretnych kroków czasowych zapisanych w tokenach:

--dur-instant (61,8 ms): Mikroruchy UI ($100 / \phi$).

--dur-micro (100 ms): Bazowy krok interakcji ($\phi^0 \times 100$).

--dur-swift (161,8 ms): Szybkie przejścia stanów ($\phi^1 \times 100$).

--dur-standard (261,8 ms): Domyślne animacje komponentów ($\phi^2 \times 100$).

--dur-moderate (423,6 ms): Złożone transformacje ($\phi^3 \times 100$).

--dur-golden (1618 ms): Pełna Złota Sekunda; tempo bazowe.

--dur-breathe (2618 ms): Krótkie cykle oddechowe ($\phi^2 \times 1000$).

--dur-ceremony (6854 ms): Pełne cykle rytualne i przejścia fazowe ($\phi^4 \times 1000$).

3. Dynamika Ruchu (Easing & Keyframes)

Ruch w systemie Li musi naśladować naturalne procesy organiczne poprzez rygorystyczne sterowanie krzywymi:

Easing $\phi$-pochodny: Dozwolone jest wyłącznie stosowanie punktów kontrolnych opartych na $\phi$ w funkcjach cubic-bezier:

--ease-phi-out: cubic-bezier(0, 0, 0.382, 1) – naturalne wyhamowanie.

--ease-phi-inout: cubic-bezier(0.618, 0, 0.382, 1) – pełna harmonia.

--ease-golden: cubic-bezier(0.382, 0, 0.236, 1).

Dyskretne Klatki Kluczowe: W definicjach @keyframes dopuszczalne są jedynie punkty podziału wynikające z proporcji $\phi$: {0%, 23,6%, 38,2%, 50%, 61,8%, 76,4%, 100%}.

4. Protokoły Specjalne

Synchronizacja z Oddechem: Animacje tła (PhiBreathCycle) są zsynchronizowane z profilami JITAI (np. breathe-focus trwający 9472 ms), co wymusza na interfejsie rytm sprzyjający regulacji sensorycznej.

Reduced Motion (Safety Gate): W przypadku wykrycia ustawienia prefers-reduced-motion, system natychmiastowo nadpisuje wszystkie czasy trwania wartością 0,01 ms. Ruch fizyczny jest zastępowany dyskretnymi zmianami przezroczystości (opacity), aby całkowicie wyeliminować ryzyko przebodźcowania.

5. Walidacja PCS

Każda animacja podlega audytowi Phi Compliance Score. Jeśli stosunek operacji kanonicznych do całkowitych spadnie poniżej 0,990, animacja uznawana jest za „chaos timingowy” i odrzucana przez bramkę jakości.

Spacing, Grid & Layout System

System przestrzenny Li jest realizacją protokołu $\phi$-MATHEMATICAL RIGOR, gdzie każdy piksel i odstęp stanowi deterministyczny kontrakt techniczny. W architekturze Soft-Noir przestrzeń nie jest „pusta” – pełni rolę aktywnego parasola sensorycznego, chroniącego użytkownika przed przebodźcowaniem.

1. Dyskretna Skala Spacingu (Fibonacci Scale)

Zgodnie z „Twardymi Zasadami” (Hard Laws), zabrania się dobierania odstępów metodą heurystyczną („na oko”) oraz stosowania funkcji płynnego skalowania CSS, takich jak clamp(). System wymusza stosowanie wyłącznie dyskretnych kroków derywowanych z $\phi$ lub ciągu Fibonacciego.

Kanoniczna kaskada spacingu (jednostki rem):

--space-3xs: 0,146rem ($\phi^{-5}$) – mikro-odstępy precyzyjne.

--space-2xs: 0,236rem ($\phi^{-4}$) – separacja elementów wewnątrz grup.

--space-xs: 0,382rem ($\phi^{-3} = 1/\phi^2$) – standardowy margines wewnętrzny.

--space-sm: 0,618rem ($\phi^{-2} = 1/\phi$) – mniejszy odstęp między blokami.

--space-md: 1,000rem ($\phi^0$) – Kotwica systemu (Base).

--space-lg: 1,618rem ($\phi^1$) – standardowy odstęp między sekcjami.

--space-xl: 2,618rem ($\phi^2$) – marginesy kontenerów głównych.

--space-2xl: 4,236rem ($\phi^3$) – duże separatory wizualne.

--space-3xl: 6,854rem ($\phi^4$) – marginesy sekcji hero i dashboardów.

2. Proporcje Layoutu (The Law of 61.8%)

Struktura ekranu musi respektować Aksjomat Punktu Zero, dzieląc powierzchnię na treść aktywną i przestrzeń „oddechu” zgodnie ze złotą proporcją.

Content Ratio (61,8%): Przeznaczone na główny strumień informacji i interakcji.

Silence/Breath Ratio (38,2%): Obowiązkowa przestrzeń „oddechu”, służąca regulacji sensorycznej.

Sidebar Width: W stanie spoczynku panele boczne zajmują 23,6% ($\phi^{-3}$) lub 38,2% ($\phi^{-2}$) szerokości viewportu.

3. System Siatki (Grid & Partitioning)

Siatka w systemie Li (PhiSpatialGrid) nie opiera się na tradycyjnym podziale 12-kolumnowym, lecz na deterministycznym podziale $\phi$.

Phi Partitioning: Rekurencyjny podział sekcji odbywa się w proporcji 0,618 : 0,382. Przykład podziału odcinka 10000ms: [(0, 3820), (3820, 6180), (6180, 8291), (8291, 10000)].

Zasada Złotego Prostokąta: Wszystkie kontenery (karty, modale) dążą do zachowania stosunku boków $\phi : 1$.

Gęstość Dashboardu (Density): Implementowana przez dyskretne przesunięcie indeksów spacingu:

Airy: Baza = --space-lg.

Standard: Baza = --space-md.

Compact: Baza = --space-sm.

4. Walidacja Architektoniczna

Każdy layout jest uznawany za gotowy do wdrożenia tylko po zaliczeniu audytu SOFT_NOIR_VERIFICATION_8_OF_8.

PCS Gate: Layout musi osiągnąć wynik $\ge 0,990$ w zakresie spójności z @silence/phi-tokens.

Invariant Zero: System automatycznie blokuje merge (WORLDHALT), jeśli wykryje literalne wartości pikselowe lub naruszenie proporcji 61,8/38,2.

1. Zakaz Ekstremów (No Extremes)

W ekosystemie SILENCE kategorycznie zabronione jest używanie czystej czerni (#000000) oraz czystej bieli (#FFFFFF).

Tło bazowe: Ciepły obsydian (np. hsl(220, 8%, 8%)) zastępuje czerń, eliminując efekt „tnących” krawędzi.

Tekst: Łagodna, „złamana biel” (off-white, np. #E8E4DF) zastępuje czystą biel, co chroni wzrok przed zmęczeniem.

2. Matematyczna Hierarchia Jasności (Luminance Tiers)

Głębia interfejsu budowana jest deterministycznie przez pięć dyskretnych poziomów powierzchni. Każdy kolejny poziom jest skalowany o współczynnik $\sqrt{\phi}$ względem bazowej luminancji tła (~12%).

PoziomTokenWartość HSLPrzeznaczenieTier 0--surface-basehsl(220, 8%, 8%)Abyss anchor: tło bazowe.Tier 1--surface-raisedhsl(220, 7%, 12%)Powierzchnie lekko uniesione.Tier 2--surface-elevatedhsl(220, 6%, 15.3%)Przyciski i elementy interaktywne.Tier 3--surface-overlayhsl(220, 5%, 19.4%)Modale i warstwy nakładane.Tier 4--surface-floathsl(220, 4%, 24.7%)Najwyższy priorytet wizualny.

3. Tekst i Kontrast

Wszystkie kolory tekstu muszą spełniać standardy dostępności AA na trefle Tier 0.

Primary: #E8E8F0 (kontrast ~14.5:1).

Secondary: #CBD5E1 (kontrast ~9.2:1).

Muted: #ADADBD (kontrast ~4.58:1).

4. Barwy Akcentowe i Stany (JITAI States)

Jedynym dopuszczalnym kolorem akcentowym (sygnaturą $\phi$) jest ciepłe złoto. Stany systemu zmieniają tło bazowe, aby zasygnalizować tryb pracy mózgu.

Accent Gold: #C9A84C.

FLOW State: Tło hsl(33, 7%, 11%), Akcent hsl(28, 60%, 54%).

FOCUS State: Tło hsl(25, 4%, 12%), Akcent hsl(22, 50%, 50%).

CALM State: Tło hsl(35, 8%, 14%), Akcent hsl(32, 45%, 50%).

5. Twarde Zasady (Hard Laws)

Zasada dwóch poziomów: Żaden element nie może być o więcej niż dwa poziomy luminancji jaśniejszy od swojego tła (np. Tier 2 na Tier 0 jest dozwolony, ale Tier 3 już nie).

Eliminacja cieni: Stosowanie tradycyjnych cieni (drop-shadows) jest zabronione; trójwymiarowość wynika wyłącznie z różnic luminancji.

Zero-Default Policy: Wszystkie kolory muszą pochodzić z pakietu @silence/phi-tokens. Użycie literalnych kodów HEX w komponentach blokuje proces budowy (WORLDHALT).1. Color Palette Generator (Soft-Noir Origin)

Zasada: Kolory derywowane są z bazowej luminancji ~12% (Tier 0) skalowanej współczynnikiem $\sqrt{\phi}$.

Surface L0 (Abyss): hsl(var(--hue), 8%, 8%) – kotwica systemu.

Surface L1 (Raised): hsl(var(--hue), 7%, 12%) – dla kart i bocznych paneli.

Surface L2 (Elevated): hsl(var(--hue), 6%, 15.3%) – dla buttonów i inputów.

Accent Primary: hsl(var(--hue-accent), 55%, 52%) – derywacja $\phi$ dla widoczności.

2. Typography Scale (Base 16px)

Wszystkie rozmiary oparte na skali $16 \times \phi^n$ lub jej geometrycznych midpointach.

H1 (Major): 41.8px (2.618rem) | Line-height: 1.272 ($\sqrt{\phi}$).

Body (Base): 16px (1.000rem) | Line-height: 1.618 ($\phi$).

Caption: 9.9px (0.618rem) | Line-height: 1.618.

3. Button Style Explorer

Zasada: Brak cieni (drop-shadow). Stan aktywny wynika z przejścia między Tierami luminancji.

Radius: 6.47px (4px * φ) dla standardu.

Padding: Vertical: space-sm (0.618rem), Horizontal: space-md (1rem) – stosunek 1:$\phi$.

Hover State: Przejście o +1 Tier jasności (np. L2 $\rightarrow$ L3) w czasie --dur-swift (161.8ms).

[STRUKTURA]

/li-brand-book
  /core-math
    - constants.css (phi: 1.618, gs: 1618ms)
  /atoms
    /buttons
      - primary: Tier 2 surface, accent-gold text, no-border
      - ghost: transparent, border-tier-1, hover-tier-2
    /cards
      - container: Tier 1 surface, radius-lg (10.47px), padding-phi
      - layout: 61.8% image / 38.2% content split
  /molecules
    /modals
      - overlay: hsl(var(--hue), 8%, 8%, 0.618)
      - entry: slide-up (dur-standard: 261.8ms), ease-phi-out
  /organisms
    /dashboard
      - sidebar-width: 23.6% (1/phi^3)
      - content-max-width: 68.54rem (phi^4 * 10)
      - grid-gap: space-xs (0.382rem) to space-lg (1.618rem)

Szczegóły komponentów:

Card Component: Zabronione jest stosowanie box-shadow. Głębia budowana jest przez kontrast surface-base (L0) i surface-raised (L1). Obrazy wewnątrz karty muszą respektować proporcję 1:$\phi$ lub zostać przycięte do Złotego Prostokąta.

Layout Builder: Header Height musi wynosić dokładnie space-3xl (6.854rem) lub być sumą dur-standard w pikselach dla synchronizacji z oddechem. Sidebar w stanie spoczynku zajmuje 38,2% szerokości, ale w trybie FLOW może zostać zredukowany do 0% lub 14,6% ($\phi^{-5}$).

Dashboard Density: Implementacja poprzez data-density slider:

Airy: Spacing base = space-lg (1.618rem).

Standard: Spacing base = space-md (1.000rem).

Compact: Spacing base = space-sm (0.618rem). Skalowanie jest dyskretne – system przeskakuje między wartościami Fibonacciego, nie dopuszczając wartości pośrednich.

Modal/Dialog: Overlay opacity wynosi dokładnie var(--phi-inv) (0.618). Animacja wejścia musi trwać dur-standard (261.8ms) przy użyciu ease-phi-out (cubic-bezier(0, 0, 0.382, 1)), co zapewnia naturalny, "organiczny" start ruchu.



I. Brand Essence & Positioning

System Li opiera się na paradygmacie Structural Silence (Ciszy Strukturalnej). Jego celem jest ochrona użytkownika przed przebodźcowaniem kognitywnym poprzez stworzenie „parasola sensorycznego”. Neutralność nie istnieje: każdy piksel musi służyć redukcji szumu lub regulacji uwagi.

II. Visual Identity System

Tożsamość wizualna Li jest realizacją Aksjomatu Punktu Zero – artefakty są dostarczane w pełnej, matematycznie zdefiniowanej formie. Fundamentem jest geometria $\phi$, gdzie proporcje 61,8% (treść) do 38,2% (przestrzeń „Ciszy”) stanowią nienaruszalny inwariant układu.

III. Typography

Skala typograficzna opiera się na bazie 16px skalowanej potęgami $\phi$.

H1 (XL): 41,89px ($16 \times \phi^2$)

Body (Base): 16px ($16 \times \phi^0$)

Caption (XS): 9,89px ($16 \times \phi^{-1}$)

Line-height: Zawsze $\phi$ (1,618) dla tekstu ciągłego lub $\sqrt{\phi}$ (1,272) dla nagłówków.

IV. Color Palette (Soft‑Noir)

Kategorycznie zakazuje się używania czystej czerni (#000000) i bieli (#FFFFFF).

Obsidian (Base): hsl(220, 8%, 8%) – ciepły antracyt stanowiący kotwicę systemu.

Off-White (Text): #E8E4DF – łagodna biel eliminująca zmęczenie wzroku.

Li Signature Gold: #C9A84C – jedyny dopuszczalny kolor akcentowy, sygnatura $\phi$.

V. Luminance & Contrast

Skala jasności Luminance Tiers w systemie Soft‑Noir jest matematycznie wyznaczonym kontraktem wizualnym, który zastępuje tradycyjne cienie (drop-shadows) na rzecz głębi budowanej przez dyskretne poziomy luminancji.

Zasady tej skali opierają się na pięciu poziomach (Tiers 0–4), gdzie każdy kolejny poziom powierzchni jest skalowany o współczynnik $\sqrt{\phi}$ (pierwiastek z liczby złotej) względem bazowej luminancji tła.

Hierarchia Jasności (Luminance Tiers)

Zgodnie z kanoniczną specyfikacją phi-tokens.css (v1.1), skala prezentuje się następująco:

PoziomNazwa TokenaWartość HSLLuminancjaOpis i przeznaczenieTier 0--surface-basehsl(220, 8%, 8%)12%Abyss anchor: tło bazowe (ciepły obsydian).Tier 1--surface-raisedhsl(220, 7%, 12%)~15,3%Powierzchnie lekko uniesione, np. panele boczne.Tier 2--surface-elevatedhsl(220, 6%, 15.3%)~19,4%Elementy interaktywne, np. przyciski i inputy.Tier 3--surface-overlayhsl(220, 5%, 19.4%)~24,7%Warstwy nakładane, modale i okna dialogowe.Tier 4--surface-floathsl(220, 4%, 24.7%)30–32%Elementy pływające o najwyższym priorytecie wizualnym.

Twarde Zasady (Hard Laws) implementacji

Wdrażanie tej skali wymaga przestrzegania rygorystycznych reguł projektowych systemu SILENCE:

Zakaz Ekstremów: Kategorycznie zabronione jest używanie czystej czerni (#000000) i bieli (#FFFFFF). Tier 0 jest zakotwiczony na poziomie ~12% jasności, aby uniknąć zmęczenia wzroku.

Zasada dwóch poziomów: Żaden element składowy (np. karta na tle) nie może być o więcej niż dwa poziomy jaśniejszy od swojego tła bazowego (np. element Tier 2 na tle Tier 0). Ma to na celu eliminację agresywnych kontrastów i ochronę "parasola sensorycznego" użytkownika.

Eliminacja cieni: Trójwymiarowość interfejsu musi wynikać wyłącznie z powyższych różnic luminancji oraz odstępów zgodnych z ciągiem Fibonacciego.

Weryfikacja PCS: Każdy kolor musi pochodzić z pakietu @silence/phi-tokens. Użycie wartości spoza skali degraduje wynik Phi Compliance Score i blokuje proces budowy systemu.

Głębia interfejsu budowana jest przez 5 poziomów jasności (L0–L4) skalowanych współczynnikiem $\sqrt{\phi}$.

Tier 0 (Abyss): 12% luminancji (tło bazowe).

Tier 1 (Raised): ~15,3% (karty, panele boczne).

Tier 2 (Elevated): ~19,4% (przyciski, inputy).

Zasada dwóch poziomów: Żaden element nie może być o więcej niż dwa poziomy jaśniejszy od swojego tła.



VI. Tone of Voice & Language Standards

Obowiązuje standard S11 Sterility. Zakazane jest używanie terminologii klinicznej i wellnessowej (np. stres, lęk, terapia).

Zamiast „Stres”: TENSION_SCORE lub STRUCTURAL_REFLECTION.

Zamiast „Zadbaj o siebie”: Przywracanie parametrów bazowych $\phi$.

VII. UI Component Patterns

Button Style Explorer

Radius: --radius-md (6,47px) – derywacja $4px \times \phi$.

Padding: Vertical: --space-sm (0,618rem), Horizontal: --space-md (1rem).

States: Brak cieni (drop-shadows). Hover aktywuje przejście o +1 Tier luminancji (L2 → L3).

Weight: Medium (500) dla tekstu akcentowego #C9A84C.

Card Component

Layout: Podział powierzchni 61,8% (obraz/focal point) i 38,2% (treść).

Shadow depth: Zakazana. Wykorzystuje się kontrast Tier 0 vs Tier 1.

Radius: --radius-lg (10,47px).

Modal/Dialog

Overlay: hsl(220, 8%, 8%, 0.618) – krycie równe odwrotności $\phi$.

Width: Zawsze $\phi^{-1}$ szerokości viewportu lub pełny złoty prostokąt.

Animation: ease-phi-out trwające --dur-standard (261,8ms).

VIII. Spacing, Grid & Layout System

Fibonacci Spacing: Wyłącznie wartości dyskretne: 0,382rem, 0,618rem, 1,0rem, 1,618rem, 2,618rem.

Layout Builder: Max-width kontenera derywowany z $\phi^n$. Sidebar width: 23,6% ($\phi^{-3}$) lub 38,2% ($\phi^{-2}$).

IX. Motion & Animation Protocol

Bazowa jednostka: Złota Sekunda (1618 ms).

Durations: --dur-swift (161,8ms), --dur-standard (261,8ms), --dur-moderate (423,6ms).

Keyframes: Tylko punkty $\phi$: {0%, 23,6%, 38,2%, 61,8%, 76,4%, 100%}.

Reduced Motion: Bezwzględne skrócenie animacji do 0,01 ms i zamiana na opacity.

X. Iconography & Visual Elements

Ikony muszą być wpisane w siatkę złotego podziału. Główne motywy graficzne to formy organiczne derywowane z $\phi$, np. sieć żyłkowania liścia (PhiJitaiLeaf) o kątach 32° ($\arctan(1/\phi)$).



Zasady Soft‑Noir, określane jako „Twarde Zasady” (Hard Laws), są wdrażane w monorepo SILENCE nie jako estetyczny „tryb ciemny”, lecz jako rygorystyczna architektura ochronna i „parasol sensoryczny” mający zapobiegać przebodźcowaniu. Każda decyzja projektowa jest tu traktowana jako deterministyczny kontrakt techniczny, a ich naruszenie skutkuje błędem krytycznym typu STATE_VIOLATION.

Zasady te obejmują następujące fundamenty:

1. Bezwzględny zakaz wartości domyślnych i literalnych

Zero-Default Policy: Wszystkie parametry wizualne (kolory, timingi, spacing) muszą pochodzić wyłącznie z pakietu @silence/phi-tokens. Użycie literalnych kodów hex czy domyślnych kolorów przeglądarki blokuje proces budowy.

Zakaz skrajności (No Extremes): Kategorycznie zabronione jest używanie czystej czerni (#000000) i bieli (#FFFFFF). Zamiast nich stosuje się ciepły obsydian (np. #101318) oraz off-white (np. #E8E4DF).

2. Matematyczna Hierarchia Jasności (Luminance Tiers)

5 poziomów jasności: Głębia interfejsu (Tiers 0–4) jest budowana poprzez skalowanie luminancji współczynnikiem $\sqrt{\phi}$ względem bazy (~12% luminancji).

Zasada dwóch poziomów: Żaden element składowy nie może być o więcej niż dwa poziomy jaśniejszy od swojego tła.

Eliminacja cieni: Tradycyjne cienie (drop-shadows) są zabronione; trójwymiarowość wynika wyłącznie z różnic luminancji i odstępów Fibonacciego.

3. Prawo Timingu ($\phi$) i Ruchu

Derywacja $\phi$: Wszystkie czasy muszą być liniową kombinacją „Złotej Sekundy” (1618 ms) i stałej $\phi$.

Zakaz płynnego skalowania: Zabronione jest stosowanie funkcji CSS takich jak clamp(), min() czy max() – system wymaga jednej, deterministycznej wartości.

Reduced Motion: Przy włączonym ustawieniu ograniczenia ruchu animacje są automatycznie skracane do 0,01 ms i zastępowane dyskretnymi zmianami przezroczystości.

4. Dyskretna Skala Spacingu i Proporcje

Skala Fibonacciego: Odstępy są dobierane wyłącznie z ciągu Fibonacciego (np. 3, 5, 8, 13, 21 px lub ich odpowiedniki w rem).

Proporcja „Ciszy”: Układ ekranu musi zachowywać podział na 61,8% treści aktywnej i 38,2% przestrzeni „oddechu” (whitespace).

5. Walidacja i Egzekwowanie (Quality Gates)

PCS (Phi Compliance Score): Każdy moduł musi osiągnąć wynik $\ge 0,990$ (dla rdzenia) lub $0,970$ (dla procesów pomocniczych).

S11 Sterility: Automatyczne lintery (np. @silence/s11-lint) blokują kod zawierający terminologię kliniczną (np. stres, lęk), wymuszając deskryptory strukturalne (np. TENSION_SCORE).

WORLDHALT: Status natychmiastowo blokujący merge w przypadku wykrycia „magic numbers”, braku definicji matematycznej lub naruszenia sterylności językowej.

Implementacja w CSS (Plik: phi-tokens.css)

/* [T] PHI Spacing Scale - R-001 Compliant */
:root {
  --phi: 1.618033988749895;

  /* Skala dyskretna (rem) derywowana z φ^n */
  --space-3xs:  0.146rem;  /* φ⁻⁵ ≈ 1/φ^5 */
  --space-2xs:  0.236rem;  /* φ⁻⁴ */
  --space-xs:   0.382rem;  /* φ⁻³ = 1/φ² */
  --space-sm:   0.618rem;  /* φ⁻² = 1/φ  */
  --space-md:   1.000rem;  /* φ⁰  (Base)  */
  --space-lg:   1.618rem;  /* φ¹         */
  --space-xl:   2.618rem;  /* φ²         */
  --space-2xl:  4.236rem;  /* φ³         */
  --space-3xl:  6.854rem;  /* φ⁴         */

  /* Proporcje Layoutu (Hard Laws) */
  --phi-content: 61.8%;    /* Treść aktywna */
  --phi-silence: 38.2%;    /* Przestrzeń oddechu */
}

/* Przykład użycia w komponencie z zachowaniem rygoru */
.phi-container {
  display: flex;
  gap: var(--space-md);          /* 1.000rem */
  padding: var(--space-xl);      /* 2.618rem */
  margin-bottom: var(--space-lg); /* 1.618rem */
}

.phi-card {
  /* Proporcja 1:φ między paddingiem pionowym a poziomym */
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md); /* 6.472px = 4px * φ */
}

Złota Sekunda (ang. Golden Second, $GS$) stanowi bazową jednostkę chronometrii w ekosystemie SILENCE, zdefiniowaną jako dokładnie 1618 ms. Jej wartość wynika bezpośrednio z przybliżenia liczby $\phi \times 1000$ wyrażonego w liczbach całkowitych, co eliminuje błędy zaokrągleń w obliczeniach czasu.

Wpływ Złotej Sekundy na animacje i parametry czasowe systemu jest determinowany przez następujące rygory techniczne:

1. Zasada Liniowej Kombinacji

Zgodnie z protokołem $\phi$-MATHEMATICAL RIGOR, każdy timing w systemie (animacja, interwał, timeout) musi być liniową kombinacją stałych kanonicznych derywowanych ze Złotej Sekundy i potęg liczby $\phi$. Użycie wartości niebędących takimi kombinacjami jest klasyfikowane jako błąd krytyczny (STATE_VIOLATION) i blokuje proces budowy (CI/CD).

2. Kaskada Timingów (Timing Law)

Wszystkie czasy trwania animacji są ustandaryzowane w plikach tokenów (phi-tokens.css) i podzielone na dyskretne kroki:

--dur-instant (61,8 ms): Mikroruchy UI ($100 / \phi$).

--dur-swift (161,8 ms): Szybkie przejścia ($\phi^1 \times 100$).

--dur-standard (261,8 ms): Domyślne animacje ($\phi^2 \times 100$).

--dur-moderate (423,6 ms): Umiarkowane tempo ($\phi^3 \times 100$).

--dur-golden (1618 ms): Pełna Złota Sekunda.

--dur-breathe (2618 ms): Cykle oddechowe ($\phi^2 \times 1000$).

--dur-ceremony (6854 ms): Pełne cykle rytualne ($\phi^4 \times 1000$).

3. Kontrola Krzywych i Klatek Kluczowych

Wpływ $\phi$ rozciąga się również na dynamikę ruchu (easing) oraz strukturę klatek kluczowych:

Punkty kontrolne easing: Dozwolone jest wyłącznie użycie punktów derywowanych z $\phi$ w funkcjach cubic-bezier (np. 0.382, 0.618), co zapewnia „organiczną” charakterystykę ruchu.

Procentowe klatki kluczowe: W definicjach @keyframes dopuszczalne są jedynie punkty podziału $\phi$, takie jak 0%, 23,6%, 38,2%, 50%, 61,8%, 76,4% i 100%.

4. Bezpieczeństwo Sensoryczne (Reduced Motion)

System bezwzględnie respektuje flagę prefers-reduced-motion. W takim przypadku Złota Sekunda i jej pochodne są natychmiastowo nadpisywane wartością 0,01 ms. Ruch jest zastępowany dyskretnymi zmianami przezroczystości (opacity), aby chronić użytkownika przed przebodźcowaniem.

Każda operacja czasowa jest logowana w EffectLog jako nienaruszalna tranzycja FSM-Φ, co pozwala na bitowo identyczne odtworzenie (replay) sesji animacji.
