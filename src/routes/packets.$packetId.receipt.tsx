import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { NonAssertions } from "@/components/mec/non-assertions";
import { RuleList } from "@/components/mec/rules";
import { Badge, resultTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { currentVersion, getPacket } from "@/lib/mec/issued";
import { overlayPacket, useLocalReviews } from "@/lib/mec/local-review";
import { buildExport, buildSignedDemoExport, downloadJson } from "@/lib/mec/export";
import { parseExportJson, verifyExport, type VerifyReport } from "@/lib/mec/verifier";
import { shortDigest } from "@/lib/mec/digest";
import { formatStamp, processLabel } from "@/lib/mec/format";

export const Route = createFileRoute("/packets/$packetId/receipt")({ component: ReceiptPage });

function ReceiptPage() {
  const { packetId } = Route.useParams();
  const found = getPacket(packetId);
  const draft = useLocalReviews((s) => s.drafts[packetId]);
  const [report, setReport] = useState<VerifyReport | null>(null);
  const [busy, setBusy] = useState(false);

  if (!found) return null;
  const packet = overlayPacket(found, draft);
  const v = currentVersion(packet);
  const receipt = v.envelope.receipt;

  async function onDownload() {
    const exp = packet.usesDemoKey ? await buildSignedDemoExport(found!) : buildExport(packet);
    downloadJson(`${packet.study.acronym.toLowerCase()}-v${v.version}.mec.json`, exp);
  }

  async function onVerify() {
    setBusy(true);
    try {
      const exp = packet.usesDemoKey ? await buildSignedDemoExport(found!) : buildExport(packet);
      const parsed = parseExportJson(JSON.stringify(exp));
      if (!parsed.ok) return;
      setReport(await verifyExport(parsed.value));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <p className="rounded-lg bg-secondary px-3 py-2 text-sm">
        Commons draft receipt — not a PoF-compatible receipt. {receipt.notice}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Badge tone={resultTone(receipt.result)}>{processLabel(receipt.result)}</Badge>
        <span className="font-mono text-xs text-muted-foreground">{receipt.receipt_id}</span>
      </div>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <Meta k="Schema" v={`${receipt.record_type} / ${receipt.schema_version}`} />
        <Meta k="Policy" v={`${receipt.policy.id}@${receipt.policy.version}`} />
        <Meta k="Policy digest" v={shortDigest(receipt.policy.digest)} />
        <Meta k="Receipt digest" v={shortDigest(v.envelope.receipt_digest)} />
        <Meta k="Manifest digest" v={shortDigest(receipt.input_manifest_digest)} />
        <Meta k="Run digest" v={shortDigest(receipt.run_digest)} />
        <Meta k="Issuer key" v={receipt.issuer_key_id} />
        <Meta k="Issuer-claimed time" v={formatStamp(receipt.issuer_claimed_at)} />
        <Meta
          k="Seal"
          v={
            v.envelope.seal
              ? `${v.envelope.seal.signing_profile} (${v.envelope.seal.key_id})`
              : packet.usesDemoKey
                ? "Demo seal is attached at export/verify time"
                : "Explicitly unsigned"
          }
        />
        <Meta
          k="Predecessor"
          v={receipt.supersedes_receipt_digest ? shortDigest(receipt.supersedes_receipt_digest) : "None"}
        />
      </dl>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button type="button" onClick={onDownload}>
          Download .mec.json
        </Button>
        <Button type="button" variant="outline" disabled={busy} onClick={onVerify}>
          Verify locally
        </Button>
        <Button asChild variant="outline">
          <Link to="/verify">Open verifier</Link>
        </Button>
      </div>

      {report ? (
        <section className="mt-8">
          <h3 className="font-display text-xl tracking-tight">{report.overallLabel}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{report.overallHint}</p>
          <ul className="mt-4 grid gap-2">
            {report.checks.map((c) => (
              <li key={c.name} className="rounded-lg bg-card px-4 py-3 text-sm shadow-[var(--shadow-border)]">
                <span className="font-mono text-xs">{c.name}</span>
                <span className="mx-2 text-label uppercase tracking-label">{c.result}</span>
                <p className="mt-1 text-muted-foreground">{c.detail}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-10">
        <h3 className="font-display text-xl tracking-tight">Assertion results</h3>
        <div className="mt-4">
          <RuleList receipt={receipt} />
        </div>
      </section>

      <div className="mt-8">
        <NonAssertions />
      </div>
    </>
  );
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
      <dt className="text-label uppercase tracking-label text-muted-foreground">{k}</dt>
      <dd className="mt-2 break-all font-mono text-xs leading-relaxed">{v}</dd>
    </div>
  );
}
