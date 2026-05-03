"use client";

import { useState, useCallback } from "react";
import type { BadgeParams } from "@/components/BadgeForm";

interface BadgePreviewProps {
  params: BadgeParams;
}

// Build the relative API URL for the badge image
function badgeApiPath(params: BadgeParams): string {
  const { text, style, shape, label, width, fontSize, fontWeight, emojiPrefix } = params;
  const p = new URLSearchParams({
    text,
    style,
    shape,
    width: String(width),
    fontSize: String(fontSize),
    fontWeight: String(fontWeight),
  });
  if (emojiPrefix) p.set("emojiPrefix", emojiPrefix);
  if (shape === "split" && label) p.set("label", label);
  return `/api/badge?${p.toString()}`;
}

// Build the shareable permalink path (/badge page)
function badgeSharePath(params: BadgeParams): string {
  const { text, style, shape, label, width, fontSize, fontWeight, emojiPrefix } = params;
  const p = new URLSearchParams({
    text,
    style,
    shape,
    width: String(width),
    fontSize: String(fontSize),
    fontWeight: String(fontWeight),
  });
  if (emojiPrefix) p.set("emojiPrefix", emojiPrefix);
  if (shape === "split" && label) p.set("label", label);
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
      <div
        className="flex items-center justify-center h-24 rounded-lg border-2 border-dashed text-sm"
        style={{
          borderColor: "var(--color-neutral-200)",
          color: "var(--color-neutral-400)",
        }}
      >
        Enter text to preview your badge
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 items-center w-full">
      {/* Live preview via img tag — loads the SVG from the API */}
      <div
        className="flex items-center justify-center p-8 rounded-xl w-full min-h-[96px] shadow-inner"
        style={{
          background: "linear-gradient(135deg, var(--color-brand-50) 0%, var(--color-brand-100) 100%)",
          border: "1px solid var(--color-brand-200)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={apiPath}
          alt={`Badge: ${params.text}`}
          className="max-w-full drop-shadow-sm"
          key={apiPath}
          style={{ opacity: 1, transition: "opacity var(--duration-base) var(--ease-out)" }}
        />
      </div>

      {/* Shareable URL display */}
      <div className="w-full">
        <p className="text-xs font-medium mb-1" style={{ color: "var(--color-neutral-500)" }}>Share link</p>
        <div className="flex gap-2 items-center">
          <input
            readOnly
            value={typeof window !== "undefined" ? `${window.location.origin}${sharePath}` : sharePath}
            className="flex-1 min-w-0 rounded-md px-3 py-1.5 text-xs truncate"
            style={{
              border: "1px solid var(--color-neutral-200)",
              borderRadius: "var(--radius-md)",
              color: "var(--color-neutral-500)",
              background: "var(--color-neutral-50)",
              fontFamily: "var(--font-mono)",
              outline: "none",
            }}
            onFocus={(e) => {
              e.target.select();
              e.target.style.borderColor = "var(--color-brand-400)";
              e.target.style.boxShadow = "0 0 0 2px rgba(139, 92, 246, 0.15)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--color-neutral-200)";
              e.target.style.boxShadow = "none";
            }}
            aria-label="Shareable badge permalink"
          />
          <button
            onClick={handleCopyShareLink}
            className="shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
            style={
              copyState === "copied"
                ? {
                    background: "var(--color-success-500)",
                    color: "#ffffff",
                    border: "none",
                  }
                : {
                    border: "1px solid var(--color-neutral-200)",
                    color: "var(--color-neutral-700)",
                    background: "transparent",
                  }
            }
          >
            {copyState === "copied" ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 flex-wrap justify-center">
        {/* Primary CTA — Download SVG with brand gradient and glow */}
        <button
          onClick={handleDownload}
          className="px-4 py-2 rounded-full text-sm font-semibold text-white transition-all"
          style={{
            background: "var(--gradient-cta)",
            boxShadow: "var(--shadow-brand)",
            border: "none",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.08)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.filter = "none"; }}
          onMouseDown={(e) => { (e.currentTarget as HTMLButtonElement).style.filter = "brightness(0.95)"; }}
          onMouseUp={(e) => { (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.08)"; }}
        >
          Download SVG
        </button>

        {/* Ghost button — Copy SVG */}
        <button
          onClick={handleCopySvg}
          className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
          style={{
            border: "1.5px solid var(--color-neutral-200)",
            color: "var(--color-neutral-700)",
            background: "transparent",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--color-neutral-100)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
        >
          Copy SVG
        </button>

        {/* Copy embed URL — shows success state */}
        <button
          onClick={handleCopyUrl}
          className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
          style={
            copyState === "copied"
              ? {
                  background: "var(--color-success-500)",
                  color: "#ffffff",
                  border: "none",
                }
              : {
                  border: "1.5px solid var(--color-neutral-200)",
                  color: "var(--color-neutral-700)",
                  background: "transparent",
                }
          }
          onMouseEnter={(e) => {
            if (copyState !== "copied") {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--color-neutral-100)";
            }
          }}
          onMouseLeave={(e) => {
            if (copyState !== "copied") {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            }
          }}
        >
          {copyState === "copied" ? "Copied!" : "Copy embed URL"}
        </button>
      </div>
    </div>
  );
}
