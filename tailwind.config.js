/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff2d55',
        'primary-dark': '#e60026',
        'primary-glow': 'rgba(255, 45, 85, 0.5)',
        dark: '#06060a',
        darker: '#030305',
        surface: 'rgba(255, 255, 255, 0.04)',
        border: 'rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      }
    },
  },
  plugins: [],
}
