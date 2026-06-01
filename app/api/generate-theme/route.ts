import { Type } from "@google/genai";
import { NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { eventName, formFactor } = await req.json();

    const prompt = `You are a professional graphic designer specializing in elegant event stationery and photobooth templates. A user wants to generate a photobooth theme based on their specific event name and intended form factor.

Event Name: "${eventName}"
Form Factor: "${formFactor}" (could be strip, postcard, or postcard-vertical)

Generate a custom photobooth preset configuration. Make deliberate color pairings, elegant fonts, and balanced spacing.
Do NOT use any of these words in the designerExplanation or anywhere: luxury, premium, stunning, amazing, unforgettable, curated, gorgeous, vibe. Describe the craft and materials specifically instead.
Important: The styling must feel distinct and fitting for the event name provided.
You must use exactly one of these CSS rules for the fontFamily:
- 'Fraunces', serif
- 'Cinzel', serif
- 'Playfair Display', serif
- 'Bodoni Moda', serif
- 'EB Garamond', serif
- 'Italiana', serif
- 'Aboreto', sans-serif
- 'Great Vibes', cursive
- 'Alex Brush', cursive
- 'Pinyon Script', cursive
- 'Sacramento', cursive
- 'Rochester', cursive
- 'Parisienne', cursive
- 'La Belle Aurore', cursive
- 'Montserrat', sans-serif

Pick elegant colors (hex codes). Make sure contrast is readable.`;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING, description: "A unique slug, e.g. custom-ai-theme" },
            name: { type: Type.STRING, description: "Theme name corresponding to the event" },
            type: { type: Type.STRING, description: "The requested form factor" },
            backgroundColor: { type: Type.STRING },
            textColor: { type: Type.STRING },
            borderColor: { type: Type.STRING },
            secondaryColor: { type: Type.STRING },
            fontFamily: { type: Type.STRING, description: "MUST be one of the listed CSS rules" },
            titleText: { type: Type.STRING, description: "Short title derived from event" },
            subTitleText: { type: Type.STRING },
            dateText: { type: Type.STRING },
            slotBorderRadius: { type: Type.STRING, description: "e.g. 0px or 4px or 8px" },
            slotBorderWidth: { type: Type.STRING, description: "e.g. 0px or 1.5px" },
            slotGap: { type: Type.STRING, description: "e.g. 24px" },
            slotBgColor: { type: Type.STRING },
            innerSpacing: { type: Type.STRING, description: "e.g. 24px" },
            designerExplanation: { type: Type.STRING }
          },
          required: [
            "id", "name", "type", "backgroundColor", "textColor", "borderColor", 
            "secondaryColor", "fontFamily", "titleText", "subTitleText", "dateText", 
            "slotBorderRadius", "slotBorderWidth", "slotGap", "slotBgColor", 
            "innerSpacing", "designerExplanation"
          ]
        }
      }
    });

    const output = JSON.parse(response.text || "{}");
    return NextResponse.json(output);

  } catch (err: any) {
    console.error("Theme generation error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
