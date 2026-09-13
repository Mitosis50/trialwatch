import { CompactSign, compactVerify, importJWK } from "jose";
import { DEMO_ISSUER_KEY_ID } from "./types";
import { DEMO_PRIVATE_JWK, DEMO_PUBLIC_JWK, DEMO_SIGNING_PROFILE, PRODUCTION_TRUSTED_KEY_IDS } from "./keys";
import type { DetachedSeal, ReviewReceipt } from "./types";
import { canonicalize } from "./canonical";

export async function signDemoReceipt(receipt: ReviewReceipt): Promise<DetachedSeal> {
  const payload = new TextEncoder().encode(canonicalize(receipt));
  const key = await importJWK({ ...DEMO_PRIVATE_JWK }, "EdDSA");
  const jws = await new CompactSign(payload)
    .setProtectedHeader({ alg: "EdDSA", kid: DEMO_ISSUER_KEY_ID, profile: DEMO_SIGNING_PROFILE })
    .sign(key);
  return {
    signing_profile: DEMO_SIGNING_PROFILE,
    key_id: DEMO_ISSUER_KEY_ID,
    signature_encoding: "base64url",
    signature: jws,
  };
}

export async function verifyDemoSeal(
  receipt: ReviewReceipt,
  seal: DetachedSeal,
): Promise<{ mathValid: boolean; productionTrusted: boolean; detail: string }> {
  if (seal.signing_profile !== DEMO_SIGNING_PROFILE) {
    return {
      mathValid: false,
      productionTrusted: false,
      detail: "Unknown signing profile.",
    };
  }
  try {
    const key = await importJWK({ ...DEMO_PUBLIC_JWK }, "EdDSA");
    const { payload } = await compactVerify(seal.signature, key);
    const text = new TextDecoder().decode(payload);
    const mathValid = text === canonicalize(receipt);
    const productionTrusted = mathValid && PRODUCTION_TRUSTED_KEY_IDS.includes(seal.key_id);
    return {
      mathValid,
      productionTrusted,
      detail: !mathValid
        ? "Signature is valid over different bytes than this receipt."
        : productionTrusted
          ? "Signature is valid under a production-trusted key."
          : "Signature math is valid under the published demo key. Production issuer trust fails — this key ships in the prototype and cannot uniquely authenticate an issuer.",
    };
  } catch {
    return {
      mathValid: false,
      productionTrusted: false,
      detail: "Signature does not verify under the published demo public key.",
    };
  }
}
