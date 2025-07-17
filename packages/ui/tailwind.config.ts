import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "selector",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      animation: {
        "slide-out": "slide-out 0.5s ease-in-out",
        "slide-in": "slide-in 0.5s ease-in-out",
      },
      colors: {
        background: "var(--background)",
        "background-active": "var(--background-active)",
        foreground: "var(--foreground)",
        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",
        cta: "var(--cta)",
        brand: "var(--brand-primary)",
        "brand-hover": "var(--brand-primary-hover)",
        "brand-pressed": "var(--brand-primary-pressed)",
        "brand-disabled": "var(--brand-primary-disabled)",
        primary: "#1A1717",
        secondary: "#4D4745",
        tertiary: "#B2B1B1",
        quaternary: "#8C8988",
        muted: "#736E6D",
        dev: {
          secondary: "var(--dev-secondary)",
          "background-tertiary": "var(--dev-background-tertiary)",
        },
      },
    },
    fontSize: {
      xs: [
        "0.625rem",
        {
          lineHeight: "1rem",
          letterSpacing: "0.01rem",
        },
      ],
      sm: ["0.875rem", "1.5rem"],
      base: ["1rem", "1.75rem"],
      lg: ["1.125rem", "2rem"],
      xl: ["1.5rem", "2.5rem"],
      "2xl": ["2rem", "3rem"],
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
