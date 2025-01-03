import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-orange/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-theme-orange to-theme-orange/90 text-white shadow hover:from-theme-orange/90 hover:to-theme-orange/80 dark:from-theme-orange dark:to-theme-orange/90 dark:text-white dark:hover:from-theme-orange/90 dark:hover:to-theme-orange/80",
        destructive:
          "bg-semantic-error text-white shadow-sm hover:bg-semantic-error/90 dark:bg-semantic-error dark:text-white dark:hover:bg-semantic-error/90",
        outline:
          "border border-theme-orange/20 bg-white shadow-sm hover:bg-theme-orange/10 hover:text-theme-orange dark:border-theme-orange/20 dark:bg-zinc-950 dark:hover:bg-theme-orange/20 dark:hover:text-theme-orange",
        secondary:
          "bg-zinc-100 text-zinc-900 shadow-sm hover:bg-zinc-100/80 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800/80",
        ghost: "text-theme-orange hover:bg-theme-orange/10 hover:text-theme-orange dark:text-theme-orange dark:hover:bg-theme-orange/20",
        link: "text-theme-orange underline-offset-4 hover:underline dark:text-theme-orange",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
