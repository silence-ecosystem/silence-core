/**
 * [PATH]: 05_apps/patternlens/src/lib/jitai/database.ts
 *
 * IndexedDB schema for local-first JITAI capture via Dexie.
 * Deterministic IDs via SHA-256 — no crypto.randomUUID() in production paths.
 */

import Dexie, { type EntityTable } from 'dexie';
import { PHI, PHI_INV } from '@silence/sdk';
import type { SessionData, AttentionProfile } from './types';

interface SessionRecord extends SessionData {
  id: string;
  syncedAt: number | null;
  version: number;
}

interface ProfileRecord extends AttentionProfile {
  id: string;
  syncedAt: number | null;
  version: number;
}

class JITAIDatabase extends Dexie {
  sessions!: EntityTable<SessionRecord, 'id'>;
  profiles!: EntityTable<ProfileRecord, 'id'>;

  constructor() {
    super('jitai_db');
    this.version(1).stores({
      sessions: 'id, userId, startedAt, completedAt, syncedAt',
      profiles: 'id, userId, updatedAt, syncedAt',
    });
  }
}

export const jitaiDb = new JITAIDatabase();

async function sha256Hex(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const buffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function deterministicId(seed: string): Promise<string> {
  return (await sha256Hex(seed)).slice(0, 16);
}

export async function saveSession(data: SessionData): Promise<string> {
  const seed = `session:${data.userId ?? 'anon'}:${data.startedAt}:${data.durationMs}`;
  const id = await deterministicId(seed);
  const record: SessionRecord = {
    ...data,
    id,
    version: 1,
    syncedAt: null,
  };
  await jitaiDb.sessions.put(record);
  return id;
}

export async function getSessions(userId: string, limit = 50): Promise<SessionRecord[]> {
  return jitaiDb.sessions.where('userId').equals(userId).reverse().limit(limit).toArray();
}

export async function getProfile(userId: string): Promise<ProfileRecord | undefined> {
  return jitaiDb.profiles.where('userId').equals(userId).first();
}

export async function updateProfile(profile: AttentionProfile): Promise<void> {
  const existing = await getProfile(profile.userId);
  const seed = `profile:${profile.userId}:${profile.updatedAt}`;
  const id = await deterministicId(seed);
  const record: ProfileRecord = {
    ...profile,
    id: existing?.id ?? id,
    version: (existing?.version ?? 0) + 1,
    syncedAt: null,
  };
  await jitaiDb.profiles.put(record);
}

export async function computeProfileFromSessions(userId: string): Promise<AttentionProfile> {
  const sessions = await getSessions(userId, 100);
  const now = Date.now();

  if (sessions.length === 0) {
    return {
      userId,
      attentionStability: PHI_INV,
      distractionSensitivity: PHI_INV,
      sessionCompletionRate: 0,
      baselineParticleCount: 34,
      preferredRingSet: [8, 13, 21, 34, 55, 89],
      totalSessions: 0,
      lastSessionAt: now,
      createdAt: now,
      updatedAt: now,
    };
  }

  const completedSessions = sessions.filter((s) => s.completedAt);
  const completionRate = completedSessions.length / sessions.length;

  const completionTimes = completedSessions.map((s) => s.durationMs);
  const meanTime = completionTimes.reduce((sum, t) => sum + t, 0) / (completionTimes.length || 1);
  const variance = completionTimes.reduce((sum, t) => sum + (t - meanTime) ** 2, 0) / (completionTimes.length || 1);
  const stability = 1 - Math.min(variance / (meanTime * meanTime), 1);

  const totalTouches = sessions.reduce((sum, s) => sum + s.interactionEvents.length, 0);
  const avgTouchesPerSession = totalTouches / sessions.length;
  // Normalize against a φ-derived ceiling: 10 ≈ φ × φ² × π? Keep it simple: PHI * 10 ≈ 16.18
  const sensitivity = Math.min(avgTouchesPerSession / (10 * PHI), 1);

  const preferredCount = completedSessions.length > 0 ? 34 : 55;
  const existing = await getProfile(userId);

  return {
    userId,
    attentionStability: stability,
    distractionSensitivity: sensitivity,
    sessionCompletionRate: completionRate,
    baselineParticleCount: preferredCount,
    preferredRingSet: sensitivity > PHI_INV ? [8, 13, 21] : [8, 13, 21, 34, 55, 89],
    totalSessions: sessions.length,
    lastSessionAt: sessions[0].startedAt,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}
