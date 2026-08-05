const { z } = require("zod");
const { paginationQuerySchema } = require("./common.validator");

const dateKeySchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format.");

const listAuditLogsQuerySchema = paginationQuerySchema.extend({
  userId: z.coerce.number().int().positive().optional(),
  entityType: z.string().trim().optional(),
  action: z.string().trim().optional(),
  startDate: dateKeySchema.optional(),
  endDate: dateKeySchema.optional(),
});

module.exports = { listAuditLogsQuerySchema };