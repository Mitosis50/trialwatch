import { digestOf } from "./digest";
import {
  COLLECTION,
  PACKETS as RAW_PACKETS,
  POLICY_DIGEST,
  currentVersion as fixtureCurrentVersion,
  latestCorrections as fixtureLatestCorrections,
} from "./fixtures";
import { buildInputManifest, manifestCommitment, snapshotStatusOf } from "./manifest";
import type { Packet, PacketVersion } from "./types";

export { COLLECTION, POLICY_DIGEST };

function sealVersion(packet: Packet, version: PacketVersion): PacketVersion {
  const receipt = {
    ...version.envelope.receipt,
    input_manifest_digest: manifestCommitment(buildInputManifest(packet, version)),
  };
  return {
    ...version,
    envelope: {
      ...version.envelope,
      receipt,
      receipt_digest: digestOf(receipt),
    },
  };
}

/** Issue the canonical receipt once from the shared manifest builder. */
export function issuePacket(packet: Packet): Packet {
  const sources = packet.sources.map((source) => ({
    ...source,
    snapshotStatus: snapshotStatusOf(source),
  }));
  const aligned = { ...packet, sources };
  const sealed = aligned.versions.map((version) => sealVersion(aligned, version));
  const byVersion = new Map(sealed.map((version) => [version.version, version]));
  const versions = sealed.map((version) => {
    const previous = byVersion.get(version.version - 1);
    if (!previous) return version;
    const receipt = version.envelope.receipt;
    if (!receipt.predecessor_receipt_digest && !receipt.supersedes_receipt_digest) return version;
    const nextReceipt = {
      ...receipt,
      predecessor_receipt_digest: receipt.predecessor_receipt_digest
        ? previous.envelope.receipt_digest
        : receipt.predecessor_receipt_digest,
      supersedes_receipt_digest: receipt.supersedes_receipt_digest
        ? previous.envelope.receipt_digest
        : receipt.supersedes_receipt_digest,
    };
    return {
      ...version,
      envelope: {
        ...version.envelope,
        receipt: nextReceipt,
        receipt_digest: digestOf(nextReceipt),
      },
    };
  });
  return { ...aligned, versions };
}

export const PACKETS: Packet[] = RAW_PACKETS.map(issuePacket);

export function getPacket(id: string): Packet | undefined {
  return PACKETS.find((packet) => packet.id === id);
}

export function currentVersion(packet: Packet): PacketVersion {
  return fixtureCurrentVersion(packet);
}

export function latestCorrections(): ReturnType<typeof fixtureLatestCorrections> {
  return fixtureLatestCorrections().map((row) => {
    const packet = getPacket(row.packet.id);
    return packet ? { ...row, packet } : row;
  });
}
