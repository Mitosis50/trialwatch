import { canonicalize } from "./canonical";
import { sha256Hex } from "./sha256";

export type Digest = `sha256:${string}`;

const DIGEST_RE = /^sha256:[0-9a-f]{64}$/;

export function isDigest(value: string): value is Digest {
  return DIGEST_RE.test(value);
}

export function digestOf(value: unknown): Digest {
  return `sha256:${sha256Hex(canonicalize(value))}`;
}

export function digestOfText(text: string): Digest {
  return `sha256:${sha256Hex(text)}`;
}

export function shortDigest(digest: string): string {
  const hex = digest.startsWith("sha256:") ? digest.slice(7) : digest;
  return `${hex.slice(0, 8)}…${hex.slice(-4)}`;
}
