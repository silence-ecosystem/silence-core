/**
 * [PATH]: 05_apps/patternlens/src/lib/jitai/sessionCapture.ts
 *
 * High-level API for local-first session capture and profile management.
 */

import { saveSession, computeProfileFromSessions, updateProfile, getProfile } from './database';
import type { SessionData, AttentionProfile } from './types';

export type { SessionData, AttentionProfile };

export async function captureSessionData(data: SessionData): Promise<void> {
  await saveSession(data);
  if (data.userId) {
    const profile = await computeProfileFromSessions(data.userId);
    await updateProfile(profile);
  }
}

export async function getAttentionProfile(userId?: string): Promise<AttentionProfile | null> {
  const resolved = userId ?? 'anon';
  const profile = await getProfile(resolved);
  return profile ?? null;
}
