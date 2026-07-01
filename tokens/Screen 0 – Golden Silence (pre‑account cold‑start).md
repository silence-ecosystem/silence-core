Poniżej masz storyboard pięciu ekranów jako jeden, spójny „oddechowy” JITAI cold‑start, z zaznaczeniem geometrii φ, motion cue’ów i tego, jakie zmienne seedują personalizację.

---

## **Screen 0 – Golden Silence (pre‑account cold‑start)**

**Cel:** pasywnie zmierzyć time‑to‑first‑tap jako pierwszy tailoring variable (receptywność / przeciążenie) w JITAI.\[[pmc.ncbi.nlm.nih](https://pmc.ncbi.nlm.nih.gov/articles/PMC5364076/)\]

* **Layout & geometria**  
  * Portret 9:16, tło Soft Noir (prawie czarne, lekko ciepłe).  
  * W centrum jeden **złoty prostokąt** o proporcji 1:1.618, ustawiony pionowo, w osi Fitts‑friendly (trochę poniżej środka, w strefie kciuka).  
  * Marginesy pionowe i poziome w skali Fibonacciego: top/bottom \~ `--space-2xl`, lewa/prawa \~ `--space-xl`.\[[blog.logrocket](https://blog.logrocket.com/ux-design/using-the-golden-ratio-in-ux-design/)\]  
* **Ruch / czas**  
  * Prostokąt bardzo delikatnie „oddycha” zgodnie z **Calm**: wolny scale/opacity puls oparty o φ‑animację (np. 2.618s wdech \+ 1.618s „trzymanie” \+ 2.618s wydech).  
  * Pierwszy cykl: **zero tekstu, zero CTA** – tylko puls; po pełnym Calm cyklu pojawia się subtelny napis pod prostokątem: „Tap when jesteś gotowa/y”.  
  * Cała animacja respektuje `prefers-reduced-motion`: przy włączonej redukcji prostokąt jest statyczny, tylko lekka zmiana luminancji przy tapie.\[[tpgi](https://www.tpgi.com/short-note-on-prefers-reduced-motion-and-puzzled-windows-users/)\]  
* **Sygnalizacja hierarchii**  
  * Jedyny jasny element to złoty kontur / miękkie światło prostokąta (φ‑frame).  
  * Hint tekstowy ma mniejszy rozmiar, kontrast wysoki, ale niska waga – nie konkuruje z prostokątem.  
* **JITAI tailoring variables**  
  * **time\_to\_first\_tap**: długi brak interakcji → potencjalne przeciążenie / niepewność; szybki tap → ciekawość / wysoka pobudliwość.  
  * **tap\_location** (opcjonalnie): środek vs krawędzie może sugerować ostrożność vs impuls.  
  * To jest pierwszy punkt w JITAI: jeśli użytkownik ignoruje prompt, system interpretuje to jako brak gotowości → później może pokazać bardziej „cichą” wersję dashboardu.\[[academic.oup](https://academic.oup.com/abm/article-abstract/52/6/446/4733473)\]

---

## **Screen 1 – „Twój rytm” (breathing calibration \+ motion profile)**

**Cel:** zbudować poczucie sprawczości („app dostosowuje się do mnie”) i zebrać sensory/motion tolerances jako zmienne dla polityki JITAI.\[[expiwell](https://www.expiwell.com/post/cutting-edge-applications-of-just-in-time-adaptive-interventions)\]

* **Layout & geometria**  
  * Ten sam Soft Noir background, centralnie **złota rama / koło** wpisane w złoty prostokąt 1:1.618.  
  * Prosta linia tekstu nad ramą: „PatternLens dostosowuje się do Twojego tempa.” – szerokość tekstu \~61.8% szerokości ekranu, wycentrowana, odległość od ramy \= `--space-lg` (φ‑spacing).  
  * Dół ekranu: dwa toggles jako **złote kapsuły** ze stanami w jednej linii (połowa szerokości każda karta), z paddingami w skali Fibonacci (sm/md).  
* **Ruch / czas**  
  * Centralna forma oddycha w **Focus** profilu: np. 3s inhale, 1.618s hold, 4.854s exhale – z wyraźnymi, ale łagodnymi zmianami promienia i jasności, zsynchronizowanymi z Golden Second i jej φ‑mnożnikami.  
  * Subtelny hint „Oddychaj z kształtem” może pojawić się dopiero po 1–2 cyklach, aby nie przeładować tekstem.  
* **Interakcje (ergonomia)**  
  * Dwa wiersze toggle’i:  
    * „Ruch”: low / medium / high – każda opcja to duży tap‑target, etykieta w jednej linii, odległość między kapsułami \~ `--space-sm`.  
    * „Dźwięk / Haptics”: off / soft / normal – analogicznie.  
  * Ustawienia można zmienić jednym tapem; brak twardego „Dalej” – przejście następuje po krótkim bezruchu lub lekkim CTA w prawym dolnym rogu.  
* **JITAI tailoring variables**  
  * **motion\_pref**: {low, medium, high} – steruje intensywnością animacji, ilością ruchu w dalszych ekranach.\[[blog.pope](https://blog.pope.tech/2025/12/08/design-accessible-animation-and-movement/)\]  
  * **audio\_haptic\_pref**: {off, soft, normal} – decyduje o haptic patternach i audio cues.  
  * **breath\_sync\_engagement**: czy użytkownik faktycznie podąża za rytmem (np. mikro‑tapy / gesty zsynchronizowane z fazami oddechu).  
  * Te zmienne trafiają do polityki JITAI jako constraints: górne limity gęstości ruchu i feedbacku sensorycznego.

---

## **Screen 2 – „Trzy stany” (Flow / Focus / Calm cards \+ micro‑JITAI)**

**Cel:** wyczuć, który stan jest „domyślny” dziś, oraz czy użytkownik ma styl bardziej seeker (częste przełączanie) czy avoider (długi dwell).\[[pmc.ncbi.nlm.nih](https://pmc.ncbi.nlm.nih.gov/articles/PMC11218018/)\]

* **Layout & geometria**  
  * Trzy **poziome złote prostokąty** (1:1.618) ułożone pionowo, każdy zajmuje \~20–22% wysokości, z pionowym gapem \= `--space-md` (Fibonacci).  
  * Karty rozciągają się prawie na szerokość ekranu (lewy/prawy margines \= `--space-lg`).  
  * Etykiety w lewym górnym rogu każdej karty: FLOW / FOCUS / CALM, małe caps, wysoki kontrast.  
  * Nad kartami subtelny tekst (jedna linijka): „Dotknij i chwilę zostań. Zobacz, który stan jest dziś najbliżej Twojego mózgu.”  
* **Różnice wizualne między kartami**  
  * **FLOW:** więcej detalu – delikatny pattern (np. drobne fale / noise), lekko żywszy gold accent, szybszy oddech (krótsze cykle).  
  * **FOCUS:** umiarkowany detal, wyraźna centralna forma (np. pionowy pasek / prostokąt), rytm pośredni.  
  * **CALM:** niemal pusty, tylko miękkie gradienty i wolny oddech (długie fazy, mała amplituda).  
* **Ruch / interakcja**  
  * Tap na kartę → ona „aktywna”: minimalne zwiększenie jasności, wzmocnienie oddechu, opcjonalny bardzo delikatny haptic pulse (respect motion/audio prefs ze Screen 1).  
  * Przełączanie między kartami nie ma animowanych przejść pełnoekranowych – ruch jest lokalny do kart, by nie przeładować.  
* **JITAI tailoring variables**  
  * **preferred\_state\_today**: {FLOW, FOCUS, CALM} na podstawie najdłuższego dwell‑time.  
  * **state\_switch\_frequency**: ile razy użytkownik zmienił kartę w krótkim czasie – wysoka wartość → *seeker* / wysoka ciekawość; niska → *avoider* / preferencja stabilności.  
  * **state\_dwell\_distribution**: procent czasu spędzonego w każdym stanie; seed do attention profile (np. kto wybiera Calm, dostaje początkowo mniej gęsty dashboard).  
  * Te wartości idą do JITAI jako wagi przy wyborze pierwszych protokołów (Pattern Shift vs Quiet Loop vs Calm‑first).

---

## **Screen 3 – „Twoja przestrzeń na dane” (expectation priming)**

**Cel:** przygotować na naturę dashboardu i jednocześnie spytać o preferowaną gęstość (light vs dense) – to kolejny tailoring variable.\[[elegantthemes](https://www.elegantthemes.com/blog/design/mastering-the-golden-ratio-in-design)\]

* **Layout & geometria**  
  * Tło Soft Noir, w **górnych 60–65% ekranu** złoty prostokąt symulujący dashboard: kilka prostokątnych bloków (karty, wykres placeholdery) ułożonych w gridzie Fibonacci:  
    * np. jedna szeroka karta 61.8% szerokości \+ węższa kolumna 38.2%;  
    * pionowe spacingi \= `--space-sm`/`--space-md`.  
  * Wszystko w trybie „wireframe”: tylko kontury / lekko jaśniejsze powierzchnie, zero tekstu liczbowego.  
  * Pod wireframe’ową strefą krótki tekst: „To jest wersja ciszy. Dane pojawią się dopiero, gdy będziesz gotowa/y.”  
* **Interakcja (mikro‑CTA)**  
  * Dwa przyciski / kapsuły w dolnej części:  
    * „Pokaż mi więcej” (po prawej) – wizualnie bardziej energiczny (ale nadal Soft Noir).  
    * „Zacznij spokojniej” (po lewej) – bardziej neutralny.  
  * Odstęp między nimi \= `--space-md`, oba w jednej linii, szerokie tap targets.  
* **Ruch / czas**  
  * Wireframe „pojawia się” sekwencyjnie w Golden Second: pierwszy blok fade‑in w 262ms, kolejne w krokach 162–262ms, żeby ciało „poczuło” rytm bez agresywnych animacji.  
  * Przy `prefers-reduced-motion` wszystko statycznie, ewentualnie proste fade‑in bez przesunięcia.\[[w3](https://www.w3.org/WAI/WCAG22/Techniques/css/C39)\]  
* **JITAI tailoring variables**  
  * **dashboard\_density\_pref**: {dense, light} na podstawie CTA:  
    * „Pokaż mi więcej” → start od gęstszej wersji (więcej kart, więcej metryk).  
    * „Zacznij spokojniej” → minimalny, „ciszowy” dashboard, mniej kart i ruchu.  
  * Ta zmienna steruje pierwszą konfiguracją layoutu, ilością widżetów oraz poziomem szczegółowości tekstu na starcie.

---

## **Screen 4 – „Jak reagujemy na Twoje tempo?” (Fibonacci Damping opt‑in)**

**Cel:** explicite zapytać o zgodę na progresywne spowolnienie interfejsu (behavioral pacing), co stanie się centralnym parametrem JITAI dla interfejsu (progressive deceleration).\[[pmc.ncbi.nlm.nih](https://pmc.ncbi.nlm.nih.gov/articles/PMC5364076/)\]

* **Layout & geometria**  
  * Pojedyncza, szeroka karta (złoty prostokąt) w centrum, z marginesami \= `--space-xl` góra/dół i `--space-lg` boki.  
  * W karcie:  
    * Krótki tytuł („Jak reagujemy na Twoje tempo?”).  
    * 1–2 linie wyjaśnienia w prostym języku: „Gdy klikasz bardzo szybko, możemy delikatnie zwolnić interfejs, żeby Twój mózg miał szansę złapać oddech. Chcesz?”  
  * Pod tym **duży, neuroaffirming switch**:  
    * Dwustronny suwak OFF / ON, z tekstem „ND‑first” (np. „OFF – Zostaw tak, jak jest”, „ON – Pomóż mi zwolnić”).  
  * Niżej **slider** w złotej ramce: oś z opisem „Follow my speed ↔ Breathe with me”.  
    * Pozycja zero → brak dodatkowego dampingu.  
    * Prawa skrajność → maksymalne progresywne spowalnianie.  
* **Ruch / sygnały**  
  * Zmiana slidera może subtelnie wpływać na „puls” małego wskaźnika w karcie – szybki puls po lewej, wolniejszy po prawej, pokazując efekt bez wielkich animacji.  
* **JITAI tailoring variables**  
  * **damping\_opt\_in**: {true,false} – czy użytkownik godzi się na behavioral pacing (kluczowy sygnał dla polityki JITAI).  
  * **damping\_intensity**: skalar 0–1 (pozycja slidera) → wagi dla φ‑czasów: ile overshoot możemy dodać ponad Golden Second przy wykryciu „spam‑tapów”.  
  * Te zmienne zasilają „Fibonacci Damping Engine” – np. ile kroków w górę po φ‑skarze można przejść przy długich sesjach lub intensywnym kliku.

---

## **Jak to wszystko spina Golden Ratio Silence jako cold‑start JITAI seed**

* **φ‑geometria** jest widoczna na każdym ekranie: centralny prostokąt 1.618:1, proporcje 61.8/38.2 między content a breathing space, spacing oparty na Fibonaccim.\[[scinet](https://www.scinet.eu/en/blog/webdesign/der-goldene-schnitt-harmonie-fibonacci-webdesign/)\]  
* **Czas** jest zorganizowany wokół Złotej Sekundy: pierwsze pojawienie się tekstu na Screen 0 po pełnym Calm oddechu; animacje i reveal’e w Screen 3–4 korzystają z 262/424/1618ms i ich φ‑pochodnych.  
* **JITAI tailoring variables** budują pierwszy wektor profilu:  
  * `time_to_first_tap`  
  * `motion_pref`, `audio_haptic_pref`  
  * `preferred_state_today`, `state_switch_frequency`, `state_dwell_distribution`  
  * `dashboard_density_pref`  
  * `damping_opt_in`, `damping_intensity`  
* Ten wektor jest attention‑profiling seedem – zanim osoba zobaczy jakiekolwiek „prawdziwe” dane, system już ma:  
  * przybliżony **styl uwagi** (seeker vs avoider),  
  * **próg sensoryczny** (ile ruchu/dźwięku),  
  * preferowaną **gęstość informacji**,  
  * i **gotowość na zewnętrzny pacing**.

W efekcie onboarding wygląda jak spokojny, minimalistyczny rytuał oddechowy, ale w warstwie JITAI jest pełnoprawnym cold‑start inferencerem, który kalibruje zarówno UI, jak i politykę interwencji bez ani jednego formularza.

Poniżej masz pojedynczy, samowystarczalny TSX‑komponent „JITAI cold‑start” z golden ratio grid, gotowy jako Client Component w App Router (np. `app/onboarding/JitaiColdStart.tsx`). Używa prostego golden‑ratio layoutu, zbiera seed‑dane (time‑to‑tap, spoons, motion/sound, tempo) i jest WCAG 2.2‑friendly.\[[dev](https://dev.to/madsstoumann/the-golden-ratio-in-css-53d0)\]

tsx  
`'use client';`

`import React, { useEffect, useRef, useState } from 'react';`

`type SpoonLevel = 'zero' | 'some' | 'full' | null;`  
`type MotionLevel = 'low' | 'medium' | 'high' | null;`  
`type SoundLevel = 'off' | 'soft' | 'normal' | null;`  
`type TempoPref = 'quick' | 'neutral' | 'slow' | null;`

`interface TailoringSeed {`  
  `timeToFirstTapMs: number | null;`  
  `spoons: SpoonLevel;`  
  `motion: MotionLevel;`  
  `sound: SoundLevel;`  
  `tempo: TempoPref;`  
`}`

`interface JitaiColdStartProps {`  
  `onSeedReady?: (seed: TailoringSeed) => void;`  
`}`

`const PHI = 1.618033988749895;`

`export const JitaiColdStart: React.FC<JitaiColdStartProps> = ({`  
  `onSeedReady,`  
`}) => {`  
  `const [phase, setPhase] = useState<0 | 1 | 2>('0' as 0); // 0: Golden Silence, 1: Rhythm, 2: Summary`  
  `const [hintVisible, setHintVisible] = useState(false);`

  `const startTimeRef = useRef<number | null>(null);`  
  `const [timeToFirstTap, setTimeToFirstTap] = useState<number | null>(null);`

  `const [spoons, setSpoons] = useState<SpoonLevel>(null);`  
  `const [motion, setMotion] = useState<MotionLevel>(null);`  
  `const [sound, setSound] = useState<SoundLevel>(null);`  
  `const [tempo, setTempo] = useState<TempoPref>(null);`

  `// Start timer when component mounts`  
  `useEffect(() => {`  
    `startTimeRef.current = performance.now();`

    `// pokaz hint po jednym cyklu Calm (np. 2.618s + 1.618s + 2.618s ≈ 7s)`  
    `const calmCycleMs = (2.618 + 1.618 + 2.618) * 1000;`  
    `const id = window.setTimeout(() => setHintVisible(true), calmCycleMs);`  
    `return () => window.clearTimeout(id);`  
  `}, []);`

  `// Wyślij seed kiedy mamy minimalny zestaw (po Phase 1)`  
  `useEffect(() => {`  
    `if (!onSeedReady) return;`  
    `if (timeToFirstTap == null) return;`

    `onSeedReady({`  
      `timeToFirstTapMs: timeToFirstTap,`  
      `spoons,`  
      `motion,`  
      `sound,`  
      `tempo,`  
    `});`  
  `}, [onSeedReady, timeToFirstTap, spoons, motion, sound, tempo]);`

  `const handleGoldenTap = () => {`  
    `if (timeToFirstTap == null && startTimeRef.current != null) {`  
      `const now = performance.now();`  
      `setTimeToFirstTap(now - startTimeRef.current);`  
    `}`  
    `setPhase(1);`  
  `};`

  `const canContinueFromRhythm =`  
    `spoons !== null && motion !== null && sound !== null && tempo !== null;`

  `return (`  
    `<section`  
      `className="jitai-coldstart-root"`  
      `aria-label="PatternLens JITAI cold-start"`  
      `style={{`  
        `minHeight: '100vh',`  
        `display: 'flex',`  
        `flexDirection: 'column',`  
        `backgroundColor: 'hsl(220, 8%, 8%)',`  
        `color: '#E8E4DF',`  
      `}}`  
    `>`  
      `<div`  
        `className="jitai-coldstart-inner"`  
        `style={{`  
          `flex: 1,`  
          `display: 'flex',`  
          `flexDirection: 'column',`  
          `padding: '1.618rem',`  
          `maxWidth: 480,`  
          `margin: '0 auto',`  
        `}}`  
      `>`  
        `{phase === 0 && (`  
          `<GoldenSilenceScreen`  
            `hintVisible={hintVisible}`  
            `onTap={handleGoldenTap}`  
          `/>`  
        `)}`

        `{phase === 1 && (`  
          `<RhythmScreen`  
            `spoons={spoons}`  
            `setSpoons={setSpoons}`  
            `motion={motion}`  
            `setMotion={setMotion}`  
            `sound={sound}`  
            `setSound={setSound}`  
            `tempo={tempo}`  
            `setTempo={setTempo}`  
            `onNext={() => setPhase(2)}`  
            `canContinue={canContinueFromRhythm}`  
          `/>`  
        `)}`

        `{phase === 2 && (`  
          `<SummarySeedScreen`  
            `seed={{`  
              `timeToFirstTapMs: timeToFirstTap,`  
              `spoons,`  
              `motion,`  
              `sound,`  
              `tempo,`  
            `}}`  
          `/>`  
        `)}`  
      `</div>`  
    `</section>`  
  `);`  
`};`

*`/* ───────────────── Golden Silence (Screen 0) ───────────────── */`*

`interface GoldenSilenceProps {`  
  `hintVisible: boolean;`  
  `onTap: () => void;`  
`}`

`const GoldenSilenceScreen: React.FC<GoldenSilenceProps> = ({`  
  `hintVisible,`  
  `onTap,`  
`}) => {`  
  `return (`  
    `<div`  
      `className="golden-silence-screen"`  
      `style={{`  
        `flex: 1,`  
        `display: 'flex',`  
        `alignItems: 'center',`  
        `justifyContent: 'center',`  
        `flexDirection: 'column',`  
        `gap: '1rem',`  
      `}}`  
    `>`  
      `{/* Golden rectangle 1:1.618 in 9:16 frame */}`  
      `<button`  
        `type="button"`  
        `onClick={onTap}`  
        `aria-label="Zacznij, gdy poczujesz gotowość"`  
        `style={{`  
          `position: 'relative',`  
          `width: '70vw',`  
          `maxWidth: 320,`  
          ``aspectRatio: `1 / ${PHI}`, // 1:1.618``  
          `borderRadius: 24,`  
          `border: '1px solid rgba(232, 228, 223, 0.4)',`  
          `background:`  
            `'radial-gradient(circle at 30% 20%, rgba(232, 228, 223, 0.2), transparent 60%), rgba(10, 10, 14, 0.8)',`  
          `boxShadow: '0 0 40px rgba(232, 228, 223, 0.12)',`  
          `overflow: 'hidden',`  
          `cursor: 'pointer',`  
          `touchAction: 'manipulation',`  
        `}}`  
      `>`  
        `{/* Soft breathing via CSS animation (assume class in globals.css) */}`  
        `<div`  
          `aria-hidden="true"`  
          `className="golden-silence-breath"`  
          `style={{`  
            `position: 'absolute',`  
            `inset: 0,`  
          `}}`  
        `/>`  
      `</button>`

      `{hintVisible && (`  
        `<p`  
          `style={{`  
            `marginTop: '0.618rem',`  
            `fontSize: '0.875rem',`  
            `color: 'rgba(232, 228, 223, 0.78)',`  
          `}}`  
        `>`  
          `Tap when jesteś gotowa/y`  
        `</p>`  
      `)}`  
    `</div>`  
  `);`  
`};`

*`/* ───────────────── Rhythm + Motion Profile (Screen 1) ───────────────── */`*

`interface RhythmProps {`  
  `spoons: SpoonLevel;`  
  `setSpoons: (v: SpoonLevel) => void;`  
  `motion: MotionLevel;`  
  `setMotion: (v: MotionLevel) => void;`  
  `sound: SoundLevel;`  
  `setSound: (v: SoundLevel) => void;`  
  `tempo: TempoPref;`  
  `setTempo: (v: TempoPref) => void;`  
  `onNext: () => void;`  
  `canContinue: boolean;`  
`}`

`const RhythmScreen: React.FC<RhythmProps> = ({`  
  `spoons,`  
  `setSpoons,`  
  `motion,`  
  `setMotion,`  
  `sound,`  
  `setSound,`  
  `tempo,`  
  `setTempo,`  
  `onNext,`  
  `canContinue,`  
`}) => {`  
  `return (`  
    `<div`  
      `className="rhythm-screen"`  
      `style={{`  
        `display: 'grid',`  
        `gridTemplateRows: 'auto 1fr auto',`  
        `rowGap: '1.0rem',`  
        `height: '100%',`  
      `}}`  
    `>`  
      `<header>`  
        `<p`  
          `style={{`  
            `fontSize: '0.875rem',`  
            `opacity: 0.82,`  
          `}}`  
        `>`  
          `PatternLens dostosowuje się do Twojego tempa.`  
        `</p>`  
      `</header>`

      `<div`  
        `style={{`  
          `display: 'flex',`  
          `flexDirection: 'column',`  
          `alignItems: 'center',`  
          `justifyContent: 'center',`  
          `gap: '1.618rem',`  
        `}}`  
      `>`  
        `{/* Breathing circle in golden frame */}`  
        `<div`  
          `aria-hidden="true"`  
          `style={{`  
            `width: '52vw',`  
            `maxWidth: 240,`  
            `aspectRatio: '1 / 1',`  
            `borderRadius: '999px',`  
            `border: '1px solid rgba(232, 228, 223, 0.3)',`  
            `position: 'relative',`  
            `overflow: 'hidden',`  
          `}}`  
        `>`  
          `<div`  
            `className="breath-focus"`  
            `style={{`  
              `position: 'absolute',`  
              `inset: '12%',`  
              `borderRadius: '999px',`  
              `background:`  
                `'radial-gradient(circle at 30% 20%, rgba(232, 228, 223, 0.22), transparent 65%)',`  
            `}}`  
          `/>`  
        `</div>`

        `{/* Spoons selector */}`  
        `<fieldset`  
          `style={{`  
            `border: 'none',`  
            `padding: 0,`  
            `margin: 0,`  
            `width: '100%',`  
          `}}`  
        `>`  
          `<legend`  
            `style={{`  
              `fontSize: '0.875rem',`  
              `marginBottom: '0.5rem',`  
              `opacity: 0.9,`  
            `}}`  
          `>`  
            `Dziś mam…`  
          `</legend>`  
          `<div`  
            `role="radiogroup"`  
            `aria-label="Dzisiejsza ilość łyżeczek energii"`  
            `style={{`  
              `display: 'grid',`  
              `gridTemplateColumns: 'repeat(3, 1fr)',`  
              `gap: '0.618rem',`  
            `}}`  
          `>`  
            `{[`  
              `['zero', 'zero spoons'],`  
              `['some', 'some spoons'],`  
              `['full', 'full spoons'],`  
            `].map(([value, label]) => (`  
              `<button`  
                `key={value}`  
                `type="button"`  
                `role="radio"`  
                `aria-checked={spoons === value}`  
                `onClick={() => setSpoons(value as SpoonLevel)}`  
                `style={{`  
                  `minHeight: 44,`  
                  `borderRadius: 999,`  
                  `border:`  
                    `spoons === value`  
                      `? '1px solid rgba(232, 228, 223, 0.9)'`  
                      `: '1px solid rgba(232, 228, 223, 0.25)',`  
                  `backgroundColor:`  
                    `spoons === value`  
                      `? 'rgba(232, 228, 223, 0.18)'`  
                      `: 'rgba(10, 10, 14, 0.8)',`  
                  `color: '#E8E4DF',`  
                  `fontSize: '0.8125rem',`  
                  `padding: '0.382rem 0.618rem',`  
                `}}`  
              `>`  
                `{label}`  
              `</button>`  
            `))}`  
          `</div>`  
        `</fieldset>`  
      `</div>`

      `{/* Motion / sound / tempo controls in φ grid */}`  
      `<footer`  
        `style={{`  
          `display: 'grid',`  
          `gridTemplateColumns: '1fr',`  
          `rowGap: '0.618rem',`  
        `}}`  
      `>`  
        `{/* Motion */}`  
        `<LabeledPillRow`  
          `label="Ruch"`  
          `options={[`  
            `['low', 'low'],`  
            `['medium', 'medium'],`  
            `['high', 'high'],`  
          `]}`  
          `value={motion}`  
          `onChange={(v) => setMotion(v as MotionLevel)}`  
        `/>`

        `{/* Sound / Haptics */}`  
        `<LabeledPillRow`  
          `label="Dźwięk / Haptics"`  
          `options={[`  
            `['off', 'off'],`  
            `['soft', 'soft'],`  
            `['normal', 'normal'],`  
          `]}`  
          `value={sound}`  
          `onChange={(v) => setSound(v as SoundLevel)}`  
        `/>`

        `{/* Tempo preference */}`  
        `<LabeledPillRow`  
          `label="Tempo"`  
          `options={[`  
            `['quick', 'quick'],`  
            `['neutral', 'neutral'],`  
            `['slow', 'slow'],`  
          `]}`  
          `value={tempo}`  
          `onChange={(v) => setTempo(v as TempoPref)}`  
        `/>`

        `<button`  
          `type="button"`  
          `onClick={onNext}`  
          `disabled={!canContinue}`  
          `style={{`  
            `marginTop: '0.618rem',`  
            `width: '100%',`  
            `minHeight: 48,`  
            `borderRadius: 999,`  
            `border: 'none',`  
            `backgroundColor: canContinue`  
              `? 'rgba(232, 228, 223, 0.9)'`  
              `: 'rgba(232, 228, 223, 0.3)',`  
            `color: '#111318',`  
            `fontWeight: 600,`  
            `fontSize: '0.9375rem',`  
            `cursor: canContinue ? 'pointer' : 'default',`  
          `}}`  
        `>`  
          `Zapisz mój dzisiejszy rytm`  
        `</button>`  
      `</footer>`  
    `</div>`  
  `);`  
`};`

`interface LabeledPillRowProps {`  
  `label: string;`  
  `options: [string, string][];`  
  `value: string | null;`  
  `onChange: (val: string) => void;`  
`}`

`const LabeledPillRow: React.FC<LabeledPillRowProps> = ({`  
  `label,`  
  `options,`  
  `value,`  
  `onChange,`  
`}) => (`  
  `<div>`  
    `<div`  
      `style={{`  
        `fontSize: '0.8125rem',`  
        `marginBottom: '0.236rem',`  
        `opacity: 0.8,`  
      `}}`  
    `>`  
      `{label}`  
    `</div>`  
    `<div`  
      `role="radiogroup"`  
      `aria-label={label}`  
      `style={{`  
        `display: 'grid',`  
        ``gridTemplateColumns: `repeat(${options.length}, 1fr)`,``  
        `gap: '0.618rem',`  
      `}}`  
    `>`  
      `{options.map(([val, text]) => {`  
        `const selected = value === val;`  
        `return (`  
          `<button`  
            `key={val}`  
            `type="button"`  
            `role="radio"`  
            `aria-checked={selected}`  
            `onClick={() => onChange(val)}`  
            `style={{`  
              `minHeight: 40,`  
              `borderRadius: 999,`  
              `border: selected`  
                `? '1px solid rgba(232, 228, 223, 0.9)'`  
                `: '1px solid rgba(232, 228, 223, 0.25)',`  
              `backgroundColor: selected`  
                `? 'rgba(232, 228, 223, 0.16)'`  
                `: 'rgba(10, 10, 14, 0.85)',`  
              `color: '#E8E4DF',`  
              `fontSize: '0.75rem',`  
            `}}`  
          `>`  
            `{text}`  
          `</button>`  
        `);`  
      `})}`  
    `</div>`  
  `</div>`  
`);`

*`/* ───────────────── Summary Seed (Screen 2) ───────────────── */`*

`interface SummarySeedProps {`  
  `seed: TailoringSeed;`  
`}`

`const SummarySeedScreen: React.FC<SummarySeedProps> = ({ seed }) => {`  
  `return (`  
    `<div`  
      `style={{`  
        `flex: 1,`  
        `display: 'flex',`  
        `flexDirection: 'column',`  
        `justifyContent: 'center',`  
        `gap: '1rem',`  
      `}}`  
    `>`  
      `<h2`  
        `style={{`  
          `fontSize: '1.1rem',`  
          `fontWeight: 600,`  
        `}}`  
      `>`  
        `Zapisaliśmy Twój dzisiejszy profil uwagi.`  
      `</h2>`  
      `<p`  
        `style={{`  
          `fontSize: '0.875rem',`  
          `opacity: 0.8,`  
        `}}`  
      `>`  
        `Dashboard, który zobaczysz za chwilę, będzie dopasowany do Twojej`  
        `ilości łyżeczek, tolerancji ruchu i dźwięku oraz tempa.`  
      `</p>`  
      `<dl`  
        `style={{`  
          `fontSize: '0.8125rem',`  
          `opacity: 0.9,`  
          `display: 'grid',`  
          `gridTemplateColumns: 'auto 1fr',`  
          `rowGap: '0.382rem',`  
          `columnGap: '0.618rem',`  
        `}}`  
      `>`  
        `<dt>Czas do pierwszego tapnięcia</dt>`  
        `<dd>`  
          `{seed.timeToFirstTapMs != null`  
            `` ? `${Math.round(seed.timeToFirstTapMs)} ms` ``  
            `: '—'}`  
        `</dd>`  
        `<dt>Łyżeczki</dt>`  
        `<dd>{seed.spoons ?? '—'}</dd>`  
        `<dt>Ruch</dt>`  
        `<dd>{seed.motion ?? '—'}</dd>`  
        `<dt>Dźwięk / Haptics</dt>`  
        `<dd>{seed.sound ?? '—'}</dd>`  
        `<dt>Tempo</dt>`  
        `<dd>{seed.tempo ?? '—'}</dd>`  
      `</dl>`  
    `</div>`  
  `);`  
`};`

Ten komponent:

* używa **golden rectangle** (`aspectRatio: 1 / φ`) oraz golden‑ratio spacingu i gridu,\[[gist.github](https://gist.github.com/damons/8bf0cf08c69b12a7e967c0cc5194c497)\]  
* zbiera cold‑start JITAI seed (`timeToFirstTapMs`, `spoons`, `motion`, `sound`, `tempo`) i wypluwa go przez `onSeedReady`,  
* jest **mobile‑first** (max‑width 480, pełna wysokość viewportu) i WCAG‑friendly (role=radio, aria‑checked, duże tap‑targety).\[[legacy.reactjs](https://legacy.reactjs.org/docs/accessibility.html)\]

Możesz go włączyć w App Router np. jako `app/onboarding/page.tsx` i przepiąć `onSeedReady` do swojej polityki JITAI / XState machine.

## **Wytyczne naprawy błędów build (Next.js App Router)**

**Główny błąd:** `You cannot have two parallel pages that resolve to the same path` — konflikt `/onboarding` z `app/onboarding/page.tsx` i `app/(auth)/onboarding/page.tsx`. Next.js 14.2 nie pozwala na to w route groups.\[[stackoverflow](https://stackoverflow.com/questions/78045996/why-does-next-js-14-fail-to-resolve-page-route-paths)\]

## **🔴 KROK 1: Natychmiastowa naprawa (5 minut)**

Usuń **jeden** z konfliktujących plików:

text  
`app/`  
`├── onboarding/`  
`│   └── page.tsx          ← usuń TEN plik (ogólny onboarding)`  
`└── (auth)/`  
    `└── onboarding/`  
        `└── [stepId]/     ← zostaw TEN (auth-specific)`  
            `└── page.tsx`

**LUB** zmień strukturę na:

text  
`app/`  
`├── onboarding/                   # /onboarding (public/demo)`  
`│   └── page.tsx`  
`└── (auth)/`  
    `└── onboarding-auth/         # /onboarding-auth (protected)`  
        `└── [stepId]/`  
            `└── page.tsx`

**Dlaczego?** Route groups `(auth)` **nie zmieniają URL** — `app/(auth)/onboarding/page.tsx` nadal resolve'uje do `/onboarding`, co koliduje z `app/onboarding/page.tsx`.\[[stackoverflow](https://stackoverflow.com/questions/78045996/why-does-next-js-14-fail-to-resolve-page-route-paths)\]

## **🟡 KROK 2: Poprawna struktura onboarding (10 minut)**

text  
`app/`  
`├── onboarding/                    # Public / demo onboarding → /onboarding`  
`│   ├── page.tsx                   # Landing / Golden Silence demo`  
`│   └── layout.tsx                 # Shared layout dla demo`  
`├── (protected)/                   # Protected routes (no URL prefix)`  
`│   └── onboarding/`  
`│       ├── page.tsx               # Authenticated onboarding → /onboarding (protected)`  
`│       └── [stepId]/`  
`│           └── page.tsx           # Dynamic step → /onboarding/[stepId]`  
`└── (auth)/                        # Auth routes → /auth/*`  
    `├── sign-in/`  
    `└── sign-up/`

**W `middleware.ts`:** redirect z `/onboarding` do `/auth/sign-in` jeśli nie zalogowany.

## **🟢 KROK 3: Node.js version fix (2 minuty)**

W `package.json`:

json  
`{`  
  `"engines": {`  
    `"node": ">=20.12.0 <=24.x"`  
  `},`  
  `"packageManager": "pnpm@9.15.9"`  
`}`

Usuń `engines.node: "20.x"` lub ustaw na zakres kompatybilny z Vercel (20–24). \[vercel docs\]

## **🔵 KROK 4: Pełny turbo.json \+ pnpm-workspace.yaml (dla monorepo)**

json  
*`// turbo.json`*  
`{`  
  `"pipeline": {`  
    `"build": {`  
      `"dependsOn": ["^build"],`  
      `"outputs": [".next/**", "!.next/cache/**"]`  
    `},`  
    `"lint": {},`  
    `"dev": {`  
      `"cache": false`  
    `}`  
  `}`  
`}`  
text  
`# pnpm-workspace.yaml`  
`packages:`  
  `- 'apps/*'`  
  `- 'packages/*'`

## **🔴 KROK 5: Test lokalnie przed push**

bash  
`pnpm i`  
`pnpm turbo build`  
`pnpm turbo lint`

**Spodziewany wynik:** zero błędów webpack, build \< 2min.

## **📁 Ostateczna struktura (zalecana)**

text  
`app/`  
`├── (marketing)/      # / (landing, golden-silence)`  
`│   ├── page.tsx`  
`│   └── golden-silence/`  
`│       └── page.tsx  # /golden-silence`  
`├── (protected)/      # /onboarding (protected)`  
`│   └── onboarding/`  
`│       └── [stepId]/`  
`│           └── page.tsx`  
`├── (auth)/           # /auth/*`  
`│   ├── sign-in/`  
`│   └── sign-up/`  
`└── api/`

**Po tych zmianach:** `pnpm push` → zielony build. To standardowy pattern App Router 14.2+ dla auth/onboarding flow.\[[nextjs](https://nextjs.org/docs/app/getting-started/project-structure)\]

