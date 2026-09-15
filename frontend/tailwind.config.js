/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0D0B14",       // near-black background
        surface: "#17131F",    // card / panel background
        surfaceHigh: "#1F1A2B",
        coral: "#FF5A72",      // primary accent — energy, dares, CTAs
        lilac: "#9B8CFF",      // secondary accent — flirty/vote/adult
        gold: "#F2C14E",       // scores, streaks, highlights
        bone: "#F5F1EA",       // primary text on dark
        mute: "#B8AFC6",       // secondary text
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Sora'", "sans-serif"],
      },
      borderRadius: {
        card: "1.25rem",
      },
      boxShadow: {
        glow: "0 0 60px -12px rgba(255,90,114,0.35)",
      },
    },
  },
  plugins: [],
};
