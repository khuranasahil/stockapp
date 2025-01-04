import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary to-primary/90 text-text-emphasize shadow hover:from-primary/90 hover:to-primary/80 dark:from-primary dark:to-primary/90 dark:text-text-emphasize dark:hover:from-primary/90 dark:hover:to-primary/80",
        destructive:
          "bg-semantic-error-strong text-text-emphasize shadow-sm hover:bg-semantic-error-strong/90 dark:bg-semantic-error-strong dark:text-text-emphasize dark:hover:bg-semantic-error-strong/90",
        outline:
          "border border-primary/20 bg-primary-bg shadow-sm hover:bg-primary/10 hover:text-primary dark:border-primary/20 dark:bg-grey-950 dark:hover:bg-primary/20 dark:hover:text-primary",
        secondary:
          "bg-grey-100 text-text-body1 shadow-sm hover:bg-grey-200/80 dark:bg-grey-800 dark:text-text-body1 dark:hover:bg-grey-700",
        ghost: "text-primary hover:bg-primary/10 hover:text-primary dark:text-primary dark:hover:bg-primary/20",
        link: "text-primary underline-offset-4 hover:underline dark:text-primary",
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
