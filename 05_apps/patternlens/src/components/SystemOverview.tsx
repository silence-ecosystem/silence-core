// ============================================
// components/SystemOverview.tsx
// Dashboard: system picture in one glance
// Mock data — replace with real API when available
// ============================================

'use client';

const MOCK_CONDITIONS = [
  { condition: 'Overload Protocol', affected: 7, lastSeen: 'Today, 14:32', color: '#ef4444' },
  { condition: 'Buffer Overflow', affected: 3, lastSeen: 'Yesterday, 21:10', color: '#f59e0b' },
  { condition: 'Deadlock Loop', affected: 2, lastSeen: '3 days ago', color: '#8b5cf6' },
  { condition: 'Kernel Panic', affected: 1, lastSeen: '5 days ago', color: '#ef4444' },
];

const MOCK_TIMELINE = Array.from({ length: 14 }, (_, i) => ({
  day: i,
  created: Math.floor(Math.random() * 5) + 1,
  completed: Math.floor(Math.random() * 4),
}));

interface SystemOverviewProps {
  objectCount: number;
  completedCount: number;
  pendingCount: number;
}

export function SystemOverview({ objectCount, completedCount, pendingCount }: SystemOverviewProps) {
  const activeCommitments = objectCount - completedCount;
  const conditionsActive = MOCK_CONDITIONS.filter(c => c.affected > 0).length;

  return (
    <div style={{ marginBottom: 32 }}>
      {/* ═══ METRIC CARDS ═══ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 12, marginBottom: 24,
      }}>
        {/* Active commitments */}
        <div style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
          borderRadius: 12, padding: 20,
        }}>
          <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
            {activeCommitments}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
            Active commitments
          </div>
        </div>

        {/* Objects this week */}
        <div style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
          borderRadius: 12, padding: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-teal)' }}>
              {objectCount}
            </span>
            <span style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              / {completedCount} done
            </span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
            Objects this week
          </div>
        </div>

        {/* System conditions */}
        <div style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
          borderRadius: 12, padding: 20,
        }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {conditionsActive > 0 ? (
              <>
                <span style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#ef4444' }}>
                  {conditionsActive}
                </span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', alignSelf: 'flex-end', marginBottom: 4 }}>
                  conditions
                </span>
              </>
            ) : (
              <span style={{ fontSize: 20, fontFamily: 'var(--font-mono)', color: 'var(--success)' }}>
                Clear
              </span>
            )}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
            System conditions
          </div>
        </div>
      </div>

      {/* ═══ TIMELINE (14 days) ═══ */}
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 12, padding: 20, marginBottom: 24,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
            Last 14 days
          </p>
          <div style={{ display: 'flex', gap: 12, fontSize: 11, fontFamily: 'var(--font-mono)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--accent-cyan)' }} />
              Created
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--accent-teal)' }} />
              Completed
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 80 }}>
          {MOCK_TIMELINE.map((d, i) => {
            const maxVal = Math.max(...MOCK_TIMELINE.map(t => Math.max(t.created, t.completed)), 1);
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                <div style={{
                  width: '100%', borderRadius: '2px 2px 0 0',
                  height: `${(d.created / maxVal) * 60}px`,
                  background: 'var(--accent-cyan)', opacity: 0.7,
                  minHeight: 2,
                }} />
                <div style={{
                  width: '100%', borderRadius: '2px 2px 0 0',
                  height: `${(d.completed / maxVal) * 60}px`,
                  background: 'var(--accent-teal)', opacity: 0.5,
                  minHeight: 2,
                }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ SYSTEM CONDITIONS TABLE ═══ */}
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 12, overflow: 'hidden',
      }}>
        <div style={{
          padding: '14px 20px', borderBottom: '1px solid var(--border)',
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr',
          fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)',
          textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          <span>Condition</span>
          <span>Objects affected</span>
          <span>Last seen</span>
        </div>
        {MOCK_CONDITIONS.map((row) => (
          <div key={row.condition} style={{
            padding: '12px 20px', borderBottom: '1px solid var(--border)',
            display: 'grid', gridTemplateColumns: '2fr 1fr 1fr',
            fontSize: 13, alignItems: 'center',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: row.color }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'var(--text-primary)' }}>
                {row.condition}
              </span>
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
              {row.affected}
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {row.lastSeen}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
