import { createFileRoute } from "@tanstack/react-router";
import { Badge, resultTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { RuleList } from "@/components/mec/rules";
import { currentVersion, getPacket } from "@/lib/mec/fixtures";
import { CRITICAL_FIELD_KEYS, CRITICAL_FIELD_LABELS, type CriticalFieldKey } from "@/lib/mec/types";
import { overlayPacket, useLocalReviews } from "@/lib/mec/local-review";
import { processLabel } from "@/lib/mec/format";

export const Route = createFileRoute("/packets/$packetId/review")({ component: ReviewPage });

function ReviewPage() {
  const { packetId } = Route.useParams();
  const found = getPacket(packetId);
  const draft = useLocalReviews((s) => s.drafts[packetId]);
  const setField = useLocalReviews((s) => s.setField);
  const setNote = useLocalReviews((s) => s.setNote);
  const signOff = useLocalReviews((s) => s.signOff);
  const reset = useLocalReviews((s) => s.reset);

  if (!found) return null;
  const packet = overlayPacket(found, draft);
  const v = currentVersion(packet);
  const editable = packet.allowLocalSecondReview;
  const allFilled = CRITICAL_FIELD_KEYS.every((k) => {
    const f = v.fieldChecks.find((x) => x.key === k);
    return f && f.reviewerB !== null && f.reviewerB.trim() !== "";
  });

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl tracking-tight">Two-person review</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {packet.methodNote} Method version {packet.methodVersion}.
          </p>
        </div>
        <Badge tone={resultTone(v.result)}>{processLabel(v.result)}</Badge>
      </div>

      {editable ? (
        <p className="mt-4 rounded-lg bg-secondary px-3 py-2 text-sm">
          This fixture is missing a second review. Fill the checker column against the source, document
          any disagreement, then sign a local draft. It is not published and not a production receipt.
        </p>
      ) : null}

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        {packet.sources.map((s) => (
          <article key={s.id} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
            <p className="text-label uppercase tracking-label text-muted-foreground">{s.excerptTitle}</p>
            <pre className="mt-3 overflow-x-auto font-mono text-xs leading-relaxed">{s.excerpt}</pre>
          </article>
        ))}
      </section>

      <section className="mt-8 overflow-x-auto rounded-xl bg-card shadow-[var(--shadow-border)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-label uppercase tracking-label text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Critical field</th>
              <th className="px-4 py-3 font-medium">Extractor</th>
              <th className="px-4 py-3 font-medium">Checker</th>
              <th className="px-4 py-3 font-medium">Disposition</th>
            </tr>
          </thead>
          <tbody>
            {v.fieldChecks.map((f) => {
              const match =
                f.reviewerB !== null && f.reviewerA.trim() === f.reviewerB.trim() && !f.hiddenDisagreement;
              const missing = f.reviewerB === null || f.reviewerB.trim() === "";
              return (
                <tr key={f.key} className="border-b border-border/70 align-top last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium">{CRITICAL_FIELD_LABELS[f.key]}</p>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">{f.sourceLocator}</p>
                  </td>
                  <td className="px-4 py-3 text-sm">{f.reviewerA}</td>
                  <td className="px-4 py-3">
                    {editable ? (
                      <Input
                        value={draft?.values[f.key] ?? f.reviewerB ?? ""}
                        placeholder={f.reviewerA}
                        onChange={(e) => setField(packet.id, f.key, e.target.value)}
                        aria-label={`Checker value for ${CRITICAL_FIELD_LABELS[f.key]}`}
                      />
                    ) : (
                      <span>{f.reviewerB ?? "Not on file"}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {f.hiddenDisagreement ? (
                      <p className="text-blocked">Hidden disagreement</p>
                    ) : missing ? (
                      <p className="text-incomplete">Second review missing</p>
                    ) : match ? (
                      <p className="text-complete">Agreed</p>
                    ) : (
                      <p className="text-incomplete">Disagreement documented</p>
                    )}
                    {editable && !match && !missing ? (
                      <Textarea
                        className="mt-2 min-h-16"
                        placeholder="Document the disagreement"
                        value={draft?.notes[f.key as CriticalFieldKey] ?? f.documentedDisagreement ?? ""}
                        onChange={(e) => setNote(packet.id, f.key, e.target.value)}
                      />
                    ) : f.documentedDisagreement ? (
                      <p className="mt-2 text-xs text-muted-foreground">{f.documentedDisagreement}</p>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        {packet.reviewers.map((r) => (
          <article key={r.key} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
            <p className="text-label uppercase tracking-label text-muted-foreground">
              {r.role} · {r.domain}
            </p>
            <p className="mt-1 font-medium">{r.attribution}</p>
            <p className="mt-2 text-sm text-muted-foreground">{r.conflictDisclosure}</p>
          </article>
        ))}
      </section>
      <p className="mt-3 text-sm text-muted-foreground">{packet.conflictNote}</p>

      {editable ? (
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            type="button"
            disabled={!allFilled}
            onClick={() => signOff(packet.id)}
          >
            Sign local draft as checker
          </Button>
          <Button type="button" variant="outline" onClick={() => reset(packet.id)}>
            Clear local draft
          </Button>
        </div>
      ) : null}

      <section className="mt-10">
        <h3 className="font-display text-xl tracking-tight">Policy evaluation</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Live result under MED-EVIDENCE-REVIEW@0.1.0-draft. {processLabel(v.result)}.
        </p>
        <div className="mt-4">
          <RuleList receipt={v.envelope.receipt} />
        </div>
      </section>
    </>
  );
}
