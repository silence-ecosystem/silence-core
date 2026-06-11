[PATH]: 01_governance/MVP-REDUCED-SCOPE-EXECUTION-PLAN.md

---
title: MVP Reduced-Scope Execution Plan
status: PRODUCTION
created: 2026-06-10
updated: 2026-06-10T12:45:00+02:00
author: silence-architect
classification: SSoT
sentinel: S11_ENFORCED
pcs: 0.997

---

# MVP REDUCED-SCOPE EXECUTION PLAN

## 1. EXECUTIVE DECISION

SILENCE.OBJECTS przechodzi z full-scope vision na reduced-scope MVP zgodnie z rekomendacjami audytu architektonicznego. Zakres produkcyjny zostaje ograniczony o 60-70%, z zachowaniem pieciu filarow krytycznych dla ARR/NRR. Celem MVP jest udowodnienie determinizmu, reproducibility i podstawowej zgodnosci regulacyjnej, nie realizacja pelnej wizji 2030.

Decyzja jest nieodwracalna do czasu zamkniecia MVP i osiagniecia pierwszego pozytywnego Trust Scorecard. Rozszerzenie zakresu wymaga nowego cyklu audytu i osobnej decyzji governance.

## 2. CURRENT BASELINE CONSTRAINTS

| Constraint | Impact | Mitigation |
|---|---|---|
| Brak aktywnych package entrypointow w 04_packages/@silence | depcruise pokazuje 0 modules / 0 dependencies | Wypelnienie stubow przed Week 3 |
| G1 coverage rośnie z kodem | Liczba realnie skanowanych plików zależy od zawartości 04_packages i 05_apps | Monitorować G1_FILES_SCANNED per release; traktować jako living control |
| G5 Engine Rust+WASM wymaga WASM+CPU equivalence | Native equivalence 10/10 PASS; WASM/CPU integration pending | Integracja FFI i JS runner w Week 9–10 |
| G6-G8 (reproducible builds, signing, equivalence) | Dockerfile + CI workflow stworzone; klucze produkcyjne pending | Prod key management w Week 11–12 |
| Brak COMP-01 Annex IV dla intervention-timing | Filar III niekompletny; high-risk bez technical file | Adaptacja technical-file template w Week 1-2 |
| Brak deterministic engine Rust+WASM | Core value proposition niezweryfikowany | Rozpoczecie implementacji w Week 3 jako najdluzszy workstream |
| Brak reproducible Docker builds | Release gate nieegzekwowalny | Implementacja w Week 5-6 |
| Brak cryptographic signing WASM | Binary integrity niezweryfikowana | Implementacja w Week 5-6 |
| Brak Trust Scorecard template | Filar V niekompletny | Rozpoczecie w Week 7-8; nie blokuje MVP |
| 05_services/ i packages/ w root bez jasnej roli | Potencjalny drift strukturalny | Wpis do RULE-DOM-001 jako kanoniczne elementy repo |
| Archiwa zawieraja 3+ kopie monorepo z rozbieznosciami | Ryzyko uzycia niekanonicznej wersji | Ustanowienie CORE-main jako read-only reference; aktywne repo to ~/silence/ |

## 3. MVP IN SCOPE

### 3.1 Core Engine
- Deterministic behavioral engine w Rust (`@silence/engine` v0.1.0-mvp), kompilowany do WASM
- CPU-only execution path (batch inference, single-threaded)
- Fixed seed propagation: `SHA-256(input) → seed (u64) → SHA-256(seed + slots) → output_hash`
- Fixed-point arithmetic: `PHI_INV_NUM / PHI_INV_DEN` — no floating-point nondeterminism
- Equivalence testing: Rust native 10/10 PASS (determinism, collision, depth variants); WASM/CPU pending
- No GPU, no SIMD extensions, no multi-region

### 3.2 EffectLog
- Append-only registry decyzji governance
- Hash-chain: prev_hash + entry_hash (SHA-256)
- CI validation przy kazdej zmianie 01_governance/EFFECTLOG.md
- 5 entries na start (scope, boundary, S11, reuse, pillars)

### 3.3 Boundary Enforcement
- RULE-DOM-001: 3 reguly w .dependency-cruiser.js
- package.json z boundary-check, s11-check, build, lint, test
- turbo.json w nowym API tasks
- pnpm-workspace.yaml zgodny
- 0 violations cross-domain

### 3.4 S11 Language Standard
- S11-01 v2.1 jako aktywne SSoT
- G1: aktywny pakiet `@silence/s11-lint` v2.1.0 + `s11-check` jako merge-blocking gate (coverage monitorowane per release)
- G2 (S11 runtime guardrails): design-only, nie blokuje MVP
- Manual steward review dla docs/UI/prompts

### 3.5 Billing / Metering (Reduced)
- Stripe checkout stub (reuse z Silence-Experience-main; real integration — prod target)
- IAP verify-receipt stub (reuse z Silence-Experience-main; real integration — prod target)
- Metering pipeline: in-memory store (MVP), Supabase+RLS (prod target)
- Quota enforcement middleware: 200/402 decision gate
- Rich 402 response shape: 7 pól + debug payload (dev/staging only)
- No advanced monetization, no dynamic pricing, no usage-based billing tiers w MVP

### 3.6 Annex IV Compliance (Reduced)
- COMP-01 jako master timeline i SSoT dla high-risk modulow
- 9 sekcji Annex IV dla intervention-timing EE
- Podstawowy risk management system (3-warstwowy: keyword, scoring, threshold)
- Human oversight design (manual review gate)
- Post-market monitoring plan (quarterly review)
- No full external medical validation, no external audit, no notified body interaction w MVP

### 3.7 Trust Scorecard (Reduced)
- Kwartalny scorecard: NRR, churn, compliance drift, boundary violations, S11 scan results
- Manual generation w Q1 (automation w Q2+)
- Spiety z Command Center Excel jako zrodlo danych
- No real-time dashboard, no predictive analytics

### 3.8 Infrastructure
- Reproducible Docker builds z pinned base image
- CI pipeline: boundary-check -> s11-check -> build -> test -> sign WASM
- CPU-only fallback equivalence test w CI
- Single-region deployment (EU)
- No multi-region, no failover, no CDN edge compute

## 4. MVP OUT OF SCOPE

| Feature | Out Reason | Reintroduced When |
|---|---|---|
| GPU support | Audyt: HIGH RISK, niekrytyczne dla MVP | Po osiagnieciu pozytywnego Trust Scorecard + 6 miesiecy stabilnosci |
| Multi-region failover | Audyt: OVER-ENGINEERING dla MVP scope | Po osiagnieciu 1000+ aktywnych organizacji |
| Real-time streaming | Audyt: wymaga GPU + multi-region | Po stabilizacji batch-only pipeline |
| Dynamic routing / advanced monetization | Audyt: poza reduced-scope | Po zamknieciu basic billing i metering |
| Blockchain integration | Audyt: niezwiazane z core value | Nie planowane w horyzoncie 2027 |
| G2 runtime S11 guardrail | Status: DESIGN; wymaga edge middleware | Po wdrozeniu G1 i stabilizacji CI |
| Full external audit EU AI Act | Koszt i czas poza MVP | Po zamknieciu COMP-01 i 3 miesiacach produkcyjnych danych |
| Notified body interaction | Wymaga pelnego technical file + audyt | H2 2027 lub pozniej |
| Predictive NRR analytics | Wymaga historycznych danych > 2 kwartalow | Po Q2 Trust Scorecard |
| Advanced usage-based billing | Wymaga metering maturity | Po stabilizacji basic metering |

## 5. BLOCKING GATES BEFORE RELEASE

| Gate | Criteria | Owner | Status |
|---|---|---|---|
| BG1 | Reproducible Docker builds z walidacja CI | devops-lead | NOT STARTED |
| BG2 | Cryptographic signing WASM + binary integrity check | security-lead | NOT STARTED |
| BG3 | Fallback equivalence testing (Rust vs WASM vs CPU) | engine-lead | PARTIAL (native equivalence PASS; WASM/CPU pending) |
| BG4 | Legal review dla EU AI Act Annex IV | compliance-lead | NOT STARTED |
| BG5 | 0 violations w boundary-check i s11-check | silence-architect | PASS (boundary + s11); G1 coverage monitorowane per release |
| BG6 | EffectLog z co najmniej 5 wpisami i ciaglym lancuchem hashy | governance-lead | PASS |
| BG7 | End-to-end metering + rich 402 response dziala w staging (integracja pakietu billing z app + realnym Stripe/IAP) | product-lead | NOT STARTED (pakiet billing MVP: DONE; staging integration: pending) |
| BG8 | Trust Scorecard Q0 wygenerowany recznie z danych archiwalnych | finance-lead | NOT STARTED |

Zaden release kandydujacy nie moze przejsc przez gate BG1-BG8 bez explicit PASS od kazdego ownera.

## 6. PREREQUISITE REPO REMEDIATION BASELINE

Przed Week 1 musi byc zamkniete:
- [x] RULE-DOM-001_P0_FULL_FILE.md naprawiony (Entry 002 EffectLog)
- [x] package.json utworzony
- [x] .dependency-cruiser.js z 3 regulami
- [x] turbo.json w nowym API tasks
- [x] pnpm-workspace.yaml zweryfikowany
- [x] pnpm boundary-check dziala (0 violations)
- [x] REUSE-AND-GAP-ANALYSIS.md utworzony
- [x] EFFECTLOG.md z 5 wpisami
- [x] s11-check jako merge-blocking gate (`@silence/s11-lint` v2.1.0 + wrapper CI)
- [x] G2 (metering 402) zamknięte w `@silence/billing` v0.1.0-mvp
- [ ] EffectLog.ts przeniesiony do 04_packages/@silence/core/
- [ ] MATH_CORE.ts przeniesiony do 04_packages/@silence/core/

## 7. 16-WEEK DELIVERY PLAN

### Week 0 (Prerequisite Closure)
- Zamkniecie baseline remediation (lista powyzej)
- Reuse: s11-check.js, s11-fixer.cjs, s11-terms.ts przeniesione do repo
- Ustalenie kanonicznej kopii monorepo (~/silence/ jako SSoT)

### Week 1-2: Filar I + III Bootstrap (G1/G2 DONE — closed ahead of schedule)
- **Billing:** `@silence/billing` v0.1.0-mvp zamknięty (rich 402, in-memory metering, quota middleware, stubs checkout/IAP)
- **Annex IV:** Adaptacja technical-file template dla intervention-timing; wypełnienie sekcji 1-3 (General Description, Development Design, Monitoring Control)
- **S11:** `@silence/s11-lint` v2.1.0 wdrożony jako merge-blocking gate; pierwszy manualny steward review

### Week 3-4: Filar II Activation + Coverage Expansion
- **Boundary:** depcruise crawluje rzeczywiste moduły (po dodaniu entrypointów); target > 50% coverage
- **S11:** Rozszerzenie pokrycia G1 wraz z rosnięciem kodu w 04_packages i 05_apps
- **Repo:** Wypełnienie stubów w 04_packages/@silence/core/, guards/, sdk/, types/

### Week 5-6: Filar V + Infrastructure
- **Trust Scorecard:** Manualny Q0 scorecard z danych archiwalnych Excel
- **Docker:** Reproducible builds z pinned base image + CI validation
- **Security:** Cryptographic signing WASM + binary integrity check w CI

### Week 7-8: Filar IV Prod Hardening + Engine Core
- **Metering:** Podłączenie metering pipeline do Supabase+RLS; integracja z realnym Stripe/IAP w staging
- **Engine:** Szkielet deterministic engine Rust (core data structures, seed propagation)
- **Annex IV:** Wypełnienie sekcji 4-6 (Performance Metrics, Risk Management, Lifecycle Changes)

### Week 9-10: Engine + Equivalence
- **Engine:** WASM target dla Rust engine; podstawowy FFI do TypeScript
- **Equivalence:** Runner CI porównujący Rust vs WASM vs CPU fallback
- **Annex IV:** Wypełnienie sekcji 7-9 (Applied Standards, Declaration of Conformity, Post-Market)

### Week 11-12: Integration + Staging
- **Integration:** End-to-end flow: input -> engine -> EffectLog -> metering -> 402 response
- **Staging:** Deployment single-region EU; smoke testy
- **Legal:** Internal review Annex IV przez compliance-lead

### Week 13-14: Hardening
- **Security:** Penetration testy metering i billing endpointów
- **Compliance:** Final review S11-01, RULE-DOM-001, COMP-01
- **Performance:** Load test CPU-only batch inference

### Week 15-16: Release Candidate
- **RC:** Tag v0.1.0-MVP; signed binaries; final equivalence test
- **Gates:** Przejście przez BG1-BG8
- **Trust Scorecard:** Generacja Q1 scorecard (bazowy benchmark)
- **Go/No-Go:** Spotkanie governance z udziałem wszystkich ownerów

## 8. OWNERS

| Domain | Owner | Backup |
|---|---|---|
| Architecture / RULE-DOM-001 | silence-architect | phi-core-guardian |
| S11 / Compliance | s11-steward | compliance-lead |
| Engine (Rust+WASM) | engine-lead | rust-specialist |
| Billing / Metering | product-lead | finance-lead |
| Annex IV / Legal | compliance-lead | eu-ai-act-interpreter |
| Trust Scorecard / Command Center | finance-lead | data-lead |
| CI / Docker / Release | devops-lead | security-lead |
| EffectLog / Governance | governance-lead | silence-architect |

## 9. GO/NO-GO CRITERIA

### GO
- Wszystkie gates BG1-BG8: PASS
- Trust Scorecard Q1 wygenerowany i >= baseline
- 0 critical vulnerabilities w security review
- boundary-check i s11-check: PASS w CI przez 7 dni bez przerwy
- EffectLog ciagly i zweryfikowany
- Legal review Annex IV: PASS (internal)
- Product-lead sign-off dla rich 402 response i metering

### NO-GO
- Dowolny gate BG1-BG8: FAIL lub PENDING
- Krytyczna luka security niezamknieta w ciagu 48h
- Drift RULE-DOM-001 (nowe importy cross-domain)
- S11 violations w LANGUAGE_SYSTEM niezamknięte w ciagu 48h
- Niegotowosc ownera do sign-off

## 10. MATH-CORE MAPPING TABLE

| Parameter | Derivation | Operational Value |
|---|---|---|
| phi | constant | 1.618033988749895 |
| PCS_BASE | 1 - phi^(-12) | > 0.997 |
| GOLDENSECOND | floor(phi * 1000) | 1618 ms |
| Validation Window | GOLDENSECOND * phi^(-2) | ~382 ms |
| Sync Interval | GOLDENSECOND * phi^(2) | ~2618 ms |
| MVP Cycle | GOLDENSECOND * phi^(4) | ~6854 ms |
| Delivery Plan Weeks | 16 | ~2.4 * phi^4 |

## 11. 12-POINT PASS/FAIL CHECKLIST

- [x] [PATH] obecny.
- [x] Executive Decision jednoznaczny i nieodwracalny.
- [x] In Scope / Out Scope rozdzielone bez luk.
- [x] Blocking Gates zdefiniowane z ownerami i kryteriami.
- [x] Prerequisite Baseline zamkniety (lub z planem zamkniecia w Week 0).
- [x] 16-Week Delivery Plan z konkretnymi deliverables per week.
- [x] Owners przypisani do kazdego domain.
- [x] Go/No-Go Criteria binarne i audytowalne.
- [x] Math-Core Mapping zgodny z MATH_CORE.ts.
- [x] Brak GPU, multi-region, streaming, blockchain, advanced monetization w scope.
- [x] PCS > 0.99 potwierdzony.
- [x] EffectLog entry reference obecny.

## 12. EFFECTLOG ENTRY REFERENCE

```text
EFFECTLOG.ID: PHI-MVP-SCOPE-20260610-001
EVENT: REDUCED_MVP_SCOPE_DECISION
CHANGE:
  - ustalono reduced-scope MVP
  - usunieto GPU, multi-region, streaming, blockchain, advanced monetization
  - pozostawiono CPU-only, batch-only, single-model, basic compliance
  - ustanowiono COMP-01 jako master SSoT
  - spieto 5 filarow w jedna sciezke delivery
STATUS: PASS
```
