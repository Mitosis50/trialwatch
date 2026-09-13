import { createFileRoute } from "@tanstack/react-router";
import { currentVersion, getPacket } from "@/lib/mec/fixtures";
import { overlayPacket, useLocalReviews } from "@/lib/mec/local-review";

export const Route = createFileRoute("/packets/$packetId/claim")({ component: ClaimPage });

function ClaimPage() {
  const { packetId } = Route.useParams();
  const found = getPacket(packetId);
  const draft = useLocalReviews((s) => s.drafts[packetId]);
  if (!found) return null;
  const packet = overlayPacket(found, draft);
  const v = currentVersion(packet);
  const claim = v.claim;

  return (
    <>
      <p className="text-label uppercase tracking-label text-muted-foreground">{claim.id}</p>
      <h2 className="mt-1 font-display text-2xl tracking-tight">Bounded claim</h2>
      <p className="mt-3 max-w-3xl leading-relaxed">{claim.attributedStatement}</p>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        <Box k="Population" v={claim.population} />
        <Box k="Intervention" v={claim.intervention} />
        <Box k="Comparator" v={claim.comparator} />
        <Box k="Outcome" v={claim.outcome} />
        <Box k="Timeframe" v={claim.timeframe} />
        <Box k="Analysis population" v={claim.analysisPopulation} />
        <Box k="Numerator" v={claim.numerator} />
        <Box k="Denominator" v={claim.denominator} />
        <Box k="Effect measure" v={claim.effectMeasure} />
        <Box k="Uncertainty" v={claim.uncertainty} />
        <Box k="Designation" v={claim.designation} />
        <Box
          k="Prespecified / patient-important"
          v={`${claim.isPrespecified ? "Prespecified" : "Not claimed as prespecified"} · ${claim.isPatientImportant ? "treated as patient-important" : "surrogate or not classified"}`}
        />
      </dl>

      <section className="mt-10">
        <h3 className="font-display text-xl tracking-tight">Evidence links</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Supports, contradicts, and contextualizes are distinct. A source observation can accurately
          describe an inaccurate paper.
        </p>
        <ul className="mt-4 grid gap-3">
          {claim.links.map((link, i) => {
            const source = packet.sources.find((s) => s.id === link.sourceVersionId);
            return (
              <li key={`${link.sourceVersionId}-${i}`} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
                <p className="text-label uppercase tracking-label text-muted-foreground">
                  {link.relation} · {link.extractionMethod.replaceAll("_", " ")}
                </p>
                <p className="mt-1 font-medium">{source?.title ?? link.sourceVersionId}</p>
                <p className="mt-1 font-mono text-xs">{link.locator}</p>
                {source ? (
                  <pre className="mt-3 overflow-x-auto rounded-lg bg-secondary p-3 font-mono text-xs leading-relaxed">
                    {source.excerptTitle}
                    {"\n"}
                    {source.excerpt}
                  </pre>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-10 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
        <h3 className="font-display text-xl tracking-tight">Unresolved limitations</h3>
        <p className="mt-3 leading-relaxed">{packet.limitations}</p>
        <p className="mt-3 text-sm text-muted-foreground">{v.scientificNote}</p>
      </section>
    </>
  );
}

function Box({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
      <dt className="text-label uppercase tracking-label text-muted-foreground">{k}</dt>
      <dd className="mt-2 text-sm leading-snug">{v}</dd>
    </div>
  );
}
