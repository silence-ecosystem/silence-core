'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingState } from '@/hooks/useOnboardingState';
import Step1Welcome from '@/features/onboarding/components/Step1Welcome';
import Step2Intent from '@/features/onboarding/components/Step2Intent';
import Step3AhaMoment from '@/features/onboarding/components/Step3AhaMoment';
import Step4Calibration from '@/features/onboarding/components/Step4Calibration';
import Step5Consents from '@/features/onboarding/components/Step5Consents';
import Step6Plan from '@/features/onboarding/components/Step6Plan';
import Step7Permissions from '@/features/onboarding/components/Step7Permissions';

const STEP_COMPONENTS: Record<string, React.ComponentType> = {
  WELCOME: Step1Welcome,
  INTENT: Step2Intent,
  FIRST_OBSERVATION: Step3AhaMoment,
  BASELINE: Step4Calibration,
  CONSENTS: Step5Consents,
  PLAN: Step6Plan,
  PERMISSIONS: Step7Permissions,
};

export default function OnboardingPage() {
  const { state } = useOnboardingState();
  const router = useRouter();

  useEffect(() => {
    if (state.onboardingComplete) {
      router.push('/dashboard');
    }
  }, [state.onboardingComplete, router]);

  const Component = STEP_COMPONENTS[state.step] ?? Step1Welcome;
  return <Component />;
}
