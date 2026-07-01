<!-- PATH: /home/ewa/silence/01_governance/AUDITS/PATTERNLENS_SKELETON_AUDIT_20260625.md -->
<!-- STATUS: active | review -->
<!-- S11.COMMIT.ID: AUDIT-PATTERNLENS-SKELETON-20260625-001 -->
<!-- PREVHASH: INIT-AUDIT-PATTERNLENS-000 -->

# PATTERNLENS — Audyt szkieletu + analiza kod1 / kod2 / kod3

## 1. METADATA

| Pole | Wartość |
|------|---------|
| PATH | `05_apps/patternlens` |
| Źródła | `kod1.docx`, `kod2.md`, `kod3.md` (root repo) |
| Data audytu | 2026-06-25 |
| Branch | `feat/add-agents-md-and-protocols` |
| Boundary-check | **PASS** (po remediacji) |
| S11-check | **FAIL** (fałszywe pozytywy + terminy kliniczne w kodzie źródłowym) |
| Type-check patternlens | **FAIL** (brak typów w `@silence/contracts`, rozbieżność szkieletu) |

## 2. EXECUTIVE SUMMARY

`05_apps/patternlens` nie jest gotową aplikacją. Jest to **złożony zlepek**:

- aktywnego katalogu `src/app/` (Next.js App Router, TSX),
- martwego katalogu `app/` (stary szkielet JS/TS),
- martwego katalogu `components/` (nieużywane komponenty),
- duplikatów plików (`route.js` obok `route.ts`, `layout.js` obok `layout.tsx`),
- plików konfiguracyjnych z błędnymi zależnościami workspace (`@silence/behavioral-engine-ee`, `@silence/event-schema`),
- kodu, który importuje typy z `@silence/contracts`, które **nie istnieją** w kanonicznym pakiecie.

Pliki `kod1.docx`, `kod2.md`, `kod3.md` zakładają istnienie struktury (`src/features/onboarding/`, `src/lib/jitai/`, `useOnboardingState`, `GoldenRatioSilence`, `lib/i18n`, `lib/utils`, `types/patternlens`), której **w repo nie ma**. Nie można ich bezpośrednio wkleić — wymagają najpierw budowy fundamentów lub mapowania na istniejący szkielet.

**Wykonano krytyczną remediację boundary:** usunięto import `03_ee` z `src/app/api/interpret/route.ts` i testów, zastąpiono lokalnym deterministycznym stubem `@/lib/engine/interpret.ts`. `boundary-check` przechodzi.

## 3. STAN SZKIELETU `05_apps/pATTERNLENS`

> **Krytyczna obserwacja:** cały katalog `05_apps/patternlens` jest **untracked** w git (`git ls-files 05_apps/patternlens` zwraca pusty wynik). Oznacza to, że obecny szkielet nigdy nie został zacommitowany do repo i nie istnieje w `pnpm-lock.yaml`. Jest to lokalny dump, nie część kanonicznego monorepo.

### 3.1 Struktura aktywna

Aktywna część aplikacji znajduje się w `src/app/` i `src/components/`:

- `src/app/(auth)/` — signup / login
- `src/app/(emergency)/` — emergency page
- `src/app/(legal)/` — privacy / terms / support
- `src/app/(main)/` — dashboard / patterns / settings / onboarding
- `src/app/api/` — routes: analyze, consent, emergency, health, interpret, objects, patterns, reports, stripe, user, voice
- `src/components/` — ObjectCard, CrisisModal, VoiceDump, BentoGrid, AppShell, itp.
- `src/lib/` — auth, supabase, safety, ai, telemetry, validation, i18n (LanguageContext)

### 3.2 Struktury martwe / duplikaty

| Ścieżka | Problem |
|---------|---------|
| `app/` | Stary szkielet z plikami `.js` i `.tsx`. Next.js może traktować go jako główny app dir, co koliduje z `src/app/`. |
| `components/` | Nieimportowane komponenty (CreateObject, CrisisModal, Footer, Header, Sidebar, StatsGrid, TierBadge, VoiceDump). |
| `api/`, `health/`, `objects/`, `app/api/objects/` | Rozproszone, częściowo zduplikowane routes poza `src/app/api/`. |
| `ghost _patterns/` | Duży zanieczyszczony katalog z innym projektem (portal, pnpm-lock, .git). |
| `mobile-lens/` | Eksperymentalny moduł, importuje `@silence/sdk` (deprecated). |

### 3.3 Brakujące elementy (vs zakładane przez kod2/kod3)

- `src/features/onboarding/components/GoldenRatioSilence.tsx`
- `src/features/onboarding/components/Step3AhaMoment.tsx`
- `src/lib/jitai/sessionCapture.ts`
- `src/lib/jitai/decisionEngine.ts`
- `src/lib/jitai/types.ts`
- `src/hooks/useOnboardingState.ts`
- `types/patternlens.ts`
- `lib/utils.ts` (funkcja `cn`)
- `lib/i18n` jako moduł `useTranslation` (istnieje tylko `LanguageContext.tsx`)
- Tailwind tokens φ (`phi-tokens.css`)

## 4. ANALIZA `kod1.docx` — US v1 ROADMAP

### 4.1 Co jest zgodne z kanonem

- φ-derived spacing / timing / easing — zgodne z MATH CORE.
- Golden Second Cascade (`1618ms`) — zgodne z `GOLDENSECOND`.
- Breath phases `38.2 / 23.6 / 38.2` — zgodne z φ.
- PWA / iOS safe areas — poprawne wymagania produkcyjne.
- Deterministic Only / ZERO adaptive AI — zgodne z polityką SILENCE.

### 4.2 Błędy / naruszenia

| Lp. | Problem | Skutek |
|-----|---------|--------|
| 1 | Lokalna stała `PHI = 1.618033988749895` zamiast importu z `@silence/phi`. | Duplikacja SSoT, ryzyko rozbieżności. |
| 2 | Marketing: `"ADHD brains"`. | Naruszenie S11 LANGUAGE LOCK. |
| 3 | `fontSize` używa magic numbers w `clamp()` bez jawnej derywacji φ. | MATH CORE violation. |
| 4 | `next.config.ts`: `experimental: { turbopack: true }` jest zbędne w Next.js 15. | Config noise. |
| 5 | `page.tsx` importuje `SilenceExperience`, `CheckinPanel`, `Timeline` — nie istnieją. | Szkielet niekompilowalny. |
| 6 | `vercel.json` z `buildCommand` i `functions.maxDuration` — wymaga weryfikacji z planem deploymentu. | Możliwe błędy w Vercel config. |

## 5. ANALIZA `kod2.md` — ONBOARDING PATTERNLENS

### 5.1 Koncepcja

7-step onboarding: `WELCOME → INTENT → FIRST_OBSERVATION → BASELINE_STAIRCASE → ACCOUNT → CONSENTS → PLAN → PERMISSIONS`.

### 5.2 Błędy logiczne / naruszenia

| Lp. | Problem | Skutek |
|-----|---------|--------|
| 1 | Zakłada istnienie `Step1Welcome`…`Step7Permission`, `useOnboardingState`. | Brak SSoT — te komponenty nie istnieją. |
| 2 | Używa `framer-motion` — brak w `package.json`. | Błąd instalacji. |
| 3 | Importuje `lib/i18n` jako `useTranslation` — istnieje tylko `LanguageContext.tsx` bez hooka `useTranslation`. | Błąd kompilacji. |
| 4 | Importuje `cn` z `lib/utils` — plik nie istnieje. | Błąd kompilacji. |
| 5 | Importuje `types/patternlens` — nie istnieje. | Błąd kompilacji. |
| 6 | Kategorie myśli: `RUMINATION`, `CATASTROPHIZING` — terminy kliniczne. | Naruszenie S11 w UI. |
| 7 | `adaptive: boolean` w kategoriach — nazwa nawiązuje do "adaptive AI", co jest zabronione w US v1 ("ZERO adaptive AI"). | Sprzeczność z polityką. |
| 8 | Proponuje przechowywanie tailoring vars w IndexedDB bez wersjonowania schematu. | Ryzyko migracji. |

### 5.3 Stan obecny onboardingu

Aktualny `src/app/(main)/onboarding/page.tsx` to jedynie ekran zgód (`CONSENTS`) z redirectem do `/dashboard`. Brak kroków 1–5 i 7.

## 6. ANALIZA `kod3.md` — GOLDEN RATIO SILENCE + JITAI

### 6.1 Koncepcja

Canvas 2D z φ-geometry, fazy `ENTRY / DEEPENING / SILENCE / RETURN`, modulacja geometry przez JITAI.

### 6.2 Błędy logiczne / naruszenia determinizmu

| Lp. | Problem | Skutek |
|-----|---------|--------|
| 1 | `Date.now()` w inicjalizacji `sessionData.startedAt`. | Niedeterministyczny timestamp. |
| 2 | `Date.now()` w `recordPhaseTransition`, `recordBreathingSample`, `recordInteraction`, `evaluateDecisionPoint`, `handleComplete`. | Eventy nie są replay-safe. |
| 3 | `Date.now() - sessionData.startedAt!` w progress barze. | Hydration mismatch + niedeterminizm. |
| 4 | `new JITAIEngine(jitaiProfile)` tworzony wielokrotnie (w `useEffect` i w `evaluateDecisionPoint`). | Brak spójności stanu, zbędne alokacje. |
| 5 | `elapsed % 500 < 16` do samplowania oddechu. | W RAF każda klatka może spełniać warunek wielokrotnie lub wcale; brak stabilnego interwału. |
| 6 | Brak `prefers-reduced-motion` i in-app motion toggle. | Naruszenie accessibility z kod1. |
| 7 | `console.log` w kodzie produkcyjnym. | Niedopuszczalne w kanonie (ZERO FRAGMENT POLICY). |
| 8 | Brak cleanup event listenerów / RAF. | Memory leaks. |
| 9 | Importy `@/lib/jitai/*` — te moduły nie istnieją. | Szkielet niekompilowalny. |
| 10 | Lokalne `const PHI = 1.618033988749895` — powinien być import z `@silence/phi`. | Duplikacja SSoT. |

## 7. NARUSZENIA KANONU SILENCE W OBECNYM PATTERNLENS

### 7.1 RULE-DOM-001 — granica IP

**PRZED remediacją:** `src/app/api/interpret/route.ts` i `src/app/api/interpret/__tests__/route.test.ts` importowały `@silence/behavioral-engine-ee` (03_ee).

**PO remediacji:** zastąpione lokalnym stubem `@/lib/engine/interpret.ts`. `boundary-check` PASS.

### 7.2 SDK-only boundary

`@silence/sdk` ma wersję `0.0.0-deprecated`, jest pusty. Aplikacje nie mają kanonicznego entrypointu. `mobile-lens/src/screens/FocusScreen.tsx` importuje `@silence/sdk` — martwy kod, ale sygnał.

### 7.3 Niedeterminizm

Wykryto `Date.now()` / `new Date()` / `Math.random()` w wielu miejscach:

- `src/components/layout/AppShell.tsx:413` — `Math.random()` w generowaniu ID.
- `src/components/ui/AIThinkingState.tsx:149` — `Math.random()` w animacji.
- `src/components/SystemOverview.tsx:18-19` — `Math.random()` w danych demo.
- `src/hooks/useOfflineQueue.ts:217` — `Date.now()` + `Math.random()`.
- `src/app/api/interpret/route.ts` — `Date.now()` w metrics (pozostało).

### 7.4 S11 LANGUAGE LOCK

- `kod1.docx`: "ADHD brains".
- `kod2.md`: `RUMINATION`, `CATASTROPHIZING` jako kategorie UI.
- `s11-check` zgłasza również fałszywe pozytywy (`disabled` w Tailwind, słowa w mapach sanitizacji).

### 7.5 ZERO FRAGMENT POLICY

- Martwe katalogi `app/`, `components/`, `ghost _patterns/`.
- Pliki `.docx` z dokumentacją rozrzucone w katalogu aplikacji.
- Brak `AGENTS.md` w `05_apps/patternlens`.

## 8. WDRAŻONE POPRAWKI

| Zmiana | Ścieżka | Uzasadnienie |
|--------|---------|--------------|
| Utworzono lokalny stub engine | `src/lib/engine/interpret.ts` | Zastąpienie importu 03_ee; zachowanie interfejsu v6.0; determinizm. |
| Zmieniono importy route | `src/app/api/interpret/route.ts` | RULE-DOM-001 compliance. |
| Zmieniono importy testów | `src/app/api/interpret/__tests__/route.test.ts` | RULE-DOM-001 compliance. |
| Usunięto błędną zależność | `package.json` (`@silence/behavioral-engine-ee`) | Pakiet nie istnieje w workspace. |
| Zlokalizowano SilenceEventV2 | `src/lib/telemetry/types.ts` | Zastąpienie importu `@silence/event-schema` (nie istnieje). |
| Zmieniono importy telemetry | `src/lib/telemetry/client.ts`, `__tests__/telemetry.test.ts` | Użycie lokalnego typu. |

## 9. REKOMENDACJE PRIORYTETOWE

### P0 — krytyczne

1. **Uporządkować strukturę plików:** usunąć lub zarchiwizować `app/`, `components/`, `ghost _patterns/` oraz rozproszone routes poza `src/`.
2. **Dodać `AGENTS.md`** w `05_apps/patternlens` z lokalnym kontraktem (granice, stack, zakaz importów 03_ee).
3. **Naprawić `package.json`** — usunąć wszystkie nieistniejące zależności workspace; dodać brakujące (`@silence/phi` itp. jeśli potrzebne).
4. **Naprawić `turbo.json`** — `globalDependencies` jest unknown w Turbo 2.x; użyć `globalEnv` / `globalDeps`.
5. **Zdecydować o `@silence/sdk`:** odbudować jako publiczny entrypoint lub usunąć zależności na niego.

### P1 — wysokie

6. **Zsynchronizować typy** z `@silence/contracts`: dodać brakujące exporty (`CrisisResource`, `ProtocolKey`, `AudioRecording`, `OnboardingIntention`, itp.) lub zaktualizować appkę.
7. **Usunąć niedeterminizm** z komponentów UI (`AppShell`, `AIThinkingState`, `SystemOverview`, `useOfflineQueue`).
8. **Zbudować fundamenty onboardingu:** `useOnboardingState`, kroki 1–7, `GoldenRatioSilence` z φ-tokens.
9. **Wdrożyć EffectLog adapter** dla Pulse Tap / onboarding events.

### P2 — średnie

10. **Zastąpić `Date.now()` w API routes** deterministycznym `timestamp` injectowanym przez caller lub użyć kanonicznego źródła czasu z `@silence/phi`.
11. **Dodać S11 pre-commit filter** dla `kod*.md` / `kod*.docx` w root.
12. **Przeprowadzić `pnpm install`** z pełną walidacją lockfile (wymaga zgody właściciela repo).

## 10. WERDYKT

`05_apps/patternlens` jest **szkieletem w stanie dekompozycji**, nie aplikacją gotową do buildu. Fragmenty `kod1/kod2/kod3` są **projektem koncepcyjnym**, który nie mapuje się bezpośrednio na obecną strukturę repo i zawiera błędy determinizmu oraz naruszenia S11.

Najbliższy bezpieczny cel: **wyczyścić strukturę, ustabilizować boundary-check, zbudować AGENTS.md oraz minimalny szkielet onboardingu oparty na istniejącym `src/app/(main)/onboarding/`** zamiast wklejać kod z zewnętrznych plików.

---

*END OF AUDIT*
