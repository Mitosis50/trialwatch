import { digestOf, digestOfText } from "./digest";
import { evaluateReview, POLICY_BODY, type EvaluationInput } from "./policy";
import {
  DEMO_ISSUER_KEY_ID,
  LOCAL_ISSUER_KEY_ID,
  MANDATORY_NON_ASSERTIONS,
  POLICY_ID,
  POLICY_VERSION,
  RECEIPT_SCHEMA,
  RECEIPT_TYPE,
  type Collection,
  type FieldCheck,
  type IntegrityStatus,
  type OutcomeClaim,
  type Packet,
  type PacketVersion,
  type Reviewer,
  type ReviewReceipt,
  type ScientificAssessment,
  type SourceVersion,
  type Study,
} from "./types";

const CAPTURED = "2026-06-12T09:00:00Z";

const A: Reviewer = {
  key: "role:extractor.methods.01",
  attribution: "R. Okonkwo, methods reviewer (synthetic)",
  role: "extractor",
  domain: "methods",
  conflictDisclosure: "No relevant financial relationships. Synthetic attribution.",
};

const B: Reviewer = {
  key: "role:checker.clinical.01",
  attribution: "M. Ellis, clinical-domain reviewer (synthetic)",
  role: "checker",
  domain: "clinical",
  conflictDisclosure: "No relevant financial relationships. Synthetic attribution.",
};

const B_CONFLICT: Reviewer = {
  key: "role:checker.sponsor.99",
  attribution: "J. Hale, clinical reviewer (synthetic) — Northhaven employee",
  role: "checker",
  domain: "clinical",
  conflictDisclosure: "Employed by the trial sponsor. Prohibited assignment under the pilot rule.",
};

function src(
  id: string,
  kind: SourceVersion["kind"],
  title: string,
  excerptTitle: string,
  excerpt: string,
  extra?: Partial<SourceVersion>,
): SourceVersion {
  const body = `${title}\n${excerpt}`;
  return {
    id,
    title,
    kind,
    originalUrl: `https://synthetic.evidence-commons.invalid/sources/${id}`,
    capturedAt: CAPTURED,
    documentDate: "2025-11-02",
    bytesDigest: digestOfText(body),
    rightsBasis: "Synthetic fixture authored for Release A. Not a real publication.",
    provenance: "CAPTURED_COPY",
    excerptTitle,
    excerpt,
    ...extra,
  };
}

function fields(values: Partial<Record<FieldCheck["key"], Partial<FieldCheck>>> & { base: Record<FieldCheck["key"], string> }): FieldCheck[] {
  const keys = Object.keys(values.base) as FieldCheck["key"][];
  return keys.map((key) => {
    const override = values[key] ?? {};
    const a = override.reviewerA ?? values.base[key];
    return {
      key,
      sourceLocator: override.sourceLocator ?? "Table 3, ITT, day 90",
      reviewerA: a,
      reviewerB: override.reviewerB === undefined ? a : override.reviewerB,
      documentedDisagreement: override.documentedDisagreement ?? null,
      hiddenDisagreement: override.hiddenDisagreement ?? false,
    };
  });
}

function glucorilFields(partial?: Partial<Record<FieldCheck["key"], Partial<FieldCheck>>>): FieldCheck[] {
  return fields({
    base: {
      study_identity: "SYNTHETIC-TRIAL-001 (GLIDE-90)",
      outcome_definition: "Composite of all-cause hospitalization or HbA1c > 8.0%",
      timeframe: "90 days after randomization",
      analysis_population: "Intention-to-treat",
      numerator: "10 vs 18 events",
      denominator: "100 vs 100",
      effect_measure: "Risk difference −8.0 percentage points",
      uncertainty_interval: "95% CI −17.4 to +1.4",
      designation: "Primary",
      material_amendments: "None identified in the captured protocol version",
    },
    ...partial,
  });
}

interface BuildArgs {
  id: string;
  fixtureTag: string;
  fixturePurpose: string;
  study: Study;
  sources: SourceVersion[];
  claim: OutcomeClaim;
  fieldChecks: FieldCheck[];
  limitations: string;
  methodNote: string;
  reviewers: Reviewer[];
  conflictNote: string;
  publicationNote: string;
  evalInput: Omit<EvaluationInput, "fields">;
  scientificAssessment: ScientificAssessment;
  scientificNote: string;
  integrity?: IntegrityStatus;
  usesDemoKey?: boolean;
  allowLocalSecondReview?: boolean;
  publishedAt?: string;
  versionSummary?: string;
  predecessor?: { envelopeDigest: string; receiptId: string };
}

function buildReceipt(
  packetId: string,
  version: number,
  study: Study,
  claim: OutcomeClaim,
  fieldChecks: FieldCheck[],
  evalInput: Omit<EvaluationInput, "fields">,
  issuer: string,
  issuedAt: string,
  supersedes: string | null,
  predecessor: string | null,
): { receipt: ReviewReceipt; result: ReturnType<typeof evaluateReview>["result"]; rules: ReturnType<typeof evaluateReview>["rules"] } {
  const { result, rules } = evaluateReview({ ...evalInput, fields: fieldChecks });
  const policyDigest = digestOf(POLICY_BODY);
  const manifest = digestOf({
    sources: claim.links.map((l) => l.sourceVersionId),
    locators: fieldChecks.map((f) => [f.key, f.sourceLocator]),
    claim_id: claim.id,
  });
  const run = digestOf({
    policy: POLICY_ID,
    version: POLICY_VERSION,
    fieldChecks,
    rules,
    result,
  });
  const receipt: ReviewReceipt = {
    record_type: RECEIPT_TYPE,
    schema_version: RECEIPT_SCHEMA,
    receipt_id: `R-${packetId}-v${version}`,
    scope: {
      study_id: study.id,
      outcome_claim_id: claim.id,
      population: claim.population,
      intervention: claim.intervention,
      comparator: claim.comparator,
      outcome: claim.outcome,
      timeframe: claim.timeframe,
      analysis_population: claim.analysisPopulation,
    },
    policy: { id: POLICY_ID, version: POLICY_VERSION, digest: policyDigest },
    input_manifest_digest: manifest,
    run_digest: run,
    rules: rules.map((r) => ({
      code: r.code,
      status: r.status,
      rationale_ref: r.rationale,
    })),
    result,
    not_asserted: [...MANDATORY_NON_ASSERTIONS],
    issuer_key_id: issuer,
    issuer_claimed_at: issuedAt,
    predecessor_receipt_digest: predecessor as ReviewReceipt["predecessor_receipt_digest"],
    supersedes_receipt_digest: supersedes as ReviewReceipt["supersedes_receipt_digest"],
    synthetic: true,
    notice: "Commons draft receipt — not a PoF-compatible receipt.",
  };
  return { receipt, result, rules };
}

function versionOf(args: BuildArgs, version: number, currency: PacketVersion["currency"], extra?: Partial<PacketVersion>): PacketVersion {
  const issuer = args.usesDemoKey ? DEMO_ISSUER_KEY_ID : LOCAL_ISSUER_KEY_ID;
  const issuedAt = args.publishedAt ?? "2026-07-08T15:00:00Z";
  const built = buildReceipt(
    args.id,
    version,
    args.study,
    args.claim,
    args.fieldChecks,
    args.evalInput,
    issuer,
    issuedAt,
    extra?.envelope?.receipt.supersedes_receipt_digest ?? null,
    extra?.envelope?.receipt.predecessor_receipt_digest ?? null,
  );
  const envelope = {
    receipt: built.receipt,
    receipt_digest: digestOf(built.receipt),
    seal: null,
  };
  return {
    version,
    publishedAt: issuedAt,
    summary: args.versionSummary ?? `Version ${version} of ${args.study.acronym}.`,
    claim: args.claim,
    fieldChecks: args.fieldChecks,
    result: built.result,
    scientificAssessment: args.scientificAssessment,
    scientificNote: args.scientificNote,
    integrity: args.integrity ?? (args.usesDemoKey ? "demo_signature" : "unsigned_draft"),
    currency,
    ...extra,
    envelope: extra?.envelope ?? envelope,
  };
}

function packet(args: BuildArgs, versions: PacketVersion[]): Packet {
  return {
    id: args.id,
    study: args.study,
    sources: args.sources,
    limitations: args.limitations,
    methodVersion: "structured-reviewer-notes@0.1.0-draft",
    methodNote: args.methodNote,
    reviewers: args.reviewers,
    conflictNote: args.conflictNote,
    publicationNote: args.publicationNote,
    currentVersion: versions[versions.length - 1]!.version,
    versions,
    challenges: [],
    fixtureTag: args.fixtureTag,
    fixturePurpose: args.fixturePurpose,
    usesDemoKey: args.usesDemoKey ?? false,
    allowLocalSecondReview: args.allowLocalSecondReview ?? false,
  };
}

const RESULTS_001 = src(
  "SRC-001-results",
  "results",
  "GLIDE-90 synthetic results report, version 2025-11-02",
  "Table 3. Primary composite at day 90 — ITT",
  [
    "Arm                              Events    N",
    "Glucoril 10 mg + metformin       10        100",
    "Metformin alone                  18        100",
    "Risk difference (percentage pts) −8.0",
    "95% CI                           −17.4 to +1.4",
    "Missing primary outcome          9 (Glucoril) / 7 (control)",
    "Population note                  ITT. Per-protocol N is 88 vs 91 and is not the primary analysis.",
  ].join("\n"),
);

const PROTOCOL_001 = src(
  "SRC-001-protocol",
  "protocol",
  "GLIDE-90 synthetic protocol, version 2024-03-18",
  "Section 7.1 Primary endpoint",
  [
    "Primary endpoint: composite of all-cause hospitalization or HbA1c > 8.0% at day 90.",
    "Analysis population: intention-to-treat, all randomized participants.",
    "No protocol amendment affecting the primary endpoint is recorded in this version.",
    "Sample size: 200 randomized, 1:1.",
  ].join("\n"),
  { documentDate: "2024-03-18" },
);

function claimFor(
  id: string,
  studyId: string,
  statement: string,
  links: OutcomeClaim["links"],
  extra?: Partial<OutcomeClaim>,
): OutcomeClaim {
  return {
    id,
    population: "Adults with newly diagnosed type 2 diabetes",
    intervention: "Glucoril 10 mg daily plus metformin",
    comparator: "Metformin alone",
    outcome: "Composite of all-cause hospitalization or HbA1c > 8.0%",
    timeframe: "90 days after randomization",
    analysisPopulation: "Intention-to-treat",
    designation: "primary",
    attributedStatement: statement,
    numerator: "10 vs 18",
    denominator: "100 vs 100",
    effectMeasure: "Risk difference −8.0 percentage points",
    uncertainty: "95% CI −17.4 to +1.4",
    isPatientImportant: true,
    isPrespecified: true,
    links,
    ...extra,
  };
}

const evalComplete = {
  scopeComplete: true,
  sourcesBound: true,
  sourceConflict: false,
  methodRecorded: true,
  limitationsRecorded: true,
  conflictReview: "passed" as const,
  publicationAllowlist: "passed" as const,
  signoff: "present" as const,
  prohibitedContent: false,
};

function study(
  n: string,
  acronym: string,
  title: string,
  sponsor: string,
  enrollment: string,
  extra?: Partial<Study>,
): Study {
  return {
    id: `SYNTHETIC-TRIAL-${n}`,
    registryId: `NCT-SYNTH-${n.padStart(4, "0")}`,
    acronym,
    title,
    design: "Randomized, parallel-group, open-label with blinded endpoint adjudication (synthetic)",
    phase: "Phase 3 (synthetic)",
    sponsor,
    region: "Fictional multi-country sites",
    enrollment,
    status: "Completed (synthetic report)",
    ...extra,
  };
}

function make001(): Packet {
  const claimV1 = claimFor(
    "CLM-001-primary",
    "SYNTHETIC-TRIAL-001",
    "The report states that 10 of 120 Glucoril-arm participants and 18 of 120 control-arm participants met the primary composite at day 90 (risk difference −6.7 pp).",
    [
      { sourceVersionId: "SRC-001-results", locator: "Table 2, day 90, all recorded cases", relation: "supports", extractionMethod: "human" },
      { sourceVersionId: "SRC-001-protocol", locator: "Section 7.1 Primary endpoint", relation: "contextualizes", extractionMethod: "human" },
    ],
    { numerator: "10 vs 18", denominator: "120 vs 120", effectMeasure: "Risk difference −6.7 percentage points", uncertainty: "95% CI −14.8 to +1.4" },
  );
  const fieldsV1 = glucorilFields({
    study_identity: { reviewerA: "SYNTHETIC-TRIAL-001 (GLIDE-90)", reviewerB: "SYNTHETIC-TRIAL-001 (GLIDE-90)", sourceLocator: "Registry header" },
    denominator: {
      reviewerA: "120 vs 120",
      reviewerB: "120 vs 120",
      sourceLocator: "Table 2, all recorded cases",
    },
    numerator: { sourceLocator: "Table 2, all recorded cases" },
    effect_measure: { reviewerA: "Risk difference −6.7 percentage points", reviewerB: "Risk difference −6.7 percentage points" },
    uncertainty_interval: { reviewerA: "95% CI −14.8 to +1.4", reviewerB: "95% CI −14.8 to +1.4" },
  });
  const argsV1: BuildArgs = {
    id: "SYNTHETIC-TRIAL-001",
    fixtureTag: "correction-lineage",
    fixturePurpose: "Complete process, then a source-location challenge, then a visible correction. Original digest still matches.",
    study: study("001", "GLIDE-90", "Glucoril in newly diagnosed type 2 diabetes: 90-day composite (synthetic)", "Northhaven Therapeutics (synthetic)", "200 randomized"),
    sources: [PROTOCOL_001, RESULTS_001],
    claim: claimV1,
    fieldChecks: fieldsV1,
    limitations:
      "Open-label design. Missing primary outcome in 16 participants. The published v1 used Table 2 (all recorded cases, N=120 listed) rather than the ITT table.",
    methodNote: "Structured reviewer notes. Not a Cochrane RoB 2 assessment and not Cochrane-endorsed.",
    reviewers: [A, B],
    conflictNote: "Neither reviewer reported a prohibited relationship.",
    publicationNote: "Synthetic fixture. No patient identifiers.",
    evalInput: evalComplete,
    scientificAssessment: "disagreement_retained",
    scientificNote:
      "Reviewers agree on the extracted numbers for this version and retain a methodological disagreement: whether missing outcome data could overturn the direction of the estimate.",
    publishedAt: "2026-07-01T12:00:00Z",
    versionSummary: "First published extraction. Used Table 2 denominators (120).",
  };
  const v1 = versionOf(argsV1, 1, "superseded");

  const claimV2 = claimFor(
    "CLM-001-primary",
    "SYNTHETIC-TRIAL-001",
    "The ITT table reports 10 of 100 Glucoril-arm participants and 18 of 100 control-arm participants met the primary composite at day 90 (risk difference −8.0 pp, 95% CI −17.4 to +1.4).",
    [
      { sourceVersionId: "SRC-001-results", locator: "Table 3, ITT, day 90", relation: "supports", extractionMethod: "human" },
      { sourceVersionId: "SRC-001-protocol", locator: "Section 7.1 Primary endpoint", relation: "contextualizes", extractionMethod: "human" },
    ],
  );
  const fieldsV2 = glucorilFields({
    study_identity: { sourceLocator: "Registry header" },
    denominator: {
      reviewerA: "100 vs 100",
      reviewerB: "100 vs 100",
      sourceLocator: "Table 3, ITT, day 90",
      documentedDisagreement: "v1 used Table 2 (N=120). Challenge C1 upheld. ITT denominator is 100.",
    },
  });
  const argsV2: BuildArgs = {
    ...argsV1,
    claim: claimV2,
    fieldChecks: fieldsV2,
    limitations:
      "Open-label design. Missing primary outcome in 16 participants (9 Glucoril, 7 control). Interval includes no difference. Unresolved disagreement remains about whether a worst-case missing-data analysis could change the sign of the estimate.",
    publishedAt: "2026-07-20T16:30:00Z",
    versionSummary: "Corrected ITT extraction after challenge C1. Denominator 100 vs 100.",
    scientificNote:
      "Methodological disagreement remains about missing outcome data. Process is complete because the disagreement is visible.",
  };
  let v2 = versionOf(argsV2, 2, "current");
  v2 = {
    ...v2,
    envelope: {
      ...v2.envelope,
      receipt: {
        ...v2.envelope.receipt,
        predecessor_receipt_digest: v1.envelope.receipt_digest,
        supersedes_receipt_digest: v1.envelope.receipt_digest,
      },
    },
  };
  v2 = { ...v2, envelope: { ...v2.envelope, receipt_digest: digestOf(v2.envelope.receipt) } };

  const pkt = packet(argsV2, [v1, v2]);
  pkt.challenges = [
    {
      id: "C1",
      targetVersion: 1,
      filedAt: "2026-07-09T10:15:00Z",
      filer: "role:contributor.methods.04 (synthetic)",
      reason: "The bound locator cites Table 2 (all recorded cases, N=120). The protocol’s primary analysis is ITT, reported in Table 3 (N=100).",
      evidenceLocator: "SRC-001-results · Table 3 heading “Primary composite at day 90 — ITT”",
      disposition: "upheld",
      dispositionNote: "Two unconflicted reviewers confirmed the mismatch. Packet v2 and receipt R-SYNTHETIC-TRIAL-001-v2 supersede v1. v1 digest still matches the original bytes.",
    },
  ];
  return pkt;
}

function make002(): Packet {
  const sources = [
    src(
      "SRC-002-protocol",
      "protocol",
      "HARBOR-T2 synthetic protocol",
      "Section 8.2 Primary outcome",
      "Primary: 90-day composite of all-cause hospitalization or HbA1c > 8.0%, ITT. Amendment log: none affecting this endpoint.",
      { documentDate: "2024-01-09" },
    ),
    src(
      "SRC-002-results",
      "results",
      "HARBOR-T2 synthetic results",
      "Table 2. Primary outcome, ITT",
      "Glucoril+metformin 22/210 vs metformin 41/208. Risk difference −9.3 pp (95% CI −16.1 to −2.5).",
    ),
  ];
  const claim = claimFor(
    "CLM-002-primary",
    "SYNTHETIC-TRIAL-002",
    "The report states 22 of 210 versus 41 of 208 participants met the primary composite (risk difference −9.3 pp, 95% CI −16.1 to −2.5).",
    [
      { sourceVersionId: "SRC-002-results", locator: "Table 2, ITT", relation: "supports", extractionMethod: "human" },
      { sourceVersionId: "SRC-002-protocol", locator: "Section 8.2", relation: "contextualizes", extractionMethod: "human" },
    ],
    { numerator: "22 vs 41", denominator: "210 vs 208", effectMeasure: "Risk difference −9.3 percentage points", uncertainty: "95% CI −16.1 to −2.5" },
  );
  const fieldChecks = fields({
    base: {
      study_identity: "SYNTHETIC-TRIAL-002 (HARBOR-T2)",
      outcome_definition: "Composite of all-cause hospitalization or HbA1c > 8.0%",
      timeframe: "90 days after randomization",
      analysis_population: "Intention-to-treat",
      numerator: "22 vs 41",
      denominator: "210 vs 208",
      effect_measure: "Risk difference −9.3 percentage points",
      uncertainty_interval: "95% CI −16.1 to −2.5",
      designation: "Primary",
      material_amendments: "None affecting the primary endpoint",
    },
  });
  const args: BuildArgs = {
    id: "SYNTHETIC-TRIAL-002",
    fixtureTag: "complete-clean",
    fixturePurpose: "All required review evidence present. Process COMPLETE. Mandatory non-assertions present.",
    study: study("002", "HARBOR-T2", "HARBOR-T2: Glucoril adjunct in newly diagnosed type 2 diabetes (synthetic)", "Helixbridge Cooperative (synthetic)", "418 randomized"),
    sources,
    claim,
    fieldChecks,
    limitations: "Open-label. Industry-sponsored. Interval excludes zero on the risk-difference scale as reported; clinical importance is a separate judgment.",
    methodNote: "Structured reviewer notes, two independent extractions compared before sign-off.",
    reviewers: [A, B],
    conflictNote: "No prohibited conflicts identified.",
    publicationNote: "Synthetic fixture.",
    evalInput: evalComplete,
    scientificAssessment: "no_material_disagreement",
    scientificNote: "Extracted figures match. No material methodological disagreement was retained.",
  };
  return packet(args, [versionOf(args, 1, "current")]);
}

function make003(): Packet {
  const sources = [
    src(
      "SRC-003-registry",
      "registry",
      "AMBER-EARLY registry record (synthetic)",
      "Registry outcome list",
      "Primary outcome listed: 90-day composite. Results module: “posted, document not captured”.",
      { provenance: "LINK_ONLY", bytesDigest: null },
    ),
  ];
  const claim = claimFor(
    "CLM-003-primary",
    "SYNTHETIC-TRIAL-003",
    "A registry row asserts that results were posted. The results table itself was not captured, so the numeric claim is not bound to a source version.",
    [{ sourceVersionId: "SRC-003-registry", locator: "Results module status", relation: "contextualizes", extractionMethod: "human" }],
    { numerator: "Not bound", denominator: "Not bound", effectMeasure: "Not bound", uncertainty: "Not bound" },
  );
  const fieldChecks = fields({
    base: {
      study_identity: "SYNTHETIC-TRIAL-003 (AMBER-EARLY)",
      outcome_definition: "Composite of all-cause hospitalization or HbA1c > 8.0%",
      timeframe: "90 days after randomization",
      analysis_population: "Intention-to-treat (registry)",
      numerator: "Not reported in captured sources",
      denominator: "Not reported in captured sources",
      effect_measure: "Not reported in captured sources",
      uncertainty_interval: "Not reported in captured sources",
      designation: "Primary (registry)",
      material_amendments: "Unknown — protocol not captured",
    },
  });
  const args: BuildArgs = {
    id: "SYNTHETIC-TRIAL-003",
    fixtureTag: "missing-source",
    fixturePurpose: "Missing source reference for the numeric result. Process INCOMPLETE.",
    study: study("003", "AMBER-EARLY", "AMBER-EARLY Glucoril feasibility trial (synthetic)", "Amberfield Institute (synthetic)", "64 randomized", { status: "Results asserted, document not captured" }),
    sources,
    claim,
    fieldChecks,
    limitations: "The results document was unavailable at capture. Numeric fields are explicit unknowns, but the source manifest cannot bind a results table.",
    methodNote: "Structured reviewer notes.",
    reviewers: [A, B],
    conflictNote: "No prohibited conflicts identified.",
    publicationNote: "Synthetic fixture. Unavailable source is marked, not fabricated.",
    evalInput: { ...evalComplete, sourcesBound: false },
    scientificAssessment: "not_assessed",
    scientificNote: "No numeric result was bound. Scientific interpretation is not collapsed into a zero or “no events”.",
  };
  return packet(args, [versionOf(args, 1, "current")]);
}

function make004(): Packet {
  const sources = [
    src(
      "SRC-004-results",
      "results",
      "NEXUS-MET synthetic results",
      "Table 1. Primary ITT",
      "Glucoril+metformin 14/96 vs metformin 15/94. Risk difference −1.3 pp (95% CI −11.2 to +8.6).",
    ),
    src(
      "SRC-004-protocol",
      "protocol",
      "NEXUS-MET synthetic protocol",
      "Section 6 Primary endpoint",
      "Primary: 90-day composite, ITT.",
      { documentDate: "2024-06-01" },
    ),
  ];
  const claim = claimFor(
    "CLM-004-primary",
    "SYNTHETIC-TRIAL-004",
    "Extractor reports 14 of 96 versus 15 of 94 met the primary composite (risk difference −1.3 pp). Second review is not yet on file.",
    [
      { sourceVersionId: "SRC-004-results", locator: "Table 1, ITT", relation: "supports", extractionMethod: "human" },
      { sourceVersionId: "SRC-004-protocol", locator: "Section 6", relation: "contextualizes", extractionMethod: "human" },
    ],
    { numerator: "14 vs 15", denominator: "96 vs 94", effectMeasure: "Risk difference −1.3 percentage points", uncertainty: "95% CI −11.2 to +8.6" },
  );
  const fieldChecks = fields({
    base: {
      study_identity: "SYNTHETIC-TRIAL-004 (NEXUS-MET)",
      outcome_definition: "Composite of all-cause hospitalization or HbA1c > 8.0%",
      timeframe: "90 days after randomization",
      analysis_population: "Intention-to-treat",
      numerator: "14 vs 15",
      denominator: "96 vs 94",
      effect_measure: "Risk difference −1.3 percentage points",
      uncertainty_interval: "95% CI −11.2 to +8.6",
      designation: "Primary",
      material_amendments: "None identified",
    },
    numerator: { reviewerB: null },
    denominator: { reviewerB: null },
    effect_measure: { reviewerB: null },
    uncertainty_interval: { reviewerB: null },
  });
  const args: BuildArgs = {
    id: "SYNTHETIC-TRIAL-004",
    fixtureTag: "missing-second-review",
    fixturePurpose: "Missing second review on critical numeric fields. Process INCOMPLETE. Local workspace can complete a draft check.",
    study: study("004", "NEXUS-MET", "NEXUS-MET: Glucoril plus metformin versus metformin (synthetic)", "Public Methods Cooperative (synthetic)", "190 randomized"),
    sources,
    claim,
    fieldChecks,
    limitations: "Small sample. Interval includes no difference. Second reviewer has not signed the numeric fields.",
    methodNote: "Structured reviewer notes. Checking reviewer still outstanding.",
    reviewers: [A],
    conflictNote: "Extractor disclosure is on file. Checker not yet assigned in the published record.",
    publicationNote: "Draft packet. Not a published complete review.",
    evalInput: { ...evalComplete, signoff: "missing" },
    scientificAssessment: "not_assessed",
    scientificNote: "Process incomplete. No scientific verdict is offered.",
    allowLocalSecondReview: true,
  };
  return packet(args, [versionOf(args, 1, "current")]);
}

function make005(): Packet {
  const sources = [
    src(
      "SRC-005-results",
      "results",
      "DRIFT-COMPOSITE synthetic results",
      "Table 4. Primary and missingness",
      "Events 31/180 vs 30/179. Missing primary outcome 22 vs 19. Per-protocol events 18/158 vs 28/160.",
    ),
    src(
      "SRC-005-protocol",
      "protocol",
      "DRIFT-COMPOSITE synthetic protocol",
      "Section 9.1",
      "Primary: 90-day composite, ITT. Missing data: complete-case secondary only; no prespecified multiple imputation.",
      { documentDate: "2023-12-12" },
    ),
  ];
  const claim = claimFor(
    "CLM-005-primary",
    "SYNTHETIC-TRIAL-005",
    "ITT complete-case figures are 31 of 180 versus 30 of 179 (risk difference +0.5 pp, 95% CI −7.4 to +8.4). A per-protocol contrast is in the opposite direction.",
    [
      { sourceVersionId: "SRC-005-results", locator: "Table 4, ITT complete-case", relation: "supports", extractionMethod: "human" },
      { sourceVersionId: "SRC-005-results", locator: "Table 4, per-protocol", relation: "contradicts", extractionMethod: "human" },
      { sourceVersionId: "SRC-005-protocol", locator: "Section 9.1 missing-data rule", relation: "contextualizes", extractionMethod: "human" },
    ],
    { numerator: "31 vs 30", denominator: "180 vs 179", effectMeasure: "Risk difference +0.5 percentage points", uncertainty: "95% CI −7.4 to +8.4" },
  );
  const fieldChecks = fields({
    base: {
      study_identity: "SYNTHETIC-TRIAL-005 (DRIFT-COMPOSITE)",
      outcome_definition: "Composite of all-cause hospitalization or HbA1c > 8.0%",
      timeframe: "90 days after randomization",
      analysis_population: "Intention-to-treat complete-case, as reported",
      numerator: "31 vs 30",
      denominator: "180 vs 179",
      effect_measure: "Risk difference +0.5 percentage points (ITT complete-case)",
      uncertainty_interval: "95% CI −7.4 to +8.4",
      designation: "Primary",
      material_amendments: "None identified",
    },
    analysis_population: {
      reviewerA: "Intention-to-treat complete-case, as reported",
      reviewerB: "The protocol ITT would include the 41 participants with missing outcomes; that analysis is not in the report.",
      documentedDisagreement:
        "Retained. Extractors agree the published primary table is complete-case. They disagree whether that table satisfies the protocol’s ITT definition.",
      sourceLocator: "Table 4 vs protocol §9.1",
    },
  });
  const args: BuildArgs = {
    id: "SYNTHETIC-TRIAL-005",
    fixtureTag: "documented-disagreement",
    fixturePurpose: "Unresolved interpretation documented correctly. Process may be COMPLETE; disagreement visibly retained.",
    study: study("005", "DRIFT-COMPOSITE", "DRIFT-COMPOSITE: Glucoril and missing outcome data (synthetic)", "Westmere University (synthetic)", "359 randomized"),
    sources,
    claim,
    fieldChecks,
    limitations: "High missingness. Complete-case ITT is near null; per-protocol contrast favors Glucoril. Neither is treated as a clinical conclusion.",
    methodNote: "Structured reviewer notes. Competing interpretations published with their locators.",
    reviewers: [A, B],
    conflictNote: "No prohibited conflicts identified.",
    publicationNote: "Synthetic fixture.",
    evalInput: evalComplete,
    scientificAssessment: "disagreement_retained",
    scientificNote: "A completed process can conclude that evidence is conflicting. The disagreement is the product, not a defect to hide.",
  };
  return packet(args, [versionOf(args, 1, "current")]);
}

function make006(): Packet {
  const sources = [
    src(
      "SRC-006-results",
      "results",
      "HIDDEN-DELTA synthetic results",
      "Table 2. Primary ITT",
      "Events 8/70 vs 16/70. The footnote defines the 70 as modified ITT after excluding 12 protocol deviations.",
    ),
  ];
  const claim = claimFor(
    "CLM-006-primary",
    "SYNTHETIC-TRIAL-006",
    "The packet currently presents the primary analysis as ITT 8/70 vs 16/70. The source footnote calls this modified ITT.",
    [{ sourceVersionId: "SRC-006-results", locator: "Table 2", relation: "supports", extractionMethod: "human" }],
    { numerator: "8 vs 16", denominator: "70 vs 70", effectMeasure: "Risk difference −11.4 percentage points", uncertainty: "95% CI −24.0 to +1.2", analysisPopulation: "Intention-to-treat" },
  );
  const fieldChecks = fields({
    base: {
      study_identity: "SYNTHETIC-TRIAL-006 (HIDDEN-DELTA)",
      outcome_definition: "Composite of all-cause hospitalization or HbA1c > 8.0%",
      timeframe: "90 days after randomization",
      analysis_population: "Intention-to-treat",
      numerator: "8 vs 16",
      denominator: "70 vs 70",
      effect_measure: "Risk difference −11.4 percentage points",
      uncertainty_interval: "95% CI −24.0 to +1.2",
      designation: "Primary",
      material_amendments: "None identified",
    },
    analysis_population: {
      reviewerA: "Intention-to-treat",
      reviewerB: "Modified ITT after 12 exclusions (source footnote)",
      hiddenDisagreement: true,
      documentedDisagreement: null,
      sourceLocator: "Table 2 footnote",
    },
  });
  const args: BuildArgs = {
    id: "SYNTHETIC-TRIAL-006",
    fixtureTag: "hidden-disagreement",
    fixturePurpose: "Hidden critical-field disagreement. Process is not complete.",
    study: study("006", "HIDDEN-DELTA", "HIDDEN-DELTA Glucoril trial (synthetic)", "Delta North Labs (synthetic)", "152 randomized"),
    sources,
    claim,
    fieldChecks,
    limitations: "A population-definition disagreement exists in the review file and is not shown on the public claim.",
    methodNote: "Structured reviewer notes — this fixture deliberately fails DISAGREEMENTS_ACCOUNTED_FOR.",
    reviewers: [A, B],
    conflictNote: "No prohibited conflicts identified.",
    publicationNote: "Held as a failing fixture; not a successful independent review.",
    evalInput: evalComplete,
    scientificAssessment: "not_assessed",
    scientificNote: "Because a disagreement is hidden, the process cannot be complete. No scientific collapse is offered.",
  };
  return packet(args, [versionOf(args, 1, "current")]);
}

function make007(): Packet {
  const sources = [
    src(
      "SRC-007-results",
      "results",
      "CONFLICT-BAY synthetic results",
      "Table 1. Primary",
      "Events 19/150 vs 33/149. Risk difference −9.5 pp (95% CI −18.1 to −0.9).",
    ),
  ];
  const claim = claimFor(
    "CLM-007-primary",
    "SYNTHETIC-TRIAL-007",
    "A draft extraction reports 19 of 150 versus 33 of 149 (risk difference −9.5 pp). Issuance is blocked because a required checker is a sponsor employee.",
    [{ sourceVersionId: "SRC-007-results", locator: "Table 1", relation: "supports", extractionMethod: "human" }],
    { numerator: "19 vs 33", denominator: "150 vs 149", effectMeasure: "Risk difference −9.5 percentage points", uncertainty: "95% CI −18.1 to −0.9" },
  );
  const fieldChecks = fields({
    base: {
      study_identity: "SYNTHETIC-TRIAL-007 (CONFLICT-BAY)",
      outcome_definition: "Composite of all-cause hospitalization or HbA1c > 8.0%",
      timeframe: "90 days after randomization",
      analysis_population: "Intention-to-treat",
      numerator: "19 vs 33",
      denominator: "150 vs 149",
      effect_measure: "Risk difference −9.5 percentage points",
      uncertainty_interval: "95% CI −18.1 to −0.9",
      designation: "Primary",
      material_amendments: "None identified",
    },
  });
  const args: BuildArgs = {
    id: "SYNTHETIC-TRIAL-007",
    fixtureTag: "conflict-blocked",
    fixturePurpose: "Prohibited reviewer conflict. Process BLOCKED.",
    study: study("007", "CONFLICT-BAY", "CONFLICT-BAY Glucoril outcomes trial (synthetic)", "Northhaven Therapeutics (synthetic)", "299 randomized"),
    sources,
    claim,
    fieldChecks,
    limitations: "Review assignment violated the independence rule. No complete receipt is issued.",
    methodNote: "Structured reviewer notes. Independence rule: a sponsor employee cannot be the sole checking reviewer.",
    reviewers: [A, B_CONFLICT],
    conflictNote: "Checker is employed by the sponsor. Assignment is prohibited for this policy version.",
    publicationNote: "Blocked attempt retained as a fixture. Public packet contains only safe reason codes.",
    evalInput: { ...evalComplete, conflictReview: "blocked" },
    scientificAssessment: "not_assessed",
    scientificNote: "Blocked process. No scientific assessment is certified.",
  };
  return packet(args, [versionOf(args, 1, "current")]);
}

function make008(): Packet {
  const sources = [
    src(
      "SRC-008-results",
      "results",
      "REDACT-FAIL synthetic internal note (not for publication)",
      "Flagged fragment",
      "Numeric table is aggregate. A draft comment attempted to include an identifiable clinic-visit narrative. Publication allowlist rejected the packet.",
    ),
  ];
  const claim = claimFor(
    "CLM-008-primary",
    "SYNTHETIC-TRIAL-008",
    "A numeric extraction was prepared. Publication is blocked because a draft field contained disallowed personal detail. The public packet does not repeat that detail.",
    [{ sourceVersionId: "SRC-008-results", locator: "Aggregate table only", relation: "contextualizes", extractionMethod: "human" }],
    { numerator: "Withheld", denominator: "Withheld", effectMeasure: "Withheld", uncertainty: "Withheld" },
  );
  const fieldChecks = fields({
    base: {
      study_identity: "SYNTHETIC-TRIAL-008 (REDACT-FAIL)",
      outcome_definition: "Composite of all-cause hospitalization or HbA1c > 8.0%",
      timeframe: "90 days after randomization",
      analysis_population: "Intention-to-treat",
      numerator: "Withheld from public packet",
      denominator: "Withheld from public packet",
      effect_measure: "Withheld from public packet",
      uncertainty_interval: "Withheld from public packet",
      designation: "Primary",
      material_amendments: "Not published",
    },
  });
  const args: BuildArgs = {
    id: "SYNTHETIC-TRIAL-008",
    fixtureTag: "privacy-blocked",
    fixturePurpose: "Personal-data field or unsafe attachment detected. Publication blocked; no unsafe public receipt.",
    study: study("008", "REDACT-FAIL", "REDACT-FAIL Glucoril packet (synthetic, blocked)", "Independent Methods Desk (synthetic)", "Not published"),
    sources,
    claim,
    fieldChecks,
    limitations: "Public projection stopped at the allowlist. Tombstone gives a safe reason without repeating the leaked content.",
    methodNote: "Publication allowlist is a hard gate.",
    reviewers: [A, B],
    conflictNote: "No prohibited conflicts identified.",
    publicationNote: "Blocked. Restricted incident record is not in this public packet.",
    evalInput: { ...evalComplete, publicationAllowlist: "blocked", prohibitedContent: true },
    scientificAssessment: "not_assessed",
    scientificNote: "No public scientific assessment. The block is about publication safety, not about whether Glucoril works.",
  };
  return packet(args, [versionOf(args, 1, "current")]);
}

function make009(): Packet {
  const sources = [
    src(
      "SRC-009-results",
      "results",
      "DEMO-SEAL synthetic results",
      "Table 1. Primary ITT",
      "Events 40/300 vs 42/298. Risk difference −0.8 pp (95% CI −6.1 to +4.5).",
    ),
    src(
      "SRC-009-protocol",
      "protocol",
      "DEMO-SEAL synthetic protocol",
      "Section 5",
      "Primary: 90-day composite, ITT. Null result expected under the planning note.",
      { documentDate: "2024-02-02" },
    ),
  ];
  const claim = claimFor(
    "CLM-009-primary",
    "SYNTHETIC-TRIAL-009",
    "The report states 40 of 300 versus 42 of 298 met the primary composite (risk difference −0.8 pp, 95% CI −6.1 to +4.5).",
    [
      { sourceVersionId: "SRC-009-results", locator: "Table 1, ITT", relation: "supports", extractionMethod: "human" },
      { sourceVersionId: "SRC-009-protocol", locator: "Section 5", relation: "contextualizes", extractionMethod: "human" },
    ],
    { numerator: "40 vs 42", denominator: "300 vs 298", effectMeasure: "Risk difference −0.8 percentage points", uncertainty: "95% CI −6.1 to +4.5" },
  );
  const fieldChecks = fields({
    base: {
      study_identity: "SYNTHETIC-TRIAL-009 (DEMO-SEAL)",
      outcome_definition: "Composite of all-cause hospitalization or HbA1c > 8.0%",
      timeframe: "90 days after randomization",
      analysis_population: "Intention-to-treat",
      numerator: "40 vs 42",
      denominator: "300 vs 298",
      effect_measure: "Risk difference −0.8 percentage points",
      uncertainty_interval: "95% CI −6.1 to +4.5",
      designation: "Primary",
      material_amendments: "None identified",
    },
  });
  const args: BuildArgs = {
    id: "SYNTHETIC-TRIAL-009",
    fixtureTag: "demo-key",
    fixturePurpose: "Signature math may pass under a published demo key; production issuer trust fails.",
    study: study("009", "DEMO-SEAL", "DEMO-SEAL Glucoril outcomes (synthetic)", "Methods Teaching Desk (synthetic)", "598 randomized"),
    sources,
    claim,
    fieldChecks,
    limitations: "Near-null result as reported. The interesting property of this packet is the seal, not the point estimate.",
    methodNote: "Structured reviewer notes.",
    reviewers: [A, B],
    conflictNote: "No prohibited conflicts identified.",
    publicationNote: "Signed with the published prototype demo key. Anyone with this app can produce an equivalent signature.",
    evalInput: evalComplete,
    scientificAssessment: "no_material_disagreement",
    scientificNote: "Extraction agreement only. The demo seal does not upgrade the medical claim.",
    usesDemoKey: true,
    integrity: "demo_signature",
  };
  return packet(args, [versionOf(args, 1, "current")]);
}

function make010(): Packet {
  const sources = [
    src(
      "SRC-010-results",
      "results",
      "NULL-STAR synthetic results",
      "Table 2. Primary ITT",
      "Events 28/200 vs 21/200. Risk difference +3.5 pp (95% CI −3.9 to +10.9). Direction favors control on this composite.",
    ),
    src(
      "SRC-010-protocol",
      "protocol",
      "NULL-STAR synthetic protocol",
      "Section 4",
      "Primary: 90-day composite, ITT. Collection protocol requires inclusion of null and unfavorable eligible trials.",
      { documentDate: "2024-05-20" },
    ),
  ];
  const claim = claimFor(
    "CLM-010-primary",
    "SYNTHETIC-TRIAL-010",
    "The report states 28 of 200 versus 21 of 200 met the primary composite (risk difference +3.5 pp, 95% CI −3.9 to +10.9). The point estimate favors the comparator.",
    [
      { sourceVersionId: "SRC-010-results", locator: "Table 2, ITT", relation: "supports", extractionMethod: "human" },
      { sourceVersionId: "SRC-010-protocol", locator: "Section 4", relation: "contextualizes", extractionMethod: "human" },
    ],
    { numerator: "28 vs 21", denominator: "200 vs 200", effectMeasure: "Risk difference +3.5 percentage points", uncertainty: "95% CI −3.9 to +10.9" },
  );
  const fieldChecks = fields({
    base: {
      study_identity: "SYNTHETIC-TRIAL-010 (NULL-STAR)",
      outcome_definition: "Composite of all-cause hospitalization or HbA1c > 8.0%",
      timeframe: "90 days after randomization",
      analysis_population: "Intention-to-treat",
      numerator: "28 vs 21",
      denominator: "200 vs 200",
      effect_measure: "Risk difference +3.5 percentage points",
      uncertainty_interval: "95% CI −3.9 to +10.9",
      designation: "Primary",
      material_amendments: "None identified",
    },
  });
  const args: BuildArgs = {
    id: "SYNTHETIC-TRIAL-010",
    fixtureTag: "null-unfavorable",
    fixturePurpose: "Eligible null/unfavorable result included. Process COMPLETE. Inclusion is not a judgment that the product failed in reality — the trial is fictional.",
    study: study("010", "NULL-STAR", "NULL-STAR Glucoril adjunct trial (synthetic)", "Starling Public Trials (synthetic)", "400 randomized"),
    sources,
    claim,
    fieldChecks,
    limitations: "Point estimate favors control; interval includes no difference. Collection rules required this eligible result to be in the set.",
    methodNote: "Structured reviewer notes. Unfavorable eligible results are in-scope.",
    reviewers: [A, B],
    conflictNote: "No prohibited conflicts identified.",
    publicationNote: "Synthetic fixture.",
    evalInput: evalComplete,
    scientificAssessment: "no_material_disagreement",
    scientificNote: "Reviewers agree on the extracted unfavorable point estimate. That agreement is not a treatment recommendation.",
  };
  return packet(args, [versionOf(args, 1, "current")]);
}

export const COLLECTION: Collection = {
  id: "TW-GLUCORIL-90",
  name: "TrialWatch · Glucoril 90-day composite",
  question:
    "Among adults with newly diagnosed type 2 diabetes, does Glucoril (a fictional SGLT2-like agent) plus metformin reduce a prespecified 90-day composite of all-cause hospitalization or HbA1c > 8.0%, compared with metformin alone?",
  protocolVersion: "TW-COLLECTION@0.1.0-draft",
  searchCutoff: "2026-06-01",
  eligibility: [
    "Randomized, parallel-group trials of Glucoril plus metformin versus metformin in adults with newly diagnosed type 2 diabetes.",
    "A prespecified primary or key secondary 90-day composite of all-cause hospitalization or HbA1c > 8.0% must be defined.",
    "Public-style reports only. No patient records, case reports, or access-controlled data.",
    "Include eligible null, unfavorable, and conflicting results. Do not select on the direction of the estimate.",
    "Exclude observational designs, type 1 diabetes, and trials whose only eligible outcome is an unprespecified surrogate.",
  ],
  inclusionLog: [
    { studyId: "SYNTHETIC-TRIAL-001", acronym: "GLIDE-90", decision: "included", reason: "Eligible RCT; primary 90-day composite present." },
    { studyId: "SYNTHETIC-TRIAL-002", acronym: "HARBOR-T2", decision: "included", reason: "Eligible RCT; larger sample, same endpoint." },
    { studyId: "SYNTHETIC-TRIAL-003", acronym: "AMBER-EARLY", decision: "included", reason: "Eligible question; results document not captured — still in the log." },
    { studyId: "SYNTHETIC-TRIAL-004", acronym: "NEXUS-MET", decision: "included", reason: "Eligible RCT; review still incomplete." },
    { studyId: "SYNTHETIC-TRIAL-005", acronym: "DRIFT-COMPOSITE", decision: "included", reason: "Eligible RCT with conflicting analyses." },
    { studyId: "SYNTHETIC-TRIAL-006", acronym: "HIDDEN-DELTA", decision: "included", reason: "Eligible RCT used to test hidden-disagreement handling." },
    { studyId: "SYNTHETIC-TRIAL-007", acronym: "CONFLICT-BAY", decision: "included", reason: "Eligible RCT used to test the conflict block." },
    { studyId: "SYNTHETIC-TRIAL-008", acronym: "REDACT-FAIL", decision: "included", reason: "Eligible question; publication blocked on safety grounds." },
    { studyId: "SYNTHETIC-TRIAL-009", acronym: "DEMO-SEAL", decision: "included", reason: "Eligible RCT used to test demo-key trust failure." },
    { studyId: "SYNTHETIC-TRIAL-010", acronym: "NULL-STAR", decision: "included", reason: "Eligible RCT; point estimate favors comparator." },
    { studyId: "SYNTHETIC-EXCL-OBS-01", acronym: "LOOK-COHORT", decision: "excluded", reason: "Observational cohort. Not randomized." },
    { studyId: "SYNTHETIC-EXCL-T1D-02", acronym: "TYPE1-BRIDGE", decision: "excluded", reason: "Wrong population: type 1 diabetes." },
    { studyId: "SYNTHETIC-EXCL-SUR-03", acronym: "FAST-HBA1C", decision: "excluded", reason: "Only a 12-week HbA1c surrogate; no prespecified 90-day composite." },
  ],
  methodsNote:
    "This collection uses explicitly labeled structured reviewer notes. It does not claim to be a Cochrane RoB 2 assessment and is not Cochrane-endorsed. Glucoril is fictional. Every identifier beginning SYNTHETIC- is a test fixture.",
};

export const PACKETS: Packet[] = [
  make001(),
  make002(),
  make003(),
  make004(),
  make005(),
  make006(),
  make007(),
  make008(),
  make009(),
  make010(),
];

export function getPacket(id: string): Packet | undefined {
  return PACKETS.find((p) => p.id === id);
}

const EXPECTED_RESULTS: Record<string, PacketVersion["result"]> = {
  "SYNTHETIC-TRIAL-001": "COMPLETE",
  "SYNTHETIC-TRIAL-002": "COMPLETE",
  "SYNTHETIC-TRIAL-003": "INCOMPLETE",
  "SYNTHETIC-TRIAL-004": "INCOMPLETE",
  "SYNTHETIC-TRIAL-005": "COMPLETE",
  "SYNTHETIC-TRIAL-006": "INCOMPLETE",
  "SYNTHETIC-TRIAL-007": "BLOCKED",
  "SYNTHETIC-TRIAL-008": "BLOCKED",
  "SYNTHETIC-TRIAL-009": "COMPLETE",
  "SYNTHETIC-TRIAL-010": "COMPLETE",
};

for (const packet of PACKETS) {
  const version =
    packet.versions.find((v) => v.version === packet.currentVersion) ?? packet.versions.at(-1);
  const expected = EXPECTED_RESULTS[packet.id];
  if (!version || !expected) continue;
  if (version.result !== expected) {
    throw new Error(`${packet.id} expected ${expected}, got ${version.result}`);
  }
}

export function currentVersion(packet: Packet): PacketVersion {
  return packet.versions.find((v) => v.version === packet.currentVersion) ?? packet.versions[packet.versions.length - 1]!;
}

export function latestCorrections(): Array<{ packet: Packet; challengeId: string; note: string; at: string }> {
  const out: Array<{ packet: Packet; challengeId: string; note: string; at: string }> = [];
  for (const packet of PACKETS) {
    for (const c of packet.challenges) {
      if (c.disposition === "upheld") {
        out.push({ packet, challengeId: c.id, note: c.dispositionNote, at: c.filedAt });
      }
    }
  }
  return out.sort((a, b) => (a.at < b.at ? 1 : -1));
}

export const POLICY_DIGEST = digestOf(POLICY_BODY);
