/**
 * [PATH]: 05_apps/garden/hooks/useEffectLog.ts
 *
 * EffectLog integration for governance event recording.
 * Persists entries to IndexedDB with localStorage fallback.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { phiRandom } from '@/lib/tokens';
import { EffectLog, EffectLogEntry } from '@silence/sdk';

const DB_NAME = 'silence-effectlog-db';
const DB_VERSION = 1;
const STORE_NAME = 'entries';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

async function saveEntries(entries: readonly EffectLogEntry[]): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    for (const entry of entries) {
      store.put(entry);
    }
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    // Fallback to localStorage
    localStorage.setItem('silence-effectlog-fallback', JSON.stringify(entries));
  }
}

async function loadEntries(): Promise<EffectLogEntry[]> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    const entries = await new Promise<EffectLogEntry[]>((resolve, reject) => {
      req.onsuccess = () => resolve(req.result as EffectLogEntry[]);
      req.onerror = () => reject(req.error);
    });
    db.close();
    return entries;
  } catch {
    const fallback = localStorage.getItem('silence-effectlog-fallback');
    if (fallback) {
      try {
        return JSON.parse(fallback) as EffectLogEntry[];
      } catch {
        return [];
      }
    }
    return [];
  }
}

export function useEffectLog() {
  const [ready, setReady] = useState(false);
  const logRef = useRef<EffectLog | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setReady(true);
      return;
    }

    const init = async () => {
      const log = new EffectLog({ validateChain: true });
      const stored = await loadEntries();
      if (stored.length > 0) {
        log.loadFromJSON(JSON.stringify(stored));
      }
      logRef.current = log;
      setReady(true);
    };

    init();
  }, []);

  const append = useCallback(
    async (
      eventType: EffectLogEntry['eventType'],
      actor: string,
      status: EffectLogEntry['status'],
      change: string,
      rationale?: string
    ): Promise<EffectLogEntry | null> => {
      if (!logRef.current) return null;

      const id = `EL-${Date.now()}-${Math.floor(phiRandom(actor + change, Date.now()) * 1e6).toString(36)}`;
      const timestamp = new Date().toISOString();
      const prevHash = logRef.current.getLastHash();

      const entry = await logRef.current.append({
        id,
        timestamp,
        eventType,
        actor,
        prevHash,
        status,
        change,
        rationale,
      });

      await saveEntries(logRef.current.getEntries());
      return entry;
    },
    []
  );

  const getEntries = useCallback((): readonly EffectLogEntry[] => {
    return logRef.current?.getEntries() ?? [];
  }, []);

  const validate = useCallback((): boolean => {
    return logRef.current?.validate() ?? false;
  }, []);

  return { ready, append, getEntries, validate };
}
