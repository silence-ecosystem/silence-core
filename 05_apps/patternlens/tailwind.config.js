const PHI = 1.618;
const config = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            spacing: {
                'golden-1': '1rem',
                'golden-2': `${PHI.toFixed(3)}rem`,
                'golden-3': `${(PHI ** 2).toFixed(3)}rem`,
                'golden-4': `${(PHI ** 3).toFixed(3)}rem`,
            },
            fontSize: {
                'golden-caption': ['0.809rem', { lineHeight: '1.2' }],
                'golden-body': ['1rem', { lineHeight: '1.6' }],
                'golden-h2': ['1.272rem', { lineHeight: '1.4' }],
                'golden-h1': [`${PHI.toFixed(3)}rem`, { lineHeight: '1.2' }],
            },
            colors: {
                surface: {
                    DEFAULT: '#020617',
                    deep: '#0a0a0f',
                },
            },
            keyframes: {
                breathe: {
                    '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
                    '50%': { transform: 'scale(1.05)', opacity: '0.85' },
                },
            },
            animation: {
                breathe: 'breathe 5s ease-in-out infinite',
            },
        },
    },
    plugins: [],
};
export default config;
