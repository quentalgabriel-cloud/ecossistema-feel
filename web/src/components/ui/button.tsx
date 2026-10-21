import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-ui font-medium whitespace-nowrap transition-[background-color,border-color,color] duration-150 ease-out outline-none select-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // DESIGN.md § Components: primário coral (único por composição),
        // secundário outline ink, terciário mudo sem borda.
        default: "bg-primary text-primary-foreground hover:bg-textBody",
        coral: "bg-coral text-paper hover:bg-coralHover",
        outline: "border-ink bg-transparent text-ink hover:bg-bone",
        secondary: "bg-secondary text-secondary-foreground hover:bg-line",
        ghost: "text-textBody hover:bg-bone hover:text-ink",
        destructive: "border-line text-destructive hover:bg-bone",
        link: "text-ink underline-offset-4 hover:underline",
      },
      size: {
        // Alvo mínimo de 44px (DESIGN.md § Components).
        default: "h-11 gap-2 px-4",
        sm: "h-9 gap-1.5 px-3 text-body-md",
        lg: "h-12 gap-2 px-5",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
