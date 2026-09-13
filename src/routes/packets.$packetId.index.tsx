import { createFileRoute, Link } from "@tanstack/react-router";
import { StatusStack } from "@/components/mec/status";
import { NonAssertions } from "@/components/mec/non-assertions";
import { currentVersion, getPacket } from "@/lib/mec/fixtures";
import { formatStamp } from "@/lib/mec/format";
import { overlayPacket, useLocalReviews } from "@/lib/mec/local-review";

export const Route = createFileRoute("/packets/$packetId/")({ component: PacketOverview });

function PacketOverview() {
  const { packetId } = Route.useParams();
  const found = getPacket(packetId);
  const draft = useLocalReviews((s) => s.drafts[packetId]);
  if (!found) return null;
  const packet = overlayPacket(found, draft);
  const v = currentVersion(packet);

  return (
    <>
      <p className="rounded-lg bg-secondary px-3 py-2 text-sm text-muted-foreground">{packet.fixturePurpose}</p>

      <StatusStack version={v} className="mt-6" />

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <article className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)] lg:col-span-2">
          <h2 className="font-display text-xl tracking-tight">Reported result, as extracted</h2>
          <p className="mt-3 leading-relaxed">{v.claim.attributedStatement}</p>
          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            <Fact k="Population" v={v.claim.population} />
            <Fact k="Intervention" v={v.claim.intervention} />
            <Fact k="Comparator" v={v.claim.comparator} />
            <Fact k="Outcome" v={v.claim.outcome} />
            <Fact k="Timeframe" v={v.claim.timeframe} />
            <Fact k="Analysis population" v={v.claim.analysisPopulation} />
            <Fact k="Designation" v={v.claim.designation} />
            <Fact k="Effect" v={`${v.claim.effectMeasure}; ${v.claim.uncertainty}`} />
          </dl>
          <p className="mt-4 text-sm text-muted-foreground">
            Last published {formatStamp(v.publishedAt)}. Version {v.version} of {packet.versions.length}.
          </p>
        </article>
        <div className="grid gap-4">
          <article className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
            <h2 className="font-display text-lg tracking-tight">Study</h2>
            <dl className="mt-3 grid gap-2 text-sm">
              <Fact k="Registry" v={packet.study.registryId} />
              <Fact k="Design" v={packet.study.design} />
              <Fact k="Sponsor" v={packet.study.sponsor} />
              <Fact k="Enrollment" v={packet.study.enrollment} />
              <Fact k="Status" v={packet.study.status} />
            </dl>
          </article>
          <article className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
            <h2 className="font-display text-lg tracking-tight">Open a layer</h2>
            <ul className="mt-3 grid gap-2 text-sm">
              <li>
                <Link className="text-primary hover:underline" to="/packets/$packetId/claim" params={{ packetId }}>
                  Claim and source locators
                </Link>
              </li>
              <li>
                <Link className="text-primary hover:underline" to="/packets/$packetId/review" params={{ packetId }}>
                  Two-person review workspace
                </Link>
              </li>
              <li>
                <Link className="text-primary hover:underline" to="/packets/$packetId/receipt" params={{ packetId }}>
                  Draft receipt and non-assertions
                </Link>
              </li>
              <li>
                <Link className="text-primary hover:underline" to="/packets/$packetId/history" params={{ packetId }}>
                  Correction history
                </Link>
              </li>
            </ul>
          </article>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl tracking-tight">Sources</h2>
        <ul className="mt-3 grid gap-3">
          {packet.sources.map((s) => (
            <li key={s.id} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
              <p className="text-label uppercase tracking-label text-muted-foreground">
                {s.kind} · {s.provenance}
              </p>
              <p className="mt-1 font-medium">{s.title}</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{s.originalUrl}</p>
              <p className="mt-2 text-sm text-muted-foreground">{s.rightsBasis}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
        <h2 className="font-display text-xl tracking-tight">Limitations</h2>
        <p className="mt-3 leading-relaxed">{packet.limitations}</p>
        <p className="mt-3 text-sm text-muted-foreground">{v.scientificNote}</p>
      </section>

      <div className="mt-8">
        <NonAssertions compact />
      </div>
    </>
  );
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-label uppercase tracking-label text-muted-foreground">{k}</dt>
      <dd className="mt-1 text-sm leading-snug">{v}</dd>
    </div>
  );
}
