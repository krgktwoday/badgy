"use client";

/**
 * BadgeSharePage — client component for the /badge permalink page.
 *
 * Shows the badge image and all sharing/embed options.
 * Separated into a client component so parent page.tsx can be a server
 * component and generate OG metadata.
 */

import { useState, useCallback } from "react";
import Link from "next/link";

interface BadgeSharePageProps {
  text: string;
  style: string;
  shape: string;
  label: string;
  width: number;
  height: number;
  fontSize: number;
  fontWeight: number;
  emojiPrefix: string;
}

export default function BadgeSharePage({
  text,
  style,
  shape,
  label,
  width,
  height,
  fontSize,
  fontWeight,
  emojiPrefix,
}: BadgeSharePageProps) {
  const [copyState, setCopyState] = useState<
    "idle" | "copied-link" | "copied-embed" | "copied-md"
  >("idle");

  const apiParams = new URLSearchParams({
    text,
    style,
    shape,
    width: String(width),
    height: String(height),
    fontSize: String(fontSize),
    fontWeight: String(fontWeight),
  });
  if (emojiPrefix) apiParams.set("emojiPrefix", emojiPrefix);
  if (shape === "split" && label) apiParams.set("label", label);
  const apiPath = `/api/badge?${apiParams.toString()}`;

  const displayText = emojiPrefix ? `${emojiPrefix} ${text}` : text;

  const handleCopyShareLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyState("copied-link");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      // fallback: no-op
    }
  }, []);

  const handleCopyEmbedUrl = useCallback(async () => {
    try {
      const embedUrl = `${window.location.origin}${apiPath}`;
      await navigator.clipboard.writeText(embedUrl);
      setCopyState("copied-embed");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      // fallback: no-op
    }
  }, [apiPath]);

  const handleCopyMarkdown = useCallback(async () => {
    try {
      const embedUrl = `${window.location.origin}${apiPath}`;
      const md = `![${displayText}](${embedUrl})`;
      await navigator.clipboard.writeText(md);
      setCopyState("copied-md");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      // fallback: no-op
    }
  }, [apiPath, displayText]);

  if (!text) {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center py-16 px-4">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Badgy</h1>
          <p className="text-gray-500 text-lg">
            Create digital badges instantly. No account needed.
          </p>
        </header>
        <div className="flex flex-col items-center gap-4 text-gray-500">
          <p>No badge text provided.</p>
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            ← Create a badge
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col items-center py-10 px-4 sm:py-16">
      {/* Header */}
      <header className="mb-10 text-center">
        <Link
          href="/"
          className="text-4xl font-extrabold text-gray-900 hover:text-blue-600 transition-colors tracking-tight"
        >
          Badgy
        </Link>
        <p className="text-gray-500 text-base mt-2">Digital badge, ready to share</p>
      </header>

      <div className="w-full max-w-lg flex flex-col gap-6 items-center bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        {/* Badge preview */}
        <div className="flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 w-full min-h-[96px] shadow-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={apiPath}
            alt={`Badge: ${displayText}`}
            className="max-w-full drop-shadow-sm"
          />
        </div>

        {/* Share options */}
        <div className="w-full flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Share this badge
          </h2>

          {/* Share link */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">Permalink</label>
            <div className="flex gap-2">
              <input
                readOnly
                value={typeof window !== "undefined" ? window.location.href : ""}
                className="flex-1 min-w-0 border border-gray-200 rounded-md px-3 py-1.5 text-xs text-gray-600 bg-gray-50 font-mono truncate focus:outline-none focus:ring-1 focus:ring-blue-400"
                onFocus={(e) => e.target.select()}
                aria-label="Shareable badge permalink"
              />
              <button
                onClick={handleCopyShareLink}
                className={`shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  copyState === "copied-link"
                    ? "bg-green-500 text-white"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {copyState === "copied-link" ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* Direct SVG embed URL */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">
              Direct SVG URL (embed in &lt;img&gt; or GitHub README)
            </label>
            <div className="flex gap-2">
              <input
                readOnly
                value={
                  typeof window !== "undefined"
                    ? `${window.location.origin}${apiPath}`
                    : apiPath
                }
                className="flex-1 min-w-0 border border-gray-200 rounded-md px-3 py-1.5 text-xs text-gray-600 bg-gray-50 font-mono truncate focus:outline-none focus:ring-1 focus:ring-blue-400"
                onFocus={(e) => e.target.select()}
                aria-label="Direct SVG embed URL"
              />
              <button
                onClick={handleCopyEmbedUrl}
                className={`shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  copyState === "copied-embed"
                    ? "bg-green-500 text-white"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {copyState === "copied-embed" ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* Markdown snippet */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">Markdown snippet</label>
            <div className="flex gap-2">
              <input
                readOnly
                value={
                  typeof window !== "undefined"
                    ? `![${displayText}](${window.location.origin}${apiPath})`
                    : `![${displayText}](${apiPath})`
                }
                className="flex-1 min-w-0 border border-gray-200 rounded-md px-3 py-1.5 text-xs text-gray-600 bg-gray-50 font-mono truncate focus:outline-none focus:ring-1 focus:ring-blue-400"
                onFocus={(e) => e.target.select()}
                aria-label="Markdown badge snippet"
              />
              <button
                onClick={handleCopyMarkdown}
                className={`shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  copyState === "copied-md"
                    ? "bg-green-500 text-white"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {copyState === "copied-md" ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>

        {/* CTA back to create */}
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← Create your own badge
        </Link>
      </div>
    </main>
  );
}
