"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/constants/design-system";
import { MobileNav } from "./MobileNav";
import { CommandPalette } from "./CommandPalette";

// ============================================================================
// Types
// ============================================================================

interface AppShellProps {
  children: React.ReactNode;
  user: { email: string };
  profile: { tier: string; objectCount: number };
}

interface FloatingPanelState {
  id: string;
  content: React.ReactNode;
  position: "left" | "right" | "center";
  size?: "sm" | "md" | "lg";
}

interface AppShellContextType {
  openPanel: (panel: Omit<FloatingPanelState, "id">) => string;
  closePanel: (id: string) => void;
  closeAllPanels: () => void;
  panels: FloatingPanelState[];
}

// ============================================================================
// Context for Floating Panels
// ============================================================================

const AppShellContext = createContext<AppShellContextType | null>(null);

export function useAppShell() {
  const context = useContext(AppShellContext);
  if (!context) {
    throw new Error("useAppShell must be used within AppShell");
  }
  return context;
}

// ============================================================================
// Ambient Background
// ============================================================================

function AmbientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[var(--bg-base)]" />

      {/* Gradient orbs */}
      <div
        className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full opacity-30 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(74,144,226,0.15) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full opacity-20 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-1/3 right-1/4 w-1/3 h-1/3 rounded-full opacity-15 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)",
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

// ============================================================================
// Glass Header
// ============================================================================

interface GlassHeaderProps {
  email: string;
  tier: string;
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "Panel", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/archive", label: "Archiwum", icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" },
  { href: "/patterns", label: "Wzorce", icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" },
  { href: "/settings", label: "Ustawienia", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

function GlassHeader({ email, tier }: GlassHeaderProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 hidden md:block",
        "transition-all duration-300 ease-out",
        isScrolled
          ? "bg-[var(--bg-surface)]/80 backdrop-blur-xl border-b border-[var(--border)] shadow-lg shadow-black/5"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] rounded-lg opacity-80 group-hover:opacity-100 transition-opacity" />
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="relative w-8 h-8 p-1.5 text-white"
              >
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
              PatternLens
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium",
                    "transition-all duration-200",
                    isActive
                      ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                  )}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={item.icon} />
                  </svg>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-4">
            {/* Command palette hint */}
            <button
              onClick={() => {
                const event = new KeyboardEvent("keydown", {
                  key: "k",
                  metaKey: true,
                  bubbles: true,
                });
                document.dispatchEvent(event);
              }}
              className={cn(
                "hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg",
                "bg-[var(--bg-surface)]/60 border border-[var(--border)]",
                "text-sm text-[var(--text-muted)]",
                "hover:bg-[var(--bg-hover)] hover:text-[var(--text-secondary)]",
                "transition-all duration-200"
              )}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <span>Szukaj...</span>
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-base)] text-xs font-mono">⌘K</kbd>
            </button>

            {/* Tier badge */}
            <div
              className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold",
                tier === "PRO"
                  ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30"
                  : "bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border)]"
              )}
            >
              {tier}
            </div>

            {/* User menu */}
            <Link
              href="/settings"
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg",
                "hover:bg-[var(--bg-hover)] transition-colors"
              )}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                {email.charAt(0).toUpperCase()}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

// ============================================================================
// Floating Panel
// ============================================================================

interface FloatingPanelProps {
  panel: FloatingPanelState;
  onClose: () => void;
  index: number;
}

function FloatingPanel({ panel, onClose, index }: FloatingPanelProps) {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  const positionClasses = {
    left: "left-4 md:left-8",
    right: "right-4 md:right-8",
    center: "left-1/2 -translate-x-1/2",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]",
          "animate-in fade-in duration-200"
        )}
        style={{ animationDelay: `${index * 50}ms` }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed top-20 bottom-24 sm:bottom-20 z-[61] w-[calc(100%-2rem)]",
          sizeClasses[panel.size || "md"],
          positionClasses[panel.position],
          "bg-[var(--bg-surface)]/95 backdrop-blur-xl",
          "border border-[var(--border)] rounded-2xl",
          "shadow-2xl shadow-black/20",
          "overflow-hidden",
          "animate-in slide-in-from-bottom-4 fade-in duration-300"
        )}
        style={{ animationDelay: `${index * 50 + 100}ms` }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className={cn(
            "absolute top-4 right-4 z-10",
            "w-8 h-8 rounded-full",
            "flex items-center justify-center",
            "bg-[var(--bg-hover)] text-[var(--text-muted)]",
            "hover:bg-[var(--bg-base)] hover:text-[var(--text-primary)]",
            "transition-colors duration-200"
          )}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="h-full overflow-y-auto p-6">{panel.content}</div>
      </div>
    </>
  );
}

// ============================================================================
// Main Content Container
// ============================================================================

interface MainContentProps {
  children: React.ReactNode;
}

function MainContent({ children }: MainContentProps) {
  return (
    <main
      className={cn(
        "relative min-h-screen",
        "pt-4 md:pt-24 pb-24 md:pb-8",
        "px-4 md:px-6 lg:px-8"
      )}
    >
      <div className="max-w-7xl mx-auto">{children}</div>
    </main>
  );
}

// ============================================================================
// Glass Footer
// ============================================================================

function GlassFooter() {
  return (
    <footer
      className={cn(
        "hidden md:block",
        "fixed bottom-0 left-0 right-0 z-40",
        "bg-[var(--bg-surface)]/60 backdrop-blur-lg",
        "border-t border-[var(--border)]"
      )}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-12">
          {/* Left - Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-[var(--text-muted)]">System aktywny</span>
            </div>
          </div>

          {/* Center - Branding */}
          <div className="text-xs text-[var(--text-muted)]">
            PatternLens &middot; Narzędzie konstrukcyjne do analizy strukturalnej
          </div>

          {/* Right - Links */}
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
            >
              Prywatność
            </Link>
            <Link
              href="/terms"
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
            >
              Regulamin
            </Link>
            <Link
              href="/emergency"
              className="text-xs text-amber-500 hover:text-amber-400 transition-colors"
            >
              Zasoby kryzysowe
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// Main AppShell Component
// ============================================================================

export function AppShell({ children, user, profile }: AppShellProps) {
  const [panels, setPanels] = useState<FloatingPanelState[]>([]);

  const openPanel = useCallback((panel: Omit<FloatingPanelState, "id">) => {
    const id = `panel-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setPanels((prev) => [...prev, { ...panel, id }]);
    return id;
  }, []);

  const closePanel = useCallback((id: string) => {
    setPanels((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const closeAllPanels = useCallback(() => {
    setPanels([]);
  }, []);

  // Close panels on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && panels.length > 0) {
        closePanel(panels[panels.length - 1].id);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [panels, closePanel]);

  return (
    <AppShellContext.Provider value={{ openPanel, closePanel, closeAllPanels, panels }}>
      <div className="relative min-h-screen">
        {/* Ambient background */}
        <AmbientBackground />

        {/* Glass header (desktop) */}
        <GlassHeader email={user.email} tier={profile.tier} />

        {/* Mobile navigation */}
        <MobileNav objectCount={profile.objectCount} tier={profile.tier} />

        {/* Main content */}
        <MainContent>{children}</MainContent>

        {/* Glass footer (desktop) */}
        <GlassFooter />

        {/* Command palette */}
        <CommandPalette />

        {/* Floating panels */}
        {panels.map((panel, index) => (
          <FloatingPanel
            key={panel.id}
            panel={panel}
            onClose={() => closePanel(panel.id)}
            index={index}
          />
        ))}
      </div>
    </AppShellContext.Provider>
  );
}

export default AppShell;
