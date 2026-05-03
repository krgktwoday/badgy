/**
 * /badge — shareable badge permalink page
 *
 * Renders the badge with dynamic OG meta tags for social sharing previews.
 * Example: /badge?text=Open+Source&style=success
 *
 * Pasting this URL in GitHub README renders the badge via the og:image tag,
 * and embedding the direct API URL also works as a plain image.
 */

import type { Metadata } from "next";
import BadgeSharePage from "./BadgeSharePage";

const VALID_STYLES = ["default", "success", "warning", "danger", "info", "purple", "pink", "dark", "ocean", "sunset"];

type SearchParams = {
  text?: string;
  style?: string;
  width?: string;
  fontSize?: string;
  fontWeight?: string;
  emojiPrefix?: string;
};

type Props = {
  searchParams: SearchParams;
};

function parseParams(searchParams: SearchParams) {
  const text = (searchParams.text ?? "").slice(0, 120).trim();
  const style = VALID_STYLES.includes(searchParams.style ?? "") ? searchParams.style! : "default";
  const width = Math.min(600, Math.max(80, parseInt(searchParams.width ?? "200", 10) || 200));
  const fontSize = Math.min(48, Math.max(10, parseInt(searchParams.fontSize ?? "18", 10) || 18));
  const rawFontWeight = parseInt(searchParams.fontWeight ?? "600", 10);
  const fontWeight = [400, 500, 600, 700].includes(rawFontWeight) ? rawFontWeight : 600;
  const emojiPrefix = (searchParams.emojiPrefix ?? "").slice(0, 8);
  return { text, style, width, fontSize, fontWeight, emojiPrefix };
}

export async function generateMetadata(
  { searchParams }: Props
): Promise<Metadata> {
  const { text, style, width, fontSize, fontWeight, emojiPrefix } = parseParams(searchParams);

  if (!text) {
    return {
      title: "Badgy — Digital Badges on Demand",
      description: "Create high-quality digital badges instantly.",
    };
  }

  const apiParams = new URLSearchParams({
    text,
    style,
    width: String(width),
    fontSize: String(fontSize),
    fontWeight: String(fontWeight),
  });
  if (emojiPrefix) apiParams.set("emojiPrefix", emojiPrefix);
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
          height: 48,
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
  const { text, style, width, fontSize, fontWeight, emojiPrefix } = parseParams(searchParams);

  return (
    <BadgeSharePage
      text={text}
      style={style}
      width={width}
      fontSize={fontSize}
      fontWeight={fontWeight}
      emojiPrefix={emojiPrefix}
    />
  );
}
