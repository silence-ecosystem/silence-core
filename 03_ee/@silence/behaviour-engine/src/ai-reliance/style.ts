export type AiRelianceStyle = 'passive' | 'balanced' | 'co_creation';
export interface AiInteractionEvent {
  timestamp: string;
  type: 'prompt' | 'edit' | 'regenerate' | 'combine';
  userTokens: number;
  aiTokens: number;
}
export interface AiRelianceScores {
  style: AiRelianceStyle;
  passivityScore: number; 
  coCreationScore: number;
}
export function computeAiRelianceStyle(events: AiInteractionEvent[]): AiRelianceScores {
  if (events.length === 0) return { style: 'balanced', passivityScore: 0.5, coCreationScore: 0.5 };
  let edits = 0, prompts = 0, combines = 0;
  for (const e of events) {
    if (e.type === 'prompt' || e.type === 'regenerate') prompts++;
    if (e.type === 'edit') edits++;
    if (e.type === 'combine') combines++;
  }
  const total = prompts + edits + combines;
  const coCreation = total > 0 ? Math.min(1, (edits + combines) / total) : 0.5;
  const passivity = 1 - coCreation;
  let style: AiRelianceStyle = 'balanced';
  if (coCreation > 0.6) style = 'co_creation';
  else if (passivity > 0.6) style = 'passive';
  return { style, passivityScore: passivity, coCreationScore: coCreation };
}