'use client';

import { forwardRef, type ReactNode, type HTMLAttributes, type JSX } from 'react';

// ============================================
// TYPES
// ============================================

type BentoSpan = 1 | 2 | 3 | 4;
type BentoRowSpan = 1 | 2 | 3;

interface BentoGridProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
}

interface BentoCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  colSpan?: BentoSpan;
  rowSpan?: BentoRowSpan;
  variant?: 'default' | 'glass' | 'solid' | 'gradient' | 'outline';
  interactive?: boolean;
  glow?: 'cyan' | 'purple' | 'pink' | 'none';
}

// ============================================
// BENTO GRID
// ============================================

const BentoGrid = forwardRef<HTMLDivElement, BentoGridProps>(
  ({ children, columns = 4, gap = 'md', className = '', ...props }, ref) => {
    const gapClasses: Record<typeof gap, string> = {
      sm: 'gap-2 sm:gap-3',
      md: 'gap-3 sm:gap-4',
      lg: 'gap-4 sm:gap-6',
    };

    const columnClasses: Record<typeof columns, string> = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    };

    return (
      <div
        ref={ref}
        className={`
          grid auto-rows-[minmax(120px,auto)]
          ${columnClasses[columns]}
          ${gapClasses[gap]}
          ${className}
        `.trim()}
        {...props}
      >
        {children}
      </div>
    );
  }
);

BentoGrid.displayName = 'BentoGrid';

// ============================================
// BENTO CARD
// ============================================

const BentoCard = forwardRef<HTMLDivElement, BentoCardProps>(
  (
    {
      children,
      colSpan = 1,
      rowSpan = 1,
      variant = 'glass',
      interactive = false,
      glow = 'none',
      className = '',
      ...props
    },
    ref
  ) => {
    // Column span classes
    const colSpanClasses: Record<BentoSpan, string> = {
      1: 'col-span-1',
      2: 'col-span-1 sm:col-span-2',
      3: 'col-span-1 sm:col-span-2 lg:col-span-3',
      4: 'col-span-1 sm:col-span-2 lg:col-span-4',
    };

    // Row span classes
    const rowSpanClasses: Record<BentoRowSpan, string> = {
      1: 'row-span-1',
      2: 'row-span-2',
      3: 'row-span-3',
    };

    // Variant classes
    const variantClasses: Record<typeof variant, string> = {
      default: 'bg-gray-900 border border-white/10',
      glass: 'bg-gray-900/60 backdrop-blur-xl border border-white/10',
      solid: 'bg-gray-800 border border-gray-700',
      gradient: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-white/10',
      outline: 'bg-transparent border-2 border-white/20',
    };

    // Glow classes
    const glowClasses: Record<typeof glow, string> = {
      none: '',
      cyan: 'shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)]',
      purple: 'shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]',
      pink: 'shadow-[0_0_30px_-5px_rgba(236,72,153,0.3)]',
    };

    // Interactive classes
    const interactiveClasses = interactive
      ? 'cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-white/20 active:scale-[0.98]'
      : '';

    return (
      <div
        ref={ref}
        className={`
          relative overflow-hidden rounded-2xl p-4 sm:p-5
          ${colSpanClasses[colSpan]}
          ${rowSpanClasses[rowSpan]}
          ${variantClasses[variant]}
          ${glowClasses[glow]}
          ${interactiveClasses}
          ${className}
        `.trim()}
        {...props}
      >
        {children}
      </div>
    );
  }
);

BentoCard.displayName = 'BentoCard';

// ============================================
// SPECIALIZED CARDS
// ============================================

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: { value: number; label: string };
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'orange';
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'cyan',
}: StatCardProps): JSX.Element {
  const colorClasses: Record<typeof color, { text: string; bg: string }> = {
    cyan: { text: 'text-cyan-400', bg: 'bg-cyan-500/20' },
    purple: { text: 'text-purple-400', bg: 'bg-purple-500/20' },
    pink: { text: 'text-pink-400', bg: 'bg-pink-500/20' },
    green: { text: 'text-green-400', bg: 'bg-green-500/20' },
    orange: { text: 'text-orange-400', bg: 'bg-orange-500/20' },
  };

  return (
    <BentoCard variant="glass">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 font-medium">{title}</p>
          <p className={`text-3xl font-bold mt-1 ${colorClasses[color].text}`}>
            {value}
          </p>
          {subtitle !== undefined && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {icon !== undefined && (
          <div className={`p-3 rounded-xl ${colorClasses[color].bg}`}>
            {icon}
          </div>
        )}
      </div>
      {trend !== undefined && (
        <div className="flex items-center gap-1 mt-3">
          <span
            className={`text-sm font-medium ${
              trend.value >= 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {trend.value >= 0 ? '+' : ''}
            {trend.value}%
          </span>
          <span className="text-xs text-gray-500">{trend.label}</span>
        </div>
      )}
    </BentoCard>
  );
}

// ============================================
// PROGRESS CARD
// ============================================

interface ProgressCardProps {
  title: string;
  current: number;
  max: number;
  unit?: string;
  showPercentage?: boolean;
  color?: 'cyan' | 'purple' | 'pink' | 'green';
}

function ProgressCard({
  title,
  current,
  max,
  unit = '',
  showPercentage = false,
  color = 'cyan',
}: ProgressCardProps): JSX.Element {
  const percentage = Math.min(100, (current / max) * 100);
  
  const colorClasses: Record<typeof color, { bar: string; text: string }> = {
    cyan: { bar: 'bg-cyan-500', text: 'text-cyan-400' },
    purple: { bar: 'bg-purple-500', text: 'text-purple-400' },
    pink: { bar: 'bg-pink-500', text: 'text-pink-400' },
    green: { bar: 'bg-green-500', text: 'text-green-400' },
  };

  return (
    <BentoCard variant="glass">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-400 font-medium">{title}</p>
        <p className={`text-sm font-bold ${colorClasses[color].text}`}>
          {showPercentage ? `${percentage.toFixed(0)}%` : `${current}/${max}${unit}`}
        </p>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color].bar} transition-all duration-500 rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {!showPercentage && (
        <p className="text-xs text-gray-500 mt-2">
          {max - current} {unit} remaining
        </p>
      )}
    </BentoCard>
  );
}

// ============================================
// FEATURE CARD (for PRO features)
// ============================================

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  isPro?: boolean;
  isLocked?: boolean;
  onClick?: () => void;
}

function FeatureCard({
  title,
  description,
  icon,
  isPro = false,
  isLocked = false,
  onClick,
}: FeatureCardProps): JSX.Element {
  return (
    <BentoCard
      variant={isLocked ? 'outline' : 'glass'}
      interactive={!isLocked}
      glow={isLocked ? 'none' : 'cyan'}
      className={isLocked ? 'opacity-60' : ''}
      onClick={isLocked ? undefined : onClick}
      role={onClick !== undefined ? 'button' : undefined}
      tabIndex={onClick !== undefined && !isLocked ? 0 : undefined}
      aria-disabled={isLocked}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-white/5">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white truncate">{title}</h3>
            {isPro && (
              <span className="px-2 py-0.5 text-xs font-bold text-purple-400 bg-purple-500/20 rounded-full">
                PRO
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 mt-1 line-clamp-2">{description}</p>
        </div>
        {isLocked && (
          <svg
            className="w-5 h-5 text-gray-500 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        )}
      </div>
    </BentoCard>
  );
}

// ============================================
// EXPORTS
// ============================================

export {
  BentoGrid,
  BentoCard,
  StatCard,
  ProgressCard,
  FeatureCard,
  type BentoGridProps,
  type BentoCardProps,
  type StatCardProps,
  type ProgressCardProps,
  type FeatureCardProps,
};

export default BentoGrid;
