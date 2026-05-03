"use client";

import { useState } from "react";

export type BadgeStyle = "default" | "success" | "warning" | "danger" | "info";

interface BadgeFormProps {
  onChange: (text: string, style: BadgeStyle) => void;
}

const STYLE_OPTIONS: { value: BadgeStyle; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "success", label: "Success" },
  { value: "warning", label: "Warning" },
  { value: "danger",  label: "Danger" },
  { value: "info",    label: "Info" },
];

export default function BadgeForm({ onChange }: BadgeFormProps) {
  const [text, setText] = useState("My Badge");
  const [style, setStyle] = useState<BadgeStyle>("default");

  function handleText(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.slice(0, 120);
    setText(val);
    onChange(val, style);
  }

  function handleStyle(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value as BadgeStyle;
    setStyle(val);
    onChange(text, val);
  }

  return (
    <form className="flex flex-col gap-4 w-full max-w-sm" onSubmit={(e) => e.preventDefault()}>
      <div className="flex flex-col gap-1">
        <label htmlFor="badge-text" className="text-sm font-medium text-gray-700">
          Badge text
        </label>
        <input
          id="badge-text"
          type="text"
          value={text}
          onChange={handleText}
          maxLength={120}
          placeholder="e.g. Open Source"
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-400 text-right">{text.length}/120</p>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="badge-style" className="text-sm font-medium text-gray-700">
          Style
        </label>
        <select
          id="badge-style"
          value={style}
          onChange={handleStyle}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {STYLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
}
