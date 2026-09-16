import type { Digest } from "./digest";

export type ReviewResult = "COMPLETE" | "INCOMPLETE" | "BLOCKED";
export type RuleStatus = "SATISFIED" | "MISSING" | "BLOCKING";
export type EvidenceRelation = "supports" | "contradicts" | "contextualizes";
export type OutcomeDesignation = "primary" | "secondary" | "exploratory" | "post-hoc";
export type ProvenanceLevel = "LINK_ONLY" | "CAPTURED_COPY" | "REVIEWED_EXTRACTION" | "PUBLISHER_SIGNED";
export type CheckResult = "PASS" | "FAIL" | "UNKNOWN" | "NOT_CHECKED" | "UNAVAILABLE";
export type SnapshotStatus = "captured" | "unavailable" | "external_dependency";
export type ScientificAssessment =
  | "no_material_disagreement"
  | "disagreement_retained"
  | "not_assessed";
export type CurrencyStatus = "current" | "superseded" | "unknown";
export type IntegrityStatus = "unsigned_draft" | "digest_matches" | "demo_signature" | "digest_mismatch";

export const POLICY_ID = "MED-EVIDENCE-REVIEW";
export const POLICY_VERSION = "0.1.0-draft";
export const RECEIPT_SCHEMA = "0.1.0-draft";
export const RECEIPT_TYPE = "mec.review_receipt";
export const EXPORT_TYPE = "mec.packet_export";
export const DEMO_ISSUER_KEY_ID = "mec.demo.local-prototype/ed25519";
export const LOCAL_ISSUER_KEY_ID = "mec.unsigned.local-draft";
