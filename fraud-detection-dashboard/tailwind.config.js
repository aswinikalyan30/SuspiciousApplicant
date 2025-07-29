/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#7100EB',
        secondary: '#95F4A0',
        safe: '#95F4A0',
        warning: '#EFC728',
        danger: '#D42828',
        dark: {
          bg: '#0A0015',
          secondary: '#1E004B',
        }
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #0A0015, #1E004B, #7100EB)',
        'neural-pattern': 'radial-gradient(circle at 1px 1px, rgba(113, 0, 235, 0.1) 1px, transparent 0)',
      },
      animation: {
        'count-up': 'count-up 0.8s ease-out forwards',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'neural-wave': 'neural-wave 3s ease-in-out infinite',
        'slide-in': 'slide-in 0.3s ease-out forwards',
        'typing-dots': 'typing-dots 1.5s ease-in-out infinite',
      },
      keyframes: {
        'count-up': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.1)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(113, 0, 235, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(113, 0, 235, 0.6)' },
        },
        'neural-wave': {
          '0%, 100%': { 
            background: 'linear-gradient(45deg, #95F4A0, #7100EB)',
            transform: 'translateX(0)',
          },
          '50%': { 
            background: 'linear-gradient(45deg, #7100EB, #95F4A0)',
            transform: 'translateX(10px)',
          },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'typing-dots': {
          '0%, 20%': { opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}