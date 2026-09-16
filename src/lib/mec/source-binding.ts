import { digestOfText } from "./digest";
import { manifestCommitment, type InputManifest, type SourceSnapshot } from "./manifest";
import type { PacketExport, VerifyCheck, VerifyReport } from "./verifier";

type BundleExport = PacketExport & {
  manifest?: InputManifest;
  manifest_commitment?: string;
  sources?: Array<{ id: string; bytes_digest: string | null }>;
  snapshots?: SourceSnapshot[];
};

function check(name: string, result: VerifyCheck["result"], detail: string): VerifyCheck {
  return { name, result, detail };
}

export function tamperSourceBinding(exp: PacketExport): PacketExport {
  const bundle = exp as BundleExport;
  const snapshots = (bundle.snapshots ?? []).map((s, i) =>
    i === 0 && s.snapshot ? { ...s, snapshot: `${s.snapshot}\n[altered reference]` } : s,
  );
  const source_refs = exp.source_refs.map((r, i) =>
    i === 0 ? { ...r, bytes_digest: `sha256:${"0".repeat(64)}` } : r,
  );
  return { ...exp, snapshots, source_refs } as PacketExport;
}

export async function bindSources(exp: PacketExport, base: VerifyReport): Promise<VerifyReport> {
  const bundle = exp as BundleExport;
  const extra: VerifyCheck[] = [];
  const receipt = bundle.envelope.receipt;

  if (!bundle.manifest || !bundle.manifest_commitment) {
    extra.push(
      check(
        "manifest_commitment",
        "NOT_CHECKED",
        "Export does not include an input manifest. The receipt’s input_manifest_digest cannot be recomputed from this file.",
      ),
    );
  } else {
    const recomputedManifest = manifestCommitment(bundle.manifest);
    const commitmentOk =
      recomputedManifest === bundle.manifest_commitment &&
      recomputedManifest === receipt.input_manifest_digest;
    extra.push(
      check(
        "manifest_commitment",
        commitmentOk ? "PASS" : "FAIL",
        commitmentOk
          ? "Recomputed manifest commitment matches the receipt input_manifest_digest."
          : `Manifest commitment mismatch. Export ${bundle.manifest_commitment}; recomputed ${recomputedManifest}; receipt ${receipt.input_manifest_digest}.`,
      ),
    );
  }

  const snapshots = bundle.snapshots ?? [];
  let binding: VerifyCheck["result"] = "PASS";
  const notes: string[] = [];

  if (snapshots.length === 0 && (!bundle.sources || bundle.sources.length === 0)) {
    extra.push(
      check(
        "source_binding",
        "NOT_CHECKED",
        "No captured snapshots or source records were included. Binding of source bytes cannot be checked.",
      ),
    );
    extra.push(
      check("source_availability", "UNAVAILABLE", "Missing source content. Result is unavailable, not a silent pass."),
    );
  } else {
    for (const snap of snapshots) {
      if (snap.snapshot_status === "captured") {
        if (!snap.snapshot) {
          binding = "FAIL";
          notes.push(`${snap.id}: marked captured but snapshot text is missing.`);
          continue;
        }
        const recomputed = digestOfText(snap.snapshot);
        if (snap.bytes_digest !== recomputed) {
          binding = "FAIL";
          notes.push(`${snap.id}: snapshot hash ${recomputed} does not match declared ${snap.bytes_digest}.`);
        }
        const declared = exp.source_refs.find((r) => r.id === snap.id);
        if (declared?.bytes_digest && declared.bytes_digest !== recomputed) {
          binding = "FAIL";
          notes.push(`${snap.id}: source_ref digest no longer matches captured bytes.`);
        }
      }
    }
    for (const ref of exp.source_refs) {
      if (ref.bytes_digest && /^sha256:0+$/.test(ref.bytes_digest)) {
        binding = "FAIL";
        notes.push(`${ref.id}: source_ref digest is all zeros.`);
      }
    }
    extra.push(
      check(
        "source_binding",
        binding,
        binding === "PASS"
          ? "Captured source snapshots recompute to their declared SHA-256 digests."
          : notes.join(" "),
      ),
    );
    const captured = snapshots.filter((s) => s.snapshot_status === "captured");
    extra.push(
      check(
        "source_availability",
        captured.length ? (snapshots.length === captured.length ? "PASS" : "NOT_CHECKED") : "UNAVAILABLE",
        captured.length
          ? "Captured copies were checked. Omitted documents remain not-checked."
          : "No permitted source snapshot is present.",
      ),
    );
  }

  const evidence = extra.concat(
    base.checks.filter((c) => c.name === "evidence_availability").map((c) => {
      if (binding === "FAIL") {
        return {
          ...c,
          result: "UNKNOWN" as const,
          detail: "Source-reference digest does not match captured bytes. evidence_availability is not a pass.",
        };
      }
      if (snapshots.some((s) => s.snapshot_status === "captured" && s.snapshot)) return c;
      return {
        ...c,
        result: "UNAVAILABLE" as const,
        detail: "A source_ref digest alone is not evidence availability.",
      };
    }),
  );

  const checks = [
    ...base.checks.filter((c) => c.name !== "evidence_availability"),
    ...extra.filter((c) => c.name !== "evidence_availability"),
    ...evidence.filter((c) => c.name === "evidence_availability"),
  ];
  const failed = checks.filter((c) => c.result === "FAIL").map((c) => c.name);
  return {
    ...base,
    checks,
    overallLabel: failed.length ? `Checks failed: ${failed.join(", ")}` : base.overallLabel,
  };
}
