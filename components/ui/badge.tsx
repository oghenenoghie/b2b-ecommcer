import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Status chip — the only place colour appears in chrome (in-stock/low/error).
const badgeVariants = cva(
  "inline-flex items-center gap-1 border px-2 py-0.5 text-[0.7rem] uppercase tracking-label",
  {
    variants: {
      variant: {
        neutral: "border-line text-smoke",
        stock: "border-line text-stock",
        warn: "border-line text-warn",
        error: "border-line text-error",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
