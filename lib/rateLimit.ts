import { supabaseAdmin } from "@/lib/supabase";
import crypto from "crypto";

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  reset: string; // ISO timestamp string
};

/**
 * Hashes an IP address using SHA-256 for GDPR-compliant storage.
 */
export function hashIp(ip: string): string {
  return crypto.createHash("sha256").update(ip).digest("hex");
}

/**
 * Gets the client IP address from request headers.
 */
export function getClientIp(req: Request): string {
  const xForwardedFor = req.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const ips = xForwardedFor.split(",").map((ip) => ip.trim());
    if (ips[0]) return ips[0];
  }
  const xRealIp = req.headers.get("x-real-ip");
  if (xRealIp) return xRealIp;
  return "127.0.0.1";
}

/**
 * Checks if a key has exceeded its rate limit.
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  intervalSeconds: number
): Promise<RateLimitResult> {
  if (!supabaseAdmin) {
    // If database is not configured (local dev), default to allow
    return { success: true, remaining: limit, reset: new Date().toISOString() };
  }

  try {
    const { data, error } = await supabaseAdmin.rpc("check_rate_limit", {
      p_key: key,
      p_limit: limit,
      p_interval_seconds: intervalSeconds,
    });

    if (error) {
      console.error("[RateLimit] Database RPC error:", error);
      // Fail open in development, fail closed in production
      return {
        success: process.env.NODE_ENV !== "production",
        remaining: 0,
        reset: new Date().toISOString(),
      };
    }

    return {
      success: !!data?.success,
      remaining: typeof data?.remaining === "number" ? data.remaining : 0,
      reset: data?.reset || new Date().toISOString(),
    };
  } catch (err) {
    console.error("[RateLimit] Exception during check:", err);
    return {
      success: process.env.NODE_ENV !== "production",
      remaining: 0,
      reset: new Date().toISOString(),
    };
  }
}
