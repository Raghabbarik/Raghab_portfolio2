
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        body: ['Poppins', 'sans-serif'],
        headline: ['Poppins', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background-hsl))',
        foreground: 'hsl(var(--foreground-hsl))',
        card: {
          DEFAULT: 'hsl(var(--card-hsl, var(--background-hsl)))',
          foreground: 'hsl(var(--card-foreground-hsl, var(--foreground-hsl)))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover-hsl, var(--background-hsl)))',
          foreground: 'hsl(var(--popover-foreground-hsl, var(--foreground-hsl)))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary-hsl))',
          foreground: 'hsl(var(--primary-foreground-hsl, 0 0% 98%))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary-hsl, 240 4.8% 95.9%))',
          foreground: 'hsl(var(--secondary-foreground-hsl, 240 5.9% 10%))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted-hsl, 240 4.8% 95.9%))',
          foreground: 'hsl(var(--muted-foreground-hsl, 240 3.8% 46.1%))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent-hsl))',
          foreground: 'hsl(var(--accent-foreground-hsl, 240 5.9% 10%))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive-hsl, 0 84.2% 60.2%))',
          foreground: 'hsl(var(--destructive-foreground-hsl, 0 0% 98%))',
        },
        border: 'hsl(var(--border-hsl, 240 5.9% 90%))',
        input: 'hsl(var(--input-hsl, 240 5.9% 90%))',
        ring: 'hsl(var(--ring-hsl, var(--primary-hsl)))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-slow': 'pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
