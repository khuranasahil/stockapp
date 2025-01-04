/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },
        primary: {
          DEFAULT: 'hsl(var(--color-primary))',
          background: 'hsl(var(--color-background))',
          bg: 'hsl(var(--color-primary-bg))'
        },
        text: {
          body1: 'hsl(var(--color-body-text-1))',
          body2: 'hsl(var(--color-body-text-2))',
          emphasize: 'hsl(var(--color-text-emphasize))'
        },
        semantic: {
          info: {
            strong: 'hsl(var(--semantic-info-strong))',
            faded: 'hsl(var(--semantic-info-faded))',
            dark: 'hsl(var(--semantic-info-dark))'
          },
          success: {
            strong: 'hsl(var(--semantic-success-strong))',
            faded: 'hsl(var(--semantic-success-faded))',
            dark: 'hsl(var(--semantic-success-dark))'
          },
          warning: {
            strong: 'hsl(var(--semantic-warning-strong))',
            faded: 'hsl(var(--semantic-warning-faded))',
            dark: 'hsl(var(--semantic-warning-dark))'
          },
          error: {
            strong: 'hsl(var(--semantic-error-strong))',
            faded: 'hsl(var(--semantic-error-faded))',
            dark: 'hsl(var(--semantic-error-dark))'
          }
        },
        grey: {
          950: 'hsl(var(--grey-950))',
          900: 'hsl(var(--grey-900))',
          850: 'hsl(var(--grey-850))',
          800: 'hsl(var(--grey-800))',
          750: 'hsl(var(--grey-750))',
          700: 'hsl(var(--grey-700))',
          650: 'hsl(var(--grey-650))',
          600: 'hsl(var(--grey-600))',
          500: 'hsl(var(--grey-500))',
          400: 'hsl(var(--grey-400))',
          300: 'hsl(var(--grey-300))',
          200: 'hsl(var(--grey-200))',
          100: 'hsl(var(--grey-100))',
          50: 'hsl(var(--grey-50))'
        },
        ui: {
          turquoise: 'hsl(var(--color-turquoise))',
          'dark-cyan': 'hsl(var(--color-dark-cyan))',
          'light-plumb': 'hsl(var(--color-light-plumb))',
          lavender: 'hsl(var(--color-lavender))',
          orchid: 'hsl(var(--color-orchid))',
          purple: 'hsl(var(--color-purple))',
          butter: 'hsl(var(--color-butter))',
          pumpkin: 'hsl(var(--color-pumpkin))',
          salmon: 'hsl(var(--color-salmon))',
          burgundy: 'hsl(var(--color-burgundy))',
          coral: 'hsl(var(--color-coral))',
          'old-brick': 'hsl(var(--color-old-brick))',
          olive: 'hsl(var(--color-olive))',
          moss: 'hsl(var(--color-moss))',
          forest: 'hsl(var(--color-forest))',
          parsley: 'hsl(var(--color-parsley))',
          'light-blue': 'hsl(var(--color-light-blue))',
          'aqua-blue': 'hsl(var(--color-aqua-blue))',
          'bahama-blue': 'hsl(var(--color-bahama-blue))',
          'regal-blue': 'hsl(var(--color-regal-blue))'
        },
        trend: {
          gain: 'hsl(var(--color-trend-gain))',
          loss: 'hsl(var(--color-trend-loss))'
        },
        table: {
          header: {
            primary: 'hsl(var(--theme-table-header-primary))',
            alt: 'hsl(var(--theme-table-header-alt))',
            child: {
              aqua: 'hsl(var(--theme-table-header-child-aqua))',
              yellow: 'hsl(var(--theme-table-header-child-yellow))',
              green: 'hsl(var(--theme-table-header-child-green))',
              violet: 'hsl(var(--theme-table-header-child-violet))',
              turquoise: 'hsl(var(--theme-table-header-child-turquoise))',
              red: 'hsl(var(--theme-table-header-child-red))'
            }
          }
        }
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
}

