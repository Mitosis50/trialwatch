import { digestOf, digestOfText, type Digest } from "./digest";
import type { Packet, PacketVersion, SnapshotStatus, SourceVersion } from "./types";

export interface ManifestSource {
  id: string;
  title: string;
  kind: SourceVersion["kind"];
  originalUrl: string;
  capturedAt: string;
  documentDate: string | null;
  bytes_digest: Digest | null;
  provenance: SourceVersion["provenance"];
  snapshot_status: SnapshotStatus;
  rightsBasis: string;
}

export interface InputManifest {
  packet_id: string;
  claim_id: string;
  sources: Array<{
    id: string;
    bytes_digest: Digest | null;
    originalUrl: string;
    provenance: SourceVersion["provenance"];
    snapshot_status: SnapshotStatus;
  }>;
  locators: Array<[string, string]>;
}

export interface SourceSnapshot {
  id: string;
  snapshot_status: SnapshotStatus;
  bytes_digest: Digest | null;
  snapshot: string | null;
  dependency_note: string | null;
}

export function sourceSnapshotBody(source: SourceVersion): string {
  return `${source.title}\n${source.excerpt}`;
}

export function recomputeSourceDigest(source: SourceVersion): Digest | null {
  if (source.snapshotStatus !== "captured") return source.bytesDigest;
  return digestOfText(sourceSnapshotBody(source));
}

export function buildInputManifest(packet: Packet, version: PacketVersion): InputManifest {
  return {
    packet_id: packet.id,
    claim_id: version.claim.id,
    sources: packet.sources.map((s) => ({
      id: s.id,
      bytes_digest: recomputeSourceDigest(s),
      originalUrl: s.originalUrl,
      provenance: s.provenance,
      snapshot_status: s.snapshotStatus,
    })),
    locators: version.fieldChecks.map((f) => [f.key, f.sourceLocator]),
  };
}

export function manifestCommitment(manifest: InputManifest): Digest {
  return digestOf(manifest);
}

export function describeManifestSources(packet: Packet): ManifestSource[] {
  return packet.sources.map((s) => ({
    id: s.id,
    title: s.title,
    kind: s.kind,
    originalUrl: s.originalUrl,
    capturedAt: s.capturedAt,
    documentDate: s.documentDate,
    bytes_digest: recomputeSourceDigest(s),
    provenance: s.provenance,
    snapshot_status: s.snapshotStatus,
    rightsBasis: s.rightsBasis,
  }));
}

export function describeSnapshots(packet: Packet): SourceSnapshot[] {
  return packet.sources.map((s) => {
    if (s.snapshotStatus === "captured") {
      const body = sourceSnapshotBody(s);
      return {
        id: s.id,
        snapshot_status: "captured",
        bytes_digest: digestOfText(body),
        snapshot: body,
        dependency_note: null,
      };
    }
    if (s.snapshotStatus === "external_dependency") {
      return {
        id: s.id,
        snapshot_status: "external_dependency",
        bytes_digest: s.bytesDigest,
        snapshot: null,
        dependency_note: `External document is identified but not bundled: ${s.originalUrl}`,
      };
    }
    return {
      id: s.id,
      snapshot_status: "unavailable",
      bytes_digest: s.bytesDigest,
      snapshot: null,
      dependency_note: `Captured snapshot is unavailable for ${s.id}. Binding cannot be recomputed from content.`,
    };
  });
}

export interface ProtocolResultRow {
  field: string;
  planned: string;
  reported: string;
  assessment: "match" | "mismatch" | "not_checked";
  note: string;
}

function firstProtocolLine(source: SourceVersion | undefined, startsWith: string): string | null {
  if (!source) return null;
  const line = source.excerpt
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l.toLowerCase().startsWith(startsWith.toLowerCase()));
  return line ?? null;
}

export function protocolResultRows(packet: Packet, version: PacketVersion): ProtocolResultRow[] {
  const protocol = packet.sources.find((s) => s.kind === "protocol");
  const results = packet.sources.find((s) => s.kind === "results");
  const claim = version.claim;
  const denomCheck = version.fieldChecks.find((f) => f.key === "denominator");
  const outcomeCheck = version.fieldChecks.find((f) => f.key === "outcome_definition");
  const timeCheck = version.fieldChecks.find((f) => f.key === "timeframe");
  const popCheck = version.fieldChecks.find((f) => f.key === "analysis_population");

  const plannedEndpoint =
    firstProtocolLine(protocol, "Primary endpoint") ??
    firstProtocolLine(protocol, "Primary:") ??
    protocol?.excerptTitle ??
    "Protocol excerpt not captured";
  const plannedPop =
    firstProtocolLine(protocol, "Analysis population") ??
    (protocol?.excerpt.toLowerCase().includes("intention-to-treat")
      ? "Intention-to-treat (protocol)"
      : "Not extracted from protocol");
  const plannedTime =
    protocol?.excerpt.match(/day\s+\d+/i)?.[0] ??
    (protocol?.excerpt.toLowerCase().includes("90") ? "90 days (protocol)" : "Not extracted from protocol");
  const plannedN = firstProtocolLine(protocol, "Sample size") ?? "Sample size not extracted from protocol";

  const denomMismatch = Boolean(denomCheck?.documentedDisagreement);
  const prev = packet.versions.find((other) => other.version < version.version);

  return [
    {
      field: "Primary endpoint",
      planned: plannedEndpoint,
      reported: claim.outcome,
      assessment: outcomeCheck?.documentedDisagreement ? "mismatch" : protocol ? "match" : "not_checked",
      note:
        outcomeCheck?.documentedDisagreement ??
        `${protocol?.excerptTitle ?? "protocol"} · ${results?.excerptTitle ?? "results"}`,
    },
    {
      field: "Timeframe",
      planned: plannedTime,
      reported: claim.timeframe,
      assessment: timeCheck?.documentedDisagreement ? "mismatch" : protocol ? "match" : "not_checked",
      note: timeCheck?.documentedDisagreement ?? timeCheck?.sourceLocator ?? "Field check",
    },
    {
      field: "Analysis population",
      planned: plannedPop,
      reported: claim.analysisPopulation,
      assessment: popCheck?.documentedDisagreement ? "mismatch" : protocol ? "match" : "not_checked",
      note: popCheck?.documentedDisagreement ?? popCheck?.sourceLocator ?? "Field check",
    },
    {
      field: "Denominator (N)",
      planned: plannedN,
      reported: claim.denominator,
      assessment: denomMismatch ? "mismatch" : protocol ? "match" : "not_checked",
      note:
        denomCheck?.documentedDisagreement ??
        (prev
          ? `Current extraction ${claim.denominator}. Earlier version used ${prev.claim.denominator}.`
          : (denomCheck?.sourceLocator ?? "Field check")),
    },
  ];
}
