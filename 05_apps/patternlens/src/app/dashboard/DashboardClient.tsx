"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextInput } from "@/components/TextInput";
import { CrisisModal } from "@/components/safety/CrisisModal";
import { Button } from "@/components/ui";
import { FREE_OBJECT_LIMIT } from "@/constants";
import { card, text, badge } from "@/constants/design-system";
import Link from "next/link";

interface Interpretation {
  context: string;
  tension: string;
  meaning: string;
  function: string;
  confidence: number;
}

interface InterpretResult {
  lensA: Interpretation;
  lensB: Interpretation;
  riskLevel: string;
  isEmergency?: boolean;
  crisis?: boolean;
  detectedKeywords?: string[];
}

interface DashboardClientProps {
  user: { email: string };
  profile: { tier: string; objectCount: number };
}

export function DashboardClient({ user, profile }: DashboardClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<InterpretResult | null>(null);
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [selectedLens, setSelectedLens] = useState<"A" | "B" | null>(null);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [crisisKeywords, setCrisisKeywords] = useState<string[]>([]);

  const isLimitReached = profile.tier === "FREE" && profile.objectCount >= FREE_OBJECT_LIMIT;

  const handleSignOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const handleSubmit = async (inputValue: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setSelectedLens(null);
    setInputText(inputValue);

    try {
      const response = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputValue }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code === "LIMIT_REACHED") {
          setError("Object limit reached. Upgrade to PRO for unlimited access.");
        } else {
          setError(data.error || "Processing failed");
        }
        return;
      }

      if (data.crisis) {
        setCrisisKeywords(data.detectedKeywords || []);
        setShowCrisisModal(true);
        return;
      }

      setResult(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result || !selectedLens) return;

    setSaving(true);
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputText,
          lensA: result.lensA,
          lensB: result.lensB,
          selectedLens,
          riskLevel: result.riskLevel,
        }),
      });

      if (response.ok) {
        router.push("/archive");
      } else {
        setError("Failed to save. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const renderInterpretation = (lens: "A" | "B", data: Interpretation) => (
    <button
      type="button"
      onClick={() => setSelectedLens(lens)}
      className={`w-full text-left p-5 rounded-lg border cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
        selectedLens === lens
          ? "border-[var(--primary)] bg-[var(--bg-elevated)] shadow-md"
          : "border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-hover)]"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <span className={`${badge.base} ${badge.lens}`}>Lens {lens}</span>
        <span className="text-xs text-[var(--text-muted)]">
          {Math.round(data.confidence * 100)}% confidence
        </span>
      </div>
      <div className="space-y-4">
        <div>
          <span className={text.label}>Context</span>
          <p className={`${text.body} mt-1`}>{data.context}</p>
        </div>
        <div>
          <span className={text.label}>Tension</span>
          <p className={`${text.body} mt-1`}>{data.tension}</p>
        </div>
        <div>
          <span className={text.label}>Meaning</span>
          <p className={`${text.body} mt-1`}>{data.meaning}</p>
        </div>
        <div>
          <span className={text.label}>Function</span>
          <p className={`${text.body} mt-1`}>{data.function}</p>
        </div>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <CrisisModal
        isOpen={showCrisisModal}
        onClose={() => setShowCrisisModal(false)}
        detectedKeywords={crisisKeywords}
      />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-mono font-bold text-[var(--text-primary)] tracking-tight">
            SILENCE.OBJECTS
          </h1>
          <nav className="flex items-center gap-4">
            <Link href="/archive" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm transition-colors">
              Archive
            </Link>
            <span className="text-[var(--border)]">|</span>
            <span className="text-[var(--text-muted)] text-sm">{user.email}</span>
            <button onClick={handleSignOut} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm transition-colors">
              Sign Out
            </button>
          </nav>
        </header>

        <div className={`${card.base} mb-6`}>
          <p className={text.secondary}>
            Tier: <span className="text-[var(--primary)]">{profile.tier}</span>
            <span className="mx-2 text-[var(--border)]"></span>
            Objects: {profile.objectCount}/{FREE_OBJECT_LIMIT}
          </p>
        </div>

        {isLimitReached && (
          <div className="bg-[var(--warning-muted)] border border-[var(--warning)] rounded-lg p-4 mb-6">
            <p className="text-[var(--warning)] text-sm">
              Free tier limit reached. Upgrade to PRO for unlimited objects.
            </p>
          </div>
        )}

        <div className={`${card.base} mb-6`}>
          <h2 className={`${text.h2} mb-4`}>New Object</h2>
          <TextInput onSubmit={handleSubmit} loading={loading} isInactive={isLimitReached} />
        </div>

        {error && (
          <div className="bg-[var(--danger-muted)] border border-[var(--danger)] rounded-lg p-4 mb-6">
            <p className="text-[var(--danger)] text-sm">{error}</p>
          </div>
        )}

        {result && (
          <div className={card.base}>
            <h2 className={`${text.h2} mb-2`}>Dual Lens Interpretation</h2>
            <p className={`${text.muted} mb-6`}>Select the interpretation that resonates:</p>
            <div className="grid md:grid-cols-2 gap-4">
              {renderInterpretation("A", result.lensA)}
              {renderInterpretation("B", result.lensB)}
            </div>
            {selectedLens && (
              <div className="mt-8 flex justify-center">
                <Button onClick={handleSave} loading={saving} className="px-8">
                  Save to Archive
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
