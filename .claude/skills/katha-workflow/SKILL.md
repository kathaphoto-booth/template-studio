---
name: katha-workflow
description: The master 5-step operational protocol for executing features and maintaining clear, on-topic communication. Use this to structure how work is accomplished.
---

# The Katha Operational Workflow

To ensure a cleaner, smoother workflow and prevent off-topic drift, every major feature request or architectural change must pass through this strict 5-step pipeline.

## 1. Brainstorming (Research & Discovery)
- **Action:** Before writing any code, thoroughly investigate the request. Read the relevant files (`DESIGN_SYSTEM.v2.md`, `CLAUDE.md`, existing components).
- **Goal:** Understand the brand constraints and identify potential friction points (e.g., WCAG accessibility, touch targets, Wabi-Sabi aesthetic conflicts).
- **Communication:** Present findings clearly without making unauthorized file modifications.

## 2. Write Spec (Implementation Plan)
- **Action:** Draft a strict Implementation Plan (e.g., `implementation_plan.md`).
- **Goal:** Outline exact file paths, the required layout changes, and which specific Katha skills will be invoked.
- **Communication:** Stop and request explicit approval from the Lead Architect (Jed) before proceeding.

## 3. Write Skills (Tooling & Enforcement)
- **Action:** If the new feature requires ongoing validation (like enforcing a new SVG pattern or a layout law), write a custom `.md` skill in `.claude/skills/` BEFORE executing the core feature.
- **Goal:** Ensure the feature is policed natively moving forward (e.g., `loom-auditor`, `brass-ring-enforcer`).

## 4. Execute Plans (Implementation & Guard)
- **Action:** Execute the approved spec.
- **Goal:** Write the code, ensuring strict adherence to the spec.
- **Validation:** Immediately run the `katha-impeccable` suite (`npm run guard`) to validate the work. Never present un-guarded code.
- **Auto-Save Checkpoint:** The absolute millisecond your code passes the `katha-verify` validation, you MUST push a micro-update to the Memory MCP Server (e.g., `[TECH_DEBT]` cleared, or `[BRAND_CANON]` updated). Never wait until the end of the session to save state. This prevents data loss from abrupt token crashes.

## 5. Enhance Prompts (Walkthrough & Reflection)
- **Action:** Create or update the `walkthrough.md`.
- **Goal:** Document what was done, how the new features interact with the brand guidelines, and update any system prompts or instructions to reflect the new state.
- **Communication:** Present a concise summary of the finished work, maintaining focus strictly on the Katha context.
