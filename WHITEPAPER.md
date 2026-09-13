# Medical Evidence Commons

## Full Product, Architecture, and Implementation Blueprint

Version: 0.1 — founder review draft  
Prepared: September 13, 2026  
Working product name: **Medical Evidence Commons**  
Plain-language alternative: **Medical Evidence Hub**  
First proposed application: **TrialWatch**  
Technical foundation: a separate Commons application, a versioned Proof of Fulfillment research extension, and an optional MIRRA adapter on ICP.

> A shared medical evidence library with accountable review and a visible correction history.

**Document status:** This is a complete proposed product and build specification. It is not a deployed application, implemented integration, completed security audit, clinical validation, legal opinion, or declaration that MIRRA is release-ready. Code shapes and policy names below are design proposals unless explicitly identified as existing. No repositories, policies, canisters, or payment systems were changed to prepare this document.

**How to review locally:** Download this `.md` file and save it to your Desktop. It is ordinary UTF-8 Markdown: a plain-text editor can read it, and a Markdown preview can render its headings and tables. The file has no required scripts, embedded remote assets, or special viewer dependencies. Internet access is needed only to follow the source links.

---

## Contents

1. [The decision in one page](#1-the-decision-in-one-page)
2. [What commons means](#2-what-commons-means)
3. [The problem and product promise](#3-the-problem-and-product-promise)
4. [What exists versus what is proposed](#4-what-exists-versus-what-is-proposed)
5. [Users and first market](#5-users-and-first-market)
6. [Scope and release boundaries](#6-scope-and-release-boundaries)
7. [The user experience](#7-the-user-experience)
8. [The evidence model](#8-the-evidence-model)
9. [Sources and ingestion](#9-sources-and-ingestion)
10. [Review and scientific disagreement](#10-review-and-scientific-disagreement)
11. [The first review policy](#11-the-first-review-policy)
12. [The later disclosure policy](#12-the-later-disclosure-policy)
13. [Proof of Fulfillment integration](#13-proof-of-fulfillment-integration)
14. [Receipts and independent verification](#14-receipts-and-independent-verification)
15. [MIRRA integration](#15-mirra-integration)
16. [A complete synthetic example](#16-a-complete-synthetic-example)
17. [ICP architecture](#17-icp-architecture)
18. [Data contracts and application interfaces](#18-data-contracts-and-application-interfaces)
19. [Security and threat model](#19-security-and-threat-model)
20. [Privacy and medical boundaries](#20-privacy-and-medical-boundaries)
21. [Governance and accountability](#21-governance-and-accountability)
22. [Operations and recovery](#22-operations-and-recovery)
23. [Sustainability and cost control](#23-sustainability-and-cost-control)
24. [Implementation roadmap](#24-implementation-roadmap)
25. [Acceptance tests and release gates](#25-acceptance-tests-and-release-gates)
26. [Success metrics and stopping rules](#26-success-metrics-and-stopping-rules)
27. [Developer handoff](#27-developer-handoff)
28. [Founder decisions](#28-founder-decisions)
29. [Glossary](#29-glossary)
30. [Sources and provenance](#30-sources-and-provenance)

---

## 1. The decision in one page

Build a shared, correctable record of **medical claims and the evidence behind them**, beginning with a tightly bounded collection of public clinical-trial documents.

The first useful product is an evidence packet that answers:

- What exactly was claimed, for which population, outcome, and time period?
- Which source version supports that statement?
- What did the trial plan say before results became available?
- What uncertainties, limitations, and disagreements remain?
- Which review steps were completed, by whom, under which published rules?
- Has anything been challenged, corrected, superseded, or retracted?

Do not begin with a universal medical truth engine. Do not begin by putting patient records on a blockchain. Begin with a useful public evidence workflow whose output another person can inspect and reproduce.

### The four responsibilities

| Component | Its job | What it must not claim |
|---|---|---|
| Medical Evidence Commons | Organize sources, claims, reviews, and corrections | That inclusion makes a claim true |
| Proof of Fulfillment research extension | Record whether a narrowly defined evidence-review obligation met a frozen policy | That completing a process establishes treatment effectiveness |
| MIRRA | Update domain-scoped model weights from externally resolved and scored events | That mathematical consistency establishes medical truth |
| ICP | Host application state and support verifiable responses about that state | That a stored statement is clinically correct or impossible for governance to change |

### Recommended sequence

1. Review this specification and approve the boundaries.
2. Create a synthetic, local-first prototype with no accounts or real-person data.
3. Pilot 20 public trial evidence packets with qualified human review.
4. Add production-grade receipt verification and a small ICP registry after their gates pass.
5. Evaluate MIRRA separately in shadow mode, with no clinical authority or influence on review verdicts.
6. Expand only if people actually use the packets, understand their limits, and find the correction history valuable.

The Commons should remain useful if MIRRA is unavailable or never demonstrates an advantage. That is a deliberate separation of responsibilities, not a temporary workaround.

### What this document delivers

Product definition, screen requirements, source rules, review policies, data contracts, verification boundaries, MIRRA scoring design, ICP deployment architecture, security controls, governance, business model, implementation backlog, and release criteria.

## 2. What commons means

A **commons** is a resource shared by a community and maintained under agreed rules. A library is a useful analogy: shared access does not mean anyone can silently rewrite a book or remove its attribution.

For this product, commons means:

- Public access to the evidence summaries, methods, and correction history.
- Clear rules for contributions and review.
- A fair, documented way to challenge conclusions.
- Credit and responsibility for contributions.
- Portable records so the knowledge does not depend on one website surviving.
- Stewardship of the shared resource, with accountable governance.

It does **not** mean all opinions carry equal evidentiary weight, all source material is free of copyright, everything must be public, or a majority vote determines a medical fact.

The Commons is not legally community-owned merely because of its name. Ownership, licensing, governance rights, and funding must be established explicitly. Until then, describe it as a project **designed for shared stewardship**.

## 3. The problem and product promise

### The product hypothesis

A reader may encounter a strong medical claim without an easy way to reconstruct the precise source, endpoint, analysis population, limitations, subsequent corrections, and disagreements behind it. TrialWatch tests whether putting those elements into one inspectable packet saves meaningful review effort.

This is a hypothesis to validate with users, not a claim that existing databases, journals, systematic reviews, or evidence tools lack value.

### Product promise

**Make the path from a medical claim to its supporting evidence inspectable, and make changes to that path visible.**

The useful output is not a green truth badge. It is an evidence packet with sources, version history, review notes, scope limits, and an independently checkable record of the review process.

### Relationship to the supplied interview

The linked interview raises questions about evidence standards, institutions, incentives, and public interpretation. Those questions motivate transparent methods; they do not establish the truth of the interview's individual medical assertions. The Commons must apply the same rules to claims from interviewees, journals, regulators, sponsors, critics, and its own founder. It is not built to vindicate a predetermined viewpoint. [Supplied interview][S12]

### Intended differentiation to test

- Claim-level provenance, not just a list of papers.
- Explicit separation of reporting, interpretation, process completion, and forecasting performance.
- Challenges and corrections preserved alongside the original record.
- Downloadable packets with independently checkable commitments.
- Optional, auditable evaluation of forecasting methods.

These are proposed product characteristics, not a verified claim of market uniqueness or patentability.

## 4. What exists versus what is proposed

Project observations below refer to the pinned source snapshots in Section 30. They are source-review observations, not tests rerun for this document. Later upstream changes require a fresh check.

| Item | Observed status | Consequence for this build |
|---|---|---|
| MIRRA kernel and ICP canister | Release candidate with documented deterministic arithmetic and correction semantics | Integrate through a narrow adapter; do not rewrite the core |
| MIRRA release assurance | README identifies unresolved release requirements, including replacement P1 review and provenance | Do not advertise a production-certified MIRRA deployment |
| Fulfilled / Proof of Fulfillment | Synthetic bounded-obligation explorer with policies, receipts, and a separate verification path | Reuse patterns and tested components within their actual scope |
| Fulfilled signing key | Intentionally published demonstration private key | It cannot uniquely authenticate a production issuer |
| Fulfilled medical policy | `CARE-CONSULT@1.0.0`, concerning a bounded consult process | Preserve it; it is not a trial-evidence policy |
| Medical Evidence Commons | Proposed here | Requires its own implementation and governance |
| Research receipt extension | Proposed here | Requires a versioned schema and compatibility tests |
| Patient-data handling | Excluded | No patient-data pipeline is authorized by this plan |

Sources: [MIRRA release status][S1], [MIRRA protocol][S2], [Fulfilled overview][S3], [Fulfilled receipt types][S4], [Fulfilled signing implementation][S5].

The public demo key deserves a precise distinction: a signature made with it can be mathematically valid, but anyone with that published private key can produce one. It does not establish that a particular operator issued the receipt. Production needs independently trusted keys, issuance controls, rotation, and revocation.

Nothing in this plan authorizes changing the frozen existing policies, weakening golden tests, merging upstream pull requests, deploying mainnet canisters, or converting the synthetic explorer into a patient-data system.

## 5. Users and first market

### First users

| User | Job to accomplish | What the MVP provides |
|---|---|---|
| Journal-club organizer | Prepare a defensible discussion of a trial | A concise, source-linked evidence packet |
| Clinician-researcher | Examine a specific reported outcome | Endpoint, population, analysis, limitations, and source versions |
| Evidence-review group | Maintain a review that can be updated | Versioned contributions and correction history |
| Research journalist | Trace a statement and identify uncertainty | Attributed claims and visible disagreements |
| Methods reviewer | Check another reviewer's extraction or interpretation | Reproducible locators, comments, and explicit decisions |

The initial buyer hypothesis is an evidence-review team that values reduced reconstruction effort. The initial reader can be anyone. Access to public packets and independent verification should not require payment, a wallet, or token ownership.

### Not the initial audience

People seeking personalized diagnosis, an emergency answer, a drug recommendation, insurance approval, or a judgment about the quality of a named clinician's care.

### First collection

Select one narrow clinical question with a methods-qualified reviewer and an accessible body of randomized trial reports. Choose the question before selecting trials. Publish inclusion and exclusion criteria and include unfavorable, null, and conflicting results that meet those criteria.

Do not choose a politically charged topic solely for attention. Do not cherry-pick a collection to demonstrate that a favored institution or critic was right.

## 6. Scope and release boundaries

### Release A — synthetic review prototype

- Ten deliberately fictional fixtures covering success and failure paths.
- Read-only public-style views and a local review workflow.
- Native draft receipt schema; visibly non-production.
- Export and offline structural verification.
- No identity enrollment, public submission endpoint, MIRRA dependency, or live payments.

### Release B — curated public-data pilot

- Twenty trial packets selected using a published collection protocol.
- Public registry entries, lawful source links, and permitted source snapshots.
- Two-person review of critical extracted fields.
- Public correction history and downloadable packets.
- Approved research receipt schema and policy, with production issuer trust if labeled authenticated.
- Small authorized reviewer cohort; no open-ended document uploads.

### Release C — ICP-backed public registry

- Certified packet and receipt indexes.
- Stable persistence and verified upgrade behavior.
- Trusted-root verification, recovery procedures, and accountable controller management.
- Public export sufficient to reduce dependence on the hosted interface.

### Release D — MIRRA research pilot

- A frozen event protocol and model roster.
- Prospective predictions locked before outcomes are publicly available.
- External resolution, deterministic scoring, and auditable weight updates.
- Shadow-only comparison against simple baselines.
- No patient-specific output, automated review verdict, or treatment recommendation.

### Explicit non-goals for every initial release

Patient records; identifiable case reports; EHR integration; diagnostic images; treatment selection; autonomous clinical decisions; insurance determinations; doctor rankings; patient rankings; token governance; prediction-market wagering; escrow; wallets; payment release; and automatic claim adjudication by an LLM.

Later clinical or patient-data functionality would be a separately scoped project, not a routine feature flag.

## 7. The user experience

### Navigation and screens

| Screen | Essential content | Essential action |
|---|---|---|
| Home | Plain-language purpose, boundaries, newest corrections | Open the collection |
| Collection | Question, eligibility rules, search coverage, inclusion log | Filter or open a packet |
| Trial packet | Study identity, source versions, outcomes, review status | Inspect an outcome claim |
| Claim detail | Exact claim, supporting and conflicting sources, limitations | Open source locator or challenge |
| Review workspace | Independent extraction, comparison, conflicts, sign-off | Submit an accountable review |
| Receipt detail | Policy, assertions, non-assertions, issuer and integrity status | Verify or download |
| Correction history | What changed, why, who reviewed it, linked versions | Compare two versions |
| Methods and governance | Policy versions, roles, funding, appeals, release status | Inspect the rules |

The synthetic prototype may combine screens. The MVP should not grow into eight separate services merely because it has eight views.

### What a trial packet shows first

1. The clinical research question and the trial's identity.
2. A neutral description of the reported result, with endpoint and timeframe.
3. A source link and precise location for each critical field.
4. Material limitations and unresolved disagreements.
5. The review-policy status, explicitly labeled as a process result.
6. The last source check and whether the packet has been corrected.

Do not lead with a single number purporting to summarize medical truth.

### Separate status displays

| Display | Example | Meaning |
|---|---|---|
| Review process | Complete under policy X | Specified review steps were evidenced |
| Scientific assessment | Reviewer disagreement remains | Interpretation has not been collapsed into a single verdict |
| Artifact integrity | Digest matches; trusted signature verified | The supplied bytes and authentication checks passed |
| Currency | Current check unavailable | No assurance that no later correction exists |
| MIRRA | Shadow evaluation only | Research output, not clinical authority |

Never collapse these into one unlabeled `VERIFIED` badge.

### Interaction requirements

- Reading public material needs no account.
- Reviewer authorization is separate from public reading.
- A draft cannot be mistaken for a published packet.
- Every correction view keeps a link to its predecessor.
- Missing data appears as missing, not as zero or no adverse events.
- Dates distinguish source publication, source capture, review, and registry acceptance.
- Keyboard navigation, readable contrast, responsive tables, and meaningful non-color status labels are required.
- Source documents and comments are treated as untrusted content, not executable instructions.

## 8. The evidence model

The system must distinguish five different statements:

| Layer | Example | Who is responsible |
|---|---|---|
| Source observation | A table reports 10 events among 100 participants | Extractor and checking reviewer |
| Bounded claim | This specified outcome was reported at this timeframe in this analysis population | Claim author and reviewers |
| Scientific interpretation | The estimate may be limited by missing outcome data | Named methods reviewers with rationale |
| Process receipt | Both required reviews and source checks were completed | Authorized issuer under a frozen policy |
| Forecast assessment | Model A assigned a probability before the event was resolved | Forecaster, independent resolver, and scorer |

A source observation can accurately describe an inaccurate paper. A completed review can preserve genuine scientific disagreement. A good forecaster can be wrong on the next event. Each layer must remain inspectable on its own.

### Core entities

| Entity | Required information | Important constraint |
|---|---|---|
| Collection | Question, protocol version, inclusion rules, search cutoff | Selection history is visible |
| Study | Registry identifiers, design, public sponsor metadata | A study is not a publication |
| SourceVersion | URL, capture time, document date if known, digest, rights, locator scheme | An updated source creates a new version |
| OutcomeClaim | Population, intervention, comparator, outcome, timeframe, analysis population, attributed statement | One claim has one explicit scope |
| EvidenceLink | Source version, locator, relationship, extraction method | Supports, contradicts, or contextualizes are distinct |
| Assessment | Method version, reviewer, reasoning, uncertainty, conflicts | A judgment is not relabeled as an objective source fact |
| ReviewRun | Input manifest, policy digest, rule results, approvals, software provenance | Frozen at issuance |
| Receipt | Bound run, policy, manifest, issuer, non-assertions, predecessor | New conclusions require new receipts |
| Challenge | Target version, reason, supporting evidence, disposition | A complaint does not by itself prove error |
| ForecastEpoch | Task, roster, scoring and resolution protocols | Separate from scientific review |

### Claim fields that cannot be silently collapsed

- Primary, secondary, exploratory, and post-hoc outcomes.
- Patient-important and surrogate outcomes, with reviewer rationale.
- Prespecified and subsequently amended analyses.
- Intention-to-treat, modified intention-to-treat, per-protocol, and other populations as reported.
- Absolute and relative measures, their denominators, and time horizons.
- Statistical uncertainty and clinical importance.
- Absence of a reported finding and evidence that a finding is absent.
- Study-level evidence and a synthesis across studies.

The application may help organize these distinctions. It must not invent a validated universal evidence score from them.

## 9. Sources and ingestion

### Permitted first-release sources

| Source | Use | Boundary |
|---|---|---|
| ClinicalTrials.gov | Study identifiers and registry information | Registry assertions are not independently verified trial conduct |
| Official regulatory publications | Link the relevant assessment or decision document | Do not turn regulatory status into the Commons' clinical verdict |
| Lawfully accessible trial reports | Extract source-linked findings and limitations | Public access does not automatically grant redistribution rights |
| Permitted protocols and analysis plans | Compare planned and reported outcomes | Record the version and whether timing is independently established |
| Public correction or retraction notices | Link changed publication status | Keep the affected source version and review history |

Use documented source APIs where appropriate. The ClinicalTrials.gov API documentation is the implementation starting point; verify its current schema, usage constraints, and history availability before building an adapter. Do not assume today's registry response contains the exact historical record needed for a preregistration claim. [ClinicalTrials.gov API][S9]

For PMC, use its authorized retrieval services and check each article's license. Not every PMC article permits the same reuse, and bulk retrieval has specific restrictions. The default fallback is citation and lawful linking, not mirroring. [PMC Open Access Subset][S10]

### Ingestion procedure

1. Apply the collection's eligibility criteria; log included and excluded studies with reasons.
2. Resolve study identifiers separately from publications. Detect multiple papers from the same trial.
3. Fetch through an allowlisted adapter with bounded size, time, and retry limits.
4. Record original URL, final URL, capture timestamp, source-stated date, content type, and rights metadata.
5. Hash the exact captured bytes where retention is permitted. Hash normalized extracted data separately.
6. Preserve the parser/OCR version, extraction version, and source locator convention.
7. Extract candidate facts. AI output remains an unapproved draft.
8. Have reviewers validate critical fields against the source.
9. Freeze a manifest identifying the exact source and claim versions used by the review.
10. Publish only the approved public-safe projection and permitted supporting material.

### Provenance levels

Use descriptive labels such as `LINK_ONLY`, `CAPTURED_COPY`, `REVIEWED_EXTRACTION`, and `PUBLISHER_SIGNED` when actually supported. These are provenance categories, not medical evidence grades. Do not infer publisher authentication merely because your own service hashed or signed a downloaded file.

### Failure behavior

- Unavailable source: preserve the link and mark the unavailable check; never fabricate its contents.
- Ambiguous matching: hold for a reviewer rather than merging trials automatically.
- Unavailable historical version: state that preregistration timing could not be established.
- Parser disagreement: present the conflicting fields for review.
- Retraction or correction: create a source-status event and queue affected packets for review; do not silently delete or overwrite the old record.
- Rights uncertainty: retain only permitted metadata and links until resolved.

## 10. Review and scientific disagreement

### Two-person review

For the pilot, one qualified person prepares the extraction and a second checks the critical fields. Where feasible, both extract critical fields independently before comparison. The reviewer pool must include clinical-domain expertise and research-methods expertise; a professional title alone is not proof of suitability for every task.

Critical fields include the trial identity, outcome definition, timeframe, analysis population, numerator/denominator, reported effect measure, uncertainty interval, primary/secondary designation, and material amendments.

Track reviewer identity and conflicts in an access-controlled enrollment process. Public review records use an approved professional attribution or a role-key identifier. No patient identity belongs in either workflow.

### Structured assessment

For suitable randomized-trial results, reviewers may use the appropriate version of an established risk-of-bias method. Cochrane's RoB 2 is result-specific and requires justified judgments. Do not call a locally shortened checklist “RoB 2” or imply Cochrane endorsement; implementing the actual method requires its full applicable guidance and training. [Cochrane Handbook, Chapter 8][S11]

The MVP can instead publish explicitly labeled **structured reviewer notes**, without claiming a formal validated assessment. The collection protocol must say which approach it uses before reviewing its studies.

### Disagreement procedure

1. Distinguish a transcription disagreement from a methodological interpretation.
2. Compare the exact source versions and locators.
3. Resolve clear extraction errors with an explanation.
4. Refer unresolved material methodological disputes to a third qualified reviewer where available.
5. Publish competing interpretations with their evidence when no responsible resolution exists.
6. Record the disposition and any unresolved limitation.

A completed process can conclude that evidence is conflicting or insufficient. Do not penalize a reviewer for documenting uncertainty. Do not use MIRRA weights or an audience vote to decide which interpretation is scientifically correct.

### AI assistance

AI may suggest extraction, locate candidate passages, compare versions, and draft summaries. Every published substantive claim must have a source locator and authorized human approval. A model's confidence statement is neither a credential nor a verification result.

Documents cannot instruct an agent to issue receipts, alter policies, retrieve secrets, browse arbitrary internal URLs, or ignore these boundaries. Retrieval content is data.

## 11. The first review policy

Proposed draft identifier: `MED-EVIDENCE-REVIEW@0.1.0-draft`.

**Bounded obligation:** Produce a traceable review packet for a specified trial outcome using a specified set of public source versions and the declared review method.

**Not the obligation:** Prove that the intervention works, that the trial was conducted honestly, or that the result applies to a particular person.

The draft policy is frozen as `1.0.0` only after its schema, semantics, fixtures, and independent verifier pass review. A change after issuance requires a new version.

### Required assertions

| Code | What must be evidenced | Missing or conflicting evidence |
|---|---|---|
| `SCOPE_FIXED` | Study, outcome, population, timeframe, method, and source cutoff are specified | Incomplete; conflicting scope blocks issuance |
| `SOURCE_MANIFEST_BOUND` | All relied-on source versions and lawful-access metadata are bound to the run | Incomplete, or blocked if the manifest cannot be reconciled |
| `CRITICAL_FIELDS_CHECKED` | Two authorized reviews account for every critical field, including explicit unknowns | Incomplete until the checking record exists |
| `METHOD_AND_LIMITATIONS_RECORDED` | Method version, assumptions, missing information, and material limitations are recorded | Incomplete |
| `DISAGREEMENTS_ACCOUNTED_FOR` | Material disagreements are resolved with reasons or visibly retained | Incomplete if a disagreement is hidden or unaddressed |
| `CONFLICT_REVIEW_COMPLETED` | Reviewer disclosures and the declared assignment rule were checked | Blocked for prohibited conflicts; incomplete for missing disclosure |
| `PUBLICATION_ALLOWLIST_PASSED` | Output uses approved fields and passed privacy/rights review | Blocked when unsafe material is detected |
| `AUTHORIZED_SIGNOFF_PRESENT` | Required role-key approvals bind the exact run inputs | Blocked for invalid authority; incomplete for missing approval |

“Fields checked” can include “not reported in the source.” It does not authorize inventing a value. “Conflict review completed” does not prove that all undisclosed relationships have been discovered.

### Deterministic native draft result

| Conditions, evaluated in this order | Result |
|---|---|
| Prohibited content, invalid authority, revoked approval, or unreconciled run-input conflict | `BLOCKED` |
| No blocking condition, but at least one required review assertion lacks evidence | `INCOMPLETE` |
| All required assertions satisfied | `COMPLETE` |

Malformed requests are rejected without issuing a receipt. A `BLOCKED` public receipt, if published, includes only safe reason codes, never the offending private content. The system may keep the blocked attempt entirely non-public when publication itself creates risk.

This policy has no “partly medically true” result and no partial-payment rule.

### Mandatory non-assertions

Every receipt must state that it does not establish:

- Clinical correctness.
- Treatment effectiveness or safety for an individual.
- Diagnosis or treatment selection.
- Medical necessity or insurance coverage.
- Completeness of all worldwide evidence.
- Absence of fraud, publication bias, or undisclosed conflicts.
- That a source's contents accurately describe real-world trial conduct.
- That the packet replaces a systematic review or professional judgment.

These restrictions apply equally to API responses, badges, print views, exports, and social previews. An empty or weakened mandatory non-assertion set is a verification failure.

## 12. The later disclosure policy

Proposed draft identifier: `MED-TRIAL-DISCLOSURE@0.1.0-draft`.

This is a separate, later policy. Its obligation is a defined **document-disclosure requirement**, not completion of the Commons' own review. It needs a precise governing protocol or obligation instrument; the application must not invent a legal duty from a missing registry field.

Candidate assertions:

| Assertion | What must be fixed before implementation |
|---|---|
| Registration timing documented | Acceptable historical source, relevant enrollment date, precision, timezone, and uncertainty treatment |
| Prespecified endpoints located | Accepted source versions and rules for amendments |
| Result disclosure located | What counts as a result disclosure and what deadline, if any, actually applies |
| Safety reporting located | Required sections and denominators; presence is not proof of complete harm ascertainment |
| Funding/conflict statement located | Accepted statement and source location; disclosure is not proof of independence |

An absent document produces **not located under this search protocol**, not “research misconduct.” Unknown legal applicability remains unknown. Do not publish overdue/legal-noncompliance labels until competent review establishes the applicable rule and its exceptions.

Keep this policy outside the first pilot unless its added value clearly justifies the methods and review burden. Earlier discussion used a possible `1.0.0` name; this document deliberately keeps the policy in draft until it is actually specified and tested.

## 13. Proof of Fulfillment integration

### What can be reused

The useful pattern is a bounded obligation, an immutable policy, an input-bound evaluation, an independently checkable receipt, mandatory non-assertions, and history-preserving corrections. Preserve evaluator/verifier separation and the existing golden cases. [Fulfilled project doctrine][S6]

### The compatibility gap

The inspected current types require monetary and destination-related fields for obligations and receipt subjects, and the policy domain is restricted to education, care, or housing. The evaluator contains settlement and reference-based independence logic. A research review is therefore **not a drop-in new policy** in the current schema. [Current types][S4], [Current evaluator][S7]

Do not fabricate a zero-dollar payment, fictional payee, or meaningless case reference merely to make a trial packet fit. Do not modify `CARE-CONSULT@1.0.0` to make its existing receipts mean something new.

### Chosen integration path

1. Specify the research obligation and public subject as non-monetary objects in this separate Commons project.
2. Use a clearly separate draft namespace, `mec.review_receipt/0.1.0-draft`, during the prototype.
3. Propose a versioned research extension to Proof of Fulfillment with explicit domain, types, validation, status mapping, issuer semantics, and test vectors.
4. Retain the old verifier for old receipts. Add version dispatch rather than silently changing old bytes or interpretation.
5. Adopt the approved extension only after its compatibility and security gates pass.

A native draft file is **not** a valid `.pof.json` file merely because it follows similar ideas. Until extension approval, the UI must say “Commons draft receipt,” not “PoF-compatible receipt.” If upstream does not adopt the extension, continue under the clearly separate Commons namespace and document its independent protocol status.

### Extension requirements

- Non-monetary `research_review` obligation with no mandatory financial or patient fields.
- Explicit research policy domain and independently defined assertion meanings.
- Operational provenance requirements; existing A–F labels must not be treated as a medical evidence hierarchy.
- Real reviewer enrollment and conflict checks, not just unequal reference strings.
- A shared, authorized registry for idempotent issuance; client booleans cannot prove absence of duplicates.
- A commitment binding complete approved assertions, source-manifest identity, reviewer approvals, and relevant authority snapshot.
- Verifiable software provenance tied to actual release artifacts, not only a hash of a build-label string.
- Research-specific challenge reasons without weakening existing medical non-assertions.
- No rewrite of the working PoF evaluator into Rust merely to put every step on ICP.

### Illustrative result mapping for extension review

| Commons draft result | Possible PoF result | Condition |
|---|---|---|
| `COMPLETE` | `VERIFIED` | Only if the new policy's required assertions all hold |
| `INCOMPLETE` | `INSUFFICIENT_EVIDENCE` | Missing required process evidence |
| `BLOCKED` | `FAILED` or `EXCEPTION` | Determined by the approved reason-code mapping |

This mapping is not finalized by this document. A developer must not silently use it as a production compatibility contract.

## 14. Receipts and independent verification

### Three distinct verification questions

1. **Integrity:** Do these bytes match their digest and supplied cryptographic proof?
2. **Authority and currency:** Was the issuer trusted for this policy, and is a later correction or key revocation known?
3. **Evidence review:** Can the supporting packet justify the asserted review steps?

Checking a receipt answers only the checks actually performed. It does not independently repeat a clinical trial. An offline verifier cannot guarantee that no later correction exists.

### Proposed receipt contents

- Protocol and schema version.
- Stable receipt identifier and content digest.
- Study/outcome scope without patient or monetary fields.
- Frozen policy identifier, version, and digest.
- Review-run digest and full input-manifest digest.
- Rule results with approved rationale or safe reason codes.
- Required non-assertions.
- Issuer key identifier and authority-registry snapshot reference.
- Explicit timestamp types, including any independently witnessed registry acceptance.
- Previous and superseded receipt references, if applicable.
- Detached seal and the exact declared signing profile.

### Canonical bytes

The new research profile must specify a canonical representation, permitted scalar types, Unicode treatment, array ordering, and rejection rules. Use a reviewed canonical-JSON implementation with cross-language test vectors; do not assume any “sorted JSON” function is automatically equivalent to RFC 8785. Numerical hashes must not depend on floating-point rendering. [JSON Canonicalization Scheme][S13]

Separate domains for policies, manifests, runs, receipts, and signatures. Hash the unsigned receipt payload; attach the signature afterward. Do not reuse an old PoF domain for a changed payload schema.

### Signing and trust

For a production research extension, use an approved non-demo signing key held outside browser bundles and outside LLM tools. The allowlisted trust registry binds a key to authorized policies and its validity history. A receipt-supplied public key is not its own trust anchor.

Treat an issuer-written timestamp as an issuer claim. Registry acceptance can witness that the receipt existed by that registry event; it cannot prove when the underlying trial action occurred. Distinguish normal key rotation from compromise, and define which historical signatures are affected. Backdated receipt fields cannot rescue a compromised-key signature without independently established timing.

### Independent verifier outputs

Return separate machine-readable fields for schema support, digest validity, signature validity, issuer trust, policy consistency, ancestor completeness, correction currency, and evidence availability. Examples include `PASS`, `FAIL`, `UNKNOWN`, and `NOT_CHECKED` at the check level.

The verifier must:

1. Reject unsupported schemas and malformed or duplicate object keys.
2. Enforce size, depth, and attachment limits before expensive work.
3. Recompute canonical digests and declared signatures.
4. Verify trust against configured roots, not roots supplied by the receipt.
5. Check the exact policy and mandatory non-assertions.
6. Check required run/manifest bindings and approved rule-result combinations.
7. Validate ancestor links and flag missing, cyclic, conflicting, or unrelated history.
8. When online, check fresh correction and key-status registries.
9. Explain which evidence checks were not performed.

The verifier is a separate implementation path. It must not import the evaluator or use “call issuance again” as its proof. A separately implemented path is not the same thing as an independent external audit.

### Portable packet

The proposed `.mec.json` export contains the receipt, required ancestors, policy body, public review record, input manifest, source references, and available proof material. Permitted source attachments can be distributed separately with their digests and rights metadata. An export without a source attachment must state that limitation.

The interface must not send dropped files to an external server merely to verify them locally. Remote currency checks should be explicit and use public identifiers only. Export remains useful if the original website closes, but availability of third-party documents cannot be guaranteed.

## 15. MIRRA integration

### 15.1 The question MIRRA can help investigate

For a precisely defined task, can an adaptive combination of forecasting systems perform better than simple baselines on future, externally resolved events?

This is different from asking which physician is trustworthy or which treatment is best. The proposed integration weights **versioned forecasting systems within one task**, not people, institutions, clinical decisions, or all medical evidence.

MIRRA does not create the outcome labels. The outcome protocol, independent resolvers, and scoring adapter remain essential trust boundaries outside its mathematical kernel.

### 15.2 Preserve the frozen core

The inspected protocol uses `mirra.v1-pilot`, scale `S = 2^32 = 4294967296`, 2–64 active experts, learning rate `1/8`, and losses in integer range `[0,S]`. Its output weights sum to `S`. The active expert set locks with the first correction. Identical event retries return the original result; conflicting loss vectors under the same key are rejected. [MIRRA frozen protocol][S2]

These are integration constraints, not settings for the Commons to change. Keep medical records, receipt evaluation, clinical terminology, and governance debate outside MIRRA Core.

### 15.3 Freeze a forecast epoch

Before the first prediction, publish:

- One task definition and metric identifier.
- Inclusion rules for events; include all eligible events, not just successful forecasts.
- Model owner, model/version identity, prompt/configuration digest, and permitted input corpus.
- The complete 2–64-system roster and initial weighting configuration.
- Prediction cutoff, source hierarchy, outcome definition, and resolution deadline.
- Missing-prediction handling, unresolved-event handling, and correction procedure.
- Loss calculation, fixed-point conversion, tie handling, and submission ordering.
- Evaluation baselines and reporting plan.

A changed model version, roster, materially changed task, or scoring protocol requires a new epoch with explicit lineage. Do not replace a model behind an unchanged expert identifier.

### 15.4 A bounded research forecast task

Illustrative task: **Will the designated public result report that the prespecified primary endpoint met the exact success criterion recorded in this event protocol?**

Before accepting forecasts, a methods reviewer must lock the endpoint, analysis population, statistical criterion, accepted reporting source, relevant amendments, and handling of inconsistent reports. If that cannot be specified unambiguously, do not score the event.

The eventual label concerns what the designated result establishes under that resolution protocol. It is not a finding of patient benefit, clinical importance, absence of fraud, or suitability for treatment.

For an easier operational experiment, use a different epoch to forecast whether a specified document is publicly posted by a deadline. Do not mix this reporting-timing task with endpoint-result prediction in one weight history.

### 15.5 Prospective sequence

1. Register the event and freeze its source/rule manifest.
2. Obtain every system's prediction from permitted inputs.
3. Persist predictions and a registry acceptance record before the cutoff and before public result availability.
4. Persist the exact weight snapshot used for the ensemble prediction at that time.
5. After publication, independent resolvers examine the designated source and publish a resolution record.
6. Allow a predefined resolution-challenge interval before submitting a scored event.
7. Compute the full loss vector outside MIRRA using the frozen adapter.
8. Have the authorized correction writer submit the vector once using the canonical event identity.
9. Store the MIRRA result, sequence, state root, and replay information.
10. Display the outcome, original predictions, losses, and uncertainty in a research-only view.

Only past resolved events may influence a prediction's weight snapshot. Never evaluate a prediction using weights updated with that prediction's own outcome. Record delayed resolutions and their acceptance order explicitly.

### 15.6 Exact Brier-loss adapter

For binary outcome `y` in `{0,1}` and probability `p` in `[0,1]`, define the single-event loss as:

```text
loss = (p - y)^2
```

This formula is bounded in `[0,1]`, fitting MIRRA's declared loss range. It is a proposed adapter choice, not proof of medical validity.

Use integer arithmetic:

```text
S = 4294967296
P = round_ties_even(p * S)
L = round_ties_even((P - y*S)^2 / S)

Require 0 <= P <= S and 0 <= L <= S.
Submit L as the unsigned Q32.32 loss.
```

Parse the submitted decimal probability deterministically; reject invalid or out-of-range inputs. Use checked wide integers or BigInt for intermediate squares, not JavaScript floating-point arithmetic. Store integer protocol values as decimal strings in JSON where the schema requires exact representation.

| Prediction | Outcome | Mathematical loss | Encoded loss |
|---|---:|---:|---:|
| 0.75 | 1 | 0.0625 | 268435456 |
| 0.25 | 1 | 0.5625 | 2415919104 |
| 0.50 | 0 | 0.25 | 1073741824 |
| 1.00 | 0 | 1.00 | 4294967296 |

The table checks adapter arithmetic only. It does not claim that MIRRA was executed for this document or that any particular post-update weight was obtained.

### 15.7 Missing and disputed outcomes

| Situation | Required behavior |
|---|---|
| Model fails to submit | In the first pilot, apply a predeclared 0.5 fallback and mark it as fallback; never silently omit that expert |
| Source unavailable or outcome ambiguous | Keep `UNRESOLVED`; do not assign failure or zero loss |
| Event invalid under the locked protocol | Record `CANCELLED` with review rationale; report exclusions |
| Outcome challenged before scoring | Hold the vector until resolution is settled under the protocol |
| Identical correction submission retried | Reuse the same event identity; verify the original response |
| Different losses submitted for an existing identity | Reject and investigate; do not invent a new identity to evade deduplication |
| Already-scored outcome later corrected | Mark the affected epoch as requiring revision; use the replay procedure below |

### 15.8 Correcting a scored event

The existing additive update stream does not provide an assumed “undo this event” operation. Adding a second event with the corrected outcome would double-count; submitting negative losses would violate the allowed range.

For the pilot, pause affected scoring, retain the historical epoch, and construct a successor epoch by replaying the original eligible event sequence with the approved corrected labels and the original locked predictions. Record the predecessor, correction authority, full replay manifest, and resulting state. A reviewer must approve the new epoch before use.

Do not rewrite the original timestamped ensemble predictions. Report originally issued forecasts separately from any retrospective recomputation. A corrected evaluation dataset can change measured performance; it cannot make a revised forecast retroactively prospective.

### 15.9 Evaluate usefulness, not just arithmetic

Compare the adaptive ensemble with an equal-weight ensemble and a predefined simple baseline using the same events and information cutoffs. Report prediction coverage, fallback rate, unresolved outcomes, Brier loss, calibration where supportable, sample size, and uncertainty that accounts for related events where appropriate.

Twenty historical trials can test extraction, policy evaluation, replay, and software behavior. They do **not** establish prospective forecasting ability, especially when model training or source access may include their results. Determine a defensible prospective evaluation size with a statistician before claiming an advantage.

Until release assurance and prospective usefulness are separately demonstrated, MIRRA remains off or shadow-only. Mathematical release approval does not substitute for task validation.

## 16. A complete synthetic example

Everything in this section is fictional. Identifiers beginning `SYNTHETIC-` are not real trial registrations. These are proposed test fixtures, not clinical evidence or signed receipts.

### Packet creation

1. The collection protocol selects `SYNTHETIC-TRIAL-001`.
2. Source A contains a fictional protocol; Source B contains a fictional result table.
3. Reviewer A extracts the designated outcome at day 90 for the declared analysis population.
4. Reviewer B checks the source and finds that a denominator was copied as 120 instead of 100.
5. The reviewers correct the draft before publication and record the comparison.
6. They retain a methodological disagreement about missing outcome data.
7. All review-policy assertions are satisfied because the disagreement is visible and the required checks are documented.
8. The application issues a synthetic draft receipt with result `COMPLETE` and the mandatory non-assertions.

The reader sees: **Review process complete. Methodological disagreement remains. No clinical conclusion certified.**

### Challenge after publication

| Event | Stored record | Public effect |
|---|---|---|
| Original publication | Packet v1 and receipt R1 | First reviewed version is visible |
| Challenge | C1 cites a source-location mismatch | Current view marks an open challenge |
| Review of challenge | Two reviewers confirm the mismatch | Decision explains the error |
| Correction | Packet v2 and receipt R2 reference v1/R1 | Current view points to v2 and shows a diff |
| Recheck of R1 | Original digest still matches | R1 is authentic as an old artifact, not the current review |

This is the central correction behavior. The original artifact's mathematical validity and its current evidentiary status are different questions.

### Independent MIRRA fixture

For a separate fictional event, two systems submit probabilities 0.75 and 0.25 before its locked cutoff. Equal starting weights yield an initial ensemble probability of 0.50. The later accepted label is 1, so the losses are 0.0625 and 0.5625. The adapter encodes those losses as shown in Section 15 and submits the full vector.

Do not infer a real MIRRA execution, exact resulting weights, forecasting advantage, or medical effectiveness from this toy example.

## 17. ICP architecture

### 17.1 Smallest useful deployment

Begin with one application, one off-chain worker/signing boundary, and one registry canister when the ICP stage is reached. MIRRA is a separate optional canister. Separate logical modules do not require a fleet of canisters.

| Component | Recommended location | Responsibility |
|---|---|---|
| Public interface | Static web application; ICP assets are an option | Render packets, source links, status, local verification, exports |
| Review workspace | Same application with authorized write access | Draft, compare, approve, and challenge |
| Ingestion and extraction worker | Conventional controlled service | Fetch public sources, parse, propose extraction, enforce quotas |
| Issuance component | Controlled service with protected keys | Validate approvals and run bindings, evaluate frozen policy, sign |
| Commons registry | One Rust ICP canister | Public manifests, receipt index, correction lineage, key/policy status, audit events |
| Source storage | Rights-appropriate storage | Retain permitted public snapshots and exports |
| MIRRA adapter | Separate constrained service/module | Score externally resolved events and submit authorized vectors |
| MIRRA Core | Existing separate ICP canister, gated | Deterministic updates and certified state |

The registry trusts authorized issuers for the assertions it accepts. It can check signatures and structural/policy constraints without repeating every human review. Make that residual trust explicit. Moving the registry to ICP does not remove the off-chain issuer or reviewer trust boundary.

### 17.2 Why use ICP here?

The proposed benefit is a common, verifiable reference for published manifests, policies, and correction history. A conventional database can also deliver a useful first product. ICP is justified only if independent state verification and shared registry continuity create value beyond the added operational complexity.

Certified variables support client verification of canister-certified state. Clients must actually verify certificates and witnesses against trusted roots; merely receiving a certificate field is insufficient. This authenticates returned state, not the medical statements within it. [ICP certified variables][S14]

For Rust canisters, durable state must be designed for stable persistence across upgrades and tested accordingly. Do not confuse surviving routine updates with a verified upgrade/migration path. [ICP data persistence][S15]

### 17.3 Registry modules

- Immutable published policy versions.
- Public packet-version and manifest index.
- Receipt issuance and idempotency records.
- Challenge and supersession events.
- Issuer-key authorization and revocation history.
- Governance proposals, decisions, and deployment audit records.
- Certified read projections and bounded pagination.

Raw patient data, unrestricted document blobs, private reviewer enrollment records, model API credentials, and signing secrets do not belong in this registry.

### 17.4 Certification and freshness

The independent client verifies the expected network root, canister identity, delegation/scope, certificate signature, witness path and root, and a declared freshness policy. It must not accept a production root fetched from the same untrusted endpoint it is verifying.

Prototype proposal: a maximum certificate age of five minutes for a “current registry check,” with configurable clock tolerance and explicit failure states. Archived proof can establish a historical snapshot but cannot be displayed as a fresh check. Disconnected clients show currency as unknown.

### 17.5 Issuance consistency

Use a durable outbox and idempotent registration:

1. Freeze and validate approved inputs.
2. Evaluate and persist the unsigned run and its content digest.
3. Obtain the authorized detached signature once.
4. Persist the signed receipt and registration attempt.
5. Submit to the registry with a canonical idempotency key.
6. On timeout, check the existing registry result before retrying.
7. Mark publication complete only after the accepted registry record is confirmed.

Recommended idempotency scope: obligation identifier, policy digest, and approved run digest. Identical retries return the same receipt. A changed run is a new, explicitly linked issuance—not a silent retry. Concurrent attempts to supersede the same current version require compare-and-set protection or an explicit fork-resolution process.

### 17.6 Controllers and upgrades

Prefer an accountable multi-party controller arrangement for public production after the pilot. Specify the actual principals, approval threshold, and recovery arrangement during implementation; a written “two-person rule” is not a cryptographic multisignature system by itself.

Publish proposed code digest, migration plan, tests, review decision, and resulting deployment record. Ordinary changes should have a declared review delay. Emergency authority may pause new writes or isolate exposure, but must not silently rewrite published conclusions.

An append-only application rule is not an unconditional guarantee against all future controller actions. External exports and independently retained checkpoints help make tampering or loss detectable; they do not eliminate all governance risk.

## 18. Data contracts and application interfaces

### 18.1 Draft contract sketch

This TypeScript sketch communicates object boundaries. It is not a complete JSON Schema, validation library, compiled implementation, or existing PoF type.

```typescript
type Digest = string; // validator: "sha256:" followed by 64 lowercase hex digits
type UIntDecimal = string; // validator: canonical unsigned decimal, no leading zeros
type ReviewResult = "COMPLETE" | "INCOMPLETE" | "BLOCKED";
type RuleStatus = "SATISFIED" | "MISSING" | "BLOCKING";

interface SourceRef {
  source_version_id: string;
  original_url: string;
  captured_at: string; // validated UTC timestamp
  bytes_digest: Digest | null; // null when only a link is retained
  locator: string;
  rights_basis: string;
}

interface OutcomeScope {
  study_id: string;
  outcome_claim_id: string;
  population: string;
  intervention: string;
  comparator: string;
  outcome: string;
  timeframe: string;
  analysis_population: string;
}

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
  not_asserted: string[]; // exact mandatory set from the pinned policy
  issuer_key_id: string;
  issuer_claimed_at: string;
  predecessor_receipt_digest: Digest | null;
  supersedes_receipt_digest: Digest | null;
}

interface DetachedSeal {
  signing_profile: string;
  key_id: string;
  signature_encoding: "base64url";
  signature: string;
}

interface SignedReviewEnvelope {
  receipt: ReviewReceiptDraft;
  receipt_digest: Digest;
  seal: DetachedSeal | null; // null is explicitly unsigned, never authenticated
}

interface ForecastSubmission {
  epoch_id: string;
  event_id: string;
  expert_id: string;
  probability_q32: UIntDecimal;
  input_manifest_digest: Digest;
  weight_snapshot_digest: Digest;
  cutoff: string;
}
```

Runtime validators must enforce field lengths, exact allowed keys, allowed code sets, rule uniqueness, decimal range, timestamp precision, identifier syntax, UTF-8 validity, and links between records. TypeScript types alone provide none of those runtime guarantees.

Avoid publishing unvalidated free text in public receipts. Where text is necessary, bind an approved safe version and render it as inert text.

### 18.2 Logical API surface

These are proposed operation names. Map them to Candid or authenticated HTTP endpoints during implementation; they are not existing MIRRA methods.

| Operation | Authorization | Mutation and safety contract |
|---|---|---|
| `list_collections(cursor, limit)` | Public | Bounded read |
| `get_packet(id, version)` | Public | Exact version, manifest, and current-status reference |
| `get_receipt(digest)` | Public | Receipt plus available proof and lineage |
| `get_policy(id, version)` | Public | Exact frozen body or explicit not found |
| `verify_packet_local(file)` | Local only | No implicit upload or external execution |
| `create_review_draft(input)` | Enrolled reviewer | Draft only; no issuance authority |
| `submit_review_approval(run_digest)` | Assigned reviewer | Approval bound to exact inputs |
| `publish_receipt(envelope, idempotency_key)` | Authorized issuer | Reject invalid bindings, duplicate conflicts, and unapproved keys |
| `submit_challenge(target, evidence_refs)` | Authorized pilot contributor | Moderated; private content is not published automatically |
| `resolve_challenge(id, decision)` | Unconflicted adjudicator | Adds event and, if needed, a new packet/receipt |
| `publish_policy(versioned_body)` | Policy governance | New version only, with prior approval |
| `rotate_or_revoke_key(event)` | Security/governance role | Versioned trust event, independently auditable |
| `submit_forecast(input)` | Registered system | Reject post-cutoff or duplicate-conflicting input |
| `submit_resolution(input)` | Assigned resolver | Cannot write MIRRA directly |
| `submit_scored_event(input)` | Dedicated MIRRA writer | Checks epoch, resolution, roster, bounds, and replay semantics |

Anonymous visitors remain readers during the pilot. Broader challenge submission needs its own moderation, abuse, and identity-minimization design before it is enabled.

### 18.3 Role separation

At minimum distinguish reader, contributor, reviewer, adjudicator, issuer, source worker, MIRRA writer, policy administrator, and deployment controller. A contributor cannot promote their own output into an issued receipt. A model cannot acquire issuance authority by writing persuasive text. Public access does not imply public write access.

### 18.4 Protocol limits to freeze

Proposed pilot limits: 100 items per read page, 25 source references per outcome packet, a 2 MiB public JSON import limit, and one outcome per review run. Larger artifacts require explicit versioned handling; reject oversize input rather than truncating signed data.

Treat these as product limits to validate against fixtures, not as claimed ICP network limits. Rate limits and cost ceilings apply to both successful and failed operations.

## 19. Security and threat model

### Threats and controls

| Threat | Required mitigation | Residual limitation |
|---|---|---|
| Fabricated evidence with a valid receipt | Source provenance, critical-field review, explicit non-assertions | Cryptography cannot establish that trial conduct matched the paper |
| Demo or self-supplied key accepted as trusted | Separate demo roots; production trust allowlist; reject self-anchoring | Enrollment can still be compromised |
| Prompt injection in a paper | Inert parsing; tool isolation; no document-controlled authority | Extracted text still requires human validation |
| Reviewer collusion or concealed conflict | Assignment rules, disclosures, independent review, appeals | Undisclosed relationships cannot be ruled out absolutely |
| Duplicate or concurrent issuance | Durable idempotency and compare-and-set publication | Cross-system coverage is limited to the declared registry scope |
| Late or hindsight forecast | Pre-cutoff registry acceptance, input manifests, source cutoff controls | Model training contamination needs separate evaluation |
| Selective event scoring | Published eligibility log and unresolved/cancelled-event reporting | Poorly designed eligibility rules can still bias evaluation |
| Model clones presented as independent | Owner/version registration and correlation analysis | Different identities do not prove independent errors |
| Receipt tampering or forged lineage | Domain-separated digests, trusted signatures, ancestor validation | Old valid receipts can still be misleading without currency checks |
| Source-fetch SSRF or malware | Allowlisted destinations, redirect checks, size limits, isolated parsers | New parser vulnerabilities remain possible |
| XSS or malicious import | Strict schemas, safe text rendering, CSP, no arbitrary scripts | Frontend supply-chain risk remains |
| Key/controller compromise | Least privilege, protected keys, rotation, emergency pause, audited recovery | A compromised quorum can cause damage |
| Accidental personal-data publication | Field allowlists, prepublication review, no raw upload by default | Redaction scanners are imperfect |
| Cost exhaustion or denial of service | Quotas, caching, bounded compute, per-principal rate limits | Public services still need operational capacity |
| Source or service disappearance | Permitted exports, checkpoints, restore drills, rights-aware redundancy | Third-party content may become unavailable |

### Hard security invariants

- No client-supplied string can grant a role.
- No uploaded public key can grant itself issuer trust.
- No mutable policy lookup can replace the policy digest bound to an old receipt.
- No unreviewed model output can become a published clinical claim or process assertion.
- No agent output can authorize payment, treatment, or MIRRA governance.
- No background task can exceed a configured spending ceiling.
- No recovery procedure can erase known corrections to make status look cleaner.
- No test may be weakened to disguise a violated protocol invariant.

Commission independent security review before meaningful public reliance on authenticated issuance. Internal tests and a separate verification module are valuable, but neither is an external audit.

## 20. Privacy and medical boundaries

### 20.1 Public-data-only by design

Permitted: public study identifiers, public aggregate study results, citation metadata, approved professional review attributions, policy bodies, safe review notes, manifests, and correction events.

Excluded: patient charts, names, contact information, record numbers, exact patient visit details, private consult receipts, diagnostic media, identifiable narratives, private billing records, and leaked or access-controlled study data.

Published case reports and very small or highly specific datasets still need identifiability review. “Already online” is not sufficient reason to ingest and republish them. The pilot excludes individual case reports altogether.

### 20.2 Hashing is not de-identification

Do not publish a deterministic hash of a patient identifier or a predictable private event tuple and call it anonymous. Matching and guessing can expose information, and combinations of fields can identify someone without a name.

HHS describes Safe Harbor and Expert Determination as HIPAA de-identification methods. The product should not claim either merely because it removes names or hashes fields. HIPAA applicability depends on the parties and functions involved, not just the word “medical” in the product name. [HHS de-identification guidance][S16]

### 20.3 A blockchain or encryption does not establish compliance

If a later project handles ePHI for a covered entity or business associate, the architecture, contracts, business-associate arrangements where applicable, security controls, and risk analysis need separate review. HHS explains that a cloud provider's inability to view encrypted ePHI does not by itself remove applicable business-associate obligations. [HHS cloud guidance][S17]

This document makes no claim that ICP, a particular hosting provider, or the proposed product is HIPAA-compliant. Do not send patient data to external model providers under this plan.

### 20.4 Medical-device and intended-use boundary

The initial intended use is research evidence organization and transparent review, without patient-specific treatment output. Adding individualized diagnosis, risk prediction, or treatment recommendations requires a new intended-use and regulatory assessment before implementation.

FDA's current CDS guidance describes criteria for certain non-device software functions and distinguishes other device functions. A disclaimer alone does not settle classification; actual functionality and intended use matter. [FDA Clinical Decision Support Software guidance][S18]

Jurisdiction is not yet chosen. These U.S. sources flag design considerations; they are not a global compliance determination or legal clearance.

### 20.5 Incident containment and deletion

If unsafe personal data appears, stop further publication, restrict access to the exposed material where possible, preserve a restricted incident record, and obtain appropriate privacy/legal review. Public tombstones should give safe reasons without repeating the leaked content.

Never promise complete deletion from public replicas, downloaded files, external archives, or immutable commitments. Preventing publication is the primary control. A blockchain commitment can itself be sensitive; it is not an automatic safe harbor.

## 21. Governance and accountability

### The Commons charter

Adopt these as proposed operating commitments:

1. Public evidence access and independent verification remain free at ordinary human-use volumes.
2. Scientific conclusions are not sold, voted into truth, or dictated by sponsors.
3. Contributions carry source attribution and an accountable review trail.
4. Material disagreement is represented fairly with its supporting evidence.
5. Known errors are corrected visibly; appropriate corrections are not treated as reputational defeat.
6. Policies, funding, conflicts, release status, and governance changes are inspectable.
7. Users can export public packets and the verification information needed to interpret them.
8. Private patients and personal medical decisions stay outside the product's initial scope.

### Pilot responsibilities

| Role | Decision rights | Restriction |
|---|---|---|
| Product steward | Scope, budget, collection priorities | Cannot override a scientific review by personal preference |
| Methods lead | Review protocol and critical-field definitions | Must disclose conflicts and document changes |
| Clinical-domain reviewer | Context and outcome interpretation | Authority is limited to demonstrated domain competence |
| Second reviewer/adjudicator | Independent checking and disputes | Cannot adjudicate their own challenged work alone |
| Security maintainer | Keys, vulnerabilities, incident containment | Cannot quietly change receipt conclusions |
| Policy approvers | Approve future policy versions | Cannot reinterpret existing signed policies in place |

One person can hold multiple practical roles in a prototype, but such overlap must be disclosed and cannot satisfy an independence requirement by changing their account name. If qualified independent review is unavailable, publish only a clearly labeled single-author draft, not a policy-complete independent review.

### Challenges and appeals

Accept evidence-linked challenges, give the target contributor a fair opportunity to respond, assign unconflicted review, publish the reasoned disposition, and permit one documented appeal to a different qualified reviewer where feasible. Moderate abuse and private information without suppressing substantive criticism.

An unresolved complaint remains a complaint. An upheld challenge identifies the specific error; it is not a blanket judgment about a person or institution.

### Licensing

Proposed approach: permissively licensed original software, an explicit reuse license for original review text, and rights-aware treatment of third-party documents. Preserve upstream licenses and notices for reused code. Choose the review-text license with contributors before accepting submissions; the Commons cannot relicense publishers' papers by declaring itself open.

No token, token-weighted voting, reviewer speculation market, or transferable reputation asset is required.

## 22. Operations and recovery

### Operating register

Maintain a small register containing collection owner, methods owner, software version, issuer keys, controller arrangement, budget ceiling, source adapters, source-check schedule, incident contact, and current release gates.

### Pilot targets, not contractual promises

- Acknowledge ordinary review challenges within five working days.
- Triage suspected privacy or key-compromise incidents promptly under an explicit staffed incident plan.
- Check source availability and correction status on a published schedule and at publication.
- Record unresolved queues and missed targets openly.
- Pause new issuance if safe review or operational capacity is unavailable.

Do not promise 24/7 clinical support or emergency response. This is not an emergency medical service.

### Required operational checks

- Error rates, rejected imports, source failures, and stale status lookups.
- Draft and challenge queue age.
- Reviewer capacity and conflict assignments.
- Receipt registration outbox and retry conflicts.
- Key expiration, revocation, and deployment changes.
- Storage growth, cycles, model/API usage, and spending limits.
- Export availability and restore-test results.

Logging must minimize private content. Store safe identifiers and reason codes instead of full imported documents or prompts where possible.

### Backup and recovery

Use versioned backups of approved public records, configuration, trust history, and required restricted operational metadata. Protect restricted backups separately. Test restoration into a clean environment and verify content digests, correction links, authorizations, schema versions, and certified state.

Suggested pilot objective: daily export/checkpoint and a documented restore exercise before public launch. Set recovery-time and recovery-point targets from measured capability, not from this paper alone.

### Failure modes visible to users

- Registry unavailable: readable cached packet may remain available, but current-status verification is unknown.
- Signing service unavailable: drafts remain drafts; no fabricated authenticated receipt.
- MIRRA unavailable: Commons review and receipt functions continue; no invented weights.
- Source removed: explain missing availability while retaining permitted provenance.
- Key compromise: suspend affected issuance, publish trust-status changes, and review affected receipts using the approved incident protocol.

## 23. Sustainability and cost control

### What can be funded

Charge for useful services around the Commons, not favorable findings:

- Institutional workflow, integrations, and support.
- Curation and review labor with payment independent of outcome.
- Training in evidence-packet methods and verification.
- Hosted private organizational workflow containing no patient data under the initial scope.
- Grants or disclosed sponsorship for topic collections.

Public evidence packets, methods, correction history, and ordinary independent verification remain freely accessible. Bulk hosted compute or enterprise service may have transparent quotas or charges without charging a person to check an already downloaded receipt.

### Sponsorship firewall

Sponsors may propose topics or fund labor. They do not select the scientific conclusion, suppress an unfavorable result, choose their own unconflicted status, remove a valid challenge, or buy MIRRA weight. Funding and assignment decisions must be visible.

### Cheapest useful starting point

Before infrastructure spending, create a few synthetic packets and have intended users explain what they understand. Then manually prepare a small number of public packets to measure actual review time. Automate only the repeated work shown to be costly.

### Illustrative pilot budget

The following is a hypothetical planning calculation, **not a supplier quote, market-rate estimate, approved spend, or all-in development budget**. Two reviewer-hours per packet is an assumption to measure, not a clinical-quality guarantee.

| Input | Assumption | Illustrative cost |
|---|---:|---:|
| Review labor | 20 packets × 2 total reviewer-hours × $75/hour | $3,000 |
| Coordination | 10 hours × $50/hour | $500 |
| Infrastructure and extraction allowance | Fixed pilot cap | $200 |
| Subtotal | Sum of above | $3,700 |
| Contingency | 20% of subtotal | $740 |
| Total | Subtotal plus contingency | $4,440 |

This equals $222 per packet under those assumptions. It excludes software engineering, legal/privacy review, independent security review, MIRRA mathematical assurance, recruitment, and long-term operations. If qualified review takes longer, revise scope or budget; do not quietly reduce the review requirement.

Useful formula:

```text
pilot cost =
  packet count × reviewer-hours per packet × reviewer hourly cost
  + coordination
  + infrastructure and API usage
  + separately scoped engineering, assurance, and legal work
  + contingency
```

Set explicit caps before any external service is enabled. No payment, subscription, paid model run, reviewer recruitment, or deployment expenditure is authorized merely by this blueprint.

## 24. Implementation roadmap

These phases describe dependencies and acceptance criteria. Effort is a planning estimate for a capable team, not a deadline commitment. Independent scientific, security, regulatory, and MIRRA proof review may dominate elapsed time.

| Phase | Deliverable | Exit criterion | Rough implementation effort |
|---|---|---|---|
| 0 — decision | Approved scope, collection question, charter draft, spending cap | Founder and methods owner agree on the bounded use case | Several focused working sessions |
| 1 — contracts | Schemas, policies, fixtures, canonicalization vectors | Critical ambiguity is resolved before UI polish | 1–2 engineer-weeks |
| 2 — synthetic product | Packet views, review workflow, verifier, export, correction demo | All synthetic functional and boundary tests pass | 2–3 engineer-weeks |
| 3 — public pilot | 20 curated packets, qualified review, feedback study | No unreviewed publication; users understand limitations | 2–4 engineer-weeks plus review labor |
| 4 — ICP registry | Stable state, certification, idempotency, governance, recovery | Independent verification and upgrade gates pass | 2–4 engineer-weeks plus security review |
| 5 — MIRRA shadow pilot | Frozen epoch, adapter, prospective event logging, evaluation | Upstream release gates and adapter tests pass before relied-on use | 2–4 engineer-weeks plus external assurance and event waiting |

The effort ranges are additive planning units, not a promise that one person finishes the entire system in two weeks. Phases 4 and 5 require explicit continuation decisions. Phases 1–3 should produce a useful product even if those later phases are deferred.

### Dependency constraints

- Policy semantics and schemas precede production receipt issuance.
- Enrollment and conflict rules precede claims of independent review.
- Export and local verification precede claims of portability.
- Privacy review precedes publication, not just UI launch.
- Source licensing precedes mirroring.
- Trusted roots and current-status checks precede “authenticated and current” labels.
- MIRRA release assurance precedes relied-on MIRRA deployment.
- A prospective evaluation precedes claims of predictive improvement.

### First working session

Approve the product boundaries, select a candidate collection question, identify qualified review capacity, and choose a spending cap. Then start with the synthetic schema and correction fixtures—not live patients, a token, or a mainnet deployment.

## 25. Acceptance tests and release gates

### 25.1 Minimum synthetic fixture suite

| Fixture | Expected outcome |
|---|---|
| All required review evidence present | Process `COMPLETE`; mandatory non-assertions present |
| Missing source reference | Process `INCOMPLETE` |
| Missing second review | Process `INCOMPLETE` |
| Unresolved interpretation documented correctly | Process may be `COMPLETE`; disagreement visibly retained |
| Hidden critical-field disagreement | Process not complete |
| Prohibited reviewer conflict | Process `BLOCKED` |
| Personal-data field or unsafe attachment detected | Publication blocked; no unsafe public receipt |
| Changed receipt payload | Integrity fails |
| Signature valid under an unknown or demo key | Signature math may pass; production issuer trust fails |
| Mandatory non-assertions removed | Policy consistency fails, even if payload is re-signed |
| Earlier receipt supplied after correction | Historical artifact can pass; current-status check reports superseded |
| Missing ancestor, cycle, or unrelated supersession | Lineage check fails or reports incomplete as specified |
| Duplicate identical issuance | Original receipt returned; no second obligation completion |
| Concurrent conflicting publication | Deterministic conflict, no silent overwrite |
| Tampered or stale ICP witness/certificate | Current certified read rejected or marked unavailable |
| Registry unavailable | Local integrity may pass; current status remains unknown |
| Upgrade/restart after issuance | Records, roles, idempotency, and lineage survive |
| Scored event retried through a different writer | MIRRA duplicate protection still holds |
| Missing forecast | Declared fallback recorded; expert vector stays complete |
| Corrected scored outcome | Successor-epoch replay, not a duplicate compensating event |

### 25.2 Product release checklist

- [ ] Collection scope, search cutoff, inclusion log, and limitations are visible.
- [ ] Every critical published field has a reviewed source locator or explicit unknown.
- [ ] Study IDs and publication IDs cannot be silently conflated.
- [ ] Draft, process-complete, disputed, superseded, and currency-unknown states are distinguishable.
- [ ] The viewer can find the mandatory non-assertions without opening a hidden appendix.
- [ ] Exports identify unavailable evidence and retain required history.
- [ ] Mobile, keyboard, and non-color status paths work.
- [ ] Synthetic fixtures cannot be mistaken for real trial records.
- [ ] Intended users can explain what a receipt does and does not establish.

### 25.3 Protocol and security checklist

- [ ] Existing PoF golden cases and frozen policy versions remain unchanged.
- [ ] Research schema and policy are explicitly versioned and reviewed.
- [ ] No fake monetary fields are used to force compatibility.
- [ ] Canonicalization and signature vectors agree across independent implementations.
- [ ] Evaluator and verifier dependency boundaries are tested.
- [ ] Unknown schema, duplicate keys, malformed Unicode, oversize input, and invalid integers fail closed.
- [ ] Demo keys are rejected by production trust configuration.
- [ ] Reviewer approvals and issuer permissions bind exact inputs and policy scope.
- [ ] Issuance retries, concurrent supersession, key rotation, and key compromise have tested behavior.
- [ ] Privacy/rights publication checks, parser isolation, and prompt-injection defenses are exercised.
- [ ] Independent security findings are resolved or explicitly risk-accepted by accountable owners.

### 25.4 ICP checklist

- [ ] Exact deployment artifact digest and toolchain provenance are recorded.
- [ ] Certificates, witnesses, canister identity, roots, and freshness are checked independently.
- [ ] Stable-state upgrade and clean-environment restore tests pass.
- [ ] Controller principals, threshold mechanism, emergency pause, and recovery are documented and tested.
- [ ] No patient material or secrets are present in public or canister state.
- [ ] Cost ceilings and source/API quotas are active.
- [ ] An outage does not display stale verification as current.

### 25.5 MIRRA checklist

- [ ] Actual upstream release requirements pass for the exact intended commit and artifact.
- [ ] Replacement P1 mathematics, provenance, review, and required attestation are verified; historical invalid proof is not reused.
- [ ] The Commons does not alter frozen MIRRA arithmetic or expert identity semantics.
- [ ] Epoch, input rules, roster, cutoffs, baselines, and handling of missing data are preregistered.
- [ ] Scoring uses deterministic bounded integers and complete sorted expert vectors.
- [ ] Prediction acceptance and weight snapshots precede the target outcome.
- [ ] Resolution is external, evidence-linked, and challengeable.
- [ ] Replay and corrected-label procedures are tested.
- [ ] Retrospective tests are not described as prospective validation.
- [ ] MIRRA cannot issue review verdicts, authorize treatment, or release funds.

The MIRRA source itself distinguishes a production-oriented candidate from an approved release. Its release checklist must be revisited during implementation; this document cannot close those gates. [MIRRA release checklist][S19]

## 26. Success metrics and stopping rules

### Measure the product separately from the protocol

| Dimension | Pilot measure | Interpretation |
|---|---|---|
| Usefulness | Time to reconstruct a claim with versus without a packet, using a planned comparison | Tests workflow value, not clinical benefit |
| Traceability | Fraction of critical fields with validated locators or explicit unknowns | Missing provenance is visible |
| Accuracy | Critical extraction errors found in independent review | Report denominator and error severity |
| Comprehension | Readers distinguish process completion from effectiveness and understand “currency unknown” | Prevents misleading badges |
| Correction quality | Time to disposition, explanation completeness, preserved history | A visible correction is a product function |
| Sustainability | Actual reviewer-hours and operating cost per packet | Determines whether expansion is affordable |
| Portability | Successful verification by a separate implementation from an export | Tests independence from the website |
| MIRRA research | Prospective loss and calibration against prespecified baselines, with uncertainty | Does not establish medical decision safety |

### Pilot decision rule

Expand only after the team can show usable packets, understood boundaries, functioning correction and export paths, qualified reviewer capacity, and affordable measured work. Set quantitative targets before collecting evaluation results; do not move targets afterward to manufacture success.

### Pause or stop when

- Readers repeatedly interpret process receipts as treatment approval.
- Qualified independent review cannot be sustained.
- Publication requires inaccessible evidence or unresolved rights.
- Private medical information begins appearing in submissions.
- The product saves no meaningful work for its intended users.
- Costs exceed the approved cap without demonstrated value.
- MIRRA integration consumes effort without a credible evaluation path or advantage over a simpler baseline.
- Governance cannot respond fairly to errors or conflicts.

Stopping MIRRA integration does not require shutting down a useful evidence commons. Stopping public issuance does not require deleting useful, clearly labeled draft research.

## 27. Developer handoff

### Suggested project boundaries

Create a separate Commons repository when implementation is authorized. Keep MIRRA Core and the existing Fulfilled explorer intact. Use pinned dependencies or adapters for approved upstream components and preserve licenses.

| Proposed directory | Ownership |
|---|---|
| `apps/commons-web/` | Public views and authorized review workspace |
| `packages/contracts/` | Runtime schemas, status semantics, version dispatch |
| `packages/review-policy/` | Research policy evaluation, no signing authority |
| `packages/receipt-verifier/` | Independent verification, no evaluator import |
| `packages/source-adapters/` | Allowlisted public-source retrieval and parsing |
| `packages/mirra-adapter/` | Epoch, scoring, and bounded correction submission |
| `services/issuer/` | Approval checks, protected signing, durable outbox |
| `canisters/commons-registry/` | Stable registry, certification, authorization |
| `fixtures/synthetic/` | Fictional passing, failing, and adversarial cases |
| `docs/` | Policies, charter, threat model, provenance, runbooks |

This layout is proposed, not a directory tree created by this deliverable. Do not scaffold unused infrastructure merely to fill every directory.

### Ordered implementation backlog

| ID | Task | Definition of done |
|---|---|---|
| MEC-001 | Freeze the collection and review scope | Ambiguous terms and required expertise resolved |
| MEC-002 | Write executable schemas | Invalid/unknown fields fail closed with useful errors |
| MEC-003 | Create synthetic fixtures | At least ten fixtures cover the critical branches |
| MEC-004 | Implement policy evaluation | Deterministic rule outcomes match fixtures |
| MEC-005 | Implement independent verifier | Tampering, unknown trust, and incomplete lineage are detected |
| MEC-006 | Build packet and claim views | Each critical field opens the correct source location |
| MEC-007 | Build review comparison and approvals | Exact input changes invalidate earlier approvals |
| MEC-008 | Build challenge/correction history | Superseded artifacts remain inspectable |
| MEC-009 | Implement export/import | Round-trip preserves digests and scope; no implicit upload |
| MEC-010 | Add one public-source adapter | Capture, rights, failure, and versioning behavior tested |
| MEC-011 | Run the public-data pilot | Qualified review and user feedback recorded |
| MEC-012 | Finalize PoF extension or distinct protocol | Namespace and compatibility claims are unambiguous |
| MEC-013 | Add protected issuance | Production key trust and outbox recovery tested |
| MEC-014 | Add ICP registry | Certification, idempotency, upgrade, and restore pass |
| MEC-015 | Complete security and governance review | Release decision names unresolved risks and owners |
| MEC-016 | Implement MIRRA shadow adapter | All upstream/adapter gates pass; no clinical authority |
| MEC-017 | Run prospective evaluation | Original predictions and all eligible-event dispositions retained |

MEC-011 may use clearly labeled unsigned or prototype receipts. It must not imply authenticated production issuance before MEC-012 through MEC-015 are completed as applicable.

### Build discipline

- Read applicable repository instructions before edits.
- Preserve user changes and pinned upstream semantics.
- Use automated type, schema, unit, property, integration, and UI tests.
- Run the existing PoF fulfillment suite whenever integrating its components.
- Treat fixture drift as a potential protocol change, not an invitation to relax assertions.
- Pin actual dependency versions during implementation and document upgrade decisions.
- Verify production output as well as development views.
- Maintain an explicit “implemented / tested / deferred / blocked” status table.
- Do not deploy, spend, enroll people, or add clinical functions without the required authorization and gates.

## 28. Founder decisions

These are proposed defaults, not decisions already made on your behalf.

| Decision | Proposed default | Review note |
|---|---|---|
| Product name | Medical Evidence Commons; explain “commons” on the home page | Medical Evidence Hub is the plainer alternative; naming rights not checked |
| First application | TrialWatch | One curated public-trial collection |
| First customer | Journal-club or evidence-review team | Validate willingness to use it before sales expansion |
| Data boundary | Public aggregate research only | No patient data or identifiable case reports |
| Review standard | Two-person critical-field review and declared methods | Identify qualified reviewers before launch |
| First policy | `MED-EVIDENCE-REVIEW` | Disclosure compliance remains later work |
| PoF integration | Versioned research extension; separate draft namespace until approved | Never mutate existing consult receipts |
| MIRRA | Off initially; shadow-only after gates | No general physician or institution ranking |
| ICP | Small registry after workflow validation | No need to place every document or computation on-chain |
| Funding | Curation/services/grants with outcome-independent review | Public verification remains free |
| Spending | Explicit phase-by-phase cap | No costs approved by this document |
| Jurisdiction | Must be selected before operational/legal commitments | U.S. sources here are not global clearance |

### Review checklist for you

- [ ] This describes the product I want, rather than a patient-care or payment product.
- [ ] I want the first collection to focus on: ________________________________.
- [ ] My intended first users are: _________________________________________.
- [ ] The person responsible for review methods will be: ____________________.
- [ ] My initial spending cap is: _________________________________________.
- [ ] I approve the public-data-only boundary.
- [ ] I approve keeping MIRRA optional until its separate gates pass.
- [ ] I understand this Markdown file is a specification, not a working application.
- [ ] My changes or objections are: _______________________________________.

## 29. Glossary

| Term | Plain-language meaning |
|---|---|
| Commons | A shared resource maintained under agreed rules |
| Evidence packet | A bounded claim, its sources, review record, limitations, and history |
| Provenance | Where a record came from and how its current form was produced |
| Policy | Published rules for one bounded evaluation |
| Assertion | A specific statement evaluated under that policy |
| Non-assertion / not asserted | Something the receipt explicitly does not establish |
| Receipt | A portable record of a defined evaluation and its boundaries |
| Digest | A cryptographic fingerprint of specified bytes |
| Signature | Cryptographic evidence of use of a key; meaningful identity trust needs a separate basis |
| Trust anchor | A key or authority independently configured as trusted |
| Certified state | State whose canister certificate and witness can be checked by a client |
| Idempotency | A retry has the effect of one accepted operation, not an additional one |
| Supersede | Publish a new current record while retaining the old one |
| Epoch | A frozen task, roster, and protocol period for MIRRA evaluation |
| Loss | A numerical measure of prediction error; smaller is better |
| Calibration | Whether stated probabilities align with observed event frequencies over suitable data |
| Shadow mode | Evaluation without authority over operational or clinical decisions |
| PHI / ePHI | Protected health information / its electronic form, where applicable law defines it |

## 30. Sources and provenance

### How to read these sources

Project claims are grounded in the pinned snapshots below. Architecture, policy design, timelines, budgets, and business choices are recommendations developed for this blueprint, not claims that the source projects already implement them.

Medical and regulatory references establish relevant boundaries; they do not certify the proposed product. No security suite, MIRRA release runner, external human study, or clinical evaluation was executed while preparing this document.

### Project source snapshots

- **MIRRA:** commit `4ad47db0671cad3a151b4b77d6f2248f5ed84bdc`, inspected September 13, 2026. [Repository snapshot][S20]
- **Proof of Fulfillment:** commit `93b236239d7ae28ce9edaefd15b624baac612008`, inspected September 13, 2026. [Repository snapshot][S21]
- The source whitepaper was supplied by the user. The pinned implementation files govern implementation observations where general prose is incomplete or inconsistent. [Proof of Fulfillment whitepaper][S0]

### Reference index

| Ref | Source | Use in this document |
|---|---|---|
| S0 | [Proof of Fulfillment whitepaper][S0] | Original conceptual context |
| S1 | [MIRRA README][S1] | Candidate status and release boundaries |
| S2 | [MIRRA frozen protocol][S2] | Arithmetic, roster, event identity, and replay constraints |
| S3 | [Fulfilled README][S3] | Product purpose and synthetic scope |
| S4 | [Fulfilled types][S4] | Existing policy, obligation, and receipt schemas |
| S5 | [Fulfilled signing implementation][S5] | Demonstration key and signature boundary |
| S6 | [Fulfilled project doctrine][S6] | Policy immutability, non-assertions, and product separation |
| S7 | [Fulfilled evaluator][S7] | Current evaluation, independence, and commitment behavior |
| S8 | [Fulfilled independent verifier][S8] | Separate verification implementation |
| S9 | [ClinicalTrials.gov API][S9] | Source-adapter starting point; verify details at implementation |
| S10 | [PMC Open Access Subset][S10] | Reuse rights and approved retrieval methods |
| S11 | [Cochrane risk-of-bias chapter][S11] | Result-specific methods and justified judgments |
| S12 | [Supplied interview][S12] | Motivation only, not an authority for clinical conclusions |
| S13 | [RFC 8785][S13] | Canonical-JSON design reference |
| S14 | [ICP certified variables][S14] | Certified-state verification |
| S15 | [ICP data persistence][S15] | Durable state and upgrade considerations |
| S16 | [HHS de-identification guidance][S16] | Limits of simply removing names or hashing |
| S17 | [HHS cloud guidance][S17] | Applicable cloud/ePHI responsibilities |
| S18 | [FDA CDS guidance][S18] | Intended-use and medical-software boundary |
| S19 | [MIRRA release checklist][S19] | Remaining release gates to recheck |

### Known open items

- Collection topic, jurisdiction, reviewer availability, approved budget, and name clearance.
- Final research schema, extension governance, signing profile, and exact status mapping.
- Full operational definitions for source provenance and conflict checks.
- Exact dependency/toolchain versions, deployed principals, key custody, and controller mechanism.
- Independent security findings, actual source-adapter behavior, and measured costs.
- MIRRA release approval and any prospective evidence of usefulness for the selected task.

These are explicit implementation gates, not completed work hidden behind confident language.

---

**Bottom line:** Build the evidence library and accountable review process first. Use a properly versioned Proof of Fulfillment extension for bounded review receipts. Add ICP for verifiable shared state when the workflow justifies it. Add MIRRA only for narrowly defined, independently evaluated forecasting tasks. Preserve uncertainty, preserve corrections, and keep the patient off the public record.

[S0]: https://proof-of-fulfillment-seven.vercel.app/whitepaper
[S1]: https://github.com/Mitosis50/MIRRA/blob/4ad47db0671cad3a151b4b77d6f2248f5ed84bdc/README.md
[S2]: https://github.com/Mitosis50/MIRRA/blob/4ad47db0671cad3a151b4b77d6f2248f5ed84bdc/docs/PROTOCOL.md
[S3]: https://github.com/Mitosis50/proof-of-fulfillment/blob/93b236239d7ae28ce9edaefd15b624baac612008/README.md
[S4]: https://github.com/Mitosis50/proof-of-fulfillment/blob/93b236239d7ae28ce9edaefd15b624baac612008/src/lib/fulfillment/types.ts
[S5]: https://github.com/Mitosis50/proof-of-fulfillment/blob/93b236239d7ae28ce9edaefd15b624baac612008/src/lib/fulfillment/sign.ts
[S6]: https://github.com/Mitosis50/proof-of-fulfillment/blob/93b236239d7ae28ce9edaefd15b624baac612008/AGENTS.project.md
[S7]: https://github.com/Mitosis50/proof-of-fulfillment/blob/93b236239d7ae28ce9edaefd15b624baac612008/src/lib/fulfillment/evaluator.ts
[S8]: https://github.com/Mitosis50/proof-of-fulfillment/blob/93b236239d7ae28ce9edaefd15b624baac612008/src/lib/fulfillment/verifier.ts
[S9]: https://clinicaltrials.gov/data-api/api
[S10]: https://pmc.ncbi.nlm.nih.gov/tools/openftlist/
[S11]: https://www.cochrane.org/authors/handbooks-and-manuals/handbook/current/chapter-08
[S12]: https://www.youtube.com/watch?v=g42Tc1gDgm0&t=4s
[S13]: https://www.rfc-editor.org/rfc/rfc8785
[S14]: https://docs.internetcomputer.org/guides/backends/certified-variables/
[S15]: https://docs.internetcomputer.org/guides/backends/data-persistence/
[S16]: https://www.hhs.gov/hipaa/for-professionals/special-topics/de-identification/index.html
[S17]: https://www.hhs.gov/hipaa/for-professionals/special-topics/health-information-technology/cloud-computing/index.html
[S18]: https://www.fda.gov/regulatory-information/search-fda-guidance-documents/clinical-decision-support-software
[S19]: https://github.com/Mitosis50/MIRRA/blob/4ad47db0671cad3a151b4b77d6f2248f5ed84bdc/docs/RELEASE_CHECKLIST.md
[S20]: https://github.com/Mitosis50/MIRRA/tree/4ad47db0671cad3a151b4b77d6f2248f5ed84bdc
[S21]: https://github.com/Mitosis50/proof-of-fulfillment/tree/93b236239d7ae28ce9edaefd15b624baac612008
