/**
 * badge.ts — core badge generation logic using satori
 *
 * satori converts a React element tree into an SVG string.
 * We keep this module edge-compatible (no native deps beyond satori).
 */

import { createElement as h } from "react";
import satori from "satori";

export type BadgeStyle = "default" | "success" | "warning" | "danger" | "info";

export interface BadgeOptions {
  text: string;
  style?: BadgeStyle;
  /** Badge width in px (default: 200) */
  width?: number;
  /** Badge height in px (default: 48) */
  height?: number;
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
};

/**
 * Generate an SVG string for a badge.
 * Font data must be provided because satori requires a font buffer.
 */
export async function generateBadgeSvg(
  options: BadgeOptions,
  fontData: ArrayBuffer
): Promise<string> {
  const { text, style = "default", width = 200, height = 48 } = options;
  const colors = STYLE_MAP[style];

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
        },
      },
      h(
        "span",
        {
          style: {
            color: colors.fg,
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: "0.01em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          },
        },
        text
      )
    ),
    {
      width,
      height,
      fonts: [
        {
          name: "Inter",
          data: fontData,
          weight: 600,
          style: "normal",
        },
      ],
    }
  );

  return svg;
}
