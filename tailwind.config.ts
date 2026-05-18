import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0a',
        'bg-card': '#111111',
        cream: '#F5F0E8',
        'cream-dim': '#A89F8C',
        green: '#4A7C59',
        'green-light': '#7DB892',
        'border-subtle': '#1E1E1E',
      },
      fontFamily: {
        anybody: ['var(--font-anybody)', 'sans-serif'],
        cabinet: ['"Cabinet Grotesk"', 'sans-serif'],
      },
      letterSpacing: {
        tight: '-0.02em',
        tighter: '-0.03em',
        tightest: '-0.04em',
      },
    },
  },
  plugins: [],
}

export default config
