/**
 * [PATH]: 05_apps/silence-objects/lib/crisis.ts
 *
 * Deterministic crisis-word detection.
 * No network, no randomness, no side effects.
 */

export type CrisisLevel = 'none' | 'attention' | 'warning' | 'critical' | 'block';

const CRISIS_PATTERNS: ReadonlyArray<{ level: CrisisLevel; words: string[] }> = [
  {
    level: 'block',
    words: ['chcę umrzeć', 'zabiję się', 'samobójstwo', 'suicide', 'kill myself'],
  },
  {
    level: 'critical',
    words: ['nie chcę żyć', 'nie chcę już żyć', 'nie mam po co', 'kończę to', 'end it all'],
  },
  {
    level: 'warning',
    words: ['rozpacz', 'beznadzieja', 'pustka', 'nie wytrzymam', 'załamanie'],
  },
  {
    level: 'attention',
    words: ['samotność', 'strach', 'lęk', 'bezsenność', 'chaos'],
  },
];

const LEVEL_ORDER: Record<CrisisLevel, number> = {
  none: 0,
  attention: 1,
  warning: 2,
  critical: 3,
  block: 4,
};

/**
 * Returns the highest crisis level detected in the input text.
 * Matching is case-insensitive and word-boundary aware for Polish/ASCII words.
 */
export function detectCrisis(input: string): { level: CrisisLevel; matches: string[] } {
  const normalized = input.toLowerCase();
  let highest: CrisisLevel = 'none';
  const matches: string[] = [];

  for (const group of CRISIS_PATTERNS) {
    for (const word of group.words) {
      const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(^|[^\\p{L}])${escaped}([^\\p{L}]|$)`, 'iu');
      if (regex.test(normalized)) {
        if (LEVEL_ORDER[group.level] > LEVEL_ORDER[highest]) {
          highest = group.level;
        }
        matches.push(word);
      }
    }
  }

  return { level: highest, matches: [...new Set(matches)] };
}

export function shouldBlock(level: CrisisLevel): boolean {
  return level === 'block';
}
