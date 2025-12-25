import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        fog: "#e2e8f0",
        mint: "#6ee7b7",
        accent: "#6366f1"
      }
    }
  },
  plugins: []
};

export default config;
