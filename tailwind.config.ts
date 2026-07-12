import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // 紫色主色调系统
        primary: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7e22ce",
          800: "#6b21a8",
          900: "#581c87",
        },
        // 辅助色
        accent: {
          gold: "#F59E0B", // 幸运/吉祥
          rose: "#F43F5E", // 警告/不宜
          teal: "#14B8A6", // 宜/顺利
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"PingFang SC"',
          '"Microsoft YaHei"',
          '"Noto Sans CJK SC"',
          "sans-serif",
        ],
      },
      borderRadius: {
        card: "16px",
        input: "12px",
        btn: "24px",
      },
      boxShadow: {
        card: "0 2px 16px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 4px 24px rgba(147, 51, 234, 0.12)",
        btn: "0 4px 14px rgba(147, 51, 234, 0.25)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
