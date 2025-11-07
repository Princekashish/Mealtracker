import type { Config } from "tailwindcss";

const config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      fontFamily: {
        "sharp-groteskb20": ["Sharp Grotesk Book 20", "sans-serif"],
        "user-medium": ["User Medium", "sans-serif"],
      },
      colors: {
        // Define your custom themes  "custom-dark": "#18181b", // zinc-900 or your own
        "custom-light": "#ffffff",
      },
      animation: {
        gradient: "gradient-move 4s ease infinite",
      },
      keyframes: {
        "gradient-move": {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
