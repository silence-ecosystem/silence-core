"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { MESSAGES } from "@/lib/messages";

const ERROR_MESSAGES: Record<string, string> = {
  invalid_email: MESSAGES.ERROR.INVALID_EMAIL,
  rate_limit: MESSAGES.ERROR.RATE_LIMIT,
  already_exists: "Konto już istnieje. Zaloguj się.",
  default: MESSAGES.ERROR.GENERAL,
};

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const emailTrimmed = email.trim().toLowerCase();

    if (!emailTrimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      setMessage({ type: "error", text: MESSAGES.ERROR.INVALID_EMAIL });
      setLoading(false);
      return;
    }

    if (!acceptedTerms) {
      setMessage({ type: "error", text: MESSAGES.VALIDATION.ACCEPT_TERMS });
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: emailTrimmed,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?signup=true`,
        shouldCreateUser: true,
        data: {
          terms_accepted: true,
          terms_accepted_at: new Date().toISOString(),
        },
      },
    });

    if (error) {
      if (error.message.includes("rate")) {
        setMessage({ type: "error", text: ERROR_MESSAGES.rate_limit });
      } else if (error.message.includes("already registered")) {
        setMessage({ type: "error", text: ERROR_MESSAGES.already_exists });
      } else {
        setMessage({ type: "error", text: ERROR_MESSAGES.default });
      }
    } else {
      setMessage({ type: "success", text: MESSAGES.SUCCESS.MAGIC_LINK_SENT });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f1419] flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#4a90e2] mb-4">
            <span className="text-white text-lg font-bold">S</span>
          </div>
          <h1 className="text-[24px] font-semibold tracking-[-0.5px] text-[#f5f7fa] leading-tight font-mono">
            SILENCE.OBJECTS
          </h1>
        </div>

        {/* Signup Card */}
        <div className="bg-[#161b22] border border-zinc-800 rounded-xl p-8">
          <h2 className="text-xl font-semibold text-[#f5f7fa] mb-6">Zacznij</h2>

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Twój adres email"
                required
                autoComplete="email"
                className="w-full px-4 py-3.5 min-h-[48px] bg-[#0f1419] border border-zinc-800 rounded-lg text-[#f5f7fa] placeholder:text-zinc-500 focus:outline-none focus:border-[#4a90e2] focus:ring-2 focus:ring-[rgba(74,144,226,0.2)] transition-all"
              />
            </div>

            {message && (
              <div
                className={`flex items-start gap-3 px-4 py-3 rounded-lg text-sm ${
                  message.type === "success"
                    ? "bg-[rgba(74,222,128,0.08)] text-[#4ade80] border border-[rgba(74,222,128,0.2)]"
                    : "bg-[rgba(248,113,113,0.08)] text-[#f87171] border border-[rgba(248,113,113,0.2)]"
                }`}
              >
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  {message.type === "success" ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                </svg>
                <span>{message.text}</span>
              </div>
            )}

            {/* Terms Consent */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center mt-0.5">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                  acceptedTerms
                    ? "bg-[#4a90e2] border-[#4a90e2]"
                    : "border-zinc-700 group-hover:border-[#4a90e2]"
                }`}>
                  {acceptedTerms && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-zinc-400 leading-tight">
                Akceptuję{" "}
                <Link href="/terms" className="text-[#4a90e2] hover:underline" target="_blank">
                  Regulamin
                </Link>
                {" "}i{" "}
                <Link href="/privacy" className="text-[#4a90e2] hover:underline" target="_blank">
                  Politykę Prywatności
                </Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading || !email || !acceptedTerms}
              className="w-full min-h-[48px] px-6 py-3.5 bg-[#4a90e2] hover:bg-[#3a7bc8] active:bg-[#2d6cb5] text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {MESSAGES.PROCESSING.PROCESSING}
                </>
              ) : (
                <>
                  Kontynuuj
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 pt-6 border-t border-zinc-800">
            <p className="text-sm text-zinc-400 text-center">
              Masz już konto?{" "}
              <Link href="/login" className="text-[#4a90e2] hover:text-[#3a7bc8] font-medium transition-colors">
                Zaloguj się
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-zinc-800">
          <div className="flex items-center justify-center gap-4 text-xs text-zinc-500">
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
              Prywatność
            </Link>
            <span className="text-zinc-700">·</span>
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">
              Regulamin
            </Link>
            <span className="text-zinc-700">·</span>
            <Link
              href="/emergency"
              className="inline-flex items-center gap-1.5 hover:text-[#f87171] transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Kryzys
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
