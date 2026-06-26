"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/constants/design-system";

// ============================================================================
// Types
// ============================================================================

interface Command {
  id: string;
  label: string;
  description?: string;
  shortcut?: string[];
  icon: React.ReactNode;
  action: () => void;
  category: "navigation" | "action" | "recent";
  keywords?: string[];
}

interface CommandPaletteProps {
  onNewObject?: () => void;
  onVoiceRecord?: () => void;
}

// ============================================================================
// Icons
// ============================================================================

const Icons = {
  search: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  plus: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  mic: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  ),
  archive: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 8v13H3V8M1 3h22v5H1zM10 12h4" />
    </svg>
  ),
  patterns: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  settings: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  clock: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  help: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  return: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 10 4 15 9 20" />
      <path d="M20 4v7a4 4 0 0 1-4 4H4" />
    </svg>
  ),
};

// ============================================================================
// Fuzzy Search
// ============================================================================

function fuzzyMatch(text: string, query: string): { match: boolean; score: number } {
  if (!query) return { match: true, score: 1 };

  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();

  // Exact match
  if (textLower.includes(queryLower)) {
    return { match: true, score: 1 - queryLower.length / textLower.length };
  }

  // Fuzzy match
  let queryIndex = 0;
  let score = 0;
  let lastMatchIndex = -1;

  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      // Bonus for consecutive matches
      if (lastMatchIndex === i - 1) {
        score += 2;
      } else {
        score += 1;
      }
      lastMatchIndex = i;
      queryIndex++;
    }
  }

  const match = queryIndex === queryLower.length;
  const normalizedScore = match ? score / (textLower.length + queryLower.length) : 0;

  return { match, score: normalizedScore };
}

function searchCommands(commands: Command[], query: string): Command[] {
  if (!query.trim()) {
    return commands;
  }

  const results = commands
    .map((cmd) => {
      const labelMatch = fuzzyMatch(cmd.label, query);
      const descMatch = cmd.description ? fuzzyMatch(cmd.description, query) : { match: false, score: 0 };
      const keywordMatches = (cmd.keywords || []).map((kw) => fuzzyMatch(kw, query));
      const bestKeywordMatch = keywordMatches.reduce(
        (best, curr) => (curr.score > best.score ? curr : best),
        { match: false, score: 0 }
      );

      const bestScore = Math.max(labelMatch.score, descMatch.score, bestKeywordMatch.score);
      const isMatch = labelMatch.match || descMatch.match || bestKeywordMatch.match;

      return { command: cmd, score: bestScore, match: isMatch };
    })
    .filter((r) => r.match)
    .sort((a, b) => b.score - a.score);

  return results.map((r) => r.command);
}

// ============================================================================
// Keyboard Shortcut Display
// ============================================================================

function ShortcutKey({ keys }: { keys: string[] }) {
  return (
    <div className="flex items-center gap-1">
      {keys.map((key, i) => (
        <kbd
          key={i}
          className={cn(
            "px-1.5 py-0.5 text-[10px] font-medium rounded",
            "bg-[var(--bg-base)] border border-[var(--border)]",
            "text-[var(--text-muted)]"
          )}
        >
          {key}
        </kbd>
      ))}
    </div>
  );
}

// ============================================================================
// Command Item
// ============================================================================

interface CommandItemProps {
  command: Command;
  isSelected: boolean;
  onSelect: () => void;
  onHover: () => void;
}

function CommandItem({ command, isSelected, onSelect, onHover }: CommandItemProps) {
  return (
    <button
      onClick={onSelect}
      onMouseEnter={onHover}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
        "text-left transition-colors duration-150",
        isSelected
          ? "bg-[var(--primary)]/10 text-[var(--text-primary)]"
          : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
      )}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
          "transition-colors duration-150",
          isSelected ? "bg-[var(--primary)]/20 text-[var(--primary)]" : "bg-[var(--bg-surface)] text-[var(--text-muted)]"
        )}
      >
        {command.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{command.label}</div>
        {command.description && (
          <div className="text-xs text-[var(--text-muted)] truncate">{command.description}</div>
        )}
      </div>

      {command.shortcut && <ShortcutKey keys={command.shortcut} />}
    </button>
  );
}

// ============================================================================
// Category Header
// ============================================================================

function CategoryHeader({ title }: { title: string }) {
  return (
    <div className="px-3 py-2">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
        {title}
      </span>
    </div>
  );
}

// ============================================================================
// Main CommandPalette Component
// ============================================================================

export function CommandPalette({ onNewObject, onVoiceRecord }: CommandPaletteProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Track recent commands
  const [recentCommandIds, setRecentCommandIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("silence_recent_commands");
    return stored ? JSON.parse(stored) : [];
  });

  // Define all commands
  const allCommands = useMemo<Command[]>(
    () => [
      {
        id: "new-object",
        label: "Nowy Obiekt",
        description: "Utwórz nowy obiekt do analizy",
        shortcut: ["⌘", "N"],
        icon: Icons.plus,
        category: "action",
        keywords: ["create", "add", "new", "nowy", "dodaj"],
        action: () => {
          onNewObject?.();
          router.push("/dashboard");
        },
      },
      {
        id: "voice-record",
        label: "Nagrywanie głosowe",
        description: "Rozpocznij nagrywanie głosowe",
        shortcut: ["⌘", "M"],
        icon: Icons.mic,
        category: "action",
        keywords: ["voice", "record", "mic", "głos", "nagrywanie"],
        action: () => {
          onVoiceRecord?.();
        },
      },
      {
        id: "dashboard",
        label: "Panel główny",
        description: "Przejdź do panelu głównego",
        shortcut: ["⌘", "D"],
        icon: Icons.dashboard,
        category: "navigation",
        keywords: ["home", "dashboard", "główny"],
        action: () => router.push("/dashboard"),
      },
      {
        id: "archive",
        label: "Archiwum",
        description: "Przeglądaj zapisane obiekty",
        shortcut: ["⌘", "A"],
        icon: Icons.archive,
        category: "navigation",
        keywords: ["archive", "history", "archiwum", "historia"],
        action: () => router.push("/archive"),
      },
      {
        id: "patterns",
        label: "Analiza wzorców",
        description: "Zobacz wykryte wzorce behawioralne",
        shortcut: ["⌘", "P"],
        icon: Icons.patterns,
        category: "navigation",
        keywords: ["patterns", "analysis", "wzorce", "analiza"],
        action: () => router.push("/patterns"),
      },
      {
        id: "settings",
        label: "Ustawienia",
        description: "Konfiguracja konta i preferencji",
        shortcut: ["⌘", ","],
        icon: Icons.settings,
        category: "navigation",
        keywords: ["settings", "config", "ustawienia", "konto"],
        action: () => router.push("/settings"),
      },
      {
        id: "help",
        label: "Centrum pomocy",
        description: "Dokumentacja i FAQ",
        shortcut: ["⌘", "?"],
        icon: Icons.help,
        category: "navigation",
        keywords: ["help", "faq", "docs", "pomoc"],
        action: () => window.open("/docs", "_blank"),
      },
    ],
    [router, onNewObject, onVoiceRecord]
  );

  // Build command list with recent items
  const commands = useMemo(() => {
    const recent = recentCommandIds
      .map((id) => allCommands.find((c) => c.id === id))
      .filter((c): c is Command => c !== undefined)
      .slice(0, 3)
      .map((c) => ({ ...c, category: "recent" as const }));

    const searched = searchCommands(allCommands, query);

    if (query) {
      return searched;
    }

    // Group by category
    const grouped: Command[] = [];
    if (recent.length > 0) {
      grouped.push(...recent);
    }
    grouped.push(...searched.filter((c) => !recentCommandIds.includes(c.id)));

    return grouped;
  }, [allCommands, query, recentCommandIds]);

  // Track command usage
  const trackCommand = useCallback(
    (commandId: string) => {
      const updated = [commandId, ...recentCommandIds.filter((id) => id !== commandId)].slice(0, 5);
      setRecentCommandIds(updated);
      localStorage.setItem("silence_recent_commands", JSON.stringify(updated));
    },
    [recentCommandIds]
  );

  // Execute command
  const executeCommand = useCallback(
    (command: Command) => {
      trackCommand(command.id);
      setIsOpen(false);
      setQuery("");
      command.action();
    },
    [trackCommand]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, commands.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (commands[selectedIndex]) {
            executeCommand(commands[selectedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setQuery("");
          break;
      }
    },
    [commands, selectedIndex, executeCommand]
  );

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  // Global keyboard shortcut (Cmd+K)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Group commands by category for rendering
  const groupedCommands = useMemo(() => {
    const groups: { category: string; commands: Command[] }[] = [];
    let currentCategory = "";
    let currentGroup: Command[] = [];

    commands.forEach((cmd) => {
      if (cmd.category !== currentCategory) {
        if (currentGroup.length > 0) {
          groups.push({ category: currentCategory, commands: currentGroup });
        }
        currentCategory = cmd.category;
        currentGroup = [cmd];
      } else {
        currentGroup.push(cmd);
      }
    });

    if (currentGroup.length > 0) {
      groups.push({ category: currentCategory, commands: currentGroup });
    }

    return groups;
  }, [commands]);

  const categoryLabels: Record<string, string> = {
    recent: "Ostatnie",
    action: "Akcje",
    navigation: "Nawigacja",
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => {
          setIsOpen(false);
          setQuery("");
        }}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-start justify-center pt-[15vh]">
        <div
          className={cn(
            "w-full max-w-lg mx-4",
            "bg-[var(--bg-elevated)]/95 backdrop-blur-xl",
            "border border-white/10 rounded-2xl",
            "shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]",
            "overflow-hidden",
            "animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-200"
          )}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
            <div className="text-[var(--text-muted)]">{Icons.search}</div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
              onKeyDown={handleKeyDown}
              placeholder="Wyszukaj polecenie..."
              className={cn(
                "flex-1 bg-transparent text-[var(--text-primary)]",
                "placeholder:text-[var(--text-muted)]",
                "outline-none text-sm"
              )}
            />
            <ShortcutKey keys={["ESC"]} />
          </div>

          {/* Command List */}
          <div ref={listRef} className="max-h-[60vh] overflow-y-auto py-2">
            {commands.length === 0 ? (
              <div className="px-4 py-8 text-center text-[var(--text-muted)] text-sm">
                Brak wyników dla &ldquo;{query}&rdquo;
              </div>
            ) : (
              groupedCommands.map((group, groupIndex) => {
                const startIndex = groupedCommands
                  .slice(0, groupIndex)
                  .reduce((acc, g) => acc + g.commands.length, 0);

                return (
                  <div key={group.category}>
                    {!query && <CategoryHeader title={categoryLabels[group.category] || group.category} />}
                    <div className="px-2">
                      {group.commands.map((command, cmdIndex) => {
                        const absoluteIndex = startIndex + cmdIndex;
                        return (
                          <CommandItem
                            key={command.id}
                            command={command}
                            isSelected={selectedIndex === absoluteIndex}
                            onSelect={() => executeCommand(command)}
                            onHover={() => setSelectedIndex(absoluteIndex)}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--border)] bg-[var(--bg-surface)]/50">
            <div className="flex items-center gap-4 text-[10px] text-[var(--text-muted)]">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded bg-[var(--bg-base)] border border-[var(--border)]">↑</kbd>
                <kbd className="px-1 py-0.5 rounded bg-[var(--bg-base)] border border-[var(--border)]">↓</kbd>
                <span className="ml-1">nawiguj</span>
              </span>
              <span className="flex items-center gap-1">
                {Icons.return}
                <span>wybierz</span>
              </span>
            </div>
            <div className="text-[10px] text-[var(--text-muted)]">
              <span className="text-[var(--primary)]">PatternLens</span> Command Palette
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;
