import { transform } from "typescript";

/** @type {import('tailwindcss').Config} */
export default {
  prefix: "tb-",
  corePlugins: {
    preflight: false,
  },
  content: ["./src/**/*.{html,js,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        slideRightIn: {
          "0%": { transform: "" },
          "100%": { transform: "translateX(0)" },
        },
        slideRightOut: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
        slideLeftIn: {
          "0%": { transform: "" },
          "100%": { transform: "translateX(0)" },
        },
        slideLeftOut: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        slideRightIn: "slideRightIn 0.5s ease-out forwards",
        slideRightOut: "slideRightOut 0.5s ease-out forwards",
        slideLeftIn: "slideLeftIn 0.5s ease-in forwards",
        slideLeftOut: "slideLeftOut 0.5s ease-in forwards",
      },
    },
  },
  plugins: [],
};
