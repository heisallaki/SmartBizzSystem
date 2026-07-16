import { useCallback, useState } from "react";

import { appearanceSettings as initialSettings } from "../data/settingsData";

const THEME_KEY = "smartbizz-theme";
const COLOR_KEY = "smartbizz-primary-color";
const DENSITY_KEY = "smartbizz-density";

export default function useAppearanceSettings() {
  const [settings, setSettings] = useState(() => ({
    ...structuredClone(initialSettings),

    theme:
      localStorage.getItem(THEME_KEY) ??
      initialSettings.theme,

    primaryColor:
      localStorage.getItem(COLOR_KEY) ??
      initialSettings.primaryColor,

    density:
      localStorage.getItem(DENSITY_KEY) ??
      initialSettings.density,
  }));

  const applyTheme = useCallback((theme) => {
    localStorage.setItem(THEME_KEY, theme);

    window.setAppTheme?.(theme);
  }, []);

  const applyPrimaryColor = useCallback((color) => {
    localStorage.setItem(COLOR_KEY, color);

    window.setPrimaryColor?.(color);
  }, []);

  const applyDensity = useCallback((density) => {
    localStorage.setItem(DENSITY_KEY, density);

    window.setDensity?.(density);
  }, []);

  const handleInputChange = useCallback(
    (event) => {
      const { name, value } = event.target;

      setSettings((previous) => ({
        ...previous,
        [name]: value,
      }));

      switch (name) {
        case "theme":
          applyTheme(value);
          break;

        case "primaryColor":
          applyPrimaryColor(value);
          break;

        case "density":
          applyDensity(value);
          break;

        default:
          break;
      }
    },
    [
      applyTheme,
      applyPrimaryColor,
      applyDensity,
    ]
  );

  const handleSwitchChange = useCallback(
    (event) => {
      const { name, checked } = event.target;

      setSettings((previous) => ({
        ...previous,
        [name]: checked,
      }));
    },
    []
  );

  const setTheme = useCallback(
    (theme) => {
      setSettings((previous) => ({
        ...previous,
        theme,
      }));

      applyTheme(theme);
    },
    [applyTheme]
  );

  const setPrimaryColor = useCallback(
    (primaryColor) => {
      setSettings((previous) => ({
        ...previous,
        primaryColor,
      }));

      applyPrimaryColor(primaryColor);
    },
    [applyPrimaryColor]
  );

  const setDensity = useCallback(
    (density) => {
      setSettings((previous) => ({
        ...previous,
        density,
      }));

      applyDensity(density);
    },
    [applyDensity]
  );

  const update = useCallback(
    (values) => {
      setSettings((previous) => ({
        ...previous,
        ...values,
      }));

      if (values.theme) {
        applyTheme(values.theme);
      }

      if (values.primaryColor) {
        applyPrimaryColor(
          values.primaryColor
        );
      }

      if (values.density) {
        applyDensity(values.density);
      }
    },
    [
      applyTheme,
      applyPrimaryColor,
      applyDensity,
    ]
  );

  const reset = useCallback(() => {
    const defaults =
      structuredClone(initialSettings);

    setSettings(defaults);

    applyTheme(defaults.theme);
    applyPrimaryColor(
      defaults.primaryColor
    );
    applyDensity(defaults.density);
  }, [
    applyTheme,
    applyPrimaryColor,
    applyDensity,
  ]);

  return {
    settings,

    update,
    reset,

    setTheme,
    setPrimaryColor,
    setDensity,

    handleInputChange,
    handleSwitchChange,
  };
}