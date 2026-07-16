import * as settingsService from "./settings.service";

export async function saveSettings(settings) {
  await Promise.all([
    settingsService.saveGeneralSettings(
      settings.general
    ),

    settingsService.saveAppearanceSettings(
      settings.appearance
    ),

    settingsService.saveSecuritySettings(
      settings.security
    ),

    settingsService.saveNotificationSettings(
      settings.notifications
    ),

    settingsService.saveBusinessSettings(
      settings.business
    ),

    settingsService.saveBackupSettings(
      settings.backup
    ),
  ]);

  return settings;
}


export async function exportSettings(settings) {
  return settingsService.exportSettings(settings);
}


export async function importSettings(file) {
  const text = await file.text();

  const data = JSON.parse(text);

  return settingsService.importSettings(data);
}


export async function createBackup(settings) {
  return settingsService.createBackup(settings);
}


export async function restoreBackup(backup) {
  return settingsService.restoreBackup(backup);
}


export async function resetDemoData() {
  return settingsService.resetDemoData();
}