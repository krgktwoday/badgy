"use client";

import { useState } from "react";

export type BadgeStyle =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "purple"
  | "pink"
  | "dark"
  | "ocean"
  | "sunset";

export type FontWeight = 400 | 500 | 600 | 700;

export interface BadgeParams {
  text: string;
  style: BadgeStyle;
  width: number;
  fontSize: number;
  fontWeight: FontWeight;
  emojiPrefix: string;
}

interface BadgeFormProps {
  onChange: (params: BadgeParams) => void;
}

const STYLE_OPTIONS: { value: BadgeStyle; label: string; dot: string }[] = [
  { value: "default", label: "Default",  dot: "#9ca3af" },
  { value: "success", label: "Success",  dot: "#22c55e" },
  { value: "warning", label: "Warning",  dot: "#eab308" },
  { value: "danger",  label: "Danger",   dot: "#ef4444" },
  { value: "info",    label: "Info",     dot: "#3b82f6" },
  { value: "purple",  label: "Purple",   dot: "#8b5cf6" },
  { value: "pink",    label: "Pink",     dot: "#ec4899" },
  { value: "dark",    label: "Dark",     dot: "#374151" },
  { value: "ocean",   label: "Ocean",    dot: "#06b6d4" },
  { value: "sunset",  label: "Sunset",   dot: "#f97316" },
];

const FONT_WEIGHT_OPTIONS: { value: FontWeight; label: string }[] = [
  { value: 400, label: "Regular (400)" },
  { value: 500, label: "Medium (500)" },
  { value: 600, label: "SemiBold (600)" },
  { value: 700, label: "Bold (700)" },
];

const EMOJI_PRESETS = ["", "🚀", "✅", "⚠️", "❌", "💡", "🔥", "⭐", "🎉", "🔒", "📦", "🛠️"];

const DEFAULT_PARAMS: BadgeParams = {
  text: "My Badge",
  style: "default",
  width: 200,
  fontSize: 18,
  fontWeight: 600,
  emojiPrefix: "",
};

export default function BadgeForm({ onChange }: BadgeFormProps) {
  const [params, setParams] = useState<BadgeParams>(DEFAULT_PARAMS);

  function update(partial: Partial<BadgeParams>) {
    const next = { ...params, ...partial };
    setParams(next);
    onChange(next);
  }

  return (
    <form
      className="flex flex-col gap-5 w-full"
      onSubmit={(e) => e.preventDefault()}
    >
      {/* Badge text */}
      <div className="flex flex-col gap-1">
        <label htmlFor="badge-text" className="text-sm font-medium text-gray-700">
          Badge text
        </label>
        <input
          id="badge-text"
          type="text"
          value={params.text}
          onChange={(e) => update({ text: e.target.value.slice(0, 120) })}
          maxLength={120}
          placeholder="e.g. Open Source"
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-400 text-right">{params.text.length}/120</p>
      </div>

      {/* Emoji prefix */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Emoji prefix</label>
        <div className="flex flex-wrap gap-2 items-center">
          {EMOJI_PRESETS.map((emoji) => (
            <button
              key={emoji === "" ? "none" : emoji}
              type="button"
              onClick={() => update({ emojiPrefix: emoji })}
              className={`px-2 py-1 rounded-md text-sm border transition-colors ${
                params.emojiPrefix === emoji
                  ? "border-blue-500 bg-blue-50 ring-1 ring-blue-400"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
              title={emoji === "" ? "No emoji" : emoji}
            >
              {emoji === "" ? <span className="text-gray-400 text-xs">none</span> : emoji}
            </button>
          ))}
          {/* Custom emoji input */}
          <input
            type="text"
            value={params.emojiPrefix}
            onChange={(e) => update({ emojiPrefix: e.target.value.slice(0, 8) })}
            placeholder="custom"
            className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Type a custom emoji"
          />
        </div>
      </div>

      {/* Style */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Style</label>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-5">
          {STYLE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update({ style: opt.value })}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs border transition-colors ${
                params.style === opt.value
                  ? "border-blue-500 bg-blue-50 ring-1 ring-blue-400 font-semibold"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: opt.dot }}
              />
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Width slider */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <label htmlFor="badge-width" className="text-sm font-medium text-gray-700">
            Width
          </label>
          <span className="text-xs text-gray-500 tabular-nums">{params.width}px</span>
        </div>
        <input
          id="badge-width"
          type="range"
          min={80}
          max={600}
          step={10}
          value={params.width}
          onChange={(e) => update({ width: parseInt(e.target.value, 10) })}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>80</span>
          <span>600</span>
        </div>
      </div>

      {/* Font size */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <label htmlFor="badge-font-size" className="text-sm font-medium text-gray-700">
            Font size
          </label>
          <span className="text-xs text-gray-500 tabular-nums">{params.fontSize}px</span>
        </div>
        <input
          id="badge-font-size"
          type="range"
          min={10}
          max={40}
          step={1}
          value={params.fontSize}
          onChange={(e) => update({ fontSize: parseInt(e.target.value, 10) })}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>10</span>
          <span>40</span>
        </div>
      </div>

      {/* Font weight */}
      <div className="flex flex-col gap-1">
        <label htmlFor="badge-font-weight" className="text-sm font-medium text-gray-700">
          Font weight
        </label>
        <div className="grid grid-cols-4 gap-2">
          {FONT_WEIGHT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update({ fontWeight: opt.value })}
              className={`px-2 py-1.5 rounded-md text-xs border transition-colors ${
                params.fontWeight === opt.value
                  ? "border-blue-500 bg-blue-50 ring-1 ring-blue-400"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
