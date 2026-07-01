import { RiskLevel } from "./app";

// 
// SILENCE.OBJECTS  Design System Tokens v2.1
// 

//  UTILITY: Class Name Merger 
export const cn = (...classes: (string | false | undefined | null)[]) =>
  classes.filter(Boolean).join(" ");

//  COLOR TOKENS 
export const colors = {
  bg: {
    void: "#0D0D0F",
    base: "#0f1419",
    surface: "#161b22",
    elevated: "#1a1f28",
    hover: "#21262d",
    active: "#30363d",
  },
  text: {
    primary: "#f5f7fa",
    secondary: "#8b949e",
    muted: "#6e7681",
    disabled: "#4a4845",
  },
  primary: {
    DEFAULT: "#4a90e2",
    hover: "#3a7bc8",
    active: "#2d6cb5",
    muted: "rgba(74, 144, 226, 0.15)",
  },
  status: {
    success: "#4ade80",
    successMuted: "rgba(74, 222, 128, 0.15)",
    warning: "#fbbf24",
    warningMuted: "rgba(251, 191, 36, 0.15)",
    danger: "#f87171",
    dangerMuted: "rgba(248, 113, 113, 0.15)",
    info: "#60a5fa",
    infoMuted: "rgba(96, 165, 250, 0.15)",
  },
  border: {
    DEFAULT: "#2d3748",
    hover: "#3d4758",
  },
} as const;

//  LAYOUT TOKENS 
export const layout = {
  shell: "min-h-screen bg-[var(--bg-base)] flex flex-col",
  withSidebar: "flex flex-1",
  sidebar: "w-60 bg-[var(--bg-base)] border-r border-[var(--border)] flex flex-col shrink-0",
  main: "flex-1 p-8 max-w-[960px] overflow-y-auto",
  header: "h-14 bg-[var(--bg-elevated)] border-b border-[var(--border)] px-6 flex items-center justify-between sticky top-0 z-50",
  footer: "border-t border-[var(--border)] bg-[var(--bg-base)] py-4 px-6 text-center",
  container: "max-w-4xl mx-auto px-6",
  page: "min-h-screen bg-[var(--bg-base)]",
} as const;

//  TYPOGRAPHY TOKENS 
export const text = {
  h1: "text-[32px] font-semibold tracking-[-0.5px] text-[var(--text-primary)] leading-tight",
  h2: "text-[24px] font-semibold tracking-[-0.3px] text-[var(--text-primary)] leading-tight",
  h3: "text-[18px] font-semibold tracking-[-0.2px] text-[var(--text-primary)]",
  h4: "text-[16px] font-semibold text-[var(--text-primary)]",
  body: "text-sm text-[var(--text-primary)] leading-relaxed",
  secondary: "text-sm text-[var(--text-secondary)]",
  muted: "text-xs text-[var(--text-muted)]",
  label: "text-[11px] font-semibold uppercase tracking-[0.5px] text-[var(--text-muted)]",
} as const;

//  BUTTON TOKENS 
export const button = {
  base: "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-[var(--duration-normal)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] disabled:opacity-50 disabled:cursor-not-allowed",
  primary: "inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] active:bg-[var(--primary-active)] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
  secondary: "inline-flex items-center justify-center gap-2 px-4 py-2 bg-transparent hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)] hover:border-[var(--border-hover)] rounded-md transition-colors",
  ghost: "inline-flex items-center justify-center gap-2 px-4 py-2 hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-md transition-colors",
  danger: "inline-flex items-center justify-center gap-2 px-4 py-2 bg-transparent hover:bg-[var(--danger-muted)] text-[var(--danger)] border border-[rgba(248,113,113,0.3)] rounded-md transition-colors",
  icon: "inline-flex items-center justify-center w-10 h-10 hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg transition-colors",
  // Sizes
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
} as const;

//  CARD TOKENS 
export const card = {
  base: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg p-5",
  interactive: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg p-5 cursor-pointer transition-all hover:border-[rgba(74,144,226,0.4)] hover:shadow-[0_0_0_1px_rgba(74,144,226,0.15)]",
  stat: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg p-5",
  input: "bg-[rgba(74,144,226,0.08)] border border-[rgba(74,144,226,0.2)] rounded-lg p-6",
  elevated: "bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg p-5 shadow-[var(--shadow-md)]",
} as const;

//  INPUT TOKENS 
export const input = {
  base: "w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-colors",
  textarea: "w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-colors resize-none",
  error: "w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--danger)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:ring-1 focus:ring-[var(--danger)] outline-none",
  disabled: "w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[var(--text-muted)] cursor-not-allowed opacity-50",
} as const;

//  BADGE TOKENS 
export const badge = {
  base: "inline-flex items-center px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.3px] rounded",
  // Risk levels
  none: "bg-[rgba(107,114,128,0.2)] text-[#9ca3af]",
  low: "bg-[rgba(74,222,128,0.15)] text-[#4ade80]",
  medium: "bg-[rgba(251,191,36,0.15)] text-[#fbbf24]",
  high: "bg-[rgba(248,113,113,0.15)] text-[#f87171]",
  // Other variants
  primary: "bg-[var(--primary-muted)] text-[var(--primary)]",
  success: "bg-[var(--success-muted)] text-[var(--success)]",
  warning: "bg-[var(--warning-muted)] text-[var(--warning)]",
  danger: "bg-[var(--danger-muted)] text-[var(--danger)]",
  info: "bg-[var(--info-muted)] text-[var(--info)]",
  lens: "bg-[var(--bg-base)] text-[var(--text-secondary)] border border-[var(--border)] px-2.5 py-1 text-xs",
  tier: "px-2.5 py-1 text-xs font-medium rounded border",
  tierFree: "bg-[var(--primary-muted)] text-[var(--primary)] border-[rgba(74,144,226,0.3)]",
  tierPro: "bg-[var(--success-muted)] text-[var(--success)] border-[rgba(74,222,128,0.3)]",
} as const;

//  ALERT TOKENS 
export const alert = {
  base: "p-4 rounded-lg border flex items-start gap-3",
  info: "bg-[var(--info-muted)] border-[var(--info)] text-[var(--info)]",
  success: "bg-[var(--success-muted)] border-[var(--success)] text-[var(--success)]",
  warning: "bg-[var(--warning-muted)] border-[var(--warning)] text-[var(--warning)]",
  danger: "bg-[var(--danger-muted)] border-[var(--danger)] text-[var(--danger)]",
} as const;

//  NAVIGATION TOKENS 
export const nav = {
  item: "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left",
  itemActive: "bg-[rgba(74,144,226,0.1)] border border-[rgba(74,144,226,0.2)] text-[var(--text-primary)]",
  itemInactive: "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] border border-transparent",
} as const;

//  MODAL TOKENS 
export const modal = {
  overlay: "fixed inset-0 bg-black/80 flex items-center justify-center z-[1000]",
  container: "bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl shadow-[var(--shadow-xl)] max-w-lg w-full mx-4 overflow-hidden",
  header: "p-6 border-b border-[var(--border)]",
  body: "p-6",
  footer: "p-4 border-t border-[var(--border)] bg-[var(--bg-surface)] flex justify-end gap-3",
} as const;

//  TABLE TOKENS 
export const table = {
  container: "w-full overflow-x-auto",
  table: "w-full border-collapse",
  header: "bg-[var(--bg-surface)] border-b border-[var(--border)]",
  headerCell: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]",
  row: "border-b border-[var(--border)] hover:bg-[var(--bg-hover)] transition-colors",
  cell: "px-4 py-4 text-sm text-[var(--text-primary)]",
} as const;

//  HELPER FUNCTIONS 
export const getRiskBadgeClass = (level: RiskLevel): string => {
  const map: Record<RiskLevel, string> = {
    NONE: badge.none,
    LOW: badge.low,
    MEDIUM: badge.medium,
    HIGH: badge.high,
  };
  return `${badge.base} ${map[level]}`;
};

export const getConfidenceBars = (value: number, total = 10) => {
  const filled = Math.round((value / 100) * total);
  return { filled, empty: total - filled };
};

//  ICON PATHS (for consistent icons) 
export const icons = {
  dashboard: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  archive: "M21 8v13H3V8M1 3h22v5H1zM10 12h4",
  settings: "M12 15a3 3 0 100-6 3 3 0 000 6z",
  help: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z",
  pricing: "M2 5h20v14H2zM2 10h20",
  plus: "M12 5v14M5 12h14",
  chevronDown: "M6 9l6 6 6-6",
  chevronRight: "M9 18l6-6-6-6",
  phone: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z",
  warning: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z",
  info: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 16v-4M12 8h.01",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18M6 6l12 12",
  arrowRight: "M5 12h14M12 5l7 7-7 7",
  arrowLeft: "M19 12H5M12 19l-7-7 7-7",
  trash: "M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z",
} as const;
