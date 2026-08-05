import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Editorial button: borders only, no shadow, invert (ink<->paper) on hover.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-xs font-medium uppercase tracking-label transition-colors disabled:pointer-events-none disabled:text-ash disabled:border-line focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink",
  {
    variants: {
      variant: {
        primary: "border border-ink bg-ink text-paper hover:bg-paper hover:text-ink",
        secondary: "border border-ink bg-paper text-ink hover:bg-bone",
        ghost: "border border-line text-ink hover:border-ink",
      },
      size: {
        default: "px-5 py-2.5",
        sm: "px-3 py-1.5 text-[0.7rem]",
        lg: "px-6 py-3.5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
