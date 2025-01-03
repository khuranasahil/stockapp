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
        theme: {
          orange: 'hsl(var(--theme-orange))',
          input: {
            dark: 'hsl(var(--theme-input-dark))',
            light: 'hsl(var(--theme-input-light))'
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
        semantic: {
          success: 'hsl(var(--semantic-success))',
          error: 'hsl(var(--semantic-error))',
          info: 'hsl(var(--semantic-info))',
          warning: 'hsl(var(--semantic-warning))'
        }
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
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

