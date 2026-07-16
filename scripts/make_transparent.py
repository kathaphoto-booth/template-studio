import sys
from PIL import Image, ImageOps

def make_transparent(input_path, output_path, is_light_on_dark=False):
    # Open image and convert to RGBA
    img = Image.open(input_path).convert("RGBA")
    
    # Convert to grayscale to use as an alpha mask
    gray = img.convert("L")
    
    # If the image is dark text on light background (default):
    # We want dark pixels to be opaque (alpha=255) and light pixels to be transparent (alpha=0).
    # So we invert the grayscale image to create the alpha mask.
    if not is_light_on_dark:
        alpha = ImageOps.invert(gray)
    else:
        # If it's light text on dark background:
        # Light pixels opaque, dark pixels transparent
        alpha = gray

    # Create a new image with the original RGB but the new calculated alpha
    # Alternatively, for black text, we can just use pure black with the alpha mask
    # to avoid any white fringes.
    
    r, g, b, _ = img.split()
    
    if not is_light_on_dark:
        # Assume we want pure black or dark grey for the stroke to avoid white halos
        # We can just fill with black and use the alpha
        black_img = Image.new("RGBA", img.size, (26, 26, 26, 255)) # slightly off-black like #1A1A1A
        black_img.putalpha(alpha)
        black_img.save(output_path, "PNG")
    else:
        # For light color text (like the cream wordmark)
        # We fill with the cream color #F0EAD6 (240, 234, 214)
        cream_img = Image.new("RGBA", img.size, (240, 234, 214, 255))
        cream_img.putalpha(alpha)
        cream_img.save(output_path, "PNG")

if __name__ == "__main__":
    # 1. Process the logo mark (leaf K) - it's dark on light background
    make_transparent("/Users/jedg./Desktop/kat_ha_pb/brand_assets/marks/logo+word/final logo mark with bg.jpeg", "/Users/jedg./Desktop/kat_ha_pb/photobooth-template-studio/public/brand/katha-logo-mark-transparent.png", False)
    
    # 2. Process the wordmark. If they have 'word mark traditional .jpeg', it's probably dark on light.
    # The user also showed an image of the wordmark in cream color on dark. 
    make_transparent("/Users/jedg./Desktop/kat_ha_pb/brand_assets/marks/logo+word/word mark traditional .jpeg", "/Users/jedg./Desktop/kat_ha_pb/photobooth-template-studio/public/brand/katha-wordmark-transparent.png", False)
    
    print("Successfully created transparent PNGs.")
