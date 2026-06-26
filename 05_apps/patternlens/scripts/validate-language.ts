/**
 * PatternLens Language Compliance Validator
 * ZERO TOLERANCE for forbidden vocabulary
 * 
 * Usage:
 *   npx ts-node scripts/validate-language.ts
 *   npm run validate:language
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// ============================================
// FORBIDDEN VOCABULARY
// ============================================

const FORBIDDEN_TERMS = {
  // Polish - CRITICAL
  terapia: 'narzędzie konstrukcyjne',
  terapeutyczny: 'analityczny',
  diagnoza: 'analiza strukturalna',
  diagnozować: 'analizować',
  leczenie: 'proces konstrukcyjny',
  leczyć: 'konstruować',
  wellness: 'samopomoc strukturalna',
  dobrostan: 'równowaga strukturalna',
  psycholog: 'specjalista',
  psychiatra: 'specjalista medyczny',
  terapeuta: 'konsultant',
  pacjent: 'użytkownik',
  
  // English - CRITICAL
  therapy: 'structural tool',
  therapeutic: 'analytical',
  diagnosis: 'structural analysis',
  diagnose: 'analyze',
  treatment: 'construction process',
  treat: 'construct',
  healing: 'structural work',
  cure: 'resolution',
  therapist: 'consultant',
  psychologist: 'specialist',
  psychiatrist: 'medical specialist',
  patient: 'user',
  
  // Marketing terms to avoid
  'mental health app': 'structural analysis tool',
  'self-care': 'self-construction',
  mindfulness: 'structural awareness',
  meditation: 'focused analysis',
} as const;

// Files/directories to ignore
const IGNORE_PATTERNS = [
  '**/node_modules/**',
  '**/.next/**',
  '**/dist/**',
  '**/coverage/**',
  '**/*.test.ts',
  '**/*.test.tsx',
  '**/*.spec.ts',
  '**/*.spec.tsx',
  '**/validate-language.ts', // This file
  '**/SKILL.md',
  '**/*.md', // Documentation can discuss terminology
];

// File extensions to check
const CHECK_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.json'];

// ============================================
// INTERFACES
// ============================================

interface Violation {
  file: string;
  line: number;
  column: number;
  term: string;
  suggestion: string;
  context: string;
}

interface ValidationResult {
  success: boolean;
  violations: Violation[];
  filesChecked: number;
  timestamp: string;
}

// ============================================
// VALIDATOR
// ============================================

class LanguageComplianceValidator {
  private violations: Violation[] = [];
  private filesChecked = 0;

  async validate(srcDir: string): Promise<ValidationResult> {
    this.violations = [];
    this.filesChecked = 0;

    // Find all files to check
    const files = await glob(`${srcDir}/**/*{${CHECK_EXTENSIONS.join(',')}}`, {
      ignore: IGNORE_PATTERNS,
    });

    for (const file of files) {
      await this.checkFile(file);
    }

    return {
      success: this.violations.length === 0,
      violations: this.violations,
      filesChecked: this.filesChecked,
      timestamp: new Date().toISOString(),
    };
  }

  private async checkFile(filePath: string): Promise<void> {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    
    this.filesChecked++;

    // Check each line
    lines.forEach((line, lineIndex) => {
      // Skip comments
      if (this.isComment(line)) return;

      // Check for forbidden terms
      for (const [forbidden, suggestion] of Object.entries(FORBIDDEN_TERMS)) {
        const regex = new RegExp(`\\b${this.escapeRegex(forbidden)}\\b`, 'gi');
        let match: RegExpExecArray | null;

        while ((match = regex.exec(line)) !== null) {
          this.violations.push({
            file: filePath,
            line: lineIndex + 1,
            column: match.index + 1,
            term: match[0],
            suggestion,
            context: this.getContext(line, match.index),
          });
        }
      }
    });
  }

  private isComment(line: string): boolean {
    const trimmed = line.trim();
    return (
      trimmed.startsWith('//') ||
      trimmed.startsWith('/*') ||
      trimmed.startsWith('*') ||
      trimmed.startsWith('<!--')
    );
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private getContext(line: string, index: number): string {
    const start = Math.max(0, index - 20);
    const end = Math.min(line.length, index + 30);
    let context = line.slice(start, end).trim();
    
    if (start > 0) context = '...' + context;
    if (end < line.length) context = context + '...';
    
    return context;
  }
}

// ============================================
// REPORTER
// ============================================

function formatReport(result: ValidationResult): string {
  const lines: string[] = [];
  
  lines.push('');
  lines.push('╔═══════════════════════════════════════════════════════════════╗');
  lines.push('║        PATTERNLENS LANGUAGE COMPLIANCE REPORT                 ║');
  lines.push('╚═══════════════════════════════════════════════════════════════╝');
  lines.push('');
  lines.push(`📁 Files checked: ${result.filesChecked}`);
  lines.push(`🕐 Timestamp: ${result.timestamp}`);
  lines.push('');

  if (result.success) {
    lines.push('✅ NO VIOLATIONS FOUND');
    lines.push('');
    lines.push('All files comply with language guidelines.');
  } else {
    lines.push(`❌ ${result.violations.length} VIOLATION(S) FOUND`);
    lines.push('');
    lines.push('─'.repeat(65));
    
    // Group by file
    const byFile = new Map<string, Violation[]>();
    for (const v of result.violations) {
      const existing = byFile.get(v.file) ?? [];
      byFile.set(v.file, [...existing, v]);
    }

    for (const [file, violations] of byFile) {
      lines.push('');
      lines.push(`📄 ${file}`);
      
      for (const v of violations) {
        lines.push(`   Line ${v.line}:${v.column}`);
        lines.push(`   ❌ Found: "${v.term}"`);
        lines.push(`   ✅ Use:   "${v.suggestion}"`);
        lines.push(`   Context: ${v.context}`);
        lines.push('');
      }
    }

    lines.push('─'.repeat(65));
    lines.push('');
    lines.push('⚠️  BUILD BLOCKED - Fix all violations before deployment');
    lines.push('');
    lines.push('Language compliance is MANDATORY for PatternLens.');
    lines.push('See: docs/LANGUAGE_GUIDELINES.md');
  }

  lines.push('');
  return lines.join('\n');
}

// ============================================
// MAIN
// ============================================

async function main(): Promise<void> {
  const srcDir = process.argv[2] ?? './src';
  
  console.log('🔍 PatternLens Language Compliance Check');
  console.log(`   Scanning: ${srcDir}`);
  console.log('');

  const validator = new LanguageComplianceValidator();
  const result = await validator.validate(srcDir);

  console.log(formatReport(result));

  // Write report to file
  const reportPath = './language-compliance-report.json';
  await fs.promises.writeFile(reportPath, JSON.stringify(result, null, 2));
  console.log(`📝 Report saved: ${reportPath}`);

  // Exit with error code if violations found
  process.exit(result.success ? 0 : 1);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

// ============================================
// EXPORTS (for programmatic use)
// ============================================

export {
  LanguageComplianceValidator,
  FORBIDDEN_TERMS,
  type Violation,
  type ValidationResult,
};
