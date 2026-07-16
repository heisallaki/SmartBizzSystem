import { useCallback, useState } from "react";

import {
  backupSettings as initialSettings,
} from "../data/settingsData";

export default function useBackupSettings() {
  const [settings, setSettings] = useState(() =>
    structuredClone(initialSettings)
  );

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;

    setSettings((previous) => ({
      ...previous,
      [name]: value,
    }));
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

    update,
    reset,

    handleInputChange,
    handleSwitchChange,
  };
}