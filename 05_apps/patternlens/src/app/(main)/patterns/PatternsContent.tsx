"use client";

import { useState } from "react";
import Link from "next/link";
import { ProTeaserBox } from "@/components/ProTeaserBox";
import { PaywallModal } from "@/components/PaywallModal";

interface PatternsContentProps {
  tier: string;
  objectCount: number;
}

const MIN_OBJECTS_FOR_PATTERNS = 3;

export function PatternsContent({ tier, objectCount }: PatternsContentProps) {
  const [showPaywall, setShowPaywall] = useState(false);

  const hasEnoughObjects = objectCount >= MIN_OBJECTS_FOR_PATTERNS;
  const isPro = tier === "PRO";

  // Case 1: Not enough objects
  if (!hasEnoughObjects) {
    return (
      <div className="bg-[#161b22] border border-[#2d3748] rounded-lg p-8">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#1a1f28] border border-[#2d3748] flex items-center justify-center mb-6">
            <svg
              className="w-8 h-8 text-[#6e7681]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>

          <h2 className="text-xl font-semibold text-[#f5f7fa] mb-2">
            Zbyt mało danych
          </h2>
          <p className="text-sm text-[#6e7681] mb-6 max-w-md">
            Zapisz minimum {MIN_OBJECTS_FOR_PATTERNS} obiekty aby zobaczyć wzorce.
            Obecnie masz: {objectCount} {objectCount === 1 ? "obiekt" : objectCount < 5 ? "obiekty" : "obiektów"}.
          </p>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#4a90e2] hover:bg-[#3a7bc8] text-white font-semibold rounded-lg transition-colors min-h-[48px]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Dodaj nowy obiekt
          </Link>
        </div>
      </div>
    );
  }

  // Case 2: Enough objects + FREE tier
  if (!isPro) {
    return (
      <>
        <PaywallModal
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
          trigger="feature"
          featureName="Wzorce w czasie"
        />

        <div className="bg-[#161b22] border border-[#2d3748] rounded-lg p-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#1a1f28] border border-[#2d3748] flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-[#6e7681]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>

            <h2 className="text-xl font-semibold text-[#f5f7fa] mb-2">
              Wzorce w czasie
            </h2>
            <p className="text-sm text-[#6e7681] mb-8 max-w-md">
              Masz już {objectCount} {objectCount < 5 ? "obiekty" : "obiektów"}. Odblokuj analizę wzorców,
              aby zobaczyć jak Twoje interpretacje zmieniają się w czasie.
            </p>

            <ProTeaserBox
              feature="Wzorce w czasie"
              description="Wykrywaj powtarzające się wzorce i trendy"
              onLearnMore={() => setShowPaywall(true)}
            />
          </div>
        </div>
      </>
    );
  }

  // Case 3: Enough objects + PRO tier
  return (
    <div className="bg-[#161b22] border border-[#2d3748] rounded-lg p-8">
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-[rgba(74,222,128,0.1)] border border-[rgba(74,222,128,0.2)] flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-[#4ade80]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-xl font-semibold text-[#f5f7fa]">
            Wzorce w czasie
          </h2>
          <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded bg-[rgba(74,222,128,0.15)] text-[#4ade80]">
            PRO
          </span>
        </div>

        <p className="text-sm text-[#6e7681] mb-6 max-w-md">
          Analiza wzorców w przygotowaniu. Twoje {objectCount} {objectCount < 5 ? "obiekty" : "obiektów"} zostanie
          przeanalizowanych gdy funkcja będzie gotowa.
        </p>

        <div className="w-full max-w-sm bg-[#1a1f28] border border-[#2d3748] rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(74,144,226,0.1)] flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[#4a90e2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-[#f5f7fa]">W przygotowaniu</div>
              <div className="text-xs text-[#6e7681]">Otrzymasz powiadomienie gdy funkcja będzie gotowa</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
