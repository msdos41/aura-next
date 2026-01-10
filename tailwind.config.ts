import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      },
      colors: {
        primary: {
          0: '#000000',
          10: '#21005d',
          20: '#381e72',
          30: '#4f378b',
          40: '#6750a4',
          50: '#7d5260',
          60: '#9c6b5e',
          70: '#b78b91',
          80: '#d0bcff',
          90: '#eaddff',
          95: '#f5eff7',
          99: '#fcf8ff',
          100: '#ffffff',
        },
        secondary: {
          0: '#000000',
          10: '#1d192b',
          20: '#322f37',
          30: '#49454f',
          40: '#625b71',
          50: '#7a7289',
          60: '#938f99',
          70: '#ada9b4',
          80: '#c8c4cc',
          90: '#e4e1e9',
          95: '#f3eff7',
          99: '#fbfcff',
          100: '#ffffff',
        },
        surface: {
          0: '#000000',
          10: '#1c1b1f',
          20: '#313033',
          30: '#484649',
          40: '#605d62',
          50: '#79747e',
          60: '#938f99',
          70: '#ada9b4',
          80: '#c8c4cc',
          90: '#e6e1e5',
          95: '#f4eff4',
          99: '#fffbff',
          100: '#ffffff',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.7)',
          dark: 'rgba(30, 30, 30, 0.7)',
        },
      },
      boxShadow: {
        'm3-1': '0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 3px 1px rgba(0, 0, 0, 0.15)',
        'm3-2': '0 1px 2px rgba(0, 0, 0, 0.3), 0 2px 6px 2px rgba(0, 0, 0, 0.15)',
        'm3-3': '0 4px 8px 3px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.3)',
        'm3-4': '0 6px 10px 4px rgba(0, 0, 0, 0.15), 0 2px 3px rgba(0, 0, 0, 0.3)',
        'm3-5': '0 8px 12px 6px rgba(0, 0, 0, 0.15), 0 4px 4px rgba(0, 0, 0, 0.3)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

export default config
