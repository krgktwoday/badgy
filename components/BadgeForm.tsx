"use client";

import { useState } from "react";
import { STYLE_GROUPS, getTheme } from "@/lib/badge";

export type BadgeStyle =
  | "corporate" | "executive" | "minimal" | "verified" | "certified"
  | "neon" | "candy" | "fire" | "aurora" | "retro"
  | "champions" | "premier" | "allblacks" | "redbull" | "olympic"
  | "midnight" | "googleplex" | "carbonx" | "cloudpulse" | "supernova"
  | "default" | "success" | "warning" | "danger" | "info"
  | "purple" | "pink" | "dark" | "ocean" | "sunset";

export type BadgeShape = "flat" | "gradient" | "split" | "outline" | "glass";
export type FontWeight = 400 | 500 | 600 | 700;

export interface BadgeParams {
  text: string;
  style: BadgeStyle;
  shape: BadgeShape;
  label: string;
  width: number;
  fontSize: number;
  fontWeight: FontWeight;
  emojiPrefix: string;
}

interface BadgeFormProps {
  onChange: (params: BadgeParams) => void;
}

const SHAPE_OPTIONS: { value: BadgeShape; label: string; description: string }[] = [
  { value: "flat",     label: "Flat",     description: "Solid pill" },
  { value: "gradient", label: "Gradient", description: "Colour gradient" },
  { value: "split",    label: "Split",    description: "Label + value" },
  { value: "outline",  label: "Outline",  description: "Bordered" },
  { value: "glass",    label: "Glass",    description: "Frosted glass" },
];

const FONT_WEIGHT_OPTIONS: { value: FontWeight; label: string }[] = [
  { value: 400, label: "Regular" },
  { value: 500, label: "Medium" },
  { value: 600, label: "SemiBold" },
  { value: 700, label: "Bold" },
];

const EMOJI_PRESETS = ["", "🚀", "✅", "⚠️", "❌", "💡", "🔥", "⭐", "🎉", "🔒", "📦", "🛠️", "🏆", "🥇", "💼", "🎯"];

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

export default function BadgeForm({ onChange }: BadgeFormProps) {
  const [params, setParams] = useState<BadgeParams>(DEFAULT_PARAMS);
  const [activeCategory, setActiveCategory] = useState<string>("business");

  function update(partial: Partial<BadgeParams>) {
    const next = { ...params, ...partial };
    setParams(next);
    onChange(next);
  }

  return (
    <form
      className="flex flex-col gap-6 w-full"
      onSubmit={(e) => e.preventDefault()}
    >
      {/* Badge text */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="badge-text" className="text-sm font-semibold" style={{ color: "var(--color-neutral-900)" }}>
          Badge text
        </label>
        <input
          id="badge-text"
          type="text"
          value={params.text}
          onChange={(e) => update({ text: e.target.value.slice(0, 120) })}
          maxLength={120}
          placeholder="e.g. Open Source · MVP · Champion"
          className="rounded-lg px-3 py-2.5 text-sm transition"
          style={{
            border: "1.5px solid var(--color-neutral-200)",
            borderRadius: "var(--radius-md)",
            color: "var(--color-neutral-900)",
            background: "var(--color-neutral-0)",
            outline: "none",
            fontFamily: "var(--font-sans)",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--color-brand-500)";
            e.target.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.15)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--color-neutral-200)";
            e.target.style.boxShadow = "none";
          }}
        />
        <p className="text-xs text-right" style={{ color: "var(--color-neutral-400)" }}>{params.text.length}/120</p>
      </div>

      {/* Shape selector */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold" style={{ color: "var(--color-neutral-900)" }}>Shape</label>
        <div className="grid grid-cols-5 gap-1.5">
          {SHAPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update({ shape: opt.value })}
              title={opt.description}
              className="flex flex-col items-center gap-0.5 px-1 py-2 rounded-lg text-xs transition-all"
              style={
                params.shape === opt.value
                  ? {
                      border: "1.5px solid var(--color-brand-600)",
                      background: "var(--color-brand-100)",
                      color: "var(--color-brand-700)",
                      boxShadow: "0 0 0 2px var(--color-brand-400)",
                      fontWeight: 600,
                    }
                  : {
                      border: "1.5px solid var(--color-neutral-200)",
                      background: "var(--color-neutral-0)",
                      color: "var(--color-neutral-500)",
                    }
              }
            >
              <ShapeIcon shape={opt.value} active={params.shape === opt.value} />
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Label (only for split shape) */}
      {params.shape === "split" && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="badge-label" className="text-sm font-semibold" style={{ color: "var(--color-neutral-900)" }}>
            Left label
            <span className="ml-1.5 text-xs font-normal" style={{ color: "var(--color-neutral-400)" }}>(shown on the left tab)</span>
          </label>
          <input
            id="badge-label"
            type="text"
            value={params.label}
            onChange={(e) => update({ label: e.target.value.slice(0, 40) })}
            maxLength={40}
            placeholder="e.g. Status · Build · Version"
            className="rounded-lg px-3 py-2.5 text-sm transition"
            style={{
              border: "1.5px solid var(--color-neutral-200)",
              borderRadius: "var(--radius-md)",
              color: "var(--color-neutral-900)",
              background: "var(--color-neutral-0)",
              outline: "none",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--color-brand-500)";
              e.target.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.15)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--color-neutral-200)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
      )}

      {/* Style picker — grouped by category */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold" style={{ color: "var(--color-neutral-900)" }}>Style</label>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-1">
          {STYLE_GROUPS.map((group) => (
            <button
              key={group.category}
              type="button"
              onClick={() => setActiveCategory(group.category)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all"
              style={
                activeCategory === group.category
                  ? {
                      background: "var(--color-brand-950)",
                      color: "#ffffff",
                      border: "1px solid var(--color-brand-950)",
                    }
                  : {
                      background: "var(--color-neutral-0)",
                      color: "var(--color-neutral-500)",
                      border: "1px solid var(--color-neutral-200)",
                    }
              }
            >
              {group.label}
            </button>
          ))}
        </div>

        {/* Style grid — current category */}
        {STYLE_GROUPS.filter((g) => g.category === activeCategory).map((group) => (
          <div key={group.category} className="grid grid-cols-5 gap-1.5 mt-1">
            {group.styles.map((styleName) => {
              const theme = getTheme(styleName as import("@/lib/badge").BadgeStyle);
              const isSelected = params.style === styleName;
              return (
                <button
                  key={styleName}
                  type="button"
                  onClick={() => update({ style: styleName as BadgeStyle })}
                  title={theme.uiLabel}
                  className="flex flex-col items-center gap-1 px-1 py-2 rounded-lg text-xs transition-all"
                  style={
                    isSelected
                      ? {
                          border: "1.5px solid var(--color-brand-600)",
                          background: "var(--color-brand-100)",
                          color: "var(--color-brand-700)",
                          boxShadow: "0 0 0 2px var(--color-brand-400)",
                          fontWeight: 600,
                        }
                      : {
                          border: "1.5px solid var(--color-neutral-200)",
                          background: "var(--color-neutral-0)",
                          color: "var(--color-neutral-500)",
                        }
                  }
                >
                  {/* Swatch — shows the actual background + accent colors */}
                  <StyleSwatch theme={theme} />
                  <span className="truncate max-w-full">{theme.uiLabel}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Emoji prefix */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold" style={{ color: "var(--color-neutral-900)" }}>Emoji prefix</label>
        <div className="flex flex-wrap gap-1.5 items-center">
          {EMOJI_PRESETS.map((emoji) => (
            <button
              key={emoji === "" ? "none" : emoji}
              type="button"
              onClick={() => update({ emojiPrefix: emoji })}
              className="px-2 py-1 rounded-md text-sm transition-colors"
              style={
                params.emojiPrefix === emoji
                  ? {
                      border: "1.5px solid var(--color-brand-500)",
                      background: "var(--color-brand-50)",
                      boxShadow: "0 0 0 1px var(--color-brand-400)",
                    }
                  : {
                      border: "1px solid var(--color-neutral-200)",
                      background: "var(--color-neutral-0)",
                    }
              }
              title={emoji === "" ? "No emoji" : emoji}
            >
              {emoji === "" ? <span className="text-xs" style={{ color: "var(--color-neutral-400)" }}>none</span> : emoji}
            </button>
          ))}
          {/* Custom emoji input */}
          <input
            type="text"
            value={params.emojiPrefix}
            onChange={(e) => update({ emojiPrefix: e.target.value.slice(0, 8) })}
            placeholder="custom"
            className="w-20 rounded-md px-2 py-1 text-sm"
            style={{
              border: "1px solid var(--color-neutral-200)",
              borderRadius: "var(--radius-md)",
              outline: "none",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--color-brand-500)";
              e.target.style.boxShadow = "0 0 0 2px rgba(139, 92, 246, 0.15)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--color-neutral-200)";
              e.target.style.boxShadow = "none";
            }}
            title="Type a custom emoji"
          />
        </div>
      </div>

      {/* Advanced: Width + Font size */}
      <div className="grid grid-cols-2 gap-4">
        {/* Width */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <label htmlFor="badge-width" className="text-sm font-semibold" style={{ color: "var(--color-neutral-900)" }}>
              Width
            </label>
            <span className="text-xs tabular-nums" style={{ color: "var(--color-neutral-500)" }}>{params.width}px</span>
          </div>
          <input
            id="badge-width"
            type="range"
            min={80}
            max={600}
            step={10}
            value={params.width}
            onChange={(e) => update({ width: parseInt(e.target.value, 10) })}
            className="w-full"
            style={{ accentColor: "var(--color-brand-600)" }}
          />
          <div className="flex justify-between text-xs" style={{ color: "var(--color-neutral-400)" }}>
            <span>80</span>
            <span>600</span>
          </div>
        </div>

        {/* Font size */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <label htmlFor="badge-font-size" className="text-sm font-semibold" style={{ color: "var(--color-neutral-900)" }}>
              Font size
            </label>
            <span className="text-xs tabular-nums" style={{ color: "var(--color-neutral-500)" }}>{params.fontSize}px</span>
          </div>
          <input
            id="badge-font-size"
            type="range"
            min={10}
            max={40}
            step={1}
            value={params.fontSize}
            onChange={(e) => update({ fontSize: parseInt(e.target.value, 10) })}
            className="w-full"
            style={{ accentColor: "var(--color-brand-600)" }}
          />
          <div className="flex justify-between text-xs" style={{ color: "var(--color-neutral-400)" }}>
            <span>10</span>
            <span>40</span>
          </div>
        </div>
      </div>

      {/* Font weight */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold" style={{ color: "var(--color-neutral-900)" }}>Font weight</label>
        <div className="grid grid-cols-4 gap-1.5">
          {FONT_WEIGHT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update({ fontWeight: opt.value })}
              className="px-2 py-2 rounded-lg text-xs transition-colors"
              style={
                params.fontWeight === opt.value
                  ? {
                      border: "1.5px solid var(--color-brand-600)",
                      background: "var(--color-brand-100)",
                      color: "var(--color-brand-700)",
                      boxShadow: "0 0 0 1px var(--color-brand-400)",
                      fontWeight: 600,
                    }
                  : {
                      border: "1px solid var(--color-neutral-200)",
                      background: "var(--color-neutral-0)",
                      color: "var(--color-neutral-500)",
                    }
              }
            >
              <span style={{ fontWeight: opt.value }}>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/**
 * StyleSwatch renders a small visual representation of a badge theme.
 * Uses inline styles so it works without the SVG API call.
 */
function StyleSwatch({ theme }: { theme: ReturnType<typeof getTheme> }) {
  const hasGradient = !!theme.gradient;

  return (
    <div
      style={{
        width: 36,
        height: 18,
        borderRadius: 9,
        border: `1.5px solid ${theme.border}`,
        ...(hasGradient
          ? { backgroundImage: theme.gradient }
          : { backgroundColor: theme.bg }),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: theme.accent,
          opacity: 0.9,
        }}
      />
    </div>
  );
}

/** Tiny SVG icon representing the badge shape */
function ShapeIcon({ shape, active }: { shape: BadgeShape; active: boolean }) {
  // Brand violet when active, neutral gray otherwise
  const color = active ? "#7c3aed" : "#9ca3af";
  switch (shape) {
    case "flat":
      return (
        <svg width="28" height="14" viewBox="0 0 28 14">
          <rect x="1" y="1" width="26" height="12" rx="6" fill={color} />
        </svg>
      );
    case "gradient":
      return (
        <svg width="28" height="14" viewBox="0 0 28 14">
          <defs>
            <linearGradient id={`grad-${active}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={active ? "#a78bfa" : "#d1d5db"} />
            </linearGradient>
          </defs>
          <rect x="1" y="1" width="26" height="12" rx="6" fill={`url(#grad-${active})`} />
        </svg>
      );
    case "split":
      return (
        <svg width="28" height="14" viewBox="0 0 28 14">
          <rect x="1" y="1" width="10" height="12" rx="3" fill={color} />
          <rect x="12" y="1" width="15" height="12" rx="3" fill={active ? "#ddd6fe" : "#e5e7eb"} />
        </svg>
      );
    case "outline":
      return (
        <svg width="28" height="14" viewBox="0 0 28 14">
          <rect x="1" y="1" width="26" height="12" rx="6" fill="none" stroke={color} strokeWidth="2" />
        </svg>
      );
    case "glass":
      return (
        <svg width="28" height="14" viewBox="0 0 28 14">
          <rect x="1" y="1" width="26" height="12" rx="6" fill={active ? "#c4b5fd" : "#d1d5db"} opacity="0.6" />
          <rect x="3" y="2" width="22" height="5" rx="3" fill="white" opacity="0.5" />
        </svg>
      );
    default:
      return null;
  }
}
