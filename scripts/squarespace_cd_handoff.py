#!/usr/bin/env python3
import os
import sys

def main():
    print("🔄 Starting Automated CD Handoff for Squarespace...")
    
    # Paths
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    css_path = os.path.join(root_dir, "squarespace", "katha-injection.css")
    output_path = os.path.join(root_dir, "squarespace", "katha-injection.formatted.html")
    
    if not os.path.exists(css_path):
        print(f"❌ Error: Source stylesheet not found at {css_path}")
        sys.exit(1)
        
    print(f"📖 Reading source stylesheet: {css_path}")
    with open(css_path, "r") as f:
        css_content = f.read()
        
    print("🎨 Formatting stylesheet within Squarespace injection wrappers...")
    formatted_content = f"""<!-- 
  KATHA — AUTOMATED CD HANDOFF INJECTION BLOCK
  Generated: 2026-05-31
  DO NOT EDIT DIRECTLY. Make changes to katha-injection.css.
-->
<style>
{css_content}
</style>
"""

    print(f"💾 Writing formatted injection block to {output_path}")
    with open(output_path, "w") as f:
        f.write(formatted_content)
        
    print("\n✅ Squarespace CD Handoff bundle created successfully!")
    print(f"📍 Handoff file location: {output_path}")
    print("\n--------------------------------------------------------------")
    print("ℹ️  HOW TO COMPLETE DEPLOYMENT:")
    print("1. Copy the entire contents of the formatted file above.")
    print("2. Paste into Squarespace Settings → Advanced → Code Injection → HEADER.")
    print("3. Alternatively, run the automated DevTools script to auto-inject.")
    print("--------------------------------------------------------------\n")

if __name__ == "__main__":
    main()
