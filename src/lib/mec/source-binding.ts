import {
  tamperSnapshotKeepManifest,
  tamperSourceBinding,
  verifyExport,
  type PacketExport,
  type VerifyReport,
} from "./verifier";

export { tamperSnapshotKeepManifest, tamperSourceBinding };

/** Same complete verifier used by /verify and the receipt page. */
export async function bindSources(exp: PacketExport, _base?: VerifyReport): Promise<VerifyReport> {
  return verifyExport(exp);
}
