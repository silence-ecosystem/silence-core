"use client";

import { useState, useCallback } from "react";
import { detectCrisis, type EmergencyResponse } from "@/lib/safety";

interface UseCrisisDetectionOptions {
  onResourcesShown?: (result: EmergencyResponse) => void;
}

interface UseCrisisDetectionReturn {
  /** Check text — PASSIVE mode, never blocks, may show resources */
  checkText: (text: string) => {
    /** PASSIVE: always false */
    shouldBlock: false;
    shouldShowBanner: boolean;
    result: EmergencyResponse;
  };
  /** Whether resources banner is visible */
  showResources: boolean;
  /** Last detection result */
  lastResult: EmergencyResponse | null;
  /** Reset state */
  reset: () => void;
}

/**
 * PASSIVE crisis detection hook (v5.0 INFORMED_ADULT_TOOL).
 * Hard keyword match only. Shows inline resource banner. Never blocks.
 */
export function useCrisisDetection(
  options: UseCrisisDetectionOptions = {}
): UseCrisisDetectionReturn {
  const { onResourcesShown } = options;
  const [showResources, setShowResources] = useState(false);
  const [lastResult, setLastResult] = useState<EmergencyResponse | null>(null);

  const checkText = useCallback(
    (text: string) => {
      const result = detectCrisis(text);
      setLastResult(result);

      if (result.showResources) {
        setShowResources(true);
        onResourcesShown?.(result);
        return {
          shouldBlock: false as const,
          shouldShowBanner: true,
          result,
        };
      }

      setShowResources(false);
      return {
        shouldBlock: false as const,
        shouldShowBanner: false,
        result,
      };
    },
    [onResourcesShown]
  );

  const reset = useCallback(() => {
    setShowResources(false);
    setLastResult(null);
  }, []);

  return {
    checkText,
    showResources,
    lastResult,
    reset,
  };
}

export default useCrisisDetection;
