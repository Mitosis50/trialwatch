import type {
  CurrencyStatus,
  IntegrityStatus,
  ReviewResult,
  ScientificAssessment,
} from "./types";

export function formatStamp(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return (
    d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC",
    }) + " UTC"
  );
}

export function processLabel(result: ReviewResult): string {
  if (result === "COMPLETE") return "Review process complete";
  if (result === "INCOMPLETE") return "Review process incomplete";
  return "Review process blocked";
}

export function processShort(result: ReviewResult): string {
  return result;
}

export function scientificLabel(s: ScientificAssessment): string {
  if (s === "disagreement_retained") return "Reviewer disagreement remains";
  if (s === "no_material_disagreement") return "No material methodological disagreement recorded";
  return "Scientific assessment not offered";
}

export function integrityLabel(s: IntegrityStatus): string {
  if (s === "unsigned_draft") return "Unsigned Commons draft";
  if (s === "digest_matches") return "Digest matches";
  if (s === "demo_signature") return "Demo signature present";
  return "Digest mismatch";
}

export function currencyLabel(s: CurrencyStatus): string {
  if (s === "current") return "This is the current packet version";
  if (s === "superseded") return "Superseded by a later version";
  return "Current check unavailable";
}
