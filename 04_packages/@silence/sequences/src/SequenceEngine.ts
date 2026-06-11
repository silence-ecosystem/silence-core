/**
 * [PATH]: 04_packages/@silence/sequences/src/SequenceEngine.ts
 */
import { SequenceNode, SequenceAnalysis } from './types';
import { createHash } from 'crypto';

export class SequenceEngine {
  /**
   * Wyciaga N-gramy (sekwencje o dlugosci n) ze strumienia zdarzen.
   */
  static extractNgrams(nodes: SequenceNode[], n: number): SequenceAnalysis[] {
    const results: SequenceAnalysis[] = [];
    
    for (let i = 0; i <= nodes.length - n; i++) {
      const window = nodes.slice(i, i + n);
      const nodeTypes = window.map(node => `${node.type}:${node.archetype || 'none'}`);
      
      // Tworzenie unikalnego hasha dla sekwencji
      const hash = createHash('sha256')
        .update(nodeTypes.join('->'))
        .digest('hex')
        .substring(0, 12);

      results.push({
        hash,
        nodes: nodeTypes,
        length: n
      });
    }
    
    return results;
  }

  /**
   * Wykrywa powtarzalne petle (loops) w sekwencji.
   */
  static detectLoops(ngrams: SequenceAnalysis[]): SequenceAnalysis[] {
    const seen = new Set<string>();
    return ngrams.filter(item => {
      if (seen.has(item.hash)) return true;
      seen.add(item.hash);
      return false;
    });
  }
}
