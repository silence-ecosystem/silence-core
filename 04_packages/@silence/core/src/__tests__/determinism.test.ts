/**
 * [PATH]: 04_packages/@silence/core/src/__tests__/determinism.test.ts
 *
 * Determinism contract for @silence/core hash-chain and effect-log.
 * Validates that for identical inputs, outputs are bitwise-identical
 * across repeated executions (single-thread, isolated).
 */

import { describe, it, expect } from "vitest";
import { sha256, computeEntryHash, verifyChainContinuity } from "../hash-chain";
import { EffectLog } from "../effect-log";

describe("determinism — hash-chain", () => {
  it("sha256 returns identical hex for identical input across 100 runs", async () => {
    const input = "SILENCE.DETERMINISTIC.CORE";
    const first = await sha256(input);
    expect(first).toHaveLength(64);

    for (let i = 0; i < 100; i++) {
      const h = await sha256(input);
      expect(h).toBe(first);
    }
  });

  it("computeEntryHash returns identical digest for identical fields", async () => {
    const h1 = await computeEntryHash(
      "entry-001",
      "2026-06-11T10:00:00.000Z",
      "DECISION",
      "core",
      "0".repeat(64),
      "init"
    );
    const h2 = await computeEntryHash(
      "entry-001",
      "2026-06-11T10:00:00.000Z",
      "DECISION",
      "core",
      "0".repeat(64),
      "init"
    );
    expect(h1).toBe(h2);
    expect(h1).toHaveLength(64);
  });

  it("verifyChainContinuity is deterministic and reflexive", () => {
    const hash =
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
    expect(verifyChainContinuity(hash, hash)).toBe(true);
    expect(verifyChainContinuity(hash, hash + "0")).toBe(false);
  });
});

describe("determinism — effect-log", () => {
  it("append produces identical entryHash for identical payloads", async () => {
    const logA = new EffectLog();
    const logB = new EffectLog();

    const payload = {
      id: "entry-001",
      timestamp: "2026-06-11T10:00:00.000Z",
      eventType: "DECISION" as const,
      actor: "core",
      prevHash: "0".repeat(64),
      status: "PASS" as const,
      change: "init",
    };

    const entryA = await logA.append(payload);
    const entryB = await logB.append(payload);

    expect(entryA.entryHash).toBe(entryB.entryHash);
    expect(entryA.entryHash).toHaveLength(64);
  });

  it("chain of 3 entries produces deterministic final hash", async () => {
    const log = new EffectLog();

    const e1 = await log.append({
      id: "001",
      timestamp: "2026-06-11T10:00:00.000Z",
      eventType: "DECISION",
      actor: "core",
      prevHash: "0".repeat(64),
      status: "PASS",
      change: "first",
    });

    const e2 = await log.append({
      id: "002",
      timestamp: "2026-06-11T10:01:00.000Z",
      eventType: "DECISION",
      actor: "core",
      prevHash: e1.entryHash,
      status: "PASS",
      change: "second",
    });

    const e3 = await log.append({
      id: "003",
      timestamp: "2026-06-11T10:02:00.000Z",
      eventType: "DECISION",
      actor: "core",
      prevHash: e2.entryHash,
      status: "PASS",
      change: "third",
    });

    expect(log.validate()).toBe(true);
    expect(log.getLastHash()).toBe(e3.entryHash);

    // Rebuild identical chain and assert same final hash
    const log2 = new EffectLog();
    const f1 = await log2.append({
      id: "001",
      timestamp: "2026-06-11T10:00:00.000Z",
      eventType: "DECISION",
      actor: "core",
      prevHash: "0".repeat(64),
      status: "PASS",
      change: "first",
    });
    const f2 = await log2.append({
      id: "002",
      timestamp: "2026-06-11T10:01:00.000Z",
      eventType: "DECISION",
      actor: "core",
      prevHash: f1.entryHash,
      status: "PASS",
      change: "second",
    });
    const f3 = await log2.append({
      id: "003",
      timestamp: "2026-06-11T10:02:00.000Z",
      eventType: "DECISION",
      actor: "core",
      prevHash: f2.entryHash,
      status: "PASS",
      change: "third",
    });

    expect(f3.entryHash).toBe(e3.entryHash);
  });

  it("serialization round-trip preserves determinism", async () => {
    const log = new EffectLog();
    await log.append({
      id: "001",
      timestamp: "2026-06-11T10:00:00.000Z",
      eventType: "AUDIT",
      actor: "core",
      prevHash: "0".repeat(64),
      status: "PASS",
      change: "round-trip",
    });

    const json = log.toJSON();
    const log2 = new EffectLog();
    log2.loadFromJSON(json);

    expect(log2.getEntries().length).toBe(1);
    expect(log2.getEntries()[0].entryHash).toBe(log.getEntries()[0].entryHash);
    expect(log2.validate()).toBe(true);
  });

  it("rejects non-deterministic mutation (broken prevHash)", async () => {
    const log = new EffectLog();
    await log.append({
      id: "001",
      timestamp: "2026-06-11T10:00:00.000Z",
      eventType: "DECISION",
      actor: "core",
      prevHash: "0".repeat(64),
      status: "PASS",
      change: "first",
    });

    await expect(
      log.append({
        id: "002",
        timestamp: "2026-06-11T10:01:00.000Z",
        eventType: "DECISION",
        actor: "core",
        prevHash: "1".repeat(64),
        status: "PASS",
        change: "second",
      })
    ).rejects.toThrow(/CHAIN_BREAK/);
  });
});
