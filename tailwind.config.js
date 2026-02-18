/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        foreground: "#f5f0eb",
        accent: "#d4c5b0",
        "accent-light": "#e8ddd0",
        muted: "#8a8178",
        surface: "rgba(10, 10, 8, 0.45)",
        border: "#2a2a2a",
      },
      fontFamily: {
        serif: ["var(--font-cardo)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": [
          "clamp(3rem, 8vw, 7rem)",
          { lineHeight: "1.05", letterSpacing: "-0.02em" },
        ],
        "display-lg": [
          "clamp(2rem, 5vw, 4.5rem)",
          { lineHeight: "1.1", letterSpacing: "-0.01em" },
        ],
        "display-md": [
          "clamp(1.5rem, 3vw, 2.5rem)",
          { lineHeight: "1.2" },
        ],
      },
      keyframes: {
        "scroll-left": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "scroll-left": "scroll-left 30s linear infinite",
      },
    },
  },
  plugins: [],
};
