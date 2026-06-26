"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface UseMediaRecorderOptions {
  onRecordingComplete: (blob: Blob) => void;
  maxDuration?: number; // seconds
  onMaxDurationReached?: () => void;
  mimeType?: string;
}

interface UseMediaRecorderReturn {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  error: Error | null;
}

export function useMediaRecorder({
  onRecordingComplete,
  maxDuration = 120,
  onMaxDurationReached,
  mimeType = "audio/webm",
}: UseMediaRecorderOptions): UseMediaRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const maxDurationReachedRef = useRef(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const stopRecordingInternal = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      chunksRef.current = [];
      maxDurationReachedRef.current = false;

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });
      streamRef.current = stream;

      // Determine supported mime type
      const supportedMimeType = MediaRecorder.isTypeSupported(mimeType)
        ? mimeType
        : MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : "audio/webm";

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: supportedMimeType,
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: supportedMimeType });
        onRecordingComplete(blob);

        // Cleanup
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        // Call max duration callback if needed
        if (maxDurationReachedRef.current) {
          onMaxDurationReached?.();
        }
      };

      // Start recording
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setIsPaused(false);
      setDuration(0);

      // Start timer with max duration check
      let currentDuration = 0;
      timerRef.current = setInterval(() => {
        currentDuration += 1;
        setDuration(currentDuration);

        // Check max duration inside timer callback
        if (currentDuration >= maxDuration) {
          maxDurationReachedRef.current = true;
          if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsPaused(false);
          }
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
        }
      }, 1000);
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error("Failed to start recording");
      setError(errorObj);
      console.error("Recording error:", errorObj);
    }
  }, [mimeType, onRecordingComplete, maxDuration, onMaxDurationReached]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRecording, isPaused]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);

      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
  }, [isRecording, isPaused]);

  return {
    isRecording,
    isPaused,
    duration,
    startRecording,
    stopRecording: stopRecordingInternal,
    pauseRecording,
    resumeRecording,
    error,
  };
}
