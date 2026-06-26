"use client";

import { useState, useCallback } from "react";

interface UseTranscriptionOptions {
  onSuccess?: (text: string) => void;
  onError?: (error: Error) => void;
  language?: string;
}

interface UseTranscriptionReturn {
  transcribe: (audioBlob: Blob) => Promise<string | null>;
  isTranscribing: boolean;
  error: Error | null;
  transcript: string | null;
}

export function useTranscription({
  onSuccess,
  onError,
  language = 'en',
}: UseTranscriptionOptions = {}): UseTranscriptionReturn {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);

  const transcribe = useCallback(
    async (audioBlob: Blob): Promise<string | null> => {
      setIsTranscribing(true);
      setError(null);

      try {
        // Create form data with audio file
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");
        formData.append("language", language);

        // Send to transcription API
        const response = await fetch("/api/voice/transcribe", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Transcription failed: ${response.status}`);
        }

        const data = await response.json();
        const text = data.text || "";

        setTranscript(text);
        onSuccess?.(text);
        return text;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Transcription failed");
        setError(error);
        onError?.(error);
        return null;
      } finally {
        setIsTranscribing(false);
      }
    },
    [onSuccess, onError, language]
  );

  return {
    transcribe,
    isTranscribing,
    error,
    transcript,
  };
}
