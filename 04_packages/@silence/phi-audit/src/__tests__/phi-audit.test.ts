/**
 * phi-audit.test.ts — Vitest test suite
 * S11.COMMIT.ID: PL-PWA-IMPL-PLAN-20260617-001
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  auditPhiArtifact,
  auditRouteManifest,
  auditS11Copy,
  auditPhiTokens,
  emitPhiAuditRecord,
  getAuditLog,
  _resetAuditLogForTesting,
  type PhiAuditInput,
} from '../phi-audit.js';

const BASE_COMMIT: Pick<PhiAuditInput, 'commitId' | 'prevHash'> = {
  commitId: 'PL-PWA-IMPL-PLAN-20260617-001',
  prevHash: 'SHA256:audit-diagnostics-kimi-20260617',
};

// ─── Contract tests ───────────────────────────────────────────────────────────

describe('phi-audit — contract tests', () => {
  it('passes canonical intent-selector copy', () => {
    const result = auditPhiArtifact({
      ...BASE_COMMIT,
      artifactType: 'copy',
      path: 'app/(protected)/intent-selector/page.tsx',
      source: 'To nie test ani ocena. Wybierz tryb wejścia.',
      allowedTokens: ['to nie test ani ocena', 'wybierz tryb wejścia'],
    });

    expect(result.status).toBe('PASS');
    expect(result.pcsScore).toBeGreaterThanOrEqual(0.999);
  });

  it('fails forbidden ee/ import boundary — RULE-DOM-001', () => {
    const result = auditPhiArtifact({
      ...BASE_COMMIT,
      artifactType: 'module',
      path: 'packages/open-core/src/index.ts',
      source: "import { secret } from '../../ee/private';",
    });

    expect(result.status).toBe('FAIL');
    expect(result.findings.find(f => f.ruleId === 'RULE-DOM-001')?.status).toBe('FAIL');
  });

  it('allows ee/ access via @silence/contracts', () => {
    const result = auditPhiArtifact({
      ...BASE_COMMIT,
      artifactType: 'module',
      path: 'packages/open-core/src/gate.ts',
      source: "import { GateContract } from '@silence/contracts/ee-gate';",
    });

    expect(result.findings.find(f => f.ruleId === 'RULE-DOM-001')?.status).toBe('PASS');
  });

  it('fails banned S11 vocabulary — mindfulness', () => {
    const result = auditPhiArtifact({
      ...BASE_COMMIT,
      artifactType: 'copy',
      path: 'app/(protected)/onboarding/step1.tsx',
      source: 'Welcome to your mindfulness journey.',
    });

    expect(result.status).toBe('FAIL');
    expect(result.findings.find(f => f.ruleId === 'S11-VOCAB')?.status).toBe('FAIL');
  });

  it('fails banned S11 vocabulary — stres (Polish)', () => {
    const result = auditPhiArtifact({
      ...BASE_COMMIT,
      artifactType: 'copy',
      path: 'app/(protected)/onboarding/step2.tsx',
      source: 'Oceń swój stres na skali od 1 do 10.',
    });

    expect(result.status).toBe('FAIL');
  });

  it('fails non-φ spacing token', () => {
    const result = auditPhiArtifact({
      ...BASE_COMMIT,
      artifactType: 'token',
      path: 'packages/phi-tokens/src/spacing.ts',
      source: '--grid-gap: 12px; --card-padding: 10px;', // 10px not Fibonacci
    });

    expect(result.findings.find(f => f.ruleId === 'MATH_CORE_PHI')?.status).toBe('FAIL');
  });

  it('passes canonical φ spacing tokens', () => {
    const result = auditPhiArtifact({
      ...BASE_COMMIT,
      artifactType: 'token',
      path: 'packages/phi-tokens/src/spacing.ts',
      source: '--grid-gap: 13px; --card-padding: 21px; --section-margin: 34px;',
    });

    expect(result.findings.find(f => f.ruleId === 'MATH_CORE_PHI')?.status).toBe('PASS');
  });

  it('fails non-φ timing token', () => {
    const result = auditPhiArtifact({
      ...BASE_COMMIT,
      artifactType: 'token',
      path: 'packages/phi-tokens/src/timing.ts',
      source: '--transition-duration: 300ms;', // 300ms ≠ any φ canonical
    });

    expect(result.findings.find(f => f.ruleId === 'MATH_CORE_PHI')?.status).toBe('FAIL');
  });

  it('passes GOLDENSECOND canonical timing', () => {
    const result = auditPhiArtifact({
      ...BASE_COMMIT,
      artifactType: 'token',
      path: 'packages/phi-tokens/src/timing.ts',
      source: '--session-timeout: 1618ms; --ease-transition: 618ms;',
    });

    expect(result.findings.find(f => f.ruleId === 'MATH_CORE_PHI')?.status).toBe('PASS');
  });

  it('fails when commitId is missing', () => {
    const result = auditPhiArtifact({
      commitId: '',
      prevHash: BASE_COMMIT.prevHash,
      artifactType: 'copy',
      path: 'any.tsx',
      source: 'Hello world.',
    });

    expect(result.findings.find(f => f.ruleId === 'COMMIT-META')?.status).toBe('FAIL');
  });

  it('fails when source uses Date.now() — determinism violation', () => {
    const result = auditPhiArtifact({
      ...BASE_COMMIT,
      artifactType: 'module',
      path: 'src/lib/session.ts',
      source: 'const start = Date.now(); setTimeout(() => {}, start);',
    });

    expect(result.findings.find(f => f.ruleId === 'DETERMINISM')?.status).toBe('FAIL');
  });

  it('fails when source uses Math.random() — determinism violation', () => {
    const result = auditPhiArtifact({
      ...BASE_COMMIT,
      artifactType: 'module',
      path: 'src/lib/jitter.ts',
      source: 'const jitter = Math.random() * 100;',
    });

    expect(result.findings.find(f => f.ruleId === 'DETERMINISM')?.status).toBe('FAIL');
  });
});

// ─── Determinism tests ────────────────────────────────────────────────────────

describe('phi-audit — determinism tests', () => {
  const STABLE_INPUT: PhiAuditInput = {
    ...BASE_COMMIT,
    artifactType: 'copy',
    path: 'app/(protected)/intent-selector/page.tsx',
    source: 'Obserwuj wzorzec uwagi bez oceniania.',
  };

  it('identical input → identical artifactHash', () => {
    const r1 = auditPhiArtifact(STABLE_INPUT);
    const r2 = auditPhiArtifact(STABLE_INPUT);
    expect(r1.artifactHash).toBe(r2.artifactHash);
  });

  it('identical input → identical traceId', () => {
    const r1 = auditPhiArtifact(STABLE_INPUT);
    const r2 = auditPhiArtifact(STABLE_INPUT);
    expect(r1.traceId).toBe(r2.traceId);
  });

  it('identical input → identical findings order', () => {
    const r1 = auditPhiArtifact(STABLE_INPUT);
    const r2 = auditPhiArtifact(STABLE_INPUT);
    expect(r1.findings.map(f => f.ruleId)).toEqual(r2.findings.map(f => f.ruleId));
  });

  it('identical input → identical PCS score', () => {
    const r1 = auditPhiArtifact(STABLE_INPUT);
    const r2 = auditPhiArtifact(STABLE_INPUT);
    expect(r1.pcsScore).toBe(r2.pcsScore);
  });

  it('different source → different artifactHash', () => {
    const r1 = auditPhiArtifact({ ...STABLE_INPUT, source: 'Source A' });
    const r2 = auditPhiArtifact({ ...STABLE_INPUT, source: 'Source B' });
    expect(r1.artifactHash).not.toBe(r2.artifactHash);
  });
});

// ─── Boundary tests ───────────────────────────────────────────────────────────

describe('phi-audit — boundary tests', () => {
  it('public route artifact cannot reference ee/ private surface', () => {
    const result = auditPhiArtifact({
      ...BASE_COMMIT,
      artifactType: 'module',
      path: 'packages/open-core/src/feature.ts',
      source: "import { premium } from 'ee/premium-features';",
      allowedImports: ['react', 'next', '@silence/contracts'],
    });

    expect(result.findings.find(f => f.ruleId === 'RULE-DOM-001')?.status).toBe('FAIL');
  });

  it('CI file cannot import private domain modules', () => {
    const result = auditPhiArtifact({
      ...BASE_COMMIT,
      artifactType: 'ci',
      path: '.github/scripts/check.ts',
      source: "import { internalSecret } from '../../ee/internal/vault';",
    });

    expect(result.findings.find(f => f.ruleId === 'RULE-DOM-001')?.status).toBe('FAIL');
  });

  it('protected route uses (protected) layout group', () => {
    const result = auditRouteManifest({
      routes: [
        { path: '/app/(protected)/dashboard', protected: true, layout: 'protected-layout' },
        { path: '/onboarding', protected: false },
      ],
    });

    expect(result.status).toBe('PASS');
  });

  it('fails protected route without (protected) layout', () => {
    const result = auditRouteManifest({
      routes: [
        { path: '/dashboard', protected: true }, // missing (protected) segment
      ],
    });

    expect(result.status).toBe('FAIL');
  });
});

// ─── Regression tests ─────────────────────────────────────────────────────────

describe('phi-audit — regression tests', () => {
  it('intent-selector copy remains S11-safe', () => {
    const { passed } = auditS11Copy('To nie test ani ocena. Wybierz tryb wejścia w ciszy.');
    expect(passed).toBe(true);
  });

  it('onboarding copy with forbidden term fails S11', () => {
    const { passed, violations } = auditS11Copy('Twój poziom stresu w tej chwili.');
    expect(passed).toBe(false);
    expect(violations).toContain('stres');
  });

  it('φ token map passes for canonical values', () => {
    const { passed } = auditPhiTokens({
      EASE_MS: 618,
      GOLDENSECOND_MS: 1618,
      GRID_GAP_PX: 13,
      CARD_PADDING_PX: 21,
    });
    expect(passed).toBe(true);
  });

  it('φ token map fails for non-canonical ms value', () => {
    const { passed, violations } = auditPhiTokens({ TRANSITION_MS: 200 });
    expect(passed).toBe(false);
    expect(violations.length).toBeGreaterThan(0);
  });
});

// ─── Audit log tests ──────────────────────────────────────────────────────────

describe('phi-audit — audit log (append-only)', () => {
  beforeEach(() => {
    _resetAuditLogForTesting();
  });

  it('emits record with monotonic sequenceId', () => {
    const r1 = auditPhiArtifact({ ...BASE_COMMIT, artifactType: 'copy', path: 'a.tsx', source: 'Cicha sesja.' });
    const r2 = auditPhiArtifact({ ...BASE_COMMIT, artifactType: 'copy', path: 'b.tsx', source: 'Wzorzec uwagi.' });
    const rec1 = emitPhiAuditRecord(r1);
    const rec2 = emitPhiAuditRecord(r2);

    expect(rec2.sequenceId).toBeGreaterThan(rec1.sequenceId);
  });

  it('audit log is immutable — cannot push to returned snapshot', () => {
    const r = auditPhiArtifact({ ...BASE_COMMIT, artifactType: 'copy', path: 'a.tsx', source: 'Obserwuj.' });
    emitPhiAuditRecord(r);

    const log = getAuditLog();
    expect(() => {
      // @ts-expect-error testing immutability
      (log as AuditRecord[]).push(r as any);
    }).toThrow();
  });

  it('sequenceId starts at 0 after reset', () => {
    const r = auditPhiArtifact({ ...BASE_COMMIT, artifactType: 'copy', path: 'a.tsx', source: 'Test.' });
    const rec = emitPhiAuditRecord(r);
    expect(rec.sequenceId).toBe(0);
  });
});
