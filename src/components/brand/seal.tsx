import { cn } from "@/lib/utils";

export function SealMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("text-primary", className)} aria-hidden="true">
      <circle cx="12.5" cy="14.5" r="7.2" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="19.5" cy="14.5" r="7.2" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="16" cy="19.5" r="7.2" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
