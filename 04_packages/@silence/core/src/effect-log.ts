/**
 * [PATH]: 04_packages/@silence/core/src/effect-log.ts
 *
 * EffectLog — append-only registry for governance decisions.
 * Open-Core implementation: no EE dependencies.
 */

import { sha256, computeEntryHash, verifyChainContinuity } from './hash-chain';

export interface EffectLogEntry {
  readonly id: string;
  readonly timestamp: string;
  readonly eventType: 'DECISION' | 'REMEDIATION' | 'RELEASE' | 'AUDIT' | 'EXCEPTION';
  readonly actor: string;
  readonly prevHash: string;
  readonly entryHash: string;
  readonly status: 'PASS' | 'FAIL' | 'PENDING';
  readonly change: string;
  readonly rationale?: string;
}

export interface EffectLogConfig {
  readonly initialHash?: string;
  readonly validateChain?: boolean;
}

export class EffectLog {
  private entries: EffectLogEntry[] = [];
  private readonly initialHash: string;
  private readonly validateChain: boolean;

  constructor(config: EffectLogConfig = {}) {
    this.initialHash = config.initialHash ?? '0'.repeat(64);
    this.validateChain = config.validateChain ?? true;
  }

  /**
   * Append a new entry. Validates chain continuity before insertion.
   */
  async append(entry: Omit<EffectLogEntry, 'entryHash'>): Promise<EffectLogEntry> {
    const prevHash = this.getLastHash();

    if (this.validateChain && entry.prevHash !== prevHash) {
      throw new Error(
        `CHAIN_BREAK: expected prevHash=${prevHash}, got ${entry.prevHash}`
      );
    }

    const entryHash = await computeEntryHash(
      entry.id,
      entry.timestamp,
      entry.eventType,
      entry.actor,
      entry.prevHash,
      entry.change
    );

    const fullEntry: EffectLogEntry = { ...entry, entryHash };
    this.entries.push(fullEntry);
    return fullEntry;
  }

  /**
   * Get all entries (immutable snapshot).
   */
  getEntries(): readonly EffectLogEntry[] {
    return this.entries;
  }

  /**
   * Get the last entry hash, or initial hash if empty.
   */
  getLastHash(): string {
    if (this.entries.length === 0) {
      return this.initialHash;
    }
    return this.entries[this.entries.length - 1].entryHash;
  }

  /**
   * Validate entire chain continuity.
   */
  validate(): boolean {
    for (let i = 1; i < this.entries.length; i++) {
      if (!verifyChainContinuity(this.entries[i - 1].entryHash, this.entries[i].prevHash)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Serialize to JSON string (deterministic order).
   */
  toJSON(): string {
    return JSON.stringify(this.entries, null, 2);
  }

  /**
   * Load from JSON array.
   */
  loadFromJSON(json: string): void {
    const parsed = JSON.parse(json) as EffectLogEntry[];
    this.entries = parsed;
  }
}
