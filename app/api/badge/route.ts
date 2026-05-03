/**
 * /api/badge — badge generation endpoint
 *
 * GET /api/badge?text=Hello&style=success&width=300&fontSize=20&fontWeight=700&emojiPrefix=🚀
 *
 * Query params:
 *   text        (required) — the badge text
 *   style       (optional) — default | success | warning | danger | info | purple | pink | dark | ocean | sunset
 *   width       (optional) — badge width in px (80–600, default: 200)
 *   height      (optional) — badge height in px (32–200, default: 48)
 *   fontSize    (optional) — font size in px (10–48, default: 18)
 *   fontWeight  (optional) — 400 | 500 | 600 | 700 (default: 600)
 *   emojiPrefix (optional) — an emoji to show before the text
 *   format      (optional) — svg (default)
 *
 * Returns an SVG image.
 */

import { NextRequest, NextResponse } from "next/server";
import { generateBadgeSvg, BadgeStyle, VALID_STYLES } from "@/lib/badge";
import path from "path";
import fs from "fs/promises";

// Font is loaded once per cold-start and reused across requests.
let fontCache: ArrayBuffer | null = null;

async function getFont(): Promise<ArrayBuffer> {
  if (fontCache) return fontCache;
  // Try bundled fonts in priority order:
  //   1. Inter-SemiBold.ttf (if manually added)
  //   2. NotoSans-Regular.ttf (bundled with this repo from @vercel/og)
  const fontCandidates = [
    path.join(process.cwd(), "app", "fonts", "Inter-SemiBold.ttf"),
    path.join(process.cwd(), "app", "fonts", "NotoSans-Regular.ttf"),
  ];
  for (const fontPath of fontCandidates) {
    try {
      const buf = await fs.readFile(fontPath);
      // Check for a valid OpenType/TrueType magic signature (not HTML)
      const magic = buf[0];
      if (magic === 0x00 || magic === 0x4f || magic === 0x74 || magic === 0x77) {
        // \0\1\0\0 (TrueType), OTTO (CFF), true, wOFF, wOF2
        fontCache = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
        return fontCache;
      }
    } catch {
      // file not found — try next
    }
  }
  // Last resort: fetch from npm CDN (inter-latin-600-normal.woff2 via jsDelivr)
  const res = await fetch(
    "https://cdn.jsdelivr.net/npm/@fontsource/inter@5/files/inter-latin-600-normal.woff2"
  );
  if (!res.ok) throw new Error("Could not load font");
  fontCache = await res.arrayBuffer();
  return fontCache;
}

const VALID_FONT_WEIGHTS = [400, 500, 600, 700] as const;

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
    600,
    Math.max(80, parseInt(searchParams.get("width") ?? "200", 10) || 200)
  );
  const height = Math.min(
    200,
    Math.max(32, parseInt(searchParams.get("height") ?? "48", 10) || 48)
  );

  const fontSize = Math.min(
    48,
    Math.max(10, parseInt(searchParams.get("fontSize") ?? "18", 10) || 18)
  );

  const rawFontWeight = parseInt(searchParams.get("fontWeight") ?? "600", 10);
  const fontWeight = (
    VALID_FONT_WEIGHTS.includes(rawFontWeight as (typeof VALID_FONT_WEIGHTS)[number])
      ? rawFontWeight
      : 600
  ) as 400 | 500 | 600 | 700;

  // Emoji prefix: only allow a single cluster (or nothing) for safety
  const emojiPrefix = searchParams.get("emojiPrefix")?.slice(0, 8) ?? undefined;

  try {
    const fontData = await getFont();
    const svg = await generateBadgeSvg(
      { text, style, width, height, fontSize, fontWeight, emojiPrefix },
      fontData
    );

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
