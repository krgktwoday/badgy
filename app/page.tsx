"use client";

import { useState } from "react";
import BadgeForm, { BadgeParams } from "@/components/BadgeForm";
import BadgePreview from "@/components/BadgePreview";

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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col items-center py-10 px-4 sm:py-16">
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-3">
          Badgy
        </h1>
        <p className="text-gray-500 text-base sm:text-lg max-w-sm mx-auto">
          Create beautiful digital badges instantly. No account needed.
        </p>
      </header>

      {/* Two-column on desktop, stacked on mobile */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: form */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-5">Customise your badge</h2>
          <BadgeForm onChange={setParams} />
        </section>

        {/* Right: preview */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:sticky lg:top-6">
          <h2 className="text-base font-semibold text-gray-700 mb-5">Preview &amp; export</h2>
          <BadgePreview params={params} />
        </section>
      </div>

      <footer className="mt-14 text-xs text-gray-400 text-center">
        Made with love by the Badgy team &mdash; digital self-expression for everyone.
      </footer>
    </main>
  );
}
