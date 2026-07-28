const { z } = require("zod");
const { paginationQuerySchema } = require("./common.validator");

const listInvoicesQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().optional(),
  customerId: z.string().trim().optional(), // customerCode, e.g. "CUS-1001"
  status: z.enum(["Unpaid", "PartiallyPaid", "Paid", "Overdue", "Void"]).optional(),
  sortBy: z.enum(["issueDate", "dueDate", "grandTotal", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Generates an invoice document from an already-Completed sale, copying its
// totals and line items. dueInDays defaults to 30 (standard net-30 terms).
const createFromSaleSchema = z.object({
  saleId: z.coerce.number().int().positive(),
  dueInDays: z.coerce.number().int().nonnegative().default(30),
  notes: z.string().trim().max(2000).optional(),
});

const invoiceLineItemSchema = z.object({
  productId: z.coerce.number().int().positive().optional(),
  description: z.string().trim().min(1, "Description is required.").max(255),
  quantity: z.coerce.number().int().positive().default(1),
  unitPrice: z.coerce.number().nonnegative(),
});

// For a standalone B2B invoice not tied to any POS sale.
const createStandaloneSchema = z.object({
  customerId: z.string().trim().min(1, "Select a customer."), // customerCode
  items: z.array(invoiceLineItemSchema).min(1, "At least one line item is required."),
  issueDate: z.string().trim().optional(),
  dueInDays: z.coerce.number().int().nonnegative().default(30),
  notes: z.string().trim().max(2000).optional(),
});

const updateInvoiceSchema = z.object({
  dueDate: z.string().trim().optional(),
  notes: z.string().trim().max(2000).optional(),
  items: z.array(invoiceLineItemSchema).min(1).optional(),
});

const recordPaymentSchema = z.object({
  amount: z.coerce.number().positive("Payment amount must be greater than zero."),
  method: z.enum(["Cash", "M-Pesa", "Card", "Bank Transfer"]),
  referenceCode: z.string().trim().max(100).optional(),
});

module.exports = {
  listInvoicesQuerySchema,
  createFromSaleSchema,
  createStandaloneSchema,
  updateInvoiceSchema,
  recordPaymentSchema,
};