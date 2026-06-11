[PATH]: 01_governance/REUSE-AND-GAP-ANALYSIS.md

---
title: REUSE and Gap Analysis — SILENCE.OBJECTS MVP Baseline
status: PRODUCTION
created: 2026-06-10
updated: 2026-06-10
author: silence-architect
classification: SSoT
sentinel: S11_ENFORCED
pcs: 0.997

---

# REUSE AND GAP ANALYSIS

## 1. EXECUTIVE SUMMARY

Niniejszy dokument stanowi SSoT dla decyzji reuse vs rewrite w kontekście reduced-scope MVP SILENCE.OBJECTS. Analiza obejmuje skan wszystkich historycznych źródeł w workspace pod kątem komponentów wymienionych w FIVE-PILLARS-DELIVERY-PLAN. Każdy komponent został sklasyfikowany według 5-kategorii reuse i oceniony pod kątem zgodności z RULE-DOM-001.

Źródła przeskanowane:
- `/home/ewa/silence/` — aktualne repo (root + 07_archive/legacy_monorepo)
- `/home/ewa/Pulpit/archive/REPOZYTORIA/` — archiwalne kopie repo (CORE-main, MONOREPO, silence-monorepo, patternlens-main, PRODUCTS-main, Silence-Experience-main, PLATFORM-main, RESEARCH-main, silence-core-open-main)
- `/home/ewa/Pulpit/archive/silence-monorepo/` — mirror archiwum REPOZYTORIA
- `/home/ewa/Pobrane/patternlens stare repo/` — legacy external-import z duplikatami ee/@silence
- `/home/ewa/Pulpit/archive/zip/` — spakowane migawki

## 2. METODOLOGIA KLASYFIKACJI

| Klasa | Definicja | Warunek przypisania |
|-------|-----------|---------------------|
| SAFE_REUSE_OPEN | Można przenieść bezpośrednio do 04_packages/@silence lub 01_governance | Brak zależności od EE; licencja MIT-compatible; brak PII |
| SAFE_REUSE_EE | Można przenieść do 03_ee/@silence | Proprietary logic; nie zależy od archiwum; kompletny kod |
| DOC_ONLY_REFERENCE | Wyłącznie jako źródło wiedzy / template | Brak gotowego kodu wykonywalnego; wymaga implementacji |
| BLOCKED_BY_IP_BOUNDARY | Istnieje, ale narusza RULE-DOM-001 lub jest zablokowane licencją | Importuje EE do Open-Core; lub własność zewnętrzna |
| NEEDS_REWRITE | Istnieje, ale wymaga przepisania >50% kodu | Niekompletne; outdated API; niezgodne z S11; lub śmieciowe |

## 3. KOMPONENTY WG FILARÓW

### 3.1 FILAR I — Billing EE / Metering 402

| Komponent | Lokalizacja źródłowa | Klasa reuse | Uzasadnienie | Zgodność RULE-DOM-001 |
|-----------|----------------------|-------------|--------------|----------------------|
| `app/api/payments/create-checkout` | Silence-Experience-main/app/api/payments/ | SAFE_REUSE_EE | Stripe checkout route; izolowany endpoint; brak zależności od archiwum | ✅ Brak importów cross-domain |
| `app/api/payments/verify-receipt` | Silence-Experience-main/app/api/payments/ | SAFE_REUSE_EE | IAP verify-receipt; logika Apple/Google; można wydzielić do 03_ee/@silence/billing | ✅ Brak importów cross-domain |
| Rich 402 response shape | BRAK | GAP | Nie znaleziono w żadnym archiwum | N/D |
| Metering pipeline (402 + usage) | BRAK | GAP | Nie znaleziono w żadnym archiwum | N/D |
| `@silence/reporting` | BRAK w archiwach | GAP | Gap Analysis 2030 wskazuje brak; nie znaleziono w żadnej kopii monorepo | N/D |

**Werdykt Filar I:** 2/4 komponenty możliwe do reuse (Stripe + IAP). Metering pipeline i rich 402 response wymagają implementacji od podstaw.

### 3.2 FILAR II — ADR-004 / RULE-DOM-001 Boundary

| Komponent | Lokalizacja źródłowa | Klasa reuse | Uzasadnienie | Zgodność RULE-DOM-001 |
|-----------|----------------------|-------------|--------------|----------------------|
| `RULE-DOM-001_P0_FULL_FILE.md` | silence/01_governance/ (naprawiony) | SAFE_REUSE_OPEN | Już zremedioiwany; pełna zgodność z kanonem | ✅ PASS |
| `.dependency-cruiser.js` | silence/root (naprawiony) | SAFE_REUSE_OPEN | 3 reguły; działa w CLI | ✅ PASS |
| `s11-check.js` | 07_archive/legacy_monorepo/silence-monorepo/scripts/ | SAFE_REUSE_OPEN | Kompletny skaner terminów S11; Node.js; niezależny od EE | ✅ Przenieść do 02_protocols/ lub tooling/ |
| `s11-fixer.cjs` | REPOZYTORIA/silence-monorepo/scripts/ | SAFE_REUSE_OPEN | Autofix na podstawie raportu; niezależny | ✅ Przenieść do 02_protocols/ lub tooling/ |
| `s11-terms.ts` | REPOZYTORIA/patternlens-main/config/ | SAFE_REUSE_OPEN | Forbidden terms + alternatives jako TypeScript const | ✅ Przenieść do 04_packages/@silence/types/ |
| `s11-policy.yaml` | REPOZYTORIA/silence-monorepo/packages/@silence/s11-guardrail-lint/ | DOC_ONLY_REFERENCE | YAML z konfiguracją; wymaga adaptera do skanera | ⚠️ Wymaga wrappera |
| `sentinel-pr-check.yml` | REPOZYTORIA/silence-monorepo/.github/workflows/ | DOC_ONLY_REFERENCE | Template workflow; wymaga adaptacji do obecnej struktury | ⚠️ Wymaga przepisania ścieżek |
| `@silence/s11-lint` (pakiet npm) | 04_packages/@silence/s11-lint/ | DONE | Pelny pakiet v2.1.0 z CLI, 5 klasami forbidden, allowed alternatives, reporterem tekstowym/JSON | ✅ PASS w CI |
| `packages/@silence/s11-guardrail-lint` | silence-monorepo/packages/@silence/ | NEEDS_REWRITE | Zawiera tylko s11-policy.yaml; brak entrypointu JS/TS; niekompletne | ❌ Stub |

**Werdykt Filar II:** 5/9 komponentów gotowych do reuse (s11-check.js, s11-fixer.cjs, s11-terms.ts, remediated RULE-DOM-001, @silence/s11-lint). s11-lint wdrozony jako pelny pakiet workspace. GitHub workflows wymagają adaptacji ścieżek.

### 3.3 FILAR III — Annex IV ITE (intervention-timing)

| Komponent | Lokalizacja źródłowa | Klasa reuse | Uzasadnienie | Zgodność RULE-DOM-001 |
|-----------|----------------------|-------------|--------------|----------------------|
| `technical-file_silence-safety_template_v1.md` | DOKUMENTY/compliance (2)/ | DOC_ONLY_REFERENCE | Pełny template 10-sekcyjny; wymaga adaptacji z `@silence/safety` na `intervention-timing` | ✅ Tylko dokumentacja |
| `eu-ai-act-mobile.md` | DOKUMENTY/compliance/ | DOC_ONLY_REFERENCE | Wskazówki mobilne; niekompletne | ✅ Tylko dokumentacja |
| `eu-ai-act-summary.md` | CORE-main/kb/03-resources/frameworks/ | NEEDS_REWRITE | Plik pusty (0 bajtów) | ❌ Brak treści |
| `phi-compliance.ts` | MONOREPO/packages/@silence/ | NEEDS_REWRITE | Plik-śmieć (wyrzucony poza katalog); brak treści merytorycznej | ❌ Śmieć |
| `compliance-check.yml` | CORE-main/.github/workflows/ | DOC_ONLY_REFERENCE | Template workflow; wymaga adaptacji | ⚠️ Wymaga przepisania |
| COMP-01 master timeline | BRAK | GAP | Nie istnieje jako osobny dokument | N/D |

**Werdykt Filar III:** 1/6 komponentów użytecznych jako template (technical-file). Reszta to gap lub śmieci. COMP-01 musi zostać utworzony od podstaw.

### 3.4 FILAR IV — Metering 402

| Komponent | Lokalizacja źródłowa | Klasa reuse | Uzasadnienie | Zgodność RULE-DOM-001 |
|-----------|----------------------|-------------|--------------|----------------------|
| Rich 402 response | BRAK | GAP | Brak w całym workspace | N/D |
| Usage tracker / quota counter | BRAK | GAP | Brak w całym workspace | N/D |
| `packages/@silence/phi-metrics` | silence-core-open-main/packages/ | NEEDS_REWRITE | Szkielet: tylko package.json + tsconfig.json; brak implementacji | ❌ Stub |
| `@silence/reporting` | BRAK w archiwach | GAP | Nie znaleziono w żadnej kopii | N/D |

**Werdykt Filar IV:** 0/4 komponentów gotowych. Cały filar wymaga implementacji od podstaw.

### 3.5 FILAR V — Trust Scorecard / Command Center

| Komponent | Lokalizacja źródłowa | Klasa reuse | Uzasadnienie | Zgodność RULE-DOM-001 |
|-----------|----------------------|-------------|--------------|----------------------|
| `ADR-256-command-center.md` | CORE-main/docs/ | NEEDS_REWRITE | 4-linijkowy stub; brak struktury scorecard | ❌ Niekompletne |
| `Command-Center-Macierz*.xlsx` | DOKUMENTY/ | DOC_ONLY_REFERENCE | Pliki Excel z metrykami; wymaga ekstrakcji i kodowania | ✅ Tylko dane |
| `SILENCE-OBJECTS-Command-Center.xlsx` | DOKUMENTY/ | DOC_ONLY_REFERENCE | Szerszy zakres metryk | ✅ Tylko dane |
| `apps/portal/src/app/api/kpi/route.ts` | legacy_monorepo/apps/portal/ | SAFE_REUSE_EE | Endpoint KPI; można zaadaptować do Trust Scorecard API | ✅ Po wydzieleniu do 03_ee |

**Werdykt Filar V:** 0/4 komponentów gotowych do bezpośredniego reuse. Excel-e jako źródło danych; endpoint KPI jako punkt wyjścia do rewrite.

### 3.6 INNE KRYTYCZNE KOMPONENTY

| Komponent | Lokalizacja źródłowa | Klasa reuse | Uzasadnienie |
|-----------|----------------------|-------------|--------------|
| EffectLog (hash-chain) | silence/00_identity/EffectLog.ts | SAFE_REUSE_OPEN | Kompletna implementacja z testami; przenieść do 04_packages/@silence/core/ lub osobnego pkg | ✅ |
| MATH_CORE (φ-constants) | silence/00_identity/MATH_CORE.ts | SAFE_REUSE_OPEN | GOLDENSECOND, PHI, timings; SSoT matematyczny | ✅ |
| PhiZeroGate | silence/00_identity/PhiZeroGate.tsx | SAFE_REUSE_OPEN | Komponent UI z EffectLog integration | ✅ |
| `packages/ux-architecture` | silence/packages/ux-architecture/ | SAFE_REUSE_OPEN | LeadPhiSystemUxArchitect role + SoftNoirSurface contracts | ✅ |
| Deterministic engine Rust+WASM | BRAK w aktywnym repo | GAP | silence-phi-telemetry (Rust) istnieje w archiwum, ale to osobne repo telemetryczne, nie behavioral engine | N/D |
| Reproducible Docker builds | BRAK | GAP | Brak Dockerfile w aktualnym repo; w archiwach fragmentaryczne configi | N/D |
| Cryptographic signing (WASM integrity) | BRAK | GAP | Brak w całym workspace | N/D |
| Fallback equivalence testing | 07_archive/legacy_monorepo/scripts/equivalence-test/run.ts | DOC_ONLY_REFERENCE | Runner Rust↔TS↔Python; wymaga adaptacji do WASM+CPU | ⚠️ |

## 4. MAPA DECYZYJNA REUSE

```
SAFE_REUSE_OPEN (6 komponentów)
├── s11-check.js  →  02_protocols/s11-check.js  lub  tooling/s11-check/index.js
├── s11-fixer.cjs  →  02_protocols/s11-fixer.cjs
├── s11-terms.ts  →  04_packages/@silence/types/s11.ts
├── EffectLog.ts  →  04_packages/@silence/core/effect-log.ts
├── MATH_CORE.ts  →  04_packages/@silence/core/math-core.ts
└── ux-architecture contracts  →  04_packages/@silence/types/ux-contracts.ts

SAFE_REUSE_EE (3 komponenty)
├── Stripe checkout  →  03_ee/@silence/billing/api/create-checkout.ts
├── IAP verify-receipt  →  03_ee/@silence/billing/api/verify-receipt.ts
└── KPI route (portal)  →  03_ee/@silence/analytics/api/kpi.ts

DOC_ONLY_REFERENCE (5 komponentów)
├── technical-file_silence-safety_template_v1.md  →  template dla COMP-01
├── sentinel-pr-check.yml  →  template workflow CI
├── compliance-check.yml  →  template workflow CI
├── Command-Center Excel-e  →  źródło metryk Trust Scorecard
└── equivalence-test/run.ts  →  template dla CI equivalence

BLOCKED_BY_IP_BOUNDARY (0 komponentów)

NEEDS_REWRITE / GAP (10+ komponentów)
├── s11-lint (pakiet npm) — DONE
├── Rich 402 response shape
├── Metering pipeline
├── COMP-01 master timeline
├── Annex IV dla intervention-timing
├── Trust Scorecard template
├── ADR-256 (rozbudowa z 4 linijek do pełnego dokumentu)
├── phi-compliance.ts (usunąć — śmieć)
├── eu-ai-act-summary.md (pusty — usunąć lub przepisać)
├── Deterministic engine Rust+WASM
├── Reproducible Docker builds
├── Cryptographic signing WASM
└── @silence/phi-metrics (szkielet — doimplementować lub usunąć)
```

## 5. RAPORT LUK (GAP REPORT)

| # | Luka | Krytyczność | Bloker release? | Szacowany nakład | Źródło pokrycia |
|---|------|-------------|-----------------|------------------|-----------------|
| G1 | Pakiet `@silence/s11-lint` v2.1.0 wdrozony; `pnpm s11-check` dziala; 0 violations | P1 | TAK (CI gate) | DONE | s11-guardrail-lint przeksztalcony w pelny pakiet zgodny z S11-01 v2.1 |
| G2 | Metering pipeline + rich 402 response wdrozone w 03_ee/@silence/billing | P0 | TAK (filar I/IV) | DONE | Implementacja od podstaw; in-memory store (MVP), Supabase target (prod) |
| G3 | Brak COMP-01 Annex IV dla intervention-timing | P0 | TAK (filar III) | 3-4 dni | technical-file template jako baza |
| G4 | Brak Trust Scorecard template + ADR-256 rewrite | P1 | NIE (kwartalne) | 3-4 dni | Excel-e + KPI route jako baza |
| G5 | Brak deterministic engine Rust+WASM | P0 | TAK (MVP core) | 10-14 dni | Implementacja od podstaw; reference: phi-telemetry Rust crate |
| G6 | Brak reproducible Docker builds | P1 | TAK (release gate) | 2-3 dni | Implementacja od podstaw |
| G7 | Brak cryptographic signing WASM | P1 | TAK (release gate) | 2-3 dni | Implementacja od podstaw |
| G8 | Brak equivalence-test runner dla WASM+CPU | P1 | TAK (release gate) | 3-4 dni | Template z archiwum jako baza |
| G9 | `@silence/phi-metrics` — szkielet bez kodu | P2 | NIE | 1 dzień | Usunąć lub zaimplementować stub |
| G10 | `phi-compliance.ts` — pliki-śmieci w wielu kopiach | P2 | NIE | 1 dzień | Usunąć ze wszystkich kopii |

## 6. G1 — S11 Lint Baseline

**Status:** DONE (wdrożone `@silence/s11-lint` v2.1.0 i `s11-check`).

**Zakres techniczny:**
- pakiet workspace `04_packages/@silence/s11-lint` (package.json, tsconfig, src/index.ts, src/cli.ts, rules, README)
- SSoT terminologii w `04_packages/@silence/types/s11.ts` (FORBIDDEN_CLASSES, ALLOWED_ALTERNATIVES, ALLOWED_VOCABULARY)
- wrapper CI `02_protocols/s11-check.js` wywołujący CLI `s11-lint`
- opt-in fixer `02_protocols/s11-fixer.cjs` (nie uruchamiany automatycznie w CI)
- rootowy `package.json` z komendą `pnpm s11-check` obejmującą `01_governance`, `02_protocols`, `04_packages`, `05_apps`

**Coverage Metric (monitorowane per release):**
- `G1_FILES_SCANNED` — liczba plików faktycznie przeskanowanych przez `s11-lint`
- `G1_WARNINGS` — liczba naruszeń S11 (powinna być 0 przed merge)
- `G1_COVERAGE_RATIO` — udział plików z kluczowych domen (governance/protocols/packages/apps) objętych G1

G1 jest wdrożone jako merge-blocking gate, ale coverage rośnie wraz z rozbudową kodu. Każdy release musi raportować metryki G1 w EFFECTLOG / snapshotach S11, aby utrzymać PCS > 0.99 i spójność między SSoT a realnym enforcementem.

## 7. REKOMENDACJE KOŃCOWE

1. **DONE — G1 zamkniety:** `@silence/s11-lint` v2.1.0 jest pelnym pakietem workspace z CLI `s11-lint`, 5 klasami forbidden (DIAGNOSTIC, THERAPEUTIC, AFFECTIVE_ASSESSMENT, NORMATIVE_JUDGMENT, MYSTICAL_SPIRITUAL), allowed alternatives i exemptami dla plikow konfiguracyjnych S11. `pnpm s11-check` zwraca PASS (0 violations). Stary `s11-guardrail-lint` zostal skonsumowany jako zrodlo architektoniczne — jego YAML policy i struktura Scannera zostaly zaadaptowane, ale nazwa, API i zakres terminow zostaly calkowicie przebudowane.
2. **DONE — G2 zamkniety:** `@silence/billing` v0.1.0-mvp zawiera rich 402 response (7 pól + debug dev/staging), metering store (in-memory), quota enforcement middleware, checkout stub i receipt verification stub. Filar I/IV ma teraz implementacyjne podstawy.
3. **Week 1-2:** Zamknij COMP-01 Annex IV (G3) jako następny priorytet.
3. **Week 3-4:** Deterministic engine Rust+WASM (G5) jako najdłuższy workstream; rozpocząć natychmiast po zamknięciu G1.
4. **Week 5-6:** Docker builds (G6), cryptographic signing (G7), equivalence testing (G8).
5. **Week 7-8:** Trust Scorecard (G4) — może być równolegle z G5-G8, bo nie blokuje release MVP.
6. **Ciągłe:** Usuń śmieciowe pliki (phi-compliance.ts, puste eu-ai-act-summary.md) z aktualnego repo i zablokuj ich propagację przez dependency-cruiser.
