import type { Config } from 'tailwindcss';

const PHI = 1.618033988749895;

// Fibonacci sequence base-16px → spacing tokens
const fib = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];
const fibSpacing = Object.fromEntries(
  fib.map((n) => [`fib-${n}`, `${n}px`])
);

// Golden Second cascade → duration tokens
const goldenCascade = {
  instant: '62ms',
  micro:   '100ms',
  fast:    '162ms',
  normal:  '262ms',
  soft:    '424ms',
  slow:    '618ms',
  calm:    '1000ms',
  golden:  '1618ms',
  breath:  '2618ms',
};

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],

  theme: {
    extend: {
      // — Soft Noir Color System —
      colors: {
        bg:      'hsl(220 8% 8%)',           // #111318
        surface: {
          DEFAULT: 'hsl(220 8% 10%)',
          raised:  'hsl(220 8% 13%)',
        },
        text: {
          DEFAULT:   'hsl(35 15% 88%)',      // #E8E4DF
          secondary: 'hsl(35 10% 65%)',
          muted:     'hsl(35 8% 45%)',
        },
        border: 'rgba(255,255,255,0.06)',
        accent: {
          DEFAULT: 'hsl(234 70% 72%)',       // #7B8CFF
          gold:    'hsl(43 60% 52%)',        // #D4AF37
          teal:    'hsl(172 48% 48%)',       // #3DBFAE
        },
      },

      // — Fibonacci Spacing —
      spacing: {
        ...fibSpacing,
        'phi-1': '21px',
        'phi-2': '34px',
        'phi-3': '55px',
        'phi-4': '89px',
        'phi-5': '144px',
      },

      // — GOLDENSECOND Duration —
      transitionDuration: goldenCascade,
      animationDuration:  goldenCascade,

      // — Phi Easing —
      transitionTimingFunction: {
        phi:  'cubic-bezier(0.16, 1, 0.3, 1)',
        soft: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },

      // — Typography —
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },

      // — Golden Ratio Layout —
      width: {
        major: '61.8%',
        minor: '38.2%',
      },
      maxWidth: {
        mobile: '480px',
        tablet: '768px',
      },

      // — CSS Variables bridge (for @apply usage) —
      backgroundColor: {
        bg: 'var(--color-bg)',
      },
    },
  },

  plugins: [],
};

export default config;
