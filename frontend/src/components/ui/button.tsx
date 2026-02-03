import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary-1/50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary-1 text-white-1 hover:bg-primary-2 shadow-sm shadow-primary-1/25",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-bg-3 bg-transparent text-white-1 hover:bg-bg-3/50 hover:border-bg-3",
        secondary:
          "bg-bg-2 text-white-1 hover:bg-bg-3",
        ghost:
          "text-white-2 hover:bg-bg-3/50 hover:text-white-1",
        link: "text-primary-1 underline-offset-4 hover:underline",
        social:
          "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:shadow-md shadow-sm",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-7 gap-1 rounded-md px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-9 rounded-lg gap-1.5 px-3",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-base",
        icon: "size-10",
        "icon-xs": "size-7 rounded-md [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
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
