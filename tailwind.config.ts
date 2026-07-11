import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Genel marka paleti — "derin okyanus"
        abyss: {
          DEFAULT: "#0B1220",
          surface: "#111827",
          border: "#1E2A3B",
        },
        aqua: {
          DEFAULT: "#22D3B8",
          dim: "#16A594",
          bright: "#5EEAD4",
        },
        gold: {
          DEFAULT: "#C9A227",
          bright: "#E0BE4C",
          dim: "#8F7318",
        },
        ink: {
          DEFAULT: "#E7ECEF",
          muted: "#8B97A6",
          faint: "#5B6675",
        },
        // Apollo alt-teması — "gece / güneş tanrısı"
        apollo: {
          bg: "#150F08",
          surface: "#1E1610",
          gold: "#D4A343",
          ember: "#B4432D",
          text: "#F2E9D8",
          muted: "#A6957A",
        },
        // Helios alt-teması — "mermer / tapınak"
        helios: {
          bg: "#E7E0CE",
          surface: "#FBF9F4",
          bronze: "#A8763E",
          sage: "#8B9574",
          line: "#DAD2BE",
          text: "#2B2620",
          muted: "#7C7361",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      backgroundImage: {
        "abyss-gradient":
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(34,211,184,0.12), transparent), radial-gradient(ellipse 60% 50% at 100% 100%, rgba(201,162,39,0.08), transparent)",
      },
      keyframes: {
        ripple: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glow: {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.08)" },
        },
        drift: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(3%, -4%)" },
        },
      },
      animation: {
        ripple: "ripple 6s linear infinite",
        rise: "rise 0.6s ease-out forwards",
        glow: "glow 7s ease-in-out infinite",
        "glow-slow": "glow 10s ease-in-out infinite",
        drift: "drift 12s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
