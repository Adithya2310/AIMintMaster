
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        exo: ["Exo 2", "sans-serif"],
      },
      colors: {
        background: "#0F0F13",
        foreground: "#FFFFFF",
        border: "#2A2A3A",
        input: "#1A1A24",
        ring: "rgba(0, 255, 255, 0.3)",
        neonBlue: {
          DEFAULT: "#00FFFF",
          hover: "#33FFFF",
          muted: "rgba(0, 255, 255, 0.3)",
        },
        neonPurple: {
          DEFAULT: "#A020F0",
          hover: "#B24CF0",
          muted: "rgba(160, 32, 240, 0.3)",
        },
        electricPink: {
          DEFAULT: "#FF10F0",
          hover: "#FF44F4",
          muted: "rgba(255, 16, 240, 0.3)",
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      keyframes: {
        "glow-pulse": {
          "0%": { boxShadow: "0 0 5px rgba(0, 255, 255, 0.5)" },
          "50%": { boxShadow: "0 0 15px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.5)" },
          "100%": { boxShadow: "0 0 5px rgba(0, 255, 255, 0.5)" },
        },
        "text-glow": {
          "0%": { textShadow: "0 0 5px rgba(0, 255, 255, 0.5)" },
          "50%": { textShadow: "0 0 15px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.5)" },
          "100%": { textShadow: "0 0 5px rgba(0, 255, 255, 0.5)" },
        },
        "border-glow": {
          "0%": { boxShadow: "0 0 5px rgba(0, 255, 255, 0.5), inset 0 0 5px rgba(0, 255, 255, 0.5)" },
          "50%": { 
            boxShadow: "0 0 15px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.5), inset 0 0 15px rgba(0, 255, 255, 0.5)" 
          },
          "100%": { boxShadow: "0 0 5px rgba(0, 255, 255, 0.5), inset 0 0 5px rgba(0, 255, 255, 0.5)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-slow": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "slide-right": {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "typewriter": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        "blink": {
          "0%, 100%": { opacity: "0" },
          "50%": { opacity: "1" },
        },
        "rotate-glow": {
          "0%": { 
            transform: "rotate(0deg)", 
            boxShadow: "0 0 10px rgba(0, 255, 255, 0.5), 0 0 20px rgba(160, 32, 240, 0.3)" 
          },
          "100%": { 
            transform: "rotate(360deg)", 
            boxShadow: "0 0 15px rgba(0, 255, 255, 0.7), 0 0 30px rgba(160, 32, 240, 0.5)" 
          },
        },
      },
      animation: {
        "glow-pulse": "glow-pulse 2s infinite",
        "text-glow": "text-glow 2s infinite",
        "border-glow": "border-glow 2s infinite",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-in-slow": "fade-in-slow 1s ease-out",
        "scale-in": "scale-in 0.5s ease-out",
        "slide-right": "slide-right 0.5s ease-out",
        "typewriter": "typewriter 2s steps(40, end)",
        "blink": "blink 0.7s infinite",
        "rotate-glow": "rotate-glow 10s linear infinite",
      },
      backgroundImage: {
        "neon-gradient": "linear-gradient(45deg, rgba(0, 255, 255, 0.15), rgba(160, 32, 240, 0.15), rgba(255, 16, 240, 0.15))",
        "neon-gradient-active": "linear-gradient(45deg, rgba(0, 255, 255, 0.3), rgba(160, 32, 240, 0.3), rgba(255, 16, 240, 0.3))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
