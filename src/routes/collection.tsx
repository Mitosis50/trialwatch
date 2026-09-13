import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Badge, resultTone } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { COLLECTION, PACKETS, currentVersion } from "@/lib/mec/fixtures";
import { processLabel, scientificLabel } from "@/lib/mec/format";
import type { ReviewResult } from "@/lib/mec/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/collection")({ component: CollectionPage });

const FILTERS: Array<{ id: "all" | ReviewResult; label: string }> = [
  { id: "all", label: "All" },
  { id: "COMPLETE", label: "Complete" },
  { id: "INCOMPLETE", label: "Incomplete" },
  { id: "BLOCKED", label: "Blocked" },
];

function CollectionPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | ReviewResult>("all");

  const packets = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return PACKETS.filter((p) => {
      const v = currentVersion(p);
      if (filter !== "all" && v.result !== filter) return false;
      if (!needle) return true;
      const hay = `${p.study.id} ${p.study.acronym} ${p.study.title} ${p.fixtureTag}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [q, filter]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-label uppercase tracking-label text-muted-foreground">
        {COLLECTION.protocolVersion} · search cutoff {COLLECTION.searchCutoff}
      </p>
      <h1 className="mt-2 font-display text-4xl tracking-tight">{COLLECTION.name}</h1>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed">{COLLECTION.question}</p>
      <p className="mt-3 max-w-3xl text-sm text-muted-foreground">{COLLECTION.methodsNote}</p>

      <section className="mt-10">
        <h2 className="font-display text-2xl tracking-tight">Eligibility</h2>
        <ul className="mt-4 grid gap-2">
          {COLLECTION.eligibility.map((rule) => (
            <li key={rule} className="rounded-lg bg-card px-4 py-3 text-sm shadow-[var(--shadow-border)]">
              {rule}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-2xl tracking-tight">Packets</h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search acronym or id"
              aria-label="Search packets"
              className="sm:w-64"
            />
            <div className="flex flex-wrap gap-1" role="group" aria-label="Filter by process result">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    "h-11 rounded-md px-3 text-sm",
                    filter === f.id ? "bg-foreground text-background" : "bg-secondary text-foreground",
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <ul className="mt-4 grid gap-3">
          {packets.map((p) => {
            const v = currentVersion(p);
            return (
              <li key={p.id}>
                <Link
                  to="/packets/$packetId"
                  params={{ packetId: p.id }}
                  className="block rounded-xl bg-card p-4 no-underline shadow-[var(--shadow-border)] transition-shadow duration-150 hover:shadow-md sm:p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-xs text-muted-foreground">{p.study.id}</p>
                      <h3 className="mt-1 font-display text-xl tracking-tight">{p.study.acronym}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge tone={resultTone(v.result)}>{v.result}</Badge>
                      {p.challenges.some((c) => c.disposition === "upheld") ? (
                        <Badge tone="incomplete">Corrected</Badge>
                      ) : null}
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">{v.claim.attributedStatement}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{processLabel(v.result)}</p>
                  <p className="text-sm text-muted-foreground">{scientificLabel(v.scientificAssessment)}</p>
                  <p className="mt-2 text-label uppercase tracking-label text-muted-foreground">
                    Fixture · {p.fixtureTag}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
        {packets.length === 0 ? (
          <p className="mt-6 text-muted-foreground">No packets match that filter.</p>
        ) : null}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl tracking-tight">Inclusion log</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Selection history is visible. Eligible null and unfavorable results stay in.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl bg-card shadow-[var(--shadow-border)]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-label uppercase tracking-label text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Study</th>
                <th className="px-4 py-3 font-medium">Decision</th>
                <th className="px-4 py-3 font-medium">Reason</th>
              </tr>
            </thead>
            <tbody>
              {COLLECTION.inclusionLog.map((row) => (
                <tr key={row.studyId} className="border-b border-border/70 last:border-0">
                  <td className="px-4 py-3 font-mono text-xs">
                    {row.acronym}
                    <div className="text-muted-foreground">{row.studyId}</div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={row.decision === "included" ? "complete" : "neutral"}>{row.decision}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{row.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
