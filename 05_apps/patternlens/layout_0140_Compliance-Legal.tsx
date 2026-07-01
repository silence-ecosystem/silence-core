import Link from "next/link";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0f1419] flex flex-col">
      {/* Header */}
      <header className="bg-[#161b22] border-b border-[#2d3748]">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#8b949e] hover:text-[#f5f7fa] transition-colors min-h-[44px]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to SILENCE.OBJECTS
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-3xl mx-auto px-4 py-8 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#161b22] border-t border-[#2d3748] py-6">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center text-sm text-[#6e7681]">
            <Link href="/privacy" className="hover:text-[#f5f7fa] transition-colors">
              Privacy Policy
            </Link>
            <span className="text-[#2d3748]">|</span>
            <Link href="/terms" className="hover:text-[#f5f7fa] transition-colors">
              Terms of Service
            </Link>
            <span className="text-[#2d3748]">|</span>
            <Link href="/emergency" className="hover:text-[#f5f7fa] transition-colors">
              Crisis Resources
            </Link>
          </div>
          <p className="text-center text-xs text-[#6e7681] mt-4">
            © {new Date().getFullYear()} SILENCE.OBJECTS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
