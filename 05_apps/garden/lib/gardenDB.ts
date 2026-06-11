/**
 * [PATH]: 05_apps/garden/lib/gardenDB.ts
 *
 * IndexedDB persistence layer for garden state.
 * Fallback to localStorage if IndexedDB unavailable.
 */

import type { GardenState } from './gardenTypes';

const DB_NAME = 'silence-garden-db';
const DB_VERSION = 1;
const STORE_NAME = 'garden-state';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

export async function saveGardenState(state: GardenState): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(state, 'current');
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    // Fallback to localStorage
    localStorage.setItem('silence-garden-state-v1', JSON.stringify(state));
  }
}

export async function loadGardenState(): Promise<GardenState | null> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get('current');
    const result = await new Promise<GardenState | undefined>((resolve, reject) => {
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    db.close();
    return result ?? null;
  } catch {
    // Fallback to localStorage
    try {
      const raw = localStorage.getItem('silence-garden-state-v1');
      if (!raw) return null;
      return JSON.parse(raw) as GardenState;
    } catch {
      return null;
    }
  }
}
