'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useEffectLog } from '@/hooks/useEffectLog';
import { trackSilenceEvent } from '@silence/sdk';
import { colors, timing, easing, radius } from '@/lib/tokens';

export default function QuietPage() {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [quietLevel, setQuietLevel] = useState<number | null>(null);
  const { ready: logReady, append: appendLog } = useEffectLog();
  const startRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!isRunning) return;
    startRef.current = Date.now() - elapsed;
    const id = setInterval(() => {
      setElapsed(Date.now() - startRef.current);
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning]); // eslint-disable-line react-hooks/exhaustive-deps

  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);

  const handleStop = useCallback(() => {
    setIsRunning(false);
    trackSilenceEvent({
      eventType: 'quiet_session_completed',
      timestamp: new Date().toISOString(),
      context: { durationMs: elapsed },
    });
  }, [elapsed]);

  const handleLevel = useCallback(
    async (level: number) => {
      if (!Number.isFinite(level) || level < 0 || level > 4) return;
      setQuietLevel(level);
      try {
        localStorage.setItem('silence-quiet-level', String(level));
      } catch {
        // localStorage unavailable
      }

      try {
        const raw = localStorage.getItem('silence-quiet-sessions');
        const sessions: number[] = raw ? JSON.parse(raw) : [];
        sessions.push(Date.now());
        if (sessions.length > 30) sessions.shift();
        localStorage.setItem('silence-quiet-sessions', JSON.stringify(sessions));
      } catch {
        // ignore
      }

      trackSilenceEvent({
        eventType: 'self_report_submitted',
        timestamp: new Date().toISOString(),
        context: { quietLevel: level, durationMs: elapsed },
      });

      if (logReady) {
        await appendLog(
          'RELEASE',
          'quiet-app',
          'PASS',
          `Quiet session ended: level=${level}, duration=${elapsed}ms`,
          'User completed a quiet session and reported perceived quiet level.'
        ).catch(() => {});
      }
    },
    [elapsed, logReady, appendLog]
  );

  const buttonBase = {
    padding: '0.875rem 2rem',
    borderRadius: radius.md,
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: `border-color ${timing.micro}ms ${easing.phiInOut}, color ${timing.micro}ms ${easing.phiInOut}, background ${timing.micro}ms ${easing.phiInOut}`,
  } as const;

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>
      <h2 style={{ fontWeight: 300, letterSpacing: '0.1em', color: colors.textMuted, marginBottom: '2rem' }}>
        Quiet Mode
      </h2>
      <div
        aria-live={isRunning ? 'off' : 'polite'}
        aria-atomic="true"
        style={{ fontSize: '4rem', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.05em', color: colors.textPrimary }}
      >
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      {isRunning ? (
        <button
          onClick={handleStop}
          aria-label="End quiet session"
          style={{
            ...buttonBase,
            marginTop: '2rem',
            border: `1px solid ${colors.surfaceHover}`,
            color: colors.textMuted,
          }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.color = colors.textSecondary)}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.color = colors.textMuted)}
        >
          End Session
        </button>
      ) : (
        <div style={{ marginTop: '2rem', textAlign: 'center', width: '100%', maxWidth: 320 }}>
          <p style={{ color: colors.textSecondary, marginBottom: '1rem', fontSize: '0.875rem' }}>
            How quiet was that?
          </p>
          <div
            role="radiogroup"
            aria-label="Quiet level"
            style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}
          >
            {[0, 1, 2, 3, 4].map((level) => (
              <button
                key={level}
                role="radio"
                aria-checked={quietLevel === level}
                onClick={() => handleLevel(level)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  border: `1px solid ${quietLevel === level ? colors.accentPrimary : colors.surfaceHover}`,
                  background: quietLevel === level ? `${colors.accentPrimary}1a` : 'transparent',
                  color: quietLevel === level ? colors.accentPrimary : colors.textMuted,
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  transition: `border-color ${timing.micro}ms ${easing.phiInOut}, background ${timing.micro}ms ${easing.phiInOut}, color ${timing.micro}ms ${easing.phiInOut}`,
                }}
              >
                {level}
              </button>
            ))}
          </div>
          <Link href="/garden" style={{ textDecoration: 'none' }}>
            <button
              aria-label="Return to garden"
              style={{
                ...buttonBase,
                border: `1px solid ${colors.accentPrimary}`,
                color: colors.accentPrimary,
              }}
            >
              Return to Garden
            </button>
          </Link>
        </div>
      )}
    </main>
  );
}
