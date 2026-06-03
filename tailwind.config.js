/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      // ── COLORS ───────────────────────────────────────────
      colors: {
        primary: {
          DEFAULT: "#6366F1", // indigo-500 — buttons, links, accents
          dark: "#4F46E5", // indigo-600 — hover states
          light: "#EEF2FF", // indigo-50  — tag backgrounds, highlights
        },
        secondary: {
          DEFAULT: "#64748B", // slate-500 — secondary text, icons
          light: "#F1F5F9", // slate-100 — secondary button bg
        },
        accent: "#7C3AED", // violet-700 — special highlights
        success: "#10B981", // emerald-500
        warning: "#F59E0B", // amber-500
        danger: "#F43F5E", // rose-500

        surface: "#F3F4F6", // page background
        card: "#FFFFFF", // component cards
        border: "#E5E7EB", // default borders
        "border-focus": "#818CF8", // focused input borders

        "text-primary": "#1F2937", // headings, important text
        "text-secondary": "#6B7280", // subheadings, labels
        "text-muted": "#9CA3AF", // placeholders, hints
        "text-on-primary": "#FFFFFF", // text on colored backgrounds
      },

      // ── FONTS ────────────────────────────────────────────
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["Fira Code", "monospace"],
      },

      // ── FONT SIZES ───────────────────────────────────────
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.625rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.875rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
      },

      // ── BORDER RADIUS ────────────────────────────────────
      borderRadius: {
        sm: "0.375rem", // 6px  — tags, badges
        md: "0.5rem", // 8px  — inputs, small buttons
        lg: "0.75rem", // 12px — buttons, inner cards
        xl: "1rem", // 16px — project cards
        "2xl": "1.25rem", // 20px — main section cards
        full: "9999px", // pill — skill tags
      },

      // ── SPACING (extend only what's custom) ──────────────
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },

      // ── BOX SHADOW ───────────────────────────────────────
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 12px rgba(99,102,241,0.12)",
        input: "0 0 0 3px rgba(99,102,241,0.15)",
      },
    },
  },
  plugins: [],
};
