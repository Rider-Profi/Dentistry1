import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./emails/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17332f",
        cream: "#f6f3eb",
        mint: "#dcece7",
        sage: "#78a99b",
        teal: "#1f6b5f",
        coral: "#e8987f"
      },
      boxShadow: {
        soft: "0 24px 70px rgba(25, 74, 65, 0.12)"
      },
      borderRadius: {
        "4xl": "2rem"
      }
    }
  },
  plugins: []
};

export default config;
