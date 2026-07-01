'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { WelcomeScreen } from '@/components/onboarding/WelcomeScreen';
export default function Home() {
    // TODO: Replace with real authenticated user ID from Supabase session
    const userId = 'demo-user';
    return _jsx(WelcomeScreen, { userId: userId });
}
