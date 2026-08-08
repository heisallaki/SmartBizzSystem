const { getSetting, setSetting } = require("./systemSetting.service");

const PREFERENCES_KEY = "notification_preferences";

const DEFAULT_PREFERENCES = {
  systemNotifications: true,
  salesAlerts: true,
  lowStockAlerts: true,
};

async function getNotificationPreferences() {
  const value = await getSetting(PREFERENCES_KEY, DEFAULT_PREFERENCES);
  return { ...DEFAULT_PREFERENCES, ...value };
}

async function updateNotificationPreferences(data, actorId) {
  const current = await getNotificationPreferences();

  const updated = {
    ...current,
    ...(data.systemNotifications !== undefined && {
      systemNotifications: data.systemNotifications,
    }),
    ...(data.salesAlerts !== undefined && { salesAlerts: data.salesAlerts }),
    ...(data.lowStockAlerts !== undefined && { lowStockAlerts: data.lowStockAlerts }),
  };

  await setSetting(PREFERENCES_KEY, updated, actorId);

  return updated;
}

module.exports = {
  DEFAULT_PREFERENCES,
  getNotificationPreferences,
  updateNotificationPreferences,
};