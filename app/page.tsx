"use client";

import { useState } from "react";
import BadgeForm, { BadgeParams } from "@/components/BadgeForm";
import BadgePreview from "@/components/BadgePreview";
import { Logo } from "@/components/Logo";

const DEFAULT_PARAMS: BadgeParams = {
  text: "My Badge",
  style: "corporate",
  shape: "gradient",
  label: "Badgy",
  width: 220,
  fontSize: 18,
  fontWeight: 600,
  emojiPrefix: "",
};

export default function Home() {
  const [params, setParams] = useState<BadgeParams>(DEFAULT_PARAMS);

  return (
    <main className="min-h-screen flex flex-col items-center py-10 px-4 sm:py-16" style={{ background: "var(--gradient-canvas)" }}>
      {/* Header — logo lockup replaces text-only heading */}
      <header className="mb-10 text-center">
        <div className="flex justify-center mb-3">
          <Logo size="lg" />
        </div>
        {/* sr-only h1 preserves SEO heading; visible brand mark is the Logo SVG */}
        <h1 className="sr-only">Badgy</h1>
        <p className="text-base sm:text-lg max-w-sm mx-auto" style={{ color: "var(--color-neutral-500)" }}>
          Create beautiful digital badges instantly. No account needed.
        </p>
      </header>

      {/* Two-column on desktop, stacked on mobile */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: form */}
        <section
          className="rounded-2xl p-6"
          style={{
            background: "var(--color-neutral-0)",
            border: "1px solid var(--color-neutral-200)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <h2
            className="text-base font-semibold mb-5"
            style={{ color: "var(--color-neutral-700)" }}
          >
            Customise your badge
          </h2>
          <BadgeForm onChange={setParams} />
        </section>

        {/* Right: preview */}
        <section
          className="rounded-2xl p-6 lg:sticky lg:top-6"
          style={{
            background: "var(--color-neutral-0)",
            border: "1px solid var(--color-neutral-200)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <h2
            className="text-base font-semibold mb-5"
            style={{ color: "var(--color-neutral-700)" }}
          >
            Preview &amp; export
          </h2>
          <BadgePreview params={params} />
        </section>
      </div>

      <footer className="mt-14 text-xs text-center" style={{ color: "var(--color-neutral-400)" }}>
        Made with love by the Badgy team &mdash; digital self-expression for everyone.
      </footer>
    </main>
  );
}
