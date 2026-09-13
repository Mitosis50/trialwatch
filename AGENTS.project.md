# TrialWatch — product rules

Release A synthetic explorer of the Medical Evidence Commons. Follow these
before editing review, receipt, verifier, or policy code.

## Boundaries that do not move

- Public aggregate research only. No patient records, identifiable case
  reports, EHR, diagnostic images, or private consult receipts.
- No accounts, wallets, payments, token governance, or prediction markets.
- No MIRRA execution and no clinical authority.
- Draft receipts live in `mec.review_receipt/0.1.0-draft`. Do not label them
  Proof of Fulfillment receipts.
- The published demo key cannot uniquely authenticate a production issuer.

## Status displays

Never collapse process, scientific assessment, integrity, and currency into
one unlabeled `VERIFIED` badge. A `COMPLETE` result means the required review
assertions were evidenced under the frozen policy. It does not mean the
intervention works.

## Policy

`MED-EVIDENCE-REVIEW@0.1.0-draft`. Result order: `BLOCKED`, then
`INCOMPLETE`, then `COMPLETE`. There is no “partly medically true” result.

An empty or weakened mandatory non-assertion set is a verification failure.

The evaluator and the verifier are separate. The verifier must not import
the evaluator or “call issuance again” as proof.

## Fixtures

Identifiers beginning `SYNTHETIC-` are fictional. Do not present them as
real registrations. Tamper, missing second review, demo-key, and correction
lineage fixtures are acceptance tests — do not relax them to make a UI
look cleaner.

## Auth and data

`VITE_AUTH_ENABLED=false`. Do not import `@/lib/db` into this explorer.
Local review drafts may use zustand / localStorage only.
