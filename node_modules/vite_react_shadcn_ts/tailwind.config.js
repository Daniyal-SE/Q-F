/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Kinetic design system
        "kinetic-surface": "hsl(var(--kinetic-surface))",
        "kinetic-surface-container": "hsl(var(--kinetic-surface-container))",
        "kinetic-surface-container-low": "hsl(var(--kinetic-surface-container-low))",
        "kinetic-surface-container-high": "hsl(var(--kinetic-surface-container-high))",
        "kinetic-surface-container-highest": "hsl(var(--kinetic-surface-container-highest))",
        "kinetic-surface-variant": "hsl(var(--kinetic-surface-variant))",
        "kinetic-on-surface": "hsl(var(--kinetic-on-surface))",
        "kinetic-on-surface-variant": "hsl(var(--kinetic-on-surface-variant))",
        "kinetic-primary": "hsl(var(--kinetic-primary))",
        "kinetic-primary-container": "hsl(var(--kinetic-primary-container))",
        "kinetic-on-primary": "hsl(var(--kinetic-on-primary))",
        "kinetic-on-primary-container": "hsl(var(--kinetic-on-primary-container))",
        "kinetic-outline": "hsl(var(--kinetic-outline))",
        "kinetic-outline-variant": "hsl(var(--kinetic-outline-variant))",
        "kinetic-tertiary": "hsl(var(--kinetic-tertiary))",
        "kinetic-tertiary-container": "hsl(var(--kinetic-tertiary-container))",
        "kinetic-secondary-container": "hsl(var(--kinetic-secondary-container))",
        "kinetic-on-secondary-container": "hsl(var(--kinetic-on-secondary-container))",
        "kinetic-error": "hsl(var(--kinetic-error))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        headline: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"],
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
