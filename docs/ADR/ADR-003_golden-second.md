# ADR-003: Golden Second jako kardynalny token temporalny

**[PATH]: docs/ADR/ADR-003_golden-second.md**

STATUS: ACCEPTED | DATA: 2026-06-11 | NIEODWOŁALNE

---

## Kontekst

Animacje o arbitralnych czasach trwania powodują brak synchronizacji rytmu
interfejsu z naturalnymi rytmami uwagi użytkownika. Magic numbers (500 ms, 750 ms)
są niespójne i nieaudytowalne.

## Decyzja

Golden Second = 1618 ms jest jedyną bazą temporalną systemu SILENCE.
Wszystkie timingi muszą być wielokrotnościami lub ułamkami 1618 ms,
wyprowadzonymi przy użyciu potęg φ.

Kanon:
- instant: 0 ms
- micro: ~200 ms (GS × φ⁻⁴ ≈ 145 ms, zaokrąglone)
- quick: ~400 ms (GS × φ⁻³ ≈ 236 ms, zaokrąglone)
- ease: ~618 ms (GS × φ⁻¹)
- golden: 1618 ms
- breathe: 2618 ms (GS × φ)
- ceremony: 4236 ms (GS × φ²)

## Uzasadnienie

1618 = Fibonacci(16) × 2 ≈ φ × 1000. Wartość ta jest naturalnym pomostem
między milisekundową skalą animacji a biologicznym rytmem uwagi (~1.6 s
to typowy cykl skupienia dla zadań krótkich).

## Konsekwencje

- Każda animacja w kodzie musi referencjonować token dur.*, nie literał.
- Wartości takie jak 500 ms, 300 ms, 1000 ms są odrzucane jeśli
  nie należą do powyższej skali.
- Skrócenia dla UX (np. "za wolno") muszą przejść procedurę zmiany tokena,
  nie lokalną edycję.

