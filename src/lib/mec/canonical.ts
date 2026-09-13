/** Canonical JSON for content digests. Sorted keys, no whitespace, UTF-8. */
export function canonicalize(value: unknown): string {
  return write(value);
}

function write(value: unknown): string {
  if (value === null) return "null";
  const t = typeof value;
  if (t === "boolean") return value ? "true" : "false";
  if (t === "number") {
    if (!Number.isFinite(value)) throw new Error("canonicalize: non-finite number");
    if (Object.is(value, -0)) return "0";
    return JSON.stringify(value);
  }
  if (t === "string") return JSON.stringify(value);
  if (t === "undefined") throw new Error("canonicalize: undefined");
  if (Array.isArray(value)) {
    return `[${value.map(write).join(",")}]`;
  }
  if (t === "object") {
    const obj = value as Record<string, unknown>;
    if (Object.getPrototypeOf(obj) !== Object.prototype && Object.getPrototypeOf(obj) !== null) {
      throw new Error("canonicalize: only plain objects");
    }
    const keys = Object.keys(obj).sort();
    const parts: string[] = [];
    for (const key of keys) {
      const v = obj[key];
      if (v === undefined) continue;
      parts.push(`${JSON.stringify(key)}:${write(v)}`);
    }
    return `{${parts.join(",")}}`;
  }
  throw new Error(`canonicalize: unsupported type ${t}`);
}
