/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep circuit-board night, matching the recolored build-log background.
        canvas: '#080810',
        card: '#0d1122',
        ink: '#EDECFF',
        subtle: '#C9C7EE',
        muted: '#9B98C8',
        faint: '#6A6796',
        line: '#20233f',
        // Multi-color pulse palette (violet / coral / teal / pink / amber).
        accent: {
          indigo: '#818cf8',
          violet: '#a78bfa',
          coral: '#ff8a6b',
          teal: '#46e0d0',
          cyan: '#22d3ee',
          pink: '#f472b6',
          amber: '#fbbf24',
          green: '#34d399',
          blue: '#60a5fa',
        },
      },
      fontFamily: {
        display: ['Sora', 'Space Grotesk', 'system-ui', 'sans-serif'],
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 30px -8px rgba(129,140,248,0.7)',
        card: '0 10px 40px -20px rgba(0,0,0,0.8)',
      },
    },
  },
  plugins: [],
}
