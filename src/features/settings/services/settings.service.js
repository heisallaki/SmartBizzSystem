import settingsData, {
  appearanceSettings,
  backupSettings,
  businessSettings,
  generalSettings,
  notificationSettings,
  securitySettings,
} from "../data/settingsData";

const NETWORK_DELAY = 500;

const delay = (ms = NETWORK_DELAY) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const clone = (data) => structuredClone(data);

export async function getSettings() {
  await delay();

  return clone(settingsData);
}

export async function getGeneralSettings() {
  await delay();

  return clone(generalSettings);
}

export async function getAppearanceSettings() {
  await delay();

  return clone(appearanceSettings);
}

export async function getSecuritySettings() {
  await delay();

  return clone(securitySettings);
}

export async function getNotificationSettings() {
  await delay();

  return clone(notificationSettings);
}

export async function getBusinessSettings() {
  await delay();

  return clone(businessSettings);
}

export async function getBackupSettings() {
  await delay();

  return clone(backupSettings);
}

export async function saveGeneralSettings(data) {
  await delay();

  return clone(data);
}

export async function saveAppearanceSettings(data) {
  await delay();

  return clone(data);
}

export async function saveSecuritySettings(data) {
  await delay();

  return clone(data);
}

export async function saveNotificationSettings(data) {
  await delay();

  return clone(data);
}

export async function saveBusinessSettings(data) {
  await delay();

  return clone(data);
}

export async function saveBackupSettings(data) {
  await delay();

  return clone(data);
}

export async function exportSettings(data) {
  await delay();

  return clone(data);
}

export async function importSettings(data) {
  await delay();

  return clone(data);
}

export async function createBackup(data) {
  await delay();

  return {
    createdAt: new Date().toISOString(),
    data: clone(data),
  };
}

export async function restoreBackup(backup) {
  await delay();

  return clone(backup.data);
}

export async function resetDemoData() {
  await delay();

  return clone(settingsData);
}

const settingsService = {
  getSettings,
  getGeneralSettings,
  getAppearanceSettings,
  getSecuritySettings,
  getNotificationSettings,
  getBusinessSettings,
  getBackupSettings,

  saveGeneralSettings,
  saveAppearanceSettings,
  saveSecuritySettings,
  saveNotificationSettings,
  saveBusinessSettings,
  saveBackupSettings,

  exportSettings,
  importSettings,

  createBackup,
  restoreBackup,

  resetDemoData,
};

export default settingsService;