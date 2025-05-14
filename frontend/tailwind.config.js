/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#000000',
          hover: '#333333',
        },
        secondary: {
          DEFAULT: '#ffffff',
          hover: '#f0f0f0',
        },
        accent: {
          DEFAULT: '#888888',
          light: '#cccccc',
          dark: '#444444',
        },
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#000000', // Changed to black
          600: '#333333', // Changed to dark gray
          700: '#444444', // Changed to medium dark gray
          800: '#666666', // Changed to medium gray
          900: '#888888', // Changed to light gray
        },
      },
      spacing: {
        '72': '18rem',
        '80': '20rem',
        '96': '24rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      transitionDuration: {
        '2000': '2000ms',
      },
      boxShadow: {
        'outline-indigo': '0 0 0 3px rgba(99, 102, 241, 0.45)',
      },
      screens: {
        'xs': '475px',
      },
      aspectRatio: {
        'square': '1',
        '16/9': '16 / 9',
        '4/3': '4 / 3',
        '21/9': '21 / 9',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      gridTemplateRows: {
        '12': 'repeat(12, minmax(0, 1fr))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
  ],
}
