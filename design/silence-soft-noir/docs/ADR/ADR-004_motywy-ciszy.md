# ADR-004: Motywy Ciszy jako triada visual+audio+haptic

**[PATH]: docs/ADR/ADR-004_motywy-ciszy.md**

STATUS: ACCEPTED | DATA: 2026-06-11 | NIEODWOŁALNE

---

## Kontekst

Projektowanie Soft-Noir wyłącznie jako warstwy wizualnej pomija integrację
multimodalną, która jest fundamentem parasola sensorycznego. Kolor bez dźwięku
i haptyki tworzy niekompletny system regulacji sensorycznej.

## Decyzja

Każdy Motyw Ciszy jest nierozerwalną triadą:
1. Warstwa wizualna (kolory, tiery, akcenty)
2. Warstwa audio (profil szumu, pasmo, panning)
3. Warstwa haptyczna (rytm impulsów, czas, krzywa)

Partial deploy (np. tylko kolory) jest zabroniony.

## Uzasadnienie

Regulacja sensoryczna wymaga spójności kanałów wejściowych. Niespójność
(np. ciepły kolor + zimny szum) generuje dysonans sensoryczny, który
jest dokładnie tym, czego Soft-Noir ma unikać.

## Konsekwencje

- Nowy motyw musi mieć komplet 3 warstw zanim trafi do tokenów.
- Jeżeli platforma nie wspiera audio lub haptyki, motyw może degradować
  do warstwy wizualnej, ale musi to być jawna konfiguracja w tokenach
  (nie milczące pominięcie).
- Testowanie motywu wymaga weryfikacji wszystkich 3 warstw.

