/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mk-yellow': '#FFD700',
        'mk-red': '#DC143C',
        'mk-blue': '#00BFFF',
        'mk-green': '#00FF41',
        'neon-yellow': '#FFFF00',
        'neon-red': '#FF073A',
        'neon-blue': '#00F0FF',
        'neon-purple': '#BF00FF',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-neon': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
      boxShadow: {
        'neon': '0 0 5px theme("colors.mk-yellow"), 0 0 20px theme("colors.mk-yellow")',
        'neon-red': '0 0 5px theme("colors.neon-red"), 0 0 20px theme("colors.neon-red")',
        'neon-blue': '0 0 5px theme("colors.neon-blue"), 0 0 20px theme("colors.neon-blue")',
        'neon-purple': '0 0 5px theme("colors.neon-purple"), 0 0 20px theme("colors.neon-purple")',
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 5px currentColor, 0 0 20px currentColor',
          },
          '50%': {
            opacity: '.8',
            boxShadow: '0 0 10px currentColor, 0 0 40px currentColor',
          },
        },
        'slide-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'slide-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [],
}
