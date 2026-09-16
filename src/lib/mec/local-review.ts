import { create } from "zustand";
import { persist } from "zustand/middleware";
import { digestOf } from "./digest";
import { evaluateReview } from "./policy";
import { currentVersion } from "./fixtures";
import { buildInputManifest, manifestCommitment } from "./manifest";
import {
  CRITICAL_FIELD_KEYS,
  LOCAL_ISSUER_KEY_ID,
  MANDATORY_NON_ASSERTIONS,
  POLICY_ID,
  POLICY_VERSION,
  RECEIPT_SCHEMA,
  RECEIPT_TYPE,
  type CriticalFieldKey,
  type FieldCheck,
  type Packet,
  type PacketVersion,
  type ReviewReceipt,
} from "./types";
import { POLICY_BODY } from "./policy";

export interface LocalDraft {
  values: Partial<Record<CriticalFieldKey, string>>;
  notes: Partial<Record<CriticalFieldKey, string>>;
  signedOffAt: string | null;
}

interface Store {
  drafts: Record<string, LocalDraft>;
  setField: (packetId: string, key: CriticalFieldKey, value: string) => void;
  setNote: (packetId: string, key: CriticalFieldKey, value: string) => void;
  signOff: (packetId: string) => void;
  reset: (packetId: string) => void;
}

const empty = (): LocalDraft => ({ values: {}, notes: {}, signedOffAt: null });

export const useLocalReviews = create<Store>()(
  persist(
    (set) => ({
      drafts: {},
      setField: (packetId, key, value) =>
        set((s) => {
          const cur = s.drafts[packetId] ?? empty();
          return {
            drafts: {
              ...s.drafts,
              [packetId]: {
                ...cur,
                signedOffAt: null,
                values: { ...cur.values, [key]: value },
              },
            },
          };
        }),
      setNote: (packetId, key, value) =>
        set((s) => {
          const cur = s.drafts[packetId] ?? empty();
          return {
            drafts: {
              ...s.drafts,
              [packetId]: {
                ...cur,
                signedOffAt: null,
                notes: { ...cur.notes, [key]: value },
              },
            },
          };
        }),
      signOff: (packetId) =>
        set((s) => {
          const cur = s.drafts[packetId] ?? empty();
          return {
            drafts: {
              ...s.drafts,
              [packetId]: { ...cur, signedOffAt: new Date().toISOString() },
            },
          };
        }),
      reset: (packetId) =>
        set((s) => {
          const next = { ...s.drafts };
          delete next[packetId];
          return { drafts: next };
        }),
    }),
    { name: "mec-local-reviews" },
  ),
);

export function overlayPacket(packet: Packet, draft: LocalDraft | undefined): Packet {
  if (!packet.allowLocalSecondReview || !draft) return packet;
  const current = currentVersion(packet);
  const fieldChecks: FieldCheck[] = current.fieldChecks.map((f) => {
    const local = draft.values[f.key];
    if (local === undefined || local === "") return f;
    const differs = f.reviewerA.trim() !== local.trim();
    const note = draft.notes[f.key]?.trim() || null;
    return {
      ...f,
      reviewerB: local,
      documentedDisagreement: differs ? note || "Local checker recorded a different value." : null,
      hiddenDisagreement: false,
    };
  });
  const allFilled = CRITICAL_FIELD_KEYS.every((k) => {
    const f = fieldChecks.find((x) => x.key === k);
    return f && f.reviewerB !== null && f.reviewerB.trim() !== "";
  });
  const signed = Boolean(draft.signedOffAt) && allFilled;
  const evaluated = evaluateReview({
    scopeComplete: true,
    sourcesBound: true,
    sourceConflict: false,
    fields: fieldChecks,
    methodRecorded: true,
    limitationsRecorded: true,
    conflictReview: "passed",
    publicationAllowlist: "passed",
    signoff: signed ? "present" : "missing",
    prohibitedContent: false,
  });
  const receipt: ReviewReceipt = {
    ...current.envelope.receipt,
    record_type: RECEIPT_TYPE,
    schema_version: RECEIPT_SCHEMA,
    receipt_id: `R-${packet.id}-local-draft`,
    policy: { id: POLICY_ID, version: POLICY_VERSION, digest: digestOf(POLICY_BODY) },
    input_manifest_digest: manifestCommitment(
      buildInputManifest(packet, { ...current, claim: current.claim, fieldChecks } as PacketVersion),
    ),
    run_digest: digestOf({ local: true, fieldChecks, result: evaluated.result }),
    rules: evaluated.rules.map((r) => ({
      code: r.code,
      status: r.status,
      rationale_ref: r.rationale,
    })),
    result: evaluated.result,
    not_asserted: [...MANDATORY_NON_ASSERTIONS],
    issuer_key_id: LOCAL_ISSUER_KEY_ID,
    issuer_claimed_at: draft.signedOffAt ?? new Date().toISOString(),
    notice: "Commons draft receipt — not a PoF-compatible receipt.",
    synthetic: true,
  };
  const localVersion: PacketVersion = {
    ...current,
    fieldChecks,
    result: evaluated.result,
    scientificAssessment: fieldChecks.some((f) => f.documentedDisagreement)
      ? "disagreement_retained"
      : signed
        ? "no_material_disagreement"
        : "not_assessed",
    scientificNote: signed
      ? "Local second review only. This overlay is not a published packet."
      : "Local draft in progress. Not published.",
    envelope: {
      receipt,
      receipt_digest: digestOf(receipt),
      seal: null,
    },
  };
  return {
    ...packet,
    versions: packet.versions.map((v) => (v.version === current.version ? localVersion : v)),
  };
}
