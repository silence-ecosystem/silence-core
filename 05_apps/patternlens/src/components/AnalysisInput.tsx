'use client';

import { useState } from 'react';
import { useObjects, useInterpret } from '@/hooks/useApi';
import { CrisisModal } from '@/components/safety/CrisisModal';
import { VoiceDump } from '@/components/VoiceDump';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface AnalysisInputProps {
  onSuccess?: (objectId: string) => void;
  canCreate?: boolean;
  remaining?: number | null;
}

export function AnalysisInput({ onSuccess, canCreate = true, remaining }: AnalysisInputProps) {
  const { t } = useLanguage();
  const [text, setText] = useState('');
  const [showCrisis, setShowCrisis] = useState(false);
  const [crisisResources, setCrisisResources] = useState<any[]>([]);

  const { createObject, loading: creating } = useObjects();
  const { interpret, interpreting } = useInterpret();

  const charCount = text.length;
  const minChars = 50;
  const maxChars = 5000;
  const isValid = charCount >= minChars && charCount <= maxChars;
  const isProcessing = creating || interpreting;

  const handleSubmit = async () => {
    if (!isValid || !canCreate || isProcessing) return;

    const result = await createObject(text);

    if (result.crisis) {
      setCrisisResources(result.resources || []);
      setShowCrisis(true);
      return;
    }

    if (result.success && result.object_id) {
      const interpretResult = await interpret(result.object_id);

      if (interpretResult?.crisis) {
        setCrisisResources(interpretResult.resources || []);
        setShowCrisis(true);
        return;
      }

      setText('');
      onSuccess?.(result.object_id);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setText(prev => prev ? prev + ' ' + transcript : transcript);
  };

  return (
    <div>
      {/* Golden Ratio Grid: Voice 61.8% | Text 38.2% */}
      <div style={{
        display: 'grid',
        gap: 24,
        gridTemplateColumns: '1fr',
      }} className="golden-grid">
        {/* VOICE PANEL — left, dominant */}
        <div style={{
          background: 'linear-gradient(135deg, var(--bg-surface), var(--bg-elevated))',
          border: '1px solid rgba(6, 182, 212, 0.15)',
          borderRadius: 16,
          padding: 32,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 280,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Radial glow */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 16,
            background: 'radial-gradient(circle at 50% 50%, rgba(6,182,212,0.05), transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Title */}
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--accent-cyan)',
            marginBottom: 24,
            position: 'relative',
            zIndex: 1,
          }}>
            {t.voice.title}
          </p>

          {/* VoiceDump with big mic */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <VoiceDump
              onTranscript={handleVoiceTranscript}
              disabled={!canCreate || isProcessing}
              maxDuration={120}
            />
          </div>

          {/* Transcription preview */}
          {text && (
            <div style={{
              marginTop: 24,
              width: '100%',
              padding: 14,
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              position: 'relative',
              zIndex: 1,
            }}>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>
                {t.analysis.transcription}
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6 }}>
                {text.length > 200 ? text.substring(0, 200) + '...' : text}
              </p>
            </div>
          )}
        </div>

        {/* TEXT PANEL — right, secondary */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: 12,
          }}>
            {t.analysis.text}
          </p>

          <textarea
            className="input textarea"
            placeholder={t.analysis.placeholder}
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={maxChars}
            disabled={!canCreate || isProcessing}
            style={{ minHeight: 160, flex: 1 }}
          />

          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginTop: 8, fontSize: 12, fontFamily: 'var(--font-mono)',
          }}>
            <span style={{ color: charCount < minChars ? 'var(--warning)' : 'var(--success)' }}>
              {charCount} / {maxChars}
            </span>
            {charCount < minChars ? (
              <span style={{ color: 'var(--warning)' }}>
                {minChars - charCount} {t.analysis.charsRemaining}
              </span>
            ) : (
              <span style={{ color: 'var(--success)' }}>{t.analysis.readyToAnalyze}</span>
            )}
          </div>
        </div>
      </div>

      {/* Analyze Button — full width, golden spacing */}
      <button
        className="btn btn-primary"
        style={{
          width: '100%',
          marginTop: 26, /* ~1.618rem */
          padding: '16px 0',
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: '0.05em',
        }}
        onClick={handleSubmit}
        disabled={!isValid || !canCreate || isProcessing}
      >
        {isProcessing ? (
          <>
            <span className="spinner" style={{ marginRight: 8 }} />
            {creating ? t.analysis.saving : t.analysis.aiAnalysis}
          </>
        ) : (
          t.analysis.analyze
        )}
      </button>

      {/* Limit Warning — only if NOT beta (canCreate would be true in beta) */}
      {!canCreate && (
        <div style={{
          marginTop: 16, padding: 16,
          background: 'var(--warning-muted)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: 8, textAlign: 'center',
        }}>
          <p style={{ color: 'var(--warning)', marginBottom: 8, fontSize: 14 }}>
            {t.analysis.weeklyLimit}
          </p>
          <a href="/upgrade" className="btn btn-sm btn-secondary">
            {t.analysis.upgradeToPro}
          </a>
        </div>
      )}

      <CrisisModal
        isOpen={showCrisis}
        onClose={() => setShowCrisis(false)}
        resources={crisisResources}
        level="medium"
      />

      {/* Golden ratio responsive grid */}
      <style>{`
        @media (min-width: 768px) {
          .golden-grid {
            grid-template-columns: 0.618fr 0.382fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default AnalysisInput;
