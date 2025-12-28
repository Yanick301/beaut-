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
        'beige-light': '#FAF7F2',
        'beige': '#F5F1EB',
        'nude': '#E8DDD4',
        'rose-powder': '#F4E6E0',
        'rose-soft': '#E8C5B8',
        'gold': '#D4AF37',
        'gold-light': '#E6D5A8',
        'white-cream': '#FFFEF9',
        'brown-soft': '#8B7355',
        'brown-dark': '#5A4A3A',
      },
      fontFamily: {
        'elegant': ['var(--font-playfair)', 'serif'],
        'sans': ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config

