/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0a192f',
          800: '#0f2744',
          700: '#15325b',
          600: '#1c4273',
          500: '#23538c',
        },
        bank: {
          blue: '#1d4ed8',
          lightblue: '#2563eb',
          accent: '#3b82f6',
          dark: '#0f172a',
          card: '#ffffff',
          bg: '#f8fafc',
          border: '#e2e8f0',
        }
      },
    },
  },
  plugins: [],
}
