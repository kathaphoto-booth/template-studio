# Handoff from Antigravity to Claude Code (CC)

**Objective**: Fix the critical visual overlap bug in the 6x4 landscape templates and address the hardcoded admin placeholders.

## Session 1: Layout & Placeholders
1. **The 6x4 Overlap Bug**: The `app/page.tsx` rendering engine hardcodes `cardWidth / 2` for the horizontal text placement on postcard formats. This breaks asymmetrical layouts (like `pc-L` and `pc-invL`), causing text to overlap the photo slots. **Fix**: Use `tz.x + tz.w / 2` for precise centering within the branding pedestal.
2. **Ghost Placeholders**: `app/page.tsx` initializes React state with `"Steven"` and `"Cristalyn"`. These bleed into the inputs, overriding accessible labels. **Fix**: Initialize to empty strings `""`.
3. **Template Mapping Error**: The gallery passes `preset=rose-whisper-postcard`, but the Admin Studio's `PRESETS` registry maps it as `wedding-white-rose`. **Fix**: Rename the IDs in `lib/templates.ts` to `rose-whisper` to sync the payloads.

## Session 2: Magic Resume Links & Hydration
**Objective**: Fix Next.js hydration issues caused by manual `<head>` injection and provide a frictionless Phase 1 to Phase 2 transition for beta testers (the girlfriend) via non-expiring links.

### Milestones & Fixes
1. **Hydration Mismatches**: Removed the manual `<head>` wrapper in `app/layout.tsx`. Next.js natively hoists the google fonts into the document head cleanly, passing all static optimization builds.
2. **Magic Resume Link**: (REVERTED due to errors). The gallery page was reverted to its original state.
3. **OAX Rule Violation Avoided**: An agent briefly attempted to use `oax-audit-monster` (an external MCP tool) to automate screenshot capture. This correctly triggered the pristine codebase alarm (No legacy oax tokens). The operation was immediately aborted. **Zero `oax` tokens or code entered the repository.** Native `chrome-devtools` is strictly enforced for future testing.

4. **Memory Saved**: The entire transcript of this session was exported to `chat_memory.jsonl` in the root directory for future reference.

**Directives for Claude Code**:
- The project is now stable.
- Maintain the pristine $10,000 standard.
- Do not introduce legacy tokens. Ensure all coordinates strictly honor the Wabi-Sabi aesthetic.
