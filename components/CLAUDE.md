# UI Components & Styling Law

## Directory Scope
This directory houses reusable visual components, layout frames, and aesthetic assets.

## Architectural Guidelines
- **Styling:** Vanilla CSS. Strict adherence to the 10 brand tokens + 2 ecru-safe text tokens defined in `globals.css` (e.g., Obsidian Weave, Piña Ecru, Loko Rust).
- **Icons:** Use `lucide-react` only. Do not introduce custom SVGs unless brand-specified.
- **Layout Principles (Wabi-Sabi):**
  - Fukinsei (asymmetry in layout frames, e.g., threadlines).
  - Ma (abundant negative space).
  - Sharp corners only (no `border-radius` on brand frames/images).
  - Single viewport CTA highlighted in Loko Rust `#8C382A`.
