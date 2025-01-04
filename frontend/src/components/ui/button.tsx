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
          "bg-gradient-to-r from-[#F78A09] to-[#D1570D] text-white shadow hover:opacity-90 dark:from-[#F78A09] dark:to-[#D1570D] dark:text-white dark:hover:opacity-90",
        destructive:
          "bg-[#E74C3C] text-white shadow-sm hover:opacity-90 dark:bg-[#E74C3C] dark:text-white dark:hover:opacity-90",
        outline:
          "border border-[#F78A09]/20 bg-[#FFFFFF] shadow-sm hover:bg-[#F78A09]/10 hover:text-[#F78A09] dark:border-[#F78A09]/20 dark:bg-[#262626] dark:hover:bg-[#F78A09]/20 dark:hover:text-[#F78A09]",
        secondary:
          "bg-[#F2F2F2] text-[#333333] shadow-sm hover:bg-[#EFEFEF]/80 dark:bg-[#333333] dark:text-[#DFDFDF] dark:hover:bg-[#444444]",
        ghost: "text-[#F78A09] hover:bg-[#F78A09]/10 hover:text-[#F78A09] dark:text-[#F78A09] dark:hover:bg-[#F78A09]/20",
        link: "text-[#F78A09] underline-offset-4 hover:underline dark:text-[#F78A09]",
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
