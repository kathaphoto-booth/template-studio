import { redirect } from "next/navigation";

// The public front door IS the funnel. The old root storefront (masonry +
// totem sidebar) duplicated /gallery less well and sat behind the studio
// gate where no client could see it; consolidated per the ratified
// legacy-reserve → Vault Drawer decision (2026-07-06).
//
// Query params are forwarded: the entrance's QA handles (?entrance=replay,
// ?tempo=) read window.location.search on /gallery, so a bare redirect
// silently swallowed them when entered at the root (found 2026-07-15).
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") qs.set(key, value);
    else if (Array.isArray(value)) value.forEach((v) => qs.append(key, v));
  }
  const suffix = qs.size > 0 ? `?${qs.toString()}` : "";
  redirect(`/gallery${suffix}`);
}
