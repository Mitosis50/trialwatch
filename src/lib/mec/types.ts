import type { Digest } from "./digest";

export type ReviewResult = "COMPLETE" | "INCOMPLETE" | "BLOCKED";
export type RuleStatus = "SATISFIED" | "MISSING" | "BLOCKING";
export type EvidenceRelation = "supports" | "contradicts" | "contextualizes";
export type OutcomeDesignation = "primary" | "secondary" | "exploratory" | "post-hoc";
export type ProvenanceLevel = "LINK_ONLY" | "CAPTURED_COPY" | "REVIEWED_EXTRACTION" | "PUBLISHER_SIGNED";
export type CheckResult = "PASS" | "FAIL" | "UNKNOWN" | "NOT_CHECKED";
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

export const RULE_CODES = [
  "SCOPE_FIXED",
  "SOURCE_MANIFEST_BOUND",
  "CRITICAL_FIELDS_CHECKED",
  "METHOD_AND_LIMITATIONS_RECORDED",
  "DISAGREEMENTS_ACCOUNTED_FOR",
  "CONFLICT_REVIEW_COMPLETED",
  "PUBLICATION_ALLOWLIST_PASSED",
  "AUTHORIZED_SIGNOFF_PRESENT",
] as const;

export type RuleCode = (typeof RULE_CODES)[number];

export const CRITICAL_FIELD_KEYS = [
  "study_identity",
  "outcome_definition",
  "timeframe",
  "analysis_population",
  "numerator",
  "denominator",
  "effect_measure",
  "uncertainty_interval",
  "designation",
  "material_amendments",
] as const;

export type CriticalFieldKey = (typeof CRITICAL_FIELD_KEYS)[number];

export const CRITICAL_FIELD_LABELS: Record<CriticalFieldKey, string> = {
  study_identity: "Trial identity",
  outcome_definition: "Outcome definition",
  timeframe: "Timeframe",
  analysis_population: "Analysis population",
  numerator: "Numerator (events)",
  denominator: "Denominator (N)",
  effect_measure: "Effect measure",
  uncertainty_interval: "Uncertainty interval",
  designation: "Primary / secondary designation",
  material_amendments: "Material amendments",
};

export const MANDATORY_NON_ASSERTIONS = [
  "clinical_correctness",
  "individual_effectiveness_or_safety",
  "diagnosis_or_treatment_selection",
  "medical_necessity_or_coverage",
  "worldwide_evidence_completeness",
  "absence_of_fraud_bias_or_undisclosed_conflicts",
  "source_matches_real_world_conduct",
  "replacement_for_systematic_review_or_judgment",
] as const;

export type NonAssertionCode = (typeof MANDATORY_NON_ASSERTIONS)[number];

export const NON_ASSERTION_LABELS: Record<NonAssertionCode, string> = {
  clinical_correctness: "Clinical correctness",
  individual_effectiveness_or_safety: "Treatment effectiveness or safety for an individual",
  diagnosis_or_treatment_selection: "Diagnosis or treatment selection",
  medical_necessity_or_coverage: "Medical necessity or insurance coverage",
  worldwide_evidence_completeness: "Completeness of all worldwide evidence",
  absence_of_fraud_bias_or_undisclosed_conflicts:
    "Absence of fraud, publication bias, or undisclosed conflicts",
  source_matches_real_world_conduct:
    "That a source's contents accurately describe real-world trial conduct",
  replacement_for_systematic_review_or_judgment:
    "That the packet replaces a systematic review or professional judgment",
};

export interface Reviewer {
  key: string;
  attribution: string;
  role: "extractor" | "checker" | "adjudicator";
  domain: "methods" | "clinical" | "both";
  conflictDisclosure: string;
}

export interface SourceVersion {
  id: string;
  title: string;
  kind: "protocol" | "results" | "registry" | "correction" | "analysis_plan";
  originalUrl: string;
  capturedAt: string;
  documentDate: string | null;
  bytesDigest: Digest | null;
  rightsBasis: string;
  provenance: ProvenanceLevel;
  excerptTitle: string;
  excerpt: string;
}

export interface EvidenceLink {
  sourceVersionId: string;
  locator: string;
  relation: EvidenceRelation;
  extractionMethod: "human" | "ai_draft_then_human";
}

export interface FieldCheck {
  key: CriticalFieldKey;
  sourceLocator: string;
  reviewerA: string;
  reviewerB: string | null;
  documentedDisagreement: string | null;
  hiddenDisagreement: boolean;
}

export interface OutcomeClaim {
  id: string;
  population: string;
  intervention: string;
  comparator: string;
  outcome: string;
  timeframe: string;
  analysisPopulation: string;
  designation: OutcomeDesignation;
  attributedStatement: string;
  numerator: string;
  denominator: string;
  effectMeasure: string;
  uncertainty: string;
  isPatientImportant: boolean;
  isPrespecified: boolean;
  links: EvidenceLink[];
}

export interface Study {
  id: string;
  registryId: string;
  acronym: string;
  title: string;
  design: string;
  phase: string;
  sponsor: string;
  region: string;
  enrollment: string;
  status: string;
}

export interface RuleResult {
  code: RuleCode;
  status: RuleStatus;
  rationale: string;
}

export interface ReviewReceipt {
  record_type: typeof RECEIPT_TYPE;
  schema_version: typeof RECEIPT_SCHEMA;
  receipt_id: string;
  scope: {
    study_id: string;
    outcome_claim_id: string;
    population: string;
    intervention: string;
    comparator: string;
    outcome: string;
    timeframe: string;
    analysis_population: string;
  };
  policy: { id: string; version: string; digest: Digest };
  input_manifest_digest: Digest;
  run_digest: Digest;
  rules: Array<{ code: RuleCode; status: RuleStatus; rationale_ref: string }>;
  result: ReviewResult;
  not_asserted: string[];
  issuer_key_id: string;
  issuer_claimed_at: string;
  predecessor_receipt_digest: Digest | null;
  supersedes_receipt_digest: Digest | null;
  synthetic: true;
  notice: "Commons draft receipt — not a PoF-compatible receipt.";
}

export interface DetachedSeal {
  signing_profile: string;
  key_id: string;
  signature_encoding: "base64url";
  signature: string;
}

export interface SignedReviewEnvelope {
  receipt: ReviewReceipt;
  receipt_digest: Digest;
  seal: DetachedSeal | null;
}

export interface Challenge {
  id: string;
  targetVersion: number;
  filedAt: string;
  filer: string;
  reason: string;
  evidenceLocator: string;
  disposition: "open" | "upheld" | "not_upheld";
  dispositionNote: string;
}

export interface PacketVersion {
  version: number;
  publishedAt: string;
  summary: string;
  claim: OutcomeClaim;
  fieldChecks: FieldCheck[];
  result: ReviewResult;
  envelope: SignedReviewEnvelope;
  scientificAssessment: ScientificAssessment;
  scientificNote: string;
  integrity: IntegrityStatus;
  currency: CurrencyStatus;
}

export interface Packet {
  id: string;
  study: Study;
  sources: SourceVersion[];
  limitations: string;
  methodVersion: string;
  methodNote: string;
  reviewers: Reviewer[];
  conflictNote: string;
  publicationNote: string;
  currentVersion: number;
  versions: PacketVersion[];
  challenges: Challenge[];
  fixtureTag: string;
  fixturePurpose: string;
  usesDemoKey: boolean;
  allowLocalSecondReview: boolean;
}

export interface InclusionEntry {
  studyId: string;
  acronym: string;
  decision: "included" | "excluded";
  reason: string;
}

export interface Collection {
  id: string;
  name: string;
  question: string;
  protocolVersion: string;
  searchCutoff: string;
  eligibility: string[];
  inclusionLog: InclusionEntry[];
  methodsNote: string;
}

export interface VerifyCheck {
  name: string;
  result: CheckResult;
  detail: string;
}

export interface VerifyReport {
  checks: VerifyCheck[];
  overallLabel: string;
  overallHint: string;
  notice: string;
}
