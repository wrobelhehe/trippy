import { randomBytes, createHash, timingSafeEqual } from "node:crypto";

export function generateShareToken() {
  return randomBytes(32).toString("hex");
}

export function hashShareToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function compareShareToken(token: string, hash: string) {
  const tokenHash = hashShareToken(token);
  const tokenBuffer = Buffer.from(tokenHash, "hex");
  const hashBuffer = Buffer.from(hash, "hex");

  if (tokenBuffer.length !== hashBuffer.length) {
    return false;
  }

  return timingSafeEqual(tokenBuffer, hashBuffer);
}