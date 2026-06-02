import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'sakura': '#FFB8C5',
        'sakura-deep': '#E8829A',
        'ink': '#1C1824',
        'ink-mid': '#2D2840',
        'parchment': '#F5F0E8',
        'parchment-warm': '#EDE5D4',
        'matcha': '#C8D96F',
        'indigo-sky': '#1a1040',
      },
      fontFamily: {
        'display': ['Georgia', 'Times New Roman', 'serif'],
        'body': ['system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-sky': 'linear-gradient(180deg, #0d0822 0%, #1a1040 30%, #2d1b69 60%, #7c3aed 100%)',
      },
    },
  },
  plugins: [],
}
export default config
