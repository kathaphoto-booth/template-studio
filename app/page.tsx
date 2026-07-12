import { redirect } from "next/navigation";

// The public front door IS the funnel. The old root storefront (masonry +
// totem sidebar) duplicated /gallery less well and sat behind the studio
// gate where no client could see it; consolidated per the ratified
// legacy-reserve → Vault Drawer decision (2026-07-06).
export default function Home() {
  redirect("/gallery");
}
