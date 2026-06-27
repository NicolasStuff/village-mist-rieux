import crypto from "node:crypto";

export function createToken(): string {
  return `${crypto.randomUUID()}.${crypto.randomBytes(24).toString("base64url")}`;
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function timingSafeEqualText(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);

  if (a.length !== b.length) {
    return false;
  }

  return crypto.timingSafeEqual(a, b);
}

export function validateToken(rawToken: string, storedHash: string): boolean {
  return timingSafeEqualText(hashToken(rawToken), storedHash);
}
