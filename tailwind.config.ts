import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        stadium: {
          base: "var(--color-stadium-base)",
          surface: "var(--color-stadium-surface)",
          elevated: "var(--color-stadium-elevated)",
          overlay: "var(--color-stadium-overlay)",
          border: "var(--color-stadium-border)",
          "border-strong": "var(--color-stadium-border-strong)",
          "border-subtle": "var(--color-stadium-border-subtle)",
        },
        volt: {
          DEFAULT: "var(--color-volt)",
          hover: "var(--color-volt-hover)",
          active: "var(--color-volt-active)",
          dim: "var(--color-volt-dim)",
          glow: "var(--color-volt-glow)",
        },
        telemetry: {
          cyan: "var(--color-telemetry-cyan)",
          "cyan-hover": "var(--color-telemetry-cyan-hover)",
          "cyan-dim": "var(--color-telemetry-cyan-dim)",
          "cyan-glow": "var(--color-telemetry-cyan-glow)",
        },
        thermal: {
          low: "var(--color-thermal-low)",
          "mid-1": "var(--color-thermal-mid-1)",
          "mid-2": "var(--color-thermal-mid-2)",
          "mid-3": "var(--color-thermal-mid-3)",
          high: "var(--color-thermal-high)",
        },
        pitch: {
          dark: "var(--color-pitch-dark)",
          light: "var(--color-pitch-light)",
          line: "var(--color-pitch-line)",
          "line-faint": "var(--color-pitch-line-faint)",
        },
        brand: {
          lime: "#A6FF00",
          navy: "#0B1F44",
          white: "#FFFFFF",
          gray: "#6B7280",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        "mono-stats": ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      boxShadow: {
        stadium: "var(--shadow-stadium-card)",
        "volt-glow": "var(--shadow-volt-glow)",
        "cyan-glow": "var(--shadow-cyan-glow)",
        "thermal-glow": "var(--shadow-thermal-glow)",
      },
      backgroundImage: {
        "tactical-grid":
          "linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
        "volt-gradient":
          "linear-gradient(135deg, #A6FF00 0%, #7ACC00 100%)",
        "cyan-gradient":
          "linear-gradient(135deg, var(--color-telemetry-cyan) 0%, #0B1F44 100%)",
        "card-sheen":
          "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scan-line": "scanline 2.5s linear infinite",
        "radar-sweep": "radarsweep 4s linear infinite",
      },
      keyframes: {
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
        radarsweep: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
