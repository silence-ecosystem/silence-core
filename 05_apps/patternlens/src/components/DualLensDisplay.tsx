"use client";

import { useState } from "react";

interface LensInterpretation {
  context: string;
  tension: string;
  meaning: string;
  function: string;
  confidence: number;
}

interface DualLensDisplayProps {
  lensA: LensInterpretation;
  lensB: LensInterpretation;
  selectedLens?: "A" | "B" | null;
  onSelectLens?: (lens: "A" | "B") => void;
  isLoading?: boolean;
}

export function DualLensDisplay({
  lensA,
  lensB,
  selectedLens,
  onSelectLens,
  isLoading = false,
}: DualLensDisplayProps) {
  const [expandedLens, setExpandedLens] = useState<"A" | "B" | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LensSkeleton lens="A" />
        <LensSkeleton lens="B" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-pl-slide-up">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LensCard
          lens="A"
          label="Lens A"
          sublabel="External systemic pressures"
          interpretation={lensA}
          isSelected={selectedLens === "A"}
          isExpanded={expandedLens === "A"}
          onSelect={() => onSelectLens?.("A")}
          onToggleExpand={() => setExpandedLens(expandedLens === "A" ? null : "A")}
        />
        <LensCard
          lens="B"
          label="Lens B"
          sublabel="Internal adaptive mechanisms"
          interpretation={lensB}
          isSelected={selectedLens === "B"}
          isExpanded={expandedLens === "B"}
          onSelect={() => onSelectLens?.("B")}
          onToggleExpand={() => setExpandedLens(expandedLens === "B" ? null : "B")}
        />
      </div>

      {/* Disclaimer */}
      <p className="text-caption text-center text-[var(--text-muted)]">
        This is a proposed structural reading, not truth about you.
      </p>
    </div>
  );
}

interface LensCardProps {
  lens: "A" | "B";
  label: string;
  sublabel: string;
  interpretation: LensInterpretation;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: () => void;
  onToggleExpand: () => void;
}

function LensCard({
  lens,
  label,
  sublabel,
  interpretation,
  isSelected,
  isExpanded,
  onSelect,
  onToggleExpand,
}: LensCardProps) {
  const confidencePercent = Math.round(interpretation.confidence * 100);

  // v3.0 Lens colors: A = Blue (#3b82f6), B = Purple (#a855f7)
  const isLensA = lens === "A";
  const lensColor = isLensA ? "blue" : "purple";
  const lensColorVar = isLensA ? "var(--lens-a)" : "var(--lens-b)";
  const lensBorderVar = isLensA ? "var(--lens-a-border)" : "var(--lens-b-border)";
  const lensMutedVar = isLensA ? "var(--lens-a-muted)" : "var(--lens-b-muted)";

  return (
    <div
      className={`
        lens-card relative rounded-xl border p-6 transition-all duration-200
        ${isLensA ? "lens-card-a" : "lens-card-b"}
        ${isSelected ? (isLensA ? "shadow-glow-blue" : "shadow-glow-purple") : ""}
      `}
      style={{
        borderColor: lensBorderVar,
        backgroundColor: lensMutedVar,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span
            className="lens-badge px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: lensMutedVar,
              color: lensColorVar,
              borderColor: lensBorderVar,
              borderWidth: "1px",
              borderStyle: "solid",
            }}
          >
            {label}
          </span>
          <p className="text-caption text-[var(--text-muted)]">{sublabel}</p>
        </div>
        <ConfidenceIndicator value={confidencePercent} color={lensColor} />
      </div>

      {/* Content - Accordion Sections */}
      <div className="space-y-4">
        <InterpretationSection
          title="Context"
          content={interpretation.context}
          isExpanded={isExpanded}
          accentColor={lensColorVar}
        />
        <InterpretationSection
          title="Tension"
          content={interpretation.tension}
          isExpanded={isExpanded}
          accentColor={lensColorVar}
        />
        {isExpanded && (
          <>
            <InterpretationSection
              title="Meaning"
              content={interpretation.meaning}
              isExpanded={true}
              accentColor={lensColorVar}
            />
            <InterpretationSection
              title="Function"
              content={interpretation.function}
              isExpanded={true}
              accentColor={lensColorVar}
            />
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-6 pt-4 border-t border-[var(--border)]">
        <button
          onClick={onToggleExpand}
          className="text-body-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors touch-target"
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
        <div className="flex-1" />
        <button
          onClick={onSelect}
          disabled={isSelected}
          className={`
            btn min-h-[48px] px-4 py-2 text-sm rounded-lg transition-all
            ${isSelected
              ? "cursor-default"
              : "btn-secondary hover:bg-[var(--bg-hover)]"
            }
          `}
          style={isSelected ? {
            backgroundColor: lensMutedVar,
            color: lensColorVar,
            borderColor: lensBorderVar,
            borderWidth: "1px",
          } : undefined}
        >
          {isSelected ? "Selected" : "Select this lens"}
        </button>
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div
          className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full animate-pl-pulse-glow"
          style={{ backgroundColor: lensColorVar }}
        />
      )}
    </div>
  );
}

interface InterpretationSectionProps {
  title: string;
  content: string;
  isExpanded: boolean;
  accentColor: string;
}

function InterpretationSection({ title, content, isExpanded, accentColor }: InterpretationSectionProps) {
  const displayContent = isExpanded
    ? content
    : content.slice(0, 120) + (content.length > 120 ? "..." : "");

  return (
    <div className="animate-pl-fade-in">
      <h4
        className="text-label uppercase tracking-wide mb-1.5"
        style={{ color: accentColor }}
      >
        {title}
      </h4>
      <p className="text-body-sm text-[var(--text-secondary)] leading-relaxed">
        {displayContent}
      </p>
    </div>
  );
}

interface ConfidenceIndicatorProps {
  value: number;
  color: "blue" | "purple";
}

function ConfidenceIndicator({ value, color }: ConfidenceIndicatorProps) {
  const fillColor = color === "blue" ? "var(--lens-a)" : "var(--lens-b)";
  const filledBars = Math.round(value / 20);

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-4 rounded-sm transition-all"
            style={{
              backgroundColor: i < filledBars ? fillColor : "var(--border)",
            }}
          />
        ))}
      </div>
      <span className="text-caption font-mono text-[var(--text-muted)]">
        {value}%
      </span>
    </div>
  );
}

function LensSkeleton({ lens }: { lens: "A" | "B" }) {
  const isLensA = lens === "A";
  const borderColor = isLensA ? "var(--lens-a-border)" : "var(--lens-b-border)";
  const bgColor = isLensA ? "var(--lens-a-muted)" : "var(--lens-b-muted)";

  return (
    <div
      className="rounded-xl border p-6 animate-pulse"
      style={{ borderColor, backgroundColor: bgColor }}
      aria-label={`Loading Lens ${lens}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="h-6 w-16 bg-[var(--border)] rounded-full" />
        <div className="h-4 w-32 bg-[var(--border)] rounded" />
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="h-3 w-16 bg-[var(--border)] rounded" />
          <div className="h-4 w-full bg-[var(--border)] rounded" />
          <div className="h-4 w-3/4 bg-[var(--border)] rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-16 bg-[var(--border)] rounded" />
          <div className="h-4 w-full bg-[var(--border)] rounded" />
          <div className="h-4 w-2/3 bg-[var(--border)] rounded" />
        </div>
      </div>
    </div>
  );
}
