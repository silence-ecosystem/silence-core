import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ============================================
      // COLORS - PatternLens Design System v3.0
      // ============================================
      colors: {
        // Primary gradient palette
        primary: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4', // Cyan primary
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        // Accent purple
        accent: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7', // Purple accent
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        // Warning/Crisis pink
        crisis: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899', // Pink warning
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
          950: '#500724',
        },
        // Glass/Surface colors
        glass: {
          light: 'rgba(255, 255, 255, 0.05)',
          DEFAULT: 'rgba(255, 255, 255, 0.08)',
          medium: 'rgba(255, 255, 255, 0.12)',
          heavy: 'rgba(255, 255, 255, 0.18)',
        },
        // Risk levels
        risk: {
          low: '#22c55e',
          medium: '#eab308',
          high: '#f97316',
          critical: '#ef4444',
        },
      },

      // ============================================
      // FONTS
      // ============================================
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      // ============================================
      // TYPOGRAPHY SCALE
      // ============================================
      fontSize: {
        'display-2xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },

      // ============================================
      // SPACING
      // ============================================
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },

      // ============================================
      // BORDER RADIUS
      // ============================================
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      // ============================================
      // BACKDROP BLUR
      // ============================================
      backdropBlur: {
        xs: '2px',
        '2xl': '40px',
        '3xl': '64px',
      },

      // ============================================
      // BOX SHADOW - Glow Effects
      // ============================================
      boxShadow: {
        'glow-sm': '0 0 15px -3px var(--tw-shadow-color)',
        'glow': '0 0 30px -5px var(--tw-shadow-color)',
        'glow-lg': '0 0 50px -10px var(--tw-shadow-color)',
        'glow-xl': '0 0 80px -15px var(--tw-shadow-color)',
        'inner-glow': 'inset 0 0 20px -5px var(--tw-shadow-color)',
        // Glass shadows
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.36)',
        'glass-lg': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      },

      // ============================================
      // ANIMATIONS
      // ============================================
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'slide-left': 'slide-left 0.3s ease-out',
        'slide-right': 'slide-right 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'recording-ring': 'recording-ring 1.5s ease-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 20px -5px var(--tw-shadow-color)',
            opacity: '1',
          },
          '50%': { 
            boxShadow: '0 0 40px -5px var(--tw-shadow-color)',
            opacity: '0.8',
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-left': {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-right': {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'recording-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },

      // ============================================
      // TRANSITIONS
      // ============================================
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },

      // ============================================
      // Z-INDEX SCALE
      // ============================================
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },

  // ============================================
  // PLUGINS
  // ============================================
  plugins: [
    // Custom utilities
    plugin(function({ addUtilities, addComponents, theme }) {
      // Glass morphism utilities
      addUtilities({
        '.glass': {
          background: 'rgba(17, 24, 39, 0.6)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.glass-light': {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        },
        '.glass-heavy': {
          background: 'rgba(17, 24, 39, 0.8)',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        },
        // Gradient text
        '.gradient-text': {
          background: 'linear-gradient(135deg, #06b6d4, #a855f7, #ec4899)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          backgroundClip: 'text',
        },
        '.gradient-text-subtle': {
          background: 'linear-gradient(135deg, #67e8f9, #c084fc)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          backgroundClip: 'text',
        },
        // Shimmer effect
        '.shimmer': {
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          backgroundSize: '200% 100%',
        },
        // Hide scrollbar
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        // Focus ring
        '.focus-ring': {
          outline: 'none',
          '&:focus-visible': {
            boxShadow: '0 0 0 2px rgba(6, 182, 212, 0.5)',
          },
        },
      });

      // Component classes
      addComponents({
        // Button base
        '.btn': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '500',
          borderRadius: theme('borderRadius.xl'),
          transition: 'all 200ms',
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
          },
        },
        '.btn-primary': {
          background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
          color: 'white',
          '&:hover:not(:disabled)': {
            background: 'linear-gradient(135deg, #22d3ee, #06b6d4)',
            transform: 'translateY(-1px)',
          },
        },
        '.btn-secondary': {
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'white',
          '&:hover:not(:disabled)': {
            background: 'rgba(255, 255, 255, 0.12)',
          },
        },
        '.btn-ghost': {
          background: 'transparent',
          color: theme('colors.gray.400'),
          '&:hover:not(:disabled)': {
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'white',
          },
        },
        // Input base
        '.input': {
          width: '100%',
          padding: `${theme('spacing.3')} ${theme('spacing.4')}`,
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: theme('borderRadius.xl'),
          color: 'white',
          transition: 'all 200ms',
          '&::placeholder': {
            color: theme('colors.gray.500'),
          },
          '&:focus': {
            outline: 'none',
            borderColor: theme('colors.primary.500'),
            boxShadow: '0 0 0 3px rgba(6, 182, 212, 0.2)',
          },
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
          },
        },
        // Card base
        '.card': {
          background: 'rgba(17, 24, 39, 0.6)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: theme('borderRadius.2xl'),
          padding: theme('spacing.6'),
        },
      });
    }),
  ],
};

export default config;
