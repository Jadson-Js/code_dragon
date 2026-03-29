import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { X } from "lucide-react";

import { cn } from "@/shared/utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full border border-transparent whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-4 cursor-pointer group font-medium",
  {
    variants: {
      variant: {
        default:
          "bg-primary-1 text-white-1 hover:bg-primary-1/90 border-transparent",
        secondary: "bg-bg-1 rounded-sm text-white-1 hover:bg-bg-2 border-bg-3 ",
        destructive:
          "bg-destructive text-white-1 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 hover:bg-destructive/90 border-transparent",
        outline:
          "border-bg-3 bg-transparent text-white-2 hover:border-white-2/50 hover:text-white-1",
        ghost:
          "hover:bg-bg-3 text-white-2 hover:text-white-1 border-transparent",
        link: "text-primary-1 underline-offset-4 hover:underline border-transparent",
      },
      size: {
        default: "px-4 py-2 text-sm",
        sm: "px-2 py-1 text-sm font-normal",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  hasIcon = false,
  children,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
    hasIcon?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {children}
      {hasIcon && (
        <X
          className={cn(
            "transition-colors",
            variant === "default"
              ? "text-white-1"
              : "text-white-2 group-hover:text-white-1",
          )}
        />
      )}
    </Comp>
  );
}

export { Badge, badgeVariants };
