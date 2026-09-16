import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { PACKETS } from "@/lib/mec/fixtures";
import { buildExport, buildSignedDemoExport } from "@/lib/mec/export";
import {
  parseExportJson,
  tamperNonAssertions,
  tamperPayload,
  tamperSourceBinding,
  verifyExport,
  type PacketExport,
  type VerifyReport,
} from "@/lib/mec/verifier";

export const Route = createFileRoute("/verify")({ component: VerifyPage });

function tone(result: string) {
  if (result === "PASS") return "complete" as const;
  if (result === "FAIL") return "blocked" as const;
  if (result === "UNKNOWN" || result === "UNAVAILABLE") return "incomplete" as const;
  return "neutral" as const;
}

function VerifyPage() {
  const [text, setText] = useState("");
  const [report, setReport] = useState<VerifyReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loadedId, setLoadedId] = useState<string | null>(null);

  const parsedPreview = useMemo(() => (text.trim() ? parseExportJson(text) : null), [text]);

  async function runOn(exp: PacketExport) {
    setBusy(true);
    setError(null);
    try {
      setReport(await verifyExport(exp));
    } finally {
      setBusy(false);
    }
  }

  async function loadPacket(id: string) {
    const packet = PACKETS.find((p) => p.id === id);
    if (!packet) return;
    const exp = packet.usesDemoKey ? await buildSignedDemoExport(packet) : buildExport(packet);
    const serialized = JSON.stringify(exp, null, 2);
    setText(serialized);
    setLoadedId(id);
    await runOn(exp);
  }

  async function onFile(file: File) {
    const raw = await file.text();
    setText(raw);
    setLoadedId(file.name);
    const parsed = parseExportJson(raw);
    if (!parsed.ok) {
      setError(parsed.error);
      setReport(null);
      return;
    }
    await runOn(parsed.value);
  }

  function applyTamper(kind: "digest" | "policy" | "source") {
    const parsed = parseExportJson(text);
    if (!parsed.ok) {
      setError(parsed.error);
      return;
    }
    const next =
      kind === "digest"
        ? tamperPayload(parsed.value)
        : kind === "source"
          ? tamperSourceBinding(parsed.value)
          : tamperNonAssertions(parsed.value);
    const serialized = JSON.stringify(next, null, 2);
    setText(serialized);
    void runOn(next);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-label uppercase tracking-label text-muted-foreground">Independent structural verifier</p>
      <h1 className="mt-2 font-display text-4xl tracking-tight">Verify a packet locally</h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
        Drop a <span className="font-mono text-sm">.mec.json</span> export or load a synthetic fixture.
        Verification runs in this browser. Files are not sent to a server. A passing integrity check is
        not a clinical conclusion, and this is not a Proof of Fulfillment verifier.
      </p>
      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <label className="text-label uppercase tracking-label text-muted-foreground" htmlFor="export">
            Export JSON
          </label>
          <Textarea
            id="export"
            className="mt-2 min-h-72 font-mono text-xs"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setReport(null);
            }}
            placeholder="Paste a Commons packet export…"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <label className="inline-flex h-11 cursor-pointer items-center rounded-md border border-border bg-card px-4 text-sm">
              Open file
              <input
                type="file"
                accept="application/json,.json,.mec.json"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void onFile(file);
                }}
              />
            </label>
            <Button
              type="button"
              disabled={busy || !text.trim()}
              onClick={() => {
                const parsed = parseExportJson(text);
                if (!parsed.ok) {
                  setError(parsed.error);
                  setReport(null);
                  return;
                }
                void runOn(parsed.value);
              }}
            >
              Verify
            </Button>
            <Button type="button" variant="outline" onClick={() => applyTamper("digest")}>
              Tamper payload
            </Button>
            <Button type="button" variant="outline" onClick={() => applyTamper("policy")}>
              Drop a non-assertion
            </Button>
            <Button type="button" variant="outline" onClick={() => applyTamper("source")}>
              Alter a source snapshot
            </Button>
          </div>
          {error ? <p className="mt-3 text-sm text-blocked">{error}</p> : null}
          {parsedPreview && !parsedPreview.ok ? (
            <p className="mt-3 text-sm text-incomplete">{parsedPreview.error}</p>
          ) : null}
        </div>
        <div>
          <p className="text-label uppercase tracking-label text-muted-foreground">Load a fixture</p>
          <ul className="mt-2 grid gap-2">
            {PACKETS.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg bg-card px-3 py-3 text-left text-sm shadow-[var(--shadow-border)]"
                  onClick={() => void loadPacket(p.id)}
                >
                  <span>
                    <span className="font-medium">{p.study.acronym}</span>
                    <span className="ml-2 text-muted-foreground">{p.fixtureTag}</span>
                  </span>
                  {loadedId === p.id ? <span className="text-label uppercase tracking-label">Loaded</span> : null}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>
      {report ? (
        <section className="mt-10">
          <h2 className="font-display text-2xl tracking-tight">{report.overallLabel}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{report.overallHint}</p>
          <p className="mt-1 text-sm text-muted-foreground">{report.notice}</p>
          <ul className="mt-6 grid gap-3">
            {report.checks.map((c) => (
              <li key={c.name} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono text-sm">{c.name}</p>
                  <Badge tone={tone(c.result)}>{c.result}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{c.detail}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
