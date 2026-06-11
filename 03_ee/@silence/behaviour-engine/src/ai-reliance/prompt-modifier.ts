import { UserInteractionPreferences } from '@silence/contracts';

export function modifySystemPrompt(basePrompt: string, prefs: UserInteractionPreferences): string {
  if (!prefs.activeCoCreateMode) return basePrompt;

  return `${basePrompt}
    CRITICAL INSTRUCTION: ACTIVE CO-CREATE MODE ENABLED.
    1. NEVER provide a final, completed result or "gotowiec".
    2. ALWAYS provide a structural scaffold (placeholders, bullet points, decision trees).
    3. ASK the user to fill in the critical thinking parts.
    4. Goal: Minimize user cognitive inertia and maximize brain plasticity.`;
}
