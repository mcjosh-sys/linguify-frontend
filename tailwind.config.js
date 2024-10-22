/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("@spartan-ng/ui-core/hlm-tailwind-preset")],
  content: ["./src/**/*.{html,ts}", "./components/**/*.{html,ts}"],
  theme: {
    extend: {
      animation: {
        "scale-up": "scaleUp 1s linear infinite",
        pulse2: "pulse2 1s linear infinite",
      },
      keyframes: {
        scaleUp: {
          "0%": { transform: "translate(-50%, -50%) scale(0)" },
          "60%, 100%": { transform: "translate(-50%, -50%) scale(1)" },
        },
        pulse2: {
          "0%, 60%, 100%": { transform: "scale(1)" },
          "80%": { transform: "scale(1.2)" },
        },
      },
    },
  },
  plugins: [],
};
