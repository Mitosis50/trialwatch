import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-label font-medium uppercase tracking-label",
  {
    variants: {
      tone: {
        complete: "border-complete/30 bg-complete-fg text-complete",
        incomplete: "border-incomplete/30 bg-incomplete-fg text-incomplete",
        blocked: "border-blocked/30 bg-blocked-fg text-blocked",
        neutral: "border-border bg-secondary text-muted-foreground",
        ink: "border-foreground/20 bg-foreground text-background",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export function Badge({
  className,
  tone,
  ...props
}: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

export function resultTone(
  result: "COMPLETE" | "INCOMPLETE" | "BLOCKED",
): NonNullable<VariantProps<typeof badgeVariants>["tone"]> {
  if (result === "COMPLETE") return "complete";
  if (result === "INCOMPLETE") return "incomplete";
  return "blocked";
}
