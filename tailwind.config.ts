import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#080C09",
        text: "#D8E5CF",
        muted: "#6C7D68",
        signal: "#57B97A",
        rule: "#161C17",
        surface: "#0D130E",
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        caps: "0.1em",
      },
    },
  },
  plugins: [],
};

export default config;
