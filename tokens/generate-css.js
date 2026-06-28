/**
 * generate-css.js
 * Reads compiled token modules from dist/ and writes css/tokens.css
 * with CSS custom properties for all design tokens.
 */

const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');
const cssPath = path.join(__dirname, '..', 'css');

// Load compiled modules
const { spacing } = require(path.join(distPath, 'spacing.js'));
const { fontSize, lineHeight, fontFamily } = require(path.join(distPath, 'typography.js'));
const { duration, breathCycle, easing } = require(path.join(distPath, 'timing.js'));
const { colors } = require(path.join(distPath, 'colors.js'));
const { breakpoints, goldenSplit } = require(path.join(distPath, 'breakpoints.js'));

const lines = [
  '/* ============================================',
  ' * @silence/phi-tokens — CSS Custom Properties',
  ' * Generated automatically — do not edit',
  ' * ============================================ */',
  '',
  ':root {',
  '  /* Spacing — φ-scaled Fibonacci (px) */',
];

// Spacing
for (const [key, value] of Object.entries(spacing)) {
  lines.push(`  --phi-space-${key}: ${value}px;`);
}

lines.push('');
lines.push('  /* Font Sizes — modular scale (px) */');
for (const [key, value] of Object.entries(fontSize)) {
  lines.push(`  --phi-font-size-${key}: ${value}px;`);
}

lines.push('');
lines.push('  /* Line Heights */');
for (const [key, value] of Object.entries(lineHeight)) {
  lines.push(`  --phi-line-height-${key}: ${value};`);
}

lines.push('');
lines.push('  /* Font Families */');
for (const [key, value] of Object.entries(fontFamily)) {
  lines.push(`  --phi-font-family-${key}: ${value};`);
}

lines.push('');
lines.push('  /* Animation Durations — Fibonacci (ms) */');
for (const [key, value] of Object.entries(duration)) {
  lines.push(`  --phi-duration-${key}: ${value}ms;`);
}

lines.push('');
lines.push('  /* Breath Cycle Timings (ms) */');
for (const [key, value] of Object.entries(breathCycle)) {
  lines.push(`  --phi-breath-${key}: ${value}ms;`);
}

lines.push('');
lines.push('  /* Easing Functions */');
for (const [key, value] of Object.entries(easing)) {
  lines.push(`  --phi-easing-${key}: ${value};`);
}

lines.push('');
lines.push('  /* Colors — Warm Obsidian Palette */');
for (const [key, value] of Object.entries(colors)) {
  // camelCase → kebab-case
  const kebab = key.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`);
  lines.push(`  --phi-color-${kebab}: ${value};`);
}

lines.push('');
lines.push('  /* Breakpoints (px) */');
for (const [key, value] of Object.entries(breakpoints)) {
  lines.push(`  --phi-breakpoint-${key}: ${value}px;`);
}

lines.push('');
lines.push('  /* Golden Split (%) */');
lines.push(`  --phi-split-major: ${goldenSplit.major}%;`);
lines.push(`  --phi-split-minor: ${goldenSplit.minor}%;`);

lines.push('}');
lines.push('');

if (!fs.existsSync(cssPath)) {
  fs.mkdirSync(cssPath, { recursive: true });
}

fs.writeFileSync(path.join(cssPath, 'tokens.css'), lines.join('\n'), 'utf-8');
console.log('✓ Generated css/tokens.css');
