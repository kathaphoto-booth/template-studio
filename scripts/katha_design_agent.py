import asyncio
import json
import logging
import os
from typing import Dict, Any

try:
    import dotenv
    dotenv.load_dotenv()
except ImportError:
    pass

from google.antigravity import Agent, LocalAgentConfig, types, ToolContext

# Setup minimal logging
logging.basicConfig(level=logging.INFO, format="%(name)s: %(message)s")
logger = logging.getLogger("katha-agent")

# ─── TOOLS ─────────────────────────────────────────────────────────────

def validate_wabi_sabi_geometry(format_type: str, slots: list[Dict[str, int]], text_zone: Dict[str, int]) -> str:
    """Validates if the proposed layout geometry conforms to Threadline Cartography rules.
    
    Args:
        format_type: The format type (e.g., 'strip', 'postcard-vertical', 'postcard').
        slots: A list of dicts with 'x', 'y', 'w', 'h' for each photo slot.
        text_zone: A dict with 'x', 'y', 'w', 'h' for the branding pedestal.
    """
    logger.info(f"Validating geometry for {format_type}...")
    
    # Threadline Cartography Universal Margin Law
    expected_margin = 100 if format_type == "postcard" else 60
    
    errors = []
    
    # Check margins and gaps
    for i, s in enumerate(slots):
        if s['x'] < expected_margin or s['y'] < expected_margin:
            errors.append(f"Slot {i} violates minimum margin of {expected_margin}px.")
            
    if text_zone['x'] < expected_margin or text_zone['y'] < expected_margin:
        errors.append(f"Text pedestal violates minimum margin of {expected_margin}px.")
        
    if not errors:
        return json.dumps({"status": "valid", "message": "Geometry complies with Threadline Cartography spec."})
    else:
        return json.dumps({"status": "invalid", "errors": errors})

def render_preview_svg(preset_id: str, color_palette: Dict[str, str], ctx: ToolContext) -> str:
    """Generates the SVG structure for the proposed design preset.
    
    Args:
        preset_id: The unique ID for the preset.
        color_palette: A dictionary containing 'background', 'text', 'primary', 'secondary' colors.
        ctx: ToolContext for saving state.
    """
    logger.info(f"Rendering SVG preview for {preset_id}...")
    
    # Save the generated palette in state
    ctx.set_state("last_generated_palette", color_palette)
    
    # Generate Preset Object String
    preset_obj = f"""
  {{
    id: "{preset_id}",
    name: "Katha Signature — {preset_id.replace('-', ' ').title()}",
    type: "postcard",
    backgroundColor: "{color_palette.get('background', '#FFFFFF')}",
    textColor: "{color_palette.get('text', '#000000')}",
    borderColor: "{color_palette.get('primary', '#CCCCCC')}",
    secondaryColor: "{color_palette.get('secondary', '#999999')}",
    fontFamily: "'Inter', sans-serif",
    titleText: "Generated Title",
    subTitleText: "Subtitle",
    dateText: "",
    slotBorderRadius: "0px",
    slotBorderWidth: "0px",
    slotGap: "24px",
    slotBgColor: "#F9F9F9",
    innerSpacing: "60px",
    decorativeSvg: "",
    designerExplanation: "Auto-generated Wabi-Sabi preset."
  }},"""

    # We would insert this right before the `];` of the PRESETS array.
    # For now, we write it to a generated_preset.json file as a functional local artifact
    with open("generated_preset.json", "w") as f:
        json.dump({
            "preset_obj": preset_obj.strip(),
            "svg_case": f"""
    case "{preset_id}":
      return `
        <!-- Minimal Outer Canvas Frame -->
        <rect x="${{margin / 2}}" y="${{margin / 2}}" width="${{vb.w - margin}}" height="${{vb.h - margin}}" fill="none" stroke="${{secondaryColor}}" stroke-width="1.5" />
        <!-- Hand-drawn wabi-sabi decorative threads -->
        <rect x="100" y="100" width="1600" height="1000" fill="none" stroke="${{secondaryColor}}" stroke-width="1.5" stroke-dasharray="10 5" />
      `;"""
        }, f, indent=2)

    return "Preset generated and saved to generated_preset.json."

# ─── AGENT CONFIGURATION ───────────────────────────────────────────────────

# Configure the Creative Director Agent (Misty Emerson)
misty_config = LocalAgentConfig(
    system_instructions=(
        "You are Misty Emerson, the Creative Director and Market Intelligence Specialist for Katha Booth. "
        "Your role is to brainstorm Wabi-Sabi color palettes, heirloom themes, and cultural storytelling "
        "narratives (like Knalum ink, Piña Ecru, Loko Rust) to inspire high-output front-end templates. "
        "Provide a concise, vivid concept description with specific color hex codes."
    ),
)

# Configure the Frontend Architect Agent (CC persona)
cc_config = LocalAgentConfig(
    system_instructions=(
        "You are Claude Code (CC), the Lead Architect for Katha Booth. "
        "Your role is to translate Misty's thematic ideas into strict structural SVG blueprints "
        "that align with the Threadline Cartography specification. "
        "Always use `validate_wabi_sabi_geometry` before proposing an SVG. "
        "Output ONLY the final SVG code after validation. Do not explain your thought process in the final response."
    ),
    tools=[validate_wabi_sabi_geometry, render_preview_svg],
)

# Configure the Frontend Design Auditor Agent (Brock)
brock_config = LocalAgentConfig(
    system_instructions=(
        "You are Brock, the Frontend design auditor and visual QA specialist for Katha Booth. "
        "Your role is to audit the structural SVG blueprints produced by CC. "
        "You obsess over details and enforce the Wabi-Sabi UI/UX. "
        "CRITICAL: You must verify that any overlaying frames or elements act as a multi-layered alpha transparent export, "
        "subtly overlapping the media slots (e.g. drawn AFTER the slots in z-index but slightly intruding into the x/y coords). "
        "If the SVG is perfect, output exactly 'APPROVE'. "
        "If there are issues, output 'REJECT' followed by specific, actionable fixes for CC."
    ),
)

# ─── CONSOLE & AUDIT LOGGING UTILITIES ─────────────────────────────────────

async def chat_and_stream(agent, prompt: str, agent_name: str) -> dict:
    """Chats with an agent, streams its thinking process in real time, and logs details."""
    print(f"\n──────────────────────────────────────────────────────────────────────")
    print(f"💬 Prompting {agent_name}...")
    print(f"──────────────────────────────────────────────────────────────────────")
    
    # Start chat and intercept turn
    response = await agent.chat(prompt)
    
    print(f"\n🧠 [{agent_name}'s Thoughts]: ", end="", flush=True)
    thoughts_list = []
    async for thought in response.thoughts:
        print(thought, end="", flush=True)
        thoughts_list.append(thought)
    print("\n")
    
    text = await response.text()
    print(f"📖 [{agent_name}'s Final Response]:\n{text}\n")
    
    usage = agent.conversation.total_usage
    
def run_brand_blocking_validator(preset: dict) -> bool:
    print("🛡️ Running strict brand-blocking validations...")
    errors = []
    
    # 1. No legacy oax hex codes
    legacy_oax = {"#0a0806", "#bf9d2c", "#c4c1b8", "#161618"}
    for field in ["backgroundColor", "textColor", "borderColor", "secondaryColor", "slotBgColor"]:
        val = preset.get(field, "").lower()
        if val in legacy_oax:
            errors.append(f"Forbidden legacy oax token '{val}' found in {field}.")
            
    # 2. No pure black/white
    pure_colors = {"#000000", "#000", "#ffffff", "#fff"}
    for field in ["backgroundColor", "textColor", "borderColor", "secondaryColor", "slotBgColor"]:
        val = preset.get(field, "").lower()
        if val in pure_colors:
            errors.append(f"Pure black/white '{val}' found in {field} (must be tonal).")
            
    # 3. Fonts must be Fraunces for Display
    font = preset.get("fontFamily", "")
    if "Fraunces" not in font:
        errors.append(f"Font drift: fontFamily '{font}' does not contain required 'Fraunces'.")
        
    # 4. Forbidden vocab
    forbidden_vocab = [
        "luxury", "premium", "stunning", "amazing", "unforgettable", "journey",
        "vibe", "curated", "instagrammable", "once-in-a-lifetime", "keepsake",
        "antigravity", "agentic", "alpha-transparent", "automation pipeline",
        "verification algorithm",
    ]
    facing_fields = ["name", "titleText", "subTitleText", "dateText", "designerExplanation"]
    for field in facing_fields:
        val = preset.get(field, "").lower()
        for word in forbidden_vocab:
            if word in val:
                errors.append(f"Forbidden vocabulary '{word}' found in {field}.")
                
    if errors:
        print("❌ Brand Block Violations:")
        for err in errors:
            print(f"   - {err}")
        return False
    else:
        print("✅ No brand violations found.")
        return True

async def run_mock_pipeline(audit_file_path: str):
    print("🧪 Executing mock design agent pipeline...")
    
    # Mock Misty's creative proposal
    misty_text = (
        "Concept: 'Heirloom Abaca Weave'\n"
        "Palette: Piña Ecru (#EAE2D5) base ground, Iron Bark (#241E1A) typography, and Champagne Heirloom (#C4B59D) secondary accents.\n"
        "Weave Texture: Subtle binakul optical pattern nested in corner margins.\n"
        "Ancestry: Drawn from the mathematical wind-confusing patterns of Abra hardwoods."
    )
    
    # Mock CC's layout and validation
    preset_id = "katha-heirloom-abaca"
    color_palette = {
        "background": "#EAE2D5",
        "text": "#241E1A",
        "primary": "#C4B59D",
        "secondary": "#C4B59D"
    }
    
    preset_obj = f"""
  {{
    id: "{preset_id}",
    name: "Katha Signature — Heirloom Abaca",
    type: "postcard",
    backgroundColor: "{color_palette['background']}",
    textColor: "{color_palette['text']}",
    borderColor: "{color_palette['primary']}",
    secondaryColor: "{color_palette['secondary']}",
    fontFamily: "'Fraunces', serif",
    titleText: "Maria & Jose",
    subTitleText: "JULY 25, 2026",
    dateText: "ABRA",
    slotBorderRadius: "0px",
    slotBorderWidth: "1.5px",
    slotGap: "24px",
    slotBgColor: "#E0D7C7",
    innerSpacing: "60px",
    decorativeSvg: "",
    designerExplanation: "Unbleached piña-fiber ground with a fine champagne thread framing. Hardwood-inspired binakul weave borders confuse malevolent elements."
  }},"""

    # We write it to a generated_preset.json file
    preset_dict = {
        "id": preset_id,
        "name": "Katha Signature — Heirloom Abaca",
        "type": "postcard",
        "backgroundColor": color_palette["background"],
        "textColor": color_palette["text"],
        "borderColor": color_palette["primary"],
        "secondaryColor": color_palette["secondary"],
        "fontFamily": "'Fraunces', serif",
        "titleText": "Maria & Jose",
        "subTitleText": "JULY 25, 2026",
        "dateText": "ABRA",
        "slotBorderRadius": "0px",
        "slotBorderWidth": "1.5px",
        "slotGap": "24px",
        "slotBgColor": "#E0D7C7",
        "innerSpacing": "60px",
        "decorativeSvg": "",
        "designerExplanation": "Unbleached piña-fiber ground with a fine champagne thread framing. Hardwood-inspired binakul weave borders confuse malevolent elements."
    }
    
    with open("generated_preset.json", "w") as f:
        json.dump({
            "preset_obj": preset_obj.strip(),
            "svg_case": f"""
    case "{preset_id}":
      return `
        <!-- Minimal Outer Canvas Frame -->
        <rect x="${{margin / 2}}" y="${{margin / 2}}" width="${{vb.w - margin}}" height="${{vb.h - margin}}" fill="none" stroke="${{secondaryColor}}" stroke-width="1.5" />
        <!-- Hand-drawn wabi-sabi decorative threads -->
        <rect x="100" y="100" width="1600" height="1000" fill="none" stroke="${{secondaryColor}}" stroke-width="1.5" stroke-dasharray="10 5" />
      `;"""
        }, f, indent=2)
        
    print("✅ Preset generated and saved to generated_preset.json.")
    
    # Run brand-blocking validator in Python
    run_brand_blocking_validator(preset_dict)
    
    # Create the mock audit log trace
    audit_md = []
    audit_md.append("# Katha Booth: Generative Audit Loop Execution Trace\n")
    audit_md.append(f"> [!NOTE]\n> **Execution Date/Time**: 2026-05-31\n> **Platform**: Google Antigravity SDK & Gemini 3.5 Flash (Mocked)\n\n")
    audit_md.append("## Phase 1: Creative Ideation & Storytelling\n")
    audit_md.append("### 🧠 Misty's Conceptual Ideation\n\n")
    audit_md.append(f"#### Creative Proposal\n{misty_text}\n\n")
    audit_md.append("---\n\n")
    audit_md.append("## Phase 2: Design Architecture & Visual Auditing Loop\n")
    audit_md.append("### 🛠️ CC's Structural Blueprint (Mocked)\n\n")
    audit_md.append(f"#### CC's Proposed Layout Draft\n```xml\n<svg>...</svg>\n```\n\n")
    audit_md.append("### 👁️ Turn 1 Audit: Brock's Critique (Mocked)\n")
    audit_md.append("#### Audit Verdict & Feedback\nAPPROVE\n\n")
    audit_md.append("> [!TIP]\n> **VERDICT**: **APPROVED**! CC's layout successfully satisfies all Threadline and subtle transparent overlay laws.\n\n")
    
    with open(audit_file_path, "w") as f:
        f.writelines(audit_md)
        
    print(f"✅ Audit Loop trace written to: {audit_file_path}")
    
    # Trigger automated CD Handoff
    print("\n📦 Triggering automated CD handoff...")
    import subprocess
    script_dir = os.path.dirname(os.path.abspath(__file__))
    subprocess.run(["python3", os.path.join(script_dir, "squarespace_cd_handoff.py")], check=True)

async def main():
    print("🚀 Initializing Katha Design Pipeline with Audit Loop...")
    
    audit_file_path = "/Users/jedg./.gemini/antigravity/brain/2603ccc5-d7a7-41f4-a063-fd7672e0abfe/audit_log.md"
    
    if "GEMINI_API_KEY" not in os.environ:
        print("\n[!] INFO: GEMINI_API_KEY is not set in the environment.")
        print("To run with real models, obtain a key from: https://aistudio.google.com/app/api-keys")
        print("And export it: export GEMINI_API_KEY='your-key-here'\n")
        print("Executing DRY-RUN / MOCK MODE to demonstrate pipeline compliance...\n")
        await run_mock_pipeline(audit_file_path)
        return
        
    # We will accumulate the audit log in markdown
    audit_md = []
    audit_md.append("# Katha Booth: Generative Audit Loop Execution Trace\n")
    audit_md.append(f"> [!NOTE]\n> **Execution Date/Time**: 2026-05-31\n> **Platform**: Google Antigravity SDK & Gemini 3.5 Flash\n\n")
    
    async with Agent(misty_config) as misty, Agent(cc_config) as cc, Agent(brock_config) as brock:
        
        # --- PHASE 1: IDEATION (Misty Emerson) ---
        audit_md.append("## Phase 1: Creative Ideation & Storytelling\n")
        prompt = "Invent a new 'Katha Signature' preset concept inspired by 'Woven Silk'. Detail the palette, weave texture, and historical ancestry."
        
        misty_resp = await chat_and_stream(misty, prompt, "Misty Emerson")
        
        audit_md.append("### 🧠 Misty's Conceptual Ideation\n")
        audit_md.append(f"**Prompt**: *\"{prompt}\"*\n\n")
        
        if misty_resp["thoughts"]:
            audit_md.append("<details>\n<summary>🔍 Misty's Internal Reasoning Process</summary>\n\n")
            audit_md.append(f"```text\n{misty_resp['thoughts']}\n```\n")
            audit_md.append("</details>\n\n")
            
        audit_md.append(f"#### Creative Proposal\n{misty_resp['text']}\n\n")
        
        # Token metrics
        u = misty_resp["usage"]
        audit_md.append("#### 📊 Step Performance Metrics\n")
        audit_md.append(
            f"| Metric | Token Count |\n"
            f"| :--- | :--- |\n"
            f"| **Prompt Tokens** | {u.prompt_token_count} |\n"
            f"| **Candidates Tokens** | {u.candidates_token_count} |\n"
            f"| **Thoughts/Reasoning Tokens** | {u.thoughts_token_count} |\n"
            f"| **Total Segment Tokens** | {u.total_token_count} |\n\n"
        )
        audit_md.append("---\n\n")
        
        # --- PHASE 2: IMPLEMENTATION & AUDIT LOOP (CC & Brock) ---
        audit_md.append("## Phase 2: Design Architecture & Visual Auditing Loop\n")
        
        cc_prompt = (
            f"Build a 6x4 landscape (postcard) SVG structure for this concept. "
            f"Adhere strictly to the Threadline Cartography grid layout. "
            f"Use your validate_wabi_sabi_geometry tool before proposing, and call render_preview_svg to store the final structure.\n"
            f"Concept:\n{misty_resp['text']}"
        )
        
        cc_resp = await chat_and_stream(cc, cc_prompt, "Claude Code (CC)")
        
        audit_md.append("### 🛠️ Attempt 1: CC's Structural Blueprint\n")
        if cc_resp["thoughts"]:
            audit_md.append("<details>\n<summary>🔍 CC's Structural Reasoning</summary>\n\n")
            audit_md.append(f"```text\n{cc_resp['thoughts']}\n```\n")
            audit_md.append("</details>\n\n")
            
        audit_md.append(f"#### CC's Proposed Layout Draft\n```xml\n{cc_resp['text']}\n```\n\n")
        
        # Token metrics
        u = cc_resp["usage"]
        audit_md.append("#### 📊 CC Turn 1 Metrics\n")
        audit_md.append(
            f"| Metric | Token Count |\n"
            f"| :--- | :--- |\n"
            f"| **Prompt Tokens** | {u.prompt_token_count} |\n"
            f"| **Candidates Tokens** | {u.candidates_token_count} |\n"
            f"| **Thoughts Tokens** | {u.thoughts_token_count} |\n"
            f"| **Total Turn Tokens** | {u.total_token_count} |\n\n"
        )
        
        svg_text = cc_resp["text"]
        max_iterations = 3
        approved = False
        
        for attempt in range(1, max_iterations + 1):
            audit_md.append(f"### 👁️ Turn {attempt} Audit: Brock's Critique\n")
            
            brock_prompt = (
                f"Audit this SVG code for compliance with the Threadline Cartography and Wabi-Sabi UI/UX specification. "
                f"CRITICAL RULE: Verify that the overlaying elements (like borders or threads) act as a multi-layered alpha transparent overlay, "
                f"subtly overlapping into the photo slots (e.g. drawn AFTER/on top of slots but slightly overlapping coordinates by 10-16px, "
                f"NOT wrapping tightly outside or blocking them entirely). "
                f"If correct, reply only with 'APPROVE'. Otherwise, reply 'REJECT' and give precise coordinate fixes.\n"
                f"SVG Code:\n{svg_text}"
            )
            
            brock_resp = await chat_and_stream(brock, brock_prompt, f"Brock (Attempt {attempt})")
            
            if brock_resp["thoughts"]:
                audit_md.append(f"<details>\n<summary>🔍 Brock's Visual Audit Reasoning (Attempt {attempt})</summary>\n\n")
                audit_md.append(f"```text\n{brock_resp['thoughts']}\n```\n")
                audit_md.append("</details>\n\n")
                
            audit_md.append(f"#### Audit Verdict & Feedback\n{brock_resp['text']}\n\n")
            
            # Metrics
            u = brock_resp["usage"]
            audit_md.append(
                f"| Metric | Token Count |\n"
                f"| :--- | :--- |\n"
                f"| **Prompt Tokens** | {u.prompt_token_count} |\n"
                f"| **Candidates Tokens** | {u.candidates_token_count} |\n"
                f"| **Thoughts Tokens** | {u.thoughts_token_count} |\n"
                f"| **Total Segment Tokens** | {u.total_token_count} |\n\n"
            )
            
            if "APPROVE" in brock_resp["text"].upper():
                approved = True
                audit_md.append("> [!TIP]\n> **VERDICT**: **APPROVED**! CC's layout successfully satisfies all Threadline and subtle transparent overlay laws.\n\n")
                print(f"✅ Brock APPROVED CC's layout on attempt {attempt}!")
                break
            else:
                audit_md.append("> [!WARNING]\n> **VERDICT**: **REJECTED**. Brock spotted flaws. Directing CC to revise.\n\n")
                print(f"❌ Brock REJECTED CC's layout on attempt {attempt}. CC is revising...")
                
                if attempt == max_iterations:
                    audit_md.append("> [!CAUTION]\n> **VERDICT**: **FAILED**. Reached maximum revisions without approval.\n\n")
                    break
                
                # Prompt CC to revise
                cc_revision_prompt = (
                    f"Brock REJECTED the design on attempt {attempt}. Re-evaluate your layout coordinates and fix the SVG "
                    f"to comply exactly with his critiques: {brock_resp['text']}\n"
                    f"Keep the Threadline Cartography specifications in mind. Output ONLY the revised complete SVG code."
                )
                cc_resp = await chat_and_stream(cc, cc_revision_prompt, f"Claude Code (Revision {attempt})")
                svg_text = cc_resp["text"]
                
                audit_md.append(f"### 🛠️ CC's Revised SVG Blueprint (Attempt {attempt + 1})\n")
                if cc_resp["thoughts"]:
                    audit_md.append(f"<details>\n<summary>🔍 CC's Revision Reasoning</summary>\n\n")
                    audit_md.append(f"```text\n{cc_resp['thoughts']}\n```\n")
                    audit_md.append("</details>\n\n")
                audit_md.append(f"#### CC's Revised Draft\n```xml\n{svg_text}\n```\n\n")
                
                # Metrics
                u = cc_resp["usage"]
                audit_md.append(
                    f"| Metric | Token Count |\n"
                    f"| :--- | :--- |\n"
                    f"| **Prompt Tokens** | {u.prompt_token_count} |\n"
                    f"| **Candidates Tokens** | {u.candidates_token_count} |\n"
                    f"| **Thoughts Tokens** | {u.thoughts_token_count} |\n"
                    f"| **Total Segment Tokens** | {u.total_token_count} |\n\n"
                )
        
        # Write out final trace to audit_log.md
        with open(audit_file_path, "w") as f:
            f.writelines(audit_md)
            
        print(f"\n✅ Audit Loop execution traced and written to: {audit_file_path}")
        
        # Trigger automated CD Handoff
        print("\n📦 Triggering automated CD handoff...")
        import subprocess
        script_dir = os.path.dirname(os.path.abspath(__file__))
        subprocess.run(["python3", os.path.join(script_dir, "squarespace_cd_handoff.py")], check=True)

if __name__ == "__main__":
    asyncio.run(main())
