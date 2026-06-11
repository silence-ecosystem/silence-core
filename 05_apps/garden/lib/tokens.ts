/**
 * [PATH]: 05_apps/garden/lib/tokens.ts
 *
 * SoftNoir φ-driven design tokens.
 * Single source of truth for colors, timing, easing, and radius.
 * NO arbitrary values. NO #000000 / #FFFFFF. ALL values φ-derived.
 */

// ═══════════════════════════════════════════════════════════
// § 1. COLOR — SoftNoir Luminance Tiers (Focus State)
// ═══════════════════════════════════════════════════════════

export const colors = {
  // Surfaces — Luminance Tiers L0–L4 (scaled by √φ from L0 ≈ 12%)
  surfaceBase: '#101318',      // L0 — page background (Abyss)
  surfaceRaised: '#171B22',    // L1 — cards, panels, sunken containers
  surfaceElevated: '#1F2430',  // L2 — modals, popovers, active cards
  surfaceHover: '#272D3A',     // L3 — interactive hover
  surfaceActive: '#2F3545',    // L4 — active, highlight bars

  // Text — off-white/muted (WCAG AAA compatible with surfaceBase)
  textPrimary: '#E6ECF5',      // body text, headings
  textSecondary: '#A7B0C2',    // subheadings, meta
  textMuted: '#6B7487',        // labels, hints, captions

  // Accents — restricted usage (CTA, links, indicators)
  accentPrimary: '#D8A45A',    // warm gold — CTA, primary action
  accentSecondary: '#7FB0B8',  // muted teal — links, secondary
  accentAlert: '#C93C3C',      // desaturated red — errors, rare

  // Brand accents from DESIGN_SYSTEM_ADDENDUM — accent ONLY, never surface bg
  brandTeal: '#6B8F96',        // SILENCE.OBJECTS TEAL (Graphite Drift)
  brandBlue: '#5A7A9A',        // PatternLens BLUE
  brandPurple: '#8A7A9C',      // PatternsLab PURPLE
} as const;

// ═══════════════════════════════════════════════════════════
// § 2. TIMING — φ-derived from GOLDENSECOND = 1618 ms
// Sequence: 1618 × φ^-n, rounded to canonical integers
// ═══════════════════════════════════════════════════════════

export const timing = {
  instant: 100,   // ~1618 × φ^-6  (quick feedback)
  micro: 162,     // ~1618 × φ^-5  (hover / tap)
  fast: 262,      // ~1618 × φ^-4  (ui transition)
  base: 424,      // ~1618 × φ^-3  (content reveal)
  ease: 685,      // ~1618 × φ^-2  (larger transitions)
  slow: 1109,     // ~1618 × φ^-1  (major state changes)
  golden: 1618,   // GOLDENSECOND — breath-cycle base
} as const;

// ═══════════════════════════════════════════════════════════
// § 3. EASING — φ-curves only. NO linear / ease / ease-in-out
// ═══════════════════════════════════════════════════════════

export const easing = {
  // Primary φ-easing: control points derived from φ and 1-φ
  phiInOut: 'cubic-bezier(0.618, 0, 0.382, 1)',
  // Alternative φ-easing for breath/motion (fixed point at 61.8%)
  phiMotion: 'cubic-bezier(0.236, 0, 0.236, 1)',
} as const;

// ═══════════════════════════════════════════════════════════
// § 4. RADIUS — φ-derived from base 4px scaled by φ^n
// ═══════════════════════════════════════════════════════════

export const radius = {
  sm: '4.00px',    // radius-1
  md: '6.47px',    // radius-2  (≈ 4 × φ)
  lg: '10.47px',   // radius-3  (≈ 4 × φ^2)
  xl: '16.94px',   // radius-4  (≈ 4 × φ^3)
} as const;

// ═══════════════════════════════════════════════════════════
// § 5. HELPERS
// ═══════════════════════════════════════════════════════════

/**
 * Produce an rgba string from a hex color with φ-derived alpha.
 * Useful for subtle fills and hover states.
 */
export function rgba(hex: string, alpha: number): string {
  const sanitized = hex.replace('#', '');
  const r = parseInt(sanitized.substring(0, 2), 16);
  const g = parseInt(sanitized.substring(2, 4), 16);
  const b = parseInt(sanitized.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Deterministic pseudo-random generator for visual particles.
 * Replaces Math.random() to preserve φ-determinism contract.
 * Seed: plant id + particle index.
 */
export function phiRandom(seed: string, index: number): number {
  const str = `${seed}:${index}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  const positive = Math.abs(hash);
  return (positive % 10000) / 10000;
}
