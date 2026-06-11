'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { colors } from '@/lib/tokens';

export default function RootPage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (checked) return;
    try {
      const onboardingComplete = localStorage.getItem('silence-onboarding-complete') === 'true';
      if (onboardingComplete) {
        router.replace('/garden');
      } else {
        router.replace('/onboarding');
      }
    } catch {
      // localStorage blocked or unavailable — default to onboarding
      router.replace('/onboarding');
    }
    setChecked(true);
  }, [checked, router]);

  return (
    <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <span style={{ color: colors.textMuted, letterSpacing: '0.1em' }} aria-label="Loading silence" role="status">
        φ
      </span>
    </main>
  );
}
