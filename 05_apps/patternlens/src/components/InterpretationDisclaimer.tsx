// src/components/InterpretationDisclaimer.tsx
"use client";

import { text } from "@/constants/design-system";
import { DISCLAIMERS } from "@/lib/messages";

interface InterpretationDisclaimerProps {
  variant?: "inline" | "banner";
}

export function InterpretationDisclaimer({ variant = "inline" }: InterpretationDisclaimerProps) {
  if (variant === "banner") {
    return (
      <div className="px-4 py-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] mb-4">
        <p className={text.muted}>
          {DISCLAIMERS.FULL_INTERPRETATION}
        </p>
      </div>
    );
  }

  return (
    <p className={`${text.muted} italic`}>
      {DISCLAIMERS.NOT_THERAPY}
    </p>
  );
}
