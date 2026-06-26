'use client';

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  type KeyboardEvent as ReactKeyboardEvent,
  type JSX,
} from 'react';
import { createPortal } from 'react-dom';

// ============================================
// TYPES
// ============================================

type CommandCategory = 'navigation' | 'creation' | 'analysis' | 'settings' | 'help';

interface Command {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly shortcut: string | null;
  readonly category: CommandCategory;
  readonly icon: string;
  readonly action: () => void | Promise<void>;
  readonly isAvailable?: () => boolean;
}

interface CommandPaletteProps {
  commands: readonly Command[];
  onClose?: () => void;
}

// ============================================
// DEFAULT COMMANDS
// ============================================

export const createDefaultCommands = (
  navigate: (path: string) => void,
  actions: {
    newObject?: () => void;
    startRecording?: () => void;
    toggleTheme?: () => void;
    openSettings?: () => void;
    exportData?: () => void;
    showHelp?: () => void;
  }
): Command[] => [
  // Navigation
  {
    id: 'nav-dashboard',
    name: 'Dashboard',
    description: 'Przejdź do głównego panelu',
    shortcut: 'G D',
    category: 'navigation',
    icon: '🏠',
    action: () => navigate('/dashboard'),
  },
  {
    id: 'nav-archive',
    name: 'Archiwum',
    description: 'Przeglądaj zapisane obiekty',
    shortcut: 'G A',
    category: 'navigation',
    icon: '📁',
    action: () => navigate('/archive'),
  },
  {
    id: 'nav-patterns',
    name: 'Wzorce',
    description: 'Zobacz wykryte wzorce',
    shortcut: 'G P',
    category: 'navigation',
    icon: '🔮',
    action: () => navigate('/patterns'),
  },
  {
    id: 'nav-settings',
    name: 'Ustawienia',
    description: 'Konfiguracja aplikacji',
    shortcut: 'G S',
    category: 'navigation',
    icon: '⚙️',
    action: () => navigate('/settings'),
  },
  // Creation
  {
    id: 'create-object',
    name: 'Nowy obiekt',
    description: 'Utwórz nowy obiekt do analizy',
    shortcut: 'N',
    category: 'creation',
    icon: '✨',
    action: () => actions.newObject?.(),
  },
  {
    id: 'start-recording',
    name: 'Nagrywanie głosowe',
    description: 'Rozpocznij nagrywanie głosowe',
    shortcut: 'R',
    category: 'creation',
    icon: '🎤',
    action: () => actions.startRecording?.(),
  },
  // Settings
  {
    id: 'toggle-theme',
    name: 'Przełącz motyw',
    description: 'Zmień między jasnym a ciemnym',
    shortcut: 'T',
    category: 'settings',
    icon: '🌓',
    action: () => actions.toggleTheme?.(),
  },
  {
    id: 'export-data',
    name: 'Eksportuj dane',
    description: 'Pobierz wszystkie swoje dane',
    shortcut: null,
    category: 'settings',
    icon: '📤',
    action: () => actions.exportData?.(),
  },
  // Help
  {
    id: 'show-help',
    name: 'Pomoc',
    description: 'Pokaż skróty klawiszowe',
    shortcut: '?',
    category: 'help',
    icon: '❓',
    action: () => actions.showHelp?.(),
  },
  {
    id: 'crisis-resources',
    name: 'Zasoby kryzysowe',
    description: 'Numery pomocowe i wsparcie',
    shortcut: null,
    category: 'help',
    icon: '🆘',
    action: () => navigate('/crisis'),
  },
];

// ============================================
// CATEGORY LABELS
// ============================================

const CATEGORY_LABELS: Record<CommandCategory, string> = {
  navigation: 'Nawigacja',
  creation: 'Tworzenie',
  analysis: 'Analiza',
  settings: 'Ustawienia',
  help: 'Pomoc',
};

// ============================================
// HOOK: useCommandPalette
// ============================================

interface UseCommandPaletteReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export function useCommandPalette(): UseCommandPaletteReturn {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  // Global keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent): void => {
      // Ctrl+K or Ctrl+P or Cmd+K or Cmd+P
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K' || e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }

      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        close();
      }
    };

    // Use capture phase to intercept before other handlers
    document.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => document.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [isOpen, toggle, close]);

  return { isOpen, open, close, toggle };
}

// ============================================
// COMPONENT: CommandPalette
// ============================================

export function CommandPalette({ commands, onClose }: CommandPaletteProps): JSX.Element | null {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Client-side only rendering for portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Filter commands based on query
  const filteredCommands = useMemo(() => {
    const available = commands.filter(cmd => 
      cmd.isAvailable === undefined || cmd.isAvailable()
    );

    if (query.trim() === '') return available;

    const normalizedQuery = query.toLowerCase().trim();
    
    return available.filter(cmd => {
      const searchText = `${cmd.name} ${cmd.description}`.toLowerCase();
      return searchText.includes(normalizedQuery);
    });
  }, [commands, query]);

  // Group by category
  const groupedCommands = useMemo(() => {
    const groups = new Map<CommandCategory, Command[]>();
    
    for (const cmd of filteredCommands) {
      const existing = groups.get(cmd.category) ?? [];
      groups.set(cmd.category, [...existing, cmd]);
    }
    
    return groups;
  }, [filteredCommands]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected item into view
  useEffect(() => {
    const selected = listRef.current?.querySelector('[data-selected="true"]');
    selected?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  // Execute command
  const executeCommand = useCallback((command: Command) => {
    void Promise.resolve(command.action()).catch(() => {
      // Ignore action errors
    });
    setQuery('');
    onClose?.();
  }, [onClose]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: ReactKeyboardEvent<HTMLInputElement>) => {
    const totalCommands = filteredCommands.length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % totalCommands);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + totalCommands) % totalCommands);
        break;
      case 'Enter':
        e.preventDefault();
        const selected = filteredCommands[selectedIndex];
        if (selected !== undefined) {
          executeCommand(selected);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose?.();
        break;
    }
  }, [filteredCommands, selectedIndex, executeCommand, onClose]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  }, [onClose]);

  if (!mounted) return null;

  const content = (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Paleta poleceń"
    >
      <div className="w-full max-w-xl bg-gray-900/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-lg"
            placeholder="Wpisz polecenie..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Szukaj poleceń"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="px-2 py-1 text-xs text-gray-500 bg-gray-800 rounded border border-gray-700">
            ESC
          </kbd>
        </div>

        {/* Commands List */}
        <div
          ref={listRef}
          className="max-h-[50vh] overflow-y-auto p-2"
          role="listbox"
          aria-label="Dostępne polecenia"
        >
          {filteredCommands.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              Brak wyników dla "{query}"
            </div>
          ) : (
            Array.from(groupedCommands.entries()).map(([category, cmds]) => (
              <div key={category} className="mb-2">
                <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {CATEGORY_LABELS[category]}
                </div>
                {cmds.map((cmd) => {
                  const globalIndex = filteredCommands.indexOf(cmd);
                  const isSelected = globalIndex === selectedIndex;
                  
                  return (
                    <button
                      key={cmd.id}
                      data-selected={isSelected}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left
                        transition-colors cursor-pointer
                        ${isSelected 
                          ? 'bg-cyan-500/20 text-white' 
                          : 'text-gray-300 hover:bg-white/5'}
                      `}
                      onClick={() => executeCommand(cmd)}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <span className="text-xl" aria-hidden="true">
                        {cmd.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{cmd.name}</div>
                        <div className="text-sm text-gray-500 truncate">
                          {cmd.description}
                        </div>
                      </div>
                      {cmd.shortcut !== null && (
                        <kbd className="px-2 py-1 text-xs text-gray-400 bg-gray-800/50 rounded border border-gray-700">
                          {cmd.shortcut}
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-white/10 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-gray-800 rounded">↑↓</kbd>
              nawiguj
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-gray-800 rounded">Enter</kbd>
              wybierz
            </span>
          </div>
          <span>PatternLens</span>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}

export default CommandPalette;
