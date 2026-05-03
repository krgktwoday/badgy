/**
 * badge.ts — core badge generation logic using satori
 *
 * satori converts a React element tree into an SVG string.
 * We keep this module edge-compatible (no native deps beyond satori).
 */

import { createElement as h } from "react";
import satori from "satori";

export type BadgeStyle =
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

export interface BadgeOptions {
  text: string;
  style?: BadgeStyle;
  /** Badge width in px (default: 200) */
  width?: number;
  /** Badge height in px (default: 48) */
  height?: number;
  /** Font size in px (default: 18) */
  fontSize?: number;
  /** Font weight (default: 600) */
  fontWeight?: 400 | 500 | 600 | 700;
  /** Optional emoji prefix rendered before the text */
  emojiPrefix?: string;
}

const STYLE_MAP: Record<
  BadgeStyle,
  { bg: string; fg: string; border: string }
> = {
  default: { bg: "#f3f4f6", fg: "#111827", border: "#d1d5db" },
  success: { bg: "#dcfce7", fg: "#15803d", border: "#86efac" },
  warning: { bg: "#fef9c3", fg: "#854d0e", border: "#fde047" },
  danger:  { bg: "#fee2e2", fg: "#b91c1c", border: "#fca5a5" },
  info:    { bg: "#dbeafe", fg: "#1d4ed8", border: "#93c5fd" },
  purple:  { bg: "#ede9fe", fg: "#6d28d9", border: "#c4b5fd" },
  pink:    { bg: "#fce7f3", fg: "#be185d", border: "#f9a8d4" },
  dark:    { bg: "#1f2937", fg: "#f9fafb", border: "#374151" },
  ocean:   { bg: "#ecfeff", fg: "#0e7490", border: "#67e8f9" },
  sunset:  { bg: "#fff7ed", fg: "#c2410c", border: "#fdba74" },
};

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
    width = 200,
    height = 48,
    fontSize = 18,
    fontWeight = 600,
    emojiPrefix,
  } = options;
  const colors = STYLE_MAP[style] ?? STYLE_MAP.default;

  // Build the display text: emoji prefix (if any) + main text
  const displayText = emojiPrefix ? `${emojiPrefix} ${text}` : text;

  const svg = await satori(
    h(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: colors.bg,
          border: `2px solid ${colors.border}`,
          borderRadius: 8,
          padding: "0 16px",
          gap: 0,
        },
      },
      h(
        "span",
        {
          style: {
            color: colors.fg,
            fontSize,
            fontWeight,
            letterSpacing: "0.01em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          },
        },
        displayText
      )
    ),
    {
      width,
      height,
      fonts: [
        {
          name: "Inter",
          data: fontData,
          weight: fontWeight,
          style: "normal",
        },
      ],
    }
  );

  return svg;
}

/** All valid style values — handy for validation in the API route. */
export const VALID_STYLES: BadgeStyle[] = Object.keys(STYLE_MAP) as BadgeStyle[];
