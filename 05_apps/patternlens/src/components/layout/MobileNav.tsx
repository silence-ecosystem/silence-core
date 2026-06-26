"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/constants/design-system";
import { FREE_OBJECT_LIMIT } from "@/constants";

// ============================================================================
// Types
// ============================================================================

interface MobileNavProps {
  objectCount: number;
  tier: string;
}

interface NavItem {
  id: string;
  href: string;
  label: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
}

interface SwipeState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  isSwiping: boolean;
  direction: "left" | "right" | null;
}

// ============================================================================
// Haptic Feedback
// ============================================================================

const triggerHaptic = (type: "light" | "medium" | "heavy" | "selection" = "light") => {
  if (typeof window === "undefined") return;

  if ("vibrate" in navigator) {
    const patterns: Record<string, number | number[]> = {
      light: 5,
      medium: 10,
      heavy: 20,
      selection: [5, 30, 5],
    };
    navigator.vibrate(patterns[type]);
  }
};

// ============================================================================
// Icons - Optimized SVG icons
// ============================================================================

const Icons = {
  dashboard: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  dashboardFilled: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  archive: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M21 8v13H3V8" />
      <path d="M1 3h22v5H1z" />
      <path d="M10 12h4" />
    </svg>
  ),
  archiveFilled: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M1 3h22v5H1z" />
      <path d="M3 8v13h18V8H3zm7 4h4v2h-4v-2z" />
    </svg>
  ),
  patterns: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  patternsFilled: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" fill="var(--bg-base)" stroke="var(--bg-base)" strokeWidth="2" />
    </svg>
  ),
  settings: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
    </svg>
  ),
  settingsFilled: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
};

// ============================================================================
// Navigation Items Configuration
// ============================================================================

const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    href: "/dashboard",
    label: "Panel",
    icon: Icons.dashboard,
    activeIcon: Icons.dashboardFilled,
  },
  {
    id: "archive",
    href: "/archive",
    label: "Archiwum",
    icon: Icons.archive,
    activeIcon: Icons.archiveFilled,
  },
  {
    id: "patterns",
    href: "/patterns",
    label: "Wzorce",
    icon: Icons.patterns,
    activeIcon: Icons.patternsFilled,
  },
  {
    id: "settings",
    href: "/settings",
    label: "Ustawienia",
    icon: Icons.settings,
    activeIcon: Icons.settingsFilled,
  },
];

// ============================================================================
// Tab Item Component - Enhanced with 44px touch targets
// ============================================================================

interface TabItemProps {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}

function TabItem({ item, isActive, onClick }: TabItemProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleTouchStart = () => {
    setIsPressed(true);
    triggerHaptic("light");
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
  };

  return (
    <Link
      href={item.href}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={() => setIsPressed(false)}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        // 44px minimum touch target
        "relative flex flex-col items-center justify-center flex-1",
        "min-h-[56px] min-w-[44px] pt-2 pb-1",
        "touch-manipulation",
        "transition-all duration-200 ease-out gpu",
        // Focus state - WCAG AA
        "focus:outline-none focus-visible:bg-[var(--bg-hover)] focus-visible:rounded-xl",
        // Touch feedback
        isPressed && "scale-90 opacity-70"
      )}
    >
      {/* Icon container with background indicator */}
      <div
        className={cn(
          "relative flex items-center justify-center w-12 h-8 rounded-2xl",
          "transition-all duration-300 ease-out",
          isActive && "bg-[var(--primary)]/15"
        )}
      >
        {/* Icon */}
        <div
          className={cn(
            "transition-all duration-200",
            isActive ? "text-[var(--primary)] scale-110" : "text-[var(--text-muted)]"
          )}
        >
          {isActive ? item.activeIcon : item.icon}
        </div>

        {/* Active indicator dot */}
        {isActive && (
          <div className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-[var(--primary)] animate-in fade-in zoom-in duration-200" />
        )}
      </div>

      {/* Label */}
      <span
        className={cn(
          "text-[10px] font-medium mt-1 transition-colors duration-200",
          isActive ? "text-[var(--primary)]" : "text-[var(--text-muted)]"
        )}
      >
        {item.label}
      </span>
    </Link>
  );
}

// ============================================================================
// Swipe Indicator
// ============================================================================

interface SwipeIndicatorProps {
  direction: "left" | "right" | null;
  progress: number;
}

function SwipeIndicator({ direction, progress }: SwipeIndicatorProps) {
  if (!direction || progress < 0.1) return null;

  return (
    <div
      className={cn(
        "absolute top-0 bottom-0 w-16 flex items-center justify-center",
        "pointer-events-none transition-opacity duration-150",
        direction === "left" ? "right-0" : "left-0",
        progress > 0.3 ? "opacity-100" : "opacity-50"
      )}
      aria-hidden="true"
    >
      <div
        className={cn(
          "w-10 h-10 rounded-full glass flex items-center justify-center",
          "transition-transform duration-150",
          progress > 0.5 && "scale-110"
        )}
        style={{
          transform: `translateX(${direction === "left" ? progress * 20 : -progress * 20}px)`,
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={cn(
            "text-[var(--text-secondary)]",
            direction === "left" && "rotate-180"
          )}
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}

// ============================================================================
// Mobile Header - Enhanced with glassmorphism
// ============================================================================

interface MobileHeaderProps {
  objectCount: number;
  tier: string;
}

function MobileHeader({ objectCount, tier }: MobileHeaderProps) {
  const progress = (objectCount / FREE_OBJECT_LIMIT) * 100;

  return (
    <header
      className={cn(
        "flex lg:hidden items-center justify-between",
        "px-4 py-3",
        "border-b border-[var(--border)]",
        "glass sticky top-0 z-40"
      )}
      role="banner"
    >
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2.5 touch-manipulation">
        <div className="w-8 h-8 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] rounded-lg flex items-center justify-center shadow-md shadow-[var(--primary)]/20">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-5 h-5 text-white"
            aria-hidden="true"
          >
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        <span className="text-sm font-semibold text-[var(--text-primary)]">PatternLens</span>
      </Link>

      {/* Right section: Usage indicator */}
      <div className="flex items-center gap-3">
        {tier === "FREE" && (
          <div className="flex items-center gap-2" aria-label={`Wykorzystano ${objectCount} z ${FREE_OBJECT_LIMIT} obiektów`}>
            <div className="w-16 h-1.5 bg-[var(--bg-hover)] rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  progress >= 100 ? "bg-red-400" : progress >= 80 ? "bg-amber-400" : "bg-[var(--primary)]"
                )}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-[var(--text-muted)] font-medium tabular-nums">
              {objectCount}/{FREE_OBJECT_LIMIT}
            </span>
          </div>
        )}

        {tier === "PRO" && (
          <span className="px-2 py-0.5 text-[10px] font-semibold uppercase bg-emerald-500/15 text-emerald-400 rounded-full">
            PRO
          </span>
        )}
      </div>
    </header>
  );
}

// ============================================================================
// Main MobileNav Component - Bottom Tab Navigation
// ============================================================================

export function MobileNav({ objectCount, tier }: MobileNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const navRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [swipeState, setSwipeState] = useState<SwipeState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isSwiping: false,
    direction: null,
  });

  // Sync active index with pathname (prev-state pattern)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    const index = NAV_ITEMS.findIndex(
      (item) => pathname === item.href || pathname.startsWith(item.href + "/")
    );
    if (index !== -1) {
      setActiveIndex(index);
    }
  }

  // Handle tab navigation
  const handleTabPress = useCallback(
    (index: number) => {
      if (index === activeIndex) return;

      triggerHaptic("selection");
      setActiveIndex(index);
      router.push(NAV_ITEMS[index].href);
    },
    [activeIndex, router]
  );

  // Swipe gesture handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setSwipeState({
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      isSwiping: false,
      direction: null,
    });
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      const deltaX = touch.clientX - swipeState.startX;
      const deltaY = touch.clientY - swipeState.startY;

      // Only track horizontal swipes
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
        setSwipeState((prev) => ({
          ...prev,
          currentX: touch.clientX,
          currentY: touch.clientY,
          isSwiping: true,
          direction: deltaX > 0 ? "right" : "left",
        }));
      }
    },
    [swipeState.startX, swipeState.startY]
  );

  const handleTouchEnd = useCallback(() => {
    if (!swipeState.isSwiping) return;

    const deltaX = swipeState.currentX - swipeState.startX;
    const threshold = 80;

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0 && activeIndex > 0) {
        // Swipe right - go to previous tab
        handleTabPress(activeIndex - 1);
      } else if (deltaX < 0 && activeIndex < NAV_ITEMS.length - 1) {
        // Swipe left - go to next tab
        handleTabPress(activeIndex + 1);
      }
    }

    setSwipeState({
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      isSwiping: false,
      direction: null,
    });
  }, [swipeState, activeIndex, handleTabPress]);

  // Calculate swipe progress
  const swipeProgress = swipeState.isSwiping
    ? Math.min(Math.abs(swipeState.currentX - swipeState.startX) / 100, 1)
    : 0;

  return (
    <>
      {/* Mobile Header */}
      <MobileHeader objectCount={objectCount} tier={tier} />

      {/* Bottom Tab Navigation */}
      <nav
        ref={navRef}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 lg:hidden",
          "glass-heavy",
          "border-t border-[var(--border)]",
          "safe-area-bottom"
        )}
        role="navigation"
        aria-label="Główna nawigacja"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Swipe indicator */}
        <SwipeIndicator direction={swipeState.direction} progress={swipeProgress} />

        {/* Tab bar content */}
        <div className="flex items-end justify-around px-2">
          {NAV_ITEMS.map((item, index) => (
            <TabItem
              key={item.id}
              item={item}
              isActive={activeIndex === index}
              onClick={() => handleTabPress(index)}
            />
          ))}
        </div>

        {/* Active tab indicator line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 overflow-hidden">
          <div
            className="h-full bg-[var(--primary)] transition-all duration-300 ease-out rounded-full"
            style={{
              width: `${100 / NAV_ITEMS.length}%`,
              marginLeft: `${(activeIndex / NAV_ITEMS.length) * 100}%`,
            }}
          />
        </div>
      </nav>

      {/* Spacer for bottom nav to prevent content overlap */}
      <div className="h-20 lg:hidden" aria-hidden="true" />
    </>
  );
}

export default MobileNav;
