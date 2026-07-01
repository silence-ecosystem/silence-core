# ROOT ANCHOR FILES TEMPLATES

## 1. README.md (root)

```markdown
# SILENCE.OBJECTS

**Deterministic behavioral pattern analysis. Open-core + enterprise.**

## What is SILENCE?

SILENCE.OBJECTS is a Governance-first Hybrid Monorepo for analyzing structural behavioral patterns using φ-mathematics (golden ratio). 

- **Local-first** data processing (no hard cloud dependency)
- **Deterministic** decision engine (no randomness in core logic)
- **S11-compliant** (neutral, non-clinical language)
- **EU AI Act ready** (Annex IV high-risk safeguards)

## Quick Start

```bash
cd /home/ewa/silence
pnpm install --frozen-lockfile
pnpm boundary-check    # Verify architecture
pnpm s11-check         # Verify vocabulary
pnpm typecheck         # Verify types
pnpm build             # Build all packages
pnpm test              # Run test suite
```

## Structure

- **00_inbox**, **00_identity** — Governance kernel (immutable)
- **01_governance** — Canonical policies (ADR, S11, brand)
- **03_ee** — Enterprise / High-Risk (RULE-DOM-001 protected)
- **04_packages/@silence/** — Open-Core shared packages (~36)
- **05_apps/** — Frontend applications (patternlens, garden, silence-objects)

## Documentation

See **01_governance/** for:
- ADRs (architecture decision records)
- S11 vocabulary standard
- Brand Book (design system)
- Frontend Architecture (v2.0)

## Contributing

See CONTRIBUTING.md.

## License

MIT (open-core). Enterprise tier under separate agreement.

---

## Key Packages (Public API)

- `@silence/sdk` — ONLY public entrypoint for apps (RULE-DOM-001)
- `@silence/contracts` — TypeScript interfaces
- `@silence/events` — Event schemas
- `@silence/phi` — φ constants and math
- `@silence/types` — Type exports

## Compliance

- **S11 Guardrails:** Zero clinical/therapeutic language
- **Boundary-Check:** No 05_apps imports from 03_ee
- **PCS ≥ 0.990:** Phi Compliance Score gate on all releases
- **Determinism:** All core decisions are reproducible (10k iteration tests)

---

Last updated: 2026-06-25
```

---

## 2. LICENSE (MIT)

```text
MIT License

Copyright (c) 2026 Pattern System Architect

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

**EXCEPTION:** Enterprise packages (03_ee/@silence/*) are proprietary and
subject to separate licensing agreements. See CONTRIBUTING.md.
```

---

## 3. CONTRIBUTING.md

```markdown
# Contributing to SILENCE.OBJECTS

## Code of Conduct

Be respectful. No discrimination. Assume good intent.

## Before You Start

1. Read **01_governance/HARD_SEVEN_v2026.md** (7 immutable rules)
2. Read **01_governance/SILENCE-S11-VOCABULARY.md** (vocabulary standard)
3. Read **01_governance/SILENCE-FRONTEND-ARCHITECTURE.md** (tech specs)

## Development Setup

```bash
cd /home/ewa/silence
pnpm install --frozen-lockfile
pnpm build
pnpm test
```

## Commit Rules

1. **Branch naming:** feature/*, bugfix/*, docs/*, chore/*
2. **Commit format:**
   ```
   [SCOPE] Message (imperative)
   
   - Item 1
   - Item 2
   
   Closes #issue (if applicable)
   ```
3. **Tests must pass:** `pnpm test` before push
4. **Types must be clean:** `pnpm typecheck` before push

## CI/CD Pipeline

All PRs run:
```
pnpm boundary-check    # RULE-DOM-001 enforcement
pnpm s11-check         # Vocabulary compliance
pnpm typecheck         # Type safety
pnpm build             # Build all affected packages
pnpm test              # Test suite
```

**All gates must PASS before merge.**

## Architecture Rules (HARD-SEVEN)

1. **Determinism** — Core logic has zero randomness
2. **PCS ≥ 0.990** — Phi Compliance Score gating
3. **S11 Vocabulary** — No clinical/therapeutic language
4. **MATH_CORE** — All timings/spacing φ-derived
5. **IP Boundary** — Clear separation between core/enterprise
6. **Zero Ambiguity** — No TODOs, placeholders, or "TBD"
7. **Immutable Log** — All decisions tracked append-only

## Important Files (Do Not Touch)

- **00_identity/MATH_CORE.md** — φ constants (SSOT)
- **01_governance/HARD_SEVEN_v2026.md** — 7 immutable rules
- **02_protocols/boundary-check.sh** — RULE-DOM-001 enforcement
- **02_protocols/s11-check.sh** — Vocabulary enforcement

## Submitting Changes

1. Fork and create a feature branch
2. Make changes
3. Run `pnpm test` and `pnpm typecheck` locally
4. Commit with proper message format
5. Push and create PR
6. Wait for CI to pass
7. Request review from @Pattern (or governance team)
8. Merge when approved + CI green

## What Gets Merged

- ✅ Bugfixes (with tests)
- ✅ Features (with tests + docs)
- ✅ Docs (including governance)
- ❌ Changes to 00_*, 01_*, 02_* layers without ADR
- ❌ S11 violations
- ❌ PCS < 0.990
- ❌ Boundary check failures

## Enterprise vs Open-Core

- **Open-Core (04_packages/@silence/*)** — MIT licensed, anyone can contribute
- **Enterprise (03_ee/@silence/*)** — Proprietary, core team only

If you're contributing to open-core and it touches enterprise:
1. Discuss in issue first
2. Clearly separate concerns
3. No sensitive logic in shared layers

## Questions?

- **Architecture:** See 01_governance/ docs
- **API usage:** See 04_packages/@silence/sdk/ README
- **Deployment:** See 06_infrastructure/ guides

---

Last updated: 2026-06-25
```

---

## 4. CODE_OF_CONDUCT.md

```markdown
# Code of Conduct

## Our Commitment

We are committed to providing a welcoming and inclusive environment for all contributors.

## Our Standards

Be respectful:
- Use inclusive language
- Respect differing opinions
- Accept constructive criticism
- Focus on what is best for the community

Do not:
- Use offensive language
- Harass or discriminate
- Publish private information
- Engage in personal attacks

## Enforcement

Violations will be addressed by project maintainers. Serious or repeated violations may result in being banned.

## Reporting

If you experience or witness abuse, contact: [governance team email]

---

This Code of Conduct is adapted from the Contributor Covenant.
```

---

## 5. SECURITY.md

```markdown
# Security Policy

## Supported Versions

| Version | Status | Support Until |
|---------|--------|---------------|
| 1.0.x   | Active | 2027-06-25 |

## Reporting Vulnerabilities

**Do not open public issues for security vulnerabilities.**

Instead, email: [security team email]

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Your name and contact (optional)

We will acknowledge receipt within 48 hours and provide an ETA for a fix.

## Security Considerations

### Critical Layers

- **00_identity/MATH_CORE** — φ constants must be exact (1.618033988749895)
- **02_protocols/boundary-check** — RULE-DOM-001 enforcement (no EE imports in apps)
- **03_ee/** — High-risk enterprise code (Annex IV compliance)

### PCS (Phi Compliance Score)

All releases must have PCS ≥ 0.990. This includes:
- ✅ Determinism verification (10k iteration tests)
- ✅ S11 vocabulary compliance
- ✅ Boundary check PASS
- ✅ No floating-point rounding errors

### Data Security

- No PII stored in EffectLog (append-only, immutable)
- All decision logs are SHA-256 hashed
- No customer data in git repo (use environment variables)

---

Last updated: 2026-06-25
```

---

## How to Use These

1. Copy each section (1-5) into separate files in `/home/ewa/silence/`
2. Run `pnpm s11-check` to verify no violations
3. Commit:
   ```bash
   git add README.md LICENSE CONTRIBUTING.md CODE_OF_CONDUCT.md SECURITY.md
   git commit -m "[CHORE] Add root anchor files (README, LICENSE, CONTRIBUTING, CoC, SECURITY)"
   git push
   ```

**Time:** 5 minutes to create, 2 minutes to commit.

---
