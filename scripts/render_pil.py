#!/usr/bin/env python3
"""
Katha Template Studio — Python-based rendering pipeline.

DESIGN DECISION (CMYK Scope):
- This Python renderer focuses exclusively on RGB/RGBA PNG rendering (composite and transparent alpha overlay).
- CMYK PDF compilation (which uses pdf-lib and requires specific color spaces for print vendor workflows)
  remains the responsibility of the Node.js template runner ('export-template.mjs').
- This ensures Python maintains a lightweight, low-dependency footprint (requiring only Pillow) without
  duplicating complex PDF/color-space translation profiles.
"""
import argparse
import subprocess
import json
import sys
import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

VIEWBOX = {
    "strip": {"w": 600, "h": 1800},
    "postcard-vertical": {"w": 1200, "h": 1800},
    "postcard": {"w": 1800, "h": 1200},
}
SCALE = 3

def parse_color(hex_str, opacity=1.0):
    hex_str = hex_str.lstrip('#')
    if len(hex_str) == 3:
        hex_str = ''.join(c * 2 for c in hex_str)
    if len(hex_str) == 6:
        r, g, b = tuple(int(hex_str[i:i+2], 16) for i in (0, 2, 4))
        return (r, g, b, int(255 * opacity))
    return (0, 0, 0, 255)

def main():
    parser = argparse.ArgumentParser(description="Render template using PIL")
    parser.add_argument("--layout", required=True, help="Layout ID (e.g. strip-3)")
    parser.add_argument("--names", required=True, help="Names to render")
    parser.add_argument("--font", default="scripts/fonts/Parisienne-Regular.ttf", help="Font path")
    parser.add_argument("--bg", default="#FDFCFB", help="Background color")
    parser.add_argument("--text-color", default="#9E5460", help="Text color")
    parser.add_argument("--secondary", help="Secondary/decoration color")
    parser.add_argument("--border", default="#E5E5E5", help="Border color")
    parser.add_argument("--slot-bg", default="#F9F9F9", help="Slot background color")
    parser.add_argument("--out-dir", default="exports/", help="Output directory")
    parser.add_argument("--slug", default="render_output", help="Output file slug")
    args = parser.parse_args()

    args.secondary = args.secondary or args.text_color
    
    script_dir = Path(__file__).resolve().parent
    repo_root = script_dir.parent.parent
    
    lookup_script = repo_root / ".agents/skills/template-fidelity/scripts/lookup.mjs"
    if not lookup_script.exists():
        print(f"Error: lookup script not found at {lookup_script}")
        sys.exit(1)
    
    result = subprocess.run(
        ["node", str(lookup_script), "--layout", args.layout],
        capture_output=True, text=True, cwd=str(repo_root)
    )
    if result.returncode != 0:
        print(f"Error resolving layout: {result.stderr}")
        sys.exit(1)

    try:
        layout_data = json.loads(result.stdout)
    except json.JSONDecodeError:
        print("Error parsing layout JSON")
        sys.exit(1)

    format_id = layout_data.get("format", "strip")
    if format_id not in VIEWBOX:
        print(f"Unknown format {format_id}")
        sys.exit(1)

    vb_w = VIEWBOX[format_id]["w"]
    vb_h = VIEWBOX[format_id]["h"]

    # --- HARDENING: LAYOUT DIMENSION ASSERTIONS ---
    assert vb_w > 0 and vb_h > 0, "Canvas dimensions must be greater than zero."
    
    slots = layout_data.get("slots", [])
    assert len(slots) > 0, f"Layout '{args.layout}' must contain at least one photo slot."
    
    for idx, slot in enumerate(slots):
        assert "x" in slot and "y" in slot and "w" in slot and "h" in slot, \
            f"Slot {idx} in layout '{args.layout}' is missing coordinate fields."
        assert slot["w"] > 0 and slot["h"] > 0, \
            f"Slot {idx} dimensions must be greater than zero: w={slot['w']}, h={slot['h']}."
        assert slot["x"] >= 0 and slot["y"] >= 0, \
            f"Slot {idx} coordinates must be non-negative: x={slot['x']}, y={slot['y']}."
        assert slot["x"] + slot["w"] <= vb_w, \
            f"Slot {idx} exceeds canvas width boundaries: x={slot['x']}, w={slot['w']}, canvas_w={vb_w}."
        assert slot["y"] + slot["h"] <= vb_h, \
            f"Slot {idx} exceeds canvas height boundaries: y={slot['y']}, h={slot['h']}, canvas_h={vb_h}."
    
    text_zone = layout_data.get("textZone", {})
    assert "x" in text_zone and "y" in text_zone and "w" in text_zone and "h" in text_zone, \
        f"Layout '{args.layout}' is missing a valid textZone definition."
    assert text_zone["w"] > 0 and text_zone["h"] > 0, \
        f"textZone dimensions must be greater than zero: w={text_zone['w']}, h={text_zone['h']}."
    assert text_zone["x"] >= 0 and text_zone["y"] >= 0, \
        f"textZone coordinates must be non-negative: x={text_zone['x']}, y={text_zone['y']}."
    assert text_zone["x"] + text_zone["w"] <= vb_w, \
        f"textZone exceeds canvas width boundaries: x={text_zone['x']}, w={text_zone['w']}, canvas_w={vb_w}."
    assert text_zone["y"] + text_zone["h"] <= vb_h, \
        f"textZone exceeds canvas height boundaries: y={text_zone['y']}, h={text_zone['h']}, canvas_h={vb_h}."
    # ---------------------------------------------

    w = vb_w * SCALE
    h = vb_h * SCALE

    font_path = Path(args.font)
    if not font_path.exists():
        print(f"Error: Font file not found at {font_path}")
        sys.exit(1)

    out_dir = Path(args.out_dir)
    os.makedirs(out_dir, exist_ok=True)

    # Load glyph configuration if available
    font_name = font_path.stem
    glyph_config = {"baselineOffset": 0, "scaleAdjust": 1.0, "ligatures": {}}
    glyph_config_path = script_dir / "glyphs" / f"{font_name}.json"
    if glyph_config_path.exists():
        try:
            with open(glyph_config_path, "r", encoding="utf-8") as f:
                glyph_config = json.load(f)
        except Exception as e:
            print(f"Warning: Failed to load glyph config: {e}")

    scale_adjust = glyph_config.get("scaleAdjust", 1.0)
    baseline_offset = glyph_config.get("baselineOffset", 0)
    ligatures = glyph_config.get("ligatures", {})

    try:
        font = ImageFont.truetype(str(font_path), int(170 * scale_adjust * SCALE))
    except Exception as e:
        print(f"Error loading font: {e}")
        sys.exit(1)

    def draw_elements(is_composite):
        bg_col = parse_color(args.bg) if is_composite else (0, 0, 0, 0)
        img = Image.new("RGBA", (w, h), bg_col)
        draw = ImageDraw.Draw(img, "RGBA")

        if is_composite:
            slot_bg_col = parse_color(args.slot_bg)
            border_col = parse_color(args.border)
            border_w = 1 * SCALE
            for slot in layout_data.get("slots", []):
                sx = slot["x"] * SCALE
                sy = slot["y"] * SCALE
                sw = slot["w"] * SCALE
                sh = slot["h"] * SCALE
                draw.rectangle([sx, sy, sx + sw, sy + sh], fill=slot_bg_col, outline=border_col, width=border_w)

        dec_col_100 = parse_color(args.secondary, 1.0)
        dec_col_55 = parse_color(args.secondary, 0.55)
        dec_col_40 = parse_color(args.secondary, 0.40)
        dec_col_35 = parse_color(args.secondary, 0.35)

        fo = 60 * SCALE
        draw.rectangle([fo, fo, w - fo, h - fo], outline=dec_col_100, width=int(1.5 * SCALE))

        fi = 72 * SCALE
        draw.rectangle([fi, fi, w - fi, h - fi], outline=dec_col_55, width=max(1, int(0.5 * SCALE)))

        mono_y = (layout_data["textZone"]["y"] + 80) * SCALE
        cx = w // 2

        r_out = 22 * SCALE
        draw.ellipse([cx - r_out, mono_y - r_out, cx + r_out, mono_y + r_out], outline=dec_col_55, width=1 * SCALE)

        r_in = 16 * SCALE
        draw.ellipse([cx - r_in, mono_y - r_in, cx + r_in, mono_y + r_in], outline=dec_col_35, width=max(1, int(0.5 * SCALE)))

        line_w = max(1, int(0.75 * SCALE))
        draw.line([cx - 220*SCALE, mono_y, cx - 32*SCALE, mono_y], fill=dec_col_40, width=line_w)
        draw.line([cx + 32*SCALE, mono_y, cx + 220*SCALE, mono_y], fill=dec_col_40, width=line_w)

        text_col = parse_color(args.text_color)
        text_y = (layout_data["textZone"]["y"] + layout_data["textZone"]["h"] * 0.62 + baseline_offset) * SCALE
        
        processed_names = args.names
        for key, val in ligatures.items():
            processed_names = processed_names.replace(key, val)

        draw.text((cx, text_y), processed_names, font=font, fill=text_col, anchor="ms")

        return img

    comp_img = draw_elements(True)
    alpha_img = draw_elements(False)

    comp_path = out_dir / f"{args.slug}_composite.png"
    alpha_path = out_dir / f"{args.slug}_alpha_overlay.png"

    comp_img.save(comp_path, "PNG")
    alpha_img.save(alpha_path, "PNG")
    
    print(f"Generated {comp_path}")
    print(f"Generated {alpha_path}")

if __name__ == "__main__":
    main()
