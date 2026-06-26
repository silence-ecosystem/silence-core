'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Header } from '@/components/layout/Header';
import ObjectCard from '@/components/ObjectCard';
import { useObjects, useInterpret, useProfile, usePatterns, getProcessingStatus } from '@/hooks/useApi';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function ArchivePage() {
  const router = useRouter();
  const { t } = useLanguage();

  // createBrowserClient must not run during SSR (env vars absent at build time)
  const supabase = useMemo(
    () =>
      typeof window === 'undefined'
        ? null
        : createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
          ),
    []
  );

  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  const { objects, fetchObjects } = useObjects();
  const { interpret } = useInterpret();
  const { profile, fetchProfile, remainingObjects } = useProfile();
  const { synthesize, synthesizing } = usePatterns();

  useEffect(() => {
    const init = async () => {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      await Promise.all([fetchProfile(), fetchObjects()]);
      setLoading(false);
    };
    init();
  }, [supabase, router, fetchProfile, fetchObjects]);

  const handleSelect = (id: string, selected: boolean) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      selected ? next.add(id) : next.delete(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredObjects.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredObjects.map(o => o.id)));
    }
  };

  const handleInterpret = async (id: string) => {
    await interpret(id);
    await fetchObjects();
  };

  const handleSynthesize = async () => {
    if (selectedIds.size < 3) {
      alert(t.archive.minAlert);
      return;
    }
    const result = await synthesize(Array.from(selectedIds));
    if (result) router.push('/patterns');
  };

  const filteredObjects = objects.filter(obj => {
    if (filter === 'all') return true;
    if (filter === 'completed') return getProcessingStatus(obj) === 'completed';
    if (filter === 'pending') return getProcessingStatus(obj) === 'pending';
    return true;
  });

  const completedCount = objects.filter(o => getProcessingStatus(o) === 'completed').length;
  const pendingCount = objects.filter(o => getProcessingStatus(o) === 'pending').length;

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 16,
        background: 'var(--bg-base)',
      }}>
        <div className="spinner" />
        <p style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {t.common.loading}
        </p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Header tier={profile?.tier || 'FREE'} remainingObjects={remainingObjects} />

      <main className="container" style={{ padding: '32px 16px' }}>
        {/* Page Header */}
        <section style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 22, color: 'var(--text-primary)', marginBottom: 4 }}>
            {t.archive.title}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            {objects.length} {t.archive.objectsLabel} | {completedCount} {t.archive.analyzedLabel}
          </p>
        </section>

        {/* Toolbar */}
        <section style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: 12, marginBottom: 20,
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
          borderRadius: 10, flexWrap: 'wrap', gap: 10,
        }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilter('all')}
            >
              {t.archive.all} ({objects.length})
            </button>
            <button
              className={`btn btn-sm ${filter === 'completed' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilter('completed')}
            >
              {t.archive.done} ({completedCount})
            </button>
            <button
              className={`btn btn-sm ${filter === 'pending' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilter('pending')}
            >
              {t.archive.pending} ({pendingCount})
            </button>
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-ghost btn-sm" onClick={handleSelectAll}>
              {selectedIds.size === filteredObjects.length ? t.archive.deselect : t.archive.selectAll}
            </button>

            {selectedIds.size >= 3 && (
              <button className="btn btn-primary btn-sm" onClick={handleSynthesize} disabled={synthesizing}>
                {synthesizing ? t.archive.synthesizing : `${t.archive.synthesize} (${selectedIds.size})`}
              </button>
            )}
          </div>
        </section>

        {/* Selection info */}
        {selectedIds.size > 0 && (
          <div style={{
            padding: 12, marginBottom: 16,
            background: 'var(--accent-cyan-muted)', borderRadius: 8, textAlign: 'center',
            fontSize: 13, color: 'var(--text-secondary)',
          }}>
            <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{selectedIds.size}</span> {t.archive.selected}
            {selectedIds.size < 3 && <span style={{ color: 'var(--text-muted)' }}> {t.archive.minForSynthesis}</span>}
          </div>
        )}

        {/* Objects grid */}
        <section>
          {filteredObjects.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: 12,
            }}>
              {filteredObjects.map(obj => (
                <ObjectCard
                  key={obj.id}
                  object={obj}
                  onInterpret={handleInterpret}
                  onSelect={handleSelect}
                  selectable={true}
                  selected={selectedIds.has(obj.id)}
                />
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center', padding: 48,
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: 12,
            }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{t.archive.empty}</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
