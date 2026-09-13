/** Published demonstration key. Anyone with this bundle can produce a matching signature. */
export const DEMO_PRIVATE_JWK = {
  crv: "Ed25519",
  d: "qesfSivccL9bR__G3OsXqpTVgSOQh8nk5zfuHSuZ41E",
  x: "9WIz6xmyCdi6W5PWVzAkzfGaaNsrFLi63Jzbe81_qdQ",
  kty: "OKP",
} as const;

export const DEMO_PUBLIC_JWK = {
  crv: "Ed25519",
  x: "9WIz6xmyCdi6W5PWVzAkzfGaaNsrFLi63Jzbe81_qdQ",
  kty: "OKP",
} as const;

/** Production trust allowlist for Release A is empty on purpose. */
export const PRODUCTION_TRUSTED_KEY_IDS: readonly string[] = [];

export const DEMO_SIGNING_PROFILE = "mec.demo.ed25519-jws/0.1.0-draft";
