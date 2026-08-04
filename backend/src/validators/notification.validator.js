const { z } = require("zod");
const { paginationQuerySchema } = require("./common.validator");

const listNotificationsQuerySchema = paginationQuerySchema.extend({
  isRead: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
});

module.exports = { listNotificationsQuerySchema };