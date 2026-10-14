/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js}"
  ],
  theme: {
    extend: {
      colors: {
        redflix: {
          DEFAULT: '#E50914',
          crimson: '#FF1E27',
          dark: '#B81D24',
          deep: '#831010',
          glow: 'rgba(229, 9, 20, 0.45)'
        },
        ink: {
          900: '#070709',
          850: '#0a0a0c',
          800: '#111114',
          700: '#18181c',
          600: '#23232a',
          500: '#32323c',
        },
        bone: {
          50: '#ffffff',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
        },
        surface: {
          DEFAULT: '#0a0a0c',
          50: '#0e0e11',
          100: '#141417',
          200: '#1b1b20',
          300: '#26262e',
          400: '#34343f',
        },
        accent: {
          DEFAULT: '#E50914',
          hover: '#FF1E27',
          glow: 'rgba(229, 9, 20, 0.45)',
          dim: '#B81D24',
        }
      },
      fontFamily: {
        sans: ['"Inter"', '"General Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        ui: ['"Inter"', '"General Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Bebas Neue"', '"General Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(229, 9, 20, 0.3)',
        'glow-md': '0 0 25px rgba(229, 9, 20, 0.45)',
        'glow-lg': '0 0 45px rgba(229, 9, 20, 0.6)',
        'card': '0 10px 30px -10px rgba(0, 0, 0, 0.8)',
        'card-hover': '0 20px 40px -15px rgba(0, 0, 0, 0.95), 0 0 25px rgba(229, 9, 20, 0.25)',
      },
      backdropBlur: {
        xs: '2px',
        glass: '16px',
      }
    },
  },
  plugins: [],
}
