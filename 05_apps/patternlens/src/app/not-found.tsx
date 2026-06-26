import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0f1419] flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-[rgba(74,144,226,0.15)] mb-6">
            <span className="text-2xl font-semibold text-[#4a90e2]">S</span>
          </div>

          <h1 className="text-[32px] font-semibold tracking-[-0.5px] text-[#f5f7fa] leading-tight mb-2">
            SILENCE.OBJECTS
          </h1>

          {/* 404 */}
          <div className="my-8">
            <div className="text-[72px] font-bold text-[#2d3748] leading-none">404</div>
          </div>

          <p className="text-lg text-[#8b949e] mb-8">
            Strona nie została znaleziona
          </p>

          {/* Back Button */}
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 bg-[#4a90e2] hover:bg-[#3a7bc8] active:bg-[#2d6cb5] text-white font-medium rounded-lg transition-colors"
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
            Wróć do Dashboard
          </Link>
        </div>
      </main>

      {/* Footer with Crisis Resources */}
      <footer className="border-t border-[#2d3748] bg-[#0f1419] py-6 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[#6e7681] mb-4 text-center">
            Zasoby kryzysowe
          </div>
          <div className="flex items-center justify-center gap-6">
            <a
              href="tel:116123"
              className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 text-sm text-[#8b949e] hover:text-[#f5f7fa] transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span className="font-mono font-semibold">116 123</span>
            </a>
            <span className="text-[#2d3748]">|</span>
            <a
              href="tel:112"
              className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 text-sm text-[#f87171] hover:text-[#ef4444] transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span className="font-mono font-bold">112</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
