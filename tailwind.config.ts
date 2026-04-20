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
        navy: {
          50: "#f0f4f9",
          100: "#d9e4f0",
          200: "#b3c9e1",
          300: "#7da4cb",
          400: "#4d7fb5",
          500: "#2d5f9e",
          600: "#1f4a82",
          700: "#183a6a",
          800: "#152e55",
          900: "#1B2B4B",
          950: "#0d1a2e",
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
