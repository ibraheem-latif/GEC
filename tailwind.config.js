/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        spotlight: {
          '0%': { opacity: '0', transform: 'translate(-72%, -62%) scale(0.5)' },
          '100%': { opacity: '1', transform: 'translate(-50%, -40%) scale(1)' },
        },
      },
      animation: {
        spotlight: 'spotlight 2s ease 0.75s 1 forwards',
      },
      colors: {
        gold: {
          DEFAULT: '#C4A55A',
          bright: '#D4B86A',
          dim: 'rgba(196,165,90,0.12)',
        },
        void: '#07070C',
        deep: '#0E0E16',
        panel: '#171724',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
