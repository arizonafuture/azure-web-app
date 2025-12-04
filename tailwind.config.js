import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#df6853",
        grey: "#363636",
      },
      spacing: {
        "60%": "60%",
        "70%": "70%",
      },
      letterSpacing: {
        widest: '0.515em',
      },
      borderRadius: {
        "Newsletter": "30px 400px 30px 30px"
      },
    },
  },
  plugins: [],
};
export default config;
