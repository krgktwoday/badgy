"use client";

import { useState, useCallback } from "react";
import type { BadgeParams } from "@/components/BadgeForm";

interface BadgePreviewProps {
  params: BadgeParams;
}

// Build the relative API URL for the badge image
function badgeApiPath(params: BadgeParams): string {
  const { text, style, width, fontSize, fontWeight, emojiPrefix } = params;
  const p = new URLSearchParams({ text, style, width: String(width), fontSize: String(fontSize), fontWeight: String(fontWeight) });
  if (emojiPrefix) p.set("emojiPrefix", emojiPrefix);
  return `/api/badge?${p.toString()}`;
}

// Build the shareable permalink path (/badge page)
function badgeSharePath(params: BadgeParams): string {
  const { text, style, width, fontSize, fontWeight, emojiPrefix } = params;
  const p = new URLSearchParams({ text, style, width: String(width), fontSize: String(fontSize), fontWeight: String(fontWeight) });
  if (emojiPrefix) p.set("emojiPrefix", emojiPrefix);
  return `/badge?${p.toString()}`;
}

export default function BadgePreview({ params }: BadgePreviewProps) {
  const apiPath = badgeApiPath(params);
  const sharePath = badgeSharePath(params);

  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");

  const handleDownload = useCallback(async () => {
    const res = await fetch(apiPath);
    if (!res.ok) return;
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = `badge-${Date.now()}.svg`;
    a.click();
    URL.revokeObjectURL(objectUrl);
  }, [apiPath]);

  const handleCopySvg = useCallback(async () => {
    try {
      const res = await fetch(apiPath);
      const svgText = await res.text();
      await navigator.clipboard.writeText(svgText);
    } catch {
      // Clipboard API may be unavailable in non-secure contexts
    }
  }, [apiPath]);

  const handleCopyUrl = useCallback(async () => {
    try {
      const embedUrl = `${window.location.origin}${apiPath}`;
      await navigator.clipboard.writeText(embedUrl);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      // Clipboard API may be unavailable in non-secure contexts
    }
  }, [apiPath]);

  const handleCopyShareLink = useCallback(async () => {
    try {
      const shareUrl = `${window.location.origin}${sharePath}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      // Clipboard API may be unavailable in non-secure contexts
    }
  }, [sharePath]);

  if (!params.text.trim()) {
    return (
      <div className="flex items-center justify-center h-24 rounded-lg border-2 border-dashed border-gray-200 text-gray-400 text-sm">
        Enter text to preview your badge
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 items-center w-full">
      {/* Live preview via img tag — loads the SVG from the API */}
      <div className="flex items-center justify-center p-6 bg-gray-50 rounded-xl border border-gray-200 w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={apiPath}
          alt={`Badge: ${params.text}`}
          className="max-w-full"
          key={apiPath}
        />
      </div>

      {/* Shareable URL display */}
      <div className="w-full">
        <p className="text-xs font-medium text-gray-500 mb-1">Share link</p>
        <div className="flex gap-2 items-center">
          <input
            readOnly
            value={typeof window !== "undefined" ? `${window.location.origin}${sharePath}` : sharePath}
            className="flex-1 min-w-0 border border-gray-200 rounded-md px-3 py-1.5 text-xs text-gray-600 bg-gray-50 font-mono truncate focus:outline-none focus:ring-1 focus:ring-blue-400"
            onFocus={(e) => e.target.select()}
            aria-label="Shareable badge permalink"
          />
          <button
            onClick={handleCopyShareLink}
            className={`shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              copyState === "copied"
                ? "bg-green-500 text-white"
                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {copyState === "copied" ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 flex-wrap justify-center">
        <button
          onClick={handleDownload}
          className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Download SVG
        </button>
        <button
          onClick={handleCopySvg}
          className="px-4 py-2 rounded-md text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Copy SVG
        </button>
        <button
          onClick={handleCopyUrl}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border ${
            copyState === "copied"
              ? "bg-green-500 text-white border-green-500"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {copyState === "copied" ? "Copied!" : "Copy embed URL"}
        </button>
      </div>
    </div>
  );
}
