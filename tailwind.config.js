/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aurora: {
          violet: "#2563EB",
          blue:   "#3B82F6",
          cyan:   "#22D3EE",
          ink:    "#0B1020",
          muted:  "#5B6178",
          bg:     "#F7F8FF",
        },
      },
      fontFamily: {
        display: ["Sora", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        "aurora-sm": "0 4px 18px rgba(37,99,235,0.18)",
        "aurora-md": "0 10px 34px rgba(59,130,246,0.22)",
        "aurora-lg": "0 24px 60px rgba(37,99,235,0.28)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
};
