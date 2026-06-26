'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { SystemOverview } from '@/components/SystemOverview';
import AnalysisInput from '@/components/AnalysisInput';
import ObjectCard from '@/components/ObjectCard';
import { CrisisModal } from '@/components/safety/CrisisModal';
import { useObjects, useInterpret, useProfile, getProcessingStatus } from '@/hooks/useApi';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function DashboardPage() {
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
  const [showCrisis, setShowCrisis] = useState(false);
  const [crisisResources, setCrisisResources] = useState<any[]>([]);

  const { objects, fetchObjects } = useObjects();
  const { interpret, interpreting, result } = useInterpret();
  const { profile, fetchProfile, remainingObjects, canCreateObject } = useProfile();

  useEffect(() => {
    const checkAuth = async () => {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      await Promise.all([fetchProfile(), fetchObjects()]);
      setLoading(false);
    };
    checkAuth();
  }, [supabase, router, fetchProfile, fetchObjects]);

  useEffect(() => {
    if (result?.crisis) {
      setCrisisResources(result.resources || []);
      setShowCrisis(true);
    }
  }, [result]);

  const handleInterpret = async (objectId: string) => {
    const res = await interpret(objectId);
    if (res && !res.error && !res.crisis) {
      await fetchObjects();
    }
  };

  const handleNewObject = async () => {
    await fetchObjects();
    await fetchProfile();
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 16,
        background: 'var(--bg-base)', color: 'var(--text-primary)',
      }}>
        <div className="spinner" />
        <p style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {t.common.loading}
        </p>
      </div>
    );
  }

  const recentObjects = objects.slice(0, 5);
  const pendingObjects = objects.filter(o => getProcessingStatus(o) === 'pending');
  const completedObjects = objects.filter(o => getProcessingStatus(o) === 'completed');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>
      <Header tier={profile?.tier || 'FREE'} remainingObjects={remainingObjects} />

      <main className="container" style={{ flex: 1, padding: '32px 16px' }}>
        {/* Welcome */}
        <section style={{ marginBottom: 32 }}>
          <h1 style={{
            fontFamily: 'var(--font-mono)', fontWeight: 700,
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            color: 'var(--text-primary)',
          }}>
            {t.dashboard.greeting}
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: 14 }}>
            {t.dashboard.subtitle}
          </p>
        </section>

        {/* System Overview */}
        <SystemOverview
          objectCount={objects.length}
          completedCount={completedObjects.length}
          pendingCount={pendingObjects.length}
        />

        {/* Stats */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 12,
          marginBottom: 32,
        }}>
          <div style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 10, padding: 20,
          }}>
            <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
              {objects.length}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
              {t.dashboard.objects}
            </div>
          </div>

          <div style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 10, padding: 20,
          }}>
            <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-teal)' }}>
              {completedObjects.length}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
              {t.dashboard.analyzed}
            </div>
          </div>

          <div style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 10, padding: 20,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 20, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                &infin;
              </span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
              {t.beta.unlimited}
            </div>
          </div>
        </section>

        {/* New Analysis Input */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{
            fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 16,
            color: 'var(--text-primary)', marginBottom: 16,
          }}>
            {t.dashboard.newAnalysis}
          </h2>
          <AnalysisInput
            onSuccess={handleNewObject}
            canCreate={canCreateObject}
            remaining={remainingObjects}
          />
        </section>

        {/* Pending Objects */}
        {pendingObjects.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h2 style={{
              fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 16,
              color: 'var(--text-primary)', marginBottom: 16,
            }}>
              {t.dashboard.pendingAnalysis}
              <span className="badge badge-warning" style={{ marginLeft: 8 }}>{pendingObjects.length}</span>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 12 }}>
              {pendingObjects.map(obj => (
                <ObjectCard key={obj.id} object={obj} onInterpret={handleInterpret} />
              ))}
            </div>
          </section>
        )}

        {/* Recent Analyses */}
        <section style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{
              fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 16,
              color: 'var(--text-primary)',
            }}>
              {t.dashboard.recentAnalyses}
            </h2>
            <Link href="/archive" style={{
              fontSize: 13, color: 'var(--accent-cyan)', textDecoration: 'none',
              fontFamily: 'var(--font-mono)',
            }}>
              {t.dashboard.viewAll} &rarr;
            </Link>
          </div>

          {recentObjects.filter(o => getProcessingStatus(o) === 'completed').length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 12 }}>
              {recentObjects.filter(o => getProcessingStatus(o) === 'completed').map(obj => (
                <ObjectCard key={obj.id} object={obj} onInterpret={handleInterpret} />
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center', padding: 48,
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: 12,
            }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{t.dashboard.noObjects}</p>
              <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 13 }}>{t.dashboard.noObjectsHint}</p>
            </div>
          )}
        </section>

        {/* Beta info — replaces upgrade banner */}
      </main>

      {/* Footer */}
      <footer style={{ padding: '20px 0', borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>
            {t.footer.disclaimer}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
            v5.2 &middot; SILENCE.OBJECTS
          </p>
        </div>
      </footer>

      <CrisisModal
        isOpen={showCrisis}
        onClose={() => setShowCrisis(false)}
        resources={crisisResources}
        level="medium"
      />
    </div>
  );
}
