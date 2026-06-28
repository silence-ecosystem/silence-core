#!/usr/bin/env node

/**
 * Nuclear Framework Safety Check Pipeline
 * Verifies production readiness before deployment
 * 
 * Checks:
 * 1. Code quality (lint + types)
 * 2. Build success
 * 3. Database migrations ready
 * 4. Environment variables configured
 * 5. Security compliance (GDPR)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    log(`✓ ${description}`, 'green');
    return true;
  } else {
    log(`✗ ${description} (missing)`, 'red');
    return false;
  }
}

function runCommand(cmd, description) {
  try {
    log(`⏳ ${description}...`, 'cyan');
    execSync(cmd, { stdio: 'inherit' });
    log(`✓ ${description}`, 'green');
    return true;
  } catch {
    log(`✗ ${description} failed`, 'red');
    return false;
  }
}

async function main() {
  log('\n╔═══════════════════════════════════════════════════════════════╗', 'cyan');
  log('║     NUCLEAR FRAMEWORK - PRODUCTION SAFETY CHECK PIPELINE     ║', 'cyan');
  log('╚═══════════════════════════════════════════════════════════════╝\n', 'cyan');

  const checks = [];
  
  // 1. CODE QUALITY
  log('1. CODE QUALITY CHECKS', 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  checks.push(runCommand('npm run lint -- --max-warnings 0', 'ESLint validation'));
  
  // 2. TYPE SAFETY
  log('\n2. TYPESCRIPT TYPE SAFETY', 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  try {
    log('⏳ TypeScript strict mode check...', 'cyan');
    execSync('npx tsc --noEmit --strict', { stdio: 'pipe' });
    log('✓ TypeScript strict mode check', 'green');
    checks.push(true);
  } catch {
    log('✗ TypeScript errors detected', 'red');
    checks.push(false);
  }

  // 3. BUILD VERIFICATION
  log('\n3. BUILD VERIFICATION', 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  checks.push(runCommand('npm run build', 'Production build test'));

  // 4. FILE STRUCTURE
  log('\n4. CRITICAL FILES VALIDATION', 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  checks.push(checkFile('src/app/api/objects/interpret/route.ts', 'Production interpret endpoint'));
  checks.push(checkFile('src/lib/consent/verify.ts', 'Consent verification module'));
  checks.push(checkFile('src/lib/database/object-creation.ts', 'Atomic database operations'));
  checks.push(checkFile('supabase/migrations/003_atomic_object_creation.sql', 'Database migration'));

  // 5. ENVIRONMENT VARIABLES
  log('\n5. ENVIRONMENT CONFIGURATION', 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'ANTHROPIC_API_KEY',
    'STRIPE_SECRET_KEY'
  ];
  
  let envValid = true;
  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      log(`✓ ${envVar} configured`, 'green');
    } else {
      log(`✗ ${envVar} missing`, 'yellow');
      envValid = false;
    }
  }
  checks.push(envValid);

  // 6. GIT STATUS
  log('\n6. VERSION CONTROL STATUS', 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  try {
    const status = execSync('git status --short', { encoding: 'utf-8' });
    if (status.trim() === '') {
      log('✓ Working directory clean', 'green');
      checks.push(true);
    } else {
      log(`⚠ Uncommitted changes detected:\n${status}`, 'yellow');
      checks.push(false);
    }
  } catch {
    log('✗ Git status check failed', 'red');
    checks.push(false);
  }

  // 7. SECURITY COMPLIANCE
  log('\n7. SECURITY & COMPLIANCE', 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  checks.push(checkFile('src/lib/constants/crisis-keywords.ts', 'Crisis detection system'));
  
  // Check for GDPR compliance markers in interpret endpoint
  const interpretRoute = fs.readFileSync('src/app/api/objects/interpret/route.ts', 'utf-8');
  if (interpretRoute.includes('verifyUserConsents') && interpretRoute.includes('logToAudit')) {
    log('✓ GDPR consent verification integrated', 'green');
    log('✓ Audit logging implemented', 'green');
    checks.push(true);
    checks.push(true);
  } else {
    log('✗ GDPR compliance checks missing', 'red');
    checks.push(false);
    checks.push(false);
  }

  // SUMMARY
  const passed = checks.filter(c => c === true).length;
  const total = checks.length;
  const percentage = Math.round((passed / total) * 100);

  log('\n╔═══════════════════════════════════════════════════════════════╗', 'cyan');
  log(`║${' '.repeat(20)}SAFETY CHECK RESULTS${' '.repeat(25)}║`, 'cyan');
  log('╠═══════════════════════════════════════════════════════════════╣', 'cyan');
  log(`║ Passed: ${passed}/${total} (${percentage}%)${' '.repeat(53 - String(passed).length - String(total).length - String(percentage).length)}║`, passed === total ? 'green' : 'yellow');
  log('╚═══════════════════════════════════════════════════════════════╝\n', 'cyan');

  if (passed === total) {
    log('✓ All safety checks passed! Ready for deployment.', 'green');
    log('⏭  Run: npm run deploy:nuclear:production', 'cyan');
    process.exit(0);
  } else {
    log(`✗ ${total - passed} check(s) failed. Fix issues before deploying.`, 'red');
    process.exit(1);
  }
}

main().catch(error => {
  log(`\n✗ Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
