/**
 * badge.ts — core badge generation logic using satori
 *
 * satori converts a React element tree into an SVG string.
 * We keep this module edge-compatible (no native deps beyond satori).
 *
 * Style taxonomy:
 *   - Business styles: clean, professional, corporate-grade
 *   - Creative styles: vibrant, personality-driven, expressive
 *   - Sports/Club styles: inspired by elite sports club aesthetics
 *   - Brand styles: inspired by iconic tech/consumer brand palettes
 *
 * Shape variants:
 *   - flat    : pill badge, solid color background (GitHub shields style)
 *   - gradient: rounded rect with a gradient fill
 *   - split   : two-part badge — colored label tab + main body (shields.io style)
 *   - outline  : transparent body with a colored border
 *   - glass   : frosted-glass effect (light bg + white overlay strip)
 */

import { createElement as h } from "react";
import satori from "satori";

// ─── Style definitions ───────────────────────────────────────────────────────

export type BadgeStyle =
  // ── Business ────────────────────────────────
  | "corporate"     // deep navy / white — enterprise-grade
  | "executive"     // charcoal + gold accent — C-suite feel
  | "minimal"       // near-white bg, dark text, hairline border
  | "verified"      // LinkedIn-blue with checkmark accent
  | "certified"     // forest-green authority badge
  // ── Creative ────────────────────────────────
  | "neon"          // electric cyan on near-black
  | "candy"         // pink-to-purple gradient
  | "fire"          // red-to-orange flame gradient
  | "aurora"        // teal-to-purple aurora borealis
  | "retro"         // warm amber, serif-feel, retro stamp
  // ── Sports-club inspired ────────────────────
  | "champions"     // deep blue + gold — elite league feel
  | "premier"       // deep purple + silver
  | "allblacks"     // pure black + white — NZ All Blacks
  | "redbull"       // dark blue + red-to-gold
  | "olympic"       // crisp white + five-ring blue
  // ── Brand-inspired ──────────────────────────
  | "midnight"      // Apple-dark: deep space black + soft white
  | "googleplex"    // Google-multicolor stripe accent
  | "carbonx"       // GitHub-dark: charcoal + green terminal
  | "cloudpulse"    // AWS-orange on dark slate
  | "supernova"     // Spotify-green on black
  // ── Legacy (kept for backward compat) ───────
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "purple"
  | "pink"
  | "dark"
  | "ocean"
  | "sunset";

export type BadgeShape = "flat" | "gradient" | "split" | "outline" | "glass";

export interface BadgeOptions {
  text: string;
  style?: BadgeStyle;
  shape?: BadgeShape;
  /** Badge width in px (default: 220) */
  width?: number;
  /** Badge height in px (default: 48) */
  height?: number;
  /** Font size in px (default: 18) */
  fontSize?: number;
  /** Font weight (default: 600) */
  fontWeight?: 400 | 500 | 600 | 700;
  /** Optional emoji prefix rendered before the text */
  emojiPrefix?: string;
  /** Optional label for split-shape (left-side label text) */
  label?: string;
}

// ─── Style theme definitions ─────────────────────────────────────────────────

interface StyleTheme {
  /** Primary background (solid color or CSS gradient string for satori) */
  bg: string;
  /** Foreground / text color */
  fg: string;
  /** Border color */
  border: string;
  /** Optional gradient (satori supports linear-gradient in backgroundImage) */
  gradient?: string;
  /** Label tab color for split shape */
  labelBg?: string;
  /** Label text color for split shape */
  labelFg?: string;
  /** Short human label shown in the UI */
  uiLabel: string;
  /** Category for grouping in the UI */
  category: "business" | "creative" | "sports" | "brand" | "basic";
  /** Representative accent color for UI swatches */
  accent: string;
}

const THEMES: Record<BadgeStyle, StyleTheme> = {
  // ── Business ────────────────────────────────
  corporate: {
    bg: "#0f2d5e",
    fg: "#ffffff",
    border: "#1a3d7a",
    gradient: "linear-gradient(135deg, #0f2d5e 0%, #1a4a8a 100%)",
    labelBg: "#f0c040",
    labelFg: "#0f2d5e",
    uiLabel: "Corporate",
    category: "business",
    accent: "#0f2d5e",
  },
  executive: {
    bg: "#1c1c1e",
    fg: "#e8d48b",
    border: "#3a3a3c",
    gradient: "linear-gradient(135deg, #1c1c1e 0%, #2c2c2e 100%)",
    labelBg: "#c9a84c",
    labelFg: "#1c1c1e",
    uiLabel: "Executive",
    category: "business",
    accent: "#c9a84c",
  },
  minimal: {
    bg: "#fafafa",
    fg: "#111827",
    border: "#d4d4d8",
    uiLabel: "Minimal",
    category: "business",
    accent: "#71717a",
  },
  verified: {
    bg: "#0a66c2",
    fg: "#ffffff",
    border: "#0a66c2",
    gradient: "linear-gradient(135deg, #0a66c2 0%, #0d80f0 100%)",
    labelBg: "#ffffff",
    labelFg: "#0a66c2",
    uiLabel: "Verified",
    category: "business",
    accent: "#0a66c2",
  },
  certified: {
    bg: "#14532d",
    fg: "#bbf7d0",
    border: "#166534",
    gradient: "linear-gradient(135deg, #14532d 0%, #166534 100%)",
    labelBg: "#bbf7d0",
    labelFg: "#14532d",
    uiLabel: "Certified",
    category: "business",
    accent: "#16a34a",
  },

  // ── Creative ────────────────────────────────
  neon: {
    bg: "#0a0a0f",
    fg: "#00ffe7",
    border: "#00ffe7",
    gradient: "linear-gradient(135deg, #0a0a0f 0%, #111128 100%)",
    labelBg: "#00ffe7",
    labelFg: "#0a0a0f",
    uiLabel: "Neon",
    category: "creative",
    accent: "#00ffe7",
  },
  candy: {
    bg: "#ec4899",
    fg: "#ffffff",
    border: "#db2777",
    gradient: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
    labelBg: "#fdf2f8",
    labelFg: "#9d174d",
    uiLabel: "Candy",
    category: "creative",
    accent: "#ec4899",
  },
  fire: {
    bg: "#ef4444",
    fg: "#ffffff",
    border: "#dc2626",
    gradient: "linear-gradient(135deg, #dc2626 0%, #f97316 100%)",
    labelBg: "#fef2f2",
    labelFg: "#991b1b",
    uiLabel: "Fire",
    category: "creative",
    accent: "#f97316",
  },
  aurora: {
    bg: "#0d9488",
    fg: "#ffffff",
    border: "#0f766e",
    gradient: "linear-gradient(135deg, #0d9488 0%, #7c3aed 100%)",
    labelBg: "#f0fdfa",
    labelFg: "#115e59",
    uiLabel: "Aurora",
    category: "creative",
    accent: "#0d9488",
  },
  retro: {
    bg: "#92400e",
    fg: "#fef3c7",
    border: "#78350f",
    gradient: "linear-gradient(135deg, #92400e 0%, #b45309 100%)",
    labelBg: "#fef3c7",
    labelFg: "#78350f",
    uiLabel: "Retro",
    category: "creative",
    accent: "#d97706",
  },

  // ── Sports-club inspired ────────────────────
  champions: {
    bg: "#0e1b4d",
    fg: "#ffd700",
    border: "#1a2f7a",
    gradient: "linear-gradient(135deg, #0e1b4d 0%, #1a2f7a 50%, #0e1b4d 100%)",
    labelBg: "#ffd700",
    labelFg: "#0e1b4d",
    uiLabel: "Champions",
    category: "sports",
    accent: "#ffd700",
  },
  premier: {
    bg: "#37003c",
    fg: "#e8e0f0",
    border: "#4d0052",
    gradient: "linear-gradient(135deg, #37003c 0%, #5c0062 100%)",
    labelBg: "#00ff85",
    labelFg: "#37003c",
    uiLabel: "Premier",
    category: "sports",
    accent: "#00ff85",
  },
  allblacks: {
    bg: "#000000",
    fg: "#ffffff",
    border: "#1a1a1a",
    gradient: "linear-gradient(135deg, #000000 0%, #1c1c1c 100%)",
    labelBg: "#ffffff",
    labelFg: "#000000",
    uiLabel: "All Blacks",
    category: "sports",
    accent: "#e0e0e0",
  },
  redbull: {
    bg: "#0e1e4a",
    fg: "#ff1e1e",
    border: "#162a5e",
    gradient: "linear-gradient(135deg, #0e1e4a 0%, #1a2f6e 100%)",
    labelBg: "#cc1111",
    labelFg: "#ffffff",
    uiLabel: "Red Bull",
    category: "sports",
    accent: "#ff1e1e",
  },
  olympic: {
    bg: "#ffffff",
    fg: "#0081c8",
    border: "#0081c8",
    gradient: "linear-gradient(135deg, #f8faff 0%, #ffffff 100%)",
    labelBg: "#0081c8",
    labelFg: "#ffffff",
    uiLabel: "Olympic",
    category: "sports",
    accent: "#0081c8",
  },

  // ── Brand-inspired ──────────────────────────
  midnight: {
    bg: "#1d1d1f",
    fg: "#f5f5f7",
    border: "#2d2d2f",
    gradient: "linear-gradient(135deg, #1d1d1f 0%, #2d2d2f 100%)",
    labelBg: "#0071e3",
    labelFg: "#ffffff",
    uiLabel: "Midnight",
    category: "brand",
    accent: "#0071e3",
  },
  googleplex: {
    bg: "#ffffff",
    fg: "#202124",
    border: "#e0e0e0",
    labelBg: "#4285f4",
    labelFg: "#ffffff",
    uiLabel: "Googleplex",
    category: "brand",
    accent: "#4285f4",
  },
  carbonx: {
    bg: "#161b22",
    fg: "#00d97e",
    border: "#30363d",
    gradient: "linear-gradient(135deg, #161b22 0%, #0d1117 100%)",
    labelBg: "#238636",
    labelFg: "#ffffff",
    uiLabel: "Carbon X",
    category: "brand",
    accent: "#00d97e",
  },
  cloudpulse: {
    bg: "#232f3e",
    fg: "#ff9900",
    border: "#37475a",
    gradient: "linear-gradient(135deg, #232f3e 0%, #1a242f 100%)",
    labelBg: "#ff9900",
    labelFg: "#232f3e",
    uiLabel: "Cloud Pulse",
    category: "brand",
    accent: "#ff9900",
  },
  supernova: {
    bg: "#191414",
    fg: "#1db954",
    border: "#282828",
    gradient: "linear-gradient(135deg, #191414 0%, #121212 100%)",
    labelBg: "#1db954",
    labelFg: "#191414",
    uiLabel: "Supernova",
    category: "brand",
    accent: "#1db954",
  },

  // ── Legacy / backward-compat ────────────────
  default:  { bg: "#f3f4f6", fg: "#111827", border: "#d1d5db", uiLabel: "Default",  category: "basic", accent: "#9ca3af" },
  success:  { bg: "#dcfce7", fg: "#15803d", border: "#86efac", uiLabel: "Success",  category: "basic", accent: "#22c55e" },
  warning:  { bg: "#fef9c3", fg: "#854d0e", border: "#fde047", uiLabel: "Warning",  category: "basic", accent: "#eab308" },
  danger:   { bg: "#fee2e2", fg: "#b91c1c", border: "#fca5a5", uiLabel: "Danger",   category: "basic", accent: "#ef4444" },
  info:     { bg: "#dbeafe", fg: "#1d4ed8", border: "#93c5fd", uiLabel: "Info",     category: "basic", accent: "#3b82f6" },
  purple:   { bg: "#ede9fe", fg: "#6d28d9", border: "#c4b5fd", uiLabel: "Purple",   category: "basic", accent: "#8b5cf6" },
  pink:     { bg: "#fce7f3", fg: "#be185d", border: "#f9a8d4", uiLabel: "Pink",     category: "basic", accent: "#ec4899" },
  dark:     { bg: "#1f2937", fg: "#f9fafb", border: "#374151", uiLabel: "Dark",     category: "basic", accent: "#374151" },
  ocean:    { bg: "#ecfeff", fg: "#0e7490", border: "#67e8f9", uiLabel: "Ocean",    category: "basic", accent: "#06b6d4" },
  sunset:   { bg: "#fff7ed", fg: "#c2410c", border: "#fdba74", uiLabel: "Sunset",   category: "basic", accent: "#f97316" },
};

// ─── Public API helpers ───────────────────────────────────────────────────────

/** All valid style values — handy for validation in the API route. */
export const VALID_STYLES: BadgeStyle[] = Object.keys(THEMES) as BadgeStyle[];

/** All valid shape values */
export const VALID_SHAPES: BadgeShape[] = ["flat", "gradient", "split", "outline", "glass"];

/** Get theme metadata (for UI rendering). */
export function getTheme(style: BadgeStyle): StyleTheme {
  return THEMES[style] ?? THEMES.default;
}

/** Grouped styles for the UI picker */
export const STYLE_GROUPS: { category: StyleTheme["category"]; label: string; styles: BadgeStyle[] }[] = [
  {
    category: "business",
    label: "Business",
    styles: ["corporate", "executive", "minimal", "verified", "certified"],
  },
  {
    category: "creative",
    label: "Creative",
    styles: ["neon", "candy", "fire", "aurora", "retro"],
  },
  {
    category: "sports",
    label: "Sports",
    styles: ["champions", "premier", "allblacks", "redbull", "olympic"],
  },
  {
    category: "brand",
    label: "Brand",
    styles: ["midnight", "googleplex", "carbonx", "cloudpulse", "supernova"],
  },
  {
    category: "basic",
    label: "Basic",
    styles: ["default", "success", "warning", "danger", "info", "purple", "pink", "dark", "ocean", "sunset"],
  },
];

// ─── SVG generation ───────────────────────────────────────────────────────────

/**
 * Generate an SVG string for a badge.
 * Font data must be provided because satori requires a font buffer.
 */
export async function generateBadgeSvg(
  options: BadgeOptions,
  fontData: ArrayBuffer
): Promise<string> {
  const {
    text,
    style = "default",
    shape = "flat",
    width = 220,
    height = 48,
    fontSize = 18,
    fontWeight = 600,
    emojiPrefix,
    label,
  } = options;

  const theme = THEMES[style] ?? THEMES.default;

  // Build the display text
  const displayText = emojiPrefix ? `${emojiPrefix} ${text}` : text;

  // Corner radius varies by shape
  const radius = shape === "flat" || shape === "gradient" ? Math.round(height / 2) : 8;

  let svgElement: ReturnType<typeof h>;

  if (shape === "split" && label) {
    svgElement = buildSplitBadge({ theme, label, displayText, width, height, fontSize, fontWeight, radius });
  } else if (shape === "outline") {
    svgElement = buildOutlineBadge({ theme, displayText, width, height, fontSize, fontWeight, radius });
  } else if (shape === "glass") {
    svgElement = buildGlassBadge({ theme, displayText, width, height, fontSize, fontWeight, radius });
  } else if (shape === "gradient" && theme.gradient) {
    svgElement = buildGradientBadge({ theme, displayText, width, height, fontSize, fontWeight, radius });
  } else {
    svgElement = buildFlatBadge({ theme, displayText, width, height, fontSize, fontWeight, radius });
  }

  const svg = await satori(svgElement, {
    width,
    height,
    fonts: [
      {
        name: "NotoSans",
        data: fontData,
        weight: fontWeight,
        style: "normal",
      },
    ],
  });

  return svg;
}

// ─── Badge layout builders ────────────────────────────────────────────────────

interface BuildProps {
  theme: StyleTheme;
  displayText: string;
  width: number;
  height: number;
  fontSize: number;
  fontWeight: number;
  radius: number;
}

interface SplitBuildProps extends BuildProps {
  label: string;
}

/** Flat pill / rounded-rect badge — solid color fill */
function buildFlatBadge({ theme, displayText, fontSize, fontWeight, radius }: BuildProps) {
  return h(
    "div",
    {
      style: {
        display: "flex",
        width: "100%",
        height: "100%",
        borderRadius: radius,
        overflow: "hidden",
        border: `1.5px solid ${theme.border}`,
        backgroundColor: theme.bg,
      },
    },
    h(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          padding: "0 16px",
        },
      },
      h(
        "span",
        {
          style: {
            color: theme.fg,
            fontSize,
            fontWeight,
            letterSpacing: "0.02em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontFamily: "NotoSans",
          },
        },
        displayText
      )
    )
  );
}

/** Gradient badge — uses backgroundImage with linear-gradient */
function buildGradientBadge({ theme, displayText, fontSize, fontWeight, radius }: BuildProps) {
  return h(
    "div",
    {
      style: {
        display: "flex",
        width: "100%",
        height: "100%",
        borderRadius: radius,
        overflow: "hidden",
        // satori supports backgroundImage with linear-gradient
        backgroundImage: theme.gradient ?? `linear-gradient(135deg, ${theme.bg} 0%, ${theme.border} 100%)`,
        border: `1px solid ${theme.border}`,
      },
    },
    h(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          padding: "0 18px",
        },
      },
      h(
        "span",
        {
          style: {
            color: theme.fg,
            fontSize,
            fontWeight,
            letterSpacing: "0.02em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontFamily: "NotoSans",
          },
        },
        displayText
      )
    )
  );
}

/**
 * Split / two-part badge (shields.io style)
 * Left side: colored label tab; Right side: main text area
 */
function buildSplitBadge({ theme, label, displayText, width, fontSize, fontWeight, radius }: SplitBuildProps) {
  const labelBg = theme.labelBg ?? theme.border;
  const labelFg = theme.labelFg ?? theme.fg;
  // Estimate label tab width (roughly proportional to label character count)
  const labelTabWidth = Math.max(48, Math.min(width * 0.42, label.length * (fontSize * 0.62) + 24));

  return h(
    "div",
    {
      style: {
        display: "flex",
        width: "100%",
        height: "100%",
        borderRadius: radius,
        overflow: "hidden",
        border: `1.5px solid ${theme.border}`,
      },
    },
    // Left label tab
    h(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: labelTabWidth,
          height: "100%",
          backgroundColor: labelBg,
          padding: "0 12px",
          flexShrink: 0,
        },
      },
      h(
        "span",
        {
          style: {
            color: labelFg,
            fontSize: fontSize - 1,
            fontWeight: 700,
            letterSpacing: "0.04em",
            whiteSpace: "nowrap",
            fontFamily: "NotoSans",
          },
        },
        label
      )
    ),
    // Right value area
    h(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          height: "100%",
          backgroundColor: theme.bg,
          padding: "0 14px",
        },
      },
      h(
        "span",
        {
          style: {
            color: theme.fg,
            fontSize,
            fontWeight,
            letterSpacing: "0.02em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontFamily: "NotoSans",
          },
        },
        displayText
      )
    )
  );
}

/** Outline badge — transparent background, colored border and text */
function buildOutlineBadge({ theme, displayText, fontSize, fontWeight, radius }: BuildProps) {
  // For outline, use a near-transparent or very light bg
  const bg = theme.category === "basic" ? theme.bg : "#ffffff";
  return h(
    "div",
    {
      style: {
        display: "flex",
        width: "100%",
        height: "100%",
        borderRadius: radius,
        overflow: "hidden",
        border: `2px solid ${theme.accent}`,
        backgroundColor: bg,
      },
    },
    h(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          padding: "0 16px",
        },
      },
      h(
        "span",
        {
          style: {
            color: theme.accent,
            fontSize,
            fontWeight,
            letterSpacing: "0.02em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontFamily: "NotoSans",
          },
        },
        displayText
      )
    )
  );
}

/** Glass badge — frosted glass aesthetic with semi-transparent white sheen */
function buildGlassBadge({ theme, displayText, height, fontSize, fontWeight, radius }: BuildProps) {
  // Use gradient as base when available, else solid bg
  const baseBg = theme.gradient ?? theme.bg;
  const hasGradient = !!theme.gradient;

  return h(
    "div",
    {
      style: {
        display: "flex",
        width: "100%",
        height: "100%",
        borderRadius: radius,
        overflow: "hidden",
        border: `1px solid rgba(255,255,255,0.3)`,
        ...(hasGradient
          ? { backgroundImage: baseBg }
          : { backgroundColor: baseBg }),
      },
    },
    // Glass sheen overlay at top ~40% of height
    h(
      "div",
      {
        style: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: Math.round(height * 0.45),
          backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.0) 100%)",
          borderRadius: `${radius}px ${radius}px 0 0`,
        },
      }
    ),
    // Text layer
    h(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          padding: "0 18px",
        },
      },
      h(
        "span",
        {
          style: {
            color: theme.fg,
            fontSize,
            fontWeight,
            letterSpacing: "0.02em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontFamily: "NotoSans",
          },
        },
        displayText
      )
    )
  );
}
