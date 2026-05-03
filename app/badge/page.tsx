/**
 * /badge — shareable badge permalink page
 *
 * Renders the badge with dynamic OG meta tags for social sharing previews.
 * Example: /badge?text=Champion&style=champions&shape=gradient
 *
 * Pasting this URL in GitHub README renders the badge via the og:image tag,
 * and embedding the direct API URL also works as a plain image.
 */

import type { Metadata } from "next";
import BadgeSharePage from "./BadgeSharePage";
import { VALID_STYLES, VALID_SHAPES } from "@/lib/badge";

type SearchParams = {
  text?: string;
  style?: string;
  shape?: string;
  label?: string;
  width?: string;
  height?: string;
  fontSize?: string;
  fontWeight?: string;
  emojiPrefix?: string;
};

type Props = {
  searchParams: SearchParams;
};

function parseParams(searchParams: SearchParams) {
  const text = (searchParams.text ?? "").slice(0, 120).trim();
  const style = VALID_STYLES.includes(searchParams.style as never) ? searchParams.style! : "default";
  const shape = VALID_SHAPES.includes(searchParams.shape as never) ? searchParams.shape! : "flat";
  const label = (searchParams.label ?? "").slice(0, 40).trim();
  const width = Math.min(600, Math.max(80, parseInt(searchParams.width ?? "220", 10) || 220));
  const height = Math.min(200, Math.max(32, parseInt(searchParams.height ?? "48", 10) || 48));
  const fontSize = Math.min(48, Math.max(10, parseInt(searchParams.fontSize ?? "18", 10) || 18));
  const rawFontWeight = parseInt(searchParams.fontWeight ?? "600", 10);
  const fontWeight = [400, 500, 600, 700].includes(rawFontWeight) ? rawFontWeight : 600;
  const emojiPrefix = (searchParams.emojiPrefix ?? "").slice(0, 8);
  return { text, style, shape, label, width, height, fontSize, fontWeight, emojiPrefix };
}

export async function generateMetadata(
  { searchParams }: Props
): Promise<Metadata> {
  const { text, style, shape, label, width, height, fontSize, fontWeight, emojiPrefix } = parseParams(searchParams);

  if (!text) {
    return {
      title: "Badgy — Digital Badges on Demand",
      description: "Create high-quality digital badges instantly.",
    };
  }

  const apiParams = new URLSearchParams({
    text,
    style,
    shape,
    width: String(width),
    fontSize: String(fontSize),
    fontWeight: String(fontWeight),
  });
  if (emojiPrefix) apiParams.set("emojiPrefix", emojiPrefix);
  if (shape === "split" && label) apiParams.set("label", label);
  const imageUrl = `/api/badge?${apiParams.toString()}`;

  const displayText = emojiPrefix ? `${emojiPrefix} ${text}` : text;

  return {
    title: `${displayText} — Badgy`,
    description: `A shareable "${displayText}" badge created with Badgy. Embed it anywhere.`,
    openGraph: {
      title: `${displayText} badge`,
      description: `A shareable "${displayText}" badge created with Badgy.`,
      images: [
        {
          url: imageUrl,
          width: width,
          height: height,
          alt: `Badge: ${displayText}`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${displayText} badge`,
      description: `A shareable "${displayText}" badge. Embed it anywhere.`,
      images: [imageUrl],
    },
  };
}

export default function BadgePage({ searchParams }: Props) {
  const { text, style, shape, label, width, height, fontSize, fontWeight, emojiPrefix } = parseParams(searchParams);

  return (
    <BadgeSharePage
      text={text}
      style={style}
      shape={shape}
      label={label}
      width={width}
      height={height}
      fontSize={fontSize}
      fontWeight={fontWeight}
      emojiPrefix={emojiPrefix}
    />
  );
}
