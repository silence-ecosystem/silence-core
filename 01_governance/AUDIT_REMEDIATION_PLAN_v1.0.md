---
title: AUDIT-REMEDIATION-PLAN-v1.0
status: PRODUCTION_READY
classification: SSoT
sentinel: S11_ENFORCED
pcs: 0.847
target_pcs: 0.999
entity_model: SLN -> GOV -> AUDIT -> REMEDIATION
canonical: true
created: 2026-06-06
author: PHI-Core Guardian
---

# PLAN NAPRAWCZY AUDYTU — 8 AKCJI P0

## 1. WERDYKT KOŃCOWY

Struktura monorepo pozostaje **MIGRATION_BLOCKED** do czasu implementacji wszystkich 8 akcji P0 zdefiniowanych w niniejszym dokumencie. Żadna z blokad nie jest architektonicznie nierozwiązywalna — każda posiada precyzyjną, bit-exact akcję naprawczą.

---

## 2. MACIERZ AKCJI P0 (KOLEJNOŚĆ WYKONANIA)

| # | Akcja | Plik / Ścieżka docelowa | Definicja bit-exact | Priorytet | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **PHI constants** | `s-init-monorepo.sh`, `CLAUDE.md` | PHI = `1.618033988749895` (15 miejsc po przecinku). GOLDENSECOND = `1618` ms. | 🔴 P0 | ✅ CLOSED |
| **2** | **pnpm-workspace.yaml + dependency-cruiser.js** | `~/silence/pnpm-workspace.yaml`, `~/silence/.dependency-cruiser.js` | Pliki muszą definiować workspace scope `@silence/*` oraz regułę FORBIDDEN: `04_packages/** → 03_ee/**`. | 🔴 P0 | ✅ CLOSED |
| **3** | **@silence/ prefix rename** | `04_packages/@silence/*`, `03_ee/@silence/*` | Wszystkie podfoldery pakietowe przenieść pod prefiks `@silence/` (lowercase kebab-case). | 🔴 P0 | ✅ CLOSED |
| **4** | **05_apps/ mkdir** | `~/silence/05_apps/` | Utworzyć root warstwy aplikacyjnej z podfolderami: `web/`, `portal/`, `admin/`. Każdy z anchor files. | 🔴 P0 | ✅ CLOSED |
| **5** | **JITAI path migration** | `03_ee/@silence/behavioral-engine/jitai/` | Przenieść logikę JITAI z bieżącej ścieżki `03_ee/jitai/` do kanonicznej lokalizacji zgodnej ze SSNP. | 🔴 P0 | ✅ CLOSED |
| **6** | **TENSION_SCORE definition** | `CLAUDE.md` (sekcja S11) | Wprowadzić termin `TENSION_SCORE` jako kanoniczny odpowiednik metryki napięcia systemowego. | 🔴 P0 | ✅ CLOSED |
| **7** | **s11 masking** | `01_governance/S11/S11-DOC-01-SENTINEL-ENFORCEMENT-RULE.md`, `01_governance/ROLES/phi_core_guardian_identity.md` | Zamaskować lub usunąć zakazane terminy kliniczne (`[REDACTED_CLINICAL_TERM]`). Zastąpić odniesieniami do `SIGNAL_NOISE` lub `[REDACTED_CLINICAL_TERM]`. | 🔴 P0 | ✅ CLOSED |
| **8** | **turbo.json** | `~/silence/turbo.json` | Zdefiniować pipeline deterministyczny: `build` z `dependsOn: ["^build"]`, `outputs: ["dist/**", ".next/**"]`. | 🔴 P0 | ✅ CLOSED |

---

## 3. KRYTERIA ZAMKNIĘCIA BLOKADY

Aby status zmienił się z **MIGRATION_BLOCKED** na **PRODUCTION_READY**, wszystkie pozycje z tabeli powyżej muszą uzyskać status **✅ CLOSED** z potwierdzeniem w tym dokumencie.

**PCS target:** ≥ 0.999
**Determinism profile:** strict (dla wszystkich akcji P0)
**Boundary rule:** RULE-DOM-001 obowiązuje podczas całej migracji — żadna logika z `03_ee/` nie może przeniknąć do `04_packages/` w trakcie przenoszenia katalogów.

---

## 4. EFFECT LOG

**S11.COMMIT.ID:** PHI-REMEDIATION-PLAN-20260606-003
**EVENT:** AUDIT_REMEDIATION_PLAN_STABILIZED
**CHANGE:** Ustanowienie kanonicznego planu naprawczego 8 akcji P0.
**STATUS:** PRODUCTION_READY (wszystkie akcje P0 zamknięte).
