import { digestOf, isDigest } from "./digest";
import { POLICY_BODY } from "./policy";
import { verifyDemoSeal } from "./seal";
import { PRODUCTION_TRUSTED_KEY_IDS } from "./keys";
import {
  EXPORT_TYPE,
  MANDATORY_NON_ASSERTIONS,
  POLICY_ID,
  POLICY_VERSION,
  RECEIPT_SCHEMA,
  RECEIPT_TYPE,
  RULE_CODES,
  type ReviewReceipt,
  type SignedReviewEnvelope,
  type VerifyCheck,
  type VerifyReport,
} from "./types";

export type { VerifyCheck, VerifyReport };

const MAX_IMPORT_BYTES = 2 * 1024 * 1024;

export interface PacketExport {
  record_type: typeof EXPORT_TYPE;
  schema_version: typeof RECEIPT_SCHEMA;
  notice: string;
  synthetic: true;
  packet_id: string;
  version: number;
  envelope: SignedReviewEnvelope;
  policy: typeof POLICY_BODY;
  ancestors: SignedReviewEnvelope[];
  source_refs: Array<{ id: string; title: string; locator_note: string; bytes_digest: string | null }>;
  evidence_included: boolean;
}

function check(name: string, result: VerifyCheck["result"], detail: string): VerifyCheck {
  return { name, result, detail };
}

export function parseExportJson(text: string): { ok: true; value: PacketExport } | { ok: false; error: string } {
  if (new TextEncoder().encode(text).length > MAX_IMPORT_BYTES) {
    return { ok: false, error: "Import exceeds the 2 MiB public JSON limit." };
  }
  try {
    const value = JSON.parse(text) as unknown;
    if (!value || typeof value !== "object") return { ok: false, error: "Root value is not an object." };
    const rec = value as PacketExport;
    if (rec.record_type !== EXPORT_TYPE) {
      return { ok: false, error: "Not a Commons packet export (record_type must be mec.packet_export)." };
    }
    if (rec.schema_version !== RECEIPT_SCHEMA) {
      return { ok: false, error: `Unsupported schema_version ${String(rec.schema_version)}.` };
    }
    if (!rec.envelope?.receipt) return { ok: false, error: "Export is missing envelope.receipt." };
    return { ok: true, value: rec };
  } catch {
    return { ok: false, error: "JSON is malformed." };
  }
}

export async function verifyExport(exp: PacketExport): Promise<VerifyReport> {
  const checks: VerifyCheck[] = [];
  const receipt = exp.envelope.receipt;

  const schemaOk =
    receipt.record_type === RECEIPT_TYPE &&
    receipt.schema_version === RECEIPT_SCHEMA &&
    receipt.policy?.id === POLICY_ID &&
    receipt.policy?.version === POLICY_VERSION;
  checks.push(
    check(
      "schema_support",
      schemaOk ? "PASS" : "FAIL",
      schemaOk
        ? "Draft Commons schema 0.1.0-draft is supported."
        : "Schema, record type, or policy identifier is not supported by this verifier.",
    ),
  );

  const recomputed = digestOf(receipt);
  const digestOk = exp.envelope.receipt_digest === recomputed && isDigest(recomputed);
  checks.push(
    check(
      "digest_validity",
      digestOk ? "PASS" : "FAIL",
      digestOk
        ? "Recomputed canonical digest matches the envelope."
        : `Digest mismatch. Envelope has ${exp.envelope.receipt_digest}; recomputed ${recomputed}.`,
    ),
  );

  if (!exp.envelope.seal) {
    checks.push(
      check(
        "signature_validity",
        "NOT_CHECKED",
        "Envelope is explicitly unsigned. This is expected for most Release A draft receipts.",
      ),
    );
    checks.push(
      check(
        "issuer_trust",
        "FAIL",
        "Unsigned draft. No production issuer trust is established.",
      ),
    );
  } else {
    const seal = await verifyDemoSeal(receipt, exp.envelope.seal);
    checks.push(
      check(
        "signature_validity",
        seal.mathValid ? "PASS" : "FAIL",
        seal.detail,
      ),
    );
    checks.push(
      check(
        "issuer_trust",
        seal.productionTrusted ? "PASS" : "FAIL",
        seal.productionTrusted
          ? "Issuer key is on the production allowlist for this policy."
          : `Issuer key ${exp.envelope.seal.key_id} is not on the production trust allowlist (allowlist is empty in Release A). Demo keys are rejected as production anchors.`,
      ),
    );
  }

  const expectedPolicyDigest = digestOf(POLICY_BODY);
  const nonAssertionsExact =
    Array.isArray(receipt.not_asserted) &&
    receipt.not_asserted.length === MANDATORY_NON_ASSERTIONS.length &&
    MANDATORY_NON_ASSERTIONS.every((code) => receipt.not_asserted.includes(code));
  const rulesOk =
    Array.isArray(receipt.rules) &&
    RULE_CODES.every((code) => receipt.rules.some((r) => r.code === code));
  const policyOk =
    receipt.policy.digest === expectedPolicyDigest && nonAssertionsExact && rulesOk && receipt.synthetic === true;
  checks.push(
    check(
      "policy_consistency",
      policyOk ? "PASS" : "FAIL",
      !nonAssertionsExact
        ? "Mandatory non-assertions are missing or altered. That is a verification failure even if the payload is re-signed."
        : receipt.policy.digest !== expectedPolicyDigest
          ? "Bound policy digest does not match the frozen MED-EVIDENCE-REVIEW@0.1.0-draft body."
          : policyOk
            ? "Policy identifier, digest, rule set, and mandatory non-assertions match the frozen draft."
            : "Policy body and receipt rules are inconsistent.",
    ),
  );

  const ancestors = exp.ancestors ?? [];
  let ancestorResult: VerifyCheck["result"] = "PASS";
  let ancestorDetail = "No ancestor receipts required.";
  if (receipt.predecessor_receipt_digest || receipt.supersedes_receipt_digest) {
    const target = receipt.supersedes_receipt_digest ?? receipt.predecessor_receipt_digest;
    const found = ancestors.some((a) => a.receipt_digest === target);
    if (!found) {
      ancestorResult = "FAIL";
      ancestorDetail = "Declared predecessor/supersession digest is not present in the export ancestors.";
    } else {
      const ids = new Set<string>();
      for (const a of ancestors) {
        if (ids.has(a.receipt_digest)) {
          ancestorResult = "FAIL";
          ancestorDetail = "Ancestor list contains a repeated digest.";
          break;
        }
        ids.add(a.receipt_digest);
      }
      if (ancestorResult === "PASS") {
        ancestorDetail = "Required ancestor receipt is present and lineage is acyclic in this export.";
      }
    }
  }
  checks.push(check("ancestor_completeness", ancestorResult, ancestorDetail));

  const superseded = ancestors.some((a) => a.receipt.supersedes_receipt_digest === exp.envelope.receipt_digest);
  // Currency: this verifier is offline. If this receipt is superseded by a later ancestor, say so.
  const later = ancestors.find((a) => a.receipt.supersedes_receipt_digest === exp.envelope.receipt_digest);
  if (later) {
    checks.push(
      check(
        "correction_currency",
        "FAIL",
        `This receipt has been superseded by ${later.receipt.receipt_id}. The artifact can still be authentic as history.`,
      ),
    );
  } else if (receipt.supersedes_receipt_digest) {
    checks.push(
      check(
        "correction_currency",
        "PASS",
        "This receipt itself supersedes an earlier artifact. Offline verifier cannot guarantee no later correction exists on a registry.",
      ),
    );
  } else {
    checks.push(
      check(
        "correction_currency",
        "UNKNOWN",
        "Offline verifier cannot guarantee that no later correction exists. Current-status remains unknown without a live registry.",
      ),
    );
  }

  checks.push(
    check(
      "evidence_availability",
      exp.evidence_included ? "PASS" : "UNKNOWN",
      exp.evidence_included
        ? "Export includes source references for the bound manifest."
        : "Export does not include source attachments. Availability of third-party documents cannot be guaranteed.",
    ),
  );

  const failed = checks.filter((c) => c.result === "FAIL").map((c) => c.name);
  const overallLabel = failed.length
    ? `Checks failed: ${failed.join(", ")}`
    : "Performed checks did not fail";
  const overallHint = superseded
    ? "A historical artifact can pass integrity and still not be current."
    : "A passing integrity check is not a clinical conclusion.";

  return {
    checks,
    overallLabel,
    overallHint,
    notice:
      "This is an independent structural verifier for Commons draft receipts. It does not repeat a clinical trial, does not establish treatment effectiveness, and is not a Proof of Fulfillment verifier.",
  };
}

export function tamperNonAssertions(exp: PacketExport): PacketExport {
  const receipt: ReviewReceipt = {
    ...exp.envelope.receipt,
    not_asserted: exp.envelope.receipt.not_asserted.filter((c) => c !== "clinical_correctness"),
  };
  return {
    ...exp,
    envelope: {
      receipt,
      receipt_digest: exp.envelope.receipt_digest,
      seal: exp.envelope.seal,
    },
  };
}

export function tamperPayload(exp: PacketExport): PacketExport {
  const receipt: ReviewReceipt = {
    ...exp.envelope.receipt,
    result: exp.envelope.receipt.result === "COMPLETE" ? "BLOCKED" : "COMPLETE",
  };
  return {
    ...exp,
    envelope: {
      receipt,
      receipt_digest: exp.envelope.receipt_digest,
      seal: exp.envelope.seal,
    },
  };
}
