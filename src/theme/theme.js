import { createTheme } from "@mui/material/styles";

import { colors } from "./colors";
import typography from "./typography";
import buildComponents from "./components";

const PRIMARY_COLORS = {
  teal: {
    main: "#0F766E",
    light: "#14B8A6",
    dark: "#115E59",
  },

  blue: {
    main: "#2563EB",
    light: "#3B82F6",
    dark: "#1D4ED8",
  },

  purple: {
    main: "#7C3AED",
    light: "#A855F7",
    dark: "#6D28D9",
  },

  green: {
    main: "#16A34A",
    light: "#22C55E",
    dark: "#15803D",
  },

  orange: {
    main: "#EA580C",
    light: "#F97316",
    dark: "#C2410C",
  },
};

export function buildTheme(
  mode = "light",
  primaryColor = "teal",
  density = "comfortable"
) {
  const dark = mode === "dark";

  const primary =
    PRIMARY_COLORS[primaryColor] ??
    colors.primary;

  return createTheme({
    palette: {
      mode,

      primary,
      secondary: colors.secondary,

      success: colors.success,
      warning: colors.warning,
      error: colors.error,

      divider: dark
        ? "#374151"
        : "#E5E7EB",

      text: {
        primary: dark
          ? "#F9FAFB"
          : "#111827",

        secondary: dark
          ? "#D1D5DB"
          : "#6B7280",
      },

      background: {
        default: dark
          ? "#111827"
          : "#F8FAFC",

        paper: dark
          ? "#1F2937"
          : "#FFFFFF",
      },
    },

    typography,

    spacing:
  density === "compact"
    ? 6
    : 8,

    components:
      buildComponents(density),

    shape: {
      borderRadius: 12,
    },
  });
}

export default buildTheme;