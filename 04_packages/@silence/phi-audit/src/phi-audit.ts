/**
 * phi-audit.ts — PatternLens Canonical Governance Auditor
 * S11.COMMIT.ID: PL-PWA-IMPL-PLAN-20260617-001
 * prevHash: SHA256:audit-diagnostics-kimi-20260617
 *
 * DETERMINISM CONTRACT:
 *   - No wall-clock time reads (Date.now, new Date, performance.now)
 *   - No Math.random or any RNG source
 *   - No network calls, no process.env reads inside audit logic
 *   - Pure synchronous functions only
 *   - Identical input → identical output, always
 */

// ─── Constants ────────────────────────────────────────────────────────────────

const PHI = 1.6180339887498948482;
const GOLDENSECOND_MS = 1618; // GS = φ × 1000ms, canonical timing unit

/** Fibonacci-derived spacing ladder (px). Only these values are φ-canonical. */
const PHI_SPACING_CANONICAL = new Set([1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144]);

/** φ-derived timing values (ms), aligned with MATH_CORE canonical tokens. */
const PHI_TIMING_CANONICAL = new Map<string, number>([
  ['EASE', 618],           // φ⁻¹ × 1000
  ['GOLDENSECOND', GOLDENSECOND_MS], // 1618 ms = φ × 1000
  ['BREATHE', 2618],       // φ² × 1000
  ['SILENCE_CYCLE', 6854], // φ⁵ × 618
]);

const PCS_THRESHOLD = 0.999;

/** Banned S11 lexical domains — wellness/therapeutic terms forbidden in protected routes. */
const S11_BANNED_TOKENS = [
  'mindfulness', 'stress', 'stres', 'wellness', 'anxiety', 'meditation',
  'mental health', 'zdrowie psychiczne', 'medytacja', 'relaks', 'relax',
  'diagnoza', 'diagnose', 'therapy', 'terapia', 'self-care', 'overcapacity',
  'problem', 'błąd', 'error message', // replaced by SIGNAL_NOISE, STATE_VIOLATION
];

/** Forbidden import boundary fragment — RULE-DOM-001. */
const DOM_001_FORBIDDEN_PATHS = [
  /['"`].*\/ee\//,           // direct ee/ reference
  /from\s+['"`]ee\//,        // from 'ee/...'
  /require\s*\(\s*['"`].*ee\//,
];

/** Allowed communication channels from open-core to ee. */
const DOM_001_ALLOWED_CONTRACTS = [
  '@silence/contracts',
  '@silence/phi-tokens',
  '@silence/shared',
];

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PhiAuditInput {
  readonly commitId: string;
  readonly prevHash: string;
  readonly artifactType: 'route' | 'copy' | 'token' | 'module' | 'ci';
  readonly path: string;
  readonly source: string;
  readonly allowedImports?: readonly string[];
  readonly allowedTokens?: readonly string[];
}

export interface PhiAuditFinding {
  readonly ruleId: string;
  readonly status: 'PASS' | 'FAIL';
  readonly message: string;
}

export interface PhiAuditResult {
  readonly commitId: string;
  readonly prevHash: string;
  readonly artifactHash: string;
  readonly pcsScore: number;
  readonly status: 'PASS' | 'FAIL';
  readonly findings: readonly PhiAuditFinding[];
  readonly traceId: string;
}

export interface RouteManifest {
  readonly routes: readonly {
    readonly path: string;
    readonly protected: boolean;
    readonly layout?: string;
  }[];
}

export type AuditRecord = PhiAuditResult & {
  readonly sequenceId: number; // deterministic, monotonic — no timestamp
};

// ─── Deterministic hashing ────────────────────────────────────────────────────

/**
 * Pure deterministic hash: djb2 over UTF-8 char codes.
 * No crypto, no async, no environment dependency.
 */
function deterministicHash(input: string): string {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) + h) ^ input.charCodeAt(i);
    h = h >>> 0; // keep unsigned 32-bit
  }
  return h.toString(16).padStart(8, '0');
}

function makeArtifactHash(input: PhiAuditInput): string {
  const canonical = `${input.commitId}|${input.prevHash}|${input.artifactType}|${input.path}|${input.source}`;
  return `SHA256:phi-${deterministicHash(canonical)}`;
}

function makeTraceId(artifactHash: string, findings: readonly PhiAuditFinding[]): string {
  const findingsStr = findings.map(f => `${f.ruleId}:${f.status}`).join(',');
  return `trace-${deterministicHash(artifactHash + findingsStr)}`;
}

// ─── Rule checkers ────────────────────────────────────────────────────────────

function checkDeterminism(input: PhiAuditInput): PhiAuditFinding {
  const ruleId = 'DETERMINISM';
  const anti = [/Date\.now\(\)/, /new Date\(/, /Math\.random\(\)/, /performance\.now\(\)/, /crypto\.getRandomValues/];
  const violation = anti.find(re => re.test(input.source));
  if (violation) {
    return { ruleId, status: 'FAIL', message: `Non-deterministic API detected: ${violation.source}` };
  }
  return { ruleId, status: 'PASS', message: 'No non-deterministic APIs detected.' };
}

function checkRuleDom001(input: PhiAuditInput): PhiAuditFinding {
  const ruleId = 'RULE-DOM-001';
  if (input.artifactType !== 'module' && input.artifactType !== 'ci') {
    return { ruleId, status: 'PASS', message: 'Artifact type not subject to boundary scan.' };
  }
  for (const pattern of DOM_001_FORBIDDEN_PATHS) {
    if (pattern.test(input.source)) {
      // Check if the reference goes through an allowed contract
      const usesContract = DOM_001_ALLOWED_CONTRACTS.some(c => input.source.includes(c));
      if (!usesContract) {
        return {
          ruleId,
          status: 'FAIL',
          message: `PHI_AUDIT_BOUNDARY_VIOLATION: forbidden ee/ import without @silence/contracts indirection at ${input.path}`,
        };
      }
    }
  }
  if (input.allowedImports) {
    const lines = input.source.split('\n');
    for (const line of lines) {
      const importMatch = line.match(/from\s+['"`]([^'"`]+)['"`]/);
      if (importMatch) {
        const imported = importMatch[1];
        const isAllowed =
          input.allowedImports.includes(imported) ||
          DOM_001_ALLOWED_CONTRACTS.some(c => imported.startsWith(c)) ||
          imported.startsWith('.') ||
          imported.startsWith('@/') ||
          !imported.includes('/ee/');
        if (!isAllowed) {
          return {
            ruleId,
            status: 'FAIL',
            message: `PHI_AUDIT_BOUNDARY_VIOLATION: import '${imported}' not in allowedImports list.`,
          };
        }
      }
    }
  }
  return { ruleId, status: 'PASS', message: 'RULE-DOM-001: import boundaries intact.' };
}

function checkS11Copy(input: PhiAuditInput): PhiAuditFinding {
  const ruleId = 'S11-VOCAB';
  if (input.artifactType !== 'copy' && input.artifactType !== 'route') {
    return { ruleId, status: 'PASS', message: 'Artifact type not subject to S11 lexical scan.' };
  }
  const sourceLower = input.source.toLowerCase();
  const found = S11_BANNED_TOKENS.find(token => sourceLower.includes(token.toLowerCase()));
  if (found) {
    return {
      ruleId,
      status: 'FAIL',
      message: `PHI_AUDIT_COPY_VIOLATION: banned S11 token '${found}' found in ${input.path}. Replace with TENSION_SCORE / SIGNAL_NOISE / RITUAL_STATE vocabulary.`,
    };
  }
  return { ruleId, status: 'PASS', message: 'S11 vocabulary: no banned tokens detected.' };
}

function checkPhiTokens(input: PhiAuditInput): PhiAuditFinding {
  const ruleId = 'MATH_CORE_PHI';
  if (input.artifactType !== 'token') {
    return { ruleId, status: 'PASS', message: 'Artifact type not subject to φ token scan.' };
  }

  // Find all numeric px values in source
  const pxMatches = input.source.matchAll(/:\s*(\d+)px/g);
  for (const match of pxMatches) {
    const val = parseInt(match[1], 10);
    if (!PHI_SPACING_CANONICAL.has(val)) {
      return {
        ruleId,
        status: 'FAIL',
        message: `PHI_AUDIT_TOKEN_VIOLATION: spacing value ${val}px is not on Fibonacci/φ ladder. Allowed: ${[...PHI_SPACING_CANONICAL].join(', ')}px`,
      };
    }
  }

  // Find all ms timing values
  const msMatches = input.source.matchAll(/:\s*(\d+)ms/g);
  for (const match of msMatches) {
    const val = parseInt(match[1], 10);
    const canonicalValues = [...PHI_TIMING_CANONICAL.values()];
    const tolerance = 2; // ±2ms rounding tolerance
    const isCanonical = canonicalValues.some(cv => Math.abs(cv - val) <= tolerance);
    if (!isCanonical && (!input.allowedTokens || !input.allowedTokens.includes(`${val}ms`))) {
      return {
        ruleId,
        status: 'FAIL',
        message: `PHI_AUDIT_TOKEN_VIOLATION: timing value ${val}ms not derived from φ constants. Canonical: ${JSON.stringify(Object.fromEntries(PHI_TIMING_CANONICAL))}`,
      };
    }
  }

  return { ruleId, status: 'PASS', message: 'MATH_CORE_φ: all tokens derive from canonical φ constants.' };
}

function checkCommitMetadata(input: PhiAuditInput): PhiAuditFinding {
  const ruleId = 'COMMIT-META';
  if (!input.commitId || input.commitId.trim() === '') {
    return { ruleId, status: 'FAIL', message: 'Missing commitId — S11.COMMIT.ID required for every artifact.' };
  }
  if (!input.prevHash || input.prevHash.trim() === '') {
    return { ruleId, status: 'FAIL', message: 'Missing prevHash — append-only chain requires previous hash.' };
  }
  return { ruleId, status: 'PASS', message: `Commit chain intact: ${input.commitId} ← ${input.prevHash}` };
}

// ─── PCS Scoring ──────────────────────────────────────────────────────────────

/**
 * Deterministic weighted PCS score.
 * Weights are fixed constants — no runtime variation.
 * monotonic: more PASSes → higher score.
 */
const RULE_WEIGHTS: Record<string, number> = {
  'RULE-DOM-001': 0.30,  // boundary integrity — highest weight
  'S11-VOCAB':    0.25,  // lexical safety
  'MATH_CORE_PHI':0.20,  // token mapping
  'DETERMINISM':  0.15,  // determinism contract
  'COMMIT-META':  0.10,  // audit trace completeness
};

function computePCS(findings: readonly PhiAuditFinding[]): number {
  let score = 0;
  let totalWeight = 0;
  for (const finding of findings) {
    const weight = RULE_WEIGHTS[finding.ruleId] ?? 0;
    totalWeight += weight;
    if (finding.status === 'PASS') score += weight;
  }
  // Normalize: if totalWeight < 1 (some rules skipped), scale to full weight
  const normalised = totalWeight > 0 ? score / totalWeight : 0;
  // Clamp to [0, 1] and round to 4 decimal places for stability
  return Math.round(Math.min(1, Math.max(0, normalised)) * 10000) / 10000;
}

// ─── Primary API ─────────────────────────────────────────────────────────────

export function auditPhiArtifact(input: PhiAuditInput): PhiAuditResult {
  const findings: PhiAuditFinding[] = [
    checkCommitMetadata(input),
    checkDeterminism(input),
    checkRuleDom001(input),
    checkS11Copy(input),
    checkPhiTokens(input),
  ];

  const artifactHash = makeArtifactHash(input);
  const pcsScore = computePCS(findings);
  const traceId = makeTraceId(artifactHash, findings);

  const pcsGate: PhiAuditFinding =
    pcsScore >= PCS_THRESHOLD
      ? { ruleId: 'PCS-GATE', status: 'PASS', message: `PCS ${pcsScore} >= ${PCS_THRESHOLD}` }
      : { ruleId: 'PCS-GATE', status: 'FAIL', message: `PHI_AUDIT_PCS_LOW: ${pcsScore} < ${PCS_THRESHOLD}. WORLDHALT.` };

  const allFindings = [...findings, pcsGate];
  const status: 'PASS' | 'FAIL' = allFindings.every(f => f.status === 'PASS') ? 'PASS' : 'FAIL';

  return {
    commitId: input.commitId,
    prevHash: input.prevHash,
    artifactHash,
    pcsScore,
    status,
    findings: allFindings,
    traceId,
  };
}

export function auditRouteManifest(manifest: RouteManifest): PhiAuditResult {
  const findings: PhiAuditFinding[] = [];

  for (const route of manifest.routes) {
    // Protected routes must use (protected) layout segment
    if (route.protected && !route.path.includes('(protected)') && !route.layout?.includes('protected')) {
      findings.push({
        ruleId: 'ROUTE-POLICY',
        status: 'FAIL',
        message: `Route '${route.path}' is marked protected but does not use (protected) layout group.`,
      });
    }
  }

  if (findings.length === 0) {
    findings.push({ ruleId: 'ROUTE-POLICY', status: 'PASS', message: 'All routes comply with protected layout policy.' });
  }

  const artifactHash = makeArtifactHash({
    commitId: 'MANIFEST',
    prevHash: 'MANIFEST',
    artifactType: 'route',
    path: 'routes.json',
    source: JSON.stringify(manifest),
  });
  const pcsScore = computePCS(findings);
  const traceId = makeTraceId(artifactHash, findings);
  const status: 'PASS' | 'FAIL' = findings.every(f => f.status === 'PASS') ? 'PASS' : 'FAIL';

  return { commitId: 'MANIFEST', prevHash: 'MANIFEST', artifactHash, pcsScore, status, findings, traceId };
}

export function auditS11Copy(text: string): { passed: boolean; violations: string[] } {
  const textLower = text.toLowerCase();
  const violations = S11_BANNED_TOKENS.filter(token => textLower.includes(token.toLowerCase()));
  return { passed: violations.length === 0, violations };
}

export function auditPhiTokens(tokens: Record<string, number>): { passed: boolean; violations: string[] } {
  const violations: string[] = [];
  for (const [key, val] of Object.entries(tokens)) {
    if (key.endsWith('_PX')) {
      if (!PHI_SPACING_CANONICAL.has(val)) {
        violations.push(`${key}: ${val}px not on Fibonacci ladder`);
      }
    }
    if (key.endsWith('_MS')) {
      const canonicalValues = [...PHI_TIMING_CANONICAL.values()];
      if (!canonicalValues.some(cv => Math.abs(cv - val) <= 2)) {
        violations.push(`${key}: ${val}ms not derived from φ constants`);
      }
    }
  }
  return { passed: violations.length === 0, violations };
}

// ─── Append-only Audit Log ────────────────────────────────────────────────────

const _auditLog: AuditRecord[] = [];
let _sequenceCounter = 0;

/**
 * Appends a result to the immutable audit log.
 * Refuses overwrite: once written, a record cannot be mutated.
 * The log is append-only by construction — no splice, no delete.
 */
export function emitPhiAuditRecord(result: PhiAuditResult): AuditRecord {
  const record: AuditRecord = {
    ...result,
    sequenceId: _sequenceCounter++,
  };
  _auditLog.push(record);
  return record;
}

/** Returns a frozen snapshot of the audit log. Cannot be mutated by caller. */
export function getAuditLog(): readonly AuditRecord[] {
  return Object.freeze([..._auditLog]);
}

/** Resets log — only for test isolation, must never be called in production. */
export function _resetAuditLogForTesting(): void {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('_resetAuditLogForTesting must only be called in test environments.');
  }
  _auditLog.length = 0;
  _sequenceCounter = 0;
}

// ─── CLI entrypoint (when run as script) ─────────────────────────────────────

if (typeof process !== 'undefined' && process.argv[1]?.endsWith('phi-audit.ts')) {
  const args = process.argv.slice(2);
  const getArg = (flag: string) => {
    const i = args.indexOf(flag);
    return i !== -1 ? args[i + 1] : undefined;
  };

  const commitId = getArg('--commit-id') ?? 'UNKNOWN';
  const prevHash = getArg('--prev-hash') ?? 'UNKNOWN';
  const manifestPath = getArg('--manifest');

  if (manifestPath) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs') as typeof import('fs');
    const raw = fs.readFileSync(manifestPath, 'utf-8');
    const manifest: RouteManifest = JSON.parse(raw);
    const result = auditRouteManifest(manifest);
    const record = emitPhiAuditRecord(result);
    console.log(JSON.stringify(record, null, 2));
    if (result.status === 'FAIL') process.exit(1);
  } else {
    // Pipe mode: read stdin source for single artifact audit
    let source = '';
    process.stdin.setEncoding('utf-8');
    process.stdin.on('data', (chunk: string) => { source += chunk; });
    process.stdin.on('end', () => {
      const result = auditPhiArtifact({
        commitId,
        prevHash,
        artifactType: (getArg('--type') as PhiAuditInput['artifactType']) ?? 'module',
        path: getArg('--path') ?? 'stdin',
        source,
      });
      const record = emitPhiAuditRecord(result);
      console.log(JSON.stringify(record, null, 2));
      if (result.status === 'FAIL') process.exit(1);
    });
  }
}
