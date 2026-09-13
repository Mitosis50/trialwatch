# TrialWatch

**Protocol:** Medical Evidence Commons  
**Object:** Commons draft review receipt (`mec.review_receipt/0.1.0-draft`)  
**License:** Apache License 2.0

> A shared medical evidence library with accountable review and a visible correction history.

TrialWatch is the first collection of the Medical Evidence Commons. It organizes a bounded claim, the source version behind it, the review steps that were actually done, and every later challenge — without pretending that inclusion makes a statement true.

This repository is a **Release A synthetic explorer**. Identifiers beginning `SYNTHETIC-` are not real trial registrations. There are no patient records, accounts, payments, or MIRRA dependency. Do not add them.

## What this is

```
Claim → Source version → Two-person review → Frozen policy → Receipt → Correction history
```

| Layer | What it binds | What it must not claim |
|---|---|---|
| Commons packet | Study, outcome, sources, review notes, lineage | That inclusion makes a claim true |
| Review process | Assertions under `MED-EVIDENCE-REVIEW@0.1.0-draft` | Treatment effectiveness |
| Artifact integrity | Canonical digest and optional detached seal | That the paper describes real-world conduct |
| Currency | Whether a later correction is known | That an offline check is the last word |

Four statuses stay separate. Never collapse them into one unlabeled `VERIFIED` badge.

Independent verification does **not** reuse the evaluator. It re-canonicalizes, recomputes the digest, checks any supplied seal, and checks policy consistency, mandatory non-assertions, and ancestor lineage.

## What this is not

- Not a patient-care product, CDS device, or emergency service.
- Not a ranking of clinicians, hospitals, or institutions.
- Not a token, wallet, escrow, or prediction market.
- Not a drop-in Proof of Fulfillment receipt. The namespace is separate until a versioned research extension is approved.
- Not a MIRRA deployment. Forecasting remains off.

A receipt does not establish clinical correctness, individual effectiveness or safety, diagnosis or treatment selection, medical necessity, completeness of worldwide evidence, absence of fraud or undisclosed conflicts, that a source matches real-world trial conduct, or that the packet replaces a systematic review.

## The explorer

| Path | What you do |
|---|---|
| `/` | Purpose, boundaries, newest corrections |
| `/collection` | Glucoril collection — ten synthetic packets |
| `/packets/{id}` | Study, sources, claim, process status |
| `/packets/{id}/review` | Two-person review workspace |
| `/packets/{id}/history` | Supersession and correction lineage |
| `/verify` | Load a `.mec.json` export; tamper demo |
| `/methods` | Frozen policy body and charter |
| `/whitepaper` | Full product and architecture paper |

Reading needs no account.

```bash
npm install
npm run dev
```

```bash
npm run typecheck
npm run build
```

Print or save as PDF from the white paper. Download Markdown from `/whitepaper.md`. Export a packet from the receipt view; paste it on **Verify**. Dropped files are not uploaded.

## White paper

The founder-review draft is the in-app [white paper](/whitepaper) and [`WHITEPAPER.md`](./WHITEPAPER.md). It is a specification, not a clinical validation, legal opinion, or MIRRA release.

## Host it yourself (GitHub → Vercel)

This is the intended public home: a repository you own, a Vercel project you own, a domain you own.

1. This tree is at [Mitosis50/trialwatch](https://github.com/Mitosis50/trialwatch).
2. In Vercel: **Add New Project** → import that repo.
3. Framework: leave unset (Nitro already emits Vercel’s build output).
4. Build command: `npm run build` (already in `vercel.json`).
5. Set `VITE_AUTH_ENABLED=false`. This explorer has no accounts and must not grow a database of people.
6. Deploy.

Node 22. Auth stays off. Database stays off.

## Doctrine

1. Make the path from a claim to its evidence inspectable.
2. Make changes to that path visible.
3. Process completion is not medical truth.
4. Private patients stay off the public record.
5. Policies are frozen; a change is a new version.
6. Independent verification is free.

Maintenance rules: [`AGENTS.project.md`](AGENTS.project.md).

## License

Apache License 2.0. See [`LICENSE`](LICENSE) and [`NOTICE`](NOTICE).
