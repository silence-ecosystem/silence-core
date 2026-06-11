/**
 * [PATH]: 04_packages/@silence/narrative-engine/src/relational/co_regulation.ts
 */
import { RelationalTurn } from './detectors';
export interface CoRegulationScores {
  symmetryScore: number;   // 0–1, 1 = idealnie symetryczna wymiana
  turnTakingScore: number; // 0–1, 1 = płynne naprzemienne wypowiedzi
}
export function computeCoRegulation(turns: RelationalTurn[]): CoRegulationScores {
  if (turns.length < 2) return { symmetryScore: 0.5, turnTakingScore: 0.5 };
  let selfTurns = 0, otherTurns = 0, alternations = 0;
  for (let i = 0; i < turns.length; i++) {
    const t = turns[i];
    if (t.actor === 'self') selfTurns++; else otherTurns++;
    if (i > 0 && turns[i].actor !== turns[i - 1].actor) alternations++;
  }
  const total = selfTurns + otherTurns;
  const symmetry = total > 0 ? 1 - Math.abs(selfTurns - otherTurns) / total : 0.5;
  const turnTaking = (turns.length - 1) > 0 ? alternations / (turns.length - 1) : 0.5;
  return { symmetryScore: symmetry, turnTakingScore: turnTaking };
}
