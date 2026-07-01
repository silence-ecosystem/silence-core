"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TextInput } from "@/components/TextInput";
import { CrisisModal } from "@/components/safety/CrisisModal";
import { EmergencyBanner } from "@/components/EmergencyBanner";
import { PaywallModal } from "@/components/PaywallModal";
import { FirstObjectModal } from "@/components/FirstObjectModal";
import { LimitBanner } from "@/components/LimitBanner";
import { Button } from "@/components/ui";
import { VoiceDump } from "@/components/VoiceDump";
import { FREE_OBJECT_LIMIT } from "@/constants";
import { text, cn, icons } from "@/constants/design-system";
import { MESSAGES, DISCLAIMERS } from "@/lib/messages";

// ============================================================================
// Types
// ============================================================================

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
  showBanner?: boolean;
  detectedKeywords?: string[];
}

interface ReportFromAPI {
  id: string;
  input_text: string;
  selected_lens: "A" | "B" | null;
  risk_level: string;
  created_at: string;
}

interface DashboardContentProps {
  user: { email: string };
  profile: { tier: string; objectCount: number };
}

type AIStatus = "idle" | "listening" | "processing" | "ready";

// ============================================================================
// Utility Functions
// ============================================================================

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffMins < 1) return "przed chwilą";
  if (diffMins < 60) return `${diffMins} min temu`;
  if (diffHours < 24) return `${diffHours} godz. temu`;
  if (diffDays < 7) return `${diffDays} dni temu`;
  if (diffWeeks < 4) return `${diffWeeks} tyg. temu`;
  return date.toLocaleDateString("pl-PL");
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "Dobrej nocy";
  if (hour < 12) return "Dzień dobry";
  if (hour < 18) return "Dzień dobry";
  return "Dobry wieczór";
}

// ============================================================================
// AI Thinking State Component
// ============================================================================

interface AIThinkingProps {
  isActive: boolean;
  phase?: "analyzing" | "patterns" | "structuring" | "finalizing";
}

function AIThinkingState({ isActive, phase = "analyzing" }: AIThinkingProps) {
  const [dots, setDots] = useState("");
  const [currentPhase, setCurrentPhase] = useState(phase);

  const phases = {
    analyzing: "Claude analizuje struktury",
    patterns: "Rozpoznawanie wzorców",
    structuring: "Konstruowanie interpretacji",
    finalizing: "Finalizacja analizy",
  };

  useEffect(() => {
    if (!isActive) return;

    // Animated dots
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);

    // Phase progression
    const phaseTimeout = setTimeout(() => {
      setCurrentPhase((prev) => {
        if (prev === "analyzing") return "patterns";
        if (prev === "patterns") return "structuring";
        if (prev === "structuring") return "finalizing";
        return prev;
      });
    }, 2000);

    return () => {
      clearInterval(dotsInterval);
      clearTimeout(phaseTimeout);
    };
  }, [isActive, currentPhase]);

  if (!isActive) return null;

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-8 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Neural network visualization */}
      <div className="flex justify-center mb-6">
        <div className="relative w-24 h-24">
          {/* Pulsing rings */}
          <div className="absolute inset-0 rounded-full border-2 border-[var(--primary)]/20 animate-ping" />
          <div
            className="absolute inset-2 rounded-full border-2 border-[var(--primary)]/30 animate-ping"
            style={{ animationDelay: "0.2s" }}
          />
          <div
            className="absolute inset-4 rounded-full border-2 border-[var(--primary)]/40 animate-ping"
            style={{ animationDelay: "0.4s" }}
          />
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary)] to-purple-500 flex items-center justify-center shadow-lg shadow-[var(--primary)]/25">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-white animate-pulse"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Status text */}
      <div className="text-center">
        <p className="text-lg font-medium text-[var(--text-primary)] mb-2">
          {phases[currentPhase]}
          <span className="inline-block w-8 text-left">{dots}</span>
        </p>
        <p className="text-sm text-[var(--text-muted)]">
          Dual Lens interpretacja w trakcie konstrukcji
        </p>
      </div>

      {/* Progress bar */}
      <div className="mt-6 h-1 bg-[var(--bg-hover)] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[var(--primary)] to-purple-500 rounded-full transition-all duration-1000 ease-out"
          style={{
            width:
              currentPhase === "analyzing"
                ? "25%"
                : currentPhase === "patterns"
                ? "50%"
                : currentPhase === "structuring"
                ? "75%"
                : "95%",
          }}
        />
      </div>

      {/* Phase indicators */}
      <div className="flex justify-between mt-4 px-2">
        {Object.keys(phases).map((p, i) => (
          <div
            key={p}
            className={cn(
              "flex flex-col items-center gap-1 transition-all duration-300",
              Object.keys(phases).indexOf(currentPhase) >= i
                ? "opacity-100"
                : "opacity-40"
            )}
          >
            <div
              className={cn(
                "w-2 h-2 rounded-full transition-colors duration-300",
                Object.keys(phases).indexOf(currentPhase) >= i
                  ? "bg-[var(--primary)]"
                  : "bg-[var(--text-muted)]"
              )}
            />
            <span className="text-[10px] text-[var(--text-muted)] hidden sm:block">
              {i + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Confidence Meter Component
// ============================================================================

interface ConfidenceMeterProps {
  value: number;
  size?: "sm" | "md";
}

function ConfidenceMeter({ value, size = "sm" }: ConfidenceMeterProps) {
  const percentage = Math.round(value * 100);
  const radius = size === "sm" ? 16 : 24;
  const strokeWidth = size === "sm" ? 3 : 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage >= 80) return "text-emerald-400";
    if (percentage >= 60) return "text-[var(--primary)]";
    if (percentage >= 40) return "text-amber-400";
    return "text-red-400";
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={(radius + strokeWidth) * 2}
        height={(radius + strokeWidth) * 2}
        className="-rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-[var(--bg-hover)]"
        />
        {/* Progress circle */}
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn("transition-all duration-500", getColor())}
        />
      </svg>
      <span
        className={cn(
          "absolute font-semibold",
          size === "sm" ? "text-[10px]" : "text-xs",
          getColor()
        )}
      >
        {percentage}
      </span>
    </div>
  );
}

// ============================================================================
// AI Status Indicator Component
// ============================================================================

interface AIStatusIndicatorProps {
  status: AIStatus;
  className?: string;
}

function AIStatusIndicator({ status, className }: AIStatusIndicatorProps) {
  const statusConfig = {
    idle: {
      color: "bg-[var(--text-muted)]",
      pulse: false,
      label: "AI gotowe",
    },
    listening: {
      color: "bg-[var(--primary)]",
      pulse: true,
      label: "Nasłuchuję...",
    },
    processing: {
      color: "bg-amber-400",
      pulse: true,
      label: "Claude analizuje...",
    },
    ready: {
      color: "bg-emerald-400",
      pulse: false,
      label: "Interpretacja gotowa",
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full",
        "bg-[var(--bg-surface)]/80 backdrop-blur-sm border border-[var(--border)]",
        "transition-all duration-300",
        className
      )}
    >
      <div className="relative">
        <div
          className={cn(
            "w-2 h-2 rounded-full transition-colors duration-300",
            config.color
          )}
        />
        {config.pulse && (
          <div
            className={cn(
              "absolute inset-0 w-2 h-2 rounded-full animate-ping",
              config.color,
              "opacity-75"
            )}
          />
        )}
      </div>
      <span className="text-xs text-[var(--text-secondary)] font-medium">
        {config.label}
      </span>
    </div>
  );
}

// ============================================================================
// Voice Card Component (2x1 Grid Space)
// ============================================================================

interface VoiceCardProps {
  disabled?: boolean;
  aiStatus: AIStatus;
}

function VoiceCard({ disabled, aiStatus }: VoiceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={cn(
        // Grid span: 2 columns on larger screens
        "col-span-1 sm:col-span-2 row-span-1",
        // Glassmorphism card styling
        "relative overflow-hidden rounded-2xl",
        "bg-gradient-to-br from-[var(--bg-elevated)]/90 to-[var(--bg-surface)]/90",
        "backdrop-blur-xl border border-white/10",
        "shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]",
        // Hover animation
        "transition-all duration-500 ease-out",
        "hover:shadow-[0_12px_48px_rgba(74,144,226,0.15),inset_0_1px_0_rgba(255,255,255,0.1)]",
        "hover:border-[var(--primary)]/30",
        "group cursor-pointer",
        isExpanded && "ring-2 ring-[var(--primary)]/50",
        // Touch target
        "min-h-[160px] touch-manipulation"
      )}
      onClick={() => !disabled && setIsExpanded(!isExpanded)}
    >
      {/* Background gradient animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/5 via-transparent to-[var(--primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Content */}
      <div className="relative p-4 sm:p-6 h-full flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[var(--primary)]/20 flex items-center justify-center flex-shrink-0">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-[var(--primary)] sm:w-6 sm:h-6"
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
                Voice Input
              </h3>
              <p className="text-[10px] sm:text-xs text-[var(--text-muted)]">
                Mów naturalnie, system zinterpretuje
              </p>
            </div>
          </div>

          <AIStatusIndicator status={aiStatus} className="hidden sm:flex" />
        </div>

        {/* Waveform visualization */}
        <div className="flex items-center justify-center gap-1 py-4">
          {Array.from({ length: 12 }).map((_, i) => {
            const pseudoRandom = Math.sin(i * 2.1 + 0.5) * 0.5 + 0.5;
            return (
              <div
                key={i}
                className={cn(
                  "w-1 rounded-full bg-[var(--primary)]/30 transition-all duration-300",
                  "group-hover:bg-[var(--primary)]/50"
                )}
                style={{
                  height: `${8 + Math.sin(i * 0.8) * 12 + pseudoRandom * 8}px`,
                  transitionDelay: `${i * 30}ms`,
                }}
              />
            );
          })}
        </div>

        {/* Footer hint */}
        <p className="text-[10px] sm:text-xs text-[var(--text-muted)] text-center">
          Kliknij mikrofon lub naciśnij{" "}
          <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-base)] border border-[var(--border)] text-[10px] font-mono">
            Space
          </kbd>
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// Stats Card Component
// ============================================================================

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; positive: boolean };
  className?: string;
}

function StatsCard({ label, value, icon, trend, className }: StatsCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl",
        "bg-[var(--bg-surface)] border border-[var(--border)]",
        "p-4 sm:p-5 transition-all duration-300",
        "hover:border-[var(--border-hover)] hover:shadow-lg",
        "hover:translate-y-[-2px]",
        "group touch-manipulation min-h-[100px]",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] group-hover:bg-[var(--primary)]/20 transition-colors">
          {icon}
        </div>
        {trend && (
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              trend.positive
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400"
            )}
          >
            {trend.positive ? "+" : ""}
            {trend.value}%
          </span>
        )}
      </div>
      <div
        className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-1"
        style={{ fontSize: "clamp(1.25rem, 4vw, 1.5rem)" }}
      >
        {value}
      </div>
      <div className="text-[10px] sm:text-xs text-[var(--text-muted)] uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

// ============================================================================
// Loading Skeleton
// ============================================================================

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 bg-[var(--bg-surface)] rounded-lg animate-pulse" />
        <div className="h-4 w-72 bg-[var(--bg-surface)] rounded animate-pulse" />
      </div>

      {/* Bento grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="col-span-1 sm:col-span-2 h-[160px] bg-[var(--bg-surface)] rounded-2xl animate-pulse" />
        <div className="h-[100px] bg-[var(--bg-surface)] rounded-xl animate-pulse" />
        <div className="h-[100px] bg-[var(--bg-surface)] rounded-xl animate-pulse" />
      </div>

      {/* Recent objects skeleton */}
      <div className="space-y-4">
        <div className="h-4 w-32 bg-[var(--bg-surface)] rounded animate-pulse" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[280px] h-[100px] bg-[var(--bg-surface)] rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Recent Object Card (for horizontal scroll)
// ============================================================================

interface RecentObjectCardProps {
  report: ReportFromAPI;
  onClick?: () => void;
}

function RecentObjectCard({ report, onClick }: RecentObjectCardProps) {
  const timeAgo = getRelativeTime(report.created_at);
  const title =
    report.input_text.length > 80
      ? report.input_text.substring(0, 80) + "..."
      : report.input_text;

  const getRiskColor = (level: string) => {
    const colors: Record<string, string> = {
      none: "border-l-[var(--text-muted)]/30",
      low: "border-l-emerald-500/50",
      medium: "border-l-amber-500/50",
      high: "border-l-red-500/50",
    };
    return colors[level] || colors.none;
  };

  return (
    <Link
      href={`/archive/${report.id}`}
      onClick={onClick}
      className={cn(
        "flex-shrink-0 w-[260px] sm:w-[300px]",
        "relative overflow-hidden rounded-xl",
        "bg-[var(--bg-surface)] border border-[var(--border)]",
        "border-l-2",
        getRiskColor(report.risk_level),
        "p-4 transition-all duration-300",
        "hover:bg-[var(--bg-hover)] hover:border-[var(--border-hover)]",
        "hover:translate-x-1 hover:shadow-lg",
        "cursor-pointer group touch-manipulation",
        "active:scale-[0.98]"
      )}
    >
      {/* Content */}
      <p className="text-sm text-[var(--text-primary)] line-clamp-2 mb-3 min-h-[40px]">
        {title}
      </p>

      {/* Meta */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-muted)]">{timeAgo}</span>
          {report.selected_lens && (
            <>
              <span className="text-[var(--border)]">•</span>
              <span className="text-[10px] uppercase text-[var(--text-muted)] bg-[var(--bg-base)] px-1.5 py-0.5 rounded">
                Lens {report.selected_lens}
              </span>
            </>
          )}
        </div>

        {/* Arrow */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-[var(--text-muted)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

// ============================================================================
// Horizontal Scrolling Recent Objects
// ============================================================================

interface RecentObjectsScrollProps {
  reports: ReportFromAPI[];
  loading: boolean;
}

function RecentObjectsScroll({ reports, loading }: RecentObjectsScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
      return () => {
        ref.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [reports, checkScroll]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[260px] sm:w-[300px] h-[100px] rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-[var(--bg-hover)] flex items-center justify-center mx-auto mb-3">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-[var(--text-muted)]"
          >
            <path d={icons.archive} />
          </svg>
        </div>
        <p className="text-sm text-[var(--text-muted)]">
          {MESSAGES.EMPTY.NO_OBJECTS}
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          {MESSAGES.EMPTY.CREATE_FIRST}
        </p>
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Scroll buttons */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[var(--bg-elevated)]/90 backdrop-blur-sm border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all opacity-0 group-hover:opacity-100 -translate-x-1/2 touch-manipulation"
          aria-label="Scroll left"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d={icons.arrowLeft} />
          </svg>
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[var(--bg-elevated)]/90 backdrop-blur-sm border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all opacity-0 group-hover:opacity-100 translate-x-1/2 touch-manipulation"
          aria-label="Scroll right"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d={icons.arrowRight} />
          </svg>
        </button>
      )}

      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[var(--bg-base)] to-transparent z-[1] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[var(--bg-base)] to-transparent z-[1] pointer-events-none" />

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mb-2 scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {reports.map((report) => (
          <div key={report.id} className="snap-start">
            <RecentObjectCard report={report} />
          </div>
        ))}

        {/* View all card */}
        <Link
          href="/archive"
          className={cn(
            "flex-shrink-0 w-[120px] sm:w-[140px] snap-start",
            "flex flex-col items-center justify-center gap-2",
            "rounded-xl border border-dashed border-[var(--border)]",
            "text-[var(--text-muted)] hover:text-[var(--primary)]",
            "hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/5",
            "transition-all duration-300 touch-manipulation"
          )}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d={icons.arrowRight} />
          </svg>
          <span className="text-xs font-medium">Zobacz wszystkie</span>
        </Link>
      </div>
    </div>
  );
}

// ============================================================================
// Floating Quick Actions Bar
// ============================================================================

interface QuickActionsBarProps {
  onNewObject: () => void;
  onViewArchive: () => void;
  onViewPatterns: () => void;
  isInactive?: boolean;
}

function QuickActionsBar({
  onNewObject,
  onViewArchive,
  onViewPatterns,
  isInactive,
}: QuickActionsBarProps) {
  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-40",
        "flex items-center gap-2 p-2",
        "rounded-2xl",
        "bg-[var(--bg-elevated)]/80 backdrop-blur-xl",
        "border border-white/10",
        "shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]",
        // Safe area for mobile
        "mb-[env(safe-area-inset-bottom)]",
        // Hidden on mobile (mobile nav handles this)
        "hidden md:flex"
      )}
    >
      {/* New Object - Primary action */}
      <button
        onClick={onNewObject}
        disabled={isInactive}
        className={cn(
          "flex items-center gap-2 px-5 py-2.5 rounded-xl",
          "bg-[var(--primary)] text-white font-medium text-sm",
          "hover:bg-[var(--primary-hover)] active:scale-95",
          "transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "touch-manipulation min-h-[44px]"
        )}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d={icons.plus} />
        </svg>
        <span>Nowy Obiekt</span>
      </button>

      {/* Divider */}
      <div className="w-px h-6 bg-[var(--border)]" />

      {/* Archive */}
      <button
        onClick={onViewArchive}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-xl",
          "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
          "hover:bg-[var(--bg-hover)]",
          "transition-all duration-200 touch-manipulation"
        )}
        title="Archiwum"
        aria-label="Archiwum"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d={icons.archive} />
        </svg>
      </button>

      {/* Patterns */}
      <button
        onClick={onViewPatterns}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-xl",
          "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
          "hover:bg-[var(--bg-hover)]",
          "transition-all duration-200 touch-manipulation"
        )}
        title="Wzorce"
        aria-label="Wzorce"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      </button>

      {/* Keyboard shortcut hint */}
      <div className="hidden lg:flex items-center gap-1 pl-2 border-l border-[var(--border)]">
        <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-base)] text-[10px] font-mono text-[var(--text-muted)]">
          ⌘K
        </kbd>
      </div>
    </div>
  );
}

// ============================================================================
// Main Dashboard Content Component
// ============================================================================

export function DashboardContent({ profile }: DashboardContentProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<InterpretResult | null>(null);
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [selectedLens, setSelectedLens] = useState<"A" | "B" | null>(null);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [crisisKeywords, setCrisisKeywords] = useState<string[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [showEmergencyBanner, setShowEmergencyBanner] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showFirstObjectModal, setShowFirstObjectModal] = useState(false);
  const [recentReports, setRecentReports] = useState<ReportFromAPI[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState<AIStatus>("idle");
  const [initialLoading, setInitialLoading] = useState(true);

  const isLimitReached =
    profile.tier === "FREE" && profile.objectCount >= FREE_OBJECT_LIMIT;

  // Fetch recent reports
  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await fetch("/api/reports");
        if (response.ok) {
          const data = await response.json();
          setRecentReports(data.slice(0, 6));
        }
      } catch {
        // Silent fail - show empty state
      } finally {
        setLoadingReports(false);
        setInitialLoading(false);
      }
    }
    fetchReports();
  }, []);

  // Check if we should show first object modal
  useEffect(() => {
    const hasSeenFirstObjectModal = localStorage.getItem(
      "silence_first_object_modal_seen"
    );
    if (profile.objectCount === 1 && !hasSeenFirstObjectModal) {
      setShowFirstObjectModal(true);
    }
  }, [profile.objectCount]);

  const handleNewObject = () => {
    if (isLimitReached) {
      setShowPaywall(true);
    } else {
      setShowInput(true);
    }
  };

  const handleVoiceInput = (transcript: string) => {
    setInputText(transcript);
    if (transcript.length >= 50) {
      handleSubmit(transcript);
    }
  };

  const handleSubmit = async (inputValue: string) => {
    setLoading(true);
    setAiStatus("processing");
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
          setError(
            MESSAGES.LIMITS.REACHED + ". " + MESSAGES.LIMITS.UPGRADE_CTA
          );
        } else {
          setError(data.error || MESSAGES.ERROR.STRUCTURE_FAILED);
        }
        setAiStatus("idle");
        return;
      }

      if (data.crisis) {
        setCrisisKeywords(data.detectedKeywords || []);
        setShowCrisisModal(true);
        setAiStatus("idle");
        return;
      }

      if (data.showBanner) {
        setShowEmergencyBanner(true);
      }

      setResult(data);
      setAiStatus("ready");
    } catch {
      setError(MESSAGES.ERROR.NETWORK);
      setAiStatus("idle");
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
        setSuccessMessage(MESSAGES.SUCCESS.OBJECT_SAVED);
        setTimeout(() => {
          router.push("/archive");
        }, 1500);
      } else {
        setError(MESSAGES.ERROR.GENERAL);
      }
    } catch {
      setError(MESSAGES.ERROR.NETWORK);
    } finally {
      setSaving(false);
    }
  };

  const handleCloseFirstObjectModal = () => {
    localStorage.setItem("silence_first_object_modal_seen", "true");
    setShowFirstObjectModal(false);
  };

  const handleRegenerateInterpretation = async () => {
    if (!inputText) return;
    setLoading(true);
    setAiStatus("processing");
    setResult(null);
    setSelectedLens(null);

    try {
      const response = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, regenerate: true }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || MESSAGES.ERROR.STRUCTURE_FAILED);
        setAiStatus("idle");
        return;
      }

      if (data.crisis) {
        setCrisisKeywords(data.detectedKeywords || []);
        setShowCrisisModal(true);
        setAiStatus("idle");
        return;
      }

      if (data.showBanner) {
        setShowEmergencyBanner(true);
      }

      setResult(data);
      setAiStatus("ready");
    } catch {
      setError(MESSAGES.ERROR.NETWORK);
      setAiStatus("idle");
    } finally {
      setLoading(false);
    }
  };

  const renderInterpretation = (lens: "A" | "B", data: Interpretation) => (
    <button
      key={lens}
      type="button"
      onClick={() => setSelectedLens(lens)}
      className={cn(
        "w-full text-left p-4 sm:p-5 rounded-xl border cursor-pointer transition-all duration-300",
        "focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg-base)]",
        "touch-manipulation active:scale-[0.99]",
        selectedLens === lens
          ? "border-[var(--primary)] bg-[var(--bg-elevated)] shadow-lg scale-[1.01]"
          : "border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-hover)]"
      )}
    >
      <div className="flex justify-between items-center mb-4">
        <span className="bg-[var(--bg-base)] border border-[var(--border)] px-2.5 py-1 rounded-lg text-xs uppercase text-[var(--text-secondary)] font-medium">
          Lens {lens}
        </span>
        <ConfidenceMeter value={data.confidence} />
      </div>
      <div className="space-y-3 sm:space-y-4">
        <div>
          <span className={text.label}>Context</span>
          <p className={`${text.body} mt-1 text-sm sm:text-base`}>
            {data.context}
          </p>
        </div>
        <div>
          <span className={text.label}>Tension</span>
          <p className={`${text.body} mt-1 text-sm sm:text-base`}>
            {data.tension}
          </p>
        </div>
        <div>
          <span className={text.label}>Meaning</span>
          <p className={`${text.body} mt-1 text-sm sm:text-base`}>
            {data.meaning}
          </p>
        </div>
        <div>
          <span className={text.label}>Function</span>
          <p className={`${text.body} mt-1 text-sm sm:text-base`}>
            {data.function}
          </p>
        </div>
      </div>
    </button>
  );

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  if (initialLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <>
      {/* Modals */}
      <CrisisModal
        isOpen={showCrisisModal}
        onClose={() => setShowCrisisModal(false)}
        detectedKeywords={crisisKeywords}
      />
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        trigger="limit"
      />
      <FirstObjectModal
        isOpen={showFirstObjectModal}
        onClose={handleCloseFirstObjectModal}
      />

      {/* Emergency Banner */}
      {showEmergencyBanner && (
        <EmergencyBanner onDismiss={() => setShowEmergencyBanner(false)} />
      )}

      {/* Main Content */}
      <div className="pb-32 md:pb-24">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h1
            className="font-semibold tracking-[-0.5px] text-[var(--text-primary)] leading-tight"
            style={{ fontSize: "clamp(1.5rem, 5vw, 2rem)" }}
          >
            {getGreeting()}
          </h1>
          <p
            className="mt-2 text-[var(--text-secondary)]"
            style={{ fontSize: "clamp(0.875rem, 2vw, 1rem)" }}
          >
            Dokumentuj i analizuj wzorce behawioralne poprzez strukturalną
            interpretację.
          </p>
        </div>

        {/* Limit Banner */}
        {profile.tier === "FREE" && (
          <LimitBanner
            current={profile.objectCount}
            max={FREE_OBJECT_LIMIT}
            onUpgrade={() => setShowPaywall(true)}
          />
        )}

        {/* Input Card (when active) */}
        {showInput && !result && !loading && (
          <div className="bg-[rgba(74,144,226,0.08)] border border-[rgba(74,144,226,0.2)] rounded-xl p-4 sm:p-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className={text.h4}>Nowy Obiekt</h2>
              <button
                onClick={() => setShowInput(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-2 -m-2 touch-manipulation"
                aria-label="Zamknij"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d={icons.x} />
                </svg>
              </button>
            </div>
            <TextInput
              onSubmit={handleSubmit}
              loading={loading}
              isInactive={isLimitReached}
            />
          </div>
        )}

        {/* AI Thinking State */}
        {loading && <AIThinkingState isActive={loading} />}

        {/* Error Message */}
        {error && (
          <div className="bg-[var(--danger-muted)] border border-[var(--danger)] rounded-xl p-4 mb-6 animate-in fade-in duration-200">
            <p className="text-[var(--danger)] text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="bg-[rgba(74,222,128,0.08)] border border-[rgba(74,222,128,0.3)] rounded-xl p-4 mb-6 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-[#4ade80]">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-sm">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-4 sm:p-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Disclaimer */}
            <div className="mb-4 px-3 py-2 bg-[rgba(251,191,36,0.08)] border border-[rgba(251,191,36,0.2)] rounded-lg">
              <p className="text-xs text-[#fbbf24] flex items-center gap-2">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {DISCLAIMERS.ANALYSIS_TOOL}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <h2 className={text.h4}>Interpretacja Dual Lens</h2>
              <button
                onClick={handleRegenerateInterpretation}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--primary)] border border-[var(--border)] hover:border-[var(--primary)] rounded-lg transition-colors disabled:opacity-50 touch-manipulation"
              >
                <svg
                  className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {loading
                  ? "Claude analizuje..."
                  : "Wygeneruj alternatywną strukturę"}
              </button>
            </div>
            <p className={`${text.muted} mb-6`}>
              Wybierz interpretację, która rezonuje:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {renderInterpretation("A", result.lensA)}
              {renderInterpretation("B", result.lensB)}
            </div>
            {selectedLens && (
              <div className="mt-8 flex justify-center">
                <Button onClick={handleSave} loading={saving} className="px-8">
                  Zapisz do Archiwum
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Bento Grid Dashboard (when not showing input/results) */}
        {!showInput && !result && !loading && (
          <>
            {/* Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {/* Voice Card - Spans 2 columns */}
              <VoiceCard disabled={isLimitReached} aiStatus={aiStatus} />

              {/* Stats Cards */}
              <StatsCard
                label="Obiekty"
                value={profile.objectCount}
                icon={
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d={icons.archive} />
                  </svg>
                }
              />

              <StatsCard
                label="Plan"
                value={profile.tier === "PRO" ? "PRO" : "FREE"}
                icon={
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                }
                className={
                  profile.tier === "PRO" ? "border-emerald-500/30" : ""
                }
              />
            </div>

            {/* Recent Objects Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className={text.label}>OSTATNIE OBIEKTY</h2>
                <Link
                  href="/archive"
                  className="text-[var(--primary)] text-sm font-medium hover:underline flex items-center gap-1 touch-manipulation"
                >
                  Zobacz wszystkie
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <RecentObjectsScroll
                reports={recentReports}
                loading={loadingReports}
              />
            </div>
          </>
        )}
      </div>

      {/* Floating Quick Actions Bar (desktop) */}
      <QuickActionsBar
        onNewObject={handleNewObject}
        onViewArchive={() => router.push("/archive")}
        onViewPatterns={() => router.push("/patterns")}
        isInactive={isLimitReached}
      />

      {/* Voice Dump FAB - bottom-right positioned */}
      <VoiceDump
        onTranscript={handleVoiceInput}
        onRecordingStart={() => setAiStatus("listening")}
        onRecordingEnd={() => setAiStatus("processing")}
        disabled={isLimitReached || showInput || !!result}
      />
    </>
  );
}
