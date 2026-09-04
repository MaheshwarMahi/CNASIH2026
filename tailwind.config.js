/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        bg: {
          base: '#0A0A0A',
          surface: '#141414',
          card: '#1A1A1A',
          elevated: '#2D2D2D',
          hover: '#333333',
        },
        // Accent
        cyan: {
          DEFAULT: '#00E5FF',
          dim: '#00B8D4',
          glow: 'rgba(0, 229, 255, 0.15)',
        },
        // Severity
        danger: {
          DEFAULT: '#FF0055',
          dim: '#CC0044',
          glow: 'rgba(255, 0, 85, 0.15)',
        },
        warning: {
          DEFAULT: '#FFB300',
          dim: '#CC8F00',
          glow: 'rgba(255, 179, 0, 0.15)',
        },
        success: {
          DEFAULT: '#00E676',
          dim: '#00B85F',
          glow: 'rgba(0, 230, 118, 0.15)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-up': 'slideInUp 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 229, 255, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 229, 255, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};
