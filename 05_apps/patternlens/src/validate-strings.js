#!/usr/bin/env node
/**
 * PATTERNLENS LANGUAGE VALIDATOR
 * 
 * Run: node validate-strings.js ./src
 * 
 * Scans all .tsx/.ts files for:
 * - Forbidden vocabulary (therapy, wellness, etc.)
 * - English strings that should be Polish
 * - Missing translations
 */

const fs = require('fs');
const path = require('path');

// ============ FORBIDDEN PATTERNS ============
const FORBIDDEN = [
  // Therapy/Medical
  /\btherap(y|eutic|ist)\b/gi,
  /\bdiagnos(is|tic|e)\b/gi,
  /\btreat(ment|ing)?\b/gi,
  /\bmedical\b/gi,
  /\bclinical\b/gi,
  /\bmental health\b/gi,
  /\bwellness\b/gi,
  /\bwellbeing\b/gi,
  /\bhealing?\b/gi,
  /\bcure\b/gi,
  /\btrauma\b/gi,
  /\banxiety\b/gi,
  /\bdepression\b/gi,
  
  // Advice
  /\byou should\b/gi,
  /\btry to\b/gi,
  /\bconsider\b/gi,
  /\bI recommend\b/gi,
  
  // Encouragement
  /\bgreat job\b/gi,
  /\bwell done\b/gi,
  /\bcongratulations\b/gi,
  /\bproud of you\b/gi,
  
  // Support
  /\bhelp you\b/gi,
  /\bsupport you\b/gi,
  /\bfeel better\b/gi,
  /\bcope\b/gi,
  /\brelief\b/gi,
];

// ============ ENGLISH PATTERNS THAT SHOULD BE POLISH ============
const ENGLISH_UI_STRINGS = [
  /\bRECENT OBJECTS\b/g,
  /\bTRUST & SAFETY\b/g,
  /\bConstruct Interpretation\b/g,
  /\bDescribe the pattern\b/g,
  /\bMinimum \d+ characters\b/g,
  /\bPage not found\b/g,
  /\bGo back\b/g,
  /\bSubmit\b/g,
  /\bCancel\b/g,
  /\bSave\b/g,
  /\bDelete\b/g,
  /\bExport\b/g,
  /\bSettings\b/g,
  /\bArchive\b/g,
  /\bDashboard\b/g,
  /\bLogout\b/g,
];

// ============ SCANNER ============
function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const issues = [];
  
  // Check forbidden words
  for (const pattern of FORBIDDEN) {
    const matches = content.match(pattern);
    if (matches) {
      matches.forEach(match => {
        issues.push({
          type: 'FORBIDDEN',
          severity: 'ERROR',
          match,
          file: filePath,
        });
      });
    }
  }
  
  // Check English strings (only in JSX/string contexts)
  // Skip if in comments or imports
  const jsxContent = content
    .replace(/\/\/.*$/gm, '')  // Remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')  // Remove multi-line comments
    .replace(/import.*from.*/g, '');  // Remove imports
  
  for (const pattern of ENGLISH_UI_STRINGS) {
    const matches = jsxContent.match(pattern);
    if (matches) {
      matches.forEach(match => {
        issues.push({
          type: 'ENGLISH_STRING',
          severity: 'WARNING',
          match,
          file: filePath,
        });
      });
    }
  }
  
  return issues;
}

function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.startsWith('.')) {
        walkDir(filePath, fileList);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

// ============ MAIN ============
function main() {
  const targetDir = process.argv[2] || './src';
  
  if (!fs.existsSync(targetDir)) {
    console.error(`Directory not found: ${targetDir}`);
    process.exit(1);
  }
  
  console.log('🔍 PATTERNLENS LANGUAGE VALIDATOR\n');
  console.log(`Scanning: ${targetDir}\n`);
  
  const files = walkDir(targetDir);
  let totalErrors = 0;
  let totalWarnings = 0;
  
  for (const file of files) {
    const issues = scanFile(file);
    
    if (issues.length > 0) {
      console.log(`\n📁 ${file}`);
      
      for (const issue of issues) {
        if (issue.severity === 'ERROR') {
          console.log(`   ❌ FORBIDDEN: "${issue.match}"`);
          totalErrors++;
        } else {
          console.log(`   ⚠️  ENGLISH: "${issue.match}"`);
          totalWarnings++;
        }
      }
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`\n📊 SUMMARY:`);
  console.log(`   Files scanned: ${files.length}`);
  console.log(`   Errors (forbidden): ${totalErrors}`);
  console.log(`   Warnings (English): ${totalWarnings}`);
  
  if (totalErrors > 0) {
    console.log('\n❌ VALIDATION FAILED\n');
    process.exit(1);
  } else if (totalWarnings > 0) {
    console.log('\n⚠️  VALIDATION PASSED WITH WARNINGS\n');
    process.exit(0);
  } else {
    console.log('\n✅ VALIDATION PASSED\n');
    process.exit(0);
  }
}

main();
