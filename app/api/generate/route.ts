import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";
import { Type } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const ai = getGeminiClient();
    const body = await req.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json({ error: "Missing action in request body." }, { status: 400 });
    }

    if (action === "chat") {
      const { messages, searchGrounding } = body;
      if (!messages || !Array.isArray(messages)) {
        return NextResponse.json({ error: "Invalid messages array." }, { status: 400 });
      }

      // Prepare messages for Gemini format (role: 'user' | 'model')
      const formattedContents = messages.map((msg: any) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.text }],
      }));

      // Set up simple tools if search is desired
      const config: any = {
        systemInstruction: "You are 'Aegis', an elegant and hyper-intelligence research companion in the Gemini AI Workspace. Your responses must be structured, aesthetically formatted with Markdown, objective, and meticulously detailed but readable.",
      };

      if (searchGrounding) {
        config.tools = [{ googleSearch: {} }];
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: formattedContents,
        config,
      });

      // Extract search citations if grounding occurred
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const citations = groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title || chunk.maps?.title || "Search Reference",
        uri: chunk.web?.uri || chunk.maps?.uri || "#",
      })) || [];

      return NextResponse.json({
        text: response.text || "I was unable to formulate a response.",
        citations,
      });
    }

    if (action === "mindmap") {
      const { topic } = body;
      if (!topic) {
        return NextResponse.json({ error: "Missing topic for mindmap." }, { status: 400 });
      }

      const mindmapPrompt = `Generate a comprehensive, structurally sound outline mindmap for the topic: "${topic}". Create between 6 to 9 logically nested nodes representing core concepts, history, modern sub-categories, or practical applications. Always begin with a root node (id: "root", parent: null). Ensure parent mappings match the actual 'id' of direct relatives exactly so it forms a fully traversable parent-child graph.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: mindmapPrompt,
        config: {
          systemInstruction: "You are an expert structure organizer. Map out academic, technical, or creative topics into nested parent-child visual nodes formatted exactly as modern valid JSON aligning with the provided schema.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: {
                  type: Type.STRING,
                  description: "Unique string key for the node, keep lowercase, e.g. 'root', 'history', 'frameworks', 'usecases'."
                },
                parent: {
                  type: Type.STRING,
                  description: "The direct parent node ID. The main node MUST have parent set to null. Subnodes must specify an existing node id as parent (e.g. 'root').",
                  nullable: true
                },
                text: {
                  type: Type.STRING,
                  description: "Node display label. Short, clear, 2-3 words max."
                },
                color: {
                  type: Type.STRING,
                  description: "One of these color themes: 'teal', 'indigo', 'pink', 'emerald', 'sky', 'violet', 'amber'."
                },
                explanation: {
                  type: Type.STRING,
                  description: "A detailed single sentence description of what this section covers."
                }
              },
              required: ["id", "parent", "text", "color", "explanation"]
            }
          }
        }
      });

      const textResult = response.text;
      if (!textResult) {
        throw new Error("No text returned for mindmap creation.");
      }

      const data = JSON.parse(textResult);
      return NextResponse.json({ mindmap: data });
    }

    if (action === "svg") {
      const { prompt } = body;
      if (!prompt) {
        return NextResponse.json({ error: "Missing prompt for SVG." }, { status: 400 });
      }

      const svgGenerationPrompt = `Design and write the full standalone SVG raw xml code representing: "${prompt}".`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: svgGenerationPrompt,
        config: {
          systemInstruction: "You are an elite, modern vector artist. Think in terms of high-end tech UI elements, glowing neon lights, sleek glassy overlays, balanced abstract geometry, and smooth futuristic colors. You must output clean, valid, standalone SVG markup. Ensure your SVG tag has standard viewBox='0 0 500 500' and incorporates stunning design details (such as <linearGradient>, <filter> for dropshadow or glow, complex translucent polygons/shapes, refined text, and gorgeous visual rhythm). No flat, cheap clipart is allowed since this is premium designer artwork. Escapse quotes carefully in the text output.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: "An elegant, descriptive and artistic title for the piece."
              },
              rawSvg: {
                type: Type.STRING,
                description: "The complete, standalone, valid SVG element starting with <svg viewBox=\"0 0 500 500\" xmlns=\"http://www.w3.org/2000/svg\"> and ending with </svg>."
              },
              designerNotes: {
                type: Type.STRING,
                description: "Professional designer logs explaining the styling choice, layer interactions, and color palette strategy."
              }
            },
            required: ["title", "rawSvg", "designerNotes"]
          }
        }
      });

      const textResult = response.text;
      if (!textResult) {
        throw new Error("No text returned for SVG generation.");
      }

      const data = JSON.parse(textResult);
      return NextResponse.json(data);
    } // Close action === "svg" block
    
    if (action === "photobooth_theme") {
      const { prompt, formFactor } = body;
      if (!prompt) {
        return NextResponse.json({ error: "Missing prompt for photobooth theme." }, { status: 400 });
      }

      const photoboothPrompt = `Generate a high-fidelity custom photobooth template design spec for the topic: "${prompt}" and template layout format: "${formFactor}". The design should represent a refined physical print layout with custom decorations. Do NOT use the words luxury, premium, stunning, gorgeous, amazing, curated, or vibe in the designerExplanation — describe the craft and materials specifically.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: photoboothPrompt,
        config: {
          systemInstruction: "You are an elite event stationery designer and raw SVG layout expert. Your task is to output a fully customized photobooth design specification. This must include fine, high-contrast colors, slot margins, grid adjustments, and an array of RAW inner SVG components (like botanical floral paths, stars, neon concentric rings, geometric grid lines, or vintage flourishes) that will render in the background layers of the template card. DO NOT wrap the decorativeSvg in an '<svg>' element; write only the direct child SVG nodes like '<path d=\"...\" fill=\"...\" />', '<line ... />', '<g>...</g>' etc. Ensure dimensions are scaled for 600x1800 (mostly vertical) or 6x4 (mostly horizontal, e.g. 600x400 relative ratio). Make sure they don't block the 3-media slots entirely, place them at corners or borders.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              themeName: { type: Type.STRING },
              backgroundColor: { type: Type.STRING, description: "Background hex color. e.g. '#FBF9F6'" },
              textColor: { type: Type.STRING, description: "Main text hex color. e.g. '#1C1917'" },
              borderColor: { type: Type.STRING, description: "Slot border outline hex color. e.g. '#E7E4E0'" },
              secondaryColor: { type: Type.STRING, description: "Secondary ornament hex color. e.g. '#A89F91'" },
              fontFamily: { type: Type.STRING, description: "Must be either 'serif', 'sans', 'mono', 'handwritten', or 'display'" },
              titleText: { type: Type.STRING, description: "Heading text, e.g. 'Napa Valley Wedding' or 'Liam's Cosmic 10th'" },
              subTitleText: { type: Type.STRING, description: "Subheading text, e.g. 'CELEBRATING LOVE' or 'retro gaming party'" },
              dateText: { type: Type.STRING, description: "Short date or footnote, e.g. '05.23.2026' or 'EST. 1996'" },
              slotBorderRadius: { type: Type.STRING, description: "CSS border-radius of the layout slots. Pick '0px', '4px', '12px', '24px', or '50%'" },
              slotBorderWidth: { type: Type.STRING, description: "Width of the slot border. e.g. '0px', '2px', '4px', or '6px'" },
              slotGap: { type: Type.STRING, description: "Spacing gap between photo slots. e.g. '12px', '16px', '24px', or '32px'" },
              slotBgColor: { type: Type.STRING, description: "Contrast backdrop color for empty media slots. e.g. '#EAE6E2'" },
              innerSpacing: { type: Type.STRING, description: "Card inner boundary padding. e.g. '16px', '24px', '32px', or '40px'" },
              decorativeSvg: { type: Type.STRING, description: "Raw child SVG tags representing floral vectors, geometric frames, confetti elements, or sparkles. DO NOT write <svg> or </svg> tags, only their contents (e.g. <path d='...' /> <g>...</g>). Keep it relative to 600x1800 if strip, or 600x400 if postcard." },
              designerExplanation: { type: Type.STRING, description: "Brief logs explaining your artistic typography and balance choices." }
            },
            required: [
              "themeName", "backgroundColor", "textColor", "borderColor", "secondaryColor", "fontFamily",
              "titleText", "subTitleText", "dateText", "slotBorderRadius", "slotBorderWidth", "slotGap",
              "slotBgColor", "innerSpacing", "decorativeSvg", "designerExplanation"
            ]
          }
        }
      });

      const textResult = response.text;
      if (!textResult) {
        throw new Error("No theme response returned from AI.");
      }

      const data = JSON.parse(textResult);
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Unsupported action." }, { status: 400 });

  } catch (error: any) {
    console.error("Error in AI proxy:", error);
    return NextResponse.json({
      error: error.message || "An error occurred with the Gemini API.",
    }, { status: 500 });
  }
}
