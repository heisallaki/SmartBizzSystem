import { useCallback, useState } from "react";

import {
  passwordState as initialPasswordState,
  passwordVisibility as initialPasswordVisibility,
  securitySettings as initialSettings,
} from "../data/settingsData";

export default function useSecuritySettings() {
  const [settings, setSettings] = useState(() =>
    structuredClone(initialSettings)
  );

  const [passwords, setPasswords] = useState(() =>
    structuredClone(initialPasswordState)
  );

  const [showPasswords, setShowPasswords] = useState(() =>
    structuredClone(initialPasswordVisibility)
  );

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;

    setSettings((previous) => ({
      ...previous,
      [name]: value,
    }));
  }, []);

  const handleProfileChange = useCallback((event) => {
    const { name, value } = event.target;

    setSettings((previous) => ({
      ...previous,
      profile: {
        ...previous.profile,
        [name]: value,
      },
    }));
  }, []);

  const handleSwitchChange = useCallback((event) => {
    const { name, checked } = event.target;

    setSettings((previous) => ({
      ...previous,
      [name]: checked,
    }));
  }, []);

  const handlePasswordChange = useCallback((event) => {
    const { name, value } = event.target;

    setPasswords((previous) => ({
      ...previous,
      [name]: value,
    }));
  }, []);

  const togglePasswordVisibility = useCallback((field) => {
    setShowPasswords((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  }, []);

  const handlePermissionChange = useCallback(
    (module, permission, checked) => {
      setSettings((previous) => ({
        ...previous,
        roles: previous.roles.map((role) =>
          role.module === module
            ? {
                ...role,
                [permission]: checked,
              }
            : role
        ),
      }));
    },
    []
  );

  const clearPasswords = useCallback(() => {
    setPasswords(structuredClone(initialPasswordState));

    setShowPasswords(
      structuredClone(initialPasswordVisibility)
    );
  }, []);

  const update = useCallback((values) => {
    setSettings((previous) => ({
      ...previous,
      ...values,
    }));
  }, []);

  const reset = useCallback(() => {
    setSettings(structuredClone(initialSettings));
    clearPasswords();
  }, [clearPasswords]);

  return {
    settings,
    passwords,
    showPasswords,

    update,
    reset,

    clearPasswords,

    handleInputChange,
    handleProfileChange,
    handleSwitchChange,
    handlePasswordChange,
    togglePasswordVisibility,
    handlePermissionChange,
  };
}