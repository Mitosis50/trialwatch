import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge, resultTone } from "@/components/ui/badge";
import { NonAssertions } from "@/components/mec/non-assertions";
import { PACKETS, currentVersion, POLICY_DIGEST } from "@/lib/mec/fixtures";
import { POLICY_BODY } from "@/lib/mec/policy";
import { SHA256_ABC, sha256Hex } from "@/lib/mec/sha256";
import { shortDigest } from "@/lib/mec/digest";

export const Route = createFileRoute("/methods")({ component: MethodsPage });

const CHARTER = [
  "Public evidence access and independent verification remain free at ordinary human-use volumes.",
  "Scientific conclusions are not sold, voted into truth, or dictated by sponsors.",
  "Contributions carry source attribution and an accountable review trail.",
  "Material disagreement is represented fairly with its supporting evidence.",
  "Known errors are corrected visibly; appropriate corrections are not treated as reputational defeat.",
  "Policies, funding, conflicts, release status, and governance changes are inspectable.",
  "Users can export public packets and the verification information needed to interpret them.",
  "Private patients and personal medical decisions stay outside this prototype.",
];

function MethodsPage() {
  const digestOk = sha256Hex("abc") === SHA256_ABC;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-label uppercase tracking-label text-muted-foreground">Methods and governance</p>
      <h1 className="mt-2 font-display text-4xl tracking-tight">How this prototype is bounded</h1>
      <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
        Release A is a synthetic, local-first review product. There are no accounts, no live source
        adapters, no patient data, no payments, and no MIRRA dependency. Draft receipts live in the
        Commons namespace until a versioned Proof of Fulfillment extension is actually approved. The
        full specification is the{" "}
        <Link to="/whitepaper" className="text-primary hover:underline">
          TrialWatch white paper
        </Link>
        .
      </p>

      <section className="mt-10 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
        <h2 className="font-display text-2xl tracking-tight">
          {POLICY_BODY.id}@{POLICY_BODY.version}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">Frozen draft body digest {shortDigest(POLICY_DIGEST)}</p>
        <p className="mt-4">
          <span className="font-medium">Bounded obligation.</span> {POLICY_BODY.bounded_obligation}
        </p>
        <p className="mt-2">
          <span className="font-medium">Not the obligation.</span> {POLICY_BODY.not_the_obligation}
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Result order: BLOCKED if any rule is blocking; otherwise INCOMPLETE if any required assertion
          is missing; otherwise COMPLETE. There is no “partly medically true” result.
        </p>
      </section>

      <div className="mt-8">
        <NonAssertions />
      </div>

      <section className="mt-10">
        <h2 className="font-display text-2xl tracking-tight">Fixture suite</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Ten fictional packets cover the Release A acceptance branches. SHA-256(“abc”) self-check:{" "}
          {digestOk ? "pass" : "fail"}.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl bg-card shadow-[var(--shadow-border)]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-label uppercase tracking-label text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Packet</th>
                <th className="px-4 py-3 font-medium">Branch</th>
                <th className="px-4 py-3 font-medium">Process</th>
              </tr>
            </thead>
            <tbody>
              {PACKETS.map((p) => {
                const v = currentVersion(p);
                return (
                  <tr key={p.id} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-3">
                      <Link
                        to="/packets/$packetId"
                        params={{ packetId: p.id }}
                        className="text-primary hover:underline"
                      >
                        {p.study.acronym}
                      </Link>
                      <div className="font-mono text-xs text-muted-foreground">{p.id}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{p.fixturePurpose}</td>
                    <td className="px-4 py-3">
                      <Badge tone={resultTone(v.result)}>{v.result}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl tracking-tight">Charter</h2>
        <ol className="mt-4 grid gap-2">
          {CHARTER.map((line, i) => (
            <li key={line} className="rounded-lg bg-card px-4 py-3 text-sm shadow-[var(--shadow-border)]">
              <span className="mr-2 font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              {line}
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        <article className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
          <h2 className="font-display text-xl tracking-tight">What this is not</h2>
          <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
            <li>Not a patient-care product, CDS device, or emergency service.</li>
            <li>Not a ranking of clinicians, hospitals, or institutions.</li>
            <li>Not a token, wallet, escrow, or prediction market.</li>
            <li>Not a drop-in Proof of Fulfillment receipt. The namespace is separate.</li>
            <li>Not a MIRRA deployment. Forecasting remains off.</li>
          </ul>
        </article>
        <article className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
          <h2 className="font-display text-xl tracking-tight">Pilot roles</h2>
          <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
            <li>Product steward — scope and collection priorities, not scientific override.</li>
            <li>Methods lead — review protocol and critical-field definitions.</li>
            <li>Clinical-domain reviewer — outcome context within demonstrated competence.</li>
            <li>Second reviewer — independent checking; cannot adjudicate their own challenge alone.</li>
            <li>One person may wear several hats in a prototype; that overlap cannot satisfy independence.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
