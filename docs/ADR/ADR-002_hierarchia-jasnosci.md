# ADR-002: Dyskretna hierarchia jasności (Luminance Tiers)

**[PATH]: docs/ADR/ADR-002_hierarchia-jasnosci.md**

STATUS: ACCEPTED | DATA: 2026-06-11 | NIEODWOŁALNE

---

## Kontekst

Głębokość interfejsu musi być komunikowana bez agresywnych cieni. Arbitralne
dobieranie jasności elementów prowadzi do niespójności, która zaburza orientację
przestrzenną użytkownika i zwiększa obciążenie poznawcze.

## Decyzja

Soft-Noir wprowadza dyskretną hierarchię 5 tierów luminancji.
Wszystkie powierzchnie strukturalne muszą należeć do dokładnie jednego tieru.
Formuła: Lₙ = L₀ × (√φ)ⁿ, gdzie L₀ = 12.0%, √φ ≈ 1.272.

Wynikowe wartości:
- Tier 0: 12.0%
- Tier 1: 15.3%
- Tier 2: 19.4%
- Tier 3: 24.7%
- Tier 4: 30.0–32.0%

## Uzasadnienie

√φ jako współczynnik kroku minimalizuje kontrast między warstwami
(mniejsze napięcie sensoryczne) przy zachowaniu rozróżnialności głębi.
Dyskretność zapewnia przewidywalność i audytowalność.

## Konsekwencje

- Wartości między-tierowe są błędem krytycznym.
- Hover-state nie może tworzyć wartości między-tierowych; musi przejść
  na sąsiedni tier lub pozostać na bieżącym.
- Gradienty symulujące płynne przejście między tierami są zabronione.

## Alternatywy odrzucone

- "Płynna skala jasności" — odrzucone: brak audytowalności, brak determinizmu.
- "Cienie jako głębia" — odrzucone (ADR-002 powiązane z zasadą głębi bez cieni).

