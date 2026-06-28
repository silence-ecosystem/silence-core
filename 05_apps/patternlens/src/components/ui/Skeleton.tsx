"use client";

import { useState, useEffect } from "react";
import { cn } from "@/constants/design-system";

// ============================================================================
// Types
// ============================================================================

type SkeletonVariant = "default" | "text" | "avatar" | "button" | "card" | "voice" | "pattern" | "lens";

interface SkeletonProps {
  className?: string;
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  animate?: "pulse" | "shimmer" | "none";
  delay?: number;
  children?: React.ReactNode;
}

interface SkeletonGroupProps {
  children: React.ReactNode;
  stagger?: number;
  className?: string;
}

// ============================================================================
// Animation Keyframes (injected via style tag)
// ============================================================================

const shimmerKeyframes = `
@keyframes skeleton-shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes skeleton-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes skeleton-wave {
  0% {
    transform: scaleY(0.5);
  }
  50% {
    transform: scaleY(1);
  }
  100% {
    transform: scaleY(0.5);
  }
}
`;

// ============================================================================
// Base Skeleton Component
// ============================================================================

export function Skeleton({
  className,
  variant = "default",
  width,
  height,
  rounded = "md",
  animate = "shimmer",
  delay = 0,
  children,
}: SkeletonProps) {
  const [isVisible, setIsVisible] = useState(delay === 0);

  // Progressive disclosure with delay
  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  const variantDefaults: Record<SkeletonVariant, { width?: string; height?: string; rounded: string }> = {
    default: { rounded: roundedClasses[rounded] },
    text: { height: "1em", rounded: "rounded" },
    avatar: { width: "40px", height: "40px", rounded: "rounded-full" },
    button: { width: "100px", height: "40px", rounded: "rounded-lg" },
    card: { height: "120px", rounded: "rounded-xl" },
    voice: { rounded: "rounded-2xl" },
    pattern: { rounded: "rounded-xl" },
    lens: { rounded: "rounded-xl" },
  };

  const defaults = variantDefaults[variant];

  return (
    <>
      {/* Inject keyframes once */}
      <style dangerouslySetInnerHTML={{ __html: shimmerKeyframes }} />

      <div
        className={cn(
          "relative overflow-hidden bg-[var(--bg-hover)]",
          defaults.rounded,
          // Visibility transition
          "transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0",
          // Pulse animation
          animate === "pulse" && "animate-pulse",
          className
        )}
        style={{
          width: width || defaults.width,
          height: height || defaults.height,
          animationDelay: `${delay}ms`,
        }}
        aria-hidden="true"
      >
        {/* Shimmer overlay */}
        {animate === "shimmer" && (
          <div
            className="absolute inset-0 -translate-x-full"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
              animation: "skeleton-shimmer 1.5s ease-in-out infinite",
              animationDelay: `${delay}ms`,
            }}
          />
        )}

        {/* Content (for compound skeletons) */}
        {children}
      </div>
    </>
  );
}

// ============================================================================
// Skeleton Group (Staggered Animation)
// ============================================================================

export function SkeletonGroup({ children, stagger = 100, className }: SkeletonGroupProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.isArray(children)
        ? children.map((child, index) => (
            <div
              key={index}
              style={{ animationDelay: `${index * stagger}ms` }}
              className="animate-in fade-in slide-in-from-bottom-2"
            >
              {child}
            </div>
          ))
        : children}
    </div>
  );
}

// ============================================================================
// Text Skeleton
// ============================================================================

interface TextSkeletonProps {
  lines?: number;
  lastLineWidth?: string;
  className?: string;
  animate?: "pulse" | "shimmer" | "none";
}

export function TextSkeleton({
  lines = 3,
  lastLineWidth = "60%",
  className,
  animate = "shimmer",
}: TextSkeletonProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? lastLineWidth : "100%"}
          height="0.875rem"
          animate={animate}
          delay={i * 50}
        />
      ))}
    </div>
  );
}

// ============================================================================
// Voice Skeleton (Waveform placeholder)
// ============================================================================

interface VoiceSkeletonProps {
  bars?: number;
  className?: string;
}

export function VoiceSkeleton({ bars = 12, className }: VoiceSkeletonProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-1 p-6 rounded-2xl",
        "bg-[var(--bg-surface)] border border-[var(--border)]",
        className
      )}
    >
      {/* Microphone icon skeleton */}
      <div className="mr-4">
        <Skeleton variant="avatar" width="48px" height="48px" animate="pulse" />
      </div>

      {/* Waveform bars */}
      <div className="flex items-center gap-1 h-8">
        {Array.from({ length: bars }).map((_, i) => {
          // Use stable pseudo-random height based on index
          const pseudoRandom = Math.sin(i * 2.1 + 0.5) * 0.5 + 0.5;
          return (
            <div
              key={i}
              className="w-1 bg-[var(--bg-hover)] rounded-full"
              style={{
                height: `${12 + Math.sin(i * 0.8) * 8 + pseudoRandom * 8}px`,
                animation: "skeleton-wave 1s ease-in-out infinite",
                animationDelay: `${i * 80}ms`,
              }}
            />
          );
        })}
      </div>

      {/* Status text skeleton */}
      <div className="ml-4">
        <Skeleton width="80px" height="12px" animate="shimmer" />
      </div>
    </div>
  );
}

// ============================================================================
// Pattern Card Skeleton
// ============================================================================

interface PatternSkeletonProps {
  className?: string;
}

export function PatternSkeleton({ className }: PatternSkeletonProps) {
  return (
    <div
      className={cn(
        "p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)]",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton variant="avatar" width="36px" height="36px" />
          <div className="space-y-1.5">
            <Skeleton width="120px" height="14px" />
            <Skeleton width="80px" height="10px" delay={50} />
          </div>
        </div>
        <Skeleton width="60px" height="24px" rounded="full" delay={100} />
      </div>

      {/* Pattern visualization placeholder */}
      <div className="flex items-center justify-center gap-2 py-6 mb-4 rounded-lg bg-[var(--bg-base)]">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <Skeleton
              width="8px"
              height={`${20 + i * 8}px`}
              rounded="full"
              delay={i * 80}
              animate="pulse"
            />
          </div>
        ))}
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4">
        <Skeleton width="60px" height="12px" delay={150} />
        <Skeleton width="40px" height="12px" delay={200} />
        <Skeleton width="50px" height="12px" delay={250} />
      </div>
    </div>
  );
}

// ============================================================================
// Lens Card Skeleton
// ============================================================================

interface LensSkeletonProps {
  className?: string;
}

export function LensSkeleton({ className }: LensSkeletonProps) {
  return (
    <div
      className={cn(
        "p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)]",
        className
      )}
    >
      {/* Header with lens badge */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton width="60px" height="24px" rounded="lg" />
        <Skeleton width="80px" height="16px" delay={50} />
      </div>

      {/* Content sections */}
      <div className="space-y-4">
        {["Context", "Tension", "Meaning", "Function"].map((_, i) => (
          <div key={i}>
            <Skeleton width="60px" height="10px" className="mb-2" delay={i * 50} />
            <TextSkeleton lines={2} lastLineWidth="85%" animate="shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Object Card Skeleton (for Archive)
// ============================================================================

interface ObjectSkeletonProps {
  className?: string;
}

export function ObjectSkeleton({ className }: ObjectSkeletonProps) {
  return (
    <div
      className={cn(
        "p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)]",
        "border-l-2 border-l-[var(--bg-hover)]",
        className
      )}
    >
      {/* Title */}
      <Skeleton width="90%" height="16px" className="mb-3" />

      {/* Preview text */}
      <TextSkeleton lines={2} lastLineWidth="70%" />

      {/* Meta row */}
      <div className="flex items-center gap-3 mt-4">
        <Skeleton width="60px" height="12px" delay={100} />
        <Skeleton width="50px" height="18px" rounded="sm" delay={150} />
        <Skeleton width="45px" height="18px" rounded="sm" delay={200} />
      </div>
    </div>
  );
}

// ============================================================================
// Dashboard Stats Skeleton
// ============================================================================

interface StatsSkeletonProps {
  className?: string;
}

export function StatsSkeleton({ className }: StatsSkeletonProps) {
  return (
    <div
      className={cn(
        "p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)]",
        className
      )}
    >
      {/* Icon placeholder */}
      <Skeleton width="36px" height="36px" rounded="lg" className="mb-3" />

      {/* Value */}
      <Skeleton width="60px" height="28px" className="mb-1" delay={50} />

      {/* Label */}
      <Skeleton width="80px" height="10px" delay={100} />
    </div>
  );
}

// ============================================================================
// Full Dashboard Skeleton
// ============================================================================

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Skeleton width="200px" height="32px" className="mb-2" />
        <Skeleton width="300px" height="16px" delay={50} />
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Voice card (2 cols) */}
        <div className="col-span-2">
          <VoiceSkeleton />
        </div>

        {/* Stats cards */}
        <StatsSkeleton />
        <StatsSkeleton />
      </div>

      {/* Recent Objects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <Skeleton width="120px" height="12px" />
          <Skeleton width="100px" height="14px" delay={50} />
        </div>

        <div className="flex gap-4 overflow-hidden">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex-shrink-0 w-[280px]">
              <ObjectSkeleton />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Interpretation Results Skeleton
// ============================================================================

export function InterpretationSkeleton() {
  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <Skeleton width="100%" height="40px" rounded="lg" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton width="180px" height="20px" />
        <Skeleton width="140px" height="28px" rounded="lg" />
      </div>

      {/* Lens cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <LensSkeleton />
        <LensSkeleton />
      </div>
    </div>
  );
}

// ============================================================================
// Archive Page Skeleton
// ============================================================================

export function ArchiveSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton width="120px" height="28px" />
        <Skeleton width="100px" height="36px" rounded="lg" />
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <Skeleton width="80px" height="32px" rounded="full" />
        <Skeleton width="100px" height="32px" rounded="full" delay={50} />
        <Skeleton width="90px" height="32px" rounded="full" delay={100} />
      </div>

      {/* Object list */}
      <div className="space-y-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <ObjectSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Inline Loading Skeleton
// ============================================================================

interface InlineSkeletonProps {
  width?: string;
  className?: string;
}

export function InlineSkeleton({ width = "100px", className }: InlineSkeletonProps) {
  return (
    <span className={cn("inline-block align-middle", className)}>
      <Skeleton width={width} height="1em" rounded="sm" animate="shimmer" />
    </span>
  );
}

// ============================================================================
// Avatar with Name Skeleton
// ============================================================================

interface AvatarNameSkeletonProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AvatarNameSkeleton({ size = "md", className }: AvatarNameSkeletonProps) {
  const sizes = {
    sm: { avatar: "32px", name: "80px", sub: "60px" },
    md: { avatar: "40px", name: "100px", sub: "70px" },
    lg: { avatar: "48px", name: "120px", sub: "80px" },
  };

  const s = sizes[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Skeleton variant="avatar" width={s.avatar} height={s.avatar} />
      <div className="space-y-1.5">
        <Skeleton width={s.name} height="14px" />
        <Skeleton width={s.sub} height="10px" delay={50} />
      </div>
    </div>
  );
}

// ============================================================================
// Export default
// ============================================================================

export default Skeleton;
