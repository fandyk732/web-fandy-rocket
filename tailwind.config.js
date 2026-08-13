/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        sm: '8px',
        md: '12px',
        lg: 'var(--radius)',
        xl: '20px',
        '2xl': '24px',
        '3xl': '32px',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        display: ['var(--font-plus-jakarta-sans)', 'sans-serif'],
      },
      animation: {
        'fade-slide-up': 'fadeSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'beam-drop': 'beam-drop 6s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'beam-slide': 'beam-slide 8s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'pulse-green': 'pulse-green 2s infinite',
        'pulse-yellow': 'pulse-yellow 2s infinite',
        'pulse-blue': 'pulse-blue 2s infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};