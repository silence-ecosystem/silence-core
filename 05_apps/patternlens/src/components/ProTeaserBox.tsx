"use client";

import { text } from "@/constants/design-system";

interface ProTeaserBoxProps {
  feature: string;
  description: string;
  onLearnMore?: () => void;
}

export function ProTeaserBox({ feature, description, onLearnMore }: ProTeaserBoxProps) {
  return (
    <div className="p-4 rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg-elevated)]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[var(--primary-muted)] flex items-center justify-center flex-shrink-0">
          <span className="text-[var(--primary)]">⚡</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[var(--text-primary)]">{feature}</span>
            <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase rounded bg-[var(--primary-muted)] text-[var(--primary)]">PRO</span>
          </div>
          <div className={text.muted}>{description}</div>
        </div>
        {onLearnMore && (
          <button onClick={onLearnMore} className="px-4 py-2 text-sm text-[var(--primary)] hover:bg-[var(--primary-muted)] rounded-md transition-colors flex-shrink-0">Wiecej</button>
        )}
      </div>
    </div>
  );
}
