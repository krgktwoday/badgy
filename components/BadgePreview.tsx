"use client";

interface BadgePreviewProps {
  text: string;
  style: string;
}

// Build a URL for the badge API
function badgeUrl(text: string, style: string): string {
  const params = new URLSearchParams({ text, style });
  return `/api/badge?${params.toString()}`;
}

export default function BadgePreview({ text, style }: BadgePreviewProps) {
  const url = badgeUrl(text, style);

  async function handleDownload() {
    const res = await fetch(url);
    if (!res.ok) return;
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = `badge-${Date.now()}.svg`;
    a.click();
    URL.revokeObjectURL(objectUrl);
  }

  async function handleCopySvg() {
    try {
      const res = await fetch(url);
      const svgText = await res.text();
      await navigator.clipboard.writeText(svgText);
    } catch {
      // Clipboard API may be unavailable in non-secure contexts
    }
  }

  function handleCopyUrl() {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl).catch(() => {});
  }

  if (!text.trim()) {
    return (
      <div className="flex items-center justify-center h-24 rounded-lg border-2 border-dashed border-gray-200 text-gray-400 text-sm">
        Enter text to preview your badge
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      {/* Live preview via img tag — loads the SVG from the API */}
      <div className="flex items-center justify-center p-6 bg-gray-50 rounded-xl border border-gray-200 w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={`Badge: ${text}`}
          className="max-w-full"
          key={url}
        />
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
          className="px-4 py-2 rounded-md text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Copy URL
        </button>
      </div>
    </div>
  );
}
