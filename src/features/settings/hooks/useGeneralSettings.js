import { useCallback, useEffect, useMemo, useState } from "react";

import { generalSettings as initialSettings } from "../data/settingsData";
import * as settingsService from "../services/settings.service";

export default function useGeneralSettings() {
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadSettings = async () => {
      try {
        const data = await settingsService.getGeneralSettings();
        if (active) setSettings(data);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadSettings();

    return () => {
      active = false;
    };
  }, []);

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;

    setSettings((previous) => ({
      ...previous,
      [name]: value,
    }));
  }, []);

  const handleLogoChange = useCallback((file) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      setSettings((previous) => ({
        ...previous,
        businessLogo: event.target?.result ?? "",
      }));
    };

    reader.readAsDataURL(file);
  }, []);

  const removeLogo = useCallback(() => {
    setSettings((previous) => ({
      ...previous,
      businessLogo: "",
    }));
  }, []);

  const reset = useCallback(() => {
    setSettings(initialSettings);
  }, []);

  const update = useCallback((values) => {
    setSettings((previous) => ({
      ...previous,
      ...values,
    }));
  }, []);

  const hasLogo = useMemo(() => Boolean(settings.businessLogo), [settings.businessLogo]);

  return {
    settings,
    loading,

    hasLogo,

    update,
    reset,

    handleInputChange,
    handleLogoChange,
    removeLogo,
  };
}