"use client";

import React, { useState, useRef, useEffect } from "react";
import { jsPDF } from "jspdf";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Check, 
  Copy, 
  RefreshCw,
  Camera,
  Download,
  Upload,
  Heart,
  Sliders,
  Type as FontIcon,
  Palette,
  Eye,
  Settings,
  BookOpen,
  X,
  Play,
  Info,
  Calendar,
  MapPin,
  Smile,
  Layers,
  RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type PhotoboothPreset, PRESETS, LUXURY_FONTS, HARMONY_PALETTES, renderDecorativeSvg, resolveLayout, VIEWBOX, layoutsForFormat, getModifiedLayout, LAYOUTS, defaultLayoutFor } from "@/lib/templates";

/* eslint-disable react-hooks/set-state-in-effect */


// ----------------------------------------------------------------------
// 3D PHYSICAL STATIONERY GRAPHIC DESIGN SHADING & LAYER ENGINES
// ----------------------------------------------------------------------

function drawPaperTexture(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  presetId: string,
  baseColor: string
) {
  // Fill the base color
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, width, height);

  ctx.save();

  if (["wedding-luxe-gold", "wedding-classic-monogram", "wedding-vintage-lace", "wedding-luxury-blind-deboss", "wedding-art-deco"].includes(presetId)) {
    // Ivory linen / cross-woven cotton thread matrix — wedding-luxe-gold family
    ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 4) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let j = 0; j < height; j += 4) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(width, j);
      ctx.stroke();
    }

    // High frequency micro pulp noise
    ctx.fillStyle = "rgba(0, 0, 0, 0.015)";
    for (let i = 0; i < 400; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      ctx.fillRect(rx, ry, 1.5, 1.5);
    }
  } else if (["rose-whisper", "wedding-editorial", "wedding-botanical-arch", "wedding-hand-painted-hydrangea"].includes(presetId)) {
    // 2. Heavy watercolor / Deckled structured cotton cardstock
    // Draw rich mottled clouds representing raw parchment/cotton pulp
    for (let i = 0; i < 90; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = 60 + Math.random() * 180;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
      grad.addColorStop(0, "rgba(255, 255, 255, 0.09)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0.0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Pulp fiber threads
    ctx.fillStyle = "rgba(0,0,0,0.02)";
    for (let i = 0; i < 300; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      const rw = 2 + Math.random() * 3;
      const rh = 1;
      ctx.fillRect(rx, ry, rw, rh);
    }
  } else if (presetId === "wedding-warm-terracotta") {
    // 3. Bohemian desert grit terracotta adobe clay/fine-stucco sand texture
    ctx.fillStyle = "rgba(0,0,0,0.04)";
    for (let i = 0; i < 1200; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      ctx.fillRect(rx, ry, 2, 2);
    }
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    for (let i = 0; i < 1200; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      ctx.fillRect(rx, ry, 2, 2);
    }

    // Organic clay shadow flows
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = 120 + Math.random() * 250;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
      grad.addColorStop(0, "rgba(255, 255, 255, 0.06)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0.03)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (presetId === "wedding-heritage-sage") {
    // 4. Matte elegant moss/sage cardstock fibers
    ctx.fillStyle = "rgba(0,0,0,0.035)";
    for (let i = 0; i < 400; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      ctx.fillRect(rx, ry, 1.5, 2);
    }
  } else if (presetId.includes("pina")) {
    // Katha Signature: Heirloom Piña Fabric Texture
    // Hand-loomed pineapple fiber cross-hatch with slight organic unevenness
    ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
    ctx.lineWidth = 0.75;
    for (let i = 0; i < width; i += 3) {
      if (Math.random() > 0.1) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
    }
    for (let j = 0; j < height; j += 3) {
      if (Math.random() > 0.1) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(width, j);
        ctx.stroke();
      }
    }
    // Subtle golden woven threads
    ctx.fillStyle = "rgba(196, 181, 157, 0.08)";
    for (let i = 0; i < 800; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      const length = 4 + Math.random() * 8;
      ctx.fillRect(rx, ry, length, 1);
    }
  } else {
    // Default high-finish warm letterpress paper pulp
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    for (let i = 0; i < 300; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      ctx.fillRect(rx, ry, 2, 2);
    }
  }

  ctx.restore();
}

function drawBeveledSlot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
  borderColor: string,
  borderWidth: number,
  slotBgColor: string,
  isTransparent: boolean
) {
  ctx.save();

  const path = new Path2D();
  if (radius > 1) {
    path.roundRect(x, y, w, h, radius);
  } else {
    path.rect(x, y, w, h);
  }

  // Set base background or transparent cutout
  if (!isTransparent) {
    ctx.fillStyle = slotBgColor;
    ctx.fill(path);
  }

  // CORE LETTERPRESS SHADOW: Deep 3D recess/beveled pocket effect
  ctx.save();
  ctx.clip(path);

  // Offset-recess inner stroke shadow
  ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 4;

  ctx.strokeStyle = "rgba(0, 0, 0, 0.55)";
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  // Stroke outer box bounds to cast a realistic bottom-inner shadow
  ctx.rect(x - 30, y - 30, w + 60, h + 60);
  if (radius > 1) {
    ctx.roundRect(x, y, w, h, radius);
  } else {
    ctx.rect(x, y, w, h);
  }
  ctx.stroke();
  ctx.restore();

  // Draw external high-fidelity beveled double hairline border
  if (borderWidth > 0) {
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.stroke(path);

    // Embossed dynamic highlights (top-left shimmer light, bottom-right ambient shading)
    ctx.save();
    ctx.clip(path);
    
    // Top-Left 3D illumination
    ctx.strokeStyle = "rgba(255, 255, 255, 0.65)";
    ctx.lineWidth = borderWidth * 0.7;
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.stroke();

    // Bottom-Right 3D tuck shadow
    ctx.strokeStyle = "rgba(0, 0, 0, 0.16)";
    ctx.lineWidth = borderWidth * 0.7;
    ctx.beginPath();
    ctx.moveTo(x + w, y);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.stroke();

    ctx.restore();
  }

  ctx.restore();
}

// ----------------------------------------------------------------------
// UNIFIED DECORATION RENDERER — single source of truth.
// Both the live preview and the canvas/PDF export derive their decoration
// from renderDecorativeSvg(). This rasterizes that exact SVG markup onto
// the export canvas, so what the client previews IS what exports/prints.
// ----------------------------------------------------------------------
async function renderDecorationLayer(
  ctx: CanvasRenderingContext2D,
  cardWidth: number,
  cardHeight: number,
  presetId: string,
  type: "strip" | "postcard" | "postcard-vertical",
  color: string,
  secondaryColor: string,
  borderColor: string,
  textPosition: "bottom" | "top",
  opacity: number
) {
  const inner = renderDecorativeSvg(presetId, type, color, secondaryColor, borderColor, textPosition);
  if (!inner || !inner.trim()) return;

  // viewBoxes mirror the live preview <svg> exactly (see live-template-canvas-viewport).
  const viewBox =
    type === "strip" ? "0 0 600 1800"
    : type === "postcard-vertical" ? "0 0 1200 1800"
    : "0 0 1800 1200";

  const svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${cardWidth}" height="${cardHeight}">${inner}</svg>`;
  const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgMarkup);

  await new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.drawImage(img, 0, 0, cardWidth, cardHeight);
      ctx.restore();
      resolve();
    };
    img.onerror = () => resolve();
    img.src = url;
  });
}

export default function WorkspacePage() {
  const [activePresetType, setActivePresetType] = useState<"strip" | "postcard" | "postcard-vertical">("strip");
  const [currentPreset, setCurrentPreset] = useState<PhotoboothPreset>(PRESETS[0]);

  // Master customized text inputs representing user's wedding data
  const [partnerOne, setPartnerOne] = useState("");
  const [partnerTwo, setPartnerTwo] = useState("");
  const [textSeparator, setTextSeparator] = useState("&");
  const [weddingDate, setWeddingDate] = useState("");
  const [weddingVenue, setWeddingVenue] = useState("");

  // Typography override settings
  const [partnerFont, setPartnerFont] = useState(LUXURY_FONTS[0].css);
  const [dateFont, setDateFont] = useState(LUXURY_FONTS[13].css);
  const [venueFont, setVenueFont] = useState(LUXURY_FONTS[13].css);

  const [partnerFontSize, setPartnerFontSize] = useState(26);
  const [dateFontSize, setDateFontSize] = useState(10);
  const [venueFontSize, setVenueFontSize] = useState(9);

  const [partnerLetterSpacing, setPartnerLetterSpacing] = useState(2);
  const [dateLetterSpacing, setDateLetterSpacing] = useState(4);
  const [venueLetterSpacing, setVenueLetterSpacing] = useState(6);

  const [partnerFontWeight, setPartnerFontWeight] = useState<"font-normal" | "font-semibold" | "font-bold" | "font-black">("font-bold");
  const [partnerItalic, setPartnerItalic] = useState(false);

  // Custom uploaded template base photo
  const [customBasePhoto, setCustomBasePhoto] = useState<string | null>(null);

  // Transparent slots mode
  const [useTransparentSlots, setUseTransparentSlots] = useState(false);

  // Advanced Export Settings States for Professional Production Layers
  const [exportMode, setExportMode] = useState<"composite" | "layers" | "luma-overlay" | "pdf-print">("composite");
  const [pdfLayoutType, setPdfLayoutType] = useState<"single-page" | "multi-page">("single-page");
  const [exportCmykMode, setExportCmykMode] = useState(true);

  // Design adjustments (dynamic states synchronized with chosen preset, but user can tweak)
  const [backgroundColor, setBackgroundColor] = useState(PRESETS[0].backgroundColor);
  const [textColor, setTextColor] = useState(PRESETS[0].textColor);
  const [borderColor, setBorderColor] = useState(PRESETS[0].borderColor);
  const [secondaryColor, setSecondaryColor] = useState(PRESETS[0].secondaryColor);
  
  const [slotBorderRadius, setSlotBorderRadius] = useState(PRESETS[0].slotBorderRadius);
  const [slotBorderWidth, setSlotBorderWidth] = useState(PRESETS[0].slotBorderWidth);
  const [slotGap, setSlotGap] = useState(PRESETS[0].slotGap);
  const [slotBgColor, setSlotBgColor] = useState(PRESETS[0].slotBgColor);
  const [innerSpacing, setInnerSpacing] = useState(PRESETS[0].innerSpacing);
  const [textPosition, setTextPosition] = useState<"bottom" | "top">("bottom");
  const [graphicOpacity, setGraphicOpacity] = useState<number>(100);

  // Copy state
  const [copied, setCopied] = useState(false);

  // Active Harmony Palette tracking state
  const [activePaletteId, setActivePaletteId] = useState<string | null>(null);

  // Client-to-Admin Local Draft Bridge
  const [draftSelection, setDraftSelection] = useState<any | null>(null);
  const [showDraftBanner, setShowDraftBanner] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const selections = JSON.parse(localStorage.getItem("katha_selections") || "[]");
      if (selections && selections.length > 0) {
        const latest = selections[0];
        const params = new URLSearchParams(window.location.search);
        if (!params.get("names") && !params.get("preset")) {
          setDraftSelection(latest);
          setShowDraftBanner(true);
        }
      }
    } catch (e) {}
  }, []);

  const applyDraftSelection = () => {
    if (!draftSelection) return;
    const matchedPreset = PRESETS.find(p => p.id === draftSelection.templateId);
    if (matchedPreset) {
      setCurrentPreset(matchedPreset);
      setBackgroundColor(matchedPreset.backgroundColor);
      setTextColor(matchedPreset.textColor);
      setBorderColor(matchedPreset.borderColor);
      setSecondaryColor(matchedPreset.secondaryColor);
      setGraphicOpacity(100);
      setActivePaletteId(null);
      if (matchedPreset.type) {
        setActivePresetType(matchedPreset.type as any);
      }
      const matchedFont = LUXURY_FONTS.find(f => f.css.toLowerCase() === (draftSelection.fontFamily || matchedPreset.fontFamily).toLowerCase()) || LUXURY_FONTS[0];
      setPartnerFont(matchedFont.css);
      setSlotBorderRadius(matchedPreset.slotBorderRadius);
      setSlotBorderWidth(matchedPreset.slotBorderWidth);
      setSlotGap(matchedPreset.slotGap);
      setSlotBgColor(matchedPreset.slotBgColor);
      setInnerSpacing(matchedPreset.innerSpacing);
    }
    const namesVal = draftSelection.names || "";
    if (namesVal) {
      let separator = "&";
      let parts = [namesVal];
      for (const sep of [" & ", " AND ", " and ", " ♥ ", " ● "]) {
        if (namesVal.includes(sep)) {
          separator = sep.trim();
          parts = namesVal.split(sep);
          break;
        }
      }
      if (parts[0]) setPartnerOne(parts[0].trim());
      if (parts[1]) setPartnerTwo(parts[1].trim());
      setTextSeparator(separator);
    }
    if (draftSelection.date) setWeddingDate(draftSelection.date);
    if (draftSelection.venue) setWeddingVenue(draftSelection.venue);
    if (draftSelection.textPosition) setTextPosition(draftSelection.textPosition);
    setShowDraftBanner(false);
  };

  // Auto-fill and auto-design bridge: parse search params on load
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);

    // 1. Set layout dynamics first to allow correct slot positioning
    const layoutParam = params.get("layout");
    if (layoutParam === "strip" || layoutParam === "postcard" || layoutParam === "postcard-vertical") {
      setActivePresetType(layoutParam);
    }

    // 2. Select preset dynamically
    const presetParam = params.get("preset");
    if (presetParam) {
      const matchedPreset = PRESETS.find(p => p.id === presetParam);
      if (matchedPreset) {
        setCurrentPreset(matchedPreset);
        setBackgroundColor(matchedPreset.backgroundColor);
        setTextColor(matchedPreset.textColor);
        setBorderColor(matchedPreset.borderColor);
        setSecondaryColor(matchedPreset.secondaryColor);
        setGraphicOpacity(100);
        setActivePaletteId(null);
        if (matchedPreset.type) {
          setActivePresetType(matchedPreset.type as any);
        }

        // Set matching typography based on preset
        const matchedFont = LUXURY_FONTS.find(f => f.css.toLowerCase() === matchedPreset.fontFamily.toLowerCase()) || LUXURY_FONTS[0];
        setPartnerFont(matchedFont.css);

        setSlotBorderRadius(matchedPreset.slotBorderRadius);
        setSlotBorderWidth(matchedPreset.slotBorderWidth);
        setSlotGap(matchedPreset.slotGap);
        setSlotBgColor(matchedPreset.slotBgColor);
        setInnerSpacing(matchedPreset.innerSpacing);
      }
    }

    // 3. Set names dynamically
    const namesParam = params.get("names");
    if (namesParam) {
      let separator = "&";
      let parts = [namesParam];
      for (const sep of [" & ", " AND ", " and ", " ♥ ", " ● "]) {
        if (namesParam.includes(sep)) {
          separator = sep.trim();
          parts = namesParam.split(sep);
          break;
        }
      }
      if (parts[0]) setPartnerOne(parts[0].trim());
      if (parts[1]) setPartnerTwo(parts[1].trim());
      setTextSeparator(separator);
    }

    // 4. Set date dynamically
    const dateParam = params.get("date");
    if (dateParam) {
      setWeddingDate(dateParam);
    }

    // 5. Set venue dynamically
    const venueParam = params.get("venue");
    if (venueParam) {
      setWeddingVenue(venueParam);
    }

    // 6. Set custom font override dynamically
    const fontParam = params.get("font");
    if (fontParam) {
      const matchedFont = LUXURY_FONTS.find(
        f => f.css.toLowerCase() === fontParam.toLowerCase() || 
             f.name.toLowerCase() === fontParam.toLowerCase()
      );
      if (matchedFont) {
        setPartnerFont(matchedFont.css);
      }
    }
  }, []);


  const applyPalette = (palette: typeof HARMONY_PALETTES[0]) => {
    setBackgroundColor(palette.bg);
    setTextColor(palette.text);
    setSecondaryColor(palette.secondary);
    setBorderColor(palette.border);
    setSlotBgColor(palette.slotBg);
    setActivePaletteId(palette.id);
  };

  const cyclePalette = () => {
    const currentIndex = HARMONY_PALETTES.findIndex(p => p.id === activePaletteId);
    const nextIndex = (currentIndex + 1) % HARMONY_PALETTES.length;
    applyPalette(HARMONY_PALETTES[nextIndex]);
  };


  // Sync state on preset changes
  const handleSelectPreset = (preset: PhotoboothPreset) => {
    setCurrentPreset(preset);
    setBackgroundColor(preset.backgroundColor);
    setTextColor(preset.textColor);
    setBorderColor(preset.borderColor);
    setSecondaryColor(preset.secondaryColor);
    setGraphicOpacity(100);
    setActivePaletteId(null);
    
    if (preset.type) {
      setActivePresetType(preset.type as any);
    }

    if (preset.id === "rose-whisper-postcard") {
      setPartnerOne("Tracy");
      setPartnerTwo("Prince");
      setTextSeparator("&");
      setWeddingDate("");
      setWeddingVenue("");
    }

    // Attempt to match custom font dropdown states depending on theme
    const matchedFont = LUXURY_FONTS.find(f => f.css.toLowerCase() === preset.fontFamily.toLowerCase()) || LUXURY_FONTS[0];
    setPartnerFont(matchedFont.css);

    // Provide default elegant sizes based on the preset design language
    if (preset.id === "wedding-editorial") {
      setPartnerFontSize(22);
      setPartnerLetterSpacing(8);
      setPartnerFontWeight("font-normal");
      setPartnerItalic(false);
    } else if (preset.id === "wedding-willow-vine" || preset.id === "wedding-dusty-rose" || preset.id === "wedding-vintage-lace") {
      setPartnerFontSize(38);
      setPartnerLetterSpacing(1);
      setPartnerFontWeight("font-normal");
      setPartnerItalic(false);
    } else if (preset.id === "rose-whisper-postcard") {
      setPartnerFontSize(36);
      setPartnerLetterSpacing(2);
      setPartnerFontWeight("font-normal");
      setPartnerItalic(true);
    } else {
      setPartnerFontSize(26);
      setPartnerLetterSpacing(3);
      setPartnerFontWeight("font-bold");
      setPartnerItalic(preset.fontFamily.includes("serif"));
    }

    setSlotBorderRadius(preset.slotBorderRadius);
    setSlotBorderWidth(preset.slotBorderWidth);
    setSlotGap(preset.slotGap);
    setSlotBgColor(preset.slotBgColor);
    setInnerSpacing(preset.innerSpacing);
  };

  const handleTypeToggle = (type: "strip" | "postcard" | "postcard-vertical") => {
    setActivePresetType(type);
    const matchingStyle = PRESETS.find(p => p.id === currentPreset.id) || PRESETS[0];
    
    const revisedPreset = {
      ...matchingStyle,
      type: type,
      slotGap: type === "postcard" ? "18px" : (type === "postcard-vertical" ? "20px" : matchingStyle.slotGap),
      innerSpacing: type === "postcard" ? "28px" : (type === "postcard-vertical" ? "40px" : matchingStyle.innerSpacing),
    };
    
    handleSelectPreset(revisedPreset);
  };

  const clearCustomBasePhoto = () => {
    setCustomBasePhoto(null);
  };

  const getDerivedNames = () => {
    const p1 = partnerOne.trim();
    const p2 = partnerTwo.trim();
    if (!p1 && !p2) return "";
    if (p1 && !p2) return p1;
    if (!p1 && p2) return p2;
    return `${p1} ${textSeparator} ${p2}`;
  };

  const getDerivedDate = () => {
    return weddingDate.trim();
  };

  const getDerivedVenue = () => {
    return weddingVenue.trim();
  };

  // Adjust Hex colors to have muted, accurate CMYK target equivalents for fine printed outputs
  const adjustColorForCmyk = (hexColor: string) => {
    if (!exportCmykMode) return hexColor;
    let hex = hexColor.replace("#", "");
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) return hexColor;

    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Tone down bright digital neons for narrow physical pigment margins
    r = Math.round(r * 0.92);
    g = Math.round(g * 0.90);
    b = Math.round(b * 0.88);

    const rHex = r.toString(16).padStart(2, '0');
    const gHex = g.toString(16).padStart(2, '0');
    const bHex = b.toString(16).padStart(2, '0');

    return `#${rHex}${gHex}${bHex}`;
  };

  // Dedicated High-Resolution Layer Canvas Generator
  const generateTemplateCanvas = async (layer: "all" | "background" | "slots" | "text" | "vectors") => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const scaleFactor = 3.0; // HD multiplier
    const cardWidth = activePresetType === "strip" ? 600 * scaleFactor : (activePresetType === "postcard-vertical" ? 1200 : 1800);
    const cardHeight = activePresetType === "strip" ? 1800 * scaleFactor : (activePresetType === "postcard-vertical" ? 1800 : 1200);

    canvas.width = cardWidth;
    canvas.height = cardHeight;

    const currentBgColor = adjustColorForCmyk(backgroundColor);
    const currentTextColor = adjustColorForCmyk(textColor);
    const currentBorderColor = adjustColorForCmyk(borderColor);
    const currentSecColor = adjustColorForCmyk(secondaryColor);
    const currentSlotBgColor = adjustColorForCmyk(slotBgColor);

    // 1. Draw Background Layer
    if (layer === "all" || layer === "background") {
      if (useTransparentSlots && !customBasePhoto && layer === "all") {
        ctx.clearRect(0, 0, cardWidth, cardHeight);
      } else {
        drawPaperTexture(ctx, cardWidth, cardHeight, currentPreset.id, currentBgColor);
      }

      if (customBasePhoto) {
        try {
          const bgImg = new Image();
          bgImg.crossOrigin = "anonymous";
          await new Promise<void>((resolve, reject) => {
            bgImg.onload = () => {
              ctx.drawImage(bgImg, 0, 0, cardWidth, cardHeight);
              resolve();
            };
            bgImg.onerror = () => reject();
            bgImg.src = customBasePhoto;
          });
        } catch (e) {
          console.error("Error drawing template base image", e);
        }
      }

      // If Heritage Sage green, draw its background band as part of the background layer
      if (!useTransparentSlots && currentPreset.id === "wedding-heritage-sage") {
        const bannerHeight = 240 * scaleFactor;
        ctx.fillStyle = currentSecColor;
        const bannerY = textPosition === "top" ? 0 : cardHeight - bannerHeight;
        ctx.fillRect(0, bannerY, cardWidth, bannerHeight);
      }
    } else {
      ctx.clearRect(0, 0, cardWidth, cardHeight);
    }

    const parsedPadding = parseInt(innerSpacing) * scaleFactor;
    const parsedGap = parseInt(slotGap) * scaleFactor;
    const parsedRadius = parseInt(slotBorderRadius) * scaleFactor;
    const borderWidth = parseInt(slotBorderWidth) * scaleFactor;

    // 2. Draw Decorative Vectors / Frames Layer
    // UNIFIED: rasterize the exact same SVG the live preview renders, so
    // export == preview == print. Single source of truth: renderDecorativeSvg().
    if (layer === "all" || layer === "vectors") {
      await renderDecorationLayer(
        ctx,
        cardWidth,
        cardHeight,
        currentPreset.id,
        activePresetType,
        currentTextColor,
        currentSecColor,
        currentBorderColor,
        textPosition,
        graphicOpacity / 100
      );
    }

    // 3. Draw Photo Slots Mask & Outlines Layer — DATA-DRIVEN
    // Slot rectangles come from lib/layouts.js (the single source of truth).
    // Per-format magic numbers, mentor spacing, L/Γ arrangements — all live
    // there as data. Canvas export, studio preview, and gallery thumbnails
    // all read the same definitions.
    if (layer === "all" || layer === "slots") {
      const isGoldBorder = ["wedding-luxe-gold", "wedding-art-deco", "wedding-warm-terracotta"].includes(currentPreset.id);
      const rawLayoutDef = resolveLayout(currentPreset.layoutId, activePresetType);
      const layoutDef = getModifiedLayout(rawLayoutDef, textPosition);
      const vb = VIEWBOX[activePresetType];
      // Map viewBox units → canvas pixels for the active export
      const sx = cardWidth / vb.w;
      const sy = cardHeight / vb.h;
      for (let i = 0; i < layoutDef.slots.length; i++) {
        const s = layoutDef.slots[i];
        let x = s.x * sx;
        let y = s.y * sy;
        let sw = s.w * sx;
        let sh = s.h * sy;

        if (layer === "slots") {
          // Standard Opaque Matte slots mask for clip masks (Solid Black)
          ctx.fillStyle = "#000000";
          ctx.fillRect(x, y, sw, sh);

          if (borderWidth > 0) {
            ctx.strokeStyle = currentBorderColor;
            ctx.lineWidth = borderWidth;
            ctx.strokeRect(x, y, sw, sh);
          }
        } else {
          // Dynamic slot border gradient (e.g. gold borders for foil presets)
          let slotBorderParam = currentBorderColor;
          if (isGoldBorder && borderWidth > 0) {
            const grad = ctx.createLinearGradient(x, y, x + sw, y + sh);
            grad.addColorStop(0, "#C5A85C");
            grad.addColorStop(0.3, "#FFF5DC");
            grad.addColorStop(0.6, "#A38036");
            grad.addColorStop(1, "#C5A85C");
            slotBorderParam = grad as any;
          }

          // Combined physical rendering with 3D Beveled tuck-in shadow
          drawBeveledSlot(
            ctx,
            x,
            y,
            sw,
            sh,
            parsedRadius,
            slotBorderParam,
            borderWidth,
            currentSlotBgColor,
            useTransparentSlots
          );

          // (Decoration — incl. white-rose sprig and terracotta leaf — is now drawn
          // by the unified renderDecorationLayer() so preview matches export. No
          // canvas-only accessory graphics here, which previously diverged.)
        }
      }
    }

    // 4. Draw Elegant Customized Typography
    if (layer === "all" || layer === "text") {
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const partnerCleanFont = partnerFont.replace(/[']/g, "");
      const dateCleanFont = dateFont.replace(/[']/g, "");
      const venueCleanFont = venueFont.replace(/[']/g, "");

      const isCursive = currentPreset.fontFamily.toLowerCase().includes("cursive") || partnerFont.toLowerCase().includes("cursive");
      const namesText = isCursive ? getDerivedNames() : getDerivedNames().toUpperCase();

      if (activePresetType === "strip") {
        const finalTextColor = currentPreset.id === "wedding-heritage-sage" ? "#FFFFFF" : currentTextColor;
        const finalSecColor = currentPreset.id === "wedding-heritage-sage" ? "#E2E2DF" : currentSecColor;

        const dText = getDerivedDate().trim();
        const vText = getDerivedVenue().trim();
        const nText = namesText.trim();
        const hasDate = dText !== "" && dText.toUpperCase() !== "DO NOT INCLUDE EVENT DATE";
        const hasVenue = vText !== "";
        const hasNames = nText !== "";

        let totalTextHeight = 0;
        if (hasNames) totalTextHeight += partnerFontSize * scaleFactor;
        if (hasDate) totalTextHeight += (hasNames ? 50 * scaleFactor : dateFontSize * scaleFactor);
        if (hasVenue) totalTextHeight += (hasDate || hasNames ? 35 * scaleFactor : venueFontSize * scaleFactor);

        const rawLayout = resolveLayout(currentPreset.layoutId, "strip");
        const layout = getModifiedLayout(rawLayout, textPosition);
        const tz = layout.textZone;
        const textZoneCenterY = (tz.y + tz.h / 2) * scaleFactor;
        const firstLineHeight = hasNames ? partnerFontSize * scaleFactor : (hasDate ? dateFontSize * scaleFactor : venueFontSize * scaleFactor);

        let currentY = textZoneCenterY - (totalTextHeight / 2) + (firstLineHeight / 2);

        if (hasNames) {
          ctx.font = `${partnerItalic ? "italic " : ""}${partnerFontWeight.replace("font-", "")} ${partnerFontSize * scaleFactor}px ${partnerCleanFont}`;
          ctx.fillStyle = finalTextColor;
          ctx.fillText(nText, (tz.x + tz.w / 2) * scaleFactor, currentY);
          currentY += 50 * scaleFactor;
        }
        
        if (hasDate) {
          ctx.font = `bold ${dateFontSize * scaleFactor}px ${dateCleanFont}`;
          ctx.fillStyle = finalSecColor;
          ctx.fillText(dText.toUpperCase(), (tz.x + tz.w / 2) * scaleFactor, currentY);
          currentY += 35 * scaleFactor;
        }

        if (hasVenue) {
          ctx.font = `normal ${venueFontSize * scaleFactor}px ${venueCleanFont}`;
          ctx.fillStyle = finalTextColor;
          ctx.fillText(vText.toUpperCase(), (tz.x + tz.w / 2) * scaleFactor, currentY);
        }
      } else if (activePresetType === "postcard-vertical") {
        const finalTextColor = currentPreset.id === "wedding-heritage-sage" ? "#FFFFFF" : currentTextColor;
        const finalSecColor = currentPreset.id === "wedding-heritage-sage" ? "#E2E2DF" : currentSecColor;

        // Strip whitespaces out to check if date and venue are excluded
        const dText = getDerivedDate().trim();
        const vText = getDerivedVenue().trim();
        const nText = namesText.trim();
        const hasDate = dText !== "" && dText.toUpperCase() !== "DO NOT INCLUDE EVENT DATE";
        const hasVenue = vText !== "";
        const hasNames = nText !== "";

        let totalTextHeight = 0;
        if (hasNames) totalTextHeight += partnerFontSize * scaleFactor;
        if (hasDate) totalTextHeight += (hasNames ? 45 * scaleFactor : dateFontSize * scaleFactor);
        if (hasVenue) totalTextHeight += (hasDate || hasNames ? 35 * scaleFactor : venueFontSize * scaleFactor);

        const rawLayout = resolveLayout(currentPreset.layoutId, "postcard-vertical");
        const layout = getModifiedLayout(rawLayout, textPosition);
        const tz = layout.textZone;
        const textZoneCenterY = (tz.y + tz.h / 2);
        const firstLineHeight = hasNames ? partnerFontSize * scaleFactor : (hasDate ? dateFontSize * scaleFactor : venueFontSize * scaleFactor);

        let currentY = textZoneCenterY - (totalTextHeight / 2) + (firstLineHeight / 2);

        if (hasNames) {
          ctx.font = `${partnerItalic ? "italic " : ""}${partnerFontWeight.replace("font-", "")} ${partnerFontSize * scaleFactor}px ${partnerCleanFont}`;
          ctx.fillStyle = finalTextColor;
          ctx.fillText(nText, (tz.x + tz.w / 2), currentY);
          currentY += 45 * scaleFactor;
        }

        if (hasDate) {
          ctx.font = `bold ${dateFontSize * scaleFactor}px ${dateCleanFont}`;
          ctx.fillStyle = finalSecColor;
          ctx.fillText(dText.toUpperCase(), (tz.x + tz.w / 2), currentY);
          currentY += 35 * scaleFactor;
        }
        
        if (hasVenue) {
          ctx.font = `normal ${venueFontSize * scaleFactor}px ${venueCleanFont}`;
          ctx.fillStyle = finalTextColor;
          ctx.fillText(vText.toUpperCase(), (tz.x + tz.w / 2), currentY);
        }
      } else {
        const dText = getDerivedDate().trim();
        const vText = getDerivedVenue().trim();
        const nText = namesText.trim();
        const hasDate = dText !== "" && dText.toUpperCase() !== "DO NOT INCLUDE EVENT DATE";
        const hasVenue = vText !== "";
        const hasNames = nText !== "";

        let totalTextHeight = 0;
        if (hasNames) totalTextHeight += partnerFontSize * 1.5;
        if (hasDate) totalTextHeight += (hasNames ? 54 : dateFontSize * 1.5);
        if (hasVenue) totalTextHeight += (hasDate || hasNames ? 41 : venueFontSize * 1.5);

        const rawLayout = resolveLayout(currentPreset.layoutId, "postcard");
        const layout = getModifiedLayout(rawLayout, textPosition);
        const tz = layout.textZone;
        const textZoneCenterY = (tz.y + tz.h / 2);
        const firstLineHeight = hasNames ? partnerFontSize * 1.5 : (hasDate ? dateFontSize * 1.5 : venueFontSize * 1.5);

        let currentY = textZoneCenterY - (totalTextHeight / 2) + (firstLineHeight / 2);

        const finalTextColor = currentPreset.id === "wedding-heritage-sage" ? "#FFFFFF" : currentTextColor;
        const finalSecColor = currentPreset.id === "wedding-heritage-sage" ? "#E2E2DF" : currentSecColor;

        if (hasNames) {
          ctx.font = `${partnerItalic ? "italic " : ""}${partnerFontWeight.replace("font-", "")} ${partnerFontSize * 1.5}px ${partnerCleanFont}`;
          ctx.fillStyle = finalTextColor;
          ctx.fillText(nText, (tz.x + tz.w / 2), currentY);
          currentY += 54;
        }

        if (hasDate) {
          ctx.font = `bold ${dateFontSize * 1.5}px ${dateCleanFont}`;
          ctx.fillStyle = finalSecColor;
          ctx.fillText(dText.toUpperCase(), (tz.x + tz.w / 2), currentY);
          currentY += 41;
        }

        if (hasVenue) {
          ctx.font = `normal ${venueFontSize * 1.5}px ${venueCleanFont}`;
          ctx.fillStyle = finalTextColor;
          ctx.fillText(vText.toUpperCase(), (tz.x + tz.w / 2), currentY);
        }
      }
    }

    return canvas;
  };

  // Dispatch Hub trigger handling standard, individual layers, or high-definition CMYK PDF format
  const handleDownload = async () => {
    const baseSlug = getDerivedNames().toLowerCase().replace(/[^a-z0-9]/g, "_");

    try {
      if (exportMode === "composite") {
        // Standard Flat Screen download
        const canvas = await generateTemplateCanvas("all");
        if (!canvas) return;

        const dataUrl = canvas.toDataURL("image/png");
        const downloadNode = document.createElement("a");
        downloadNode.href = dataUrl;
        downloadNode.download = `${baseSlug}_wedding_overlay_composite.png`;
        downloadNode.click();
      } else if (exportMode === "layers") {
        // Professional Layer separation (Background, Slots, Text, and Vectors) as separate transparent PNG outputs
        const layersConfig: { key: "background" | "slots" | "text" | "vectors"; suffix: string }[] = [
          { key: "background", suffix: "1_background" },
          { key: "slots", suffix: "2_photo_slots_mask" },
          { key: "text", suffix: "3_text_stationery" },
          { key: "vectors", suffix: "4_decorative_vectors" }
        ];

        for (let i = 0; i < layersConfig.length; i++) {
          const item = layersConfig[i];
          // Timeout separates the requests elegantly to guarantee concurrent download registration is bypassable
          setTimeout(async () => {
            try {
              const canvas = await generateTemplateCanvas(item.key);
              if (!canvas) return;

              const dataUrl = canvas.toDataURL("image/png");
              const downloadNode = document.createElement("a");
              downloadNode.href = dataUrl;
              downloadNode.download = `${baseSlug}_layer_${item.suffix}.png`;
              downloadNode.click();
            } catch (err) {
              console.error("Export layer failure:", err);
              alert('Failed to generate export. Please try a different preset or check your browser console.');
            }
          }, i * 180);
        }
      } else if (exportMode === "luma-overlay") {
        // Alpha-transparent overlay for Luma Booth: decoration + text on transparent bg.
        // This is the single PNG that Luma composites on top of photos during the event.
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const scaleFactor = 3.0;
          const cw = activePresetType === "strip" ? 600 * scaleFactor : (activePresetType === "postcard-vertical" ? 1200 : 1800);
          const ch = activePresetType === "strip" ? 1800 * scaleFactor : (activePresetType === "postcard-vertical" ? 1800 : 1200);
          canvas.width = cw;
          canvas.height = ch;
          ctx.clearRect(0, 0, cw, ch);

          // Draw decoration layer (vectors/frames)
          const vecCanvas = await generateTemplateCanvas("vectors");
          if (vecCanvas) ctx.drawImage(vecCanvas, 0, 0);

          // Draw text layer
          const txtCanvas = await generateTemplateCanvas("text");
          if (txtCanvas) ctx.drawImage(txtCanvas, 0, 0);

          const dataUrl = canvas.toDataURL("image/png");
          const downloadNode = document.createElement("a");
          downloadNode.href = dataUrl;
          downloadNode.download = `${baseSlug}_luma_overlay_alpha.png`;
          downloadNode.click();
        }
      } else if (exportMode === "pdf-print") {
        // High-Fidelity 300DPI printed PDF formulation (Color managed / CMYK calibration optimization)
        const isStrip = activePresetType === "strip";
        const isPVertical = activePresetType === "postcard-vertical";
        const w = isStrip ? 2 : (isPVertical ? 4 : 6);
        const h = isStrip ? 6 : (isPVertical ? 6 : 4);

        const doc = new jsPDF({
          orientation: (isStrip || isPVertical) ? "portrait" : "landscape",
          unit: "in",
          format: (isStrip || isPVertical) ? [isStrip ? 2 : 4, 6] : [6, 4]
        });

        if (pdfLayoutType === "multi-page") {
          // Multi-page separate layers representation
          const layersList: ("background" | "slots" | "text" | "vectors")[] = ["background", "slots", "text", "vectors"];
          for (let i = 0; i < layersList.length; i++) {
            if (i > 0) doc.addPage();
            const layerCanvas = await generateTemplateCanvas(layersList[i]);
            if (layerCanvas) {
              const imgData = layerCanvas.toDataURL("image/png");
              doc.addImage(imgData, "PNG", 0, 0, w, h, undefined, "FAST");
            }
          }
        } else {
          // Single composite page
          const canvas = await generateTemplateCanvas("all");
          if (canvas) {
            const imgData = canvas.toDataURL("image/png");
            doc.addImage(imgData, "PNG", 0, 0, w, h, undefined, "FAST");
          }
        }

        doc.save(`${baseSlug}_wedding_overlay_cmyk_print.pdf`);
      }
    } catch (err) {
      console.error("Export failure:", err);
      alert('Failed to generate export. Please try a different preset or check your browser console.');
    }
  };

  const copyConfigSpec = () => {
    const config = {
      themeName: currentPreset.name,
      coupleNames: getDerivedNames(),
      weddingDate: getDerivedDate(),
      venue: getDerivedVenue(),
      layoutType: activePresetType,
      backgroundColor,
      textColor,
      borderColor,
      secondaryColor,
      partnerFont,
      dateFont,
      venueFont,
      partnerFontSize,
      slotBorderRadius,
      slotBorderWidth,
      slotGap,
      slotBgColor,
      innerSpacing,
      useTransparentSlots,
      textPosition,
      graphicOpacity
    };
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stationeryTextElement = (
    <div
      style={{
        color: currentPreset.id === "wedding-heritage-sage" && activePresetType === "strip" ? "#FFFFFF" : textColor,
        minHeight: activePresetType === "strip" ? "28%" : activePresetType === "postcard-vertical" ? "23%" : "27%",
        paddingTop: textPosition === "bottom" ? (activePresetType === "strip" ? "12px" : "8px") : "4px",
        paddingBottom: textPosition === "top" ? (activePresetType === "strip" ? "12px" : "8px") : "4px",
      }}
      className={cn(
        "flex flex-col text-center relative z-25 justify-center shrink-0",
        textPosition === "top" ? "mb-auto" : "mt-auto",
      )}
    >
      {getDerivedNames() !== "" && (
        <h3 
          style={{ 
            fontFamily: partnerFont,
            fontSize: `${partnerFontSize}px`,
            letterSpacing: `${partnerLetterSpacing}px`,
          }}
          className={cn(
            "leading-none",
            (currentPreset.fontFamily.toLowerCase().includes("cursive") || partnerFont.toLowerCase().includes("cursive")) ? "normal-case" : "uppercase",
            partnerFontWeight,
            partnerItalic ? "italic" : ""
          )}
        >
          {getDerivedNames()}
        </h3>
      )}
      
      {getDerivedDate() && getDerivedDate().trim() !== "" && getDerivedDate().toUpperCase() !== "DO NOT INCLUDE EVENT DATE" && (
        <p 
          style={{ 
            fontFamily: dateFont,
            fontSize: `${dateFontSize}px`,
            letterSpacing: `${dateLetterSpacing}px`,
            color: currentPreset.id === "wedding-heritage-sage" ? "#E2E2DF" : secondaryColor 
          }}
          className="font-bold uppercase mt-1 leading-none text-stone-550"
        >
          {getDerivedDate()}
        </p>
      )}

      {getDerivedVenue() && getDerivedVenue().trim() !== "" && (
        <span 
          style={{
            fontFamily: venueFont,
            fontSize: `${venueFontSize}px`,
            letterSpacing: `${venueLetterSpacing}px`,
          }}
          className={cn(
            "select-none block opacity-78 uppercase mt-1.5",
            currentPreset.id === "wedding-heritage-sage" ? "text-stone-100" : "text-stone-405"
          )}
        >
          {getDerivedVenue()}
        </span>
      )}
    </div>
  );

  return (
    <main id="app-root-container" className="min-h-screen bg-[#FAF9F5] text-stone-900 flex flex-col font-sans selection:bg-stone-200 selection:text-stone-950">
      
      {/* Bridal Header Branding */}
      <header id="app-header" className="h-16 border-b border-stone-200/60 bg-white px-6 md:px-10 flex items-center justify-between sticky top-0 z-50 shadow-2xs">
        <div className="flex items-center space-x-3">
          <Heart className="w-4 h-4 text-[#8A7342] fill-[#8A7342]" />
          <span className="text-xl font-serif italic tracking-tight font-black text-stone-950">Katha Template Studio</span>
          <span className="h-4 w-px bg-stone-200" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#a8a29e]">Photo Strip &amp; Postcard Template Library</span>
        </div>

        <div className="flex items-center space-x-6 text-xs">
          <div className="flex flex-col items-end">
            <span className="text-[9px] uppercase font-bold tracking-widest text-stone-400">Heirloom Catalog</span>
            <span className="font-mono text-stone-700 font-bold text-[10px]">{PRESETS.length} templates</span>
          </div>
          <div className="hidden sm:flex flex-col items-end border-l border-stone-200 pl-6">
            <span className="text-[9px] uppercase font-bold tracking-widest text-[#a8a29e]">Rendering Platform</span>
            <span className="font-mono text-stone-800 font-bold flex items-center gap-1.5 text-[10.5px]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" /> Precision Vectors active
            </span>
          </div>
        </div>
      </header>

      {showDraftBanner && draftSelection && (
        <div className="bg-[#FAF1EA] border-b border-[#C4B59D]/50 px-6 py-2.5 flex items-center justify-between text-xs text-stone-800 animate-fade-in relative z-40">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center bg-[#8C382A]/10 text-[#8C382A] rounded-full w-5 h-5 font-bold text-[10px]">✨</span>
            <span className="font-light">
              Found a recent gallery selection for <strong>{draftSelection.names || "Gallery Guest"}</strong> ({draftSelection.templateName}). Load this draft into the template studio?
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={applyDraftSelection}
              className="bg-stone-900 hover:bg-stone-800 text-white font-bold py-1 px-3 rounded-full uppercase tracking-wider text-[9px] transition-all cursor-pointer"
            >
              Apply Selection Draft
            </button>
            <button
              onClick={() => setShowDraftBanner(false)}
              className="text-stone-400 hover:text-stone-600 font-bold transition-all cursor-pointer text-sm"
              aria-label="Dismiss draft banner"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Sandbox Catalog Panel */}
      <div id="app-workspace-body" className="flex-1 flex flex-col lg:flex-row min-h-0">
        
        {/* SIDEBAR LEFT: CLIENT PERSONALIZATION CONTROLS */}
        <aside id="workspace-sidebar" className="lg:w-[380px] border-b lg:border-b-0 lg:border-r border-stone-200 bg-white p-5 flex flex-col gap-5 shrink-0 overflow-y-auto lg:h-[calc(100vh-64px)]">
          
          {/* Quick toggle between Strip, Landscape Postcard & Vertical Postcard */}
          <div>
            <div className="text-[11px] uppercase font-bold tracking-widest text-stone-400 mb-2 px-0.5 flex items-center justify-between">
              <span>Layout Ratio Mode</span>
              <span className="text-[9px] italic text-[#8A7342] font-mono">
                {activePresetType === "postcard-vertical" ? "2 stacked slots" : "3 layout slots"}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-1 p-1 bg-stone-50 rounded-md border border-stone-200/80">
              <button
                id="toggle-factor-strip"
                onClick={() => handleTypeToggle("strip")}
                className={cn(
                  "py-1.5 px-0.5 text-[9.5px] font-bold uppercase tracking-wider text-center cursor-pointer transition-all rounded-sm leading-tight",
                  activePresetType === "strip"
                    ? "bg-white text-stone-950 shadow-2xs border border-stone-200"
                    : "text-stone-500 hover:text-stone-800"
                )}
              >
                2&quot;x6&quot; Strip
              </button>
              <button
                id="toggle-factor-postcard-vertical"
                onClick={() => handleTypeToggle("postcard-vertical")}
                className={cn(
                  "py-1.5 px-0.5 text-[9.5px] font-bold uppercase tracking-wider text-center cursor-pointer transition-all rounded-sm leading-tight",
                  activePresetType === "postcard-vertical"
                    ? "bg-white text-stone-950 shadow-2xs border border-stone-200"
                    : "text-stone-500 hover:text-stone-800"
                )}
              >
                4&quot;x6&quot; Postcard
              </button>
              <button
                id="toggle-factor-postcard"
                onClick={() => handleTypeToggle("postcard")}
                className={cn(
                  "py-1.5 px-0.5 text-[9.5px] font-bold uppercase tracking-wider text-center cursor-pointer transition-all rounded-sm leading-tight",
                  activePresetType === "postcard"
                    ? "bg-white text-stone-950 shadow-2xs border border-stone-200"
                    : "text-stone-500 hover:text-stone-800"
                )}
              >
                6&quot;x4&quot; Postcard
              </button>
            </div>
          </div>

          {/* BRIDAL CLIENT REALTIME CUSTOMIZER FIELDS */}
          <div className="border-t border-stone-100 pt-4 space-y-3">
            <div className="text-[11px] uppercase font-bold tracking-widest text-stone-400 px-0.5 flex items-center gap-1.5">
              <Smile className="w-3.5 h-3.5 text-stone-500" />
              <span>Personalize Stationery Text</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-semibold text-stone-400 block">First Name 1</label>
                <input
                  id="client-name-one"
                  type="text"
                  placeholder="Steven"
                  value={partnerOne}
                  onChange={(e) => setPartnerOne(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white rounded-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-semibold text-stone-400 block">First Name 2</label>
                <input
                  id="client-name-two"
                  type="text"
                  placeholder="Cristalyn"
                  value={partnerTwo}
                  onChange={(e) => setPartnerTwo(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white rounded-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1 col-span-1">
                <label className="text-[9px] uppercase font-semibold text-stone-400 block">Joiner</label>
                <select
                  value={textSeparator}
                  onChange={(e) => setTextSeparator(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 p-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-stone-900 font-bold rounded-sm text-center"
                >
                  <option value="&amp;">&amp;</option>
                  <option value="AND">AND</option>
                  <option value="♥">♥</option>
                  <option value="●">●</option>
                </select>
              </div>

              <div className="space-y-1 col-span-2">
                <label className="text-[9px] uppercase font-semibold text-stone-400 block pb-0.5">Wedding Date</label>
                <div className="relative">
                  <input
                    id="client-wedding-date"
                    type="text"
                    placeholder="July 25, 2026"
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 pl-8 pr-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white rounded-sm"
                  />
                  <Calendar className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase font-semibold text-stone-400 block">Location / Venue Notes</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="NAPA VALLEY, CALIFORNIA"
                  value={weddingVenue}
                  onChange={(e) => setWeddingVenue(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 pl-8 pr-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white rounded-sm"
                />
                <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>

          {/* ADVANCED TYPOGRAPHY OVERRIDE SECTIONS */}
          <div className="border-t border-stone-100 pt-4 space-y-4">
            <div className="text-[11px] uppercase font-bold tracking-widest text-[#8A7342] px-0.5 flex items-center justify-between">
              <span>Typographic Font Suite</span>
              <FontIcon className="w-3.5 h-3.5" />
            </div>

            {/* Names Font */}
            <div className="space-y-1.5 bg-stone-50/50 p-2.5 rounded-sm border border-stone-200/60 text-left">
              <label className="text-[9px] uppercase font-bold text-stone-500">Names Typography</label>
              <select
                value={partnerFont}
                onChange={(e) => setPartnerFont(e.target.value)}
                className="w-full bg-white border border-stone-250 p-1.5 text-xs rounded-sm focus:outline-none focus:ring-1 focus:ring-stone-900 font-mono text-[11px]"
              >
                {LUXURY_FONTS.map(f => (
                  <option key={f.id} value={f.css}>{f.name}</option>
                ))}
              </select>

              <div className="flex items-center gap-3 pt-1">
                <div className="flex-1 space-y-0.5">
                  <span className="text-[8px] uppercase tracking-wider text-stone-400 block">Size ({partnerFontSize}px)</span>
                  <input
                    type="range"
                    min="14"
                    max="64"
                    value={partnerFontSize}
                    onChange={(e) => setPartnerFontSize(parseInt(e.target.value))}
                    className="w-full accent-[#8A7342]"
                  />
                </div>
                <div className="flex-1 space-y-0.5">
                  <span className="text-[8px] uppercase tracking-wider text-stone-400 block">Tracking ({partnerLetterSpacing}px)</span>
                  <input
                    type="range"
                    min="0"
                    max="16"
                    value={partnerLetterSpacing}
                    onChange={(e) => setPartnerLetterSpacing(parseInt(e.target.value))}
                    className="w-full accent-[#8A7342]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1.5">
                <button
                  type="button"
                  onClick={() => setPartnerItalic(!partnerItalic)}
                  className={cn(
                    "text-[9px] px-2 py-1 rounded-xs border uppercase tracking-widest cursor-pointer",
                    partnerItalic ? "bg-stone-905 text-white border-stone-905" : "bg-white text-stone-605 border-stone-200"
                  )}
                >
                  <i>Italic</i>
                </button>
                <select
                  value={partnerFontWeight}
                  onChange={(e) => setPartnerFontWeight(e.target.value as any)}
                  className="bg-white border border-stone-200 p-1 text-[9px] rounded-xs uppercase tracking-wider"
                >
                  <option value="font-normal">Light Weight</option>
                  <option value="font-semibold">Semi Bold</option>
                  <option value="font-bold">Bold Weight</option>
                  <option value="font-black">Black Weight</option>
                </select>
              </div>
            </div>

            {/* Date Font */}
            <div className="space-y-1.5 bg-stone-50/50 p-2.5 rounded-sm border border-stone-200/60 text-left">
              <label className="text-[9px] uppercase font-bold text-stone-500">Date Typography</label>
              <select
                value={dateFont}
                onChange={(e) => setDateFont(e.target.value)}
                className="w-full bg-white border border-stone-250 p-1.5 text-xs rounded-sm focus:outline-none focus:ring-1 focus:ring-stone-900 font-mono text-[11px]"
              >
                {LUXURY_FONTS.map(f => (
                  <option key={f.id} value={f.css}>{f.name}</option>
                ))}
              </select>

              <div className="flex items-center gap-3 pt-1">
                <div className="flex-1 space-y-0.5">
                  <span className="text-[8px] uppercase tracking-wider text-stone-400 block">Size ({dateFontSize}px)</span>
                  <input
                    type="range"
                    min="8"
                    max="24"
                    value={dateFontSize}
                    onChange={(e) => setDateFontSize(parseInt(e.target.value))}
                    className="w-full accent-stone-700"
                  />
                </div>
                <div className="flex-1 space-y-0.5">
                  <span className="text-[8px] uppercase tracking-wider text-stone-400 block">Tracking ({dateLetterSpacing}px)</span>
                  <input
                    type="range"
                    min="0"
                    max="14"
                    value={dateLetterSpacing}
                    onChange={(e) => setDateLetterSpacing(parseInt(e.target.value))}
                    className="w-full accent-stone-700"
                  />
                </div>
              </div>
            </div>

            {/* Venue Font */}
            <div className="space-y-1.5 bg-stone-50/50 p-2.5 rounded-sm border border-stone-200/60 text-left">
              <label className="text-[9px] uppercase font-bold text-stone-500">Venue Typography</label>
              <select
                value={venueFont}
                onChange={(e) => setVenueFont(e.target.value)}
                className="w-full bg-white border border-stone-250 p-1.5 text-xs rounded-sm focus:outline-none focus:ring-1 focus:ring-stone-900 font-mono text-[11px]"
              >
                {LUXURY_FONTS.map(f => (
                  <option key={f.id} value={f.css}>{f.name}</option>
                ))}
              </select>

              <div className="flex items-center gap-3 pt-1">
                <div className="flex-1 space-y-0.5">
                  <span className="text-[8px] uppercase tracking-wider text-stone-400 block">Size ({venueFontSize}px)</span>
                  <input
                    type="range"
                    min="7"
                    max="18"
                    value={venueFontSize}
                    onChange={(e) => setVenueFontSize(parseInt(e.target.value))}
                    className="w-full accent-stone-700"
                  />
                </div>
                <div className="flex-1 space-y-0.5">
                  <span className="text-[8px] uppercase tracking-wider text-stone-400 block">Tracking ({venueLetterSpacing}px)</span>
                  <input
                    type="range"
                    min="0"
                    max="14"
                    value={venueLetterSpacing}
                    onChange={(e) => setVenueLetterSpacing(parseInt(e.target.value))}
                    className="w-full accent-stone-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* DYNAMIC TEXTURES & MARGIN TUNING RANGE SLIDERS */}
          <div className="border-t border-stone-100 pt-4 space-y-4">
            <div className="text-[11px] uppercase font-bold tracking-widest text-[#8A7342] px-0.5 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              <span>Borders &amp; Margin Geometry</span>
            </div>

            {/* Text Position Option Toggle */}
            <div className="space-y-1.5 rounded-sm bg-amber-500/5 border border-stone-200/60 p-2.5">
              <span className="text-[9px] uppercase font-bold tracking-wider text-[#8A7342] block">Text Alignment & Placement</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  id="btn-text-position-bottom"
                  onClick={() => setTextPosition("bottom")}
                  className={cn(
                    "text-[10px] py-1.5 font-semibold rounded-xs border uppercase tracking-wider text-center cursor-pointer transition-all",
                    textPosition === "bottom" 
                      ? "bg-[#8A7342] text-white border-[#8A7342] shadow-sm" 
                      : "bg-white text-stone-600 border-stone-250 hover:bg-stone-50"
                  )}
                >
                  Bottom of Template
                </button>
                <button
                  type="button"
                  id="btn-text-position-top"
                  onClick={() => setTextPosition("top")}
                  className={cn(
                    "text-[10px] py-1.5 font-semibold rounded-xs border uppercase tracking-wider text-center cursor-pointer transition-all",
                    textPosition === "top" 
                      ? "bg-[#8A7342] text-white border-[#8A7342] shadow-sm" 
                      : "bg-white text-stone-600 border-stone-250 hover:bg-stone-50"
                  )}
                >
                  Top of Template
                </button>
              </div>
            </div>

            {/* Background Graphic Opacity Slider */}
            <div className="space-y-1 bg-amber-500/5 p-2.5 rounded-sm border border-stone-200/60">
              <div className="flex justify-between text-[11px] text-stone-600">
                <span className="font-bold text-[#8A7342]">Background Graphic Opacity</span>
                <span className="font-mono text-[10px] bg-amber-50 px-1 border border-amber-200 text-amber-800 rounded-xs">{graphicOpacity}%</span>
              </div>
              <input
                id="slider-graphic-opacity"
                type="range"
                min="0"
                max="100"
                step="5"
                value={graphicOpacity}
                onChange={(e) => setGraphicOpacity(parseInt(e.target.value))}
                className="w-full accent-[#8A7342] cursor-pointer"
              />
            </div>

            {/* Gap */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-stone-600">
                <span>Space between photo slots</span>
                <span className="font-mono text-[10px] bg-stone-100 px-1">{slotGap}</span>
              </div>
              <input
                id="slider-slot-gap"
                type="range"
                min="6"
                max="40"
                step="2"
                value={parseInt(slotGap) || 16}
                onChange={(e) => setSlotGap(`${e.target.value}px`)}
                className="w-full accent-amber-750"
              />
            </div>

            {/* Radius */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-stone-600">
                <span>Photo Corner Curvatures</span>
                <span className="font-mono text-[10px] bg-stone-100 px-1">{slotBorderRadius}</span>
              </div>
              <input
                id="slider-slot-radius"
                type="range"
                min="0"
                max="24"
                step="2"
                value={parseInt(slotBorderRadius) || 0}
                onChange={(e) => setSlotBorderRadius(`${e.target.value}px`)}
                className="w-full accent-amber-750"
              />
            </div>

            {/* Padding */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-stone-600">
                <span>Outer Print Frame Margins</span>
                <span className="font-mono text-[10px] bg-stone-100 px-1">{innerSpacing}</span>
              </div>
              <input
                id="slider-inner-spacing"
                type="range"
                min="12"
                max="36"
                step="2"
                value={parseInt(innerSpacing) || 24}
                onChange={(e) => setInnerSpacing(`${e.target.value}px`)}
                className="w-full accent-amber-750"
              />
            </div>

            {/* Slot border width */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-stone-600">
                <span>Blank Space Slot Outline</span>
                <span className="font-mono text-[10px] bg-stone-100 px-1">{slotBorderWidth}</span>
              </div>
              <input
                id="slider-slot-border-width"
                type="range"
                min="0"
                max="8"
                step="0.5"
                value={parseFloat(slotBorderWidth) || 0}
                onChange={(e) => setSlotBorderWidth(`${e.target.value}px`)}
                className="w-full accent-amber-750"
              />
            </div>
          </div>

        </aside>

        {/* BRIDAL PREVIEW CARDS SUITE VIEWPORT (CENTER) */}
        <section id="workspace-content-canvas" className="flex-1 bg-[#FAF8F5]/40 p-5 md:p-8 flex flex-col items-center justify-center overflow-y-auto lg:h-[calc(100vh-64px)] border-t lg:border-t-0 border-stone-200">
          
          <div className="flex flex-col items-center space-y-5 max-w-full">
            
            {/* Top status controller bar */}
            <div className="flex items-center justify-between w-full max-w-lg bg-white border border-stone-200 p-2 text-xs gap-2">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-stone-650">Nano Banana Pro Visualizer</span>
              </div>
              
              <button
                type="button"
                onClick={() => setUseTransparentSlots(!useTransparentSlots)}
                className={cn(
                  "px-2 py-0.5 font-bold text-[8.5px] uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer border rounded-sm",
                  useTransparentSlots 
                    ? "bg-stone-900 border-stone-900 text-white" 
                    : "bg-stone-50 border-stone-200 text-stone-600"
                )}
                title="Toggle template transparency preview"
              >
                <Layers className="w-3 h-3" />
                <span>Alpha Cutouts</span>
              </button>
            </div>

            {/* Aspect Ratio Display Sandbox Wrapper */}
            <div 
              style={{
                width: activePresetType === "strip" ? "272px" : (activePresetType === "postcard-vertical" ? "366px" : "550px"),
                height: activePresetType === "strip" ? "816px" : (activePresetType === "postcard-vertical" ? "550px" : "366px"),
              }}
              id="live-template-canvas-viewport" 
              className={cn(
                "border border-stone-250/90 shadow-xl relative select-none p-1 bg-white",
                useTransparentSlots ? "bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] [background-size:16px_16px]" : ""
              )}
            >
              {/* Flat viewport — layout coords include the safe margin, so no
                   padding here. Slots position themselves via layout data. */}
              <div
                style={{
                  backgroundColor: customBasePhoto ? undefined : (useTransparentSlots ? "transparent" : backgroundColor),
                  backgroundImage: customBasePhoto ? `url(${customBasePhoto})` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                className="w-full h-full flex flex-col justify-between absolute inset-0 overflow-hidden shadow-xl"
              >
                  
                  {/* Realistic Paper Artistry Texture Overlay */}
                  <div 
                    className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-[0.22] z-12"
                    style={{
                      backgroundImage: currentPreset.id === "wedding-warm-terracotta"
                        ? "radial-gradient(rgba(0,0,0,0.18) 0.5px, transparent 0.5px)"
                        : ["wedding-luxe-gold", "wedding-classic-monogram", "wedding-vintage-lace", "wedding-luxury-blind-deboss", "wedding-art-deco"].includes(currentPreset.id)
                        ? "linear-gradient(90deg, rgba(0,0,0,0.06) 50%, transparent 50%), linear-gradient(rgba(0,0,0,0.06) 50%, transparent 50%)"
                        : "radial-gradient(rgba(0,0,0,0.08) 1px, transparent 1px)",
                      backgroundSize: ["wedding-luxe-gold", "wedding-classic-monogram", "wedding-vintage-lace", "wedding-luxury-blind-deboss", "wedding-art-deco"].includes(currentPreset.id) ? "4px 4px" : "3px 3px"
                    }}
                  />
                  <div 
                    className="absolute inset-0 pointer-events-none mix-blend-screen opacity-[0.35] z-12"
                    style={{
                      backgroundImage: ["wedding-luxe-gold", "wedding-classic-monogram", "wedding-vintage-lace", "wedding-luxury-blind-deboss", "wedding-art-deco"].includes(currentPreset.id)
                        ? "linear-gradient(90deg, rgba(255,255,255,0.12) 50%, transparent 50%), linear-gradient(rgba(255,255,255,0.12) 50%, transparent 50%)"
                        : "none",
                      backgroundSize: "4px 4px"
                    }}
                  />

                  {/* Inline SVG decoration layer — re-renders when preset / colors / textPosition change */}
                  <svg 
                    className="absolute inset-0 w-full h-full pointer-events-none z-10" 
                    style={{ opacity: graphicOpacity / 100 }}
                    viewBox={activePresetType === "strip" ? "0 0 600 1800" : (activePresetType === "postcard-vertical" ? "0 0 1200 1800" : "0 0 1800 1200")}
                    dangerouslySetInnerHTML={{ __html: renderDecorativeSvg(currentPreset.id, activePresetType, textColor, secondaryColor, borderColor, textPosition) }}
                  />
                  {textPosition === "top" && stationeryTextElement}
 
                  {/* THE PHOTO MOUNT SLOTS — data-driven from lib/layouts.js */}
                  <div className="flex-1 relative z-20 w-full h-full">
                    {(() => {
                      const rawLay = resolveLayout(currentPreset.layoutId, activePresetType);
                      const lay = getModifiedLayout(rawLay, textPosition);
                      const vb = VIEWBOX[activePresetType];
                      return lay.slots.map((s: { x: number; y: number; w: number; h: number }, idx: number) => {
                        const left = (s.x / vb.w) * 100;
                        const top = (s.y / vb.h) * 100;
                        const width = (s.w / vb.w) * 100;
                        const height = (s.h / vb.h) * 100;
                        return (
                        <label
                          key={idx}
                          id={`slot-preview-item-${idx}`}
                          style={{
                            position: "absolute",
                            left: `${left}%`,
                            top: `${top}%`,
                            width: `${width}%`,
                            height: `${height}%`,
                            borderRadius: slotBorderRadius,
                            border: `${slotBorderWidth} ${useTransparentSlots && !customBasePhoto ? "dashed" : "solid"} ${useTransparentSlots && !customBasePhoto ? "rgba(0,0,0,0.15)" : borderColor}`,
                            backgroundColor: useTransparentSlots ? "rgba(0,0,0,0.02)" : slotBgColor,
                            boxShadow: useTransparentSlots ? "none" : "inset 2px 3px 6px rgba(0, 0, 0, 0.18), inset -1px -1px 3px rgba(255, 255, 255, 0.85), 0.5px 1px 1px rgba(0,0,0,0.03)",
                          }}
                          className={cn(
                            "overflow-hidden group flex flex-col items-center justify-center transition-all cursor-pointer text-center",
                            useTransparentSlots ? "border-dashed" : "hover:bg-stone-50/20"
                          )}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                const url = URL.createObjectURL(e.target.files[0]);
                                setCustomBasePhoto(url);
                              }
                            }}
                          />
 
                          <span className="absolute top-2 left-2 text-[10px] font-sans font-semibold text-stone-400/80 z-20 pointer-events-none select-none">
                            {idx + 1}
                          </span>
 
                          <div className="flex flex-col items-center space-y-1 text-stone-400/75 p-3 z-10 pointer-events-none group-hover:text-stone-700 transition-colors">
                            <Upload className="w-3.5 h-3.5 stroke-[1.5]" />
                            <span className="text-[7.5px] uppercase font-bold tracking-widest text-[#8A7342]">Upload Base</span>
                          </div>

                          {/* OVERLAPPING 3D ROSE ACCESSORY (Only for bottom-most / third slot) */}
                          {currentPreset.id === "rose-whisper" && idx === 2 && (
                            <div 
                              style={{
                                position: "absolute",
                                bottom: "-10px",
                                right: "-10px",
                                width: "65px",
                                height: "65px",
                                zIndex: 30,
                                pointerEvents: "none",
                                filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.22))"
                              }}
                              className="animate-fade-in"
                            >
                              <svg viewBox="0 0 100 100" className="w-full h-full">
                                <defs>
                                  <radialGradient id="rose-grad-1-p" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="#FFFFFF" />
                                    <stop offset="70%" stopColor="#FBF7EC" />
                                    <stop offset="100%" stopColor="#E0D7C5" />
                                  </radialGradient>
                                  <radialGradient id="rose-grad-2-p" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="#FFFFFF" />
                                    <stop offset="85%" stopColor="#F3EDE0" />
                                    <stop offset="100%" stopColor="#CEBF9E" />
                                  </radialGradient>
                                </defs>
                                {/* Foliage */}
                                <path d="M 25,60 C 15,58 12,70 18,74 C 25,78 30,70 25,60 Z" fill="#8F9A86" opacity="0.9" stroke="#606A57" strokeWidth="0.5" />
                                <path d="M 72,64 C 82,62 85,74 79,78 C 72,82 68,74 72,64 Z" fill="#8F9A86" opacity="0.9" stroke="#606A57" strokeWidth="0.5" />
                                {/* Outside petals */}
                                <circle cx="36" cy="46" r="21" fill="url(#rose-grad-2-p)" stroke="#E2D6C0" strokeWidth="0.3" />
                                <circle cx="64" cy="46" r="21" fill="url(#rose-grad-2-p)" stroke="#E2D6C0" strokeWidth="0.3" />
                                <circle cx="50" cy="66" r="21" fill="url(#rose-grad-2-p)" stroke="#E2D6C0" strokeWidth="0.3" />
                                <circle cx="50" cy="34" r="21" fill="url(#rose-grad-2-p)" stroke="#E2D6C0" strokeWidth="0.3" />
                                {/* Center layer petals */}
                                <circle cx="42" cy="44" r="16" fill="url(#rose-grad-1-p)" stroke="#D6C7AA" strokeWidth="0.3" />
                                <circle cx="58" cy="44" r="16" fill="url(#rose-grad-1-p)" stroke="#D6C7AA" strokeWidth="0.3" />
                                <circle cx="50" cy="56" r="16" fill="url(#rose-grad-1-p)" stroke="#D6C7AA" strokeWidth="0.3" />
                                {/* Center core */}
                                <circle cx="50" cy="48" r="8" fill="#F4EDE0" stroke="#CDBC9F" strokeWidth="0.5" />
                              </svg>
                            </div>
                          )}

                          {/* OVERLAPPING 3D GOLD LEAF ACCESSORY (Only for top-most / first slot) */}
                          {currentPreset.id === "wedding-warm-terracotta" && idx === 0 && (
                            <div 
                              style={{
                                position: "absolute",
                                top: "-8px",
                                right: "-8px",
                                width: "55px",
                                height: "55px",
                                zIndex: 30,
                                pointerEvents: "none",
                                filter: "drop-shadow(2px 3px 5px rgba(0,0,0,0.26))"
                              }}
                              className="animate-fade-in"
                            >
                              <svg viewBox="0 0 100 100" className="w-full h-full">
                                <defs>
                                  <linearGradient id="gold-leaf-grad-p" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#FFEFA6" />
                                    <stop offset="30%" stopColor="#D9A441" />
                                    <stop offset="50%" stopColor="#FFF4B8" />
                                    <stop offset="80%" stopColor="#B38B32" />
                                    <stop offset="100%" stopColor="#FFE38F" />
                                  </linearGradient>
                                </defs>
                                <path d="M 20,80 Q 75,70 85,20 Q 35,35 20,80 Z" fill="url(#gold-leaf-grad-p)" stroke="#8C6B1F" strokeWidth="0.5" />
                                <path d="M 20,80 L 85,20" fill="none" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.5" />
                              </svg>
                            </div>
                          )}
                        </label>
                        );
                      });
                    })()}
                  </div>

                  {textPosition === "bottom" && stationeryTextElement}
              </div>
            </div>

            {/* Design summary log */}
            <div className="bg-white border border-stone-200 py-3.5 px-5 rounded-none max-w-lg shadow-2xs flex items-start space-x-3.5 text-left">
              <Info className="w-4 h-4 text-[#8A7342] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[8.5px] font-mono font-bold uppercase tracking-widest text-stone-400 block">
                  Fine-Art Editorial Specs
                </span>
                <p className="text-xs text-stone-600 leading-relaxed font-serif italic">
                  &ldquo;{currentPreset.designerExplanation}&rdquo;
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* SIDEBAR RIGHT: STATIONERY THEMES CATALOG & PRODUCTION EXPORT */}
        <aside id="sidebar-photo-sources" className="lg:w-80 border-t lg:border-t-0 lg:border-l border-stone-200 bg-white p-5 flex flex-col gap-5 shrink-0 overflow-y-auto lg:h-[calc(100vh-64px)]">
          
          {/* Template catalog */}
          <div>
            <div className="text-[11px] uppercase font-bold tracking-widest text-stone-400 mb-2.5 px-0.5 flex items-center justify-between font-sans">
              <span>Wedding Preset Styles (Style 1 - 12)</span>
              <BookOpen className="w-3.5 h-3.5 text-stone-400" />
            </div>

            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  id={`preset-selector-${p.id}`}
                  onClick={() => handleSelectPreset(p)}
                  className={cn(
                    "w-full text-left p-2.5 flex flex-col gap-1 transition-all border rounded-xs cursor-pointer",
                    currentPreset.id === p.id
                      ? "border-[#8A7342] bg-[#FAF8F3] shadow-2xs"
                      : "border-stone-200 bg-white hover:bg-stone-50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-904">{p.name}</span>
                    <Heart className={cn("w-3 h-3", currentPreset.id === p.id ? "fill-[#8A7342] text-[#8A7342]" : "text-stone-300")} />
                  </div>
                  <p className="text-[9px] text-stone-500 leading-normal line-clamp-2">{p.designerExplanation}</p>
                </button>
              ))}
            </div>
          </div>

          {/* DYNAMIC BACKGROUND CUSTOM GRAPHICS BASE */}
          <div className="border-t border-stone-100 pt-4 space-y-2 text-left">
            <span className="text-[11px] uppercase font-bold tracking-widest text-[#8A7342] block">
              Background Canvas Graphic
            </span>

            {customBasePhoto ? (
              <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-xs flex items-center gap-2.5">
                <div className="w-10 h-10 relative bg-stone-200 border border-stone-300 rounded overflow-hidden shrink-0">
                  <picture>
                    <img src={customBasePhoto} alt="Base Template Preview" className="w-full h-full object-cover" />
                  </picture>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] uppercase font-mono font-bold text-emerald-600 block">✓ Custom Base Active</span>
                  <button
                    id="clear-base-photo-btn"
                    onClick={clearCustomBasePhoto}
                    className="text-[8.5px] font-bold uppercase tracking-widest text-rose-600 hover:text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded-xs mt-0.5 cursor-pointer"
                  >
                    Remove base
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-stone-50/50 border border-dashed border-stone-200 rounded-xs text-center space-y-2 animate-fade-in">
                <p className="text-[9px] text-stone-500 leading-dense">
                  Upload custom visual background bases to layer behind the frames.
                </p>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 text-[9px] font-bold uppercase tracking-wider cursor-pointer transition-colors rounded-sm shadow-2xs">
                  <Upload className="w-3 h-3 text-[#8A7342]" />
                  <span>Upload Background</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        const url = URL.createObjectURL(e.target.files[0]);
                        setCustomBasePhoto(url);
                      }
                    }}
                  />
                </label>
              </div>
            )}
          </div>

          {/* PRESET COHESIVE PALETTES */}
          <div className="border-t border-stone-100 pt-4 space-y-3 mr-0.5">
            <div className="flex items-center justify-between">
              <div className="text-[11px] uppercase font-bold tracking-widest text-[#8A7342] px-0.5 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                <span>Preset Palettes</span>
              </div>
              <button
                type="button"
                id="btn-cycle-palettes"
                onClick={cyclePalette}
                className="text-[9px] font-bold uppercase tracking-widest text-[#8A7342] hover:text-[#705c31] flex items-center gap-1 px-2 py-0.5 bg-amber-500/5 rounded-xs border border-amber-500/10 hover:border-amber-500/20 transition-all cursor-pointer"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                Cycle Harmony
              </button>
            </div>

            <p className="text-[9.5px] text-stone-500 leading-snug px-0.5">
              Instantly override the active template with high-fidelity, designer-selected color harmonies.
            </p>

            <div className="flex flex-col gap-1.5">
              {HARMONY_PALETTES.map((palette) => {
                const isActive = activePaletteId === palette.id;
                return (
                  <button
                    key={palette.id}
                    type="button"
                    id={`btn-select-palette-${palette.id}`}
                    onClick={() => applyPalette(palette)}
                    className={cn(
                      "w-full text-left p-2 rounded-sm border cursor-pointer transition-all flex items-center justify-between gap-3",
                      isActive 
                        ? "bg-[#8A7342]/10 border-[#8A7342]" 
                        : "bg-white hover:bg-stone-50 border-stone-200"
                    )}
                  >
                    <div className="min-w-0">
                      <span className={cn(
                        "text-[10px] uppercase tracking-wider font-bold block",
                        isActive ? "text-[#8A7342]" : "text-stone-700"
                      )}>
                        {palette.name}
                      </span>
                      <div className="flex items-center gap-1 mt-0.5 font-mono text-[8px] text-stone-400">
                        <span>Bg: {palette.bg}</span>
                        <span>•</span>
                        <span>Ink: {palette.text}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-stone-100/50 p-1 rounded-sm border border-stone-250 shrink-0">
                      <span className="w-3 h-3 rounded-full border border-stone-300" style={{ backgroundColor: palette.bg }} />
                      <span className="w-3 h-3 rounded-full border border-stone-300" style={{ backgroundColor: palette.text }} />
                      <span className="w-3 h-3 rounded-full border border-stone-300" style={{ backgroundColor: palette.secondary }} />
                      <span className="w-3 h-3 rounded-full border border-stone-300" style={{ backgroundColor: palette.border }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* HEX DECAL INK MANUAL ADJUSTERS */}
          <div className="border-t border-stone-100 pt-4 space-y-3">
            <div className="text-[11px] uppercase font-bold tracking-widest text-stone-400 px-0.5 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" />
              <span>Manual Ink Palettes</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-left">
              <div className="space-y-0.5">
                <span className="text-[8px] uppercase font-bold text-stone-400 block">Paper Backdrop</span>
                <div className="flex items-center gap-1.5">
                  <input
                    id="input-color-bg"
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-5.5 h-5.5 cursor-pointer rounded-full border border-stone-200"
                  />
                  <span className="font-mono text-[9px] text-stone-500 uppercase">{backgroundColor}</span>
                </div>
              </div>

              <div className="space-y-0.5">
                <span className="text-[8px] uppercase font-bold text-stone-400 block">Typography Ink</span>
                <div className="flex items-center gap-1.5">
                  <input
                    id="input-color-text"
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-5.5 h-5.5 cursor-pointer rounded-full border border-stone-200"
                  />
                  <span className="font-mono text-[9px] text-stone-500 uppercase">{textColor}</span>
                </div>
              </div>

              <div className="space-y-0.5">
                <span className="text-[8px] uppercase font-bold text-stone-400 block">Decals Gold</span>
                <div className="flex items-center gap-1.5">
                  <input
                    id="input-color-secondary"
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-5.5 h-5.5 cursor-pointer rounded-full border border-stone-200"
                  />
                  <span className="font-mono text-[9px] text-stone-500 uppercase">{secondaryColor}</span>
                </div>
              </div>

              <div className="space-y-0.5">
                <span className="text-[8px] uppercase font-bold text-stone-400 block">Slot Edge</span>
                <div className="flex items-center gap-1.5">
                  <input
                    id="input-color-border"
                    type="color"
                    value={borderColor}
                    onChange={(e) => setBorderColor(e.target.value)}
                    className="w-5.5 h-5.5 cursor-pointer rounded-full border border-stone-200"
                  />
                  <span className="font-mono text-[9px] text-stone-500 uppercase">{borderColor}</span>
                </div>
              </div>
            </div>
          </div>

          {/* PRINT-READY PRODUCTION DISPATCH EXPORT HUB */}
          <div className="border-t border-stone-100 pt-4 space-y-3.5">
            <div className="space-y-1.5 text-left bg-stone-50/80 p-2.5 rounded-sm border border-stone-200/50">
              <span className="text-[10px] uppercase font-mono font-black tracking-widest text-[#8A7342] flex items-center gap-1">
                <Settings className="w-3.5 h-3.5" />
                <span>Export Configuration</span>
              </span>
              <p className="text-[9px] text-stone-500 leading-snug">
                Select your preferred file structure for direct client dispatch or post-production:
              </p>

              {/* Mode Selectors */}
              <div className="grid grid-cols-4 gap-1 mt-2">
                <button
                  type="button"
                  onClick={() => setExportMode("composite")}
                  className={cn(
                    "text-[8px] font-bold py-1.5 px-1 rounded-xs uppercase tracking-wider text-center border cursor-pointer transition-all",
                    exportMode === "composite"
                      ? "bg-stone-900 text-white border-stone-900"
                      : "bg-white text-stone-600 border-stone-200 hover:text-stone-900"
                  )}
                >
                  Full PNG
                </button>
                <button
                  type="button"
                  onClick={() => setExportMode("luma-overlay")}
                  className={cn(
                    "text-[8px] font-bold py-1.5 px-1 rounded-xs uppercase tracking-wider text-center border cursor-pointer transition-all",
                    exportMode === "luma-overlay"
                      ? "bg-amber-800 text-white border-amber-800"
                      : "bg-white text-stone-600 border-stone-200 hover:text-stone-900"
                  )}
                >
                  Luma
                </button>
                <button
                  type="button"
                  onClick={() => setExportMode("layers")}
                  className={cn(
                    "text-[8px] font-bold py-1.5 px-1 rounded-xs uppercase tracking-wider text-center border cursor-pointer transition-all",
                    exportMode === "layers"
                      ? "bg-stone-900 text-white border-stone-900"
                      : "bg-white text-stone-600 border-stone-200 hover:text-stone-900"
                  )}
                >
                  Layers
                </button>
                <button
                  type="button"
                  onClick={() => setExportMode("pdf-print")}
                  className={cn(
                    "text-[8px] font-bold py-1.5 px-1 rounded-xs uppercase tracking-wider text-center border cursor-pointer transition-all",
                    exportMode === "pdf-print"
                      ? "bg-stone-900 text-white border-stone-900"
                      : "bg-white text-stone-600 border-stone-200 hover:text-stone-900"
                  )}
                >
                  PDF CMYK
                </button>
              </div>

              {/* Advanced Config based on selection */}
              {exportMode === "luma-overlay" && (
                <div className="mt-2 p-1.5 bg-amber-50 border border-amber-200 rounded-xs space-y-1">
                  <span className="text-[8.5px] font-mono font-semibold text-amber-900 block text-left">Luma Booth Overlay</span>
                  <p className="text-[8px] text-amber-800 leading-normal text-left">
                    Single alpha-transparent PNG with decoration + text. Upload directly to Luma Booth event dashboard as the overlay layer.
                  </p>
                </div>
              )}

              {exportMode === "layers" && (
                <div className="mt-2 p-1.5 bg-white border border-[#E9E4DC] rounded-xs space-y-1">
                  <span className="text-[8.5px] font-mono font-semibold text-stone-700 block text-left">Separate Transparent PNG Layers</span>
                  <p className="text-[8px] text-stone-500 leading-normal text-left">
                    Downloads 4 separate high-definition transparent assets in sequence: <br />
                    <span className="font-mono text-[7.5px] text-[#8A7342]">Background • Slots Mask • Typography • Borders</span>
                  </p>
                </div>
              )}

              {exportMode === "pdf-print" && (
                <div className="mt-2 space-y-2 p-1.5 bg-white border border-[#E9E4DC] rounded-xs text-left">
                  <div>
                    <span className="text-[8.5px] font-bold uppercase text-stone-600 block mb-1">PDF Page Composition:</span>
                    <div className="grid grid-cols-2 gap-1">
                      <button
                        type="button"
                        onClick={() => setPdfLayoutType("single-page")}
                        className={cn(
                          "text-[8px] font-bold py-1 px-1.5 rounded-xs uppercase text-center border cursor-pointer transition-all",
                          pdfLayoutType === "single-page"
                            ? "bg-stone-200 text-stone-900 border-stone-400"
                            : "bg-stone-50 text-stone-500 border-stone-200 hover:text-stone-800"
                        )}
                      >
                        Single Composite
                      </button>
                      <button
                        type="button"
                        onClick={() => setPdfLayoutType("multi-page")}
                        className={cn(
                          "text-[8px] font-bold py-1 px-1.5 rounded-xs uppercase text-center border cursor-pointer transition-all",
                          pdfLayoutType === "multi-page"
                            ? "bg-stone-200 text-stone-900 border-stone-400"
                            : "bg-stone-50 text-stone-500 border-stone-200 hover:text-stone-800"
                        )}
                      >
                        4x Separated Pages
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* CMYK Gamut Toggle */}
              <div className="mt-2 pt-2 border-t border-stone-150 flex items-center justify-between">
                <div className="flex flex-col text-left">
                  <span className="text-[8.5px] font-bold text-stone-700 uppercase tracking-wide">CMYK Ink Calibration</span>
                  <span className="text-[8px] text-[#8A7342]">Tone compression optimized for offset press</span>
                </div>
                <button
                  type="button"
                  onClick={() => setExportCmykMode(!exportCmykMode)}
                  className={cn(
                    "relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out border border-transparent",
                    exportCmykMode ? "bg-[#8A7342]" : "bg-stone-200"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out",
                      exportCmykMode ? "translate-x-4" : "translate-x-0"
                    )}
                  />
                </button>
              </div>
            </div>

            <button
              id="export-png-trigger"
              onClick={handleDownload}
              className="w-full bg-stone-900 border border-stone-900 hover:bg-stone-850 text-white text-xs font-bold uppercase tracking-widest py-3 flex items-center justify-center gap-2 transition-all cursor-pointer rounded-sm shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>
                {exportMode === "composite" && "Export High-Res Stamp"}
                {exportMode === "luma-overlay" && "Download Luma Overlay (Alpha PNG)"}
                {exportMode === "layers" && "Download Layers Stack (PNGs)"}
                {exportMode === "pdf-print" && "Export Print PDF (CMYK)"}
              </span>
            </button>

            <button
              id="copy-json-trigger"
              onClick={copyConfigSpec}
              className="w-full bg-[#FCFAF5] border border-stone-200 hover:bg-stone-50 text-stone-800 text-[10px] font-bold uppercase tracking-widest py-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer rounded-sm"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? "Copied Spec JSON!" : "Copy SPEC specifications"}</span>
            </button>
          </div>

        </aside>

      </div>



    </main>
  );
}
