"use client";

import { useState } from "react";
import { getRegionalHelplines, getPrimaryHelpline, IASP_LINK, type RegionHelplines } from "@/lib/region";

interface EmergencyBannerProps {
  onDismiss?: () => void;
  onShowMore?: () => void;
}

// Initialize region data on client side
function getInitialRegionData(): RegionHelplines | null {
  if (typeof window === "undefined") return null;
  return getRegionalHelplines();
}

export function EmergencyBanner({ onDismiss, onShowMore }: EmergencyBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [regionData] = useState<RegionHelplines | null>(getInitialRegionData);

  if (dismissed || !regionData) return null;

  const primary = getPrimaryHelpline();

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div className="bg-[rgba(251,191,36,0.12)] border border-[rgba(251,191,36,0.3)] rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[rgba(251,191,36,0.15)] flex items-center justify-center">
          <svg
            className="w-4 h-4 text-[#fbbf24]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-[#fbbf24] font-medium mb-1">
            Zauważyliśmy trudne treści
          </p>
          <p className="text-xs text-[#d4a520] leading-relaxed mb-2">
            Pamiętaj, że w trudnych chwilach możesz zadzwonić:
          </p>

          {/* Regional Helpline */}
          <a
            href={`tel:${primary.number.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-2 px-3 py-2 bg-[rgba(251,191,36,0.1)] rounded-md text-[#fbbf24] hover:bg-[rgba(251,191,36,0.2)] transition-colors min-h-[44px]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
            </svg>
            <span className="font-semibold">{primary.number}</span>
            <span className="text-xs text-[#d4a520]">({primary.name})</span>
          </a>

          {/* Emergency + More */}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="text-xs text-[#d4a520]">
              Pogotowie: <span className="font-semibold">{regionData.emergencyNumber}</span>
            </span>
            {onShowMore ? (
              <button
                onClick={onShowMore}
                className="inline-flex items-center gap-1 text-xs text-[#fbbf24] hover:text-[#f59e0b] font-medium transition-colors"
              >
                Więcej zasobów
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <a
                href={IASP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#fbbf24] hover:text-[#f59e0b] font-medium transition-colors"
              >
                Międzynarodowe zasoby
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1.5 text-[#d4a520] hover:text-[#fbbf24] hover:bg-[rgba(251,191,36,0.1)] rounded transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Zamknij"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
