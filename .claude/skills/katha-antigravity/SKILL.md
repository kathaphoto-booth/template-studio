---
name: katha-antigravity
description: Wraps the google-antigravity-sdk with Katha-specific brand rules, vocabulary restrictions, and impeccable guard hooks. Use this whenever building or configuring AI agents for Katha Booth.
---

# Katha × Antigravity SDK

When utilizing the `google-antigravity-sdk` to build or orchestrate subagents, you MUST follow these Katha-specific directives. The generic SDK is powerful, but it must be constrained to protect the Wabi-Sabi aesthetic.

## 1. The Katha Context Wrapper
Whenever you define an agent's `system_prompt` or instruct an agent via the SDK, you must pre-inject the brand canon:
- Pass the **11-token Katha Palette** (Obsidian Weave, Piña Ecru, etc.).
- Enforce the **Two-Tier Rule**: The agent must understand the difference between Katha Signature (`katha-` prefix, Fraunces font) and Classic presets (exempt).

## 2. Built-in Impeccable Hooks
Do not rely on the frontend to catch AI hallucinations. Any Antigravity agent that outputs structured design data or templates MUST implement a `post_turn` or output validation hook:
- The hook should trigger `npm run guard:templates` (or an equivalent programmatic validation).
- If the agent outputs a forbidden hex code (e.g., legacy OAX gold `#bf9d2c`), the hook must intercept and reject it before it reaches the client canvas.

## 3. Strict Vocabulary Restriction
When writing agent instructions or Python scripts (e.g., `scripts/katha_design_agent.py`), explicitly forbid the agent from using technical SDK terminology in user-facing outputs.
- **FORBIDDEN**: "Agentic loop", "Alpha-Transparent Overlay", "Antigravity SDK", "automation pipeline".
- **REQUIRED**: Frame all generative actions as "handloomed artistry", "shimmering raw silk", or "heritage-dyed weaves."

## 4. Dual-Track Output Awareness
Ensure subagents know whether they are generating a high-fidelity SVG/PNG bundle for the Next.js Canvas (full physics) or a static Code Block snippet for Squarespace (CSS-only).
