/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        volt: {
          DEFAULT: '#CCFF00',
          hover: '#B5E600',
          muted: 'rgba(204, 255, 0, 0.1)',
        },
        slate: {
          950: '#09090B',
          900: '#18181B',
          800: '#27272A',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
