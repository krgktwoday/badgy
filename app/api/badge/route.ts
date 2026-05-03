/**
 * /api/badge — badge generation endpoint
 *
 * GET /api/badge?text=Hello&style=success
 *
 * Query params:
 *   text    (required) — the badge text
 *   style   (optional) — default | success | warning | danger | info
 *   width   (optional) — badge width in px (default: 200)
 *   height  (optional) — badge height in px (default: 48)
 *   format  (optional) — svg (default)
 *
 * Returns an SVG image.
 */

import { NextRequest, NextResponse } from "next/server";
import { generateBadgeSvg, BadgeStyle } from "@/lib/badge";
import path from "path";
import fs from "fs/promises";

// Font is loaded once per cold-start and reused across requests.
let fontCache: ArrayBuffer | null = null;

async function getFont(): Promise<ArrayBuffer> {
  if (fontCache) return fontCache;
  // Inter SemiBold is bundled by Next.js via the `app/fonts` directory.
  // Fall back to fetching from Google Fonts if not available locally.
  try {
    const fontPath = path.join(process.cwd(), "app", "fonts", "GeistVF.woff");
    const buf = await fs.readFile(fontPath);
    fontCache = buf.buffer as ArrayBuffer;
    return fontCache;
  } catch {
    // Fallback: fetch Inter from Google Fonts
    const res = await fetch(
      "https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2"
    );
    if (!res.ok) throw new Error("Could not load font");
    fontCache = await res.arrayBuffer();
    return fontCache;
  }
}

const VALID_STYLES: BadgeStyle[] = [
  "default",
  "success",
  "warning",
  "danger",
  "info",
];

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const text = searchParams.get("text")?.trim();
  if (!text) {
    return NextResponse.json(
      { error: "text query param is required" },
      { status: 400 }
    );
  }
  if (text.length > 120) {
    return NextResponse.json(
      { error: "text must be 120 characters or fewer" },
      { status: 400 }
    );
  }

  const rawStyle = searchParams.get("style") ?? "default";
  const style: BadgeStyle = VALID_STYLES.includes(rawStyle as BadgeStyle)
    ? (rawStyle as BadgeStyle)
    : "default";

  const width = Math.min(
    800,
    Math.max(80, parseInt(searchParams.get("width") ?? "200", 10) || 200)
  );
  const height = Math.min(
    200,
    Math.max(32, parseInt(searchParams.get("height") ?? "48", 10) || 48)
  );

  try {
    const fontData = await getFont();
    const svg = await generateBadgeSvg({ text, style, width, height }, fontData);

    return new NextResponse(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
      },
    });
  } catch (err) {
    console.error("Badge generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate badge" },
      { status: 500 }
    );
  }
}
