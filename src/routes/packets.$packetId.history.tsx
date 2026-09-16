import { createFileRoute } from "@tanstack/react-router";
import { Badge, resultTone } from "@/components/ui/badge";
import { getPacket } from "@/lib/mec/issued";
import { formatStamp, processLabel } from "@/lib/mec/format";
import { shortDigest } from "@/lib/mec/digest";

export const Route = createFileRoute("/packets/$packetId/history")({ component: HistoryPage });

function HistoryPage() {
  const { packetId } = Route.useParams();
  const packet = getPacket(packetId);
  if (!packet) return null;

  const current = packet.versions.find((v) => v.version === packet.currentVersion);
  const previous = packet.versions.filter((v) => v.version !== packet.currentVersion);

  return (
    <>
      <h2 className="font-display text-2xl tracking-tight">Correction history</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        A superseded artifact can still be authentic. Current evidentiary status is a different question
        from whether the old bytes match their digest.
      </p>

      {packet.challenges.length === 0 && packet.versions.length === 1 ? (
        <p className="mt-6 rounded-xl bg-card p-5 text-sm shadow-[var(--shadow-border)]">
          No challenge or supersession is on file for this packet. Version 1 is current.
        </p>
      ) : null}

      {packet.challenges.length > 0 ? (
        <section className="mt-8">
          <h3 className="font-display text-xl tracking-tight">Challenges</h3>
          <ol className="mt-4 grid gap-3">
            {packet.challenges.map((c) => (
              <li key={c.id} className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
                <p className="text-label uppercase tracking-label text-muted-foreground">
                  {c.id} · filed {formatStamp(c.filedAt)} · against v{c.targetVersion}
                </p>
                <p className="mt-2">{c.reason}</p>
                <p className="mt-2 font-mono text-xs text-muted-foreground">{c.evidenceLocator}</p>
                <p className="mt-3 text-sm">
                  Disposition: <span className="font-medium">{c.disposition.replaceAll("_", " ")}</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{c.dispositionNote}</p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {packet.versions.length > 1 && current && previous[0] ? (
        <section className="mt-8">
          <h3 className="font-display text-xl tracking-tight">Version comparison</h3>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <VersionCard
              title={`v${previous[0].version} · original`}
              statement={previous[0].claim.attributedStatement}
              denominator={previous[0].claim.denominator}
              locator={previous[0].claim.links[0]?.locator ?? "—"}
              digest={shortDigest(previous[0].envelope.receipt_digest)}
              result={previous[0].result}
              published={previous[0].publishedAt}
              currency="Historical artifact. Digest still matches the original bytes."
            />
            <VersionCard
              title={`v${current.version} · current`}
              statement={current.claim.attributedStatement}
              denominator={current.claim.denominator}
              locator={current.claim.links[0]?.locator ?? "—"}
              digest={shortDigest(current.envelope.receipt_digest)}
              result={current.result}
              published={current.publishedAt}
              currency="Current packet version. Points at the predecessor instead of erasing it."
            />
          </div>
        </section>
      ) : (
        <section className="mt-8 grid gap-3">
          {packet.versions.map((v) => (
            <article key={v.version} className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-lg">Version {v.version}</h3>
                <Badge tone={resultTone(v.result)}>{processLabel(v.result)}</Badge>
              </div>
              <p className="mt-2 text-sm">{v.summary}</p>
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                {formatStamp(v.publishedAt)} · {shortDigest(v.envelope.receipt_digest)}
              </p>
            </article>
          ))}
        </section>
      )}
    </>
  );
}

function VersionCard({
  title,
  statement,
  denominator,
  locator,
  digest,
  result,
  published,
  currency,
}: {
  title: string;
  statement: string;
  denominator: string;
  locator: string;
  digest: string;
  result: "COMPLETE" | "INCOMPLETE" | "BLOCKED";
  published: string;
  currency: string;
}) {
  return (
    <article className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
      <div className="flex flex-wrap items-center gap-2">
        <h4 className="font-display text-lg tracking-tight">{title}</h4>
        <Badge tone={resultTone(result)}>{result}</Badge>
      </div>
      <p className="mt-3 text-sm leading-relaxed">{statement}</p>
      <dl className="mt-4 grid gap-2 text-sm">
        <div>
          <dt className="text-label uppercase tracking-label text-muted-foreground">Denominator</dt>
          <dd className="font-mono text-xs">{denominator}</dd>
        </div>
        <div>
          <dt className="text-label uppercase tracking-label text-muted-foreground">Locator</dt>
          <dd className="font-mono text-xs">{locator}</dd>
        </div>
        <div>
          <dt className="text-label uppercase tracking-label text-muted-foreground">Receipt digest</dt>
          <dd className="font-mono text-xs">{digest}</dd>
        </div>
        <div>
          <dt className="text-label uppercase tracking-label text-muted-foreground">Published</dt>
          <dd>{formatStamp(published)}</dd>
        </div>
      </dl>
      <p className="mt-3 text-sm text-muted-foreground">{currency}</p>
    </article>
  );
}
