/**
 * [PATH]: 05_apps/silence-objects/components/SafetyHeader.tsx
 *
 * Sticky safety header shown on every screen.
 */

export function SafetyHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-red-900/30 bg-black/90 text-red-500">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-2 text-xs font-mono uppercase tracking-wide">
        <span>System konstrukcyjny. Nie terapia. Nie diagnoza.</span>
        <span className="hidden sm:inline">Kryzys: 116 123 / 112</span>
      </div>
    </header>
  );
}
