import type { Config } from "tailwindcss";

/**
 * PATTERNLENS Design System v3.0
 * Tailwind Configuration
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          void: "#09090b",
          base: "#0a0a0b",
          surface: "#18181b",
          elevated: "#27272a",
          hover: "#3f3f46",
          active: "#52525b",
        },
        lens: {
          a: "#3b82f6",
          "a-hover": "#2563eb",
          "a-muted": "rgba(59, 130, 246, 0.1)",
          b: "#a855f7",
          "b-hover": "#9333ea",
          "b-muted": "rgba(168, 85, 247, 0.1)",
        },
        crisis: {
          DEFAULT: "#dc2626",
          hover: "#b91c1c",
          muted: "rgba(220, 38, 38, 0.15)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      fontSize: {
        "display": ["clamp(2.5rem, 5vw, 3.75rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "h1": ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "h2": ["clamp(1.5rem, 3vw, 1.875rem)", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        "h3": ["1.25rem", { lineHeight: "1.4" }],
        "h4": ["1.125rem", { lineHeight: "1.4" }],
        "body": ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5" }],
        "caption": ["0.75rem", { lineHeight: "1.5" }],
        "label": ["0.6875rem", { lineHeight: "1.5", letterSpacing: "0.05em" }],
      },
      spacing: {
        "touch": "48px",
        "sidebar": "256px",
        "header": "64px",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-top": "env(safe-area-inset-top)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
      },
      borderRadius: {
        DEFAULT: "8px",
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      boxShadow: {
        "glow-blue": "0 0 20px rgba(59, 130, 246, 0.3)",
        "glow-purple": "0 0 20px rgba(168, 85, 247, 0.3)",
        "glow-red": "0 0 20px rgba(239, 68, 68, 0.3)",
      },
      animation: {
        "pl-fade-in": "pl-fade-in 200ms ease-out",
        "pl-slide-up": "pl-slide-up 300ms ease-out",
        "pl-scale-in": "pl-scale-in 200ms ease-out",
        "pl-pulse-glow": "pl-pulse-glow 2s infinite",
        "pl-recording": "pl-recording-pulse 1.5s infinite",
      },
      keyframes: {
        "pl-fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "pl-slide-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pl-scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "pl-pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(59, 130, 246, 0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(59, 130, 246, 0)" },
        },
        "pl-recording-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.05)" },
        },
      },
      transitionDuration: {
        "fast": "150ms",
        "normal": "200ms",
        "slow": "300ms",
      },
      transitionTimingFunction: {
        "ease-out-custom": "cubic-bezier(0, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
