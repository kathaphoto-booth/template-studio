# Handoff from Antigravity to Claude Code (CC)

**Objective**: Fix the critical visual overlap bug in the 6x4 landscape templates and address the hardcoded admin placeholders.

## The Micro-Errors Found
1. **The 6x4 Overlap Bug**: The `app/page.tsx` rendering engine hardcodes `cardWidth / 2` for the horizontal text placement on postcard formats. This breaks asymmetrical layouts (like `pc-L` and `pc-invL`), causing text to overlap the photo slots. **Fix**: Use `tz.x + tz.w / 2` for precise centering within the branding pedestal.
2. **Ghost Placeholders**: `app/page.tsx` initializes React state with `"Steven"` and `"Cristalyn"`. These bleed into the inputs, overriding accessible labels. **Fix**: Initialize to empty strings `""`.
3. **Template Mapping Error**: The gallery passes `preset=rose-whisper-postcard`, but the Admin Studio's `PRESETS` registry maps it as `wedding-white-rose`. **Fix**: Rename the IDs in `lib/templates.ts` to `rose-whisper` to sync the payloads.

**Directives for Claude Code**:
- Execute the exact implementation plan above.
- Maintain the pristine $10,000 standard.
- Do not introduce legacy tokens. Ensure all coordinates strictly honor the Wabi-Sabi aesthetic.
