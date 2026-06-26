'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const ARCHETYPE_META: Record<string, { icon: string; color: string; pattern: string }> = {
  Creator: { icon: '🎨', color: '#8b5cf6', pattern: 'Generation, innovation, building from nothing' },
  Ruler: { icon: '👑', color: '#6366f1', pattern: 'Control, structure, order-building' },
  Caregiver: { icon: '🤲', color: '#10b981', pattern: 'Support, maintenance, resource allocation' },
  Explorer: { icon: '🧭', color: '#06b6d4', pattern: 'Novelty-seeking, boundary-testing, expansion' },
  Sage: { icon: '📚', color: '#3b82f6', pattern: 'Analysis, knowledge acquisition, pattern recognition' },
  Hero: { icon: '⚔️', color: '#ef4444', pattern: 'Challenge-seeking, obstacle-overcoming' },
  Rebel: { icon: '🔥', color: '#f97316', pattern: 'Rule-breaking, disruption, status quo challenge' },
  Magician: { icon: '✨', color: '#a855f7', pattern: 'Transformation, synthesis, connecting systems' },
  Lover: { icon: '💜', color: '#ec4899', pattern: 'Connection, intensity, deep engagement' },
  Jester: { icon: '🎭', color: '#fbbf24', pattern: 'Lightness, reframing, tension-release' },
  Innocent: { icon: '🌱', color: '#22c55e', pattern: 'Trust, optimism, simplification' },
  Orphan: { icon: '🌙', color: '#64748b', pattern: 'Survival, adaptation, self-reliance' },
}

interface BlendData {
  primary: { archetype: string; score: number }
  secondary: { archetype: string; score: number } | null
  tertiary: { archetype: string; score: number } | null
  timestamp: string
}

interface HistoryEntry {
  blend: BlendData
  created_at: string
}

export default function ArchetypesPage() {
  const router = useRouter()
  const [blend, setBlend] = useState<BlendData | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [blendRes, histRes] = await Promise.all([
          fetch('/api/archetypes/blend'),
          fetch('/api/archetypes/history'),
        ])
        if (blendRes.status === 401) { router.push('/login'); return }

        if (blendRes.ok) {
          const blendData = await blendRes.json()
          if (blendData.blend) setBlend(blendData.blend)
        }
        if (histRes.ok) {
          const histData = await histRes.json()
          if (histData.history) setHistory(histData.history)
        }
      } catch {
        // Graceful degradation
      }
      setLoading(false)
    }
    load()
  }, [router])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: '#888' }}>
        Loading archetype data...
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#e8e8e8' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
        <Link href="/dashboard" style={{ color: '#888', fontSize: 13, textDecoration: 'none', marginBottom: 24, display: 'inline-block' }}>
          &larr; Dashboard
        </Link>

        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Archetype Profile</h1>
        <p style={{ color: '#666', fontSize: 13, marginBottom: 32 }}>
          Your patterns currently align with the following archetypes. This is structural observation, not identity.
        </p>

        {/* Current Blend */}
        {blend ? (
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888', marginBottom: 16 }}>Current Blend</h2>
            <div style={{ display: 'grid', gridTemplateColumns: blend.secondary ? (blend.tertiary ? '1fr 1fr 1fr' : '1fr 1fr') : '1fr', gap: 12, maxWidth: 600 }}>
              {/* Primary */}
              <div style={{
                padding: 24, background: '#111', borderRadius: 8,
                border: `1px solid ${ARCHETYPE_META[blend.primary.archetype]?.color || '#333'}`,
                textAlign: 'center'
              }}>
                <p style={{ fontSize: 10, textTransform: 'uppercase', color: '#888', marginBottom: 8, letterSpacing: '0.1em' }}>Primary</p>
                <p style={{ fontSize: 32 }}>{ARCHETYPE_META[blend.primary.archetype]?.icon || '?'}</p>
                <p style={{ fontSize: 18, fontWeight: 700, marginTop: 8, color: ARCHETYPE_META[blend.primary.archetype]?.color || '#e8e8e8' }}>
                  {blend.primary.archetype}
                </p>
                <p style={{ fontSize: 13, fontFamily: 'monospace', color: '#888', marginTop: 4 }}>
                  {Math.round(blend.primary.score * 100)}%
                </p>
              </div>

              {/* Secondary */}
              {blend.secondary && (
                <div style={{ padding: 24, background: '#111', borderRadius: 8, border: '1px solid #222', textAlign: 'center' }}>
                  <p style={{ fontSize: 10, textTransform: 'uppercase', color: '#888', marginBottom: 8, letterSpacing: '0.1em' }}>Secondary</p>
                  <p style={{ fontSize: 28 }}>{ARCHETYPE_META[blend.secondary.archetype]?.icon || '?'}</p>
                  <p style={{ fontSize: 16, fontWeight: 600, marginTop: 8, color: ARCHETYPE_META[blend.secondary.archetype]?.color || '#ccc' }}>
                    {blend.secondary.archetype}
                  </p>
                  <p style={{ fontSize: 13, fontFamily: 'monospace', color: '#888', marginTop: 4 }}>
                    {Math.round(blend.secondary.score * 100)}%
                  </p>
                </div>
              )}

              {/* Tertiary */}
              {blend.tertiary && (
                <div style={{ padding: 24, background: '#111', borderRadius: 8, border: '1px solid #222', textAlign: 'center' }}>
                  <p style={{ fontSize: 10, textTransform: 'uppercase', color: '#888', marginBottom: 8, letterSpacing: '0.1em' }}>Tertiary</p>
                  <p style={{ fontSize: 24 }}>{ARCHETYPE_META[blend.tertiary.archetype]?.icon || '?'}</p>
                  <p style={{ fontSize: 14, fontWeight: 600, marginTop: 8, color: '#aaa' }}>
                    {blend.tertiary.archetype}
                  </p>
                  <p style={{ fontSize: 13, fontFamily: 'monospace', color: '#888', marginTop: 4 }}>
                    {Math.round(blend.tertiary.score * 100)}%
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: 40, padding: 32, background: '#111', borderRadius: 8, border: '1px solid #222', textAlign: 'center' }}>
            <p style={{ color: '#888', fontSize: 14 }}>No archetype data yet. Create and analyze an object to generate your archetype profile.</p>
            <Link href="/new" style={{ color: '#21808d', fontSize: 13, textDecoration: 'none', marginTop: 12, display: 'inline-block' }}>
              Create your first object &rarr;
            </Link>
          </div>
        )}

        {/* 12 Archetype Grid */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888', marginBottom: 16 }}>All 12 Archetypes</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {Object.entries(ARCHETYPE_META).map(([name, meta]) => {
              const score = blend?.primary.archetype === name ? blend.primary.score
                : blend?.secondary?.archetype === name ? blend.secondary.score
                : blend?.tertiary?.archetype === name ? blend.tertiary.score : 0
              return (
                <div key={name} style={{
                  padding: 16, background: '#111', borderRadius: 8,
                  border: `1px solid ${score > 0 ? meta.color + '40' : '#222'}`,
                  opacity: score > 0 ? 1 : 0.6,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{meta.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: score > 0 ? meta.color : '#aaa' }}>{name}</span>
                  </div>
                  <p style={{ color: '#666', fontSize: 11, lineHeight: 1.4, marginBottom: 8 }}>{meta.pattern}</p>
                  {/* Score bar */}
                  <div style={{ height: 4, background: '#222', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${Math.round(score * 100)}%`, height: '100%', background: meta.color, borderRadius: 2, transition: 'width 300ms ease' }} />
                  </div>
                  {score > 0 && (
                    <p style={{ fontSize: 10, fontFamily: 'monospace', color: '#888', marginTop: 4, textAlign: 'right' }}>{Math.round(score * 100)}%</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Shift History */}
        {history.length > 1 && (
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888', marginBottom: 16 }}>Shift History</h2>
            <div style={{ padding: 16, background: '#111', borderRadius: 8, border: '1px solid #222' }}>
              {history.slice(0, 10).map((entry, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: i < history.length - 1 ? '1px solid #1a1a1a' : 'none'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{ARCHETYPE_META[entry.blend?.primary?.archetype]?.icon || '?'}</span>
                    <span style={{ fontSize: 13, color: '#ccc' }}>{entry.blend?.primary?.archetype || 'Unknown'}</span>
                    {entry.blend?.secondary && (
                      <span style={{ fontSize: 11, color: '#666' }}>+ {entry.blend.secondary.archetype}</span>
                    )}
                  </div>
                  <span style={{ fontSize: 11, color: '#555', fontFamily: 'monospace' }}>
                    {new Date(entry.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <p style={{ color: '#555', fontSize: 11, textAlign: 'center', marginTop: 32 }}>
          Structural analysis tool. Not advice or diagnosis. Archetypes describe structural patterns, not identity.
        </p>
      </div>
    </div>
  )
}
