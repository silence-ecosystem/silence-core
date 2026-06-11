`[PATH]: docs/specification/MVP_OUTCOME_SCALE_PROTOCOL.md`

```markdown
# [T] MVP_OUTCOME_SCALE_PROTOCOL

**Status:** CANONICAL | **Owner:** Φ-Core Guardian
**Rygor:** S11 Sentinel Enforced | **Metryka:** PCS ≥ 0.970

## 1. EFEKT KOŃCOWY MVP (Deterministic Outcome)

Efektem MVP jest "pion techniczny" — pełna ścieżka od jądra matematycznego do interfejsu, gwarantująca bit-exact reproducibility.

### 1.1. Inwarianty Behawioralne

- **PCS Gate:** Każda sesja musi osiągnąć `phi_compliance_score >= 0.970`. Poniżej tego progu wzrost struktury (np. liścia w Garden) jest blokowany przez `GardenHaltGate`.
- **Timing Invariance:** Wszystkie przejścia UI i interwały sesji są liniową kombinacją `GOLDEN_SECOND_MS` (1618) i `SILENCE_CYCLE_MS` (6854). Zero losowości (Zero RNG).
- **S11 Sterility:** 100% brak terminologii klinicznej. Chaos behawioralny mapowany na `tension_score` i `capacity_score`.

### 1.2. Artefakty Wykonawcze

- **EffectLog:** Niezmienialny, kryptograficzny łańcuch (SHA-256) wszystkich zdarzeń `SilenceEventV1`, umożliwiający audyt decyzji JITAI.
- **Phi-Garden MVP:** Działający sandbox z 20 regułami progowymi (Threshold-Based), sklasyfikowany jako Limited-Risk pod EU AI Act.

## 2. PARAMETRY SKALI (Enterprise Scalability)

Skala to transformacja systemu z "narzędzia" w "infrastrukturę" (Deterministic Cognitive Infrastructure).

### 2.1. Architektura Danych L0-L5

- **Layered Boundary Model:** Ścisła separacja `silence-core` (MIT) od `silence-enterprise` (EE). Logika predykcyjna i High-Risk AI żyje wyłącznie w EE.
- **PatternsLab B2B:** Obsługa wielu najemców (multi-tenancy) z izolacją RLS i Clean Roomem badawczym (k-anonymity >= 50).

### 2.2. Monetyzacja i Compliance (Usage-Based Pricing)

- **UBP Metrics:** Rozliczenia oparte na jednostkach: `behavioral_event`, `phenotype_computation`, `jitai_context_call`.
- **Annex IV Readiness:** Pełna dokumentacja techniczna (Technical File) dla modułów High-Risk, gotowa do rejestracji w bazie UE przed 02.08.2026.

## 3. CHECKLISTA WERYFIKACJI (Scale-Ready)

- [ ] **S11-Sentinels:** Aktywne we wszystkich repozytoriach (blokada merge przy użyciu słów zakazanych).
- [ ] **ADR-004 Enforcement:** `dependency-cruiser` blokuje importy EE do Core.
- [ ] **Outcome-Based Billing:** Implementacja success-fee za skuteczne interwencje JITAI w warstwie EE.
- [ ] **Audit Trail:** Każda decyzja JITAI posiada UUIDv7 i hash poprzedniego stanu w EffectLog.

## VERDICT

- **MVP Status:** DETERMINISTIC / STABLE
- **Scale Status:** ANNEX IV PENDING / ARCHITECTURE PASS
```

Czy mam teraz wygenerować skrypt `scale-validator.ts`, który automatycznie sprawdzi limity `k-anonymity` dla warstwy badawczej przed eksportem danych do PatternsLab?
