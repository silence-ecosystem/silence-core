# ADR-005: Trójstanowy model Flow/Focus/Calm i reguła przejść

**[PATH]: docs/ADR/ADR-005_stany-flow-focus-calm.md**

STATUS: ACCEPTED | DATA: 2026-06-11 | NIEODWOŁALNE

---

## Kontekst

Gwałtowne przejście ze stanu Calm (wyciszenie) bezpośrednio do Flow (pobudzenie)
powoduje skokowy wzrost intensywności bodźców, co jest sprzeczne z zasadą
parasola sensorycznego.

## Decyzja

Przejście Calm → Flow bezpośrednie jest ZABRONIONE.
Wymagana sekwencja: Calm → Focus → Flow.
Wszystkie przejścia muszą być mapowane na cykl oddechowy z φ-timingami.

Focus jest stanem referencyjnym. Wszystkie komponenty muszą domyślnie
działać poprawnie w Focus.

## Uzasadnienie

Focus jako punkt pośredni zapewnia "bufor sensoryczny" — użytkownik
przechodzi przez neutralny stan przed wejściem w wyższe pobudzenie.
Eliminuje to skokowe zmiany intensywności > 1 tier.

## Konsekwencje

- UI State Machine musi egzekwować tę kolejność na poziomie kodu.
- Automatyczne przejścia (JITAI) muszą respektować tę regułę.
- Czas przejścia Calm→Focus min. = dur.breathe (2618 ms).
- Czas przejścia Focus→Flow min. = dur.ease (618 ms).

## Alternatywy odrzucone

- "Bezpośrednie przejście z animacją" — odrzucone: szybkość animacji
  nie zastępuje etapu neutralizacji.
- "Opcjonalny Focus" — odrzucone: Focus jest obowiązkowym punktem pośrednim.

