/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f4f7f8",
          100: "#e3eaed",
          200: "#c5d4da",
          300: "#9db4be",
          400: "#6f8f9d",
          500: "#547482",
          600: "#465f6c",
          700: "#3c4f5a",
          800: "#35434c",
          900: "#2f3a42",
          950: "#1a2228",
        },
        accent: {
          DEFAULT: "#0d9488",
          soft: "#14b8a6",
          deep: "#0f766e",
          glow: "#2dd4bf",
        },
        sand: {
          DEFAULT: "#e8e4dc",
          muted: "#f3f0ea",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(26,34,40,0.04), 0 12px 32px rgba(26,34,40,0.08)",
        "card-hover":
          "0 2px 4px rgba(26,34,40,0.05), 0 20px 48px rgba(26,34,40,0.12)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s ease-in-out infinite",
        "fade-up": "fade-up 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
