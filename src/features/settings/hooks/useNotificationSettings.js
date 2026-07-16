import { useCallback, useState } from "react";

import {
  notificationSettings as initialSettings,
} from "../data/settingsData";

export default function useNotificationSettings() {
  const [settings, setSettings] = useState(() =>
    structuredClone(initialSettings)
  );

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

    update,
    reset,

    handleSwitchChange,
  };
}