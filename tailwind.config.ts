import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          850: "#151e2e",
          950: "#090d16",
        },
        cwa: {
          blue: "#0284c7",
          cyan: "#06b6d4",
          teal: "#0d9488",
          amber: "#d97706",
          purple: "#7c3aed",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        glow: "0 0 25px rgba(56, 189, 248, 0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
