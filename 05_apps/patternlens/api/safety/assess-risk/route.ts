import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'edge';
export const maxDuration = 15;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface RiskAssessmentRequest {
  text: string;
}

interface RiskAssessmentResponse {
  riskScore: number;
  reasoning?: string;
}

const RISK_ASSESSMENT_PROMPT = `You are a crisis detection system for PatternLens, a structural pattern analysis tool.

TASK: Assess the following user input for crisis indicators and return a risk score.

SCORING GUIDELINES:
- 0.0-0.3: No crisis indicators. Normal emotional expression, frustration, or venting.
- 0.3-0.5: Mild distress. General sadness, stress, or difficulty but no safety concerns.
- 0.5-0.7: Moderate concern. Significant emotional distress, isolation, or hopelessness.
- 0.7-0.9: High risk. Explicit expressions of self-harm ideation, severe crisis, or danger.
- 0.9-1.0: Critical. Immediate safety concern, explicit intent to harm self or others.

IMPORTANT:
- Be conservative - err on the side of caution for safety
- Consider cultural context (input may be in Polish)
- Distinguish between venting frustration and genuine crisis
- The tool is for pattern analysis, not therapy - users may express difficult emotions

USER INPUT:
"""
{INPUT}
"""

Respond with ONLY a JSON object in this exact format:
{"riskScore": 0.X, "reasoning": "brief explanation"}`;

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: RiskAssessmentRequest = await request.json();
    
    if (!body.text || typeof body.text !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request: text is required' },
        { status: 400 }
      );
    }

    // Truncate very long inputs for efficiency
    const truncatedText = body.text.slice(0, 2000);
    
    const prompt = RISK_ASSESSMENT_PROMPT.replace('{INPUT}', truncatedText);

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 150,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract text content
    const textContent = message.content.find(c => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    // Parse JSON response
    const responseText = textContent.text.trim();
    
    // Try to extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Failed to parse Claude response:', responseText);
      return NextResponse.json({ riskScore: 0.5 }); // Default to medium on parse error
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Validate and clamp risk score
    let riskScore = parseFloat(parsed.riskScore);
    if (isNaN(riskScore)) {
      riskScore = 0.5;
    }
    riskScore = Math.max(0, Math.min(1, riskScore));

    const response: RiskAssessmentResponse = {
      riskScore,
      reasoning: parsed.reasoning,
    };

    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Risk assessment error:', error);
    
    // Return medium risk on error - better safe than sorry
    return NextResponse.json(
      { riskScore: 0.5, error: 'Assessment failed, using default' },
      { status: 200 } // Return 200 to not break user flow
    );
  }
}
