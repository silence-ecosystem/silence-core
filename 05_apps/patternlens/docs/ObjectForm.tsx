// src/components/objects/ObjectForm.tsx
// Example documentation file - see actual implementation in src/components/TextInput.tsx
'use client';

import { useState, useCallback } from 'react';
import { useCrisisDetection } from '@/hooks/useCrisisDetection';
import { CrisisModal } from '@/components/safety/CrisisModal';
import { SafetyBanner } from '@/components/safety/SafetyBanner';

interface ObjectFormProps {
  onSubmit: (text: string) => Promise<void>;
  isLoading?: boolean;
}

export function ObjectForm({ onSubmit, isLoading = false }: ObjectFormProps) {
  const [text, setText] = useState('');
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [crisisMessage, setCrisisMessage] = useState('');

  const { checkText, showResources, reset } = useCrisisDetection({
    onBlock: (result) => {
      setCrisisMessage(result.message);
      setShowCrisisModal(true);
    },
  });

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim() || text.length < 50) {
      return;
    }

    // Check for crisis content before submission
    const result = checkText(text);

    if (result.shouldBlock) {
      // Modal will be shown via onBlock callback
      return;
    }

    // Proceed with submission
    await onSubmit(text);
    setText('');
    reset();
  }, [text, checkText, onSubmit, reset]);

  const handleEditInput = useCallback(() => {
    setShowCrisisModal(false);
    // Focus textarea
    const textarea = document.getElementById('object-input');
    textarea?.focus();
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowCrisisModal(false);
  }, []);

  const charCount = text.length;
  const isValidLength = charCount >= 50 && charCount <= 5000;

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Safety Banner - shows when resources should be displayed but not blocked */}
        {showResources && !showCrisisModal && (
          <SafetyBanner
            variant="warning"
            message="If you are experiencing distress, crisis resources are available."
          />
        )}

        {/* Input */}
        <div>
          <label
            htmlFor="object-input"
            className="block text-sm font-medium text-zinc-300 mb-2"
          >
            Describe the situation or experience
          </label>
          <textarea
            id="object-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Describe a specific situation, interaction, or experience you want to analyze. Be as detailed as you can about what happened, when, and who was involved..."
            className="w-full h-48 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={isLoading}
            minLength={50}
            maxLength={5000}
          />
          <div className="flex justify-between mt-2">
            <span className={`text-sm ${charCount < 50 ? 'text-amber-400' : 'text-zinc-500'}`}>
              {charCount < 50 ? `${50 - charCount} more characters needed` : ''}
            </span>
            <span className={`text-sm ${charCount > 5000 ? 'text-red-400' : 'text-zinc-500'}`}>
              {charCount}/5000
            </span>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!isValidLength || isLoading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors min-h-[48px] flex items-center justify-center"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12" cy="12" r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Generating interpretation...
            </span>
          ) : (
            'Create Object'
          )}
        </button>

        {/* Help text */}
        <p className="text-zinc-500 text-xs text-center">
          Interpretations are structural hypotheses, not truth about you.
        </p>
      </form>

      {/* Crisis Modal */}
      <CrisisModal
        isOpen={showCrisisModal}
        onClose={handleCloseModal}
        level="critical"
        resources={[]}
      />
    </>
  );
}

export default ObjectForm;
