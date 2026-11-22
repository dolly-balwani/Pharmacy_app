/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        medibid: {
          bg: '#F7F9FC',
          surface: '#FFFFFF',
          brand: '#2563EB',
          accent: '#38BDF8',
          mint: '#DDF7ED',
          'soft-blue': '#EAF2FF',
          lavender: '#F1EDFF',
          'text-primary': '#172033',
          'text-secondary': '#697586',
          border: '#E6EAF0',
          success: '#16A36A',
          warning: '#E9A23B',
          error: '#DC5353',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'], heading: ['Manrope', 'system-ui', 'sans-serif'] },
      borderRadius: { lg: 'var(--radius)', md: 'calc(var(--radius) - 2px)', sm: 'calc(var(--radius) - 4px)' },
      keyframes: { 'pulse-soft': { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.6' } } },
      animation: { 'pulse-soft': 'pulse-soft 2s ease-in-out infinite' },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

