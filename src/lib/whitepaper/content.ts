import type { PaperMeta, PaperSection } from "./types";

export const PAPER_META: PaperMeta = {
  folio: "Folio A",
  version: "0.1 — founder review draft",
  prepared: "13 September 2026",
  title: "Medical Evidence Commons",
  subtitle: "Full product, architecture, and implementation blueprint",
  workingName: "Medical Evidence Commons",
  firstApplication: "TrialWatch",
  foundation:
    "A separate Commons application, a versioned Proof of Fulfillment research extension, and an optional MIRRA adapter on ICP.",
  lede: "A shared medical evidence library with accountable review and a visible correction history.",
  status:
    "This is a complete proposed product and build specification. It is not a deployed application, implemented integration, completed security audit, clinical validation, legal opinion, or declaration that MIRRA is release-ready. Code shapes and policy names below are design proposals unless identified as existing in this explorer. No repositories, policies, canisters, or payment systems were changed to prepare this paper.",
};

const s = (id: string, num: string, title: string, blocks: PaperSection["blocks"]): PaperSection => ({
  id,
  num,
  title,
  blocks,
});

export const PAPER_SECTIONS: PaperSection[] = [
  s("decision", "01", "The decision in one page", [
    {
      type: "lede",
      text: "Build a shared, correctable record of **medical claims and the evidence behind them**, beginning with a tightly bounded collection of public clinical-trial documents.",
    },
    { type: "p", text: "The first useful product is an evidence packet that answers six questions:" },
    {
      type: "ol",
      items: [
        "What exactly was claimed, for which population, outcome, and time period?",
        "Which source version supports that statement?",
        "What did the trial plan say before results became available?",
        "What uncertainties, limitations, and disagreements remain?",
        "Which review steps were completed, by whom, under which published rules?",
        "Has anything been challenged, corrected, superseded, or retracted?",
      ],
    },
    {
      type: "p",
      text: "Do not begin with a universal medical truth engine. Do not begin by putting patient records on a blockchain. Begin with a useful public evidence workflow whose output another person can inspect and reproduce.",
    },
    { type: "h3", text: "The four responsibilities" },
    {
      type: "table",
      headers: ["Component", "Its job", "What it must not claim"],
      rows: [
        [
          "Medical Evidence Commons",
          "Organize sources, claims, reviews, and corrections",
          "That inclusion makes a claim true",
        ],
        [
          "Proof of Fulfillment research extension",
          "Record whether a narrowly defined evidence-review obligation met a frozen policy",
          "That completing a process establishes treatment effectiveness",
        ],
        [
          "MIRRA",
          "Update domain-scoped model weights from externally resolved and scored events",
          "That mathematical consistency establishes medical truth",
        ],
        [
          "ICP",
          "Host application state and support verifiable responses about that state",
          "That a stored statement is clinically correct or impossible for governance to change",
        ],
      ],
    },
    { type: "h3", text: "Recommended sequence" },
    {
      type: "ol",
      items: [
        "Review this specification and approve the boundaries.",
        "Create a synthetic, local-first prototype with no accounts or real-person data. [[/collection|This explorer is that prototype.]]",
        "Pilot 20 public trial evidence packets with qualified human review.",
        "Add production-grade receipt verification and a small ICP registry after their gates pass.",
        "Evaluate MIRRA separately in shadow mode, with no clinical authority or influence on review verdicts.",
        "Expand only if people actually use the packets, understand their limits, and find the correction history valuable.",
      ],
    },
    {
      type: "note",
      text: "The Commons should remain useful if MIRRA is unavailable or never demonstrates an advantage. That is a deliberate separation of responsibilities, not a temporary workaround.",
    },
  ]),

  s("commons", "02", "What commons means", [
    {
      type: "p",
      text: "A **commons** is a resource shared by a community and maintained under agreed rules. A library is a useful analogy: shared access does not mean anyone can silently rewrite a book or remove its attribution.",
    },
    { type: "p", text: "For this product, commons means:" },
    {
      type: "ul",
      items: [
        "Public access to the evidence summaries, methods, and correction history.",
        "Clear rules for contributions and review.",
        "A fair, documented way to challenge conclusions.",
        "Credit and responsibility for contributions.",
        "Portable records so the knowledge does not depend on one website surviving.",
        "Stewardship of the shared resource, with accountable governance.",
      ],
    },
    {
      type: "p",
      text: "It does **not** mean all opinions carry equal evidentiary weight, all source material is free of copyright, everything must be public, or a majority vote determines a medical fact.",
    },
    {
      type: "callout",
      kicker: "Ownership",
      title: "Designed for shared stewardship",
      body: "The Commons is not legally community-owned merely because of its name. Ownership, licensing, governance rights, and funding must be established explicitly. Until then, describe it as a project designed for shared stewardship.",
    },
  ]),

  s("promise", "03", "The problem and product promise", [
    { type: "h3", text: "The product hypothesis" },
    {
      type: "p",
      text: "A reader may encounter a strong medical claim without an easy way to reconstruct the precise source, endpoint, analysis population, limitations, subsequent corrections, and disagreements behind it. TrialWatch tests whether putting those elements into one inspectable packet saves meaningful review effort.",
    },
    {
      type: "p",
      text: "This is a hypothesis to validate with users, not a claim that existing databases, journals, systematic reviews, or evidence tools lack value.",
    },
    {
      type: "quote",
      text: "Make the path from a medical claim to its supporting evidence inspectable, and make changes to that path visible.",
    },
    {
      type: "p",
      text: "The useful output is not a green truth badge. It is an evidence packet with sources, version history, review notes, scope limits, and an independently checkable record of the review process.",
    },
    { type: "h3", text: "Relationship to the supplied interview" },
    {
      type: "p",
      text: "The linked interview raises questions about evidence standards, institutions, incentives, and public interpretation. Those questions motivate transparent methods; they do not establish the truth of the interview’s individual medical assertions. The Commons must apply the same rules to claims from interviewees, journals, regulators, sponsors, critics, and its own founder. It is not built to vindicate a predetermined viewpoint. [Supplied interview](https://www.youtube.com/watch?v=g42Tc1gDgm0&t=4s)",
    },
    { type: "h3", text: "Intended differentiation to test" },
    {
      type: "ul",
      items: [
        "Claim-level provenance, not just a list of papers.",
        "Explicit separation of reporting, interpretation, process completion, and forecasting performance.",
        "Challenges and corrections preserved alongside the original record.",
        "Downloadable packets with independently checkable commitments.",
        "Optional, auditable evaluation of forecasting methods.",
      ],
    },
    {
      type: "note",
      text: "These are proposed product characteristics, not a verified claim of market uniqueness or patentability.",
    },
  ]),

  s("existing", "04", "What exists versus what is proposed", [
    {
      type: "p",
      text: "Project observations below refer to the pinned source snapshots in [[#provenance|§30]]. They are source-review observations, not tests rerun for this paper. Later upstream changes require a fresh check.",
    },
    {
      type: "table",
      headers: ["Item", "Observed status", "Consequence for this build"],
      rows: [
        [
          "MIRRA kernel and ICP canister",
          "Release candidate with documented deterministic arithmetic and correction semantics",
          "Integrate through a narrow adapter; do not rewrite the core",
        ],
        [
          "MIRRA release assurance",
          "README identifies unresolved release requirements, including replacement P1 review and provenance",
          "Do not advertise a production-certified MIRRA deployment",
        ],
        [
          "Fulfilled / Proof of Fulfillment",
          "Synthetic bounded-obligation explorer with policies, receipts, and a separate verification path",
          "Reuse patterns and tested components within their actual scope",
        ],
        [
          "Fulfilled signing key",
          "Intentionally published demonstration private key",
          "It cannot uniquely authenticate a production issuer",
        ],
        [
          "Fulfilled medical policy",
          "CARE-CONSULT@1.0.0, concerning a bounded consult process",
          "Preserve it; it is not a trial-evidence policy",
        ],
        [
          "Medical Evidence Commons",
          "Proposed here; this explorer is Release A",
          "Requires its own implementation and governance",
        ],
        [
          "Research receipt extension",
          "Proposed here; draft namespace mec.review_receipt/0.1.0-draft",
          "Requires a versioned schema and compatibility tests",
        ],
        ["Patient-data handling", "Excluded", "No patient-data pipeline is authorized by this plan"],
      ],
    },
    {
      type: "p",
      text: "The public demo key deserves a precise distinction: a signature made with it can be mathematically valid, but anyone with that published private key can produce one. It does not establish that a particular operator issued the receipt. Production needs independently trusted keys, issuance controls, rotation, and revocation.",
    },
    {
      type: "note",
      text: "Nothing in this plan authorizes changing the frozen existing policies, weakening golden tests, merging upstream pull requests, deploying mainnet canisters, or converting this synthetic explorer into a patient-data system.",
    },
  ]),

  s("users", "05", "Users and first market", [
    {
      type: "table",
      caption: "First users",
      headers: ["User", "Job to accomplish", "What the MVP provides"],
      rows: [
        [
          "Journal-club organizer",
          "Prepare a defensible discussion of a trial",
          "A concise, source-linked evidence packet",
        ],
        [
          "Clinician-researcher",
          "Examine a specific reported outcome",
          "Endpoint, population, analysis, limitations, and source versions",
        ],
        [
          "Evidence-review group",
          "Maintain a review that can be updated",
          "Versioned contributions and correction history",
        ],
        [
          "Research journalist",
          "Trace a statement and identify uncertainty",
          "Attributed claims and visible disagreements",
        ],
        [
          "Methods reviewer",
          "Check another reviewer’s extraction or interpretation",
          "Reproducible locators, comments, and explicit decisions",
        ],
      ],
    },
    {
      type: "p",
      text: "The initial buyer hypothesis is an evidence-review team that values reduced reconstruction effort. The initial reader can be anyone. Access to public packets and independent verification should not require payment, a wallet, or token ownership.",
    },
    { type: "h3", text: "Not the initial audience" },
    {
      type: "p",
      text: "People seeking personalized diagnosis, an emergency answer, a drug recommendation, insurance approval, or a judgment about the quality of a named clinician’s care.",
    },
    { type: "h3", text: "First collection" },
    {
      type: "p",
      text: "Select one narrow clinical question with a methods-qualified reviewer and an accessible body of randomized trial reports. Choose the question before selecting trials. Publish inclusion and exclusion criteria and include unfavorable, null, and conflicting results that meet those criteria.",
    },
    {
      type: "p",
      text: "This explorer’s first collection is fictional: Glucoril for adults with type 2 diabetes, chosen to exercise the workflow rather than to argue a clinical position. Do not choose a politically charged topic solely for attention. Do not cherry-pick a collection to demonstrate that a favored institution or critic was right.",
    },
  ]),

  s("scope", "06", "Scope and release boundaries", [
    { type: "h3", text: "Release A — synthetic review prototype" },
    {
      type: "ul",
      items: [
        "Ten deliberately fictional fixtures covering success and failure paths. [[/collection|Open the current collection.]]",
        "Read-only public-style views and a local review workflow.",
        "Native draft receipt schema; visibly non-production.",
        "Export and offline structural verification. [[/verify|Open the verifier.]]",
        "No identity enrollment, public submission endpoint, MIRRA dependency, or live payments.",
      ],
    },
    { type: "h3", text: "Release B — curated public-data pilot" },
    {
      type: "ul",
      items: [
        "Twenty trial packets selected using a published collection protocol.",
        "Public registry entries, lawful source links, and permitted source snapshots.",
        "Two-person review of critical extracted fields.",
        "Public correction history and downloadable packets.",
        "Approved research receipt schema and policy, with production issuer trust if labeled authenticated.",
        "Small authorized reviewer cohort; no open-ended document uploads.",
      ],
    },
    { type: "h3", text: "Release C — ICP-backed public registry" },
    {
      type: "ul",
      items: [
        "Certified packet and receipt indexes.",
        "Stable persistence and verified upgrade behavior.",
        "Trusted-root verification, recovery procedures, and accountable controller management.",
        "Public export sufficient to reduce dependence on the hosted interface.",
      ],
    },
    { type: "h3", text: "Release D — MIRRA research pilot" },
    {
      type: "ul",
      items: [
        "A frozen event protocol and model roster.",
        "Prospective predictions locked before outcomes are publicly available.",
        "External resolution, deterministic scoring, and auditable weight updates.",
        "Shadow-only comparison against simple baselines.",
        "No patient-specific output, automated review verdict, or treatment recommendation.",
      ],
    },
    {
      type: "callout",
      kicker: "Non-goals",
      title: "Every initial release excludes",
      body: "Patient records; identifiable case reports; EHR integration; diagnostic images; treatment selection; autonomous clinical decisions; insurance determinations; doctor rankings; patient rankings; token governance; prediction-market wagering; escrow; wallets; payment release; and automatic claim adjudication by an LLM. Later clinical or patient-data functionality would be a separately scoped project, not a routine feature flag.",
    },
  ]),

  s("experience", "07", "The user experience", [
    {
      type: "table",
      caption: "Navigation and screens",
      headers: ["Screen", "Essential content", "Essential action"],
      rows: [
        ["Home", "Plain-language purpose, boundaries, newest corrections", "Open the collection"],
        ["Collection", "Question, eligibility rules, search coverage, inclusion log", "Filter or open a packet"],
        ["Trial packet", "Study identity, source versions, outcomes, review status", "Inspect an outcome claim"],
        ["Claim detail", "Exact claim, supporting and conflicting sources, limitations", "Open source locator or challenge"],
        ["Review workspace", "Independent extraction, comparison, conflicts, sign-off", "Submit an accountable review"],
        ["Receipt detail", "Policy, assertions, non-assertions, issuer and integrity status", "Verify or download"],
        ["Correction history", "What changed, why, who reviewed it, linked versions", "Compare two versions"],
        ["Methods and governance", "Policy versions, roles, funding, appeals, release status", "Inspect the rules"],
      ],
    },
    {
      type: "p",
      text: "The synthetic prototype may combine screens. The MVP should not grow into eight separate services merely because it has eight views.",
    },
    { type: "h3", text: "What a trial packet shows first" },
    {
      type: "ol",
      items: [
        "The clinical research question and the trial’s identity.",
        "A neutral description of the reported result, with endpoint and timeframe.",
        "A source link and precise location for each critical field.",
        "Material limitations and unresolved disagreements.",
        "The review-policy status, explicitly labeled as a process result.",
        "The last source check and whether the packet has been corrected.",
      ],
    },
    {
      type: "p",
      text: "Do not lead with a single number purporting to summarize medical truth.",
    },
    { type: "h3", text: "Separate status displays" },
    {
      type: "table",
      headers: ["Display", "Example", "Meaning"],
      rows: [
        ["Review process", "Complete under policy X", "Specified review steps were evidenced"],
        ["Scientific assessment", "Reviewer disagreement remains", "Interpretation has not been collapsed into a single verdict"],
        ["Artifact integrity", "Digest matches; trusted signature verified", "The supplied bytes and authentication checks passed"],
        ["Currency", "Current check unavailable", "No assurance that no later correction exists"],
        ["MIRRA", "Shadow evaluation only", "Research output, not clinical authority"],
      ],
    },
    {
      type: "note",
      text: "Never collapse these into one unlabeled VERIFIED badge.",
    },
    { type: "h3", text: "Interaction requirements" },
    {
      type: "ul",
      items: [
        "Reading public material needs no account.",
        "Reviewer authorization is separate from public reading.",
        "A draft cannot be mistaken for a published packet.",
        "Every correction view keeps a link to its predecessor.",
        "Missing data appears as missing, not as zero or no adverse events.",
        "Dates distinguish source publication, source capture, review, and registry acceptance.",
        "Keyboard navigation, readable contrast, responsive tables, and meaningful non-color status labels are required.",
        "Source documents and comments are treated as untrusted content, not executable instructions.",
      ],
    },
  ]),

  s("model", "08", "The evidence model", [
    {
      type: "p",
      text: "The system must distinguish five different statements. A source observation can accurately describe an inaccurate paper. A completed review can preserve genuine scientific disagreement. A good forecaster can be wrong on the next event. Each layer must remain inspectable on its own.",
    },
    {
      type: "table",
      headers: ["Layer", "Example", "Who is responsible"],
      rows: [
        [
          "Source observation",
          "A table reports 10 events among 100 participants",
          "Extractor and checking reviewer",
        ],
        [
          "Bounded claim",
          "This specified outcome was reported at this timeframe in this analysis population",
          "Claim author and reviewers",
        ],
        [
          "Scientific interpretation",
          "The estimate may be limited by missing outcome data",
          "Named methods reviewers with rationale",
        ],
        [
          "Process receipt",
          "Both required reviews and source checks were completed",
          "Authorized issuer under a frozen policy",
        ],
        [
          "Forecast assessment",
          "Model A assigned a probability before the event was resolved",
          "Forecaster, independent resolver, and scorer",
        ],
      ],
    },
    { type: "h3", text: "Core entities" },
    {
      type: "table",
      headers: ["Entity", "Required information", "Important constraint"],
      rows: [
        ["Collection", "Question, protocol version, inclusion rules, search cutoff", "Selection history is visible"],
        ["Study", "Registry identifiers, design, public sponsor metadata", "A study is not a publication"],
        [
          "SourceVersion",
          "URL, capture time, document date if known, digest, rights, locator scheme",
          "An updated source creates a new version",
        ],
        [
          "OutcomeClaim",
          "Population, intervention, comparator, outcome, timeframe, analysis population, attributed statement",
          "One claim has one explicit scope",
        ],
        [
          "EvidenceLink",
          "Source version, locator, relationship, extraction method",
          "Supports, contradicts, or contextualizes are distinct",
        ],
        [
          "Assessment",
          "Method version, reviewer, reasoning, uncertainty, conflicts",
          "A judgment is not relabeled as an objective source fact",
        ],
        [
          "ReviewRun",
          "Input manifest, policy digest, rule results, approvals, software provenance",
          "Frozen at issuance",
        ],
        [
          "Receipt",
          "Bound run, policy, manifest, issuer, non-assertions, predecessor",
          "New conclusions require new receipts",
        ],
        [
          "Challenge",
          "Target version, reason, supporting evidence, disposition",
          "A complaint does not by itself prove error",
        ],
        ["ForecastEpoch", "Task, roster, scoring and resolution protocols", "Separate from scientific review"],
      ],
    },
    { type: "h3", text: "Claim fields that cannot be silently collapsed" },
    {
      type: "ul",
      items: [
        "Primary, secondary, exploratory, and post-hoc outcomes.",
        "Patient-important and surrogate outcomes, with reviewer rationale.",
        "Prespecified and subsequently amended analyses.",
        "Intention-to-treat, modified intention-to-treat, per-protocol, and other populations as reported.",
        "Absolute and relative measures, their denominators, and time horizons.",
        "Statistical uncertainty and clinical importance.",
        "Absence of a reported finding and evidence that a finding is absent.",
        "Study-level evidence and a synthesis across studies.",
      ],
    },
    {
      type: "p",
      text: "The application may help organize these distinctions. It must not invent a validated universal evidence score from them.",
    },
  ]),

  s("sources", "09", "Sources and ingestion", [
    {
      type: "table",
      caption: "Permitted first-release sources",
      headers: ["Source", "Use", "Boundary"],
      rows: [
        [
          "ClinicalTrials.gov",
          "Study identifiers and registry information",
          "Registry assertions are not independently verified trial conduct",
        ],
        [
          "Official regulatory publications",
          "Link the relevant assessment or decision document",
          "Do not turn regulatory status into the Commons’ clinical verdict",
        ],
        [
          "Lawfully accessible trial reports",
          "Extract source-linked findings and limitations",
          "Public access does not automatically grant redistribution rights",
        ],
        [
          "Permitted protocols and analysis plans",
          "Compare planned and reported outcomes",
          "Record the version and whether timing is independently established",
        ],
        [
          "Public correction or retraction notices",
          "Link changed publication status",
          "Keep the affected source version and review history",
        ],
      ],
    },
    {
      type: "p",
      text: "Use documented source APIs where appropriate. The [ClinicalTrials.gov API](https://clinicaltrials.gov/data-api/api) is the implementation starting point; verify its current schema, usage constraints, and history availability before building an adapter. Do not assume today’s registry response contains the exact historical record needed for a preregistration claim.",
    },
    {
      type: "p",
      text: "For PMC, use its authorized retrieval services and check each article’s license. Not every PMC article permits the same reuse, and bulk retrieval has specific restrictions. The default fallback is citation and lawful linking, not mirroring. [PMC Open Access Subset](https://pmc.ncbi.nlm.nih.gov/tools/openftlist/)",
    },
    { type: "h3", text: "Ingestion procedure" },
    {
      type: "ol",
      items: [
        "Apply the collection’s eligibility criteria; log included and excluded studies with reasons.",
        "Resolve study identifiers separately from publications. Detect multiple papers from the same trial.",
        "Fetch through an allowlisted adapter with bounded size, time, and retry limits.",
        "Record original URL, final URL, capture timestamp, source-stated date, content type, and rights metadata.",
        "Hash the exact captured bytes where retention is permitted. Hash normalized extracted data separately.",
        "Preserve the parser/OCR version, extraction version, and source locator convention.",
        "Extract candidate facts. AI output remains an unapproved draft.",
        "Have reviewers validate critical fields against the source.",
        "Freeze a manifest identifying the exact source and claim versions used by the review.",
        "Publish only the approved public-safe projection and permitted supporting material.",
      ],
    },
    { type: "h3", text: "Provenance levels" },
    {
      type: "p",
      text: "Use descriptive labels such as LINK_ONLY, CAPTURED_COPY, REVIEWED_EXTRACTION, and PUBLISHER_SIGNED when actually supported. These are provenance categories, not medical evidence grades. Do not infer publisher authentication merely because your own service hashed or signed a downloaded file.",
    },
    { type: "h3", text: "Failure behavior" },
    {
      type: "ul",
      items: [
        "Unavailable source: preserve the link and mark the unavailable check; never fabricate its contents.",
        "Ambiguous matching: hold for a reviewer rather than merging trials automatically.",
        "Unavailable historical version: state that preregistration timing could not be established.",
        "Parser disagreement: present the conflicting fields for review.",
        "Retraction or correction: create a source-status event and queue affected packets for review; do not silently delete or overwrite the old record.",
        "Rights uncertainty: retain only permitted metadata and links until resolved.",
      ],
    },
  ]),

  s("review", "10", "Review and scientific disagreement", [
    { type: "h3", text: "Two-person review" },
    {
      type: "p",
      text: "For the pilot, one qualified person prepares the extraction and a second checks the critical fields. Where feasible, both extract critical fields independently before comparison. The reviewer pool must include clinical-domain expertise and research-methods expertise; a professional title alone is not proof of suitability for every task.",
    },
    {
      type: "p",
      text: "Critical fields include the trial identity, outcome definition, timeframe, analysis population, numerator/denominator, reported effect measure, uncertainty interval, primary/secondary designation, and material amendments.",
    },
    {
      type: "p",
      text: "Track reviewer identity and conflicts in an access-controlled enrollment process. Public review records use an approved professional attribution or a role-key identifier. No patient identity belongs in either workflow.",
    },
    { type: "h3", text: "Structured assessment" },
    {
      type: "p",
      text: "For suitable randomized-trial results, reviewers may use the appropriate version of an established risk-of-bias method. Cochrane’s RoB 2 is result-specific and requires justified judgments. Do not call a locally shortened checklist “RoB 2” or imply Cochrane endorsement; implementing the actual method requires its full applicable guidance and training. [Cochrane Handbook, Chapter 8](https://www.cochrane.org/authors/handbooks-and-manuals/handbook/current/chapter-08)",
    },
    {
      type: "p",
      text: "The MVP can instead publish explicitly labeled **structured reviewer notes**, without claiming a formal validated assessment. The collection protocol must say which approach it uses before reviewing its studies.",
    },
    { type: "h3", text: "Disagreement procedure" },
    {
      type: "ol",
      items: [
        "Distinguish a transcription disagreement from a methodological interpretation.",
        "Compare the exact source versions and locators.",
        "Resolve clear extraction errors with an explanation.",
        "Refer unresolved material methodological disputes to a third qualified reviewer where available.",
        "Publish competing interpretations with their evidence when no responsible resolution exists.",
        "Record the disposition and any unresolved limitation.",
      ],
    },
    {
      type: "p",
      text: "A completed process can conclude that evidence is conflicting or insufficient. Do not penalize a reviewer for documenting uncertainty. Do not use MIRRA weights or an audience vote to decide which interpretation is scientifically correct.",
    },
    { type: "h3", text: "AI assistance" },
    {
      type: "p",
      text: "AI may suggest extraction, locate candidate passages, compare versions, and draft summaries. Every published substantive claim must have a source locator and authorized human approval. A model’s confidence statement is neither a credential nor a verification result.",
    },
    {
      type: "p",
      text: "Documents cannot instruct an agent to issue receipts, alter policies, retrieve secrets, browse arbitrary internal URLs, or ignore these boundaries. Retrieval content is data.",
    },
  ]),

  s("policy", "11", "The first review policy", [
    {
      type: "lede",
      text: "Proposed draft identifier: **MED-EVIDENCE-REVIEW@0.1.0-draft**. [[/methods|Inspect the frozen draft body in this explorer.]]",
    },
    {
      type: "p",
      text: "**Bounded obligation:** Produce a traceable review packet for a specified trial outcome using a specified set of public source versions and the declared review method.",
    },
    {
      type: "p",
      text: "**Not the obligation:** Prove that the intervention works, that the trial was conducted honestly, or that the result applies to a particular person.",
    },
    {
      type: "p",
      text: "The draft policy is frozen as 1.0.0 only after its schema, semantics, fixtures, and independent verifier pass review. A change after issuance requires a new version.",
    },
    { type: "h3", text: "Required assertions" },
    {
      type: "table",
      headers: ["Code", "What must be evidenced", "Missing or conflicting evidence"],
      rows: [
        [
          "SCOPE_FIXED",
          "Study, outcome, population, timeframe, method, and source cutoff are specified",
          "Incomplete; conflicting scope blocks issuance",
        ],
        [
          "SOURCE_MANIFEST_BOUND",
          "All relied-on source versions and lawful-access metadata are bound to the run",
          "Incomplete, or blocked if the manifest cannot be reconciled",
        ],
        [
          "CRITICAL_FIELDS_CHECKED",
          "Two authorized reviews account for every critical field, including explicit unknowns",
          "Incomplete until the checking record exists",
        ],
        [
          "METHOD_AND_LIMITATIONS_RECORDED",
          "Method version, assumptions, missing information, and material limitations are recorded",
          "Incomplete",
        ],
        [
          "DISAGREEMENTS_ACCOUNTED_FOR",
          "Material disagreements are resolved with reasons or visibly retained",
          "Incomplete if a disagreement is hidden or unaddressed",
        ],
        [
          "CONFLICT_REVIEW_COMPLETED",
          "Reviewer disclosures and the declared assignment rule were checked",
          "Blocked for prohibited conflicts; incomplete for missing disclosure",
        ],
        [
          "PUBLICATION_ALLOWLIST_PASSED",
          "Output uses approved fields and passed privacy/rights review",
          "Blocked when unsafe material is detected",
        ],
        [
          "AUTHORIZED_SIGNOFF_PRESENT",
          "Required role-key approvals bind the exact run inputs",
          "Blocked for invalid authority; incomplete for missing approval",
        ],
      ],
    },
    {
      type: "p",
      text: "“Fields checked” can include “not reported in the source.” It does not authorize inventing a value. “Conflict review completed” does not prove that all undisclosed relationships have been discovered.",
    },
    { type: "h3", text: "Deterministic native draft result" },
    {
      type: "table",
      headers: ["Conditions, evaluated in this order", "Result"],
      rows: [
        [
          "Prohibited content, invalid authority, revoked approval, or unreconciled run-input conflict",
          "BLOCKED",
        ],
        [
          "No blocking condition, but at least one required review assertion lacks evidence",
          "INCOMPLETE",
        ],
        ["All required assertions satisfied", "COMPLETE"],
      ],
    },
    {
      type: "p",
      text: "Malformed requests are rejected without issuing a receipt. A BLOCKED public receipt, if published, includes only safe reason codes, never the offending private content. This policy has no “partly medically true” result and no partial-payment rule.",
    },
    { type: "h3", text: "Mandatory non-assertions" },
    {
      type: "p",
      text: "Every receipt must state that it does not establish:",
    },
    {
      type: "ul",
      items: [
        "Clinical correctness.",
        "Treatment effectiveness or safety for an individual.",
        "Diagnosis or treatment selection.",
        "Medical necessity or insurance coverage.",
        "Completeness of all worldwide evidence.",
        "Absence of fraud, publication bias, or undisclosed conflicts.",
        "That a source’s contents accurately describe real-world trial conduct.",
        "That the packet replaces a systematic review or professional judgment.",
      ],
    },
    {
      type: "note",
      text: "These restrictions apply equally to API responses, badges, print views, exports, and social previews. An empty or weakened mandatory non-assertion set is a verification failure.",
    },
  ]),

  s("disclosure", "12", "The later disclosure policy", [
    {
      type: "p",
      text: "Proposed draft identifier: **MED-TRIAL-DISCLOSURE@0.1.0-draft**. This is a separate, later policy. Its obligation is a defined **document-disclosure requirement**, not completion of the Commons’ own review. It needs a precise governing protocol or obligation instrument; the application must not invent a legal duty from a missing registry field.",
    },
    {
      type: "table",
      caption: "Candidate assertions",
      headers: ["Assertion", "What must be fixed before implementation"],
      rows: [
        [
          "Registration timing documented",
          "Acceptable historical source, relevant enrollment date, precision, timezone, and uncertainty treatment",
        ],
        ["Prespecified endpoints located", "Accepted source versions and rules for amendments"],
        [
          "Result disclosure located",
          "What counts as a result disclosure and what deadline, if any, actually applies",
        ],
        [
          "Safety reporting located",
          "Required sections and denominators; presence is not proof of complete harm ascertainment",
        ],
        [
          "Funding/conflict statement located",
          "Accepted statement and source location; disclosure is not proof of independence",
        ],
      ],
    },
    {
      type: "p",
      text: "An absent document produces **not located under this search protocol**, not “research misconduct.” Unknown legal applicability remains unknown. Do not publish overdue/legal-noncompliance labels until competent review establishes the applicable rule and its exceptions.",
    },
    {
      type: "note",
      text: "Keep this policy outside the first pilot unless its added value clearly justifies the methods and review burden. This paper deliberately keeps the policy in draft until it is actually specified and tested.",
    },
  ]),

  s("pof", "13", "Proof of Fulfillment integration", [
    { type: "h3", text: "What can be reused" },
    {
      type: "p",
      text: "The useful pattern is a bounded obligation, an immutable policy, an input-bound evaluation, an independently checkable receipt, mandatory non-assertions, and history-preserving corrections. Preserve evaluator/verifier separation and the existing golden cases. [Fulfilled project doctrine](https://github.com/Mitosis50/proof-of-fulfillment/blob/93b236239d7ae28ce9edaefd15b624baac612008/AGENTS.project.md)",
    },
    { type: "h3", text: "The compatibility gap" },
    {
      type: "p",
      text: "The inspected current types require monetary and destination-related fields for obligations and receipt subjects, and the policy domain is restricted to education, care, or housing. The evaluator contains settlement and reference-based independence logic. A research review is therefore **not a drop-in new policy** in the current schema.",
    },
    {
      type: "p",
      text: "Do not fabricate a zero-dollar payment, fictional payee, or meaningless case reference merely to make a trial packet fit. Do not modify CARE-CONSULT@1.0.0 to make its existing receipts mean something new.",
    },
    { type: "h3", text: "Chosen integration path" },
    {
      type: "ol",
      items: [
        "Specify the research obligation and public subject as non-monetary objects in this separate Commons project.",
        "Use a clearly separate draft namespace, mec.review_receipt/0.1.0-draft, during the prototype.",
        "Propose a versioned research extension to Proof of Fulfillment with explicit domain, types, validation, status mapping, issuer semantics, and test vectors.",
        "Retain the old verifier for old receipts. Add version dispatch rather than silently changing old bytes or interpretation.",
        "Adopt the approved extension only after its compatibility and security gates pass.",
      ],
    },
    {
      type: "callout",
      kicker: "Namespace",
      title: "Commons draft receipt, not a PoF receipt",
      body: "A native draft file is not a valid .pof.json file merely because it follows similar ideas. Until extension approval, the UI must say “Commons draft receipt,” not “PoF-compatible receipt.” If upstream does not adopt the extension, continue under the clearly separate Commons namespace and document its independent protocol status.",
    },
    { type: "h3", text: "Illustrative result mapping for extension review" },
    {
      type: "table",
      headers: ["Commons draft result", "Possible PoF result", "Condition"],
      rows: [
        ["COMPLETE", "VERIFIED", "Only if the new policy’s required assertions all hold"],
        ["INCOMPLETE", "INSUFFICIENT_EVIDENCE", "Missing required process evidence"],
        ["BLOCKED", "FAILED or EXCEPTION", "Determined by the approved reason-code mapping"],
      ],
    },
    {
      type: "note",
      text: "This mapping is not finalized by this paper. A developer must not silently use it as a production compatibility contract.",
    },
  ]),

  s("receipts", "14", "Receipts and independent verification", [
    { type: "h3", text: "Three distinct verification questions" },
    {
      type: "ol",
      items: [
        "**Integrity:** Do these bytes match their digest and supplied cryptographic proof?",
        "**Authority and currency:** Was the issuer trusted for this policy, and is a later correction or key revocation known?",
        "**Evidence review:** Can the supporting packet justify the asserted review steps?",
      ],
    },
    {
      type: "p",
      text: "Checking a receipt answers only the checks actually performed. It does not independently repeat a clinical trial. An offline verifier cannot guarantee that no later correction exists.",
    },
    { type: "h3", text: "Proposed receipt contents" },
    {
      type: "ul",
      items: [
        "Protocol and schema version.",
        "Stable receipt identifier and content digest.",
        "Study/outcome scope without patient or monetary fields.",
        "Frozen policy identifier, version, and digest.",
        "Review-run digest and full input-manifest digest.",
        "Rule results with approved rationale or safe reason codes.",
        "Required non-assertions.",
        "Issuer key identifier and authority-registry snapshot reference.",
        "Explicit timestamp types, including any independently witnessed registry acceptance.",
        "Previous and superseded receipt references, if applicable.",
        "Detached seal and the exact declared signing profile.",
      ],
    },
    { type: "h3", text: "Canonical bytes" },
    {
      type: "p",
      text: "The new research profile must specify a canonical representation, permitted scalar types, Unicode treatment, array ordering, and rejection rules. Use a reviewed canonical-JSON implementation with cross-language test vectors; do not assume any “sorted JSON” function is automatically equivalent to [RFC 8785](https://www.rfc-editor.org/rfc/rfc8785). Numerical hashes must not depend on floating-point rendering.",
    },
    {
      type: "p",
      text: "Separate domains for policies, manifests, runs, receipts, and signatures. Hash the unsigned receipt payload; attach the signature afterward. Do not reuse an old PoF domain for a changed payload schema.",
    },
    { type: "h3", text: "Signing and trust" },
    {
      type: "p",
      text: "For a production research extension, use an approved non-demo signing key held outside browser bundles and outside LLM tools. The allowlisted trust registry binds a key to authorized policies and its validity history. A receipt-supplied public key is not its own trust anchor.",
    },
    {
      type: "p",
      text: "Treat an issuer-written timestamp as an issuer claim. Registry acceptance can witness that the receipt existed by that registry event; it cannot prove when the underlying trial action occurred.",
    },
    { type: "h3", text: "Independent verifier outputs" },
    {
      type: "p",
      text: "Return separate machine-readable fields for schema support, digest validity, signature validity, issuer trust, policy consistency, ancestor completeness, correction currency, and evidence availability. Examples include PASS, FAIL, UNKNOWN, and NOT_CHECKED at the check level. The verifier is a separate implementation path. It must not import the evaluator or use “call issuance again” as its proof.",
    },
    { type: "h3", text: "Portable packet" },
    {
      type: "p",
      text: "The proposed .mec.json export contains the receipt, required ancestors, policy body, public review record, input manifest, source references, and available proof material. The interface must not send dropped files to an external server merely to verify them locally. Remote currency checks should be explicit and use public identifiers only. Export remains useful if the original website closes, but availability of third-party documents cannot be guaranteed.",
    },
  ]),

  s("mirra", "15", "MIRRA integration", [
    {
      type: "p",
      text: "For a precisely defined task, can an adaptive combination of forecasting systems perform better than simple baselines on future, externally resolved events? This is different from asking which physician is trustworthy or which treatment is best. The proposed integration weights **versioned forecasting systems within one task**, not people, institutions, clinical decisions, or all medical evidence.",
    },
    {
      type: "p",
      text: "MIRRA does not create the outcome labels. The outcome protocol, independent resolvers, and scoring adapter remain essential trust boundaries outside its mathematical kernel.",
    },
    { type: "h3", text: "Preserve the frozen core" },
    {
      type: "p",
      text: "The inspected protocol uses mirra.v1-pilot, scale S = 2^32 = 4294967296, 2–64 active experts, learning rate 1/8, and losses in integer range [0,S]. Its output weights sum to S. The active expert set locks with the first correction. Identical event retries return the original result; conflicting loss vectors under the same key are rejected. [MIRRA frozen protocol](https://github.com/Mitosis50/MIRRA/blob/4ad47db0671cad3a151b4b77d6f2248f5ed84bdc/docs/PROTOCOL.md)",
    },
    {
      type: "p",
      text: "These are integration constraints, not settings for the Commons to change. Keep medical records, receipt evaluation, clinical terminology, and governance debate outside MIRRA Core.",
    },
    { type: "h3", text: "A bounded research forecast task" },
    {
      type: "p",
      text: "Illustrative task: **Will the designated public result report that the prespecified primary endpoint met the exact success criterion recorded in this event protocol?**",
    },
    {
      type: "p",
      text: "Before accepting forecasts, a methods reviewer must lock the endpoint, analysis population, statistical criterion, accepted reporting source, relevant amendments, and handling of inconsistent reports. If that cannot be specified unambiguously, do not score the event. The eventual label concerns what the designated result establishes under that resolution protocol. It is not a finding of patient benefit, clinical importance, absence of fraud, or suitability for treatment.",
    },
    { type: "h3", text: "Exact Brier-loss adapter" },
    {
      type: "p",
      text: "For binary outcome y in {0,1} and probability p in [0,1], define the single-event loss as loss = (p − y)². This formula is bounded in [0,1], fitting MIRRA’s declared loss range. It is a proposed adapter choice, not proof of medical validity.",
    },
    {
      type: "code",
      caption: "Integer encoding",
      text: "S = 4294967296\nP = round_ties_even(p * S)\nL = round_ties_even((P - y*S)^2 / S)\n\nRequire 0 <= P <= S and 0 <= L <= S.\nSubmit L as the unsigned Q32.32 loss.",
    },
    {
      type: "table",
      caption: "Adapter arithmetic checks only — not a MIRRA execution",
      headers: ["Prediction", "Outcome", "Mathematical loss", "Encoded loss"],
      rows: [
        ["0.75", "1", "0.0625", "268435456"],
        ["0.25", "1", "0.5625", "2415919104"],
        ["0.50", "0", "0.25", "1073741824"],
        ["1.00", "0", "1.00", "4294967296"],
      ],
    },
    {
      type: "p",
      text: "Use checked wide integers or BigInt for intermediate squares, not JavaScript floating-point arithmetic. Store integer protocol values as decimal strings in JSON where the schema requires exact representation.",
    },
    { type: "h3", text: "Correcting a scored event" },
    {
      type: "p",
      text: "The existing additive update stream does not provide an assumed “undo this event” operation. Adding a second event with the corrected outcome would double-count; submitting negative losses would violate the allowed range. For the pilot, pause affected scoring, retain the historical epoch, and construct a successor epoch by replaying the original eligible event sequence with the approved corrected labels and the original locked predictions.",
    },
    {
      type: "note",
      text: "Until release assurance and prospective usefulness are separately demonstrated, MIRRA remains off or shadow-only. Mathematical release approval does not substitute for task validation. Twenty historical trials can test extraction and software behavior. They do not establish prospective forecasting ability.",
    },
  ]),

  s("example", "16", "A complete synthetic example", [
    {
      type: "p",
      text: "Everything in this section is fictional. Identifiers beginning SYNTHETIC- are not real trial registrations. These are proposed test fixtures, not clinical evidence or signed receipts. [[/collection|The explorer’s Glucoril collection is the living version of this idea.]]",
    },
    { type: "h3", text: "Packet creation" },
    {
      type: "ol",
      items: [
        "The collection protocol selects SYNTHETIC-TRIAL-001.",
        "Source A contains a fictional protocol; Source B contains a fictional result table.",
        "Reviewer A extracts the designated outcome at day 90 for the declared analysis population.",
        "Reviewer B checks the source and finds that a denominator was copied as 120 instead of 100.",
        "The reviewers correct the draft before publication and record the comparison.",
        "They retain a methodological disagreement about missing outcome data.",
        "All review-policy assertions are satisfied because the disagreement is visible and the required checks are documented.",
        "The application issues a synthetic draft receipt with result COMPLETE and the mandatory non-assertions.",
      ],
    },
    {
      type: "quote",
      text: "Review process complete. Methodological disagreement remains. No clinical conclusion certified.",
    },
    { type: "h3", text: "Challenge after publication" },
    {
      type: "table",
      headers: ["Event", "Stored record", "Public effect"],
      rows: [
        ["Original publication", "Packet v1 and receipt R1", "First reviewed version is visible"],
        ["Challenge", "C1 cites a source-location mismatch", "Current view marks an open challenge"],
        ["Review of challenge", "Two reviewers confirm the mismatch", "Decision explains the error"],
        ["Correction", "Packet v2 and receipt R2 reference v1/R1", "Current view points to v2 and shows a diff"],
        ["Recheck of R1", "Original digest still matches", "R1 is authentic as an old artifact, not the current review"],
      ],
    },
    {
      type: "p",
      text: "This is the central correction behavior. The original artifact’s mathematical validity and its current evidentiary status are different questions.",
    },
  ]),

  s("icp", "17", "ICP architecture", [
    {
      type: "p",
      text: "Begin with one application, one off-chain worker/signing boundary, and one registry canister when the ICP stage is reached. MIRRA is a separate optional canister. Separate logical modules do not require a fleet of canisters.",
    },
    {
      type: "table",
      headers: ["Component", "Recommended location", "Responsibility"],
      rows: [
        [
          "Public interface",
          "Static web application; ICP assets are an option",
          "Render packets, source links, status, local verification, exports",
        ],
        ["Review workspace", "Same application with authorized write access", "Draft, compare, approve, and challenge"],
        [
          "Ingestion and extraction worker",
          "Conventional controlled service",
          "Fetch public sources, parse, propose extraction, enforce quotas",
        ],
        [
          "Issuance component",
          "Controlled service with protected keys",
          "Validate approvals and run bindings, evaluate frozen policy, sign",
        ],
        [
          "Commons registry",
          "One Rust ICP canister",
          "Public manifests, receipt index, correction lineage, key/policy status, audit events",
        ],
        ["Source storage", "Rights-appropriate storage", "Retain permitted public snapshots and exports"],
        [
          "MIRRA adapter",
          "Separate constrained service/module",
          "Score externally resolved events and submit authorized vectors",
        ],
        ["MIRRA Core", "Existing separate ICP canister, gated", "Deterministic updates and certified state"],
      ],
    },
    { type: "h3", text: "Why use ICP here?" },
    {
      type: "p",
      text: "The proposed benefit is a common, verifiable reference for published manifests, policies, and correction history. A conventional database can also deliver a useful first product. ICP is justified only if independent state verification and shared registry continuity create value beyond the added operational complexity.",
    },
    {
      type: "p",
      text: "Certified variables support client verification of canister-certified state. Clients must actually verify certificates and witnesses against trusted roots; merely receiving a certificate field is insufficient. This authenticates returned state, not the medical statements within it. [ICP certified variables](https://docs.internetcomputer.org/guides/backends/certified-variables/)",
    },
    { type: "h3", text: "Issuance consistency" },
    {
      type: "ol",
      items: [
        "Freeze and validate approved inputs.",
        "Evaluate and persist the unsigned run and its content digest.",
        "Obtain the authorized detached signature once.",
        "Persist the signed receipt and registration attempt.",
        "Submit to the registry with a canonical idempotency key.",
        "On timeout, check the existing registry result before retrying.",
        "Mark publication complete only after the accepted registry record is confirmed.",
      ],
    },
    {
      type: "p",
      text: "Recommended idempotency scope: obligation identifier, policy digest, and approved run digest. Identical retries return the same receipt. A changed run is a new, explicitly linked issuance — not a silent retry.",
    },
    {
      type: "note",
      text: "An append-only application rule is not an unconditional guarantee against all future controller actions. External exports and independently retained checkpoints help make tampering or loss detectable; they do not eliminate all governance risk.",
    },
  ]),

  s("contracts", "18", "Data contracts and application interfaces", [
    {
      type: "p",
      text: "The TypeScript sketch below communicates object boundaries. It is not a complete JSON Schema, validation library, compiled implementation, or existing PoF type. Runtime validators must enforce field lengths, exact allowed keys, allowed code sets, rule uniqueness, decimal range, timestamp precision, identifier syntax, UTF-8 validity, and links between records.",
    },
    {
      type: "code",
      caption: "Draft contract sketch",
      text: `type Digest = string; // "sha256:" + 64 lowercase hex
type ReviewResult = "COMPLETE" | "INCOMPLETE" | "BLOCKED";

interface ReviewReceiptDraft {
  record_type: "mec.review_receipt";
  schema_version: "0.1.0-draft";
  receipt_id: string;
  scope: OutcomeScope;
  policy: { id: string; version: string; digest: Digest };
  input_manifest_digest: Digest;
  run_digest: Digest;
  rules: Array<{ code: string; status: RuleStatus; rationale_ref: string }>;
  result: ReviewResult;
  not_asserted: string[]; // exact mandatory set
  issuer_key_id: string;
  issuer_claimed_at: string;
  predecessor_receipt_digest: Digest | null;
  supersedes_receipt_digest: Digest | null;
}`,
    },
    { type: "h3", text: "Role separation" },
    {
      type: "p",
      text: "At minimum distinguish reader, contributor, reviewer, adjudicator, issuer, source worker, MIRRA writer, policy administrator, and deployment controller. A contributor cannot promote their own output into an issued receipt. A model cannot acquire issuance authority by writing persuasive text. Public access does not imply public write access.",
    },
    { type: "h3", text: "Protocol limits to freeze" },
    {
      type: "p",
      text: "Proposed pilot limits: 100 items per read page, 25 source references per outcome packet, a 2 MiB public JSON import limit, and one outcome per review run. Larger artifacts require explicit versioned handling; reject oversize input rather than truncating signed data. Rate limits and cost ceilings apply to both successful and failed operations.",
    },
  ]),

  s("security", "19", "Security and threat model", [
    {
      type: "table",
      headers: ["Threat", "Required mitigation", "Residual limitation"],
      rows: [
        [
          "Fabricated evidence with a valid receipt",
          "Source provenance, critical-field review, explicit non-assertions",
          "Cryptography cannot establish that trial conduct matched the paper",
        ],
        [
          "Demo or self-supplied key accepted as trusted",
          "Separate demo roots; production trust allowlist; reject self-anchoring",
          "Enrollment can still be compromised",
        ],
        [
          "Prompt injection in a paper",
          "Inert parsing; tool isolation; no document-controlled authority",
          "Extracted text still requires human validation",
        ],
        [
          "Reviewer collusion or concealed conflict",
          "Assignment rules, disclosures, independent review, appeals",
          "Undisclosed relationships cannot be ruled out absolutely",
        ],
        [
          "Receipt tampering or forged lineage",
          "Domain-separated digests, trusted signatures, ancestor validation",
          "Old valid receipts can still be misleading without currency checks",
        ],
        [
          "Source-fetch SSRF or malware",
          "Allowlisted destinations, redirect checks, size limits, isolated parsers",
          "New parser vulnerabilities remain possible",
        ],
        [
          "Accidental personal-data publication",
          "Field allowlists, prepublication review, no raw upload by default",
          "Redaction scanners are imperfect",
        ],
        [
          "Key/controller compromise",
          "Least privilege, protected keys, rotation, emergency pause, audited recovery",
          "A compromised quorum can cause damage",
        ],
      ],
    },
    { type: "h3", text: "Hard security invariants" },
    {
      type: "ul",
      items: [
        "No client-supplied string can grant a role.",
        "No uploaded public key can grant itself issuer trust.",
        "No mutable policy lookup can replace the policy digest bound to an old receipt.",
        "No unreviewed model output can become a published clinical claim or process assertion.",
        "No agent output can authorize payment, treatment, or MIRRA governance.",
        "No background task can exceed a configured spending ceiling.",
        "No recovery procedure can erase known corrections to make status look cleaner.",
        "No test may be weakened to disguise a violated protocol invariant.",
      ],
    },
    {
      type: "note",
      text: "Commission independent security review before meaningful public reliance on authenticated issuance. Internal tests and a separate verification module are valuable, but neither is an external audit.",
    },
  ]),

  s("privacy", "20", "Privacy and medical boundaries", [
    { type: "h3", text: "Public-data-only by design" },
    {
      type: "p",
      text: "**Permitted:** public study identifiers, public aggregate study results, citation metadata, approved professional review attributions, policy bodies, safe review notes, manifests, and correction events.",
    },
    {
      type: "p",
      text: "**Excluded:** patient charts, names, contact information, record numbers, exact patient visit details, private consult receipts, diagnostic media, identifiable narratives, private billing records, and leaked or access-controlled study data.",
    },
    {
      type: "p",
      text: "Published case reports and very small or highly specific datasets still need identifiability review. “Already online” is not sufficient reason to ingest and republish them. The pilot excludes individual case reports altogether.",
    },
    { type: "h3", text: "Hashing is not de-identification" },
    {
      type: "p",
      text: "Do not publish a deterministic hash of a patient identifier or a predictable private event tuple and call it anonymous. Matching and guessing can expose information, and combinations of fields can identify someone without a name. The product should not claim HIPAA Safe Harbor or Expert Determination merely because it removes names or hashes fields. [HHS de-identification guidance](https://www.hhs.gov/hipaa/for-professionals/special-topics/de-identification/index.html)",
    },
    { type: "h3", text: "A blockchain or encryption does not establish compliance" },
    {
      type: "p",
      text: "This paper makes no claim that ICP, a particular hosting provider, or the proposed product is HIPAA-compliant. Do not send patient data to external model providers under this plan. [HHS cloud guidance](https://www.hhs.gov/hipaa/for-professionals/special-topics/health-information-technology/cloud-computing/index.html)",
    },
    { type: "h3", text: "Medical-device and intended-use boundary" },
    {
      type: "p",
      text: "The initial intended use is research evidence organization and transparent review, without patient-specific treatment output. Adding individualized diagnosis, risk prediction, or treatment recommendations requires a new intended-use and regulatory assessment before implementation. A disclaimer alone does not settle classification. [FDA Clinical Decision Support Software guidance](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/clinical-decision-support-software)",
    },
    { type: "h3", text: "Incident containment" },
    {
      type: "p",
      text: "If unsafe personal data appears, stop further publication, restrict access to the exposed material where possible, preserve a restricted incident record, and obtain appropriate privacy/legal review. Never promise complete deletion from public replicas, downloaded files, external archives, or immutable commitments. Preventing publication is the primary control.",
    },
  ]),

  s("governance", "21", "Governance and accountability", [
    { type: "h3", text: "The Commons charter" },
    {
      type: "ol",
      items: [
        "Public evidence access and independent verification remain free at ordinary human-use volumes.",
        "Scientific conclusions are not sold, voted into truth, or dictated by sponsors.",
        "Contributions carry source attribution and an accountable review trail.",
        "Material disagreement is represented fairly with its supporting evidence.",
        "Known errors are corrected visibly; appropriate corrections are not treated as reputational defeat.",
        "Policies, funding, conflicts, release status, and governance changes are inspectable.",
        "Users can export public packets and the verification information needed to interpret them.",
        "Private patients and personal medical decisions stay outside the product’s initial scope.",
      ],
    },
    { type: "h3", text: "Pilot responsibilities" },
    {
      type: "table",
      headers: ["Role", "Decision rights", "Restriction"],
      rows: [
        [
          "Product steward",
          "Scope, budget, collection priorities",
          "Cannot override a scientific review by personal preference",
        ],
        [
          "Methods lead",
          "Review protocol and critical-field definitions",
          "Must disclose conflicts and document changes",
        ],
        [
          "Clinical-domain reviewer",
          "Context and outcome interpretation",
          "Authority is limited to demonstrated domain competence",
        ],
        [
          "Second reviewer/adjudicator",
          "Independent checking and disputes",
          "Cannot adjudicate their own challenged work alone",
        ],
        [
          "Security maintainer",
          "Keys, vulnerabilities, incident containment",
          "Cannot quietly change receipt conclusions",
        ],
        [
          "Policy approvers",
          "Approve future policy versions",
          "Cannot reinterpret existing signed policies in place",
        ],
      ],
    },
    {
      type: "p",
      text: "One person can hold multiple practical roles in a prototype, but such overlap must be disclosed and cannot satisfy an independence requirement by changing their account name. If qualified independent review is unavailable, publish only a clearly labeled single-author draft, not a policy-complete independent review.",
    },
    { type: "h3", text: "Challenges and appeals" },
    {
      type: "p",
      text: "Accept evidence-linked challenges, give the target contributor a fair opportunity to respond, assign unconflicted review, publish the reasoned disposition, and permit one documented appeal to a different qualified reviewer where feasible. An unresolved complaint remains a complaint. An upheld challenge identifies the specific error; it is not a blanket judgment about a person or institution.",
    },
    { type: "h3", text: "Licensing" },
    {
      type: "p",
      text: "Proposed approach: permissively licensed original software, an explicit reuse license for original review text, and rights-aware treatment of third-party documents. The Commons cannot relicense publishers’ papers by declaring itself open. No token, token-weighted voting, reviewer speculation market, or transferable reputation asset is required.",
    },
  ]),

  s("operations", "22", "Operations and recovery", [
    {
      type: "p",
      text: "Maintain a small operating register containing collection owner, methods owner, software version, issuer keys, controller arrangement, budget ceiling, source adapters, source-check schedule, incident contact, and current release gates.",
    },
    { type: "h3", text: "Pilot targets, not contractual promises" },
    {
      type: "ul",
      items: [
        "Acknowledge ordinary review challenges within five working days.",
        "Triage suspected privacy or key-compromise incidents promptly under an explicit staffed incident plan.",
        "Check source availability and correction status on a published schedule and at publication.",
        "Record unresolved queues and missed targets openly.",
        "Pause new issuance if safe review or operational capacity is unavailable.",
      ],
    },
    {
      type: "p",
      text: "Do not promise 24/7 clinical support or emergency response. This is not an emergency medical service.",
    },
    { type: "h3", text: "Failure modes visible to users" },
    {
      type: "ul",
      items: [
        "Registry unavailable: readable cached packet may remain available, but current-status verification is unknown.",
        "Signing service unavailable: drafts remain drafts; no fabricated authenticated receipt.",
        "MIRRA unavailable: Commons review and receipt functions continue; no invented weights.",
        "Source removed: explain missing availability while retaining permitted provenance.",
        "Key compromise: suspend affected issuance, publish trust-status changes, and review affected receipts using the approved incident protocol.",
      ],
    },
  ]),

  s("sustainability", "23", "Sustainability and cost control", [
    {
      type: "p",
      text: "Charge for useful services around the Commons, not favorable findings: institutional workflow, integrations, and support; curation and review labor with payment independent of outcome; training in evidence-packet methods; hosted private organizational workflow containing no patient data; grants or disclosed sponsorship for topic collections.",
    },
    {
      type: "p",
      text: "Public evidence packets, methods, correction history, and ordinary independent verification remain freely accessible. Bulk hosted compute or enterprise service may have transparent quotas without charging a person to check an already downloaded receipt.",
    },
    { type: "h3", text: "Sponsorship firewall" },
    {
      type: "p",
      text: "Sponsors may propose topics or fund labor. They do not select the scientific conclusion, suppress an unfavorable result, choose their own unconflicted status, remove a valid challenge, or buy MIRRA weight. Funding and assignment decisions must be visible.",
    },
    { type: "h3", text: "Cheapest useful starting point" },
    {
      type: "p",
      text: "Before infrastructure spending, create a few synthetic packets and have intended users explain what they understand. Then manually prepare a small number of public packets to measure actual review time. Automate only the repeated work shown to be costly.",
    },
    { type: "h3", text: "Illustrative pilot budget" },
    {
      type: "p",
      text: "The following is a hypothetical planning calculation, **not a supplier quote, market-rate estimate, approved spend, or all-in development budget**. Two reviewer-hours per packet is an assumption to measure, not a clinical-quality guarantee.",
    },
    {
      type: "table",
      headers: ["Input", "Assumption", "Illustrative cost"],
      rows: [
        ["Review labor", "20 packets × 2 total reviewer-hours × $75/hour", "$3,000"],
        ["Coordination", "10 hours × $50/hour", "$500"],
        ["Infrastructure and extraction allowance", "Fixed pilot cap", "$200"],
        ["Subtotal", "Sum of above", "$3,700"],
        ["Contingency", "20% of subtotal", "$740"],
        ["Total", "Subtotal plus contingency", "$4,440"],
      ],
    },
    {
      type: "p",
      text: "This equals $222 per packet under those assumptions. It excludes software engineering, legal/privacy review, independent security review, MIRRA mathematical assurance, recruitment, and long-term operations. If qualified review takes longer, revise scope or budget; do not quietly reduce the review requirement. No payment, subscription, paid model run, reviewer recruitment, or deployment expenditure is authorized merely by this blueprint.",
    },
  ]),

  s("roadmap", "24", "Implementation roadmap", [
    {
      type: "p",
      text: "These phases describe dependencies and acceptance criteria. Effort is a planning estimate for a capable team, not a deadline commitment. Independent scientific, security, regulatory, and MIRRA proof review may dominate elapsed time.",
    },
    {
      type: "table",
      headers: ["Phase", "Deliverable", "Exit criterion", "Rough effort"],
      rows: [
        [
          "0 — decision",
          "Approved scope, collection question, charter draft, spending cap",
          "Founder and methods owner agree on the bounded use case",
          "Several focused working sessions",
        ],
        [
          "1 — contracts",
          "Schemas, policies, fixtures, canonicalization vectors",
          "Critical ambiguity is resolved before UI polish",
          "1–2 engineer-weeks",
        ],
        [
          "2 — synthetic product",
          "Packet views, review workflow, verifier, export, correction demo",
          "All synthetic functional and boundary tests pass",
          "2–3 engineer-weeks",
        ],
        [
          "3 — public pilot",
          "20 curated packets, qualified review, feedback study",
          "No unreviewed publication; users understand limitations",
          "2–4 engineer-weeks plus review labor",
        ],
        [
          "4 — ICP registry",
          "Stable state, certification, idempotency, governance, recovery",
          "Independent verification and upgrade gates pass",
          "2–4 engineer-weeks plus security review",
        ],
        [
          "5 — MIRRA shadow",
          "Frozen epoch, adapter, prospective event logging, evaluation",
          "Upstream release gates and adapter tests pass before relied-on use",
          "2–4 engineer-weeks plus external assurance",
        ],
      ],
    },
    {
      type: "p",
      text: "The effort ranges are additive planning units, not a promise that one person finishes the entire system in two weeks. Phases 4 and 5 require explicit continuation decisions. Phases 1–3 should produce a useful product even if those later phases are deferred. This explorer is Phase 2.",
    },
    { type: "h3", text: "Dependency constraints" },
    {
      type: "ul",
      items: [
        "Policy semantics and schemas precede production receipt issuance.",
        "Enrollment and conflict rules precede claims of independent review.",
        "Export and local verification precede claims of portability.",
        "Privacy review precedes publication, not just UI launch.",
        "Source licensing precedes mirroring.",
        "Trusted roots and current-status checks precede “authenticated and current” labels.",
        "MIRRA release assurance precedes relied-on MIRRA deployment.",
        "A prospective evaluation precedes claims of predictive improvement.",
      ],
    },
  ]),

  s("gates", "25", "Acceptance tests and release gates", [
    { type: "h3", text: "Minimum synthetic fixture suite" },
    {
      type: "table",
      headers: ["Fixture", "Expected outcome"],
      rows: [
        ["All required review evidence present", "Process COMPLETE; mandatory non-assertions present"],
        ["Missing source reference", "Process INCOMPLETE"],
        ["Missing second review", "Process INCOMPLETE"],
        [
          "Unresolved interpretation documented correctly",
          "Process may be COMPLETE; disagreement visibly retained",
        ],
        ["Hidden critical-field disagreement", "Process not complete"],
        ["Prohibited reviewer conflict", "Process BLOCKED"],
        ["Personal-data field or unsafe attachment detected", "Publication blocked; no unsafe public receipt"],
        ["Changed receipt payload", "Integrity fails"],
        [
          "Signature valid under an unknown or demo key",
          "Signature math may pass; production issuer trust fails",
        ],
        ["Mandatory non-assertions removed", "Policy consistency fails, even if payload is re-signed"],
        [
          "Earlier receipt supplied after correction",
          "Historical artifact can pass; current-status check reports superseded",
        ],
        ["Duplicate identical issuance", "Original receipt returned; no second obligation completion"],
        ["Registry unavailable", "Local integrity may pass; current status remains unknown"],
      ],
    },
    { type: "h3", text: "Product release checklist" },
    {
      type: "ul",
      items: [
        "Collection scope, search cutoff, inclusion log, and limitations are visible.",
        "Every critical published field has a reviewed source locator or explicit unknown.",
        "Study IDs and publication IDs cannot be silently conflated.",
        "Draft, process-complete, disputed, superseded, and currency-unknown states are distinguishable.",
        "The viewer can find the mandatory non-assertions without opening a hidden appendix.",
        "Exports identify unavailable evidence and retain required history.",
        "Mobile, keyboard, and non-color status paths work.",
        "Synthetic fixtures cannot be mistaken for real trial records.",
        "Intended users can explain what a receipt does and does not establish.",
      ],
    },
  ]),

  s("metrics", "26", "Success metrics and stopping rules", [
    {
      type: "table",
      caption: "Measure the product separately from the protocol",
      headers: ["Dimension", "Pilot measure", "Interpretation"],
      rows: [
        [
          "Usefulness",
          "Time to reconstruct a claim with versus without a packet",
          "Tests workflow value, not clinical benefit",
        ],
        [
          "Traceability",
          "Fraction of critical fields with validated locators or explicit unknowns",
          "Missing provenance is visible",
        ],
        [
          "Accuracy",
          "Critical extraction errors found in independent review",
          "Report denominator and error severity",
        ],
        [
          "Comprehension",
          "Readers distinguish process completion from effectiveness and understand “currency unknown”",
          "Prevents misleading badges",
        ],
        [
          "Correction quality",
          "Time to disposition, explanation completeness, preserved history",
          "A visible correction is a product function",
        ],
        [
          "Sustainability",
          "Actual reviewer-hours and operating cost per packet",
          "Determines whether expansion is affordable",
        ],
        [
          "Portability",
          "Successful verification by a separate implementation from an export",
          "Tests independence from the website",
        ],
        [
          "MIRRA research",
          "Prospective loss and calibration against prespecified baselines, with uncertainty",
          "Does not establish medical decision safety",
        ],
      ],
    },
    { type: "h3", text: "Pause or stop when" },
    {
      type: "ul",
      items: [
        "Readers repeatedly interpret process receipts as treatment approval.",
        "Qualified independent review cannot be sustained.",
        "Publication requires inaccessible evidence or unresolved rights.",
        "Private medical information begins appearing in submissions.",
        "The product saves no meaningful work for its intended users.",
        "Costs exceed the approved cap without demonstrated value.",
        "MIRRA integration consumes effort without a credible evaluation path or advantage over a simpler baseline.",
        "Governance cannot respond fairly to errors or conflicts.",
      ],
    },
    {
      type: "note",
      text: "Stopping MIRRA integration does not require shutting down a useful evidence commons. Stopping public issuance does not require deleting useful, clearly labeled draft research.",
    },
  ]),

  s("handoff", "27", "Developer handoff", [
    {
      type: "p",
      text: "Create a separate Commons repository when implementation is authorized. Keep MIRRA Core and the existing Fulfilled explorer intact. Use pinned dependencies or adapters for approved upstream components and preserve licenses. Do not scaffold unused infrastructure merely to fill every directory.",
    },
    {
      type: "table",
      caption: "Ordered implementation backlog",
      headers: ["ID", "Task", "Definition of done"],
      rows: [
        ["MEC-001", "Freeze the collection and review scope", "Ambiguous terms and required expertise resolved"],
        ["MEC-002", "Write executable schemas", "Invalid/unknown fields fail closed with useful errors"],
        ["MEC-003", "Create synthetic fixtures", "At least ten fixtures cover the critical branches"],
        ["MEC-004", "Implement policy evaluation", "Deterministic rule outcomes match fixtures"],
        ["MEC-005", "Implement independent verifier", "Tampering, unknown trust, and incomplete lineage are detected"],
        ["MEC-006", "Build packet and claim views", "Each critical field opens the correct source location"],
        ["MEC-007", "Build review comparison and approvals", "Exact input changes invalidate earlier approvals"],
        ["MEC-008", "Build challenge/correction history", "Superseded artifacts remain inspectable"],
        ["MEC-009", "Implement export/import", "Round-trip preserves digests and scope; no implicit upload"],
        ["MEC-010", "Add one public-source adapter", "Capture, rights, failure, and versioning behavior tested"],
        ["MEC-011", "Run the public-data pilot", "Qualified review and user feedback recorded"],
        ["MEC-012", "Finalize PoF extension or distinct protocol", "Namespace and compatibility claims are unambiguous"],
        ["MEC-013", "Add protected issuance", "Production key trust and outbox recovery tested"],
        ["MEC-014", "Add ICP registry", "Certification, idempotency, upgrade, and restore pass"],
        ["MEC-015", "Complete security and governance review", "Release decision names unresolved risks and owners"],
        ["MEC-016", "Implement MIRRA shadow adapter", "All upstream/adapter gates pass; no clinical authority"],
        ["MEC-017", "Run prospective evaluation", "Original predictions and all eligible-event dispositions retained"],
      ],
    },
    {
      type: "p",
      text: "MEC-011 may use clearly labeled unsigned or prototype receipts. It must not imply authenticated production issuance before MEC-012 through MEC-015 are completed as applicable. This explorer covers MEC-003 through MEC-009 in synthetic form.",
    },
  ]),

  s("decisions", "28", "Founder decisions", [
    {
      type: "p",
      text: "These are proposed defaults, not decisions already made on the founder’s behalf.",
    },
    {
      type: "table",
      headers: ["Decision", "Proposed default", "Review note"],
      rows: [
        [
          "Product name",
          "Medical Evidence Commons; explain “commons” on the home page",
          "Medical Evidence Hub is the plainer alternative; naming rights not checked",
        ],
        ["First application", "TrialWatch", "One curated public-trial collection"],
        [
          "First customer",
          "Journal-club or evidence-review team",
          "Validate willingness to use it before sales expansion",
        ],
        ["Data boundary", "Public aggregate research only", "No patient data or identifiable case reports"],
        [
          "Review standard",
          "Two-person critical-field review and declared methods",
          "Identify qualified reviewers before launch",
        ],
        ["First policy", "MED-EVIDENCE-REVIEW", "Disclosure compliance remains later work"],
        [
          "PoF integration",
          "Versioned research extension; separate draft namespace until approved",
          "Never mutate existing consult receipts",
        ],
        ["MIRRA", "Off initially; shadow-only after gates", "No general physician or institution ranking"],
        [
          "ICP",
          "Small registry after workflow validation",
          "No need to place every document or computation on-chain",
        ],
        [
          "Funding",
          "Curation/services/grants with outcome-independent review",
          "Public verification remains free",
        ],
        ["Spending", "Explicit phase-by-phase cap", "No costs approved by this document"],
        [
          "Jurisdiction",
          "Must be selected before operational/legal commitments",
          "U.S. sources here are not global clearance",
        ],
      ],
    },
  ]),

  s("glossary", "29", "Glossary", [
    {
      type: "table",
      headers: ["Term", "Plain-language meaning"],
      rows: [
        ["Commons", "A shared resource maintained under agreed rules"],
        ["Evidence packet", "A bounded claim, its sources, review record, limitations, and history"],
        ["Provenance", "Where a record came from and how its current form was produced"],
        ["Policy", "Published rules for one bounded evaluation"],
        ["Assertion", "A specific statement evaluated under that policy"],
        ["Non-assertion", "Something the receipt explicitly does not establish"],
        ["Receipt", "A portable record of a defined evaluation and its boundaries"],
        ["Digest", "A cryptographic fingerprint of specified bytes"],
        [
          "Signature",
          "Cryptographic evidence of use of a key; meaningful identity trust needs a separate basis",
        ],
        ["Trust anchor", "A key or authority independently configured as trusted"],
        ["Certified state", "State whose canister certificate and witness can be checked by a client"],
        ["Idempotency", "A retry has the effect of one accepted operation, not an additional one"],
        ["Supersede", "Publish a new current record while retaining the old one"],
        ["Epoch", "A frozen task, roster, and protocol period for MIRRA evaluation"],
        ["Loss", "A numerical measure of prediction error; smaller is better"],
        [
          "Calibration",
          "Whether stated probabilities align with observed event frequencies over suitable data",
        ],
        ["Shadow mode", "Evaluation without authority over operational or clinical decisions"],
        ["PHI / ePHI", "Protected health information / its electronic form, where applicable law defines it"],
      ],
    },
  ]),

  s("provenance", "30", "Sources and provenance", [
    {
      type: "p",
      text: "Project claims are grounded in the pinned snapshots below. Architecture, policy design, timelines, budgets, and business choices are recommendations developed for this blueprint, not claims that the source projects already implement them.",
    },
    {
      type: "p",
      text: "Medical and regulatory references establish relevant boundaries; they do not certify the proposed product. No security suite, MIRRA release runner, external human study, or clinical evaluation was executed while preparing this paper.",
    },
    { type: "h3", text: "Project source snapshots" },
    {
      type: "ul",
      items: [
        "**MIRRA:** commit `4ad47db0671cad3a151b4b77d6f2248f5ed84bdc`, inspected 13 September 2026. [Repository snapshot](https://github.com/Mitosis50/MIRRA/tree/4ad47db0671cad3a151b4b77d6f2248f5ed84bdc)",
        "**Proof of Fulfillment:** commit `93b236239d7ae28ce9edaefd15b624baac612008`, inspected 13 September 2026. [Repository snapshot](https://github.com/Mitosis50/proof-of-fulfillment/tree/93b236239d7ae28ce9edaefd15b624baac612008)",
        "The source whitepaper was supplied by the user. The pinned implementation files govern implementation observations where general prose is incomplete or inconsistent. [Proof of Fulfillment whitepaper](https://proof-of-fulfillment-seven.vercel.app/whitepaper)",
      ],
    },
    { type: "h3", text: "Reference index" },
    {
      type: "table",
      headers: ["Ref", "Source", "Use in this paper"],
      rows: [
        ["S0", "[Proof of Fulfillment whitepaper](https://proof-of-fulfillment-seven.vercel.app/whitepaper)", "Original conceptual context"],
        [
          "S1",
          "[MIRRA README](https://github.com/Mitosis50/MIRRA/blob/4ad47db0671cad3a151b4b77d6f2248f5ed84bdc/README.md)",
          "Candidate status and release boundaries",
        ],
        [
          "S2",
          "[MIRRA frozen protocol](https://github.com/Mitosis50/MIRRA/blob/4ad47db0671cad3a151b4b77d6f2248f5ed84bdc/docs/PROTOCOL.md)",
          "Arithmetic, roster, event identity, and replay constraints",
        ],
        [
          "S9",
          "[ClinicalTrials.gov API](https://clinicaltrials.gov/data-api/api)",
          "Source-adapter starting point",
        ],
        [
          "S10",
          "[PMC Open Access Subset](https://pmc.ncbi.nlm.nih.gov/tools/openftlist/)",
          "Reuse rights and approved retrieval methods",
        ],
        [
          "S11",
          "[Cochrane risk-of-bias chapter](https://www.cochrane.org/authors/handbooks-and-manuals/handbook/current/chapter-08)",
          "Result-specific methods and justified judgments",
        ],
        [
          "S13",
          "[RFC 8785](https://www.rfc-editor.org/rfc/rfc8785)",
          "Canonical-JSON design reference",
        ],
        [
          "S14",
          "[ICP certified variables](https://docs.internetcomputer.org/guides/backends/certified-variables/)",
          "Certified-state verification",
        ],
        [
          "S16",
          "[HHS de-identification](https://www.hhs.gov/hipaa/for-professionals/special-topics/de-identification/index.html)",
          "Limits of simply removing names or hashing",
        ],
        [
          "S18",
          "[FDA CDS guidance](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/clinical-decision-support-software)",
          "Intended-use and medical-software boundary",
        ],
      ],
    },
    { type: "h3", text: "Known open items" },
    {
      type: "ul",
      items: [
        "Collection topic, jurisdiction, reviewer availability, approved budget, and name clearance.",
        "Final research schema, extension governance, signing profile, and exact status mapping.",
        "Full operational definitions for source provenance and conflict checks.",
        "Exact dependency/toolchain versions, deployed principals, key custody, and controller mechanism.",
        "Independent security findings, actual source-adapter behavior, and measured costs.",
        "MIRRA release approval and any prospective evidence of usefulness for the selected task.",
      ],
    },
    {
      type: "quote",
      text: "Build the evidence library and accountable review process first. Use a properly versioned Proof of Fulfillment extension for bounded review receipts. Add ICP for verifiable shared state when the workflow justifies it. Add MIRRA only for narrowly defined, independently evaluated forecasting tasks. Preserve uncertainty, preserve corrections, and keep the patient off the public record.",
    },
  ]),
];

export const PAPER_TOC = PAPER_SECTIONS.map(({ id, num, title }) => ({ id, num, title }));
