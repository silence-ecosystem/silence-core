[PATH]: 01_governance/SILENCE-BRAND-BOOK-LITE.md

---
title: SILENCE.OBJECTS Brand Book Lite — Structural Silence System
version: v1.1.0
date: 2026-06-25
author: Pattern System Architect
status: ACTIVE
pcsstatus: 0.990
sentinel: S11_ENFORCED
scope: 05_apps web + mobile, design systems, φ-mathematics, onboarding ritual, JITAI logging
ssot: true
classification: OPERATIONAL

S11.COMMIT.ID: SILENCE-BRAND-BOOK-LITE-20260625-v1.1
prevHash: SILENCE-BRAND-BOOK-LITE-20260625-001
STATUS: ACTIVE
PCS: 0.990
RIGOR: S11 + MATH_CORE + HARD_SEVEN + BRAND_ESSENCE
SENTINEL: ENFORCED

---

# SILENCE.OBJECTS — Brand Book Lite v1.1

**Core Axiom:** System nie jest estetyką. System jest deterministycznym kontraktem matematycznym, wyprowadzonym z liczby φ, chroniącym układ nerwowy użytkownika przed przebodźcowaniem.

**Zero Placeholders. Każda liczba musi mieć jawną derywację φ.**

---

## TABLE OF CONTENTS

1. Brand Positioning & Axiom Zero
2. Mathematical Foundation (φ-Derivation)
3. Typography System (φ-Scaled)
4. Color Palette & Luminance Hierarchy
5. Component Patterns & Geometry
6. Layout & Golden Ratio
7. Motion Protocol (Keyframes at φ-Points)
8. Onboarding Ritual (Protocol Zero)
9. JITAI Decision Logging (patternslab.work)
10. Implementation Checklist
11. Do's & Don'ts
12. Effectlog Entry

---

## 1. BRAND POSITIONING & AXIOM ZERO

### 1.1 Core Identity

**SILENCE.OBJECTS** = Structural Silence realization.

**What we are:** Sensorium umbrella protecting user from cognitive overload. Design enforces φ-contract to shield nervous system.

**Positioning:** Not therapy. Not wellness. Not self-help.

**Positioning:** Structural interpretation laboratory. User is architect, not patient.

### 1.2 The Axiom of Point Zero

**Axiom Punktu Zero:** All artefacts must be delivered in complete, mathematically-defined form. Zero approximation. Zero "we'll refine later."

Each component, color, timing, spacing derives directly from φ or Fibonacci. No "nice numbers." No "round values." Only canonical constants.

**Violation = WORLDHALT.**

---

## 2. MATHEMATICAL FOUNDATION

### 2.1 The Golden Ratio (φ)

φ = (1 + √5) / 2 = **1.618033988749895**

This is the ONLY allowed value. No 1.6, no 1.62. Full precision or Fibonacci integers only.

### 2.2 Canonical Constants (MATH_CORE Mapping)

| Constant | Value | Derivation | Use Case |
|----------|-------|-----------|----------|
| **GOLDEN_SECOND** | 1618 ms | φ × 1000 ms | Base timing unit |
| **VALIDATION_WINDOW** | 618 ms | φ⁻¹ × 1000 ms | Form input debounce |
| **STABILITY_HEARTBEAT** | 2618 ms | φ² × 1000 ms | Animation duration (ease) |
| **SILENCE_CYCLE** | 6854 ms | φ⁴ × 1000 ms | Full ritual duration |
| **INVERSE_PHI** | 0.618034 | 1 / φ | Luminance/opacity ratio |
| **INVERSE_PHI_SQ** | 0.381966 | 1 / φ² | Layout split (38.2%) |
| **INVERSE_PHI_CU** | 0.236068 | 1 / φ³ | Minimal change threshold |
| **SQRT_PHI** | 1.272019 | √φ | Luminance tier scaling |

**Rule:** Every timing, spacing, or proportion in system must be:
- A value from this table, OR
- A Fibonacci integer (1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233), OR
- A documented ADR exception (rare)

No exceptions. CI enforcement via `pnpm validate-phi-constants`.

### 2.3 Fibonacci Scale (Allowed Loop Values)

Loops, iterations, steps may use only: **{1, 2, 3, 5, 8, 13, 21}**

- 1-step process: trivial
- 2-step: onboarding (Intent + Baseline)
- 3-step: ritual (Entry, Deepening, Return)
- 5-step: full session (Enter, Focus, Deepen, Silence, Return)
- 8-step: complex workflow (rare)
- 13-step: maximum context depth (edge cases only)

---

## 3. TYPOGRAPHY SYSTEM

### 3.1 Type Scale (φ-Derived from 16px Base)

**All sizes are 16px × φⁿ for integer n.**

| Level | Size | Derivation | Line-Height | Use Case |
|-------|------|-----------|-------------|----------|
| **H1** | 41.89px | 16 × φ² | 1.272 (√φ) | Page title, modal header |
| **H2** | 25.89px | 16 × φ¹·⁶ | 1.272 (√φ) | Section header |
| **H3** | 25.89px | 16 × φ | 1.272 (√φ) | Subsection |
| **Body** | 16px | 16 × φ⁰ | 1.618 (φ) | Paragraph, form text |
| **Small** | 9.89px | 16 × φ⁻¹ | 1.618 (φ) | Caption, timestamp, hint |
| **Micro** | 6.15px | 16 × φ⁻²·⁶ | 1.381 | Badge, tag, breadcrumb |

**Rounding Rule:** 
- Integer values: exact (16px body)
- Decimal values: round half-to-even to 0.01px precision
- Example: 41.89px is exact, not "42px"

### 3.2 Font Specification

**Primary Font:** JetBrains Mono

- Weight: Regular (400), Medium (500), Bold (700) only
- No other weights
- Monospace ensures proportional numerals (no tabular-nums needed)
- Renders on web, iOS, Android identically

**Fallback:** Menlo, Monaco, Courier New (system monospace)

### 3.3 Letter-Spacing

| Context | Value | Rationale |
|---------|-------|-----------|
| Body text | 0px | Natural monospace tracking |
| H1–H3 | −0.3px to −0.5px | Tighter for emphasis |
| Small/Micro | 0.5px to 1px | Breathing room for readability |

---

## 4. COLOR PALETTE & LUMINANCE HIERARCHY

### 4.1 Soft Noir Axiom

**Forbidden:** Pure black (#000000) and pure white (#FFFFFF).

**Rationale:** Pure contrast fatigues retina. Warm obsidian (Tier 0) reduces eye strain.

### 4.2 Luminance Tier System (Scaled by √φ ≈ 1.272)

**Tier 0 (Abyss):** hsl(220, 8%, 12%) — Base/Background

Each higher tier increases luminance by √φ (1.272x):

| Tier | Luminance | hsl(220, %, L%) | Use Case | Contrast (on Tier 0) |
|------|-----------|----------------|----------|-------------------:|
| **0** | 12% | hsl(220, 8%, 12%) | Background, default | — |
| **1** | ~15.3% | hsl(220, 8%, 15%) | Cards, panels | 1.27:1 |
| **2** | ~19.4% | hsl(220, 8%, 19%) | Hover, elevated | 1.62:1 |
| **3** | ~24.7% | hsl(220, 8%, 25%) | Interactive, focus | 2.06:1 |
| **4** | ~31.4% | hsl(220, 8%, 31%) | Maximum elevation | 2.62:1 |

**Text on Tier 0 (default):**
- Primary: #E8E4DF (Off-White, 88% luminance) → **7.3:1 contrast (AAA)**
- Secondary: #A8A4A0 (52% luminance) → **4.1:1 contrast (AA)**
- Tertiary: #6A6A6F (25% luminance) → **2.1:1 (disabled, deemphasized)**

### 4.3 Accent Color (Li Signature Gold)

**Single allowed signal color:** #C9A84C (HSL 38, 50%, 50%)

**Contrast on Tier 0:** 5.8:1 (AA, acceptable for accents)

**Usage:**
- Button focus ring (2px outline)
- Error state (combined with red overlay)
- Critical alerts (CRISIS detection)
- JITAI decision markers (high-importance logging)

**Forbidden:** Any other accent colors. No gradients, no overlays beyond 0.618 opacity.

### 4.4 Theme Variants (4 Soft Noir Motifs)

Each variant shifts hue slightly, maintaining Tier 0-4 structure.

| Variant | Hue | Character | Tier 0 | Use Case |
|---------|-----|-----------|--------|----------|
| **Graphite Drift** | 220° | Cool gray, neutral | hsl(220, 8%, 12%) | Default, all lighting |
| **Ember Silence** | 30° | Warm obsidian, brown | hsl(30, 10%, 12%) | Evening, low-light |
| **Midnight Paper** | 240° | Deep blue-black, maximum | hsl(240, 12%, 10%) | Precise work, high urgency |
| **Ion Haze** | 210° | Minimal contrast, gentle | hsl(210, 6%, 14%) | Accessibility, reduced intensity |

**Implementation:** CSS custom properties at document root.

---

## 5. COMPONENT PATTERNS & GEOMETRY

### 5.1 Button Geometry (φ-Derived)

**Radius:** 4px × φ = **6.47px** (round to 6.5px per CSS)

**Padding (vertical : horizontal):** 1 : φ ratio

- Small: 8px vert, 13px horiz
- Medium: 13px vert, 21px horiz
- Large: 21px vert, 34px horiz

**Min-Width:** 89px (Fibonacci)

**Height:** 44px (touch target, WCAG minimum)

**Focus Ring:** 2px solid Li Signature Gold (#C9A84C), 2px offset

### 5.2 Card Component

**No drop-shadow.** Depth comes from luminance contrast (Tier 0 vs Tier 1).

**Padding:** 21px (Fibonacci)

**Border:** 1px solid from Tier 2 luminance

**Radius:** 6.5px (4px × φ)

### 5.3 Modal Component

**Overlay Opacity:** 0.618 (φ⁻¹)

**Width:** Golden Rectangle ratio (1 : φ)
- Max-width: 610px (practical CSS for golden rectangle)

**Backdrop filter:** None (no blur, system-like feel)

**Padding:** 34px (Fibonacci = φ²)

### 5.4 Input Field Geometry

**Height:** 44px (touch target)

**Padding:** 13px 13px (Fibonacci 13)

**Radius:** 3px (minimal, not rounded)

**Border:** 1px solid Tier 1 luminance

**Focus:** 2px solid Li Signature Gold, outline-offset 2px

---

## 6. LAYOUT & GOLDEN RATIO

### 6.1 Two-Column Layout (61.8% / 38.2%)

**Content : Sidebar split follows INVERSE_PHI:**

- Content width: 100 × 0.618 = **61.8%**
- Sidebar width: 100 × 0.382 = **38.2%**
- Gutter between: 34px (Fibonacci)

Example at 1280px total:
- Content: 790px (61.8%)
- Gutter: 34px
- Sidebar: 490px (38.2%)

**No clamp(), no min()/max().** Discrete breakpoints only.

### 6.2 Grid System (12 Columns)

| Breakpoint | Width | Columns | Gutter | Use |
|-----------|-------|---------|--------|-----|
| Mobile | 375px | 4 | 13px | Phone portrait |
| Tablet | 768px | 8 | 21px | iPad portrait |
| Desktop | 1280px | 12 | 34px | Monitor |
| Wide | 1920px | 12 | 55px | Ultra-wide |

### 6.3 Spacing Scale (Fibonacci Multiples of 8px)

| Value | Px | Use Case |
|-------|-----|----------|
| xs | 8px | Micro gaps |
| sm | 13px | Component padding |
| md | 21px | Between components |
| lg | 34px | Section gaps |
| xl | 55px | Major separation |
| xxl | 89px | Page margins |

---

## 7. MOTION PROTOCOL

### 7.1 Animation Timings (φ-Derived)

| Duration | Milliseconds | Use |
|----------|-------------|-----|
| Instant | 0ms | No animation |
| Micro | 382ms | Focus ring, tooltip |
| Quick | 618ms | Button press, toggle |
| Ease | 1000ms | Modal fade-in, card slide |
| Golden | 1618ms | Theme change, page transition |
| Breathe | 2618ms | Breathing ritual, slow fade |

**Forbidden Timings:** 150ms, 200ms, 300ms, 500ms, 750ms

### 7.2 Keyframes (φ-Point Percentages Only)

**Allowed:** 0%, 23.6%, 38.2%, 61.8%, 76.4%, 100%

**Forbidden:** 25%, 50%, 75%

### 7.3 Easing Functions

**Allowed only:**
- ease-out
- ease-in-out
- linear

**Forbidden:** ease, ease-in, cubic-bezier

### 7.4 prefers-reduced-motion Compliance

All animations fade to 0.01ms under this media query.

---

## 8. ONBOARDING RITUAL (PROTOCOL ZERO)

### 8.1 Purpose

Protocol Zero = passive diagnostics before JITAI decides. User's nervous system is registered, not prodded.

### 8.2 Ritual Stages

**Stage 1: Warm Obsidian Frame (Entry)**
- Duration: 1618ms (GOLDEN_SECOND)
- Visual: Gold accent glow (#C9A84C) at 0.3 opacity
- Interaction: User breathes (no input)
- Outcome: Baseline state sampled

**Stage 2: Intent Selection (Deepening)**
- Duration: 2618ms per option (φ² × 1000)
- Visual: 4 cards in 2×2 grid
- Options: focus, sleep, rhythm, clarity
- Outcome: Intent declared

**Stage 3: Baseline Calibration (Silence)**
- Duration: 3–5 min (user-paced, 618ms debounce)
- Visual: Three sliders (mood, attention, tension)
- Outcome: Baseline locked (SHA-256 hash)

**Stage 4: Acknowledgment (Return)**
- Duration: 618ms transition
- Visual: Fade to dashboard
- Outcome: EffectLog: `USER.ONBOARDING_COMPLETE`

### 8.3 PhiBreathCycle

**Breath timing:**
- Wdech (inhale): 38.2% of cycle
- Pauza (hold): 23.6% of cycle
- Wydech (exhale): 38.2% of cycle

**Visual:** SVG circle expanding/contracting (no easing animation, discrete states only)

---

## 9. JITAI DECISION LOGGING (patternslab.work High-Risk)

### 9.1 Decision Log Structure

Every JITAI intervention is logged immutably (SHA-256 append-only chain).

**Minimum PCS: 0.980**

If PCS < 0.980:
1. Decision logged as `DISPUTED`
2. Compliance alert triggered
3. Manual review queued
4. No intervention executed

### 9.2 Outcome Attribution (Neutral Language Only)

**Allowed:** "Structural intervention recorded; tension shift: −2.3 points over 7 days."

**Forbidden:** "Treatment improved patient's anxiety by 23%."

**Pricing (patternslab.work):**
- Base: $5K/month
- Outcome add-on: +$1 per intervention (volume only, no causation)

---

## 10. IMPLEMENTATION CHECKLIST

- [ ] Typography: All sizes φⁿ × 16px (H1: 41.89px, Body: 16px, Small: 9.89px)
- [ ] Colors: Tier 0-4 luminance scaled by √φ (1.272)
- [ ] Li Gold accent (#C9A84C) used only for focus/critical
- [ ] Button radius: 6.5px; padding 1:φ ratio
- [ ] Modal opacity: 0.618; width: 610px max
- [ ] Layout: 61.8% / 38.2% splits, Fibonacci spacing
- [ ] Motion: 382–2618ms only, φ-keyframes (23.6%, 38.2%, 61.8%, 76.4%)
- [ ] Protocol Zero: 1618ms entry + intent + baseline + return
- [ ] JITAI logging: immutable SHA-256, PCS ≥ 0.980
- [ ] S11 compliance: zero forbidden terms
- [ ] WCAG 2.1 AA, prefers-reduced-motion, 44px touch targets

---

## 11. DO'S & DON'TS

✅ **DO:**
- Use JetBrains Mono exclusively
- Size all text as φⁿ × 16px
- Derive timing from 1618ms base
- Scale luminance by √φ
- Use 61.8% / 38.2% splits
- Keyframes at φ-percentages only
- Respect prefers-reduced-motion
- Log every JITAI decision (append-only)
- Use Li Gold for focus/accents only

❌ **DON'T:**
- Use other fonts or arbitrary weights
- Use pure black/white colors
- Use 300ms, 500ms, 750ms timings
- Use clamp(), min(), max() responsive
- Use box-shadows
- Use therapy/care language
- Skip PCS audit for high-risk
- Use outcome-based pricing claims
- Mix fonts or add weights

---

**END OF SILENCE-BRAND-BOOK-LITE.md v1.1**

**MATHEMATICAL RIGOR: MAXIMUM. APPROXIMATION: ZERO.**
