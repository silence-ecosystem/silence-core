[PATH]: 01_governance/SILENCE_SYSTEM_DCI_BRIEF_v3_0.md

---

title: SILENCE_SYSTEM_DCI_BRIEF_v3_0
status: ACTIVE
version: 3.0
classification: CANONICAL
owner: PHI_CORE_GUARDIAN
rigor: S11_SENTINEL_ENFORCED
pcs_threshold: ">= 0.990"
failure_mode: WORLD_HALT
updated: 2026-06-11

---

# [T] SILENCE SYSTEM — DCI Brief v3.0

## 1. Cel dokumentu [T]

Niniejszy dokument ustanawia zaktualizowany brief dla SILENCE SYSTEM jako Deterministic Cognitive Infrastructure, zastępując pozycjonowanie oparte na miękkich metaforach i przesuwając całość architektury w stronę systemu operującego kontraktami, timingiem Φ oraz jawnie separowaną warstwą open-core i enterprise.[1][2]

Tagline systemu brzmi: **The Signal in Every Silence**.[3] Brief ma charakter wykonawczy: opisuje tożsamość produktu, zakres MVP, rygory semantyczne, granice IP i warunki zamknięcia pionu technicznego od jądra matematycznego do UI.[1][4]

## 2. Pozycjonowanie systemu [T]

SILENCE SYSTEM jest deterministyczną infrastrukturą poznawczą, a nie aplikacją wsparcia, companionem ani narzędziem o framingu care-first.[1][3] System należy opisywać jako instrument strukturalny do pracy na sygnale, rytmie, kontraktach zdarzeń, wzroście i raportowaniu audit trail, bez narracji terapeutycznej i bez języka sugerującego opiekę.[1][5]

Dozwolone pozycjonowanie: platforma systemowa, infrastruktura, engine, command center, signal layer, deterministic interface.[1][3] Niedozwolone pozycjonowanie: biblia, ogród jako marka nadrzędna, companion, healing app, wellness app, self-help app.[3][5]

## 3. Tożsamość i definicja produktu [T]

SILENCE SYSTEM dostarcza pion techniczny obejmujący: matematyczny rdzeń Φ, kontrakty zdarzeń, deterministyczny engine reguł progowych, cienką warstwę aplikacyjną oraz append-only EffectLog.[1][6] W MVP produkt nie obiecuje poprawy samopoczucia ani zmiany użytkownika; obiecuje jedynie czytelność struktury sygnału, przejrzystość przebiegu sesji i stabilność architektury wynikającą z jawnych reguł.[1][5]

Podstawowa obietnica brzmi: system redukuje szum interpretacyjny przez jawne kontrakty, znormalizowane timingi i kontrolowany przepływ decyzji.[1][6] Wartość użytkowa wynika z widoczności wzorca, nie z narracji o pomocy.[3][2]

## 4. Rygor S11 [T]

W całym systemie obowiązuje Vocabulary Lock-In: terminologia kliniczna, normatywna i care-framed jest zabroniona w kodzie, copy UI, payloadach i dokumentacji operacyjnej.[1] Każde odniesienie do stresu musi być mapowane na `tension_score`, każde odniesienie do pomocy na `phi_tagged_intervention`, a stany systemowe mają być opisywane jako `state_violation` i `signal_noise`.[1]

Minimalna mapa S11 dla briefu:

| Termin zakazany      | Termin kanoniczny             |
| -------------------- | ----------------------------- |
| stres                | `tension_score` [1]           |
| lęk / anxiety        | `tension_score` [1]           |
| chaos                | `signal_noise` [1]            |
| pomoc / wsparcie     | `phi_tagged_intervention` [1] |
| stan naruszenia      | `state_violation` [1]         |
| gotowość użytkownika | `timing_window` [1]           |

Każdy nowy dokument, ekran i prompt musi przejść przez `pnpm s11-check` przed buildem.[1]

## 5. Fundament Φ [T]

Wszystkie parametry czasowe i strukturalne w briefie, roadmapie i UI muszą wynikać z liczby $$\phi \approx 1.618033988749895$$ oraz z jej stałych pochodnych, zwłaszcza `GOLDEN_SECOND_MS = 1618` i `SILENCE_CYCLE_MS = 6854`.[1][6] Używanie arbitralnych timeoutów, magicznych liczb i lokalnych easingów jest zabronione, chyba że istnieje jawny ADR dokumentujący odchylenie.[1][6]

Podstawowe atomy czasu i proporcji dla MVP:

| Parametr                   | Wartość operacyjna | Źródło |
| -------------------------- | -----------------: | ------ |
| $$\phi$$                   |  1.618033988749895 | [1][6] |
| `GOLDEN_SECOND_MS`         |               1618 | [1][6] |
| `GOLDEN_SECOND_SQUARED_MS` |               2618 | [1]    |
| `GOLDEN_SECOND_CUBED_MS`   |               4236 | [1][6] |
| `SILENCE_CYCLE_MS`         |               6854 | [1][6] |
| `PCS_THRESHOLD`            |              0.970 | [1]    |

Każde twierdzenie w dokumentach nadrzędnych musi posiadać znacznik rygoru: [T], [E], [H] lub [M].[6]

## 6. Granica IP ADR-004 [T]

Open-core `silence-core` pozostaje warstwą MIT, zawierającą wyłącznie kontrakty, deterministyczne reducery, event taxonomy, hash-chain utilities i czyste funkcje matematyczne.[1] `silence-enterprise` pozostaje warstwą proprietary, w której żyją predictive models, logika JITAI wysokiego ryzyka, billing outcome logic i EE-only context fusion.[1]

Kierunek zależności jest nienaruszalny: `03_ee` może importować z `04_packages`, ale `04_packages` i `05_apps` nie mogą importować z `03_ee`.[1] Jeśli rdzeń potrzebuje zdolności EE, jedynym wzorcem jest dependency injection przez kontrakt publiczny zdefiniowany w `@silence/contracts`.[1]

## 7. Zakres MVP [T]

MVP ma dostarczyć pełny pion techniczny: jądro Φ, growth engine, threshold-based intervention engine, funkcję integracyjną `step()`, minimalny interfejs `/garden` oraz lokalną telemetrię i audit trail.[1] Wersja MVP nie obejmuje predykcji, uczenia modeli, clean room research i logiki billingowej enterprise.[1][4]

Warunki zamknięcia MVP są następujące: pełny flow UI, wspólne stałe timingowe, growth gate w engine oraz append-only EffectLog.[1] Każda sesja musi osiągać `phi_compliance_score >= 0.970`, a wynik niższy aktywuje `GardenHaltGate` lub równoważną blokadę wzrostu.[1]

## 8. Model doświadczenia produktu [T]

Interfejs ma być projektowany jak narzędzie laboratoryjne lub panel systemowy, a nie jak aplikacja wellbeing.[3] Referencyjna estetyka to Linear, Notion, Cursor, VS Code i GitHub: ciemny interfejs, wysoka czytelność, monospace tam, gdzie wspiera to systemowy charakter, brak dekoracyjnych nagród i brak ciepłych metafor wizualnych.[3]

Język mikrocopy musi być techniczny, jednoznaczny i nieperswazyjny: `Continue`, `Generate`, `Save`, `Export`, `Reset`, `Delete`, bez framingu „tell us more” albo „we are here for you”.[3] Każdy ekran ma komunikować granice systemu równie wyraźnie jak jego możliwości.[5][3]

## 9. Roadmapa MVP [T]

Roadmapa została przepisana do sześciu faz zgodnych z DCI.

| Faza | Zakres główny                           | Definition of Done                                                                             |
| ---- | --------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 1    | Core czasu Φ i growth engine            | `phi.ts`, stałe, Fibonacci, growth logic bez `Date.now()`, coverage testów $$\ge 95\%$$ [1][6] |
| 2    | Deterministyczny engine reguł progowych | 20 reguł threshold-based, zero AI w warstwie MVP, zgodność z Limited-Risk workflow [1]         |
| 3    | Engine integracyjny                     | `step()` łączący czas, reguły i wzrost, deserializacja `PhiGardenState` [1]                    |
| 4    | Minimalny produkt UI                    | `/garden`, pasywny wzrost, 3–5 mikro-rytuałów, lokalna telemetria [1]                          |
| 5    | Retencja i jakość sygnału               | `phi-score` per sesja, sezony 28-dniowe, asymetryczny social bez rywalizacji [1]               |
| 6    | Token i warstwa danych                  | opcjonalny `$PHI` jako bramka dla zaawansowanych raportów `AttentionProfile` [7][1]            |

## 10. Architektura wykonawcza [T]

Warstwa `04_packages/@silence` może zawierać tylko pakiety dozwolone przez sekcję 10 SILENCE_STRUCT: contracts, core, tokens, telemetry, sdk i deterministic engine.[1] Warstwa `05_apps` pozostaje cienka i nie zawiera logiki wysokiego ryzyka; aplikacja `garden` jest pierwszą aplikacją produkcyjną w tym modelu.[1]

Przed każdym buildem wymagane są: `pnpm boundary-check`, `pnpm test:determinism`, `pnpm s11-check`, `pnpm typecheck`, verifier hash-chain i kontrola timingów.[1] Wynik niższy niż pełne PASS oznacza `WORLD_HALT`.[1]

## 11. Metryki i bramki [T]

Metryką nadrzędną dla spójności repo jest PCS, a dla sesji użytkownika `phi_compliance_score`.[1] Dodatkowe metryki MVP obejmują: kompletność anchor files, zero boundary violations, zero RNG w rdzeniu, pełne przejście testów determinizmu oraz czystość S11 w warstwie publicznej.[1]

W buildach produkcyjnych minimalny standard to: 8/8 PASS, brak importów `04_packages <- 03_ee`, brak zerwanego hash-chain, brak magicznych liczb i brak zakazanej terminologii w warstwie publicznej.[1]

## 12. Effect Log [T]

Każda decyzja zmieniająca brief, roadmapę lub architekturę MVP musi być rejestrowana w append-only EffectLog jako zdarzenie z `seq`, `timestamp`, `event_type`, `payload`, `prev_hash` i `hash`.[1] Bez wpisu do hash-chain decyzja jest traktowana jako nieistniejąca w systemie wykonawczym.[1]

## 13. Checklista PASS/FAIL [T]

- [x] Jawna ścieżka `[PATH]` obecna.[1]
- [x] Dokument kompletny, bez placeholderów.[1]
- [x] Rygor S11 wpisany operacyjnie.[1]
- [x] Derywacja Φ opisana wprost.[1][6]
- [x] Granica IP ADR-004 opisana fizycznie i logicznie.[1]
- [x] MVP opisane jako pion techniczny, nie narracja marketingowa.[1]
- [x] Roadmapa oparta na sześciu fazach wykonawczych.[1]
- [x] UI zmapowane do estetyki narzędziowej.[3]
- [x] Bramka PCS i WORLD_HALT ujęte jawnie.[1]
- [x] EffectLog ujęty jako wymaganie systemowe.[1]
- [x] Zgodność z open-core / EE zachowana.[1]
- [x] Domknięcie semantyczne bez luk interpretacyjnych.[1]
