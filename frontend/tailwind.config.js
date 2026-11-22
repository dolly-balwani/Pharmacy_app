/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        medibid: {
          bg: '#060911',
          'bg-card': '#0D1527',
          'bg-elevated': '#121D34',
          surface: '#0F1A30',
          brand: '#2563EB',
          accent: '#00D2FF',
          'cyan-glow': '#38BDF8',
          mint: '#064E3B',
          'mint-text': '#34D399',
          'soft-blue': '#1E293B',
          lavender: '#2E1065',
          'text-primary': '#F8FAFC',
          'text-secondary': '#94A3B8',
          border: '#1E293B',
          'border-glow': 'rgba(56, 189, 248, 0.25)',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
        },
        background: '#060911',
        foreground: '#F8FAFC',
        card: { DEFAULT: '#0D1527', foreground: '#F8FAFC' },
        primary: { DEFAULT: '#2563EB', foreground: '#FFFFFF' },
        secondary: { DEFAULT: '#1E293B', foreground: '#F8FAFC' },
        muted: { DEFAULT: '#1E293B', foreground: '#94A3B8' },
        accent: { DEFAULT: '#00D2FF', foreground: '#FFFFFF' },
        destructive: { DEFAULT: '#EF4444', foreground: '#FFFFFF' },
        border: '#1E293B',
        input: '#1E293B',
        ring: '#00D2FF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Manrope', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: '1rem',
        md: '0.75rem',
        sm: '0.5rem',
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(0, 210, 255, 0.3)',
        'glow-blue': '0 0 30px -5px rgba(37, 99, 235, 0.4)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.3)',
        '3d': '0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255, 255, 255, 0.08)',
        '3d-hover': '0 30px 60px -20px rgba(0, 210, 255, 0.2), 0 0 2px 1px rgba(0, 210, 255, 0.3)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.75', transform: 'scale(1.02)' },
        },
        'float-3d': {
          '0%, 100%': { transform: 'translateY(0px) rotateX(4deg) rotateY(-4deg)' },
          '50%': { transform: 'translateY(-12px) rotateX(-4deg) rotateY(4deg)' },
        },
        'orbit': {
          '0%': { transform: 'rotate(0deg) translateX(45px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(45px) rotate(-360deg)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'float-3d': 'float-3d 6s ease-in-out infinite',
        'orbit': 'orbit 12s linear infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
