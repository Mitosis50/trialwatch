import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NonAssertions } from "@/components/mec/non-assertions";
import { latestCorrections, PACKETS } from "@/lib/mec/fixtures";
import { formatStamp } from "@/lib/mec/format";
import { currentVersion } from "@/lib/mec/fixtures";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const corrections = latestCorrections();
  const complete = PACKETS.filter((p) => currentVersion(p).result === "COMPLETE").length;

  return (
    <main>
      <section className="border-b border-foreground/80">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="text-label uppercase tracking-label text-muted-foreground">
            Folio A · 13 September 2026 · Release A synthetic prototype
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight tracking-display sm:text-5xl">
            A shared medical evidence library with accountable review and a visible correction history.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            TrialWatch is the first collection of the Medical Evidence Commons. It organizes a
            bounded claim, the source version behind it, the review steps that were actually done,
            and every later challenge — without pretending that inclusion makes a statement true.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/collection">
                Open the Glucoril collection
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/methods">Read the rules</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/whitepaper">White paper</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="font-display text-2xl tracking-tight">What a packet answers</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            "What exactly was claimed, for which population, outcome, and time period?",
            "Which source version supports that statement, and where in the document?",
            "What did the trial plan say before results became available?",
            "What uncertainties, limitations, and disagreements remain?",
            "Which review steps were completed, by whom, under which published rules?",
            "Has anything been challenged, corrected, superseded, or retracted?",
          ].map((q, i) => (
            <li key={q} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
              <p className="font-mono text-label text-muted-foreground">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-2 leading-snug">{q}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-border bg-secondary/50">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-3 sm:px-6">
          <Stat label="Synthetic packets" value={String(PACKETS.length)} hint="Fictional fixtures, including fail paths" />
          <Stat label="Process-complete" value={String(complete)} hint="Not a count of effective treatments" />
          <Stat label="Visible corrections" value={String(corrections.length)} hint="Superseded artifacts stay inspectable" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="font-display text-2xl tracking-tight">Four separate statuses</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          TrialWatch never collapses these into one unlabeled VERIFIED badge.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Review process", "Specified steps were evidenced under a frozen policy."],
            ["Scientific assessment", "Disagreement can remain after a complete process."],
            ["Artifact integrity", "The bytes match their digest and any supplied seal."],
            ["Currency", "A later correction may exist. Offline checks cannot rule that out."],
          ].map(([title, body]) => (
            <article key={title} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
              <h3 className="font-display text-lg tracking-tight">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-2xl tracking-tight">Newest corrections</h2>
          <Link to="/collection" className="text-sm text-primary hover:underline">
            All packets
          </Link>
        </div>
        {corrections.length === 0 ? (
          <p className="mt-4 text-muted-foreground">No upheld challenges in this fixture set.</p>
        ) : (
          <ul className="mt-4 grid gap-3">
            {corrections.map((c) => (
              <li key={c.challengeId} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
                <p className="text-label uppercase tracking-label text-muted-foreground">
                  {formatStamp(c.at)} · {c.challengeId} · {c.packet.study.acronym}
                </p>
                <p className="mt-2 text-sm leading-relaxed">{c.note}</p>
                <Link
                  to="/packets/$packetId/history"
                  params={{ packetId: c.packet.id }}
                  className="mt-3 inline-flex text-sm text-primary hover:underline"
                >
                  Compare versions
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <NonAssertions />
        <p className="mt-6 max-w-2xl text-sm text-muted-foreground">
          MIRRA forecasting and an Internet Computer registry are out of scope for this prototype.
          The Commons remains useful without them.
        </p>
      </section>
    </main>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div>
      <p className="text-label uppercase tracking-label text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-4xl tabular-nums tracking-tight">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}
