'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CrisisFilter from '@/components/CrisisFilter';
import IntentSelector, { type PreferredState } from '@/components/IntentSelector';
import ExperienceSelector, { type ExperienceLevel } from '@/components/ExperienceSelector';
import SelfReport, { type AhaDifficulty } from '@/components/SelfReport';
import ConsentsScreen from '@/components/ConsentsScreen';
import OnboardingProgress from '@/components/OnboardingProgress';
import { useEffectLog } from '@/hooks/useEffectLog';
import { trackSilenceEvent } from '@silence/sdk';
import { colors, timing, easing, radius } from '@/lib/tokens';

type OnboardingStep =
  | 'crisis'
  | 'welcome'
  | 'intent'
  | 'experience'
  | 'selfReport'
  | 'consents';

export default function OnboardingPage() {
  const router = useRouter();
  const { ready: logReady, append: appendLog } = useEffectLog();
  const [step, setStep] = useState<OnboardingStep>('crisis');
  const [intent, setIntent] = useState<PreferredState | null>(null);
  const [experience, setExperience] = useState<ExperienceLevel | null>(null);
  const [selfReport, setSelfReport] = useState<AhaDifficulty | null>(null);

  const completeOnboarding = async (consents: Record<string, boolean>) => {
    try {
      localStorage.setItem('silence-onboarding-complete', 'true');
      localStorage.setItem('silence-intent', intent ?? 'CALM');
      localStorage.setItem('silence-experience', experience ?? 'none');
      localStorage.setItem('silence-self-report', selfReport ?? 'ok');
      localStorage.setItem('silence-consents', JSON.stringify(consents));
    } catch {
      // localStorage unavailable — proceed anyway
    }

    trackSilenceEvent({
      eventType: 'onboarding_step_completed',
      timestamp: new Date().toISOString(),
      context: {
        intent,
        experience,
        selfReport,
        consents: Object.keys(consents).filter((k) => consents[k]),
      },
    });

    if (logReady) {
      await appendLog(
        'DECISION',
        'onboarding-app',
        'PASS',
        `Onboarding completed: intent=${intent}, experience=${experience}, selfReport=${selfReport}`,
        'User provided informed consent and selected initial preferences.'
      ).catch(() => {});
    }

    router.push('/breath');
  };

  if (step === 'crisis') {
    return (
      <>
        <OnboardingProgress currentStep={step} />
        <CrisisFilter
          onProceed={() => setStep('welcome')}
          onCrisis={() => {
            window.open('https://findahelpline.com', '_blank');
          }}
        />
      </>
    );
  }

  if (step === 'welcome') {
    return (
      <>
        <OnboardingProgress currentStep={step} />
        <main style={{ maxWidth: 480, margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontWeight: 300, fontSize: '2rem', marginBottom: '1rem' }}>
            Welcome to φ-Garden
          </h1>
          <p style={{ color: colors.textSecondary, lineHeight: 1.6, marginBottom: '2rem' }}>
            A space for geometric growth through breath rituals. Each cycle plants a seed
            of calm in your personal garden.
          </p>
          <button
            onClick={() => setStep('intent')}
            style={{
              padding: '0.875rem 2rem',
              borderRadius: radius.md,
              border: `1px solid ${colors.accentPrimary}`,
              background: 'transparent',
              color: colors.accentPrimary,
              cursor: 'pointer',
              fontSize: '1rem',
              transition: `border-color ${timing.micro}ms ${easing.phiInOut}, color ${timing.micro}ms ${easing.phiInOut}`,
            }}
          >
            Begin
          </button>
        </main>
      </>
    );
  }

  if (step === 'intent') {
    return (
      <>
        <OnboardingProgress currentStep={step} />
        <IntentSelector
          onSelect={(s) => {
            setIntent(s);
            trackSilenceEvent({
              eventType: 'intent_selected',
              timestamp: new Date().toISOString(),
              context: { intent: s },
            });
          }}
          onNext={() => setStep('experience')}
          onBack={() => setStep('welcome')}
        />
      </>
    );
  }

  if (step === 'experience') {
    return (
      <>
        <OnboardingProgress currentStep={step} />
        <ExperienceSelector
          onSelect={(l) => {
            setExperience(l);
            trackSilenceEvent({
              eventType: 'experience_level_selected',
              timestamp: new Date().toISOString(),
              context: { experience: l },
            });
          }}
          onNext={() => setStep('selfReport')}
          onBack={() => setStep('intent')}
        />
      </>
    );
  }

  if (step === 'selfReport') {
    return (
      <>
        <OnboardingProgress currentStep={step} />
        <SelfReport
          onSelect={(r) => {
            setSelfReport(r);
            trackSilenceEvent({
              eventType: 'self_report_submitted',
              timestamp: new Date().toISOString(),
              context: { difficulty: r },
            });
          }}
          onNext={() => setStep('consents')}
          onBack={() => setStep('experience')}
        />
      </>
    );
  }

  return (
    <>
      <OnboardingProgress currentStep={step} />
      <ConsentsScreen
        onComplete={completeOnboarding}
        onBack={() => setStep('selfReport')}
      />
    </>
  );
}
