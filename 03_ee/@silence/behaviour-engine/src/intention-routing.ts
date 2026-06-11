/**
 * @silence/behaviour-engine — Intention Routing
 * Builds a recommended protocol plan from onboarding intention.
 * S11-compliant: no clinical terms.
 */

import type {
  OnboardingIntention,
  PracticeAnchor,
  ProtocolPriority,
} from '@silence/contracts';
import { mapIntentToProtocolPriorities } from '@silence/contracts';

export interface RecommendedProtocolPlan {
  priorities: ProtocolPriority[];
  anchor: PracticeAnchor;
}

export function buildProtocolPlan(
  intent: OnboardingIntention,
): RecommendedProtocolPlan {
  return {
    priorities: mapIntentToProtocolPriorities(intent.primaryIntent),
    anchor: intent.anchor,
  };
}
