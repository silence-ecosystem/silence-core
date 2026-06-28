#!/usr/bin/env node

/**
 * S11 Guardrail Lint - Standalone Scanner
 * Enforces linguistic sterility across SILENCE.OBJECTS codebase
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_POLICY_PATH = path.join(__dirname, '..', 's11-policy.yaml');
const SCAN_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.md', '.json'];
const IGNORE_PATTERNS = ['node_modules', '.git', 'dist', 'build', '.next', 'S11_CLEANUP_REPORT.md', 'S11_POST_FIX_REPORT.md'];

interface Violation {
  file: string;
  line: number;
  column: number;
  term: string;
  context: string;
  severity: string;
}

class S11Scanner {
  private policy: string[];
  private violations: Violation[] = [];

  constructor(policyPath: string = DEFAULT_POLICY_PATH) {
    this.policy = this.loadPolicy(policyPath);
  }

  private loadPolicy(policyPath: string): string[] {
    try {
      const content = fs.readFileSync(policyPath, 'utf8');
      const parsed = yaml.load(content) as { policies?: { forbidden_terms?: string[] }[] };
      return parsed.policies?.[0]?.forbidden_terms || [];
    } catch (error) {
      console.error(`Failed to load policy from ${policyPath}:`, (error as Error).message);
      process.exit(1);
    }
  }

  private shouldScanFile(filePath: string): boolean {
    const ext = path.extname(filePath);
    if (!SCAN_EXTENSIONS.includes(ext)) return false;

    const parts = filePath.split(path.sep);
    return !parts.some(part => IGNORE_PATTERNS.includes(part));
  }

  private scanFile(filePath: string, relativePath: string): void {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');

      // S11 Meta-Documentation Exemption:
      // Skip files that document S11 policy itself
      const isS11MetaDoc = relativePath.includes('s11-guardrail-lint') ||
                           relativePath.includes('S11_INTERNAL_CERTIFICATE.md') ||
                           relativePath.includes('VERCEL_DEPLOYMENT.md');

      // Skip files with S11_FORBIDDEN_TERMS constant (runtime guard needs this)
      const hasRuntimeGuard = content.includes('S11_FORBIDDEN_TERMS') ||
                             content.includes('S11 Policy Constants');

      if (isS11MetaDoc || hasRuntimeGuard) {
        return;
      }

      lines.forEach((line, idx) => {
        this.policy.forEach(term => {
          const regex = new RegExp(`\\b${term}\\b`, 'gi');
          let match: RegExpExecArray | null;

          while ((match = regex.exec(line)) !== null) {
            this.violations.push({
              file: relativePath,
              line: idx + 1,
              column: match.index + 1,
              term: term,
              context: line.trim(),
              severity: 'MUST_NOT'
            });
          }
        });
      });
    } catch (error) {
      // Skip files that can't be read as text
    }
  }

  private scanDirectory(dir: string, baseDir: string): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(baseDir, fullPath);

      if (entry.isDirectory()) {
        if (!IGNORE_PATTERNS.includes(entry.name)) {
          this.scanDirectory(fullPath, baseDir);
        }
      } else if (entry.isFile() && this.shouldScanFile(fullPath)) {
        this.scanFile(fullPath, relativePath);
      }
    }
  }

  hasViolations(): boolean {
    return this.violations.length > 0;
  }

  generateReport(): string {
    const grouped: Record<string, Violation[]> = {};

    this.violations.forEach(v => {
      if (!grouped[v.file]) grouped[v.file] = [];
      grouped[v.file].push(v);
    });

    let report = `# S11 GUARDRAIL LINT REPORT\n\n`;
    report += `**Scan Date:** ${new Date().toISOString()}\n`;
    report += `**Total Violations:** ${this.violations.length}\n`;
    report += `**Files Affected:** ${Object.keys(grouped).length}\n\n`;

    if (this.violations.length === 0) {
      report += `## ✅ NO VIOLATIONS FOUND\n\n`;
      report += `All scanned files maintain linguistic sterility.\n`;
      return report;
    }

    report += `## 🚨 VIOLATIONS BY FILE\n\n`;

    Object.entries(grouped).forEach(([file, violations]) => {
      report += `### ${file}\n\n`;
      report += `**Count:** ${violations.length}\n\n`;

      violations.forEach(v => {
        report += `- **Line ${v.line}:${v.column}** - Forbidden term: \`${v.term}\`\n`;
        report += `  \`\`\`\n  ${v.context}\n  \`\`\`\n\n`;
      });
    });

    report += `## 📋 SUMMARY BY TERM\n\n`;
    const termCounts: Record<string, number> = {};
    this.violations.forEach(v => {
      termCounts[v.term] = (termCounts[v.term] || 0) + 1;
    });

    Object.entries(termCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([term, count]) => {
        report += `- **${term}**: ${count} occurrences\n`;
      });

    return report;
  }

  scan(targetPath: string = '.'): void {
    const resolvedPath = path.resolve(targetPath);
    const stat = fs.statSync(resolvedPath);

    if (stat.isDirectory()) {
      this.scanDirectory(resolvedPath, resolvedPath);
    } else {
      this.scanFile(resolvedPath, path.basename(resolvedPath));
    }
  }
}

function main(): void {
  const args = process.argv.slice(2);
  const reportOnly = args.includes('--report-only');
  const targetPath = args.find(arg => !arg.startsWith('--')) || '.';

  const scanner = new S11Scanner();
  scanner.scan(targetPath);

  const report = scanner.generateReport();
  console.log(report);

  if (!reportOnly && scanner.hasViolations()) {
    process.exit(1);
  }
}

main();
