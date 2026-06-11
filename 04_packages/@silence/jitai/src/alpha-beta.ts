/**
 * [PATH]: 04_packages/@silence/jitai/src/alpha-beta.ts
 *
 * Alpha-beta filter for JITAI signal suppression.
 * Prevents signal fatigue by enforcing cooldowns and global suppression windows.
 *
 * Alpha (cooldown): per-rule minimum interval between repeats.
 * Beta (suppression): global quiet period after any signal delivery.
 */

import { JitaiSignal } from './types';

export interface AlphaBetaState {
  /** Last emission timestamp per ruleId */
  readonly lastEmitted: ReadonlyMap<string, number>;
  /** Last global signal timestamp */
  readonly lastGlobalSignal: number;
}

export class AlphaBetaFilter {
  private lastEmitted = new Map<string, number>();
  private lastGlobalSignal = 0;
  private readonly betaWindowMs: number;

  constructor(betaWindowMs: number = 600_000) {
    // Default beta: 10 minutes global suppression
    this.betaWindowMs = betaWindowMs;
  }

  /**
   * Check if a signal is allowed through the filter at given timestamp.
   */
  allow(signal: JitaiSignal, now: number): boolean {
    // Beta check: global suppression window
    if (now - this.lastGlobalSignal < this.betaWindowMs) {
      return false;
    }

    // Alpha check: per-rule cooldown
    const lastRuleEmit = this.lastEmitted.get(signal.ruleId) ?? 0;
    if (now - lastRuleEmit < signal.cooldownMs) {
      return false;
    }

    return true;
  }

  /**
   * Record that a signal was emitted. Must be called after allow() returns true.
   */
  record(signal: JitaiSignal, now: number): void {
    this.lastEmitted.set(signal.ruleId, now);
    this.lastGlobalSignal = now;
  }

  /**
   * Get current filter state (for serialization / debugging).
   */
  getState(): AlphaBetaState {
    return {
      lastEmitted: new Map(this.lastEmitted),
      lastGlobalSignal: this.lastGlobalSignal,
    };
  }

  /**
   * Reset filter state.
   */
  reset(): void {
    this.lastEmitted.clear();
    this.lastGlobalSignal = 0;
  }
}
