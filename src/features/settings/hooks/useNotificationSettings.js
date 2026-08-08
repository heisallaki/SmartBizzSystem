import { useCallback, useEffect, useState } from "react";

import { notificationSettings as initialSettings } from "../data/settingsData";
import * as settingsService from "../services/settings.service";

export default function useNotificationSettings() {
  const [settings, setSettings] = useState(() => structuredClone(initialSettings));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadSettings = async () => {
      try {
        const data = await settingsService.getNotificationSettings();
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

  const handleSwitchChange = useCallback((event) => {
    const { name, checked } = event.target;

    setSettings((previous) => ({
      ...previous,
      [name]: checked,
    }));
  }, []);

  const update = useCallback((values) => {
    setSettings((previous) => ({
      ...previous,
      ...values,
    }));
  }, []);

  const reset = useCallback(() => {
    setSettings(structuredClone(initialSettings));
  }, []);

  return {
    settings,
    loading,

    update,
    reset,

    handleSwitchChange,
  };
}