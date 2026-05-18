/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#111827",
        mint: "#2563eb",
        coral: "#ea580c",
        saffron: "#f59e0b",
        ocean: "#0284c7"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(37,99,235,.16)"
      },
      animation: {
        gradient: "gradient 10s ease infinite"
      },
      keyframes: {
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" }
        }
      }
    }
  },
  plugins: []
};
