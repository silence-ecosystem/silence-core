/**
 * [PATH]: 04_packages/@silence/sentinel/src/guards/tsconfig-strict-guard.ts
 */
import fs from 'fs';
import { glob } from 'glob';

export async function runTsconfigStrictGuard() {
  const files = await glob('**/tsconfig*.json', { ignore: ['**/node_modules/**', '**/dist/**'] });
  const violations = [];

  for (const file of files) {
    if (file.includes('tsconfig.base.json')) continue;
    const content = JSON.parse(fs.readFileSync(file, 'utf8'));
    
    if (content.compilerOptions?.strict === false) {
      violations.push(`${file}: Strict mode flag is off.`);
    }
    if (!content.extends || !content.extends.includes('tsconfig.base.json')) {
      violations.push(`${file}: Does not extend tsconfig.base.json.`);
    }
  }

  if (violations.length > 0) {
    console.error('? TS STRICT VIOLATIONS FOUND:\n' + violations.join('\n'));
    process.exit(1);
  }
  console.log('? All tsconfigs are compliant with SILENCE.OBJECTS standards.');
}
