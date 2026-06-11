[PATH]: 04_packages/@silence/s11-lint/README.md

# @silence/s11-lint

S11 Language Standard linter for SILENCE.OBJECTS. Enforces linguistic sterility across source code, documentation, and configuration files.

## Installation

```bash
pnpm add -D @silence/s11-lint
```

## Usage

### CLI

```bash
# Scan current directory
s11-lint

# Scan specific paths
s11-lint 01_governance 02_protocols 04_packages

# JSON output
s11-lint --json 05_apps

# Report without exit code 1
s11-lint --report-only
```

### Programmatic API

```typescript
import { lintProject, formatTextReport } from '@silence/s11-lint';

const report = lintProject({
  paths: ['src', 'docs'],
  reportFormat: 'text',
});

console.log(formatTextReport(report));
```

## Configuration

The linter uses `@silence/types/s11` as the canonical source of forbidden terms and allowed alternatives. To modify the rule set, update the types package — not this linter.

### Scanned Extensions

`.ts`, `.tsx`, `.js`, `.jsx`, `.md`, `.json`, `.yaml`, `.yml`

### Ignored Patterns

`node_modules`, `.git`, `dist`, `build`, `.next`, `coverage`, `S11_CLEANUP_REPORT.md`, `S11_POST_FIX_REPORT.md`

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | No violations found |
| 1 | Violations detected (unless `--report-only`) |

## S11-01 Compliance

This package implements G1 buildtime enforcement per S11-01 v2.1. It does not replace manual steward review for docs, UI, or prompts — those remain under G2 runtime design until implemented.
