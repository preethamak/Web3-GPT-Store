import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      colors: {
        // Google Material 3 Design Colors
        google: {
          blue: '#4285F4',
          red: '#EA4335',
          yellow: '#FBBC04',
          green: '#34A853',
          gray: '#5F6368',
          'gray-light': '#F8F9FA',
          'gray-dark': '#202124',
        },
        // Extended palette
        'goog-blue': {
          50: '#E8F0FE',
          100: '#D2E3FC',
          200: '#AECBFA',
          300: '#8AB4F8',
          400: '#669DF6',
          500: '#4285F4',
          600: '#3367D6',
          700: '#1F56C9',
          800: '#1847BE',
          900: '#0D47A1',
        },
        'goog-red': {
          50: '#FCE8E6',
          100: '#F8BDBB',
          200: '#F69988',
          300: '#F4745B',
          400: '#EA4335',
          500: '#EA4335',
          600: '#D33425',
          700: '#C5221F',
          800: '#B3261E',
          900: '#A50E0E',
        },
        'goog-green': {
          50: '#E6F4EA',
          100: '#CEEAD6',
          200: '#A8DADC',
          300: '#81C995',
          400: '#57AE5B',
          500: '#34A853',
          600: '#2D9248',
          700: '#27873F',
          800: '#1E8449',
          900: '#188038',
        },
        'goog-yellow': {
          50: '#FFFBEA',
          100: '#FEF7C3',
          200: '#FEEF5D',
          300: '#FEE835',
          400: '#FBBC04',
          500: '#F9AB00',
          600: '#F57F17',
          700: '#F57C00',
          800: '#E65100',
          900: '#BF360C',
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "glass": "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'blob': 'blob 7s infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
