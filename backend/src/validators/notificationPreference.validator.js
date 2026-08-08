const { z } = require("zod");

const updateNotificationPreferencesSchema = z.object({
  systemNotifications: z.boolean().optional(),
  salesAlerts: z.boolean().optional(),
  lowStockAlerts: z.boolean().optional(),
});

module.exports = { updateNotificationPreferencesSchema };