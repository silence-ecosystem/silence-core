"use client";

import { text } from "@/constants/design-system";
import { MESSAGES, getProgressMessage, getCountDisplay } from "@/lib/messages";

interface LimitBannerProps {
  current: number;
  max: number;
  onUpgrade?: () => void;
}

export function LimitBanner({ current, max, onUpgrade }: LimitBannerProps) {
  if (current < max - 1) return null;
  const isAtLimit = current >= max;
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className={"rounded-lg p-4 mb-6 border " + (isAtLimit ? "bg-[rgba(248,113,113,0.1)] border-[var(--danger)]" : "bg-[rgba(251,191,36,0.1)] border-[var(--warning)]")}>
      <div className="flex items-center justify-between mb-2">
        <span className={"font-medium " + (isAtLimit ? "text-[var(--danger)]" : "text-[var(--warning)]")}>
          {isAtLimit ? MESSAGES.LIMITS.REACHED.replace(' (7/7)', '') : MESSAGES.LIMITS.APPROACHING}
        </span>
        <span className={text.muted}>{getCountDisplay(current, max)}</span>
      </div>
      <div className="h-1.5 bg-[var(--bg-active)] rounded-full overflow-hidden mb-3">
        <div className={"h-full rounded-full transition-all " + (isAtLimit ? "bg-[var(--danger)]" : "bg-[var(--warning)]")} style={{ width: percentage + "%" }} />
      </div>
      {isAtLimit ? (
        <div className="flex items-center justify-between">
          <p className={text.muted}>{MESSAGES.LIMITS.UPGRADE_CTA}</p>
          <button onClick={onUpgrade} className="px-4 py-2 min-h-[44px] bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-medium rounded-md transition-colors">PRO - 49 PLN/mies.</button>
        </div>
      ) : (
        <p className={text.muted}>{getProgressMessage(current, max)}</p>
      )}
    </div>
  );
}
