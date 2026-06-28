'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface PendingObject {
  id: string;
  input_text: string;
  input_source: 'text' | 'voice';
  input_audio_blob?: string; // Base64 encoded blob
  created_at: string;
  retryCount: number;
  lastAttempt?: string;
}

interface QueueState {
  queue: PendingObject[];
  isOnline: boolean;
  isSyncing: boolean;
  syncProgress: number; // 0-100
  lastSyncError?: string;
}

interface UseOfflineQueueOptions {
  maxRetries?: number;
  onSyncComplete?: (synced: PendingObject[]) => void;
  onSyncError?: (failed: PendingObject[], error: string) => void;
}

const STORAGE_KEY = 'patternlens_offline_queue';
const MAX_QUEUE_SIZE = 50;

// Convert Blob to base64 for storage
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Convert base64 back to Blob
function base64ToBlob(base64: string): Blob {
  const [header, data] = base64.split(',');
  const mimeMatch = header.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'audio/webm';
  const binary = atob(data);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return new Blob([array], { type: mime });
}

export function useOfflineQueue(options: UseOfflineQueueOptions = {}) {
  const { 
    maxRetries = 3,
    onSyncComplete,
    onSyncError,
  } = options;

  const [state, setState] = useState<QueueState>({
    queue: [],
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isSyncing: false,
    syncProgress: 0,
  });

  const syncingRef = useRef(false);

  // Load queue from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as PendingObject[];
        setState((prev) => ({ ...prev, queue: parsed }));
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error);
    }
  }, []);

  // Save queue to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.queue));
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }, [state.queue]);

  // Sync single item to server
  const syncItem = async (item: PendingObject): Promise<boolean> => {
    try {
      let audioUrl: string | undefined;

      // Upload audio if present
      if (item.input_audio_blob && item.input_source === 'voice') {
        const blob = base64ToBlob(item.input_audio_blob);
        const formData = new FormData();
        formData.append('audio', blob, `recording-${item.id}.webm`);

        const uploadResponse = await fetch('/api/voice/upload', {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          audioUrl = uploadData.url;
        }
      }

      // Create object
      const response = await fetch('/api/objects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input_text: item.input_text,
          input_source: item.input_source,
          input_audio_url: audioUrl,
        }),
      });

      return response.ok;
    } catch {
      return false;
    }
  };

  // Sync all pending items
  const syncQueue = useCallback(async () => {
    if (syncingRef.current || state.queue.length === 0 || !state.isOnline) {
      return;
    }

    syncingRef.current = true;
    setState((prev) => ({ ...prev, isSyncing: true, syncProgress: 0 }));

    const synced: PendingObject[] = [];
    const failed: PendingObject[] = [];
    const total = state.queue.length;

    for (let i = 0; i < state.queue.length; i++) {
      const item = state.queue[i];
      const success = await syncItem(item);

      if (success) {
        synced.push(item);
      } else {
        const updatedItem = {
          ...item,
          retryCount: item.retryCount + 1,
          lastAttempt: new Date().toISOString(),
        };

        if (updatedItem.retryCount < maxRetries) {
          failed.push(updatedItem);
        }
        // If max retries exceeded, item is dropped
      }

      setState((prev) => ({
        ...prev,
        syncProgress: Math.round(((i + 1) / total) * 100),
      }));
    }

    // Update queue with only failed items
    setState((prev) => ({
      ...prev,
      queue: failed,
      isSyncing: false,
      syncProgress: 100,
      lastSyncError: failed.length > 0 ? `${failed.length} items failed to sync` : undefined,
    }));

    syncingRef.current = false;

    if (synced.length > 0) {
      onSyncComplete?.(synced);
    }

    if (failed.length > 0) {
      onSyncError?.(failed, `${failed.length} items failed to sync`);
    }
  }, [state.queue, state.isOnline, maxRetries, onSyncComplete, onSyncError]);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setState((prev) => ({ ...prev, isOnline: true }));
      // Auto-sync when coming back online
      syncQueue();
    };

    const handleOffline = () => {
      setState((prev) => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncQueue]);

  // Add item to queue
  const addToQueue = useCallback(async (
    input_text: string,
    input_source: 'text' | 'voice',
    audioBlob?: Blob
  ): Promise<string> => {
    const id = `offline-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    
    let input_audio_blob: string | undefined;
    if (audioBlob) {
      input_audio_blob = await blobToBase64(audioBlob);
    }

    const item: PendingObject = {
      id,
      input_text,
      input_source,
      input_audio_blob,
      created_at: new Date().toISOString(),
      retryCount: 0,
    };

    setState((prev) => {
      // Enforce max queue size (drop oldest)
      let newQueue = [...prev.queue, item];
      if (newQueue.length > MAX_QUEUE_SIZE) {
        newQueue = newQueue.slice(-MAX_QUEUE_SIZE);
      }
      return { ...prev, queue: newQueue };
    });

    return id;
  }, []);

  // Remove item from queue
  const removeFromQueue = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      queue: prev.queue.filter((item) => item.id !== id),
    }));
  }, []);

  // Clear entire queue
  const clearQueue = useCallback(() => {
    setState((prev) => ({ ...prev, queue: [] }));
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Get queue size in bytes (approximate)
  const getQueueSize = useCallback((): number => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? new Blob([data]).size : 0;
    } catch {
      return 0;
    }
  }, []);

  return {
    ...state,
    addToQueue,
    removeFromQueue,
    clearQueue,
    syncQueue,
    getQueueSize,
    queueCount: state.queue.length,
  };
}
