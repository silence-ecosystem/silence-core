[PATH]: 04_packages/@silence/jitai/README.md

---
title: PKG-jitai
status: MVP
classification: SSoT
sentinel: S11_ENFORCED
created: 2026-06-10
---

# @silence/jitai — Deterministic JITAI Rule Engine

## Architecture

- **22 threshold-based rules** (R1-R22)
- **Zero AI/ML** — no neural networks, no statistical models, no probabilistic inference
- **Zero randomness** — deterministic output for identical input
- **Alpha-beta filter** — per-rule cooldown + global suppression window prevents fatigue

## Rule Categories

| Category | Rules | Trigger |
|---|---|---|
| Streak | R1-R5 | streak length, completions |
| Garden | R6-R10 | activity level, sessions |
| Rhythm | R11-R15 | variance, time of day, weekend |
| Quota | R16-R20 | quota proximity, frequency |
| Safety | R21-R22 | inactivity spike, first-time user |

## Usage

```typescript
import { evaluate, AlphaBetaFilter, ALL_RULES } from '@silence/jitai';

const ctx = {
  streakLength: 8,
  recentBreathCompletions: 5,
  gardenActivityLevel: 7,
  quietSessionCount: 3,
  rhythmVariance: 0.3,
  quotaProximity: 0.4,
  inactivityWindowMs: 3600000,
  recentInterventionFrequency: 1,
  currentHour: 14,
  dayOfWeek: 2,
  attentionDepth: 3,
};

const filter = new AlphaBetaFilter(600_000); // 10 min global suppression
const result = evaluate(ctx, { filter, maxSignals: 3 });

if (result.triggered) {
  for (const signal of result.signals) {
    console.log(`[JITAI] ${signal.ruleId}: ${signal.messageKey} (P${signal.priority})`);
    filter.record(signal, Date.now());
  }
}
```

## Boundary

- Open-Core (`04_packages/@silence/jitai/`)
- Zero EE dependencies
- Consumed by apps and `@silence/telemetry`
