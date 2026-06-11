# ADR-001: Zakaz czystej bieli i czystej czerni

**[PATH]: docs/ADR/ADR-001_zakaz-ekstremow.md**

STATUS: ACCEPTED | DATA: 2026-06-11 | NIEODWOŁALNE

---

## Kontekst

Użytkownicy neuroatypowi (ADHD-hiper, HSP) doświadczają dyskomfortu sensorycznego
przy wysokich kontrastach. Czysty biały (#FFFFFF) na czarnym (#000000) generuje
efekt "tnących krawędzi" — gwałtowne przejście luminancji może powodować
przestymulowanie układu wzrokowego i wzrost napięcia poznawczego.

## Decyzja

System SILENCE kategorycznie zakazuje #000000 i #FFFFFF we wszystkich warstwach
interfejsu użytkownika bez wyjątku i bez możliwości lokalnego zezwolenia.

## Uzasadnienie matematyczne

Czysta czerń = luminancja 0%. Czysta biel = luminancja 100%.
Soft-Noir operuje w przedziale L₀ ≈ 12% do L₄ ≈ 32% dla tła
i do ~88% off-white dla tekstu głównego.
Różnica między off-white (#E8E4DF) a Tier 0 (~#1F1E1D) daje
kontrast ~14.2:1 — powyżej WCAG AAA bez ekstremalnych wartości.

## Konsekwencje

- Każdy commit z #000000 lub #FFFFFF jest odrzucany automatycznie.
- Fallbacki przeglądarki muszą być jawnie nadpisane tokenami.
- Dotyczy również SVG, ikon, gradientów, masek, stanów błędu.
- Nie istnieje "wyjątek dla narzędzi deweloperskich" w runtime użytkownika.

## Alternatywy odrzucone

- "Tylko dla tekstu" — odrzucone: zakaz jest absolutny.
- "Opcja dostępności" — odrzucone: Soft-Noir jest globalny, nie opcjonalny.
- "Dla print/export" — odrzucone: export ma własne profile, nie wpływa na runtime UI.

