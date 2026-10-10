/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
      },
      borderRadius: {
        xl: 'calc(var(--radius) + 4px)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'fade-in': { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'fade-in-down': { from: { opacity: '0', transform: 'translateY(-10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'slide-in-left': { from: { opacity: '0', transform: 'translateX(-10px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        'slide-in-right': { from: { opacity: '0', transform: 'translateX(10px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        'spin-slow': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } }
      },
      animation: {
        'fade-in': 'fade-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in-down': 'fade-in-down 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'slide-in-left': 'slide-in-left 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        'slide-in-right': 'slide-in-right 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        'spin-slow': 'spin-slow 10s linear infinite'
      }
    }
  },
  plugins: []
}
