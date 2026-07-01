/**
 * check-domain-boundaries.ts
 * S11.COMMIT.ID: S11-2026-0623-CICD-PHI-001
 * RULE-DOM-001 Enforcement — Deterministic Execution Layer
 * Runtime: Strict TypeScript — zero any — zero RNG — zero Date.now()
 */

import * as fs from "fs";
import * as path from "path";

interface BoundaryRule {
  readonly domain: string;
  readonly root: string;
  readonly forbidden_import_patterns: readonly RegExp[];
}

const BOUNDARY_RULES: readonly BoundaryRule[] = [
  {
    domain: "04_packages",
    root: "04_packages",
    forbidden_import_patterns: [
      /from\s+['"].*03_ee.*['"]/,
      /require\(['"].*03_ee.*['"]\)/,
      /from\s+['"].*07_archive.*['"]/,
      /require\(['"].*07_archive.*['"]\)/,
    ],
  },
  {
    domain: "05_apps",
    root: "05_apps",
    forbidden_import_patterns: [
      /from\s+['"].*03_ee.*['"]/,
      /require\(['"].*03_ee.*['"]\)/,
      /from\s+['"].*07_archive.*['"]/,
      /require\(['"].*07_archive.*['"]\)/,
    ],
  },
  {
    domain: "01_governance",
    root: "01_governance",
    forbidden_import_patterns: [
      /from\s+['"].*03_ee.*['"]/,
      /require\(['"].*03_ee.*['"]\)/,
      /from\s+['"].*04_packages.*['"]/,
      /require\(['"].*04_packages.*['"]\)/,
      /from\s+['"].*07_archive.*['"]/,
      /require\(['"].*07_archive.*['"]\)/,
    ],
  },
] as const;

const CLINICAL_TERM_PATTERNS: readonly RegExp[] = [
  /\bstress\b/i,
  /\bmeditation\b/i,
  /\bwellness\b/i,
  /\btherapy\b/i,
  /\banxiety\b/i,
  /\bmindfulness\b/i,
] as const;

interface Violation {
  readonly file: string;
  readonly line: number;
  readonly column: number;
  readonly rule: "RULE-DOM-001" | "S11_VOCABULARY_VIOLATION";
  readonly matched: string;
  readonly severity: "WORLDHALT";
}

const violations: Violation[] = [];

function shouldSkipFile(filePath: string): boolean {
  const skipDirs = ["node_modules", ".turbo", "dist", ".next", "out", "coverage"];
  const parts = filePath.split(path.sep);
  if (parts.some((part) => skipDirs.includes(part))) return true;
  const base = path.basename(filePath);
  if (base.includes(".test.") || base.includes(".spec.")) return true;
  return false;
}

function scanFile(filePath: string, rules: readonly BoundaryRule[]): void {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const domainRule = rules.find(
    (r) =>
      filePath.includes(path.sep + r.root + path.sep) ||
      filePath.startsWith(r.root + path.sep)
  );
  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    if (domainRule) {
      for (const pattern of domainRule.forbidden_import_patterns) {
        const match = line.match(pattern);
        if (match) {
          violations.push({
            file: filePath,
            line: lineNum,
            column: line.indexOf(match[0]) + 1,
            rule: "RULE-DOM-001",
            matched: match[0].trim(),
            severity: "WORLDHALT",
          });
        }
      }
    }
    // S11 vocabulary lock-in applies only to operational domains.
    // 07_archive is historical reference material and is exempt from S11 scanning.
    if (!filePath.startsWith("07_archive" + path.sep)) {
      for (const pattern of CLINICAL_TERM_PATTERNS) {
        const match = line.match(pattern);
        if (match) {
          violations.push({
            file: filePath,
            line: lineNum,
            column: line.indexOf(match[0]) + 1,
            rule: "S11_VOCABULARY_VIOLATION",
            matched: match[0].trim(),
            severity: "WORLDHALT",
          });
        }
      }
    }
  });
}

function discoverSourceFiles(roots: readonly string[]): string[] {
  const files: string[] = [];
  const INCLUDE_EXT = new Set([".ts", ".tsx", ".js", ".mjs"]);
  function walk(dir: string): void {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === ".turbo") continue;
        walk(full);
      } else if (INCLUDE_EXT.has(path.extname(entry.name))) {
        if (!shouldSkipFile(full)) files.push(full);
      }
    }
  }
  for (const root of roots) walk(root);
  return files;
}

const SCAN_ROOTS: readonly string[] = [
  "01_governance",
  "04_packages",
  "03_ee",
  "05_apps",
  "07_archive",
] as const;

const staleRoots = SCAN_ROOTS.filter((root) => !fs.existsSync(root));
if (staleRoots.length > 0) {
  console.error("WORLDHALT: stale scan roots (paths do not exist):");
  for (const root of staleRoots) {
    console.error(`  - ${root}`);
  }
  process.exit(1);
}

const sourceFiles = discoverSourceFiles(SCAN_ROOTS);

for (const file of sourceFiles) {
  scanFile(file, BOUNDARY_RULES);
}

if (violations.length > 0) {
  console.error(
    "DEPLOYMENT_STATE_VIOLATION: " + violations.length + " violation(s) detected"
  );
  for (const v of violations) {
    console.error(
      "  [" + v.rule + "] " + v.file + ":" + v.line + ":" + v.column + " -- " + v.matched
    );
  }
  console.error("WORLDHALT: BOUNDARY_CHECK_FAILED");
  process.exit(1);
} else {
  console.log("BOUNDARY_CHECK: COMPLIANT");
  console.log("Files scanned: " + sourceFiles.length);
  process.exit(0);
}
