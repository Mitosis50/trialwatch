import { Badge, resultTone } from "@/components/ui/badge";
import {
  currencyLabel,
  integrityLabel,
  processLabel,
  scientificLabel,
} from "@/lib/mec/format";
import type { PacketVersion } from "@/lib/mec/types";
import { cn } from "@/lib/utils";

export function StatusStack({ version, className }: { version: PacketVersion; className?: string }) {
  const items = [
    {
      kicker: "Review process",
      label: processLabel(version.result),
      hint: "Specified review steps were or were not evidenced. This is not a medical truth badge.",
      tone: resultTone(version.result),
    },
    {
      kicker: "Scientific assessment",
      label: scientificLabel(version.scientificAssessment),
      hint: "Interpretation is not collapsed into a single verdict.",
      tone: "neutral" as const,
    },
    {
      kicker: "Artifact integrity",
      label: integrityLabel(version.integrity),
      hint: "Bytes and authentication checks only.",
      tone: "neutral" as const,
    },
    {
      kicker: "Currency",
      label: currencyLabel(version.currency),
      hint: "An old authentic receipt can still be out of date.",
      tone: version.currency === "superseded" ? ("incomplete" as const) : ("neutral" as const),
    },
  ];

  return (
    <ul className={cn("grid gap-3 sm:grid-cols-2", className)}>
      {items.map((item) => (
        <li key={item.kicker} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
          <p className="text-label uppercase tracking-label text-muted-foreground">{item.kicker}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge tone={item.tone}>{item.kicker === "Review process" ? version.result : item.label}</Badge>
          </div>
          <p className="mt-2 text-sm leading-snug text-foreground">{item.label}</p>
          <p className="mt-1 text-sm text-muted-foreground">{item.hint}</p>
        </li>
      ))}
    </ul>
  );
}
