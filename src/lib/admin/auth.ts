import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "admin-session";

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set");
  return secret;
}

function hmacSign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function createSessionToken(): string {
  const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const payload = `admin:${expires}`;
  const sig = hmacSign(payload);
  return `${payload}:${sig}`;
}

export function verifySessionToken(token: string): boolean {
  const parts = token.split(":");
  if (parts.length !== 3) return false;

  const [prefix, expiresStr, sig] = parts;
  if (prefix !== "admin") return false;

  const expires = parseInt(expiresStr, 10);
  if (isNaN(expires) || Date.now() > expires) return false;

  const expectedSig = hmacSign(`${prefix}:${expiresStr}`);
  try {
    return timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expectedSig, "hex"));
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return false;
    return verifySessionToken(token);
  } catch {
    return false;
  }
}

export { COOKIE_NAME };
