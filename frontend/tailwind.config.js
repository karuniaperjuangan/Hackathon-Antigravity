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
          DEFAULT: '#0066FF',
          hover: '#0052CC',
          muted: 'rgba(0, 102, 255, 0.1)',
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
