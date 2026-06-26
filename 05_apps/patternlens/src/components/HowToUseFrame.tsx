"use client";

import { useState } from "react";
import { text, card } from "@/constants/design-system";

const STEPS = [
  { number: "01", title: "Opisz sytuacje", description: "Wprowadz doswiadczenie do analizy." },
  { number: "02", title: "Porownaj interpretacje", description: "System generuje dwie perspektywy (Lens A i B)." },
  { number: "03", title: "Wybierz konstrukcje", description: "Zdecyduj, ktora lepiej oddaje Twoja perspektywe." },
];

// Initialize from localStorage on client side
function getInitialDismissed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("silenceHowToUseHidden") === "true";
}

export function HowToUseFrame() {
  const [dismissed, setDismissed] = useState(getInitialDismissed);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("silenceHowToUseHidden", "true");
  };

  if (dismissed) return null;

  return (
    <div className={card.base + " mb-6"}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={text.h3}>Jak uzywac tego ekranu?</h3>
        <button onClick={handleDismiss} className="text-[var(--text-muted)] hover:text-[var(--text-secondary)]">✕</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STEPS.map((step) => (
          <div key={step.number} className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--primary-muted)] flex items-center justify-center">
              <span className="text-xs font-semibold text-[var(--primary)]">{step.number}</span>
            </div>
            <div>
              <div className="font-medium text-[var(--text-primary)] text-sm mb-1">{step.title}</div>
              <div className={text.muted}>{step.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
