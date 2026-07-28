const { z } = require("zod");
const { paginationQuerySchema } = require("./common.validator");

const listPurchaseOrdersQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().optional(),
  supplierId: z.coerce.number().int().positive().optional(),
  status: z
    .enum(["Draft", "Submitted", "Approved", "Received", "PartiallyReceived", "Cancelled"])
    .optional(),
  sortBy: z.enum(["orderDate", "grandTotal", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

const poItemSchema = z.object({
  productId: z.coerce.number().int().positive(),
  quantityOrdered: z.coerce.number().int().positive(),
  unitCost: z.coerce.number().nonnegative(),
});

const createPurchaseOrderSchema = z.object({
  supplierId: z.coerce.number().int().positive("Select a supplier."),
  items: z.array(poItemSchema).min(1, "At least one item is required."),
  expectedDate: z.string().trim().optional(),
  notes: z.string().trim().max(2000).optional(),
});

const updatePurchaseOrderSchema = createPurchaseOrderSchema.partial();

const updateStatusSchema = z.object({
  status: z.enum(["Draft", "Submitted", "Approved", "Cancelled"]),
});

const receiveItemSchema = z.object({
  purchaseOrderItemId: z.coerce.number().int().positive(),
  quantityReceived: z.coerce.number().int().positive(),
});

const receivePurchaseOrderSchema = z.object({
  items: z.array(receiveItemSchema).min(1, "At least one received item is required."),
});

module.exports = {
  listPurchaseOrdersQuerySchema,
  createPurchaseOrderSchema,
  updatePurchaseOrderSchema,
  updateStatusSchema,
  receivePurchaseOrderSchema,
};