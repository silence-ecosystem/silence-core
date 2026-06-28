"use client";

import Link from "next/link";

export default function EmergencyPage() {
  return (
    <div className="min-h-screen bg-[#0f1419] flex flex-col">
      {/* Header */}
      <header className="bg-[#161b22] border-b border-[#2d3748]">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#8b949e] hover:text-[#f5f7fa] mb-4 transition-colors min-h-[44px]"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Powrót
          </Link>
          <h1 className="text-[32px] font-semibold tracking-[-0.5px] text-[#f5f7fa] leading-tight">
            Zasoby kryzysowe
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto px-4 py-8 w-full">
        {/* Disclaimer */}
        <div className="mb-8 p-4 rounded-lg bg-[#1a1f28] border border-[#2d3748]">
          <p className="text-sm text-[#8b949e]">
            To nie jest leczenie. Jeśli potrzebujesz natychmiastowej interwencji,
            skontaktuj się z numerami poniżej.
          </p>
        </div>

        {/* Crisis Resources */}
        <div className="space-y-4">
          {/* Telefon Zaufania */}
          <div className="bg-[#161b22] border border-[#2d3748] rounded-lg p-5 flex items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="font-semibold text-[#f5f7fa] text-lg mb-1">
                Telefon Zaufania
              </h2>
              <p className="text-sm text-[#6e7681]">Całodobowa linia</p>
            </div>
            <a
              href="tel:116123"
              className="flex items-center justify-center min-w-[140px] min-h-[44px] px-6 py-3 bg-[#4a90e2] hover:bg-[#3a7bc8] active:bg-[#2d6cb5] rounded-lg font-mono font-semibold text-white text-lg transition-colors"
            >
              116 123
            </a>
          </div>

          {/* Emergency 112 */}
          <div className="bg-[rgba(248,113,113,0.1)] border border-[#f87171] rounded-lg p-5 flex items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="font-semibold text-[#f5f7fa] text-lg mb-1">
                Numer alarmowy
              </h2>
              <p className="text-sm text-[#6e7681]">Służby ratunkowe 24/7</p>
            </div>
            <a
              href="tel:112"
              className="flex items-center justify-center min-w-[140px] min-h-[44px] px-6 py-3 bg-[#f87171] hover:bg-[#ef4444] rounded-lg font-mono font-bold text-white text-xl transition-colors"
            >
              112
            </a>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-4 rounded-lg bg-[#1a1f28] border border-[#2d3748]">
          <p className="text-xs text-[#6e7681]">
            SILENCE.OBJECTS to narzędzie do konstrukcji interpretacji. Nie
            zastępuje profesjonalnej opieki medycznej.
          </p>
        </div>
      </main>
    </div>
  );
}
