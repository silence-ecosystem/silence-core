import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCrisisDetection } from '../src/hooks/useCrisisDetection';

describe('useCrisisDetection', () => {
  describe('Layer 1: Keyword Detection', () => {
    it('detects CRITICAL suicide keywords in English', () => {
      const { result } = renderHook(() => useCrisisDetection());
      
      const analysis = result.current.analyzeText('I want to kill myself');
      
      expect(analysis.riskAssessment.level).toBe('CRITICAL');
      expect(analysis.riskAssessment.requiresIntervention).toBe(true);
      expect(analysis.shouldShowModal).toBe(true);
    });

    it('detects CRITICAL suicide keywords in Polish', () => {
      const { result } = renderHook(() => useCrisisDetection());
      
      const analysis = result.current.analyzeText('Chcę popełnić samobójstwo');
      
      expect(analysis.riskAssessment.level).toBe('CRITICAL');
      expect(analysis.riskAssessment.requiresIntervention).toBe(true);
    });

    it('detects CRITICAL self-harm keywords', () => {
      const { result } = renderHook(() => useCrisisDetection());
      
      const analysis = result.current.analyzeText('I keep hurting myself');
      
      expect(analysis.riskAssessment.level).toBe('CRITICAL');
    });

    it('detects HIGH severity distress keywords', () => {
      const { result } = renderHook(() => useCrisisDetection());
      
      const analysis = result.current.analyzeText('I feel completely hopeless and worthless');
      
      expect(['HIGH', 'CRITICAL']).toContain(analysis.riskAssessment.level);
      expect(analysis.riskAssessment.requiresIntervention).toBe(true);
    });

    it('detects MEDIUM severity keywords', () => {
      const { result } = renderHook(() => useCrisisDetection());
      
      const analysis = result.current.analyzeText('I relapsed and started using again');
      
      expect(analysis.riskAssessment.level).toBe('MEDIUM');
    });

    it('returns LOW for safe content', () => {
      const { result } = renderHook(() => useCrisisDetection());
      
      const analysis = result.current.analyzeText('Today was a good day at work');
      
      expect(analysis.riskAssessment.level).toBe('LOW');
      expect(analysis.riskAssessment.requiresIntervention).toBe(false);
      expect(analysis.shouldShowModal).toBe(false);
    });
  });

  describe('Layer 2: Pattern Analysis', () => {
    it('reduces severity for past tense references', () => {
      const { result } = renderHook(() => useCrisisDetection());
      
      const analysis = result.current.analyzeText(
        'Years ago when I was depressed I used to feel hopeless'
      );
      
      // Should be lower than immediate distress
      expect(['LOW', 'MEDIUM']).toContain(analysis.riskAssessment.level);
    });

    it('reduces severity for negation patterns', () => {
      const { result } = renderHook(() => useCrisisDetection());
      
      const analysis = result.current.analyzeText(
        'I never want to hurt myself and I refuse to give up'
      );
      
      // Negation should reduce perceived risk
      expect(analysis.riskAssessment.score).toBeLessThan(70);
    });

    it('increases severity for intensity markers', () => {
      const { result } = renderHook(() => useCrisisDetection());
      
      const analysis = result.current.analyzeText(
        'I feel really seriously hopeless right now today'
      );
      
      expect(['HIGH', 'CRITICAL']).toContain(analysis.riskAssessment.level);
    });
  });

  describe('Layer 3: Context Evaluation', () => {
    it('escalates severity for multiple triggers', () => {
      const { result } = renderHook(() => useCrisisDetection());
      
      const analysis = result.current.analyzeText(
        'I feel hopeless and worthless. Nobody cares about me. I am trapped.'
      );
      
      // Multiple triggers should increase severity
      expect(analysis.riskAssessment.triggers.length).toBeGreaterThanOrEqual(2);
    });

    it('captures context around keywords', () => {
      const { result } = renderHook(() => useCrisisDetection());
      
      const analysis = result.current.analyzeText(
        'Last night I was thinking about how I want to end it all'
      );
      
      expect(analysis.riskAssessment.triggers.length).toBeGreaterThan(0);
      expect(analysis.riskAssessment.triggers[0]?.context).toBeDefined();
    });
  });

  describe('Crisis Resources', () => {
    it('provides Polish resources by default', () => {
      const { result } = renderHook(() => useCrisisDetection());
      
      expect(result.current.resources.length).toBeGreaterThan(0);
      expect(result.current.resources[0]?.country).toBe('PL');
    });

    it('provides resources for specified country', () => {
      const { result } = renderHook(() => 
        useCrisisDetection({ countryCode: 'US' })
      );
      
      expect(result.current.resources[0]?.country).toBe('US');
    });

    it('includes crisis resources in CRITICAL analysis', () => {
      const { result } = renderHook(() => useCrisisDetection());
      
      const analysis = result.current.analyzeText('I want to kill myself');
      
      expect(analysis.resources.length).toBeGreaterThan(0);
    });
  });

  describe('Callbacks', () => {
    it('calls onCrisisDetected for HIGH/CRITICAL cases', () => {
      const onCrisisDetected = vi.fn();
      const { result } = renderHook(() => 
        useCrisisDetection({ onCrisisDetected })
      );
      
      result.current.analyzeText('I want to end my life');
      
      expect(onCrisisDetected).toHaveBeenCalledTimes(1);
      expect(onCrisisDetected).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'CRITICAL',
          requiresIntervention: true,
        })
      );
    });

    it('does not call onCrisisDetected for LOW cases', () => {
      const onCrisisDetected = vi.fn();
      const { result } = renderHook(() => 
        useCrisisDetection({ onCrisisDetected })
      );
      
      result.current.analyzeText('I had a good day today');
      
      expect(onCrisisDetected).not.toHaveBeenCalled();
    });
  });

  describe('UI Helpers', () => {
    it('returns correct badge colors', () => {
      const { result } = renderHook(() => useCrisisDetection());
      
      expect(result.current.getRiskBadgeColor('LOW')).toContain('green');
      expect(result.current.getRiskBadgeColor('MEDIUM')).toContain('yellow');
      expect(result.current.getRiskBadgeColor('HIGH')).toContain('orange');
      expect(result.current.getRiskBadgeColor('CRITICAL')).toContain('red');
    });

    it('returns correct badge text in Polish', () => {
      const { result } = renderHook(() => useCrisisDetection());
      
      expect(result.current.getRiskBadgeText('LOW')).toBe('Niskie ryzyko');
      expect(result.current.getRiskBadgeText('CRITICAL')).toBe('Krytyczne');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty text', () => {
      const { result } = renderHook(() => useCrisisDetection());
      
      const analysis = result.current.analyzeText('');
      
      expect(analysis.riskAssessment.level).toBe('LOW');
    });

    it('handles very long text', () => {
      const { result } = renderHook(() => useCrisisDetection());
      
      const longText = 'This is safe content. '.repeat(500);
      const analysis = result.current.analyzeText(longText);
      
      expect(analysis.riskAssessment.level).toBe('LOW');
    });

    it('handles special characters', () => {
      const { result } = renderHook(() => useCrisisDetection());
      
      const analysis = result.current.analyzeText(
        'Życie jest ciężkie... ale daję radę! 💪'
      );
      
      expect(analysis.riskAssessment.level).toBe('LOW');
    });

    it('handles mixed language content', () => {
      const { result } = renderHook(() => useCrisisDetection());
      
      const analysis = result.current.analyzeText(
        'I feel hopeless - czuję się beznadziejnie'
      );
      
      // Should detect keywords in both languages
      expect(analysis.riskAssessment.triggers.length).toBeGreaterThan(0);
    });
  });
});
