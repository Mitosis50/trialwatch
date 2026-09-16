import { Link } from "@tanstack/react-router";
import { formatStamp } from "@/lib/mec/format";
import type { Packet, PacketVersion } from "@/lib/mec/types";

export function CorrectionBanner({
  packet,
  version,
  compact = false,
}: {
  packet: Packet;
  version: PacketVersion;
  compact?: boolean;
}) {
  const prior = packet.versions.find((other) => other.version < version.version);
  const upheld = packet.challenges.filter((c) => c.disposition === "upheld");
  if (!prior || upheld.length === 0) return null;
  const challenge = upheld[0]!;

  return (
    <aside className="rounded-xl border border-incomplete/40 bg-incomplete/10 p-5">
      <p className="text-label uppercase tracking-label text-incomplete">Correction on current packet</p>
      <h2 className={`mt-1 font-display tracking-tight ${compact ? "text-lg" : "text-xl"}`}>
        Denominator changed from {prior.claim.denominator} to {version.claim.denominator}
      </h2>
      <p className="mt-2 text-sm leading-relaxed">
        {challenge.id} · {formatStamp(challenge.filedAt)}. {challenge.reason}
      </p>
      {compact ? null : <p className="mt-2 text-sm text-muted-foreground">{challenge.dispositionNote}</p>}
      <p className="mt-3 text-sm">
        <Link className="text-primary hover:underline" to="/packets/$packetId/history" params={{ packetId: packet.id }}>
          Full correction history
        </Link>
      </p>
    </aside>
  );
}
