/**
 * [PATH]: 04_packages/@silence/sequences/src/types.ts
 */
export interface SequenceNode {
  type: string;
  archetype?: string;
  intensity: number;
}

export interface SequenceAnalysis {
  hash: string;
  nodes: string[];
  length: number;
}
