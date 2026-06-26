// ============================================
// src/app/new/page.tsx
// PatternLens v5.2 — 3-step Onboarding Wizard
// DIPLO-compliant: structural language only
// ============================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useObjects, useInterpret } from '@/hooks/useApi';
import { VoiceDump } from '@/components/VoiceDump';
import { useLanguage } from '@/lib/i18n/LanguageContext';

type ObjectType = 'decision' | 'commitment' | 'blocker';

const OBJECT_TYPES: { type: ObjectType; icon: string; label: string; description: string }[] = [
  { type: 'decision', icon: '\u{1F4CA}', label: 'Decision', description: 'Something you chose or need to choose' },
  { type: 'commitment', icon: '\u{1F91D}', label: 'Commitment', description: 'Something you promised yourself or others' },
  { type: 'blocker', icon: '\u{1F6A7}', label: 'Blocker', description: 'Something that keeps a decision or commitment stuck' },
];

const SYSTEM_CONDITIONS = [
  { key: 'overload', label: 'Overload Protocol', color: '#ef4444', description: 'Too many commitments in progress vs completed in this time window.' },
  { key: 'buffer', label: 'Buffer Overflow', color: '#f59e0b', description: 'Input rate exceeds processing capacity — decisions queuing up.' },
  { key: 'deadlock', label: 'Deadlock Loop', color: '#8b5cf6', description: 'Two or more commitments blocking each other — no forward motion.' },
  { key: 'kernel', label: 'Kernel Panic', color: '#ef4444', description: 'Core system assumption violated — fundamental constraint broken.' },
];

export default function NewObject() {
  const router = useRouter();
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [objectType, setObjectType] = useState<ObjectType | null>(null);
  const [text, setText] = useState('');
  const [crisisLock, setCrisisLock] = useState(false);
  const [crisisResources, setCrisisResources] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { createObject, loading: creating } = useObjects();
  const { interpret, interpreting, result } = useInterpret();

  const isProcessing = creating || interpreting;
  const minChars = 50;

  async function handleAnalyze() {
    if (isProcessing || crisisLock || text.length < minChars) return;
    setError(null);

    const createResult = await createObject(text);

    if (createResult.crisis) {
      setCrisisLock(true);
      setCrisisResources(createResult.resources || []);
      return;
    }
    if (createResult.error) { setError(createResult.error); return; }
    if (!createResult.success || !createResult.object_id) { setError('Failed to create object'); return; }

    const interpretResult = await interpret(createResult.object_id);

    if (interpretResult?.crisis) {
      setCrisisLock(true);
      setCrisisResources(interpretResult.resources || []);
      return;
    }

    setStep(3);
  }

  const handleVoiceTranscript = (transcript: string) => {
    setText(prev => prev ? prev + ' ' + transcript : transcript);
  };

  const lensA = result?.lensA;
  const lensB = result?.lensB;

  // Detect system condition from result (mock if no AI)
  const detectedCondition = (() => {
    const combined = [lensA?.context_phase, lensA?.tension_phase, lensB?.context_phase, lensB?.tension_phase]
      .filter(Boolean).join(' ').toLowerCase();
    if (combined.includes('overload') || combined.includes('too many')) return SYSTEM_CONDITIONS[0];
    if (combined.includes('buffer') || combined.includes('queue') || combined.includes('capacity')) return SYSTEM_CONDITIONS[1];
    if (combined.includes('deadlock') || combined.includes('blocking each other') || combined.includes('stuck')) return SYSTEM_CONDITIONS[2];
    if (combined.includes('panic') || combined.includes('fundamental') || combined.includes('broken')) return SYSTEM_CONDITIONS[3];
    return null;
  })();

  // Mock archetype scores
  const archetypes = [
    { name: 'Creator', score: 0.62 },
    { name: 'Ruler', score: 0.48 },
    { name: 'Rebel', score: 0.31 },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(18, 18, 26, 0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)', padding: '14px 24px',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>
            <span style={{ color: 'var(--accent-cyan)', marginRight: 6 }}>&#9673;</span>PatternLens
            <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 8, border: '1px solid var(--border)', borderRadius: 999, padding: '2px 8px' }}>v5.2</span>
          </span>
          {/* Step indicator */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{
                width: s === step ? 24 : 8, height: 8,
                borderRadius: 4,
                background: s <= step ? 'var(--accent-cyan)' : 'var(--border)',
                transition: 'all 300ms',
              }} />
            ))}
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
        <Link href="/dashboard" style={{
          color: 'var(--text-muted)', fontSize: 13, textDecoration: 'none',
          fontFamily: 'var(--font-mono)', marginBottom: 32, display: 'inline-block',
        }}>
          &larr; {t.common.backToDashboard}
        </Link>

        {/* ═══ STEP 1: CHOOSE TYPE ═══ */}
        {step === 1 && (
          <div>
            <h1 style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 24, marginBottom: 8 }}>
              What do you want to map?
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 32 }}>
              Select the type of object you want to analyze structurally.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              {OBJECT_TYPES.map(({ type, icon, label, description }) => (
                <button key={type} onClick={() => setObjectType(type)} style={{
                  padding: 24, background: objectType === type ? 'rgba(33,128,141,0.12)' : 'var(--bg-surface)',
                  border: objectType === type ? '2px solid var(--accent-cyan)' : '1px solid var(--border)',
                  borderRadius: 14, cursor: 'pointer', textAlign: 'left',
                  transition: 'all 200ms',
                }}>
                  <span style={{ fontSize: 28 }}>{icon}</span>
                  <p style={{
                    fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 16,
                    color: 'var(--text-primary)', marginTop: 12,
                  }}>{label}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5 }}>
                    {description}
                  </p>
                </button>
              ))}
            </div>

            <button
              onClick={() => objectType && setStep(2)}
              disabled={!objectType}
              className="btn btn-primary"
              style={{
                width: '100%', marginTop: 28, padding: '16px 0', fontSize: 14,
                fontWeight: 700, letterSpacing: '0.05em',
                opacity: objectType ? 1 : 0.4,
              }}
            >
              Next
            </button>
          </div>
        )}

        {/* ═══ STEP 2: DESCRIBE ═══ */}
        {step === 2 && (
          <div>
            <h1 style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 24, marginBottom: 8 }}>
              Describe it in 1–3 sentences
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 6 }}>
              Write what&apos;s actually happening in the system. No feelings, just behavior and constraints.
            </p>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-cyan)',
              marginBottom: 24, padding: '4px 10px', background: 'rgba(33,128,141,0.08)',
              borderRadius: 6, display: 'inline-block',
            }}>
              {objectType?.toUpperCase()}
            </p>

            {/* Voice panel */}
            <div style={{
              background: 'linear-gradient(135deg, var(--bg-surface), var(--bg-elevated))',
              border: '1px solid rgba(6,182,212,0.15)', borderRadius: 16,
              padding: 24, marginBottom: 16, textAlign: 'center',
            }}>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--accent-cyan)', marginBottom: 16,
              }}>{t.voice.title}</p>
              <VoiceDump onTranscript={handleVoiceTranscript} disabled={crisisLock || isProcessing} maxDuration={120} />
            </div>

            {/* Text input */}
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              disabled={crisisLock || isProcessing}
              placeholder="Ship v3 of our dashboard by end of month, but scope keeps changing and we keep cutting corners."
              className="input textarea"
              style={{ minHeight: 160, width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, fontSize: 12, fontFamily: 'var(--font-mono)' }}>
              <span style={{ color: text.length < minChars ? 'var(--warning)' : 'var(--success)' }}>
                {text.length} / 5000
              </span>
              {text.length < minChars && (
                <span style={{ color: 'var(--warning)' }}>{minChars - text.length} {t.analysis.charsRemaining}</span>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={() => setStep(1)} style={{
                padding: '14px 24px', background: 'var(--bg-surface)', border: '1px solid var(--border)',
                borderRadius: 10, color: 'var(--text-secondary)', fontSize: 13,
                fontFamily: 'var(--font-mono)', cursor: 'pointer',
              }}>Back</button>
              <button
                onClick={handleAnalyze}
                disabled={isProcessing || crisisLock || text.length < minChars}
                className="btn btn-primary"
                style={{ flex: 1, padding: '14px 0', fontSize: 14, fontWeight: 700, letterSpacing: '0.05em' }}
              >
                {creating ? t.analysis.saving : interpreting ? t.analysis.aiAnalysis : 'Analyze object'}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div style={{ marginTop: 16, padding: 16, background: 'var(--danger-muted)', borderRadius: 12, border: '1px solid rgba(239,68,68,0.2)' }}>
                <p style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</p>
              </div>
            )}

            {/* Crisis */}
            {crisisLock && crisisResources.length > 0 && (
              <div style={{
                marginTop: 32, padding: 32, background: 'var(--danger-muted)',
                border: '2px solid rgba(239,68,68,0.3)', borderRadius: 16,
              }}>
                <h2 style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 18, color: 'var(--danger)', textAlign: 'center', marginBottom: 16 }}>
                  {t.crisis.detected}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, textAlign: 'center', marginBottom: 24 }}>
                  {t.crisis.disclaimer}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {crisisResources.map((r: any, i: number) => (
                    <a key={i} href={`tel:${String(r.phone || '').replace(/\s/g, '')}`} style={{
                      display: 'block', padding: 16, background: 'rgba(239,68,68,0.08)',
                      border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10,
                      textDecoration: 'none', textAlign: 'center',
                    }}>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: 'var(--danger)', marginBottom: 4 }}>
                        {String(r.phone)}
                      </p>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{String(r.name)}</p>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ STEP 3: RESULTS ═══ */}
        {step === 3 && (
          <div>
            <h1 style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 24, marginBottom: 24 }}>
              {t.results.structuralAnalysis}
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent-cyan)',
                border: '1px solid var(--lens-a-border)', borderRadius: 999, padding: '2px 10px',
                marginLeft: 12, verticalAlign: 'middle',
              }}>{t.results.dualLens}</span>
            </h1>

            {/* System Condition Badge */}
            {detectedCondition && (
              <div style={{
                padding: '16px 20px', marginBottom: 20,
                background: `${detectedCondition.color}10`,
                border: `1px solid ${detectedCondition.color}30`,
                borderRadius: 12,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
                    color: detectedCondition.color, padding: '3px 10px',
                    background: `${detectedCondition.color}18`, borderRadius: 6,
                  }}>{detectedCondition.label}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {detectedCondition.description}
                </p>
              </div>
            )}

            {/* Dual Lens Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
              {lensA && (
                <div style={{ padding: 20, background: 'var(--bg-surface)', border: '1px solid var(--lens-a-border)', borderRadius: 12 }}>
                  <div style={{ marginBottom: 12 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent-cyan)', letterSpacing: '0.1em' }}>LENS A</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>Current pattern</span>
                  </div>
                  {['context_phase', 'tension_phase', 'meaning_phase', 'function_phase'].map(key => {
                    const val = (lensA as any)[key];
                    const labels: Record<string, string> = { context_phase: t.results.context, tension_phase: t.results.tension, meaning_phase: t.results.meaning, function_phase: t.results.function };
                    return val ? (
                      <div key={key} style={{ marginBottom: 8, padding: 8, background: 'rgba(0,0,0,0.2)', borderRadius: 6 }}>
                        <p style={{ fontSize: 10, color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: 4 }}>{labels[key]}</p>
                        <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5 }}>{val}</p>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
              {lensB && (
                <div style={{ padding: 20, background: 'var(--bg-surface)', border: '1px solid var(--lens-b-border)', borderRadius: 12 }}>
                  <div style={{ marginBottom: 12 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent-purple)', letterSpacing: '0.1em' }}>LENS B</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>Alternative pattern</span>
                  </div>
                  {['context_phase', 'tension_phase', 'meaning_phase', 'function_phase'].map(key => {
                    const val = (lensB as any)[key];
                    const labels: Record<string, string> = { context_phase: t.results.context, tension_phase: t.results.tension, meaning_phase: t.results.meaning, function_phase: t.results.function };
                    return val ? (
                      <div key={key} style={{ marginBottom: 8, padding: 8, background: 'rgba(0,0,0,0.2)', borderRadius: 6 }}>
                        <p style={{ fontSize: 10, color: 'var(--accent-purple)', textTransform: 'uppercase', marginBottom: 4 }}>{labels[key]}</p>
                        <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5 }}>{val}</p>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </div>

            {/* Archetype Strip */}
            <div style={{
              padding: '16px 20px', background: 'var(--bg-surface)',
              border: '1px solid var(--border)', borderRadius: 12, marginBottom: 24,
            }}>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>
                Your current pattern aligns most with...
              </p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {archetypes.map(({ name, score }) => (
                  <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{name}</span>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent-cyan)',
                      padding: '2px 8px', background: 'rgba(33,128,141,0.1)', borderRadius: 4,
                    }}>{score.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 24 }}>
              {t.results.proposalDisclaimer}
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => { setStep(1); setObjectType(null); setText(''); }}
                className="btn btn-primary"
                style={{ flex: 1, padding: '14px 0', fontSize: 14, fontWeight: 600 }}
              >
                Add another object
              </button>
              <Link href="/archive" style={{
                flex: 1, padding: '14px 0', fontSize: 14, fontWeight: 600,
                background: 'var(--bg-surface)', border: '1px solid var(--border)',
                borderRadius: 10, color: 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)', textDecoration: 'none',
                textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                View system timeline
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
