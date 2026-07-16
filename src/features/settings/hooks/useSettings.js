import { useCallback, useMemo, useRef, useState } from "react";

import {
  dialogState as initialDialogs,
} from "../data/settingsData";

import * as settingsService from "../services/settings.service";

import useAppearanceSettings from "./useAppearanceSettings";
import useBackupSettings from "./useBackupSettings";
import useBusinessSettings from "./useBusinessSettings";
import useGeneralSettings from "./useGeneralSettings";
import useNotificationSettings from "./useNotificationSettings";
import useSecuritySettings from "./useSecuritySettings";

export default function useSettings() {
  const general = useGeneralSettings();
  const appearance = useAppearanceSettings();
  const security = useSecuritySettings();
  const notifications = useNotificationSettings();
  const business = useBusinessSettings();
  const backup = useBackupSettings();

  const [loading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [dialogs, setDialogs] = useState(() =>
    structuredClone(initialDialogs)
  );

  const [activeSection, setActiveSection] =
    useState("general");

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const settings = useMemo(
    () => ({
      general: general.settings,
      appearance: appearance.settings,
      security: security.settings,
      notifications: notifications.settings,
      business: business.settings,
      backup: backup.settings,
    }),
    [
      general.settings,
      appearance.settings,
      security.settings,
      notifications.settings,
      business.settings,
      backup.settings,
    ]
  );

  const snapshotRef = useRef(
    JSON.stringify(settings)
  );

  const dirty =
    JSON.stringify(settings) !==
    snapshotRef.current;

  const openDialog = useCallback((dialog) => {
    setDialogs((previous) => ({
      ...previous,
      [dialog]: true,
    }));
  }, []);

  const closeDialog = useCallback((dialog) => {
    setDialogs((previous) => ({
      ...previous,
      [dialog]: false,
    }));
  }, []);

  const showSnackbar = useCallback(
    (message, severity = "success") => {
      setSnackbar({
        open: true,
        severity,
        message,
      });
    },
    []
  );

  const closeSnackbar = useCallback(() => {
    setSnackbar((previous) => ({
      ...previous,
      open: false,
    }));
  }, []);

  const selectImportFile = useCallback((file) => {
    setSelectedFile(file);
  }, []);

  const clearImportFile = useCallback(() => {
    setSelectedFile(null);
  }, []);

  const saveSettings = useCallback(async () => {
    try {
      setSaving(true);

      await Promise.all([
        settingsService.saveGeneralSettings(
          general.settings
        ),
        settingsService.saveAppearanceSettings(
          appearance.settings
        ),
        settingsService.saveSecuritySettings(
          security.settings
        ),
        settingsService.saveNotificationSettings(
          notifications.settings
        ),
        settingsService.saveBusinessSettings(
          business.settings
        ),
        settingsService.saveBackupSettings(
          backup.settings
        ),
      ]);

      snapshotRef.current =
        JSON.stringify(settings);

      showSnackbar(
        "Settings saved successfully."
      );
    } catch {
      showSnackbar(
        "Failed to save settings.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  }, [
    settings,
    general.settings,
    appearance.settings,
    security.settings,
    notifications.settings,
    business.settings,
    backup.settings,
    showSnackbar,
  ]);

  return {
    settings,

    general,
    appearance,
    security,
    notifications,
    business,
    backup,

    loading,
    saving,
    dirty,

    dialogs,

    snackbar,

    activeSection,
    selectedFile,

    setActiveSection,

    openDialog,
    closeDialog,

    showSnackbar,
    closeSnackbar,

    selectImportFile,
    clearImportFile,

    saveSettings,
  };
}