import {
  CRITICAL_FIELD_KEYS,
  MANDATORY_NON_ASSERTIONS,
  POLICY_ID,
  POLICY_VERSION,
  RULE_CODES,
  type FieldCheck,
  type ReviewResult,
  type RuleCode,
  type RuleResult,
  type RuleStatus,
} from "./types";

export const POLICY_BODY = {
  id: POLICY_ID,
  version: POLICY_VERSION,
  title: "Traceable review of a specified trial outcome",
  bounded_obligation:
    "Produce a traceable review packet for a specified trial outcome using a specified set of public source versions and the declared review method.",
  not_the_obligation:
    "Prove that the intervention works, that the trial was conducted honestly, or that the result applies to a particular person.",
  required_assertions: RULE_CODES,
  mandatory_non_assertions: MANDATORY_NON_ASSERTIONS,
  result_order: ["BLOCKED", "INCOMPLETE", "COMPLETE"] as const,
};

export interface EvaluationInput {
  scopeComplete: boolean;
  sourcesBound: boolean;
  sourceConflict: boolean;
  fields: FieldCheck[];
  methodRecorded: boolean;
  limitationsRecorded: boolean;
  conflictReview: "passed" | "missing" | "blocked";
  publicationAllowlist: "passed" | "blocked";
  signoff: "present" | "missing" | "invalid";
  prohibitedContent: boolean;
}

function rule(code: RuleCode, status: RuleStatus, rationale: string): RuleResult {
  return { code, status, rationale };
}

export function evaluateReview(input: EvaluationInput): {
  result: ReviewResult;
  rules: RuleResult[];
} {
  const rules: RuleResult[] = [];

  rules.push(
    rule(
      "SCOPE_FIXED",
      input.scopeComplete ? "SATISFIED" : "MISSING",
      input.scopeComplete
        ? "Study, outcome, population, timeframe, method, and source cutoff are specified."
        : "Scope is incomplete; conflicting or missing scope blocks a complete review.",
    ),
  );

  rules.push(
    rule(
      "SOURCE_MANIFEST_BOUND",
      input.sourceConflict ? "BLOCKING" : input.sourcesBound ? "SATISFIED" : "MISSING",
      input.sourceConflict
        ? "Source manifest could not be reconciled with the run inputs."
        : input.sourcesBound
          ? "Relied-on source versions and lawful-access metadata are bound to the run."
          : "A required source reference is missing or unbound.",
    ),
  );

  const missingField = input.fields.some((f) => f.reviewerA.trim() === "" || f.reviewerB === null);
  const allKeys = CRITICAL_FIELD_KEYS.every((k) => input.fields.some((f) => f.key === k));
  rules.push(
    rule(
      "CRITICAL_FIELDS_CHECKED",
      !allKeys || missingField ? "MISSING" : "SATISFIED",
      !allKeys
        ? "Not every critical field is present in the checking record."
        : missingField
          ? "A critical field still lacks two authorized reviews (explicit unknown is allowed; a blank is not)."
          : "Two authorized reviews account for every critical field, including explicit unknowns.",
    ),
  );

  rules.push(
    rule(
      "METHOD_AND_LIMITATIONS_RECORDED",
      input.methodRecorded && input.limitationsRecorded ? "SATISFIED" : "MISSING",
      input.methodRecorded && input.limitationsRecorded
        ? "Method version, assumptions, missing information, and material limitations are recorded."
        : "Method version or material limitations are not recorded.",
    ),
  );

  const hidden = input.fields.some((f) => f.hiddenDisagreement);
  const undocumented = input.fields.some((f) => {
    if (f.reviewerB === null) return false;
    const differs = f.reviewerA.trim() !== f.reviewerB.trim();
    return differs && !f.documentedDisagreement && !f.hiddenDisagreement;
  });
  rules.push(
    rule(
      "DISAGREEMENTS_ACCOUNTED_FOR",
      hidden || undocumented ? "MISSING" : "SATISFIED",
      hidden
        ? "A critical-field disagreement is present but hidden from the public record."
        : undocumented
          ? "Reviewers differ on a critical field without a documented disposition."
          : "Material disagreements are resolved with reasons or visibly retained.",
    ),
  );

  rules.push(
    rule(
      "CONFLICT_REVIEW_COMPLETED",
      input.conflictReview === "blocked"
        ? "BLOCKING"
        : input.conflictReview === "missing"
          ? "MISSING"
          : "SATISFIED",
      input.conflictReview === "blocked"
        ? "A prohibited reviewer conflict was identified."
        : input.conflictReview === "missing"
          ? "Reviewer disclosure or assignment-rule check is missing."
          : "Reviewer disclosures and the declared assignment rule were checked.",
    ),
  );

  rules.push(
    rule(
      "PUBLICATION_ALLOWLIST_PASSED",
      input.publicationAllowlist === "blocked" || input.prohibitedContent ? "BLOCKING" : "SATISFIED",
      input.prohibitedContent || input.publicationAllowlist === "blocked"
        ? "Unsafe material or a disallowed field was detected. Publication is blocked."
        : "Output uses approved fields and passed the privacy/rights review.",
    ),
  );

  rules.push(
    rule(
      "AUTHORIZED_SIGNOFF_PRESENT",
      input.signoff === "invalid" ? "BLOCKING" : input.signoff === "missing" ? "MISSING" : "SATISFIED",
      input.signoff === "invalid"
        ? "A required approval is invalid or revoked for this run."
        : input.signoff === "missing"
          ? "Required role-key approvals are missing."
          : "Required role-key approvals bind the exact run inputs.",
    ),
  );

  const result: ReviewResult = rules.some((r) => r.status === "BLOCKING")
    ? "BLOCKED"
    : rules.some((r) => r.status === "MISSING")
      ? "INCOMPLETE"
      : "COMPLETE";

  return { result, rules };
}
