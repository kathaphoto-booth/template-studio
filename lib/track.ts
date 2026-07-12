// First-party funnel beacon — zero third-party scripts, zero Google.
// Fire-and-forget: analytics must never block navigation, motion, or a
// submit. sendBeacon survives page unloads; fetch keepalive is the fallback.

export type FunnelEvent =
  | "gallery_view"
  | "date_check"
  | "date_held"
  | "browse_all"
  | "review_open"
  | "drawer_open"
  | "selection_submit";

export function track(
  event: FunnelEvent,
  opts: { leadHash?: string; meta?: Record<string, unknown> } = {}
): void {
  try {
    const payload = JSON.stringify({
      event,
      leadHash: opts.leadHash,
      meta: opts.meta,
    });
    const url = "/api/track";
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([payload], { type: "application/json" });
      if (navigator.sendBeacon(url, blob)) return;
    }
    void fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // A failed beacon is invisible by design.
  }
}
