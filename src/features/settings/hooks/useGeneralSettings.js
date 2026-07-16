import { useCallback, useMemo, useState } from "react";

import { generalSettings as initialSettings } from "../data/settingsData";

export default function useGeneralSettings() {
  const [settings, setSettings] = useState(initialSettings);

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

  const hasLogo = useMemo(
    () => Boolean(settings.businessLogo),
    [settings.businessLogo]
  );

  return {
    settings,

    hasLogo,
    
    update,
    reset,

    handleInputChange,
    handleLogoChange,
    removeLogo,
  };
}