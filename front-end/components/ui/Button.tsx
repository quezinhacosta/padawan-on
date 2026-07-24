import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-padawan-lime text-black hover:bg-padawan-lime/90 hover:scale-105 hover:shadow-[0_0_30px_rgba(211,252,114,0.3)]",
        secondary: "bg-padawan-purple text-white hover:bg-padawan-purple/90 hover:scale-105 hover:shadow-[0_0_30px_rgba(83,49,204,0.3)]",
        outline: "border-2 border-padawan-purple text-white hover:bg-padawan-purple/10 hover:border-padawan-lime",
        ghost: "text-white hover:bg-white/5",
        gradient: "bg-gradient-to-r from-padawan-purple to-padawan-lime text-black hover:scale-105 hover:shadow-[0_0_40px_rgba(211,252,114,0.2)]",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 px-4 py-2 text-sm",
        lg: "h-14 px-8 py-4 text-lg",
        icon: "h-12 w-12",
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
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }