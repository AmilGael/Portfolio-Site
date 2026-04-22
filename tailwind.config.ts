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
        bg: "#0B0A08",
        text: "#EDE5D3",
        muted: "#7A7367",
        signal: "#C77A3A",
        rule: "#1F1C18",
        surface: "#13110E",
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
