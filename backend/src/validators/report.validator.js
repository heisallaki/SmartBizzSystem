const { z } = require("zod");

const dateKeySchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format.");

const reportsQuerySchema = z
  .object({
    startDate: dateKeySchema,
    endDate: dateKeySchema,
  })
  .refine((value) => value.startDate <= value.endDate, {
    message: "startDate must not be after endDate.",
    path: ["startDate"],
  });

module.exports = { reportsQuerySchema };