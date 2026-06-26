// src/hooks/useCrisisDetection.ts
// Example documentation file - see actual implementation in src/hooks/useCrisisDetection.ts
'use client';

import { useState, useCallback } from 'react';
import { detectCrisis, type CrisisDetectionResult } from '@/lib/safety/detector';

interface UseCrisisDetectionOptions {
  onCrisisDetected?: (result: CrisisDetectionResult) => void;
  onBlock?: (result: CrisisDetectionResult) => void;
}

interface UseCrisisDetectionReturn {
  checkText: (text: string) => { shouldBlock: boolean; result: CrisisDetectionResult };
  lastResult: CrisisDetectionResult | null;
  isBlocked: boolean;
  showResources: boolean;
  reset: () => void;
}

/**
 * React hook for crisis detection
 *
 * Usage:
 * ```tsx
 * const { checkText, isBlocked, showResources } = useCrisisDetection({
 *   onBlock: (result) => setShowCrisisModal(true)
 * });
 *
 * const handleSubmit = () => {
 *   const { shouldBlock } = checkText(inputText);
 *   if (shouldBlock) return;
 *   // proceed with submission
 * };
 * ```
 */
export function useCrisisDetection(
  options: UseCrisisDetectionOptions = {}
): UseCrisisDetectionReturn {
  const [lastResult, setLastResult] = useState<CrisisDetectionResult | null>(null);

  const checkText = useCallback((text: string) => {
    const result = detectCrisis(text);
    setLastResult(result);

    if (result.blocked && options.onBlock) {
      options.onBlock(result);
    }

    if (result.riskLevel !== 'none' && options.onCrisisDetected) {
      options.onCrisisDetected(result);
    }

    return {
      shouldBlock: result.blocked,
      result,
    };
  }, [options]);

  const reset = useCallback(() => {
    setLastResult(null);
  }, []);

  return {
    checkText,
    lastResult,
    isBlocked: lastResult?.blocked ?? false,
    showResources: lastResult?.showBanner ?? false,
    reset,
  };
}

export default useCrisisDetection;
