import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'padawan-lime': '#d3fc72',
        'padawan-purple': '#5531cc',
        'padawan-black': '#000000',
        'padawan-dark': '#0a0a0a',
        'padawan-gray': '#1a1a1a',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      boxShadow: {
        'glow': '0 0 30px rgba(83, 49, 204, 0.15)',
        'glow-lg': '0 0 60px rgba(83, 49, 204, 0.2)',
      },
    },
  },
  plugins: [],
}

export default config