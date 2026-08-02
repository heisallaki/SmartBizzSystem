const { z } = require("zod");
const { paginationQuerySchema } = require("./common.validator");

const dateKeySchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format.");

const listExpensesQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  supplierId: z.coerce.number().int().positive().optional(),
  paymentMethod: z.enum(["Cash", "M-Pesa", "Card", "Bank Transfer"]).optional(),
  startDate: dateKeySchema.optional(),
  endDate: dateKeySchema.optional(),
  sortBy: z.enum(["expenseDate", "amount", "createdAt"]).default("expenseDate"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

const createExpenseSchema = z.object({
  expenseCategoryId: z.coerce.number().int().positive("Category is required."),
  supplierId: z.coerce.number().int().positive().optional(),
  description: z.string().trim().min(1, "Description is required.").max(255),
  amount: z.coerce.number().positive("Amount must be greater than zero."),
  expenseDate: dateKeySchema.optional(),
  paymentMethod: z.enum(["Cash", "M-Pesa", "Card", "Bank Transfer"]),
  receiptUrl: z.string().trim().max(500).optional(),
});

const updateExpenseSchema = createExpenseSchema.partial();

const createExpenseCategorySchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(100),
  description: z.string().trim().max(255).optional(),
});

module.exports = {
  listExpensesQuerySchema,
  createExpenseSchema,
  updateExpenseSchema,
  createExpenseCategorySchema,
};