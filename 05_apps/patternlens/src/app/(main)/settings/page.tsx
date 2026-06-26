"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useMinimalMode } from "@/hooks/useMinimalMode";
import { PaywallModal } from "@/components/PaywallModal";
import { MESSAGES } from "@/lib/messages";

function SettingsContent() {
  const [objectCount, setObjectCount] = useState(0);
  const [tier, setTier] = useState<"FREE" | "PRO">("FREE");
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [deleteDataLoading, setDeleteDataLoading] = useState(false);
  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false);
  const [showDeleteDataConfirm, setShowDeleteDataConfirm] = useState(false);
  const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const { minimalMode, toggleMinimalMode, loaded: minimalModeLoaded } = useMinimalMode();

  useEffect(() => {
    // Check for upgrade success/cancel from URL
    const upgrade = searchParams.get("upgrade");
    if (upgrade === "success") {
      setSuccessMessage(MESSAGES.SUCCESS.PLAN_UPGRADED);
      // Remove query param from URL
      router.replace("/settings");
    }
  }, [searchParams, router]);

  const fetchUser = useCallback(async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (authUser) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("object_count, tier")
        .eq("id", authUser.id)
        .single();

      if (profile) {
        setObjectCount(profile.object_count || 0);
        setTier(profile.tier || "FREE");
      }
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Sign out error:", error);
      setSigningOut(false);
    }
  };

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const response = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        console.error("Portal error:", data.error);
      }
    } catch (error) {
      console.error("Portal error:", error);
    } finally {
      setPortalLoading(false);
    }
  };

  const handleExportData = async () => {
    setExportLoading(true);
    try {
      const response = await fetch("/api/user/export");
      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `silence-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccessMessage(MESSAGES.SUCCESS.DATA_EXPORTED);
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setExportLoading(false);
    }
  };

  const handleDeleteData = async () => {
    setDeleteDataLoading(true);
    try {
      const response = await fetch("/api/user/data", { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");

      setObjectCount(0);
      setShowDeleteDataConfirm(false);
      setSuccessMessage("Wszystkie dane zostały usunięte");
    } catch (error) {
      console.error("Delete data error:", error);
    } finally {
      setDeleteDataLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteAccountLoading(true);
    try {
      const response = await fetch("/api/user/account", { method: "DELETE" });
      if (!response.ok) throw new Error("Delete account failed");

      router.push("/login?deleted=true");
    } catch (error) {
      console.error("Delete account error:", error);
      setDeleteAccountLoading(false);
    }
  };

  if (loading || !minimalModeLoaded) {
    return (
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
        <div className="text-[#8b949e]">{MESSAGES.PROCESSING.LOADING}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1419] flex flex-col">
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        trigger="upgrade"
      />

      {/* Header */}
      <header className="bg-[#161b22] border-b border-[#2d3748]">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-[#8b949e] hover:text-[#f5f7fa] mb-4 transition-colors min-h-[44px]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Powrót
          </Link>
          <h1 className="text-[32px] font-semibold tracking-[-0.5px] text-[#f5f7fa] leading-tight">
            Ustawienia
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto px-4 py-8 w-full">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-[rgba(74,222,128,0.08)] border border-[rgba(74,222,128,0.2)] flex items-center gap-3">
            <svg className="w-5 h-5 text-[#4ade80] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-[#4ade80]">{successMessage}</span>
            <button
              onClick={() => setSuccessMessage(null)}
              className="ml-auto text-[#4ade80] hover:text-[#22c55e]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className="space-y-6">
          {/* Tier Section */}
          <section>
            <div className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[#6e7681] mb-3">
              Twój plan
            </div>
            <div className="bg-[#161b22] border border-[#2d3748] rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded border ${
                      tier === "PRO"
                        ? "bg-[rgba(74,222,128,0.15)] text-[#4ade80] border-[rgba(74,222,128,0.3)]"
                        : "bg-[rgba(74,144,226,0.15)] text-[#4a90e2] border-[rgba(74,144,226,0.3)]"
                    }`}
                  >
                    {tier}
                  </span>
                  <span className="text-sm text-[#f5f7fa]">
                    {tier === "FREE" ? `${objectCount}/7 Obiektów` : "Nieograniczone Obiekty"}
                  </span>
                </div>
                {tier === "PRO" && (
                  <button
                    onClick={handleManageSubscription}
                    disabled={portalLoading}
                    className="text-sm text-[#4a90e2] hover:text-[#3a7bc8] transition-colors disabled:opacity-50"
                  >
                    {portalLoading ? MESSAGES.PROCESSING.LOADING : "Zarządzaj"}
                  </button>
                )}
              </div>

              {tier === "FREE" ? (
                <>
                  <div className="bg-[#1a1f28] rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#6e7681]">Cloud obiekty użyte</span>
                      <span className="text-sm font-mono text-[#f5f7fa]">{objectCount}</span>
                    </div>
                    <div className="w-full h-2 bg-[#2d3748] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#4a90e2] rounded-full transition-all"
                        style={{ width: `${Math.min((objectCount / 7) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setShowPaywall(true)}
                    className="w-full min-h-[48px] px-6 py-3 bg-[#4ade80] hover:bg-[#22c55e] text-[#0f1419] font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    Przejdź na PRO — 39 PLN/mies.
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-[#8b949e]">
                    <svg className="w-4 h-4 text-[#4ade80]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Nieograniczone Obiekty
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#8b949e]">
                    <svg className="w-4 h-4 text-[#4ade80]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Wzorce w czasie
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#8b949e]">
                    <svg className="w-4 h-4 text-[#4ade80]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Eksport danych JSON
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Minimal Mode Section */}
          <section>
            <div className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[#6e7681] mb-3">
              Wyświetlanie
            </div>
            <div className="bg-[#161b22] border border-[#2d3748] rounded-lg p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-[#f5f7fa] text-base mb-1">Minimal Mode</h2>
                  <p className="text-sm text-[#6e7681]">Ukryj badge confidence i rozszerzone sugestie</p>
                </div>
                <button
                  onClick={toggleMinimalMode}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    minimalMode ? "bg-[#4a90e2]" : "bg-[#30363d]"
                  }`}
                  style={{ minHeight: "44px", minWidth: "56px" }}
                  aria-label="Toggle Minimal Mode"
                >
                  <span
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      minimalMode ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Trust & Safety Section */}
          <section>
            <div className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[#6e7681] mb-3">
              Trust & Safety
            </div>
            <div className="bg-[#161b22] border border-[#2d3748] rounded-lg p-5">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#4ade80] flex-shrink-0 mt-1.5" />
                  <div>
                    <span className="text-sm text-[#f5f7fa]">Dane w regionie EU</span>
                    <p className="text-xs text-[#6e7681] mt-0.5">Supabase EU infrastructure</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#4ade80] flex-shrink-0 mt-1.5" />
                  <div>
                    <span className="text-sm text-[#f5f7fa]">AI bez pamięci</span>
                    <p className="text-xs text-[#6e7681] mt-0.5">Model nie przechowuje historii konwersacji</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#4ade80] flex-shrink-0 mt-1.5" />
                  <div>
                    <span className="text-sm text-[#f5f7fa]">Szyfrowanie</span>
                    <p className="text-xs text-[#6e7681] mt-0.5">TLS w tranzycie, AES-256 w spoczynku</p>
                  </div>
                </li>
              </ul>
              <div className="mt-4 pt-4 border-t border-[#2d3748]">
                <Link
                  href="/emergency"
                  className="inline-flex items-center gap-2 text-sm text-[#4a90e2] hover:text-[#3a7bc8] transition-colors min-h-[44px]"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Zasoby kryzysowe
                </Link>
              </div>
            </div>
          </section>

          {/* Data & Privacy Section */}
          <section>
            <div className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[#6e7681] mb-3">
              Dane i prywatność
            </div>
            <div className="bg-[#161b22] border border-[#2d3748] rounded-lg p-5 space-y-4">
              {/* Export Data */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-[#f5f7fa] text-sm">Eksportuj dane</h3>
                  <p className="text-xs text-[#6e7681] mt-0.5">Pobierz kopię wszystkich swoich danych (JSON)</p>
                </div>
                <button
                  onClick={handleExportData}
                  disabled={exportLoading}
                  className="px-4 py-2 text-sm font-medium text-[#4a90e2] hover:text-[#3a7bc8] border border-[#2d3748] hover:border-[#4a90e2] rounded-lg transition-colors disabled:opacity-50 min-h-[44px]"
                >
                  {exportLoading ? MESSAGES.PROCESSING.EXPORTING : "Eksportuj"}
                </button>
              </div>

              <div className="border-t border-[#2d3748]" />

              {/* Delete Data */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-[#f5f7fa] text-sm">Usuń dane</h3>
                  <p className="text-xs text-[#6e7681] mt-0.5">Usuń wszystkie Obiekty i interpretacje (konto pozostanie)</p>
                </div>
                {!showDeleteDataConfirm ? (
                  <button
                    onClick={() => setShowDeleteDataConfirm(true)}
                    className="px-4 py-2 text-sm font-medium text-[#f87171] hover:text-[#ef4444] border border-[rgba(248,113,113,0.3)] hover:border-[#f87171] rounded-lg transition-colors min-h-[44px]"
                  >
                    Usuń dane
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowDeleteDataConfirm(false)}
                      className="px-3 py-2 text-sm text-[#8b949e] hover:text-[#f5f7fa] transition-colors min-h-[44px]"
                    >
                      Anuluj
                    </button>
                    <button
                      onClick={handleDeleteData}
                      disabled={deleteDataLoading}
                      className="px-4 py-2 text-sm font-medium bg-[#f87171] hover:bg-[#ef4444] text-white rounded-lg transition-colors disabled:opacity-50 min-h-[44px]"
                    >
                      {deleteDataLoading ? MESSAGES.PROCESSING.DELETING : "Potwierdź"}
                    </button>
                  </div>
                )}
              </div>

              <div className="border-t border-[#2d3748]" />

              {/* Delete Account */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-[#f5f7fa] text-sm">Usuń konto</h3>
                  <p className="text-xs text-[#6e7681] mt-0.5">Trwale usuń konto i wszystkie dane</p>
                </div>
                {!showDeleteAccountConfirm ? (
                  <button
                    onClick={() => setShowDeleteAccountConfirm(true)}
                    className="px-4 py-2 text-sm font-medium text-[#f87171] hover:text-[#ef4444] border border-[rgba(248,113,113,0.3)] hover:border-[#f87171] rounded-lg transition-colors min-h-[44px]"
                  >
                    Usuń konto
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowDeleteAccountConfirm(false)}
                      className="px-3 py-2 text-sm text-[#8b949e] hover:text-[#f5f7fa] transition-colors min-h-[44px]"
                    >
                      Anuluj
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleteAccountLoading}
                      className="px-4 py-2 text-sm font-medium bg-[#f87171] hover:bg-[#ef4444] text-white rounded-lg transition-colors disabled:opacity-50 min-h-[44px]"
                    >
                      {deleteAccountLoading ? MESSAGES.PROCESSING.DELETING : "Potwierdź usunięcie"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Logout Section */}
          <section>
            <div className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[#6e7681] mb-3">
              Konto
            </div>
            <div className="bg-[#161b22] border border-[#2d3748] rounded-lg p-5">
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-transparent hover:bg-[rgba(248,113,113,0.15)] border border-[rgba(248,113,113,0.3)] text-[#f87171] rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {signingOut ? MESSAGES.PROCESSING.SIGNING_OUT : "Wyloguj"}
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function SettingsLoading() {
  return (
    <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
      <div className="text-[#8b949e]">{MESSAGES.PROCESSING.LOADING}</div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsLoading />}>
      <SettingsContent />
    </Suspense>
  );
}
