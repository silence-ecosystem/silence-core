/**
 * [PATH]: 04_packages/@silence/narrative-engine/src/commentary.ts
 */
﻿import { SituationSummaryInput, SituationCommentary } from '@silence/contracts';
import { detectRelationalPatterns } from './relational/detectors';

export class NarrativeEngine {
  static generateCommentary(input: SituationSummaryInput): SituationCommentary {
    const patterns = detectRelationalPatterns(input.relationalTurns || []);
    
    let summary = `Zarejestrowano interakcję w roli: ${input.relationalContext.selfRole}. `;
    let patternExplanation = `Wykryte wzorce strukturalne: ${input.patternLabels.join(', ')}. `;
    
    if (patterns.oneSidedInitiation) {
      patternExplanation += "Zauważono wysoką asymetrię inicjatywy po Twojej stronie. ";
    }

    return {
      objectId: input.objectId,
      summary,
      patternExplanation,
      relationalAngle: patterns.delayedResponsePattern ? "Dynamika charakteryzuje się wydłużoną latencją odpowiedzi." : undefined,
      disclaimers: ['Not advice', 'Structural analysis only']
    };
  }
}
