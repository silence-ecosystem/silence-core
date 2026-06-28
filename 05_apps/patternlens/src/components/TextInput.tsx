"use client";

import { useState, useCallback } from "react";
import { MIN_TEXT_LENGTH, MAX_TEXT_LENGTH } from "@/constants";
import { cn, input, button, text } from "@/constants/design-system";
import { MESSAGES } from "@/lib/messages";
import { useCrisisDetection } from "@/hooks/useCrisisDetection";
import { CrisisModal } from "@/components/safety/CrisisModal";
import { SafetyBanner } from "@/components/safety/SafetyBanner";

interface TextInputProps {
  onSubmit: (text: string) => void;
  loading?: boolean;
  isInactive?: boolean;
  onCancel?: () => void;
}

export function TextInput({ onSubmit, loading = false, isInactive = false, onCancel }: TextInputProps) {
  const [value, setValue] = useState("");
  const [showCrisisModal, setShowCrisisModal] = useState(false);

  const { checkText, showResources, reset } = useCrisisDetection({
    onResourcesShown: () => {
      setShowCrisisModal(true);
    },
  });

  const charCount = value.length;
  const isValid = charCount >= MIN_TEXT_LENGTH && charCount <= MAX_TEXT_LENGTH;

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || loading || isInactive) return;

    // Check for crisis content before submission
    const { shouldBlock } = checkText(value);
    if (shouldBlock) {
      return; // Modal will be shown via onBlock callback
    }

    onSubmit(value);
  }, [value, isValid, loading, isInactive, checkText, onSubmit]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    // Reset crisis state when user edits
    if (showResources) {
      reset();
    }
  };

  return (
    <>
      {/* Safety Banner - shows when soft crisis keywords detected */}
      {showResources && !showCrisisModal && (
        <SafetyBanner
          variant="warning"
          message="Content flagged — crisis resources are available if needed."
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={value}
            onChange={handleTextChange}
            placeholder="Describe the pattern, behavior, or situation you want to analyze..."
            disabled={isInactive || loading}
            rows={4}
            className={cn(input.textarea, "min-h-[120px] sm:min-h-[140px]", (isInactive || loading) && "opacity-50 cursor-not-allowed")}
          />
          <div className="flex justify-between mt-2 text-xs">
            <span className={charCount < MIN_TEXT_LENGTH ? text.muted : text.secondary}>
              {charCount < MIN_TEXT_LENGTH ? `Minimum ${MIN_TEXT_LENGTH} znaków` : `${charCount} / ${MAX_TEXT_LENGTH}`}
            </span>
            {charCount > MAX_TEXT_LENGTH && <span className="text-[var(--danger)]">{MESSAGES.VALIDATION.TOO_LONG}</span>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="submit" disabled={!isValid || loading || isInactive} className={cn(button.primary, "disabled:opacity-50 disabled:cursor-not-allowed")}>
            {loading ? MESSAGES.PROCESSING.CONSTRUCTION : "Construct Interpretation"}
          </button>
          {onCancel && <button type="button" onClick={onCancel} className={button.ghost}>Cancel</button>}
        </div>
      </form>

      {/* Crisis Modal */}
      <CrisisModal
        isOpen={showCrisisModal}
        onClose={() => setShowCrisisModal(false)}
        level="critical"
        resources={[]}
      />
    </>
  );
}
