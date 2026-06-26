'use client';

interface ConfidenceBarProps {
  value: number;
  showLabel?: boolean;
}

export function ConfidenceBar({ value, showLabel = true }: ConfidenceBarProps) {
  const segments = 10;
  const filledSegments = Math.round((value / 100) * segments);

  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-[2px]">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-4 rounded-sm transition-colors ${
              i < filledSegments ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'
            }`}
          />
        ))}
      </div>
      {showLabel && (
        <span className="font-mono text-sm text-[var(--text-secondary)]">{value}%</span>
      )}
    </div>
  );
}
