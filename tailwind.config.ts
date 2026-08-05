import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A",
        paper: "#FFFFFF",
        bone: "#F5F3EE",
        smoke: "#6E6E6E",
        ash: "#9A9A9A",
        line: "#E6E3DC",
        stock: "#1F7A4D",
        warn: "#B45309",
        error: "#B00020",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      letterSpacing: {
        label: "0.08em",
      },
      fontSize: {
        "display-xl": ["clamp(2.5rem, 6vw, 4.5rem)", { lineHeight: "1.05" }],
        "display-lg": ["clamp(1.75rem, 4vw, 2.75rem)", { lineHeight: "1.1" }],
        body: ["1rem", { lineHeight: "1.65" }],
      },
      borderRadius: {
        DEFAULT: "2px",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
