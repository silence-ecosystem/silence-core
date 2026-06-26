'use client';

import { useState } from 'react';
import type { PLObject } from '@/hooks/useApi';
import { getProcessingStatus } from '@/hooks/useApi';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface ObjectCardProps {
  object: PLObject;
  onInterpret?: (id: string) => void;
  onSelect?: (id: string, selected: boolean) => void;
  selectable?: boolean;
  selected?: boolean;
}

export function ObjectCard({
  object,
  onInterpret,
  onSelect,
  selectable = false,
  selected = false,
}: ObjectCardProps) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  const status = getProcessingStatus(object);

  const getRiskBadge = () => {
    const risk = object.interpretations?.[0]?.risk_level;
    switch (risk?.toLowerCase()) {
      case 'none':
      case 'low':
        return <span className="badge badge-success">{t.risk.low}</span>;
      case 'medium':
        return <span className="badge badge-warning">{t.risk.medium}</span>;
      case 'high':
      case 'crisis':
        return <span className="badge badge-danger">{t.risk.high}</span>;
      default:
        return null;
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return t.common.today;
    if (days === 1) return t.common.yesterday;
    if (days < 7) return `${days} ${t.common.daysAgo}`;
    return d.toLocaleDateString('en-US');
  };

  const lensA = object.interpretations?.find(i => i.lens === 'A');
  const lensB = object.interpretations?.find(i => i.lens === 'B');

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: selected ? '1px solid var(--accent-cyan)' : '1px solid var(--border)',
      borderRadius: 12,
      padding: 20,
      position: 'relative',
      boxShadow: selected ? '0 0 20px rgba(6, 182, 212, 0.15)' : 'none',
      transition: 'all 200ms',
    }}>
      {selectable && (
        <div style={{ position: 'absolute', top: 16, left: 16 }}>
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => onSelect?.(object.id, e.target.checked)}
            style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--accent-cyan)' }}
          />
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--text-muted)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
            {formatDate(object.created_at)}
          </span>
          <span style={{ fontSize: 14 }}>
            {object.input_source === 'voice' ? '\uD83C\uDFA4' : '\u270D\uFE0F'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {getRiskBadge()}
          <span className={status === 'completed' ? 'badge badge-success' : 'badge badge-info'}>
            {status === 'completed' ? t.object.completed : t.object.pending}
          </span>
        </div>
      </div>

      {/* Content */}
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: 14, marginBottom: 8 }}>
        {object.input_text.substring(0, 150)}
        {object.input_text.length > 150 && '...'}
      </p>

      {object.theme && (
        <div style={{ fontSize: 12 }}>
          <span style={{ color: 'var(--text-muted)' }}>{t.common.theme}:</span>
          <span style={{ color: 'var(--accent-cyan)', marginLeft: 4 }}>{object.theme}</span>
        </div>
      )}

      {/* Interpretations */}
      {status === 'completed' && (lensA || lensB) && (
        <div style={{ borderTop: '1px solid var(--border)', marginTop: 12, paddingTop: 12 }}>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: 'none', border: 'none',
              color: 'var(--text-secondary)', cursor: 'pointer',
              fontSize: 13, fontFamily: 'var(--font-mono)',
              width: '100%', textAlign: 'center', padding: 4,
            }}
          >
            {expanded ? t.object.collapse : t.object.showInterpretations}
          </button>

          {expanded && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
              {lensA && (
                <div style={{ padding: 12, background: 'rgba(0,0,0,0.2)', borderRadius: 8, borderLeft: '3px solid var(--accent-cyan)' }}>
                  <p style={{ fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', marginBottom: 8 }}>
                    {t.results.lensA} <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>{t.results.lensAName}</span>
                  </p>
                  {[
                    { key: 'context_phase', label: t.results.context },
                    { key: 'tension_phase', label: t.results.tension },
                    { key: 'meaning_phase', label: t.results.meaning },
                    { key: 'function_phase', label: t.results.function },
                  ].map(({ key, label }) => {
                    const text = (lensA as any)[key];
                    return text ? (
                      <div key={key} style={{ marginBottom: 6 }}>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{label}</span>
                        <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>{text}</p>
                      </div>
                    ) : null;
                  })}
                </div>
              )}

              {lensB && (
                <div style={{ padding: 12, background: 'rgba(0,0,0,0.2)', borderRadius: 8, borderLeft: '3px solid var(--accent-purple)' }}>
                  <p style={{ fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)', marginBottom: 8 }}>
                    {t.results.lensB} <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>{t.results.lensBName}</span>
                  </p>
                  {[
                    { key: 'context_phase', label: t.results.context },
                    { key: 'tension_phase', label: t.results.tension },
                    { key: 'meaning_phase', label: t.results.meaning },
                    { key: 'function_phase', label: t.results.function },
                  ].map(({ key, label }) => {
                    const text = (lensB as any)[key];
                    return text ? (
                      <div key={key} style={{ marginBottom: 6 }}>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{label}</span>
                        <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>{text}</p>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      {status === 'pending' && onInterpret && (
        <div style={{ marginTop: 12 }}>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onInterpret(object.id)}
          >
            {t.object.analyze}
          </button>
        </div>
      )}
    </div>
  );
}

export default ObjectCard;
