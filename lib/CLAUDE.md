# Business Logic, Database & Presets Law

## Directory Scope
This directory houses Supabase clients, presets catalog, and layout validators.

## Architectural Guidelines
- **Supabase Client:** Defined in `lib/supabase.ts`. Interacts with tables `leads` and `selections`.
- **Presets Catalog:** Defined in `lib/templates.ts`. 
  - Contains exactly 62 template presets, 14 display fonts (`LUXURY_FONTS`), and 5 harmony palettes.
- **Measurement Law:** Layouts must conform to strict band-to-pedestal ratios. Validate using `npm run guard`.
