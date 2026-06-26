// ===========================================
// SILENCE.OBJECTS - Claude Integration (v5.0 PASSIVE)
// ===========================================
// Dual-lens structural interpretation via Claude API.
// NO risk assessment (PASSIVE mode — hard keyword match only).

import Anthropic from '@anthropic-ai/sdk';

const CLAUDE_MODEL = 'claude-3-5-sonnet-20241022';

const FORBIDDEN = ['terapia','diagnoza','leczenie','wellness','powinieneś','musisz','spróbuj','polecam','świetnie','dobra robota','therapy','diagnosis','treatment','you should','try to','great job'];

const PROMPT = `SILENCE.OBJECTS FRAMEWORK:
You are a STRUCTURAL PATTERN ANALYST. Output HYPOTHESES, not advice.
FORBIDDEN: therapy-speak, advice, diagnosis, praise, wellness language.
REQUIRED STRUCTURE (JSON):
{"phase1Context":"...","phase2Tension":"...","phase3Meaning":"...","phase4Function":"...","patternTheme":"work|relationship|conflict|personal|other","confidenceScore":0.0-1.0}
Frame as: "This interpretation proposes..." End with: "One possible interpretation for verification."
Language: Polish unless English input.`;

export interface InterpretationPhases {
  phase1Context: string;
  phase2Tension: string;
  phase3Meaning: string;
  phase4Function: string;
  patternTheme: string;
  confidenceScore: number;
}

export interface DualLensResult {
  lensA: InterpretationPhases;
  lensB: InterpretationPhases;
  generatedAt: string;
}

export class ClaudeIntegrationService {
  private client: Anthropic;
  constructor() { this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! }); }

  async generateDualLensInterpretation(text: string): Promise<DualLensResult> {
    const [lensA, lensB] = await Promise.all([this.genLens(text, 'A'), this.genLens(text, 'B')]);
    if (!this.validate(JSON.stringify(lensA)).isValid || !this.validate(JSON.stringify(lensB)).isValid) throw new Error('Validation failed');
    return { lensA, lensB, generatedAt: new Date().toISOString() };
  }

  private async genLens(text: string, lens: 'A' | 'B'): Promise<InterpretationPhases> {
    const instruction = lens === 'A' ? 'Focus on EXTERNAL factors.' : 'Focus on INTERNAL factors.';
    const res = await this.client.messages.create({ model: CLAUDE_MODEL, max_tokens: 2000, messages: [{ role: 'user', content: `${PROMPT}\nLENS ${lens}: ${instruction}\nTEXT:\n${text}` }] });
    const txt = res.content.find(c => c.type === 'text');
    if (!txt || txt.type !== 'text') throw new Error('No response');
    const json = txt.text.match(/\{[\s\S]*\}/);
    if (!json) throw new Error('No JSON');
    return JSON.parse(json[0]);
  }

  validate(content: string) { const v = FORBIDDEN.filter(f => content.toLowerCase().includes(f.toLowerCase())); return { isValid: v.length === 0, violations: v }; }
}
export const claudeService = new ClaudeIntegrationService();
