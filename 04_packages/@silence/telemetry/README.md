[PATH]: 04_packages/@silence/telemetry/README.md

---
title: PKG-telemetry
status: MVP
classification: SSoT
sentinel: S11_ENFORCED
created: 2026-06-10
updated: 2026-06-10
---

# @silence/telemetry — Open-Core Telemetry

## Event Types

| Type | Trigger |
|---|---|
| `app_open` | Application launch |
| `breath_cycle_completed` | User finishes a breath cycle |
| `garden_growth_applied` | Garden state changes |
| `jitai_rule_triggered` | Threshold rule fires |
| `quota_warning_shown` | Approaching quota limit |
| `quota_blocked_402` | Quota exceeded (402 response) |
| `signal_dismissed` | User dismisses prompt |
| `signal_override` | User overrides suggestion |
| `session_started` | Quiet session begins |
| `session_ended` | Quiet session ends |
| `engine_wasm_loaded` | WASM engine loaded (with loadTimeMs) |
| `engine_wasm_failed` | WASM engine failed (with error) |

## Adapters

- `consoleAdapter()` — logs to console (MVP default)
- `noopAdapter()` — silent (testing)
- `batchAdapter(intervalMs, maxSize)` — buffers events, flushes periodically. Persists unsent queue to `localStorage` on `pagehide`.

## Privacy

- **Consent kill-switch**: Reads `silence-consents` from localStorage. If `research_accepted` is false, all emits are silently dropped.
- **Session ID**: Auto-generated 16-byte hex ID per session. Call `resetSessionId()` to rotate.
- **Runtime validation**: Invalid `eventType` values are rejected with console error.

## Usage

```typescript
import { trackSilenceEvent, consoleAdapter, setTelemetryAdapter, setTelemetryContext } from '@silence/telemetry';

setTelemetryContext('0.1.0-mvp', 'production');
setTelemetryAdapter(consoleAdapter());

trackSilenceEvent({
  eventType: 'breath_cycle_completed',
  timestamp: new Date().toISOString(),
  payload: { cycleDurationMs: 6854 },
});
```

## Boundary

- Open-Core (`04_packages/@silence/telemetry/`)
- No EE dependencies
- No external backend in MVP (console/batch only)
