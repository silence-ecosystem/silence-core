'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface Interpretation {
  id: string;
  lens: 'A' | 'B';
  context_phase: string;
  tension_phase: string;
  meaning_phase: string;
  function_phase: string;
  confidence: number;
  risk_level: string;
  created_at: string;
}

interface ObjectData {
  id: string;
  input_text: string;
  input_source: string;
  selected_lens: string | null;
  theme: string | null;
  processing_status: string;
  created_at: string;
  interpretations?: Interpretation[];
}

export default function ObjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [object, setObject] = useState<ObjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interpreting, setInterpreting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/objects/interpret?object_id=${params.id}`);
        if (res.status === 401) { router.push('/login'); return; }
        if (!res.ok) { setError(t.common.objectNotFound); setLoading(false); return; }
        const data = await res.json();
        setObject(data);
      } catch {
        setError(t.common.objectNotFound);
      }
      setLoading(false);
    }
    if (params.id) load();
  }, [params.id, router, t.common.objectNotFound]);

  const handleInterpret = async () => {
    if (!object || interpreting) return;
    setInterpreting(true);
    try {
      const res = await fetch('/api/objects/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ object_id: object.id }),
      });
      if (res.ok) {
        const reloadRes = await fetch(`/api/objects/interpret?object_id=${object.id}`);
        if (reloadRes.ok) {
          const data = await reloadRes.json();
          setObject(data);
        }
      }
    } catch { /* ignore */ }
    setInterpreting(false);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', color: 'var(--text-muted)' }}>
        <div className="spinner" style={{ marginRight: 8 }} /> {t.common.loading}
      </div>
    );
  }

  if (error || !object) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', color: 'var(--text-muted)', gap: 16 }}>
        <p>{error || t.common.objectNotFound}</p>
        <Link href="/dashboard" style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
          &larr; {t.common.backToDashboard}
        </Link>
      </div>
    );
  }

  const lensA = object.interpretations?.find(i => i.lens === 'A');
  const lensB = object.interpretations?.find(i => i.lens === 'B');
  const hasInterpretations = lensA || lensB;
  const status = hasInterpretations ? 'completed' : 'pending';

  const phaseKeys = ['context_phase', 'tension_phase', 'meaning_phase', 'function_phase'] as const;
  const phaseLabels: Record<string, string> = {
    context_phase: t.results.context,
    tension_phase: t.results.tension,
    meaning_phase: t.results.meaning,
    function_phase: t.results.function,
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
        <Link href="/dashboard" style={{ color: 'var(--text-muted)', fontSize: 13, textDecoration: 'none', fontFamily: 'var(--font-mono)', marginBottom: 24, display: 'inline-block' }}>
          &larr; {t.common.backToDashboard}
        </Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
              {t.object.title}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
              {object.id.substring(0, 8)}... &middot; {new Date(object.created_at).toLocaleDateString('en-US')}
            </p>
          </div>
          <span style={{
            padding: '4px 12px', borderRadius: 4, fontSize: 11, fontWeight: 600,
            fontFamily: 'var(--font-mono)', textTransform: 'uppercase',
            background: status === 'completed' ? 'var(--success-muted)' : 'var(--warning-muted)',
            color: status === 'completed' ? 'var(--success)' : 'var(--warning)',
            border: `1px solid ${status === 'completed' ? 'rgba(34,197,94,0.3)' : 'rgba(245,158,11,0.3)'}`,
          }}>
            {status === 'completed' ? t.object.completed : t.object.pending}
          </span>
        </div>

        {/* Input Text */}
        <div style={{ marginBottom: 32, padding: 20, background: 'var(--bg-surface)', borderRadius: 10, border: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--accent-cyan)', fontSize: 11, textTransform: 'uppercase', fontWeight: 600, marginBottom: 8, letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>
            {t.object.inputText}
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>{object.input_text}</p>
          <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>
              {t.common.method}: {object.input_source === 'voice' ? t.analysis.voice : t.analysis.text}
            </span>
            {object.theme && (
              <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>
                {t.common.theme}: {object.theme}
              </span>
            )}
          </div>
        </div>

        {/* Interpret Button */}
        {!hasInterpretations && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <button
              onClick={handleInterpret}
              disabled={interpreting}
              className="btn btn-primary"
              style={{ padding: '14px 32px' }}
            >
              {interpreting ? t.object.analyzing : t.object.runAnalysis}
            </button>
          </div>
        )}

        {/* 4-Phase Analysis (Lens A) */}
        {lensA && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 16, fontFamily: 'var(--font-mono)' }}>
              {t.results.fourPhase}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {phaseKeys.map((key) => {
                const text = (lensA as any)[key];
                return (
                  <div key={key} style={{ padding: 16, background: 'var(--bg-surface)', borderRadius: 8, border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <p style={{ color: 'var(--accent-cyan)', fontSize: 11, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>
                        {phaseLabels[key]}
                      </p>
                      {lensA.confidence != null && (
                        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: lensA.confidence >= 0.8 ? 'var(--success)' : 'var(--accent-teal)' }}>
                          {Math.round(lensA.confidence * 100)}%
                        </span>
                      )}
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.5 }}>
                      {text || t.results.awaitingAnalysis}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Dual Lens */}
        {hasInterpretations && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 16, fontFamily: 'var(--font-mono)' }}>
              {t.results.dualLensTitle}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {lensA && (
                <div style={{ padding: 16, background: 'var(--bg-surface)', borderRadius: 8, border: '1px solid var(--lens-a-border)' }}>
                  <p style={{ color: 'var(--accent-cyan)', fontSize: 11, textTransform: 'uppercase', fontWeight: 600, marginBottom: 8, letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>
                    {t.results.lensAFull}
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.5 }}>
                    {lensA.context_phase || ''}
                  </p>
                </div>
              )}
              {lensB && (
                <div style={{ padding: 16, background: 'var(--bg-surface)', borderRadius: 8, border: '1px solid var(--lens-b-border)' }}>
                  <p style={{ color: 'var(--accent-purple)', fontSize: 11, textTransform: 'uppercase', fontWeight: 600, marginBottom: 8, letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>
                    {t.results.lensBFull}
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.5 }}>
                    {lensB.context_phase || ''}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Confidence */}
        {hasInterpretations && lensA && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 16, fontFamily: 'var(--font-mono)' }}>
              {t.results.confidence}
            </h2>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1, padding: 20, background: 'var(--bg-surface)', borderRadius: 8, border: '1px solid var(--border)', textAlign: 'center' }}>
                <p style={{ color: 'var(--accent-cyan)', fontSize: 11, textTransform: 'uppercase', fontWeight: 600, marginBottom: 8, fontFamily: 'var(--font-mono)' }}>
                  {t.results.lensA}
                </p>
                <p style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-mono)', color: lensA.confidence >= 0.8 ? 'var(--success)' : 'var(--accent-teal)' }}>
                  {Math.round(lensA.confidence * 100)}%
                </p>
              </div>
              {lensB && (
                <div style={{ flex: 1, padding: 20, background: 'var(--bg-surface)', borderRadius: 8, border: '1px solid var(--border)', textAlign: 'center' }}>
                  <p style={{ color: 'var(--accent-purple)', fontSize: 11, textTransform: 'uppercase', fontWeight: 600, marginBottom: 8, fontFamily: 'var(--font-mono)' }}>
                    {t.results.lensB}
                  </p>
                  <p style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-mono)', color: lensB.confidence >= 0.8 ? 'var(--success)' : 'var(--accent-teal)' }}>
                    {Math.round(lensB.confidence * 100)}%
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <p style={{ color: 'var(--text-muted)', fontSize: 11, textAlign: 'center', marginTop: 32 }}>
          {t.footer.disclaimer}
        </p>
      </div>
    </div>
  );
}
