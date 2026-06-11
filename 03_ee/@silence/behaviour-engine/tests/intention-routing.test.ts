import { describe, it, expect } from 'vitest';
import { buildProtocolPlan } from '../src/intention-routing';
import { OnboardingIntention } from '@silence/contracts/intention';

describe('Behavioural Engine Routing', () => {
  it('should build a plan correctly from onboarding data', () => {
    const mockIntent: OnboardingIntention = {
      userId: 'user-123',
      primaryIntent: 'calmer_days',
      experience: 'occasional',
      anchor: 'during_tension',
      createdAt: new Date().toISOString()
    };

    const plan = buildProtocolPlan(mockIntent);
    expect(plan.anchor).toBe('during_tension');
    expect(plan.priorities[0].protocol).toBe('VAGAL_TONE');
  });
});
