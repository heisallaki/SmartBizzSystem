import {
  CssBaseline,
  ThemeProvider,
} from "@mui/material";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { RouterProvider } from "react-router-dom";

import { buildTheme } from "../theme";
import AuthProvider from "../context/AuthProvider";
import router from "./router";

const THEME_KEY = "smartbizz-theme";
const COLOR_KEY = "smartbizz-primary-color";
const DENSITY_KEY = "smartbizz-density";

function getSystemTheme() {
  return window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches
    ? "dark"
    : "light";
}

export default function Providers() {
  const [mode, setMode] = useState(() =>
    localStorage.getItem(THEME_KEY) ??
    "system"
  );

  const [primaryColor, setPrimaryColor] =
    useState(
      () =>
        localStorage.getItem(COLOR_KEY) ??
        "teal"
    );

  const [density, setDensity] = useState(
    () =>
      localStorage.getItem(DENSITY_KEY) ??
      "comfortable"
  );

  const [systemMode, setSystemMode] =
    useState(getSystemTheme);

  useEffect(() => {
    const media = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const listener = (event) => {
      setSystemMode(
        event.matches ? "dark" : "light"
      );
    };

    media.addEventListener(
      "change",
      listener
    );

    window.setAppTheme = (value) => {
      localStorage.setItem(
        THEME_KEY,
        value
      );

      setMode(value);
    };

    window.setPrimaryColor = (value) => {
      localStorage.setItem(
        COLOR_KEY,
        value
      );

      setPrimaryColor(value);
    };

    window.setDensity = (value) => {
      localStorage.setItem(
        DENSITY_KEY,
        value
      );

      setDensity(value);
    };

    return () => {
      media.removeEventListener(
        "change",
        listener
      );

      delete window.setAppTheme;
      delete window.setPrimaryColor;
      delete window.setDensity;
    };
  }, []);

  const resolvedMode =
    mode === "system"
      ? systemMode
      : mode;

  const theme = useMemo(
    () =>
      buildTheme(
        resolvedMode,
        primaryColor,
        density
      ),
    [
      resolvedMode,
      primaryColor,
      density,
    ]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}