import os
import base64
import sys
import json
from google import genai
from google.genai import types

def generate():
    client = genai.Client(
        vertexai=True,
        api_key=os.environ.get("GOOGLE_CLOUD_API_KEY"),
    )
    
    # Read the base64 JSON from stdin
    b64_json = sys.stdin.read().strip()
    if not b64_json:
        print("Error: No base64 JSON provided.")
        return

    try:
        decoded_json = base64.b64decode(b64_json).decode('utf-8')
        architecture = json.loads(decoded_json)
        print("Successfully decoded architecture JSON.")
    except Exception as e:
        print(f"Failed to parse input: {e}")
        return

    prompt = f"""
    You are Nano Banana Pro (Gemini 3 Pro Image). 
    I need you to generate a high-ticket, 4K, 9:16 layout graphic for the 'Abel & Calado' Katha Signature template.
    Use the following architectural definition as the constraint basis:
    {json.dumps(architecture, indent=2)}
    
    Generate the visual asset. Make it extremely high-end, utilizing unbleached piña ecru and champagne hues, with an intricate but minimalist Calado rosette.
    """

    model = "gemini-3-pro-image"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part(text=prompt)
            ]
        )
    ]
    
    generate_content_config = types.GenerateContentConfig(
        temperature=1,
        top_p=0.95,
        max_output_tokens=32768,
        response_modalities=["TEXT", "IMAGE"],
        safety_settings=[
            types.SafetySetting(category="HARM_CATEGORY_HATE_SPEECH", threshold="OFF"),
            types.SafetySetting(category="HARM_CATEGORY_DANGEROUS_CONTENT", threshold="OFF"),
            types.SafetySetting(category="HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold="OFF"),
            types.SafetySetting(category="HARM_CATEGORY_HARASSMENT", threshold="OFF")
        ],
        image_config=types.ImageConfig(
            aspect_ratio="9:16",
            image_size="4K",
            output_mime_type="image/png",
        ),
    )

    try:
        response = client.models.generate_content(
            model=model,
            contents=contents,
            config=generate_content_config,
        )
        
        # Save the images
        img_count = 0
        for part in response.candidates[0].content.parts:
            if part.mime_type == "image/png":
                img_path = f"/Users/jedg./Desktop/kat_ha_pb/pb-v3/public/nano_banana_base_{img_count}.png"
                with open(img_path, "wb") as f:
                    f.write(part.data)
                print(f"Saved image to {img_path}")
                img_count += 1
            elif part.text:
                 print(part.text)
                 
    except Exception as e:
        print(f"Generation failed: {e}")

if __name__ == "__main__":
    generate()
