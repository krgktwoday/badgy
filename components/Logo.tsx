"use client";

import { useId } from "react";

type LogoSize = "sm" | "md" | "lg";

const heights: Record<LogoSize, number> = { sm: 24, md: 32, lg: 40 };

/**
 * Badgy Logo Mark — badge shape + 'b' letterform + pin hole + gradient.
 * Accepts `size` prop: "sm" (24px), "md" (32px, default), "lg" (40px).
 * Uses useId() to scope the linearGradient ID so multiple instances on the
 * same page don't collide.
 *
 * Spec: /BAD/issues/BAD-15#document-logo-spec
 */
export function Logo({ size = "md" }: { size?: LogoSize }) {
  const uid = useId();
  const gradientId = `badgy-logo-bg-${uid}`;
  const h = heights[size];

  return (
    <div className="flex items-center gap-2" aria-label="Badgy">
      <svg
        viewBox="0 0 48 48"
        height={h}
        width={h}
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>

        {/* Badge background */}
        <rect
          x="3"
          y="5"
          width="42"
          height="38"
          rx="11"
          fill={`url(#${gradientId})`}
        />

        {/* Subtle specular highlight — 1.5px white at 18% opacity */}
        <rect
          x="3"
          y="5"
          width="42"
          height="38"
          rx="11"
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1.5"
        />

        {/* Badge pin hole */}
        <circle cx="24" cy="11" r="2.2" fill="rgba(255,255,255,0.85)" />

        {/* Stem of 'b' */}
        <rect x="14.5" y="16" width="5" height="20" rx="2.5" fill="white" />

        {/* Bowl of 'b' */}
        <path
          d="M19.5 24 C19.5 24 30 22.5 30 30 C30 36.5 19.5 36 19.5 36"
          fill="none"
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <span
        className="font-extrabold text-brand-950 tracking-tight select-none"
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: h * 0.6875,
          letterSpacing: "-0.03em",
          lineHeight: 1,
        }}
      >
        Badgy
      </span>
    </div>
  );
}
