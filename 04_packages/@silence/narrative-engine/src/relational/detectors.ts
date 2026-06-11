/**
 * [PATH]: 04_packages/@silence/narrative-engine/src/relational/detectors.ts
 * Relational detectors – wykrywanie wzorców interakcji bez etykiet emocjonalnych.
 * Research: Pattern analysis in asymmetric communication [web:391].
 */
export interface RelationalTurn {
  actor: 'self' | 'other';
  timestamp: string;
}

export interface RelationalPatternFlags {
  oneSidedInitiation?: boolean;
  delayedResponsePattern?: boolean;
}

export function detectRelationalPatterns(turns: RelationalTurn[]): RelationalPatternFlags {
  if (turns.length < 2) return {};

  let selfStarts = 0;
  let otherStarts = 0;
  let delays = 0;

  for (let i = 0; i < turns.length; i++) {
    if (i === 0 && turns[i].actor === 'self') selfStarts++;
    if (i > 0) {
      const gap = new Date(turns[i].timestamp).getTime() - new Date(turns[i-1].timestamp).getTime();
      if (gap > 1000 * 60 * 60 * 2) delays++; // Gap > 2h
    }
  }

  return {
    oneSidedInitiation: selfStarts > otherStarts,
    delayedResponsePattern: delays > 1
  };
}
