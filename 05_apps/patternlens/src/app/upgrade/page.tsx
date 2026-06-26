// ============================================
// src/app/upgrade/page.tsx
// PatternLens v4.0 - PRO Upgrade Page
// ============================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';

export default function UpgradePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    
    try {
      // Create Stripe checkout session
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: 'price_patternlens_pro_monthly' })
      });
      
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Checkout failed');
      }
    } catch (err) {
      alert('Błąd płatności. Spróbuj ponownie.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upgrade-page">
      <Header tier="FREE" />

      <main className="container">
        <section className="hero">
          <h1 className="gradient-text">Odblokuj pełny potencjał 🚀</h1>
          <p className="text-secondary">
            Z PRO masz nieograniczony dostęp do wszystkich funkcji PatternLens
          </p>
        </section>

        {/* Pricing Cards */}
        <section className="pricing-grid">
          {/* FREE Plan */}
          <div className="pricing-card glass-card">
            <div className="plan-header">
              <h3>FREE</h3>
              <div className="price">
                <span className="amount">0 PLN</span>
                <span className="period">/ zawsze</span>
              </div>
            </div>
            
            <ul className="features">
              <li>✓ Nieograniczone lokalne obiekty</li>
              <li>✓ Podwójna soczewka (A/B)</li>
              <li>✓ Bazowe wykrywanie wzorców</li>
              <li>✓ 12 archetypów</li>
              <li className="disabled">✗ Synteza wzorców</li>
              <li className="disabled">✗ Ghost Patterns</li>
              <li className="disabled">✗ Eksport danych</li>
              <li className="disabled">✗ Priorytetowe przetwarzanie</li>
            </ul>
            
            <button className="btn btn-secondary btn-full" disabled>
              Obecny plan
            </button>
          </div>

          {/* PRO Plan */}
          <div className="pricing-card glass-card pro-card">
            <div className="pro-badge">Popularne</div>
            
            <div className="plan-header">
              <h3>PRO</h3>
              <div className="price">
                <span className="amount">49 PLN</span>
                <span className="period">/ miesiąc</span>
              </div>
            </div>
            
            <ul className="features">
              <li>✓ <strong>Nieograniczone</strong> obiekty</li>
              <li>✓ Podwójna soczewka (A/B)</li>
              <li>✓ Bezpieczne przechowywanie</li>
              <li>✓ <strong>Synteza wzorców</strong></li>
              <li>✓ <strong>Ghost Patterns</strong> (ukryte wzorce)</li>
              <li>✓ <strong>Eksport do PDF</strong></li>
              <li>✓ <strong>Priorytetowe przetwarzanie</strong></li>
              <li>✓ Wsparcie email</li>
            </ul>
            
            <button 
              className="btn btn-primary btn-full btn-lg"
              onClick={handleUpgrade}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Przekierowywanie...
                </>
              ) : (
                'Ulepsz do PRO'
              )}
            </button>
            
            <p className="guarantee">
              💰 30-dniowa gwarancja zwrotu pieniędzy
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2>Co zyskujesz z PRO?</h2>
          
          <div className="features-grid">
            <div className="feature-card glass-card">
              <div className="feature-icon">♾️</div>
              <h4>Bez limitów</h4>
              <p className="text-secondary">
                Analizuj tyle sytuacji, ile potrzebujesz. Pełna moc analizy.
              </p>
            </div>

            <div className="feature-card glass-card">
              <div className="feature-icon">🔮</div>
              <h4>Synteza wzorców</h4>
              <p className="text-secondary">
                AI identyfikuje powtarzające się wzorce w Twoich obiektach.
              </p>
            </div>

            <div className="feature-card glass-card">
              <div className="feature-icon">👻</div>
              <h4>Ghost Patterns</h4>
              <p className="text-secondary">
                Odkrywaj ukryte wzorce, których sam nie zauważasz.
              </p>
            </div>

            <div className="feature-card glass-card">
              <div className="feature-icon">⚡</div>
              <h4>Priorytet</h4>
              <p className="text-secondary">
                Twoje analizy są przetwarzane przed innymi użytkownikami.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="faq-section">
          <h2>Często zadawane pytania</h2>
          
          <div className="faq-grid">
            <div className="faq-item glass-card">
              <h4>Czy mogę anulować w każdej chwili?</h4>
              <p className="text-secondary">
                Tak, bez żadnych zobowiązań. Anuluj kiedy chcesz z panelu ustawień.
              </p>
            </div>

            <div className="faq-item glass-card">
              <h4>Co się stanie z moimi danymi po anulowaniu?</h4>
              <p className="text-secondary">
                Twoje obiekty pozostają dostępne. Wrócisz do planu FREE z lokalnymi obiektami.
              </p>
            </div>

            <div className="faq-item glass-card">
              <h4>Czy to bezpieczne?</h4>
              <p className="text-secondary">
                Płatności obsługuje Stripe. Twoje dane są szyfrowane end-to-end.
              </p>
            </div>

            <div className="faq-item glass-card">
              <h4>Jakie metody płatności akceptujecie?</h4>
              <p className="text-secondary">
                Karty kredytowe/debetowe, Google Pay, Apple Pay, BLIK.
              </p>
            </div>
          </div>
        </section>

        {/* DIPLO Disclaimer */}
        <section style={{
          maxWidth: 600,
          margin: '0 auto',
          padding: '16px 20px',
          background: 'rgba(34,34,40,0.5)',
          border: '1px solid var(--color-border, #222228)',
          borderRadius: 10,
          textAlign: 'center',
        }}>
          <p style={{ color: '#888893', fontSize: 12, lineHeight: 1.5 }}>
            Structural analysis tool. Not therapy, diagnosis, or advice.
            All outputs are structural hypotheses, not facts.
          </p>
        </section>
      </main>

      <style jsx>{`
        .upgrade-page {
          min-height: 100vh;
        }

        main {
          padding: var(--space-2xl) var(--space-lg);
        }

        .hero {
          text-align: center;
          margin-bottom: var(--space-3xl);
        }

        .hero h1 {
          margin-bottom: var(--space-md);
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: var(--space-xl);
          max-width: 800px;
          margin: 0 auto var(--space-3xl);
        }

        .pricing-card {
          padding: var(--space-2xl);
          position: relative;
        }

        .pro-card {
          border-color: var(--accent-purple);
          background: linear-gradient(135deg, rgba(157, 0, 255, 0.1), var(--glass-bg));
        }

        .pro-badge {
          position: absolute;
          top: -12px;
          right: var(--space-lg);
          background: linear-gradient(135deg, var(--accent-purple), var(--accent-pink));
          color: white;
          padding: var(--space-xs) var(--space-md);
          border-radius: var(--radius-full);
          font-size: var(--font-size-xs);
          font-weight: 600;
        }

        .plan-header {
          text-align: center;
          margin-bottom: var(--space-xl);
        }

        .plan-header h3 {
          font-size: var(--font-size-xl);
          margin-bottom: var(--space-sm);
        }

        .price {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: var(--space-xs);
        }

        .amount {
          font-size: var(--font-size-4xl);
          font-weight: 700;
          color: var(--primary-neon);
        }

        .period {
          color: var(--color-text-tertiary);
        }

        .features {
          list-style: none;
          margin-bottom: var(--space-xl);
        }

        .features li {
          padding: var(--space-sm) 0;
          border-bottom: 1px solid var(--color-border);
        }

        .features li:last-child {
          border-bottom: none;
        }

        .features li.disabled {
          color: var(--color-text-tertiary);
        }

        .guarantee {
          text-align: center;
          margin-top: var(--space-md);
          font-size: var(--font-size-sm);
          color: var(--color-text-tertiary);
        }

        .features-section,
        .faq-section {
          margin-bottom: var(--space-3xl);
        }

        .features-section h2,
        .faq-section h2 {
          text-align: center;
          margin-bottom: var(--space-xl);
        }

        .features-grid,
        .faq-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--space-lg);
        }

        .feature-card {
          text-align: center;
          padding: var(--space-xl);
        }

        .feature-icon {
          font-size: 40px;
          margin-bottom: var(--space-md);
        }

        .feature-card h4 {
          margin-bottom: var(--space-sm);
        }

        .faq-item {
          padding: var(--space-lg);
        }

        .faq-item h4 {
          margin-bottom: var(--space-sm);
          color: var(--primary-neon);
        }

        @media (max-width: 768px) {
          .pricing-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
