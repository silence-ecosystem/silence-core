/**
 * [PATH]: 05_apps/garden/components/SignalPanel.tsx
 *
 * Displays JITAI rule signals as gentle nudges.
 * S11-safe: no diagnostic or judgmental language.
 */

import { colors, timing, easing, radius } from '@/lib/tokens';
import type { JitaiSignal } from '@silence/sdk';

interface SignalPanelProps {
  readonly signals: readonly JitaiSignal[];
}

const MESSAGE_MAP: Record<string, string> = {
  streak_sustain: 'Your rhythm is flowing. Sustain the momentum.',
  streak_recover: 'A gentle nudge: your rhythm paused. One breath resets the flow.',
  streak_begin: 'A new seed planted. Welcome back.',
  breath_milestone: 'A quiet milestone reached. The garden notices.',
  completion_nudge: 'The garden awaits your breath. A single cycle is enough.',
  activity_surge: 'Activity surge recognized. Rest is also part of the cycle.',
  activity_low: 'The garden grows slowly. Patience is part of the path.',
  quiet_invite: 'A quiet moment may deepen the calm.',
  rhythm_variance_high: 'Your pattern shifts. The garden adapts with you.',
  quota_near: 'You are approaching the threshold. Pace yourself.',
  inactivity_long: 'The garden holds space for your return.',
  morning_routine: 'Morning light invites a gentle cycle.',
  evening_wind_down: 'Evening calm invites a quiet ritual.',
  weekend_pattern: 'Weekend rhythm detected. The garden stretches with you.',
  attention_deep: 'Depth recognized. A shorter cycle may sustain clarity.',
  attention_surface: 'Surface noted. A longer cycle may deepen the calm.',
  intent_flow: 'Flow state proximity detected. Protect this space.',
  intent_focus: 'Focus requested. A structured cycle supports clarity.',
  intent_calm: 'Calm requested. A slow cycle invites rest.',
  experience_new: 'New journey detected. The garden grows with patience.',
  experience_regular: 'Regular practice recognized. Subtle shifts await.',
  difficulty_high: 'The path feels steep. The garden offers gentler growth.',
  difficulty_low: 'The path feels light. A deeper cycle awaits if you choose.',
  quiet_level_high: 'Deep quiet recognized. The garden glows softly.',
  quiet_level_low: 'Surface quiet noted. A deeper layer awaits.',
};

export default function SignalPanel({ signals }: SignalPanelProps) {
  if (signals.length === 0) return null;

  return (
    <div
      style={{
        margin: '1rem auto',
        maxWidth: 480,
        padding: '0.75rem 1rem',
        borderRadius: radius.md,
        border: `1px solid ${colors.surfaceRaised}`,
        background: colors.surfaceElevated,
        transition: `border-color ${timing.micro}ms ${easing.phiInOut}`,
      }}
      role="region"
      aria-label="Garden signals"
      aria-live="polite"
      aria-atomic="false"
    >
      {signals.map((signal) => (
        <p
          key={signal.ruleId}
          style={{
            margin: '0.25rem 0',
            fontSize: '0.875rem',
            color: signal.priority === 1 ? colors.accentPrimary : colors.textSecondary,
            opacity: signal.priority === 1 ? 0.95 : signal.priority === 2 ? 0.85 : 0.7,
            transition: `color ${timing.micro}ms ${easing.phiInOut}`,
          }}
        >
          {MESSAGE_MAP[signal.messageKey] ?? signal.messageKey}
        </p>
      ))}
    </div>
  );
}
