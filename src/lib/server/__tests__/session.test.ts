import { describe, expect, it } from "vitest";
import { createToken, hashToken, validateToken } from "@/lib/server/session";

describe("session tokens", () => {
  it("validates a token against its hash", () => {
    const token = createToken();
    expect(validateToken(token, hashToken(token))).toBe(true);
    expect(validateToken(`${token}x`, hashToken(token))).toBe(false);
  });
});
