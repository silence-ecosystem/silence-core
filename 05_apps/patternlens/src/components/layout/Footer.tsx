import { cn, layout, text } from "@/constants/design-system";
import { CRISIS_RESOURCES } from "@/constants";
import { AIDisclosureBadge } from "@/components/ui";

export function Footer() {
  return (
    <footer className={layout.footer}>
      {/* DIR-07: EU AI Act Art. 50 — AI disclosure (required for limited-risk AI systems) */}
      <AIDisclosureBadge
        variant="footer"
        disclosureText="PatternLens uses AI to identify structural behavioral patterns. AI-generated observations are not personal assessments."
        className="mb-2 -mx-6 -mt-4 rounded-none"
      />
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className={text.muted}>Zasoby kryzysowe:</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-400"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
        <span className="text-sm text-zinc-400 font-medium">{CRISIS_RESOURCES.primary.number}</span>
        <span className={text.muted}>(Telefon Zaufania)</span>
        <span className="text-zinc-800">|</span>
        <span className="text-sm text-zinc-400 font-medium">{CRISIS_RESOURCES.emergency.number}</span>
        <span className={text.muted}>(Ratunkowy)</span>
      </div>
      <p className={cn(text.muted, "max-w-xl mx-auto")}>
        SILENCE.OBJECTS to narzędzie do analizy strukturalnej, nie substytut profesjonalnej opieki.
      </p>
    </footer>
  );
}
