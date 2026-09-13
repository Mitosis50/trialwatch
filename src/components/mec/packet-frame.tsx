import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Badge, resultTone } from "@/components/ui/badge";
import { currentVersion } from "@/lib/mec/fixtures";
import type { Packet } from "@/lib/mec/types";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "overview", label: "Packet", to: "/packets/$packetId" },
  { id: "claim", label: "Claim", to: "/packets/$packetId/claim" },
  { id: "review", label: "Review", to: "/packets/$packetId/review" },
  { id: "receipt", label: "Receipt", to: "/packets/$packetId/receipt" },
  { id: "history", label: "History", to: "/packets/$packetId/history" },
] as const;

export function PacketFrame({
  packet,
  tab,
  children,
}: {
  packet: Packet;
  tab: (typeof TABS)[number]["id"];
  children: ReactNode;
}) {
  const v = currentVersion(packet);
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <p className="text-label uppercase tracking-label text-muted-foreground">
        <Link to="/collection" className="text-primary hover:underline">
          Collection
        </Link>
        <span aria-hidden> · </span>
        {packet.study.registryId}
      </p>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-muted-foreground">{packet.study.id}</p>
          <h1 className="mt-1 font-display text-3xl tracking-tight sm:text-4xl">{packet.study.acronym}</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">{packet.study.title}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone={resultTone(v.result)}>{v.result}</Badge>
          <Badge tone="ink">Synthetic</Badge>
        </div>
      </div>
      <nav
        className="mt-6 flex gap-1 overflow-x-auto border-b border-border"
        aria-label="Packet sections"
      >
        {TABS.map((item) => {
          const active = item.id === tab;
          return (
            <Link
              key={item.id}
              to={item.to}
              params={{ packetId: packet.id }}
              className={cn(
                "shrink-0 border-b-2 px-3 py-3 text-sm transition-colors duration-150",
                active
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="pt-6">{children}</div>
    </main>
  );
}
