# Business Logic, Database & Presets Law

## Directory Scope
This directory houses Supabase clients, presets catalog, and layout validators.

## Architectural Guidelines
- **Supabase Client:** Defined in `lib/supabase.ts`. Interacts with tables `leads` and `selections`.
- **Presets Catalog:** Defined in `lib/templates.ts`. 
  - Contains exactly 82 template presets (33 Katha Signature + 49 Classic), 14 display fonts (`LUXURY_FONTS`), and 5 harmony palettes.
  - Layout law (locked 2026-06-11): every layout has exactly 2, 3, or 4 slots; non-L-shape layouts must be horizontally symmetric. Enforced by `npm run guard`.
- **Measurement Law:** Layouts must conform to strict band-to-pedestal ratios. Validate using `npm run guard`.
