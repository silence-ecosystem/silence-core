// ============================================
// src/components/VoiceTextTabs.tsx
// PatternLens v5.0 - Tabbed Voice/Text Input
// Salvaged from Perplexity spec, adapted to actual codebase
// ============================================

'use client';

import { useState } from 'react';
import { VoiceDump } from '@/components/VoiceDump';
import { useObjects, useInterpret } from '@/hooks/useApi';
import { CrisisModal } from '@/components/safety/CrisisModal';
import type { CrisisResource } from '@/types/crisis';

type InputTab = 'text' | 'voice';

interface VoiceTextTabsProps {
  onSuccess?: (objectId: string) => void;
  canCreate?: boolean;
  remaining?: number | null;
}

const MIN_CHARS = 50;
const MAX_CHARS = 5000;
const MAX_RECORDING_SECONDS = 300;

export function VoiceTextTabs({ onSuccess, canCreate = true, remaining }: VoiceTextTabsProps) {
  const [activeTab, setActiveTab] = useState<InputTab>('text');
  const [text, setText] = useState('');
  const [showCrisis, setShowCrisis] = useState(false);
  const [crisisResources, setCrisisResources] = useState<CrisisResource[]>([]);

  const { createObject, loading: creating } = useObjects();
  const { interpret, interpreting } = useInterpret();

  const charCount = text.length;
  const isValid = charCount >= MIN_CHARS && charCount <= MAX_CHARS;
  const isProcessing = creating || interpreting;

  const handleSubmit = async (inputText: string) => {
    if (inputText.trim().length < MIN_CHARS || !canCreate) return;

    const result = await createObject(inputText);

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
    setText(transcript);
    setActiveTab('text');
  };

  return (
    <div className="voice-text-tabs glass-card">
      {/* Tab headers */}
      <div className="tab-bar" role="tablist" aria-label="Metoda wprowadzania">
        <button
          role="tab"
          aria-selected={activeTab === 'text'}
          aria-controls="panel-text"
          id="tab-text"
          onClick={() => setActiveTab('text')}
          className={`tab-button ${activeTab === 'text' ? 'tab-active' : ''}`}
        >
          Tekst
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'voice'}
          aria-controls="panel-voice"
          id="tab-voice"
          onClick={() => setActiveTab('voice')}
          className={`tab-button ${activeTab === 'voice' ? 'tab-active' : ''}`}
        >
          Nagranie
        </button>
      </div>

      {/* Text panel */}
      {activeTab === 'text' && (
        <div role="tabpanel" id="panel-text" aria-labelledby="tab-text" className="tab-panel">
          <textarea
            className="input textarea"
            placeholder="Opisz sytuacje lub wzorzec, ktory chcesz przeanalizowac... (min. 50 znakow)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={MAX_CHARS}
            disabled={!canCreate || isProcessing}
            aria-label="Tekst do analizy strukturalnej"
            aria-describedby="char-count"
          />

          <div className="input-footer">
            <span
              id="char-count"
              className={charCount < MIN_CHARS ? 'text-warning' : 'text-success'}
            >
              {charCount} / {MAX_CHARS}
              {charCount < MIN_CHARS && ` (min ${MIN_CHARS})`}
            </span>
          </div>

          <button
            className="btn btn-primary btn-lg btn-full mt-lg"
            onClick={() => handleSubmit(text)}
            disabled={!isValid || !canCreate || isProcessing}
          >
            {isProcessing ? 'Analizuje...' : 'Analizuj strukture'}
          </button>
        </div>
      )}

      {/* Voice panel */}
      {activeTab === 'voice' && (
        <div role="tabpanel" id="panel-voice" aria-labelledby="tab-voice" className="tab-panel">
          <div className="voice-container">
            <VoiceDump
              onTranscript={handleVoiceTranscript}
              disabled={!canCreate || isProcessing}
              maxDuration={MAX_RECORDING_SECONDS}
            />
            <p className="voice-hint">
              Maks. {Math.floor(MAX_RECORDING_SECONDS / 60)} minut.
              Transkrypcja zostanie wklejona do pola tekstowego.
            </p>
          </div>
        </div>
      )}

      {/* Limit warning */}
      {!canCreate && (
        <div className="limit-warning">
          <p>Osiagnieto limit obiektow. Ulepsz do PRO po wiecej.</p>
          <a href="/upgrade" className="btn btn-secondary btn-sm">Ulepsz do PRO</a>
        </div>
      )}

      <CrisisModal
        isOpen={showCrisis}
        onClose={() => setShowCrisis(false)}
        resources={crisisResources}
        level="medium"
      />

      <style jsx>{`
        .voice-text-tabs { padding: var(--space-xl); }
        .tab-bar {
          display: flex;
          gap: var(--space-md);
          border-bottom: 1px solid var(--color-border);
          padding-bottom: var(--space-md);
          margin-bottom: var(--space-lg);
        }
        .tab-button {
          font-size: var(--font-size-base);
          font-weight: 500;
          color: var(--color-text-secondary);
          background: none;
          border: none;
          padding: var(--space-sm) var(--space-md);
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition: color 0.2s, border-color 0.2s;
          min-height: 48px;
        }
        .tab-button:hover { color: var(--color-text-primary); }
        .tab-active {
          color: var(--primary-neon);
          border-bottom-color: var(--primary-neon);
        }
        .tab-panel { margin-top: var(--space-md); }
        .textarea { min-height: 180px; width: 100%; }
        .input-footer {
          display: flex;
          justify-content: space-between;
          margin-top: var(--space-sm);
          font-size: var(--font-size-sm);
        }
        .voice-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-lg);
          padding: var(--space-xl) 0;
        }
        .voice-hint {
          font-size: var(--font-size-sm);
          color: var(--color-text-tertiary);
          text-align: center;
        }
        .limit-warning {
          margin-top: var(--space-lg);
          padding: var(--space-lg);
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: var(--radius-md);
          text-align: center;
        }
        .limit-warning p { margin-bottom: var(--space-md); }
      `}</style>
    </div>
  );
}

export default VoiceTextTabs;
