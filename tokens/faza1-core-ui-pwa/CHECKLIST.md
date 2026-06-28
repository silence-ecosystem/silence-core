# Faza 1 — Core UI & PWA · Checklist

S11.COMMIT.ID: PATTERNLENS-P1-PWA-CORE-20260618-003

## Pliki do skopiowania

| Plik źródłowy (ten katalog) | Cel w projekcie |
|-----------------------------|-----------------|
| `globals.css`               | `apps/patternlens/src/app/globals.css` |
| `layout.tsx`                | `apps/patternlens/src/app/layout.tsx` |
| `manifest.json`             | `apps/patternlens/public/manifest.json` |
| `next.config.mjs`           | `apps/patternlens/next.config.mjs` |
| `tailwind.config.ts`        | `apps/patternlens/tailwind.config.ts` |
| `generate_icons.py`         | `apps/patternlens/scripts/generate_icons.py` |

## Sekwencja wdrożenia

### Krok 1 — Skopiuj pliki
```bash
cp globals.css       ../apps/patternlens/src/app/globals.css
cp layout.tsx        ../apps/patternlens/src/app/layout.tsx
cp manifest.json     ../apps/patternlens/public/manifest.json
cp next.config.mjs   ../apps/patternlens/next.config.mjs
cp tailwind.config.ts ../apps/patternlens/tailwind.config.ts
mkdir -p ../apps/patternlens/scripts
cp generate_icons.py ../apps/patternlens/scripts/
```

### Krok 2 — Wygeneruj ikony
```bash
cd apps/patternlens
pip install Pillow
python3 scripts/generate_icons.py
# → public/icons/icon-192.png
# → public/icons/icon-512.png
# → public/icons/icon-192-maskable.png
# → public/icons/icon-512-maskable.png
# → public/icons/apple-touch-icon.png
```

### Krok 3 — Splash screens (opcjonalne, ale Lighthouse P1)
```bash
npx pwa-asset-generator public/icons/icon-512.png public/icons \
  --background '#07070f' --splash-only --portrait-only
```

### Krok 4 — Placeholder screenshots (Lighthouse wymaga ≥1)
```bash
mkdir -p public/screenshots
# tymczasowo skopiuj dowolne 750x1334 PNG jako mobile-1.png i mobile-2.png
# docelowo: Playwright screenshots z prawdziwego UI
```

### Krok 5 — Build + walidacja
```bash
pnpm turbo run build --filter=patternlens
pnpm turbo run typecheck --filter=patternlens
pnpm turbo run lint --filter=patternlens
```

### Krok 6 — Lighthouse PWA audit
```bash
# Po uruchomieniu dev server:
pnpm dev --filter=patternlens
npx lighthouse http://localhost:3000 --only-categories=pwa --view
# Target: PWA score ≥ 90
```

## Definition of Done — Faza 1

- [ ] `globals.css` zawiera wszystkie tokeny φ (GOLDENSECOND, Fibonacci spacing, Safe Area)
- [ ] `layout.tsx` eksportuje `viewport` z `viewportFit: 'cover'`
- [ ] `manifest.json` valid JSON, ikony maskable 192+512 istnieją w `public/icons/`
- [ ] `next.config.mjs` ma security headers (X-Frame-Options, CSP, Permissions-Policy)
- [ ] Build passes: `turbo run build --filter=patternlens` ✅
- [ ] Typecheck passes: zero błędów ✅
- [ ] Lint: max 2 warnings (react-hooks/exhaustive-deps — istniejące) ✅
- [ ] Chrome DevTools → Application → Manifest: bez błędów
- [ ] iOS Safari: "Dodaj do ekranu głównego" → ikona widoczna, standalone mode

## Znane placeholdery (do uzupełnienia)

| Element | Status | Akcja |
|---------|--------|-------|
| `public/og-image.png` | ❌ brak | Figma export 1200×630 z Golden Silence |
| `public/icons/safari-pinned-tab.svg` | ❌ brak | Monochrome SVG logo |
| `public/screenshots/mobile-1.png` | ❌ placeholder | Playwright screenshot |
| `public/screenshots/mobile-2.png` | ❌ placeholder | Playwright screenshot |
| Apple splash screens | ❌ brak | pwa-asset-generator |
| Shortcut icons (96×96) | ❌ brak | generate_icons.py rozszerzyć |
