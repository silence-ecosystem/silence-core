"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/constants/design-system";

// ============================================================================
// Types
// ============================================================================

type ThinkingPhase = "initializing" | "analyzing" | "patterns" | "structuring" | "finalizing";

interface AIThinkingStateProps {
  isActive: boolean;
  phase?: ThinkingPhase;
  progress?: number; // 0-100
  className?: string;
  variant?: "inline" | "card" | "fullscreen";
  showConfidence?: boolean;
}

interface PhaseConfig {
  message: string;
  subMessage: string;
  duration: number; // ms
  icon: React.ReactNode;
}

// ============================================================================
// Phase Configuration
// ============================================================================

const phaseConfigs: Record<ThinkingPhase, PhaseConfig> = {
  initializing: {
    message: "Inicjalizuję analizę...",
    subMessage: "Przygotowuję kontekst strukturalny",
    duration: 1500,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  analyzing: {
    message: "Analizuję struktury...",
    subMessage: "Identyfikuję elementy sytuacji",
    duration: 3000,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  patterns: {
    message: "Szukam wzorców...",
    subMessage: "Mapuję powtarzające się struktury",
    duration: 2500,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
  structuring: {
    message: "Konstruuję interpretacje...",
    subMessage: "Generuję Lens A i Lens B",
    duration: 2000,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
  },
  finalizing: {
    message: "Finalizuję analizę...",
    subMessage: "Weryfikuję spójność strukturalną",
    duration: 1000,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
};

const phaseOrder: ThinkingPhase[] = ["initializing", "analyzing", "patterns", "structuring", "finalizing"];

// ============================================================================
// Thinking Dots Animation
// ============================================================================

function ThinkingDots({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse"
          style={{
            animationDelay: `${i * 200}ms`,
            animationDuration: "1s",
          }}
        />
      ))}
    </div>
  );
}

// ============================================================================
// Typing Indicator
// ============================================================================

interface TypingIndicatorProps {
  text: string;
  isTyping: boolean;
  className?: string;
}

function TypingIndicator({ text, isTyping, className }: TypingIndicatorProps) {
  const [displayText, setDisplayText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  // Sync state with props (prev-state pattern)
  const [prevText, setPrevText] = useState(text);
  const [prevIsTyping, setPrevIsTyping] = useState(isTyping);
  if (prevText !== text || prevIsTyping !== isTyping) {
    setPrevText(text);
    setPrevIsTyping(isTyping);
    if (!isTyping) {
      setDisplayText(text);
    } else {
      setDisplayText("");
      setCharIndex(0);
    }
  }

  useEffect(() => {
    if (!isTyping || charIndex >= text.length) return;

    const timeout = setTimeout(() => {
      setDisplayText((prev) => prev + text[charIndex]);
      setCharIndex((prev) => prev + 1);
    }, 30 + Math.random() * 20); // Variable typing speed

    return () => clearTimeout(timeout);
  }, [charIndex, text, isTyping]);

  return (
    <span className={cn("inline-flex items-center", className)}>
      {displayText}
      {isTyping && charIndex < text.length && (
        <span className="inline-block w-0.5 h-4 bg-[var(--primary)] ml-0.5 animate-pulse" />
      )}
    </span>
  );
}

// ============================================================================
// Confidence Meter
// ============================================================================

interface ConfidenceMeterProps {
  value: number; // 0-100
  className?: string;
}

function ConfidenceMeter({ value, className }: ConfidenceMeterProps) {
  const segments = 10;
  const filledSegments = Math.round((value / 100) * segments);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)]">
        <span>Confidence</span>
        <span className="font-mono">{Math.round(value)}%</span>
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-300",
              i < filledSegments
                ? "bg-[var(--primary)]"
                : "bg-[var(--bg-hover)]"
            )}
            style={{
              transitionDelay: `${i * 50}ms`,
              opacity: i < filledSegments ? 1 - (i * 0.05) : 0.3,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Progress Ring
// ============================================================================

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

function ProgressRing({ progress, size = 48, strokeWidth = 3, className }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--bg-hover)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-medium text-[var(--text-primary)]">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// Phase Indicator
// ============================================================================

interface PhaseIndicatorProps {
  currentPhase: ThinkingPhase;
  className?: string;
}

function PhaseIndicator({ currentPhase, className }: PhaseIndicatorProps) {
  const currentIndex = phaseOrder.indexOf(currentPhase);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {phaseOrder.map((phase, i) => (
        <div key={phase} className="flex items-center">
          <div
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              i < currentIndex && "bg-emerald-400",
              i === currentIndex && "bg-[var(--primary)] scale-125 animate-pulse",
              i > currentIndex && "bg-[var(--bg-hover)]"
            )}
          />
          {i < phaseOrder.length - 1 && (
            <div
              className={cn(
                "w-4 h-0.5 mx-1 transition-all duration-300",
                i < currentIndex ? "bg-emerald-400" : "bg-[var(--bg-hover)]"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Neural Network Animation
// ============================================================================

function NeuralNetworkAnimation({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-16 h-16", className)}>
      {/* Nodes */}
      {[
        { x: 8, y: 8 },
        { x: 32, y: 4 },
        { x: 56, y: 12 },
        { x: 4, y: 32 },
        { x: 32, y: 32 },
        { x: 60, y: 32 },
        { x: 12, y: 56 },
        { x: 32, y: 60 },
        { x: 52, y: 52 },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-[var(--primary)]"
          style={{
            left: pos.x,
            top: pos.y,
            animation: `pulse 1.5s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
      {/* Connections (SVG lines) */}
      <svg className="absolute inset-0 w-full h-full" style={{ overflow: "visible" }}>
        {[
          [12, 12, 36, 8],
          [36, 8, 60, 16],
          [8, 36, 36, 36],
          [36, 36, 64, 36],
          [12, 12, 8, 36],
          [36, 8, 36, 36],
          [60, 16, 64, 36],
          [8, 36, 16, 60],
          [36, 36, 36, 64],
          [64, 36, 56, 56],
          [16, 60, 36, 64],
          [36, 64, 56, 56],
        ].map(([x1, y1, x2, y2], i) => (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="var(--primary)"
            strokeWidth="1"
            strokeOpacity="0.3"
            className="animate-pulse"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </svg>
    </div>
  );
}

// ============================================================================
// Main AIThinkingState Component
// ============================================================================

export function AIThinkingState({
  isActive,
  phase: externalPhase,
  progress: externalProgress,
  className,
  variant = "card",
  showConfidence = true,
}: AIThinkingStateProps) {
  const [currentPhase, setCurrentPhase] = useState<ThinkingPhase>("initializing");
  const [progress, setProgress] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Sync state when isActive changes (prev-state pattern)
  const [prevIsActive, setPrevIsActive] = useState(isActive);
  if (prevIsActive !== isActive) {
    setPrevIsActive(isActive);
    if (isActive) {
      setIsVisible(true);
      setCurrentPhase("initializing");
      setProgress(0);
      setConfidence(0);
    }
  }

  // Sync external phase/progress props (prev-state pattern)
  const [prevExternalPhase, setPrevExternalPhase] = useState(externalPhase);
  const [prevExternalProgress, setPrevExternalProgress] = useState(externalProgress);
  if (prevExternalPhase !== externalPhase) {
    setPrevExternalPhase(externalPhase);
    if (externalPhase) setCurrentPhase(externalPhase);
  }
  if (prevExternalProgress !== externalProgress) {
    setPrevExternalProgress(externalProgress);
    if (externalProgress !== undefined) setProgress(externalProgress);
  }

  // Auto-progress through phases if not externally controlled
  const autoProgress = useCallback(() => {
    if (externalPhase || externalProgress !== undefined) return;

    const phaseIndex = phaseOrder.indexOf(currentPhase);
    const phaseConfig = phaseConfigs[currentPhase];
    const phaseProgress = ((phaseIndex + 1) / phaseOrder.length) * 100;

    // Gradually increase progress within phase
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const target = phaseProgress;
        const increment = (target - prev) * 0.1;
        return Math.min(prev + Math.max(increment, 0.5), target);
      });
    }, 100);

    // Move to next phase after duration
    const phaseTimeout = setTimeout(() => {
      if (phaseIndex < phaseOrder.length - 1) {
        setCurrentPhase(phaseOrder[phaseIndex + 1]);
      }
    }, phaseConfig.duration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(phaseTimeout);
    };
  }, [currentPhase, externalPhase, externalProgress]);

  // Handle fade-out transition when deactivated
  useEffect(() => {
    if (isActive) return;
    const timeout = setTimeout(() => setIsVisible(false), 300);
    return () => clearTimeout(timeout);
  }, [isActive]);

  // Auto-progress effect
  useEffect(() => {
    if (!isActive) return;
    return autoProgress();
  }, [isActive, autoProgress]);

  // Simulate confidence building
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setConfidence((prev) => {
        const target = Math.min(progress * 0.95, 95);
        const increment = (target - prev) * 0.05;
        return Math.min(prev + Math.max(increment, 0.1), target);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isActive, progress]);

  if (!isVisible) return null;

  const config = phaseConfigs[currentPhase];

  // Inline variant (minimal)
  if (variant === "inline") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full",
          "bg-[var(--bg-surface)] border border-[var(--border)]",
          "transition-all duration-300",
          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
          className
        )}
      >
        <div className="text-[var(--primary)] animate-spin">
          {config.icon}
        </div>
        <span className="text-sm text-[var(--text-secondary)]">
          <TypingIndicator text={config.message} isTyping={isActive} />
        </span>
        <ThinkingDots />
      </div>
    );
  }

  // Card variant (default)
  if (variant === "card") {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-xl",
          "bg-[var(--bg-surface)] border border-[var(--border)]",
          "p-6 transition-all duration-500",
          isActive ? "opacity-100 scale-100" : "opacity-0 scale-95",
          className
        )}
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 via-transparent to-[var(--primary)]/5 animate-pulse" />

        <div className="relative flex items-start gap-5">
          {/* Left: Progress ring + Neural animation */}
          <div className="flex flex-col items-center gap-3">
            <ProgressRing progress={progress} size={56} />
            <NeuralNetworkAnimation className="opacity-50" />
          </div>

          {/* Right: Content */}
          <div className="flex-1 min-w-0">
            {/* Phase indicator */}
            <PhaseIndicator currentPhase={currentPhase} className="mb-4" />

            {/* Main message */}
            <div className="flex items-center gap-2 mb-1">
              <div className="text-[var(--primary)]">{config.icon}</div>
              <h4 className="text-base font-semibold text-[var(--text-primary)]">
                <TypingIndicator text={config.message} isTyping={isActive} />
              </h4>
            </div>

            {/* Sub message */}
            <p className="text-sm text-[var(--text-muted)] mb-4 flex items-center gap-2">
              {config.subMessage}
              <ThinkingDots />
            </p>

            {/* Confidence meter */}
            {showConfidence && (
              <ConfidenceMeter value={confidence} className="max-w-[200px]" />
            )}
          </div>
        </div>

        {/* Bottom progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--bg-hover)]">
          <div
            className="h-full bg-gradient-to-r from-[var(--primary)] to-emerald-400 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }

  // Fullscreen variant (overlay)
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-[var(--bg-base)]/90 backdrop-blur-md",
        "transition-all duration-500",
        isActive ? "opacity-100" : "opacity-0 pointer-events-none",
        className
      )}
    >
      <div className="flex flex-col items-center gap-6 max-w-md text-center px-6">
        {/* Large progress ring */}
        <div className="relative">
          <ProgressRing progress={progress} size={96} strokeWidth={4} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[var(--primary)] animate-pulse">
              {config.icon}
            </div>
          </div>
        </div>

        {/* Phase indicator */}
        <PhaseIndicator currentPhase={currentPhase} />

        {/* Messages */}
        <div>
          <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            <TypingIndicator text={config.message} isTyping={isActive} />
          </h3>
          <p className="text-sm text-[var(--text-muted)] flex items-center justify-center gap-2">
            {config.subMessage}
            <ThinkingDots />
          </p>
        </div>

        {/* Confidence */}
        {showConfidence && (
          <ConfidenceMeter value={confidence} className="w-full max-w-[240px]" />
        )}

        {/* Neural network decoration */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-20">
          <NeuralNetworkAnimation />
        </div>
      </div>
    </div>
  );
}

export default AIThinkingState;
