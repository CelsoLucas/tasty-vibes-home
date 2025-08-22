/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#f97316',
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#f97316',
          600: '#ea580c',
          foreground: '#ffffff'
        },
        background: '#ffffff',
        foreground: '#0f172a',
        card: {
          DEFAULT: '#ffffff',
          foreground: '#0f172a'
        },
        muted: {
          DEFAULT: '#f1f5f9',
          foreground: '#64748b'
        },
        accent: {
          DEFAULT: '#f1f5f9',
          foreground: '#0f172a'
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff'
        },
        border: '#e2e8f0',
        input: '#e2e8f0',
        ring: '#f97316'
      }
    },
  },
  plugins: [],
}