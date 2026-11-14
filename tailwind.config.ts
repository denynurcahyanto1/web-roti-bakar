import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0a0908',
        coal: '#0f0d0b',
        charcoal: '#141110',
        smoke: '#1b1714',
        cream: '#f5e6c8',
        'cream-dim': '#c9b899',
        cheese: '#e8a87c',
        gold: '#d9b478',
        ember: '#ff8a3d',
        crust: '#7a4a28',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        logo: ['var(--font-logo)', 'cursive'],
      },
      letterSpacing: {
        widest2: '0.32em',
      },
      fontSize: {
        '10xl': ['9.5rem', { lineHeight: '0.86', letterSpacing: '-0.045em' }],
        '11xl': ['12rem', { lineHeight: '0.84', letterSpacing: '-0.05em' }],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.75rem',
      },
      boxShadow: {
        glow: '0 0 80px -20px rgba(232, 168, 124, 0.45)',
        'glow-soft': '0 0 120px -30px rgba(232, 168, 124, 0.35)',
        card: '0 30px 80px -40px rgba(0, 0, 0, 0.9)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-quint': 'cubic-bezier(0.83, 0, 0.17, 1)',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translate3d(0,0,0)' },
          to: { transform: 'translate3d(-50%,0,0)' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.35', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.06)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 50%' },
          '100%': { backgroundPosition: '-200% 50%' },
        },
        spinSlow: {
          to: { transform: 'rotate(360deg)' },
        },
        scrollLine: {
          '0%': { transform: 'translateY(-110%)' },
          '60%, 100%': { transform: 'translateY(340%)' },
        },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        floaty: 'floaty 7s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 6s ease-in-out infinite',
        shimmer: 'shimmer 4s linear infinite',
        'spin-slow': 'spinSlow 22s linear infinite',
        'scroll-line': 'scrollLine 2.4s cubic-bezier(0.65, 0, 0.35, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
