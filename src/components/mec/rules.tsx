import { Badge } from "@/components/ui/badge";
import type { ReviewReceipt } from "@/lib/mec/types";

function toneFor(status: string) {
  if (status === "SATISFIED") return "complete" as const;
  if (status === "MISSING") return "incomplete" as const;
  return "blocked" as const;
}

export function RuleList({ receipt }: { receipt: ReviewReceipt }) {
  return (
    <ol className="grid gap-3">
      {receipt.rules.map((rule) => (
        <li key={rule.code} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-sm">{rule.code}</p>
            <Badge tone={toneFor(rule.status)}>{rule.status}</Badge>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{rule.rationale_ref}</p>
        </li>
      ))}
    </ol>
  );
}
