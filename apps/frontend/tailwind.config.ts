import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        turquesa: "#00a6a6",
        amarillo: "#f2d479",
        bordo: "#6e1e2d",
        celeste: "#a8d8ff",
        verde: "#a6c48a",
        cemento: "#e8e8e8",
        grafito: "#2c2c2c",
        tiza: "#fafafa",
        crema: "#f9f7f4",
        beige: "#f5f1eb",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
