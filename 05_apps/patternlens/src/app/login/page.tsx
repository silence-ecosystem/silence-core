// ============================================
// src/app/login/page.tsx
// PatternLens v5.2 — SILENCE DARK Login + Landing
// DIPLO-compliant: structural language only
// ============================================

'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function LoginPage() {
  const router = useRouter();

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

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/dashboard');
    });
  }, [supabase, router]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [message, setMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase!.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message.includes('Email not confirmed')) {
          setError('Email nie został potwierdzony. Sprawdź skrzynkę (w tym spam) lub poczekaj kilka minut.');
        } else if (error.message.includes('Invalid login credentials')) {
          setError('Nieprawidłowy email lub hasło.');
        } else { throw error; }
        return;
      }
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally { setLoading(false); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase!.auth.signUp({
        email, password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: { locale: 'pl' },
        }
      });
      if (error) {
        if (error.message.includes('already registered') || error.message.includes('already been registered')) {
          setError('Ten email jest już zarejestrowany. Zaloguj się.');
        } else { throw error; }
        return;
      }
      if (data.session) { router.push('/dashboard'); return; }
      setMessage('Sprawdź email — wysłaliśmy link aktywacyjny. Sprawdź też folder spam.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally { setLoading(false); }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase!.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset`
      });
      if (error) throw error;
      setMessage('Check your email for a reset link');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally { setLoading(false); }
  };

  const handleOAuth = async (provider: 'google') => {
    await supabase!.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    });
  };

  const mono = "'JetBrains Mono', monospace";
  const sans = "'Outfit', system-ui, sans-serif";

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px',
    background: '#1a1a1e', border: '1px solid #222228', borderRadius: 10,
    color: '#e8e8ec', fontSize: 14, fontFamily: sans, outline: 'none',
    transition: 'border-color 200ms',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontFamily: mono, fontSize: 10, fontWeight: 500,
    textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888893', marginBottom: 6,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#08080a', color: '#e8e8ec' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '48px 24px' }}>

        {/* ═══ HERO ═══ */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontFamily: mono, fontWeight: 600, fontSize: 22, color: '#e8e8ec', letterSpacing: '-0.02em' }}>
            <span style={{ color: '#21808d', marginRight: 8 }}>&#9673;</span>PatternLens
          </p>
          <h1 style={{
            fontFamily: sans, fontWeight: 600, fontSize: 28, color: '#f5f7fa',
            marginTop: 20, lineHeight: 1.3, letterSpacing: '-0.01em',
          }}>
            See how your system actually behaves
          </h1>
          <p style={{
            fontFamily: sans, fontWeight: 300, fontSize: 15, color: '#888893',
            marginTop: 14, lineHeight: 1.7, maxWidth: 440, marginLeft: 'auto', marginRight: 'auto',
          }}>
            PatternLens maps your decisions, commitments, and blockers into structural
            patterns — so you can debug overload, drift, and deadlocks like a production system.
          </p>
        </div>

        {/* ═══ AUTH CARD ═══ */}
        <div style={{
          background: '#111113', border: '1px solid #222228', borderRadius: 16,
          padding: 32, boxShadow: '0 0 80px rgba(33,128,141,0.08)',
        }}>
          {/* Tabs */}
          {mode !== 'forgot' && (
            <div style={{ display: 'flex', gap: 0, marginBottom: 28, borderBottom: '1px solid #222228' }}>
              <button onClick={() => { setMode('login'); setError(null); setMessage(null); }}
                style={{
                  flex: 1, padding: '10px 0', background: 'none', border: 'none',
                  borderBottom: mode === 'login' ? '2px solid #21808d' : '2px solid transparent',
                  color: mode === 'login' ? '#e8e8ec' : '#55555e',
                  fontFamily: mono, fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 200ms',
                }}>
                Logowanie
              </button>
              <button onClick={() => { setMode('register'); setError(null); setMessage(null); }}
                style={{
                  flex: 1, padding: '10px 0', background: 'none', border: 'none',
                  borderBottom: mode === 'register' ? '2px solid #21808d' : '2px solid transparent',
                  color: mode === 'register' ? '#e8e8ec' : '#55555e',
                  fontFamily: mono, fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 200ms',
                }}>
                Rejestracja
              </button>
            </div>
          )}

          {/* Error / Message */}
          {error && (
            <div style={{
              padding: '10px 14px', borderRadius: 8, marginBottom: 20,
              background: 'rgba(204,68,68,0.1)', border: '1px solid rgba(204,68,68,0.25)',
              color: '#cc4444', fontSize: 13, fontFamily: sans,
            }}>{error}</div>
          )}
          {message && (
            <div style={{
              padding: '10px 14px', borderRadius: 8, marginBottom: 20,
              background: 'rgba(61,153,112,0.1)', border: '1px solid rgba(61,153,112,0.25)',
              color: '#3d9970', fontSize: 13, fontFamily: sans,
            }}>{message}</div>
          )}

          {/* Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle}>Email</label>
                <input type="email" placeholder="twoj@email.pl" value={email}
                  onChange={(e) => setEmail(e.target.value)} required style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = '#21808d'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#222228'; }}
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Password</label>
                <input type="password" placeholder="••••••••" value={password}
                  onChange={(e) => setPassword(e.target.value)} required style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = '#21808d'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#222228'; }}
                />
              </div>
              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '13px 0',
                background: loading ? 'rgba(33,128,141,0.5)' : '#21808d',
                color: '#fff', border: 'none', borderRadius: 10,
                fontFamily: mono, fontWeight: 600, fontSize: 14,
                cursor: loading ? 'wait' : 'pointer', transition: 'all 200ms',
              }}>
                {loading ? 'Logging in...' : 'Log in'}
              </button>
              <button type="button" onClick={() => setMode('forgot')} style={{
                width: '100%', padding: '10px 0', marginTop: 8, background: 'none',
                border: 'none', color: '#55555e', fontSize: 13, fontFamily: sans, cursor: 'pointer',
              }}>
                Forgot password?
              </button>
            </form>
          )}

          {/* Register Form */}
          {mode === 'register' && (
            <form onSubmit={handleRegister}>
              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle}>Email</label>
                <input type="email" placeholder="twoj@email.pl" value={email}
                  onChange={(e) => setEmail(e.target.value)} required style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = '#21808d'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#222228'; }}
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Password</label>
                <input type="password" placeholder="Min. 8 characters" value={password}
                  onChange={(e) => setPassword(e.target.value)} minLength={8} required style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = '#21808d'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#222228'; }}
                />
              </div>
              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '13px 0',
                background: loading ? 'rgba(33,128,141,0.5)' : '#21808d',
                color: '#fff', border: 'none', borderRadius: 10,
                fontFamily: mono, fontWeight: 600, fontSize: 14,
                cursor: loading ? 'wait' : 'pointer', transition: 'all 200ms',
              }}>
                {loading ? 'Creating...' : 'Start with 3 objects'}
              </button>
            </form>
          )}

          {/* Forgot Form */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgot}>
              <p style={{ color: '#888893', fontSize: 13, marginBottom: 20, fontFamily: sans }}>
                Enter your email and we will send a reset link.
              </p>
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Email</label>
                <input type="email" placeholder="twoj@email.pl" value={email}
                  onChange={(e) => setEmail(e.target.value)} required style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = '#21808d'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#222228'; }}
                />
              </div>
              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '13px 0', background: '#21808d', color: '#fff',
                border: 'none', borderRadius: 10, fontFamily: mono, fontWeight: 600,
                fontSize: 14, cursor: loading ? 'wait' : 'pointer',
              }}>
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
              <button type="button" onClick={() => setMode('login')} style={{
                width: '100%', padding: '10px 0', marginTop: 8, background: 'none',
                border: 'none', color: '#55555e', fontSize: 13, cursor: 'pointer',
              }}>
                Back to login
              </button>
            </form>
          )}

          {/* OAuth */}
          {mode !== 'forgot' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', gap: 12 }}>
                <div style={{ flex: 1, height: 1, background: '#222228' }} />
                <span style={{ color: '#55555e', fontSize: 12, fontFamily: sans }}>or</span>
                <div style={{ flex: 1, height: 1, background: '#222228' }} />
              </div>
              <button onClick={() => handleOAuth('google')} style={{
                width: '100%', padding: '12px 0', background: 'transparent',
                border: '1px solid #222228', borderRadius: 10, color: '#888893',
                fontSize: 13, fontFamily: sans, cursor: 'pointer', transition: 'border-color 200ms',
              }}
                onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.borderColor = '#333340'; }}
                onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.borderColor = '#222228'; }}
              >
                Continue with Google
              </button>
            </>
          )}
        </div>

        {/* ═══ 3 STRUCTURAL BULLETS ═══ */}
        <div style={{
          marginTop: 28, padding: '20px 24px', background: '#111113',
          border: '1px solid #222228', borderRadius: 12,
        }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              'Track commitments over time (where they start, stall, or die)',
              'Flag system conditions: Overload Protocol, Buffer Overflow, Deadlock Loops, Kernel Panics',
              'Get dual-lens structural views without advice, diagnosis, or "feel better" copy',
            ].map((text, i) => (
              <li key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                fontSize: 13, color: '#a0a0ab', fontFamily: sans, lineHeight: 1.6,
                marginBottom: i < 2 ? 12 : 0,
              }}>
                <span style={{ color: '#21808d', fontSize: 14, marginTop: 2, flexShrink: 0 }}>&#x25B8;</span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* ═══ PRICING ═══ */}
        <div style={{
          marginTop: 16, padding: '16px 20px', background: '#0e0e11',
          border: '1px solid #1a1a20', borderRadius: 10,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <span style={{ fontFamily: mono, fontSize: 12, color: '#21808d', fontWeight: 600 }}>FREE</span>
              <span style={{ fontSize: 12, color: '#55555e', marginLeft: 8 }}>
                Unlimited local objects · Core patterns · 12 archetypes
              </span>
            </div>
            <div>
              <span style={{ fontFamily: mono, fontSize: 12, color: '#c084fc', fontWeight: 600 }}>PRO</span>
              <span style={{ fontSize: 12, color: '#55555e', marginLeft: 8 }}>
                29 PLN/mo · Cloud sync + advanced analysis + predictions
              </span>
            </div>
          </div>
        </div>

        {/* ═══ DIPLO DISCLAIMER ═══ */}
        <div style={{
          marginTop: 16, padding: '14px 20px', background: '#111113',
          border: '1px solid #222228', borderRadius: 10,
        }}>
          <p style={{ color: '#888893', fontSize: 12, fontFamily: sans, lineHeight: 1.6, textAlign: 'center' }}>
            Structural analysis tool. Not therapy, diagnosis, or advice.
            All outputs are structural hypotheses, not facts.
          </p>
        </div>

        {/* ═══ SECONDARY CTA ═══ */}
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <a href="/support" style={{
            fontSize: 13, color: '#55555e', fontFamily: sans, textDecoration: 'none',
            transition: 'color 200ms',
          }}>
            View example workspace &rarr;
          </a>
        </div>

        {/* ═══ BLOCK 5: B2C / B2B / API TIERS ═══ */}
        <div style={{ marginTop: 48 }}>
          {/* For Individuals */}
          <div style={{
            padding: '24px 20px', background: '#0e0e11',
            border: '1px solid #1a1a20', borderRadius: 12, marginBottom: 12,
          }}>
            <p style={{ fontFamily: mono, fontSize: 11, letterSpacing: '0.1em', color: '#55555e', textTransform: 'uppercase', marginBottom: 16 }}>
              For Individuals (PatternLens)
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <p style={{ fontFamily: mono, fontSize: 14, fontWeight: 600, color: '#21808d' }}>FREE</p>
                <p style={{ fontSize: 11, color: '#55555e', marginTop: 2 }}>0 PLN/month</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0 0 0', fontSize: 12, color: '#888893' }}>
                  <li style={{ marginBottom: 4 }}>Unlimited local objects</li>
                  <li style={{ marginBottom: 4 }}>Core patterns</li>
                  <li style={{ marginBottom: 4 }}>Basic archetypes</li>
                  <li>Local compute, no cloud storage</li>
                </ul>
              </div>
              <div>
                <p style={{ fontFamily: mono, fontSize: 14, fontWeight: 600, color: '#c084fc' }}>PRO</p>
                <p style={{ fontSize: 11, color: '#55555e', marginTop: 2 }}>29 PLN/month</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0 0 0', fontSize: 12, color: '#888893' }}>
                  <li style={{ marginBottom: 4 }}>Cloud sync</li>
                  <li style={{ marginBottom: 4 }}>Advanced analysis &amp; dual-lens</li>
                  <li style={{ marginBottom: 4 }}>Predictions &amp; forecasting</li>
                  <li>Heavy AI as pay-per-use credits</li>
                </ul>
              </div>
            </div>
          </div>

          {/* For Institutions */}
          <div style={{
            padding: '24px 20px', background: '#0e0e11',
            border: '1px solid #1a1a20', borderRadius: 12, marginBottom: 12,
          }}>
            <p style={{ fontFamily: mono, fontSize: 11, letterSpacing: '0.1em', color: '#55555e', textTransform: 'uppercase', marginBottom: 12 }}>
              For Institutions (PatternsLab)
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 13, color: '#888893' }}>
              <li style={{ marginBottom: 6 }}>Per-seat or per-tenant licensing</li>
              <li style={{ marginBottom: 6 }}>Safety, medical, and legal compliance modules included</li>
              <li style={{ marginBottom: 6 }}>12-month institutional contracts</li>
            </ul>
            <a href="https://patternslab.app" style={{
              fontFamily: mono, fontSize: 12, color: '#21808d', textDecoration: 'none', marginTop: 8, display: 'inline-block',
            }}>
              patternslab.app &rarr;
            </a>
          </div>

          {/* For Developers */}
          <div style={{
            padding: '24px 20px', background: '#0e0e11',
            border: '1px solid #1a1a20', borderRadius: 12,
          }}>
            <p style={{ fontFamily: mono, fontSize: 11, letterSpacing: '0.1em', color: '#55555e', textTransform: 'uppercase', marginBottom: 12 }}>
              For Developers (API)
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 13, color: '#888893' }}>
              <li style={{ marginBottom: 6 }}>Usage-based API: objects, archetypes, predictions</li>
              <li style={{ marginBottom: 6 }}>Volume tiers: 100k / 1M / 10M calls per month</li>
              <li style={{ marginBottom: 6 }}>x3–x10 margin vs infrastructure cost</li>
            </ul>
            <span style={{ fontFamily: mono, fontSize: 12, color: '#55555e' }}>Coming soon</span>
          </div>
        </div>

        {/* ═══ BLOCK 6: SAFETY & COMPLIANCE ═══ */}
        <div style={{
          marginTop: 48, padding: '24px 20px', background: '#0e0e11',
          border: '1px solid #1a1a20', borderRadius: 12,
        }}>
          <p style={{ fontFamily: mono, fontSize: 11, letterSpacing: '0.1em', color: '#55555e', textTransform: 'uppercase', marginBottom: 16 }}>
            Safety &amp; Compliance
          </p>
          <p style={{ fontSize: 13, color: '#888893', fontFamily: sans, lineHeight: 1.7, marginBottom: 16 }}>
            3-layer crisis detection:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8, marginBottom: 16 }}>
            {[
              { layer: 'Layer 1', desc: 'Hard keyword blocking (PL/EN) — immediate safety modal' },
              { layer: 'Layer 2', desc: 'Soft keyword detection — AI risk assessment' },
              { layer: 'Layer 3', desc: 'Risk scoring (high/medium/low) — block/banner/proceed' },
            ].map(({ layer, desc }) => (
              <div key={layer} style={{
                display: 'flex', gap: 10, alignItems: 'flex-start',
                padding: '8px 12px', background: 'rgba(239,68,68,0.04)',
                border: '1px solid rgba(239,68,68,0.08)', borderRadius: 8,
              }}>
                <span style={{ fontFamily: mono, fontSize: 11, color: '#ef4444', fontWeight: 600, flexShrink: 0 }}>{layer}</span>
                <span style={{ fontSize: 12, color: '#888893' }}>{desc}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: '#888893', fontFamily: sans, lineHeight: 1.7 }}>
            <span style={{ color: '#ef4444', fontWeight: 600 }}>Safety is P0:</span>{' '}
            the app blocks high-risk inputs and shows local crisis resources (116 123, 112).
          </p>
          <p style={{ fontSize: 12, color: '#55555e', fontFamily: sans, marginTop: 10, lineHeight: 1.6 }}>
            Not a crisis line. Not real-time support. Safety layer filters content and shows resources.
          </p>
        </div>

        {/* ═══ BLOCK 7: FOOTER ═══ */}
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #1a1a20' }}>
          {/* Links */}
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <p style={{ fontSize: 12, color: '#55555e' }}>
              <a href="/terms" style={{ color: '#4a8fe2', textDecoration: 'none' }}>Terms</a>
              {' · '}
              <a href="/privacy" style={{ color: '#4a8fe2', textDecoration: 'none' }}>Privacy</a>
              {' · '}
              <a href="https://patternslab.app/investor/dashboard" style={{ color: '#4a8fe2', textDecoration: 'none' }}>Investor Brief</a>
              {' · '}
              <a href="https://github.com/Patternslab-ecosystem/SILENCE.OBJECTS" style={{ color: '#4a8fe2', textDecoration: 'none' }}>GitHub</a>
            </p>
          </div>

          {/* Unit economics */}
          <p style={{ fontSize: 11, color: '#333340', fontFamily: sans, textAlign: 'center', lineHeight: 1.6 }}>
            FREE users have zero marginal cost via local compute.
            Pricing follows the SILENCE.OBJECTS investor model.
          </p>

          {/* Version */}
          <p style={{ color: '#333340', fontSize: 10, fontFamily: mono, marginTop: 16, textAlign: 'center' }}>
            v5.2 · SILENCE.OBJECTS Framework
          </p>
        </div>

      </div>
    </div>
  );
}
