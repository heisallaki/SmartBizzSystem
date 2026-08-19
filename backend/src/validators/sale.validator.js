const { z } = require("zod");
const { paginationQuerySchema } = require("./common.validator");

const listSalesQuerySchema = paginationQuerySchema.extend({
  status: z.enum(["Completed", "Pending", "Cancelled"]).optional(),
  sortBy: z.enum(["saleDate", "grandTotal", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

const saleItemSchema = z.object({
  productId: z.coerce.number().int().positive(),
  sku: z.string().trim().min(1),
  name: z.string().trim().min(1),
  price: z.coerce.number().nonnegative(),
  quantity: z.coerce.number().int().positive(),
  discount: z.coerce.number().nonnegative().default(0),
});

const saleSchema = z.object({
  customerId: z.string().trim().default("walk-in"),
  items: z.array(saleItemSchema).min(1, "At least one item is required."),
  discount: z.coerce.number().nonnegative().default(0),
  taxRate: z.coerce.number().nonnegative().default(16),
  paymentMethod: z.enum(["Cash", "M-Pesa", "Card", "Bank Transfer"]),
  status: z.enum(["Completed", "Pending", "Cancelled"]).default("Completed"),
  notes: z.string().trim().max(2000).optional(),
});

module.exports = {
  listSalesQuerySchema,
  createSaleSchema: saleSchema,
  updateSaleSchema: saleSchema,
};