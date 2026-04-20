import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // "navy" classes now map to deep forest green — keeps all existing classnames working
        navy: {
          50: "#f0f8f5",
          100: "#d4ede1",
          200: "#a9dbc3",
          300: "#74c3a1",
          400: "#3da87b",
          500: "#228b5f",
          600: "#1a704b",
          700: "#165b3c",
          800: "#124930",
          900: "#1B4332",
          950: "#0c2218",
        },
        gold: {
          300: "#e8d099",
          400: "#dfc07a",
          500: "#C5A35A",
          600: "#a8883a",
          700: "#8a6e2a",
        },
        cream: {
          50: "#FAFAF8",
          100: "#F5F4F0",
          200: "#EDE9E3",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "Times New Roman", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
