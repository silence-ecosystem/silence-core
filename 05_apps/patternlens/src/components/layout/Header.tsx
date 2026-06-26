'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface HeaderProps {
  tier?: string;
  remainingObjects?: number | null;
}

export function Header({ tier = 'FREE', remainingObjects }: HeaderProps) {
  const router = useRouter();
  const { lang, setLang, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <>
    <header style={{
      height: 56,
      background: 'rgba(18, 18, 26, 0.9)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(12px)',
    }}>
      {/* Logo */}
      <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
        <div style={{
          width: 28, height: 28,
          background: 'var(--accent-cyan)',
          borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>S</span>
        </div>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontWeight: 600,
          fontSize: 15,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
        }}>
          SILENCE
        </span>
      </Link>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Language Switcher */}
        <div style={{ display: 'flex', gap: 0, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)' }}>
          <button
            onClick={() => setLang('en')}
            style={{
              padding: '4px 10px',
              fontSize: 11,
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              background: lang === 'en' ? 'var(--accent-cyan)' : 'transparent',
              color: lang === 'en' ? '#fff' : '#a1a1aa',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 150ms',
            }}
          >
            EN
          </button>
          <button
            onClick={() => setLang('pl')}
            style={{
              padding: '4px 10px',
              fontSize: 11,
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              background: lang === 'pl' ? 'var(--accent-cyan)' : 'transparent',
              color: lang === 'pl' ? '#fff' : '#a1a1aa',
              border: 'none',
              borderLeft: '1px solid var(--border)',
              cursor: 'pointer',
              transition: 'all 150ms',
            }}
          >
            PL
          </button>
        </div>

        {/* Beta badge */}
        <span className="shimmer-card" style={{
          padding: '3px 10px',
          fontSize: 10,
          fontWeight: 600,
          fontFamily: 'var(--font-mono)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          background: 'rgba(6, 182, 212, 0.12)',
          color: 'var(--accent-cyan)',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          borderRadius: 999,
        }}>
          {t.beta.badge}
        </span>

        {/* Menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              padding: '6px 10px',
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 13,
              fontFamily: 'var(--font-mono)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {menuOpen && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '100%',
              marginTop: 4,
              width: 180,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden',
              zIndex: 100,
            }}>
              <Link href="/dashboard" style={{
                display: 'block', padding: '10px 16px', fontSize: 13,
                color: 'var(--text-secondary)', textDecoration: 'none',
              }}>
                {t.nav.dashboard}
              </Link>
              <Link href="/archive" style={{
                display: 'block', padding: '10px 16px', fontSize: 13,
                color: 'var(--text-secondary)', textDecoration: 'none',
              }}>
                {t.nav.archive}
              </Link>
              <div style={{ height: 1, background: 'var(--border)' }} />
              <button
                onClick={handleSignOut}
                style={{
                  display: 'block', width: '100%', padding: '10px 16px',
                  fontSize: 13, color: 'var(--accent-red)',
                  background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer',
                }}
              >
                {t.nav.signOut}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>

    {/* Beta banner */}
    <div className="shimmer-card" style={{
      padding: '8px 20px',
      background: 'linear-gradient(90deg, rgba(6,182,212,0.06), rgba(20,184,166,0.06), rgba(6,182,212,0.06))',
      borderBottom: '1px solid rgba(6,182,212,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    }}>
      <span style={{
        fontSize: 10,
        fontWeight: 600,
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.08em',
        color: 'var(--accent-cyan)',
        border: '1px solid rgba(6,182,212,0.25)',
        borderRadius: 999,
        padding: '2px 8px',
        background: 'rgba(6,182,212,0.1)',
      }}>
        {t.beta.badge}
      </span>
      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
        {t.beta.unlimited}
      </span>
    </div>
    </>
  );
}
