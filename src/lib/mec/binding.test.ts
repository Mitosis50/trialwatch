import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildExport, buildExportFromVersion } from "./export";
import { PACKETS } from "./issued";
import {
  tamperSnapshotKeepManifest,
  tamperSourceBinding,
  verifyExport,
  type PacketExport,
} from "./verifier";

function glide(): PacketExport {
  const packet = PACKETS.find((p) => p.study.acronym === "GLIDE-90");
  assert.ok(packet, "GLIDE-90 fixture missing");
  return buildExport(packet);
}

function resultOf(name: string, exp: Awaited<ReturnType<typeof verifyExport>>) {
  const row = exp.checks.find((c) => c.name === name);
  assert.ok(row, `${name} check absent`);
  return row.result;
}

function zeroFirstSourceRef(exp: PacketExport): PacketExport {
  return {
    ...exp,
    source_refs: exp.source_refs.map((r, i) =>
      i === 0 ? { ...r, bytes_digest: `sha256:${"0".repeat(64)}` } : r,
    ),
  };
}

describe("source binding against committed manifest", () => {
  it("untouched GLIDE-90 commitment and binding pass", async () => {
    const exp = glide();
    const report = await verifyExport(exp);
    assert.equal(resultOf("manifest_commitment", report), "PASS");
    assert.equal(resultOf("source_binding", report), "PASS");
    assert.equal(exp.manifest_commitment, exp.envelope.receipt.input_manifest_digest);
    const captured = (exp.snapshots ?? []).filter((s) => s.snapshot_status === "captured");
    assert.ok(captured.length >= 2, "GLIDE-90 must export captured protocol and results snapshots");
    const unavailable = (exp.snapshots ?? []).filter((s) => s.snapshot_status === "unavailable");
    assert.equal(unavailable.length, 0);
  });

  it("zeroed source-reference digest fails source_binding", async () => {
    const report = await verifyExport(zeroFirstSourceRef(glide()));
    assert.equal(resultOf("source_binding", report), "FAIL");
    assert.equal(resultOf("manifest_commitment", report), "PASS");
  });

  it("rewritten snapshot plus realigned hashes fails against manifest.sources", async () => {
    const report = await verifyExport(tamperSnapshotKeepManifest(glide()));
    assert.equal(resultOf("source_binding", report), "FAIL");
    assert.equal(resultOf("manifest_commitment", report), "PASS");
    assert.match(
      report.checks.find((c) => c.name === "source_binding")!.detail,
      /receipt-committed manifest digest/,
    );
  });

  it("altering snapshot bytes without touching the manifest fails source_binding", async () => {
    const report = await verifyExport(tamperSourceBinding(glide()));
    assert.equal(resultOf("source_binding", report), "FAIL");
  });

  it("export preserves the issued receipt digest and v2 lineage", () => {
    const packet = PACKETS.find((p) => p.study.acronym === "GLIDE-90");
    assert.ok(packet);
    const v1 = packet.versions.find((v) => v.version === 1);
    const v2 = packet.versions.find((v) => v.version === 2);
    assert.ok(v1 && v2);
    const exp1 = buildExportFromVersion(packet, v1);
    const exp2 = buildExportFromVersion(packet, v2);
    assert.equal(exp1.envelope.receipt_digest, v1.envelope.receipt_digest);
    assert.equal(exp2.envelope.receipt_digest, v2.envelope.receipt_digest);
    assert.equal(exp2.envelope.receipt.input_manifest_digest, v2.envelope.receipt.input_manifest_digest);
    assert.equal(exp2.envelope.receipt.supersedes_receipt_digest, v1.envelope.receipt_digest);
    assert.equal(exp2.ancestors.some((a) => a.receipt_digest === v1.envelope.receipt_digest), true);
  });
});
