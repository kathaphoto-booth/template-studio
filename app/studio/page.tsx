"use client";


import React, { useState, useRef, useEffect, useMemo } from "react";
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
  const [activeLayoutId, setActiveLayoutId] = useState<string>(PRESETS[0].layoutId || defaultLayoutFor("strip").id);

  // Find available layout options based on active format and slot constraints
  const availableLayouts = useMemo(() => {
    let layouts = layoutsForFormat(activePresetType);
    if (activePresetType === "strip") {
      layouts = layouts.filter(l => l.slotCount === 3 || l.slotCount === 4);
    } else {
      layouts = layouts.filter(l => l.slotCount === 2 || l.slotCount === 3 || l.slotCount === 4);
    }
    return layouts;
  }, [activePresetType]);

  // Master customized text inputs representing user's wedding data
  const [partnerOne, setPartnerOne] = useState("");
  const [partnerTwo, setPartnerTwo] = useState("");
  const [textSeparator, setTextSeparator] = useState("&");
  const [weddingDate, setWeddingDate] = useState("");
  const [weddingVenue, setWeddingVenue] = useState("");

  // Typography override settings
  const [partnerFont, setPartnerFont] = useState(LUXURY_FONTS[0].css);
  const [dateFont, setDateFont] = useState(LUXURY_FONTS[12].css);
  const [venueFont, setVenueFont] = useState(LUXURY_FONTS[12].css);

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
    setActiveLayoutId(preset.layoutId || defaultLayoutFor(preset.type || activePresetType).id);
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

    // Attempt to preserve the layout structure (e.g. 3-slot to 3-slot) or reset to default
    let newLayoutId = defaultLayoutFor(type).id;
    const currentLay = (LAYOUTS as any)[activeLayoutId];
    if (currentLay) {
      const bestMatch = layoutsForFormat(type).find(l => l.slotCount === currentLay.slotCount && !(l as any).deprecated);
      if (bestMatch) newLayoutId = bestMatch.id;
    }
    setActiveLayoutId(newLayoutId);

    const matchingStyle = PRESETS.find(p => p.id === currentPreset.id) || PRESETS[0];
    
    const revisedPreset = {
      ...matchingStyle,
      type: type,
      layoutId: newLayoutId,
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
      const rawLayoutDef = resolveLayout(activeLayoutId, activePresetType);
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
          ctx.fillStyle = "#111112";
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
        const finalTextColor = currentTextColor;
        const finalSecColor = currentSecColor;

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

        const rawLayout = resolveLayout(activeLayoutId, "strip");
        const layoutDef = getModifiedLayout(rawLayout, textPosition);
        const tz = layoutDef.textZone;
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
        const finalTextColor = currentTextColor;
        const finalSecColor = currentSecColor;

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

        const rawLayout = resolveLayout(activeLayoutId, "postcard-vertical");
        const layoutDef = getModifiedLayout(rawLayout, textPosition);
        const tz = layoutDef.textZone;
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

        const rawLayout = resolveLayout(activeLayoutId, "postcard");
        const layoutDef = getModifiedLayout(rawLayout, textPosition);
        const tz = layoutDef.textZone;
        const textZoneCenterY = (tz.y + tz.h / 2);
        const firstLineHeight = hasNames ? partnerFontSize * 1.5 : (hasDate ? dateFontSize * 1.5 : venueFontSize * 1.5);

        let currentY = textZoneCenterY - (totalTextHeight / 2) + (firstLineHeight / 2);

        const finalTextColor = currentTextColor;
        const finalSecColor = currentSecColor;

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
        color: textColor,
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
            color: secondaryColor 
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
            "text-stone-405"
          )}
        >
          {getDerivedVenue()}
        </span>
      )}
    </div>
  );


  return (
    <main id="app-root-container" className="h-screen w-screen overflow-hidden bg-[#EAE2D5] text-[#241E1A] flex flex-col font-mono selection:bg-[#C4B59D]/30 selection:text-[#1A1816]">
      
      {/* Admin Header */}
      <header id="app-header" className="h-14 shrink-0 border-b border-[#C4B59D] bg-[#EAE2D5] px-6 flex items-center justify-between z-50">
        <div className="flex items-center space-x-6">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#9C958A] font-mono leading-none">Katha Booth</span>
            <span className="text-lg text-[#241E1A] tracking-wide mt-1 leading-none" style={{ fontFamily: "var(--font-serif), serif" }}>Studio Admin</span>
          </div>
        </div>
        <div className="flex items-center space-x-6 text-[10px] uppercase tracking-widest text-[#5A564E]">
          <div className="flex items-center space-x-5">
            <button className="hover:text-[#241E1A] flex items-center space-x-1.5 transition-colors">
              <Download className="w-3.5 h-3.5"/><span>Save</span>
            </button>
            <button className="hover:text-[#241E1A] flex items-center space-x-1.5 transition-colors" aria-label="Undo">
              <RotateCcw className="w-3.5 h-3.5"/>
            </button>
            <button className="hover:text-[#241E1A] flex items-center space-x-1.5 transition-colors" aria-label="Redo">
              <RefreshCw className="w-3.5 h-3.5"/>
            </button>
          </div>
          <div className="flex items-center space-x-2 bg-[#F2ECE4] px-3 py-1.5 border border-[#C4B59D]">
            <Eye className="w-3.5 h-3.5"/>
            <span>78%</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
      </header>

      {/* DRAFT BANNER */}
      {showDraftBanner && draftSelection && (
        <div className="bg-[#1A1816] border-b border-[#2a2a2a] px-6 py-3 flex items-center justify-between text-[10px] uppercase tracking-widest text-[#9C958A] animate-fade-in shrink-0 z-40">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center border border-white/20 text-[#EAE2D5] w-5 h-5 font-bold">✨</span>
            <span className="font-mono">
              Found draft for <span className="text-[#EAE2D5] font-bold">{draftSelection.names || "Gallery Guest"}</span> ({draftSelection.templateName}).
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={applyDraftSelection}
              className="bg-[#8C382A] text-white font-bold py-1.5 px-4 hover:bg-[#7A2A1D] transition-colors cursor-pointer"
            >
              APPLY DRAFT
            </button>
            <button
              onClick={() => setShowDraftBanner(false)}
              className="text-[#9C958A] hover:text-[#EAE2D5] font-bold transition-all cursor-pointer"
              aria-label="Dismiss draft banner"
            >
              <X className="w-4 h-4"/>
            </button>
          </div>
        </div>
      )}

      {/* 3-PANE WORKSPACE */}
      <div id="app-workspace-body" className="flex-1 flex min-h-0 overflow-hidden">
        
        {/* LEFT PANE: TEMPLATE OBJECTS (Obsidian) */}
        <aside className="w-[320px] shrink-0 border-r border-[#C4B59D] bg-[#1A1816] flex flex-col overflow-y-auto text-[10px] uppercase tracking-widest text-[#9C958A] font-mono scrollbar-hide">
          <div className="border-b border-white/10 py-4 px-6 text-[#EAE2D5] font-bold tracking-[0.2em]">
            TEMPLATE OBJECTS
          </div>
          <div className="p-6 space-y-6">
            
            {/* Stage */}
            <div>
               <div className="flex items-center space-x-2 mb-3 text-[#EAE2D5]">
                 <Layers className="w-3.5 h-3.5"/>
                 <span>STAGE</span>
               </div>
               <div className="ml-5 space-y-2 border-l border-white/10 pl-3">
                 <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 border border-[#9C958A]"></span>
                    <span>CANVAS 1800x1200px</span>
                 </div>
                 {(() => {
                   const rawLay = resolveLayout(activeLayoutId, activePresetType);
                   const lay = getModifiedLayout(rawLay, textPosition);
                   return lay.slots.map((s: any, i: number) => (
                     <div key={i} className="space-y-1.5">
                        <div className={cn("flex items-center space-x-2 py-1 px-2 -ml-2 rounded-sm cursor-default", i === 0 ? "bg-white/10 text-[#EAE2D5]" : "hover:text-[#EAE2D5]")}>
                          <Camera className="w-3.5 h-3.5"/>
                          <span>PHOTO_{String(i+1).padStart(2, '0')}</span>
                        </div>
                        {i === 0 && (
                          <div className="ml-5 text-[9px] text-[#9C958A]/70 space-y-1">
                            <div className="flex space-x-4"><span>X: {s.x.toFixed(2)}</span> <span>Y: {s.y.toFixed(2)}</span></div>
                            <div className="flex space-x-4"><span>W: {s.w.toFixed(2)}</span> <span>H: {s.h.toFixed(2)}</span></div>
                          </div>
                        )}
                     </div>
                   ));
                 })()}
                 <div className="flex items-center space-x-2 hover:text-[#EAE2D5] py-1 cursor-default">
                    <FontIcon className="w-3.5 h-3.5"/>
                    <span>HEADER</span>
                 </div>
                 <div className="flex items-center space-x-2 hover:text-[#EAE2D5] py-1 cursor-default">
                    <FontIcon className="w-3.5 h-3.5"/>
                    <span>TEXT_DATE</span>
                 </div>
                 <div className="flex items-center space-x-2 hover:text-[#EAE2D5] py-1 cursor-default">
                    <Layers className="w-3.5 h-3.5"/>
                    <span>OVERLAY_01</span>
                 </div>
               </div>
            </div>

            {/* PROPERTIES */}
            <div className="pt-6 border-t border-white/10 space-y-5">
              <div className="text-[#EAE2D5] font-bold mb-4 tracking-[0.2em]">PROPERTIES</div>
              
              <div className="bg-[#111112] border border-white/10 p-2 text-[#EAE2D5] text-center">
                PHOTO_01
              </div>

              {/* Dims */}
              <div className="space-y-2">
                <div className="text-[#EAE2D5]">DIMENSIONS</div>
                {(() => {
                   const rawLay = resolveLayout(activeLayoutId, activePresetType);
                   const lay = getModifiedLayout(rawLay, textPosition);
                   const s = lay.slots[0] || { w: 0, h: 0 };
                   return (
                    <div className="flex justify-between text-[#9C958A]">
                      <span>W: {s.w.toFixed(2)}px</span>
                      <span>H: {s.h.toFixed(2)}px</span>
                    </div>
                   );
                })()}
              </div>

              {/* Pos */}
              <div className="space-y-2">
                <div className="text-[#EAE2D5]">POSITION</div>
                {(() => {
                   const rawLay = resolveLayout(activeLayoutId, activePresetType);
                   const lay = getModifiedLayout(rawLay, textPosition);
                   const s = lay.slots[0] || { x: 0, y: 0 };
                   return (
                    <div className="flex justify-between text-[#9C958A]">
                      <span>X: {s.x.toFixed(2)}</span>
                      <span>Y: {s.y.toFixed(2)}</span>
                    </div>
                   );
                })()}
              </div>

              {/* Border */}
              <div className="space-y-2">
                <div className="text-[#EAE2D5]">BORDER</div>
                <div className="grid grid-cols-[1fr_auto] gap-y-2 gap-x-4 text-[#9C958A]">
                  <span className="flex items-center">Width</span>
                  <span className="bg-[#111112] border border-white/10 px-2 py-1 text-right min-w-[80px]">{slotBorderWidth}</span>
                  
                  <span className="flex items-center">Color</span>
                  <span className="bg-[#111112] border border-white/10 px-2 py-1 text-right min-w-[80px] lowercase">{borderColor}</span>
                  
                  <span className="flex items-center">Radius</span>
                  <span className="bg-[#111112] border border-white/10 px-2 py-1 text-right min-w-[80px]">{slotBorderRadius}</span>
                </div>
              </div>
              
              {/* Transform */}
              <div className="space-y-2">
                <div className="text-[#EAE2D5]">TRANSFORM</div>
                <div className="flex justify-between items-center text-[#9C958A]">
                  <span>Scale</span>
                  <span className="bg-[#111112] border border-white/10 px-2 py-1 text-right min-w-[80px]">1.00x</span>
                </div>
              </div>

            </div>
          </div>
        </aside>

        {/* CENTER PANE: CANVAS */}
        <section className="flex-1 bg-[#F2ECE4] relative overflow-auto flex items-center justify-center">
          {/* Subtle Piña grid overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #EAE2D5 1px, transparent 1px), linear-gradient(to bottom, #EAE2D5 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
          
          <div 
            style={{
              width: activePresetType === "strip" ? "272px" : (activePresetType === "postcard-vertical" ? "366px" : "550px"),
              height: activePresetType === "strip" ? "816px" : (activePresetType === "postcard-vertical" ? "550px" : "366px"),
            }}
            id="live-template-canvas-viewport" 
            className={cn(
              "relative select-none p-1 ring-1 shadow-2xl z-10",
              useTransparentSlots ? "bg-[radial-gradient(#C4B59D_1px,transparent_1px)] [background-size:16px_16px] ring-[#C4B59D]" : "bg-[#f5f2eb] ring-black/5"
            )}
          >
            <div
              style={{
                backgroundColor: customBasePhoto ? undefined : (useTransparentSlots ? "transparent" : backgroundColor),
                backgroundImage: customBasePhoto ? `url(${customBasePhoto})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="w-full h-full flex flex-col justify-between absolute inset-0 overflow-hidden"
            >
              <div 
                className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-[0.22] z-12"
                style={{
                  backgroundImage: "radial-gradient(rgba(0,0,0,0.08) 1px, transparent 1px)",
                  backgroundSize: "3px 3px"
                }}
              />

              <svg 
                className="absolute inset-0 w-full h-full pointer-events-none z-10" 
                style={{ opacity: graphicOpacity / 100, mixBlendMode: 'screen' }}
                viewBox={activePresetType === "strip" ? "0 0 600 1800" : (activePresetType === "postcard-vertical" ? "0 0 1200 1800" : "0 0 1800 1200")}
                dangerouslySetInnerHTML={{ __html: renderDecorativeSvg(currentPreset.id, activePresetType, textColor, secondaryColor, borderColor, textPosition) }}
              />

              {textPosition === "top" && stationeryTextElement}

              <div className="flex-1 relative z-20 w-full h-full">
                {(() => {
                  const rawLay = resolveLayout(activeLayoutId, activePresetType);
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
                      }}
                      className={cn(
                        "overflow-hidden group flex flex-col items-center justify-center transition-all cursor-pointer text-center",
                        useTransparentSlots ? "border-dashed" : "hover:bg-black/5"
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
                      <span className="text-[10px] font-mono text-black/60 z-20 pointer-events-none select-none tracking-widest uppercase">
                        PHOTO {idx + 1}
                      </span>
                      {/* Mathematical crosshairs on corners */}
                      <span className="absolute -top-[5px] -left-[5px] w-2.5 h-2.5 border-t border-l border-[#8C382A]/40 pointer-events-none"></span>
                      <span className="absolute -top-[5px] -right-[5px] w-2.5 h-2.5 border-t border-r border-[#8C382A]/40 pointer-events-none"></span>
                      <span className="absolute -bottom-[5px] -left-[5px] w-2.5 h-2.5 border-b border-l border-[#8C382A]/40 pointer-events-none"></span>
                      <span className="absolute -bottom-[5px] -right-[5px] w-2.5 h-2.5 border-b border-r border-[#8C382A]/40 pointer-events-none"></span>
                    </label>
                    );
                  });
                })()}
              </div>

              {textPosition === "bottom" && stationeryTextElement}
            </div>
            
            {/* Extended mathematical constraints around canvas */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-px h-6 bg-[#C4B59D]" />
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-px h-6 bg-[#C4B59D]" />
            <div className="absolute top-1/2 -left-8 -translate-y-1/2 w-6 h-px bg-[#C4B59D]" />
            <div className="absolute top-1/2 -right-8 -translate-y-1/2 w-6 h-px bg-[#C4B59D]" />
          </div>
        </section>

        {/* RIGHT PANE: CONFIGURATION (Obsidian) */}
        <aside className="w-[320px] shrink-0 border-l border-[#C4B59D] bg-[#1A1816] flex flex-col overflow-y-auto text-[10px] uppercase tracking-widest text-[#9C958A] font-mono scrollbar-hide">
          <div className="border-b border-white/10 py-4 px-6 text-[#EAE2D5] font-bold tracking-[0.2em]">
            CONFIGURATION
          </div>
          <div className="p-6 space-y-6">
            
            {/* LAYOUT */}
            <div className="space-y-4">
              <div className="text-[#EAE2D5]">LAYOUT</div>
              <div className="space-y-3 text-[#9C958A]">
                <div className="flex justify-between items-center">
                  <span>Masking</span>
                  <button onClick={() => setUseTransparentSlots(!useTransparentSlots)} className={cn("px-3 py-1.5 border transition-colors focus:outline-none", useTransparentSlots ? "bg-[#EAE2D5] border-[#EAE2D5] text-[#1A1816]" : "bg-[#111112] border-white/10 text-[#EAE2D5]")}>
                    {useTransparentSlots ? "ON  " : "OFF"}
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span>Type</span>
                  <select 
                    value={activePresetType} 
                    onChange={(e) => handleTypeToggle(e.target.value as any)}
                    className="bg-[#111112] border border-white/10 text-[#EAE2D5] px-2 py-1.5 outline-none min-w-[120px] appearance-none"
                  >
                    <option value="strip">Strip</option>
                    <option value="postcard-vertical">Port</option>
                    <option value="postcard">Land</option>
                  </select>
                </div>
                <div className="flex justify-between items-center">
                  <span>Geometry</span>
                  <select 
                    value={activeLayoutId} 
                    onChange={(e) => setActiveLayoutId(e.target.value)}
                    className="bg-[#111112] border border-white/10 text-[#EAE2D5] px-2 py-1.5 outline-none min-w-[120px] appearance-none"
                  >
                    {availableLayouts.map(l => (
                      <option key={l.id} value={l.id}>{l.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-between items-center">
                  <span>Catalog</span>
                  <select 
                    value={currentPreset.id} 
                    onChange={(e) => {
                      const p = PRESETS.find(x => x.id === e.target.value);
                      if (p) handleSelectPreset(p);
                    }}
                    className="bg-[#111112] border border-white/10 text-[#EAE2D5] px-2 py-1.5 outline-none w-[120px] appearance-none"
                  >
                    {PRESETS.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* ALIGNMENT */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="text-[#EAE2D5]">ALIGNMENT</div>
              <select 
                value={textPosition} 
                onChange={(e) => setTextPosition(e.target.value as "top" | "bottom")}
                className="w-full bg-[#111112] border border-white/10 text-[#EAE2D5] px-2 py-1.5 outline-none appearance-none"
              >
                <option value="top">Distribute Vertical (Top)</option>
                <option value="bottom">Distribute Vertical (Bottom)</option>
              </select>
            </div>

            {/* SPACING */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="text-[#EAE2D5]">SPACING / OPACITY</div>
              <div className="grid grid-cols-[auto_1fr_auto] gap-x-3 gap-y-2 items-center text-[#9C958A]">
                  <span>Opacity</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={graphicOpacity}
                    onChange={(e) => setGraphicOpacity(parseInt(e.target.value))}
                    className="w-full accent-[#EAE2D5]"
                  />
                  <span className="bg-[#111112] border border-white/10 px-2 py-1.5 w-12 text-center text-[#EAE2D5]">{graphicOpacity}%</span>
              </div>
              <div className="flex justify-between items-center mt-2 text-[#9C958A]">
                  <span>Palette</span>
                  <select 
                    value={activePaletteId || ""} 
                    onChange={(e) => {
                      const pal = HARMONY_PALETTES.find(x => x.id === e.target.value);
                      if (pal) applyPalette(pal);
                    }}
                    className="bg-[#111112] border border-white/10 text-[#EAE2D5] px-2 py-1.5 outline-none min-w-[120px] appearance-none"
                  >
                    {HARMONY_PALETTES.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
              </div>
            </div>

            {/* TYPOGRAPHY */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="text-[#EAE2D5]">TYPOGRAPHY</div>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="First Name 1"
                  value={partnerOne}
                  onChange={(e) => setPartnerOne(e.target.value)}
                  className="w-full bg-[#111112] border border-white/10 text-[#EAE2D5] px-3 py-2 outline-none placeholder:text-[#5A564E] focus:border-[#C4B59D] transition-colors"
                />
                <input
                  type="text"
                  placeholder="First Name 2"
                  value={partnerTwo}
                  onChange={(e) => setPartnerTwo(e.target.value)}
                  className="w-full bg-[#111112] border border-white/10 text-[#EAE2D5] px-3 py-2 outline-none placeholder:text-[#5A564E] focus:border-[#C4B59D] transition-colors"
                />
                <input
                  type="text"
                  placeholder="Date"
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  className="w-full bg-[#111112] border border-white/10 text-[#EAE2D5] px-3 py-2 outline-none placeholder:text-[#5A564E] focus:border-[#C4B59D] transition-colors"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={weddingVenue}
                  onChange={(e) => setWeddingVenue(e.target.value)}
                  className="w-full bg-[#111112] border border-white/10 text-[#EAE2D5] px-3 py-2 outline-none placeholder:text-[#5A564E] focus:border-[#C4B59D] transition-colors"
                />
                <select
                    value={partnerFont}
                    onChange={(e) => setPartnerFont(e.target.value)}
                    className="w-full bg-[#111112] border border-white/10 text-[#EAE2D5] px-3 py-2 outline-none font-mono focus:border-[#C4B59D] transition-colors appearance-none"
                  >
                    {LUXURY_FONTS.map(f => (
                      <option key={f.id} value={f.css}>{f.name}</option>
                    ))}
                  </select>
              </div>
            </div>

            {/* EXPORT */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="text-[#EAE2D5]">EXPORT</div>
              <div className="space-y-3 text-[#9C958A]">
                <div className="flex justify-between items-center">
                  <span>Format</span>
                  <select 
                    value={exportMode} 
                    onChange={(e) => setExportMode(e.target.value as any)}
                    className="bg-[#111112] border border-white/10 text-[#EAE2D5] px-2 py-1.5 outline-none min-w-[120px] appearance-none"
                  >
                    <option value="composite">PNG</option>
                    <option value="luma-overlay">LUMA</option>
                    <option value="layers">ZIP</option>
                    <option value="pdf-print">PDF</option>
                  </select>
                </div>
                {exportMode === "pdf-print" && (
                  <div className="flex justify-between items-center">
                    <span>CMYK</span>
                    <button onClick={() => setExportCmykMode(!exportCmykMode)} className={cn("px-3 py-1.5 border transition-colors focus:outline-none", exportCmykMode ? "bg-[#EAE2D5] border-[#EAE2D5] text-[#1A1816]" : "bg-[#111112] border-white/10 text-[#EAE2D5]")}>
                      {exportCmykMode ? "ON" : "OFF"}
                    </button>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span>DPI</span>
                  <span className="text-[#EAE2D5]">300</span>
                </div>
              </div>
              <button 
                id="export-png-trigger"
                onClick={handleDownload}
                className="w-full bg-[#8C382A] text-white font-bold py-3 hover:bg-[#7A2A1D] transition-colors cursor-pointer mt-4 tracking-[0.2em] uppercase"
              >
                EXPORT NOW
              </button>
            </div>

          </div>
        </aside>

      </div>
    </main>
  );
}
