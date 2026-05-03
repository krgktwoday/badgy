"use client";

import { useState } from "react";
import BadgeForm, { BadgeStyle } from "@/components/BadgeForm";
import BadgePreview from "@/components/BadgePreview";

export default function Home() {
  const [text, setText] = useState("My Badge");
  const [style, setStyle] = useState<BadgeStyle>("default");

  function handleChange(newText: string, newStyle: BadgeStyle) {
    setText(newText);
    setStyle(newStyle);
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center py-16 px-4">
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Badgy</h1>
        <p className="text-gray-500 text-lg">
          Create digital badges instantly. No account needed.
        </p>
      </header>

      {/* Creator */}
      <div className="w-full max-w-md flex flex-col gap-8">
        <BadgeForm onChange={handleChange} />
        <BadgePreview text={text} style={style} />
      </div>
    </main>
  );
}
