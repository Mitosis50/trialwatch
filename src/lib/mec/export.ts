import type { Packet, PacketVersion } from "./types";
import { EXPORT_TYPE, RECEIPT_SCHEMA } from "./types";
import { POLICY_BODY } from "./policy";
import { signDemoReceipt } from "./seal";
import type { PacketExport } from "./verifier";

export function buildExport(packet: Packet, version?: number): PacketExport {
  const v = packet.versions.find((x) => x.version === (version ?? packet.currentVersion)) ?? packet.versions.at(-1)!;
  return buildExportFromVersion(packet, v);
}

export function buildExportFromVersion(packet: Packet, v: PacketVersion): PacketExport {
  const ancestors = packet.versions
    .filter((other) => other.version < v.version)
    .map((other) => other.envelope);
  return {
    record_type: EXPORT_TYPE,
    schema_version: RECEIPT_SCHEMA,
    notice: "Commons draft receipt — not a PoF-compatible receipt.",
    synthetic: true,
    packet_id: packet.id,
    version: v.version,
    envelope: v.envelope,
    policy: POLICY_BODY,
    ancestors,
    source_refs: packet.sources.map((s) => ({
      id: s.id,
      title: s.title,
      locator_note: `${s.kind} · ${s.provenance}`,
      bytes_digest: s.bytesDigest,
    })),
    evidence_included: true,
  };
}

export async function buildSignedDemoExport(packet: Packet): Promise<PacketExport> {
  const exp = buildExport(packet);
  if (!packet.usesDemoKey) return exp;
  const seal = await signDemoReceipt(exp.envelope.receipt);
  return {
    ...exp,
    envelope: { ...exp.envelope, seal },
  };
}

export function downloadJson(filename: string, value: unknown) {
  const text = JSON.stringify(value, null, 2);
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
