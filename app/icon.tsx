import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Badgy favicon — 32×32 gradient badge mark.
 * Replaces the static favicon.ico via Next.js file-based metadata.
 * Spec: /BAD/issues/BAD-15#document-logo-spec
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          background: "linear-gradient(135deg, #7c3aed, #a855f7)",
          borderRadius: 7,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg viewBox="0 0 30 30" width="22" height="22">
          <circle cx="15" cy="4" r="1.8" fill="rgba(255,255,255,0.85)" />
          <rect x="5.5" y="8" width="4.5" height="17" rx="2.25" fill="white" />
          <path
            d="M10 17 C10 17 21 15.5 21 21.5 C21 27 10 26.5 10 26.5"
            fill="none"
            stroke="white"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
