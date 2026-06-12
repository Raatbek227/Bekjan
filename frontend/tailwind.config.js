/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./layouts/**/*.{js,jsx}",
    "./providers/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: "#080808",
        ink: "#f8fafc",
        muted: "#a1a1aa",
        accent: "#f97316",
        ember: "#ffb86b"
      },
      fontFamily: {
        display: ["var(--font-display)", "Inter", "sans-serif"],
        body: ["var(--font-body)", "Inter", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 40px rgba(249, 115, 22, 0.22)"
      }
    }
  },
  plugins: []
};