/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        display: ["var(--font-outfit)", "var(--font-sans)", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        charcoal: {
          950: "#070A11",
          900: "#0B0F19",
          850: "#101626",
          800: "#161F36",
          700: "#222F4C",
        },
        champagne: {
          300: "#FDF0CD",
          400: "#F5DF95",
          500: "#E6CA65",
          600: "#CBA738",
          700: "#9E7E1D",
        },
        violet: {
          neon: "#8B5CF6",
          electric: "#A855F7",
          glow: "#7C3AED",
        },
      },
      boxShadow: {
        'glow-gold': '0 0 35px -5px rgba(230, 202, 101, 0.25)',
        'glow-violet': '0 0 35px -5px rgba(139, 92, 246, 0.3)',
        'glow-subtle': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
