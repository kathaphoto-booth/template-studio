---
name: katha-verify
description: Enforces the "evidence-before-claims" verification protocol from the obra/superpowers framework. Use this to prove that code works before claiming a task is complete.
---

# Katha Verification-Before-Completion

Adapted from the `obra/superpowers` framework, this skill strictly outlaws AI assumptions. You are forbidden from claiming a feature "should work," "looks good," or "seems correct." You must provide mathematical or terminal evidence.

## The Evidence-Before-Claims Protocol

Before concluding Step 4 (Execute Plans) of the `katha-workflow`, you must execute this loop:

### 1. Identify the Proof
Determine which exact command or script will mathematically prove the code works. For Katha Booth, this is usually:
- `npm run build` (to prove Next.js static generation succeeds).
- `npm run guard` (to prove the Wabi-Sabi aesthetic and hex codes are clean).
- A specific Impeccable audit (e.g., `/a11y-audit`) for UI contrast.

### 2. Execute Fresh
Run the command in the terminal. Do not rely on past runs. Do not assume that changing one CSS class didn't break the build.

### 3. Verify the Output
Read the full output and the exit code. Did `guard` throw a P1 drift warning? Did `build` fail on a missing import?

### 4. Report the Evidence
When presenting the result to the user, you must cite the evidence.
- **BAD:** "I updated the padding, it looks good to go!"
- **GOOD:** "Padding updated to `py-3`. I ran `npm run build` and it compiled successfully in 14s. I ran `/a11y-audit` and touch targets now measure 48px, passing WCAG AA."

## Red Flags (Do Not Say These)
If you find yourself generating the following phrases, **STOP**, erase your response, and run the verification loop:
- *"This should fix the issue..."*
- *"Assuming the Vercel env is correct..."*
- *"I've made the changes, everything looks good."*
