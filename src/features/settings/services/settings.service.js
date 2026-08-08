import settingsData, {
  appearanceSettings,
  backupSettings,
  businessSettings,
  generalSettings,
  notificationSettings,
  securitySettings,
} from "../data/settingsData";

import businessSettingsService from "./businessSettings.service";
import notificationPreferencesService from "./notificationPreferences.service";

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
  const real = await businessSettingsService.getBusinessSettings();

  return {
    ...clone(generalSettings),
    businessName: real.businessName,
    businessEmail: real.businessEmail,
    businessPhone: real.businessPhone,
    businessAddress: real.addressLine,
    businessLogo: real.logoUrl,
    currency: real.currencyCode,
  };
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
  const real = await notificationPreferencesService.getNotificationPreferences();

  return {
    ...clone(notificationSettings),
    systemNotifications: real.systemNotifications,
    salesAlerts: real.salesAlerts,
    lowStockAlerts: real.lowStockAlerts,
  };
}

export async function getBusinessSettings() {
  const real = await businessSettingsService.getBusinessSettings();

  return {
    ...clone(businessSettings),
    taxRate: real.defaultTaxRate,
    receiptFooter: real.receiptFooterText,
  };
}

export async function getBackupSettings() {
  await delay();

  return clone(backupSettings);
}

export async function saveGeneralSettings(data) {
  const saved = await businessSettingsService.updateBusinessSettings({
    businessName: data.businessName,
    businessEmail: data.businessEmail,
    businessPhone: data.businessPhone,
    addressLine: data.businessAddress,
    logoUrl: data.businessLogo,
    currencyCode: data.currency,
  });

  return {
    ...clone(data),
    businessName: saved.businessName,
    businessEmail: saved.businessEmail,
    businessPhone: saved.businessPhone,
    businessAddress: saved.addressLine,
    businessLogo: saved.logoUrl,
    currency: saved.currencyCode,
  };
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
  const saved = await notificationPreferencesService.updateNotificationPreferences({
    systemNotifications: data.systemNotifications,
    salesAlerts: data.salesAlerts,
    lowStockAlerts: data.lowStockAlerts,
  });

  return {
    ...clone(data),
    systemNotifications: saved.systemNotifications,
    salesAlerts: saved.salesAlerts,
    lowStockAlerts: saved.lowStockAlerts,
  };
}

export async function saveBusinessSettings(data) {
  const saved = await businessSettingsService.updateBusinessSettings({
    defaultTaxRate: data.taxRate,
    receiptFooterText: data.receiptFooter,
  });

  return {
    ...clone(data),
    taxRate: saved.defaultTaxRate,
    receiptFooter: saved.receiptFooterText,
  };
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